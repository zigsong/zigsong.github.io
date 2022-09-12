---
title: React의 setState에 await을 붙이면?
date: 2021-10-16 18:14:08
tags: react
---

React의 setState에 await을 붙이면?

<!-- more -->

<img src="/images/thumbnails/react-thumbnail.png" />

---

한번도 생각해본 적 없었는데, 페어 미키가 어느 회사🥕 면접을 보고온 후 나온 질문인데 신기하다며 알려준 내용. `setState`에 `await`을 붙이면 `setState`가 동기적으로 동작한다? 🤔

리액트 컴포넌트는 일반적으로 하나의 이벤트 핸들러 함수 호출의 내부에서 동작하는 `setState` 메서드들을 모두 모아 한번에 업데이트를 수행한다(batch). 이는 렌더링 횟수를 줄여 최적화를 위한 것이다. 그리고 만약 `setState`가 여러번 호출되는 함수에서 첫 번째 `setState` 호출이 바로 상태 업데이트를 수행한다면, 컴포넌트가 리렌더링되어 다음 줄의 `setState`는 실행되지 않을 것이다.

따라서 아래와 같이 같은 `state`를 참조하는 `setState`를 여러번 호출하면 원하는 대로 값이 업데이트되지 않는다. `setState`의 동기적인 리액트에서 `state`의 업데이트가 비동기적일 수 있다고 하는 이유다.

```jsx
export default class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { count: 0 };
  }

  decrease = async () => {
    this.setState({ count: this.state.count - 1 });
    console.log(this.state.count);
    this.setState({ count: this.state.count - 1 });
    console.log(this.state.count);
    this.setState({ count: this.state.count - 1 });
    console.log(this.state.count);
  };

  increase = async () => {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
  };

  render() {
    return (
      <div className="container">
        <span className="count">{this.state.count}</span>
        <div className="btn-group">
          <button onClick={this.decrease.bind(this)}>
            <strong>-</strong>
          </button>
          <button>
            <strong>RESET</strong>
          </button>
          <button onClick={this.increase.bind(this)}>
            <strong>+</strong>
          </button>
        </div>
      </div>
    );
  }
}
```

<img src="01.gif" />

`decrease`와 `increase`에서 발생하는 3번의 `setState` 호출들은 모두 업데이트 이전의 동일한 `count` 값을 참조하고 있기 때문에, 3씩 커지거나 작아지지 않는다.

그런데 `setState` 앞에 `await`을 붙인다고 한들 뭐가 될까?

```jsx
increase = async () => {
  await this.setState({ count: this.state.count + 1 });
  console.log(this.state.count);
  await this.setState({ count: this.state.count + 1 });
  console.log(this.state.count);
  await this.setState({ count: this.state.count + 1 });
  console.log(this.state.count);
};
// decrease도 마찬가지
```

정말 될까?

<img src="02.gif" />

진짜 된다! 😮 한번에 3씩 값이 바뀐다.

동작하는 이유를 미키와 함께 의논해 보았다. (사실 거의 미키의 생각들이다! 정리해놨지만 확실하게는 잘 모르겠다.)

리액트 컴포넌트에서 `async-await`은 바벨에 의해 generator 함수로 바뀌게 된다. ([블로그 이전 포스팅 참고](https://zigsong.github.io/2021/09/05/babel-almost/#🤔-추가-Babel에서-Promise를-처리하는-방식)) generator 함수는 `yield`를 사용하는데, `yield`는 실행 권한을 제너레이터 함수의 호출자에게 넘긴다. 따라서 클래스 컴포넌트의 렌더링 여부와 상관없이 두 번째, 세 번째 `setState`의 연속적인 호출은 독립적으로 작동하게 된다. `setState`가 `async-await`로 작동하는 것”처럼” 보이게 되는 것이다.

> 👾 이 놀라운(?) 동작은 클래스 컴포넌트에서만 가능하다! 함수 컴포넌트의 `useState` hook에서는 stale closure 문제가 발생하기 때문이다.

```jsx
const Counter = () => {
  const [count, setCount] = useState(0);

  const increase = async () => {
    await setCount(count + 1);
    await setCount(count + 1);
    await setCount(count + 1);
  };

  // const decrease = async () => ...

  return (
    // ...
  )
}
```

`useState`는 매번 새로운 클로저를 생성한다. 내부 구현은 아래 코드와 같은 느낌? (코드 출처: [지그의 Virtual DOM 미션](https://github.com/woowacourse/javascript-own-ui-library/pull/7)을 변형)

```jsx
const React = (function () {
  // stale closure
  let _value;

  const useState = (initialValue) => {
    _value = _value || initialValue;

    const setState = (newValue) => {
      _value = newValue;
    };

    return [getState, setState];
  };
})();
```

각 `setState` 호출에 `await`을 붙였다한들, `count`는 여전히 현재 렌더링된 컴포넌트에서 모두 기존의 값을 참조하고 있기 때문에 즉각적인 상태의 업데이트를 반영하지 못한다.

`await`을 사용한 `setState` 호출은 결국 아래와 같이 `Promise`를 사용한 `then` 체이닝으로 해석될 수 있다.

```jsx
const increase = async () => {
  Promise.resolve(
    setCount(count + 1)
      .then(() => setCount(count + 1))
      .then(() => setCount(count + 1))
  );
};
```

`then` 체이닝의 콜백으로 들어간 `setCount` 호출 함수는 비동기로 동작하기 때문에 마이크로태스크 큐에 담긴다. 이 비동기 콜백들은 자바스크립트 실행 환경에서 콜스택이 모두 빈 후에 호출되기 때문에, 결론적으로 함수 컴포넌트의 렌더링 이후에 동작한다. 이때 `then` 체이닝 내의 콜백들이 가리키는 `count` 값은 `+1`로 갱신된 값이 아닌, 함수 컴포넌트 가장 초기의 값을 그대로 가지고 있다.

함수 컴포넌트는 렌더링될 때마다 매번 재생성되기 때문에 stale closure 문제가 발생하지만, 클래스 컴포넌트의 경우에는 한 번 생성된 인스턴스를 재사용하기 때문에 `await`을 붙인 `setState`의 동기적 실행이 가능하다.

하지만 어쨌든 간에, `setState` 함수는 Promise를 반환하는 함수가 아니기 때문에 `await`을 사용하는 것은 좋지 않다. 굳이 사용하고 싶다면 아래와 같이 사용한다.

```jsx
updateState = () => {
  return new Promise((resolve, reject) => {
    this.setState(
      {
        count: this.state.count - 1,
      },
      () => {
        resolve("updated");
      }
    );
  });
};

decrease = async () => {
  await this.updateState();
  await this.updateState();
  await this.updateState();
};
```

---

**Ref**
https://muscardinus.tistory.com/196
https://hewonjeong.github.io/deep-dive-how-do-react-hooks-really-work-ko/
