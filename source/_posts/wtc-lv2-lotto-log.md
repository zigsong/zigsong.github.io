---
title: 우테코 Lv2 lotto 학습로그
date: 2021-04-21 08:49:49
tags: woowacourse
thumbnailImage: https://i.imgur.com/frkONDC.jpg
---

우테코 Lv2 lotto 학습로그

<!-- more -->

---

- [PR-Step1 바로가기](https://github.com/woowacourse/react-lotto/pull/15#issuecomment-826063722)
- [PR-Step2 바로가기](https://github.com/woowacourse/react-lotto/pull/21#issuecomment-826063792)

# 1️⃣ Step1

---

## setState의 비동기성

React는 성능을 위해 여러 `setState()` 호출을 단일 업데이트로 한꺼번에 처리한다. `setState()`로 state를 변경할 때마다 리렌더링이 발생하기 때문에, 최적화를 위해 여러 `setState()` 호출들을 하나로 묶어 하나의 이벤트가 끝나는 시점에 일괄적으로 업데이트를 수행하는 것이다.

동기적인 상태의 업데이트를 위해서는 `setState()`에 객체 대신 함수를 인자로 사용한다.

우선 일반적인 형태의 `setState` 호출이다.

```jsx
this.setState({ count: this.state.count + 1 });
```

이를 updater 함수로 변경하여 아래와 같이 작성할 수 있다.

```jsx
this.setState((state) => count: state.count + 1);
```

함수를 인자로 넘기는 경우 역시 `setState()`는 비동기적으로 동작하지만, 인자로 넘겨 받는 함수들이 queue에 저장되어 순서대로 실행되기 때문에 `state`의 정상적인 업데이트가 보장된다. 즉 함수를 실행하고, 업데이트된 `state`가 다음 함수의 인자로 들어가기 때문에 다음 `setState()` 호출은 최신 상태의 `state` 값을 가지고 업데이트를 수행할 수 있다.

👾 초기에는 `setState`가 비동기로 되어 있지 않았기 때문에 `setState()`의 인자로 객체를 넣어도 동기적인 상태의 업데이트가 가능했으나, 이후 `setState()`는 동기적 업데이트를 보장할 수 없게 되었다. 다만 기존의 컨셉을 어느 정도 유지하기 위해 `setState()`에 객체를 넘기는 형태가 일반적으로 사용되고 있다.

`setState`의 두 번째 인자로 콜백을 넘기는 경우도 있다.

```jsx
setState(updater[, callback])
```

`updater` 함수가 실행된 후 callback을 실행한다.
이번 미션에서는 `price`가 업데이트된 후 `createLottos`를 실행하도록 했다.

```jsx
this.setState({ price }, this.createLottos);
```

**Ref**

- https://ko.reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
- https://medium.com/@devych.code/react-setstate는-비동기-작동한다-b045737c9e41
- https://leehwarang.github.io/2020/07/28/setState.html

---

## 기타

### styled-components 확장하기

styled-components로 선언한 컴포넌트를 `styled`의 인자로 넣어 마치 내용을 확장한 것처럼 사용할 수 있다.

```jsx
const Flex = styled.div`
  display: flex;
`;
Flex.Center = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Stack = styled(Flex)`
  flex-direction: column;
`;
```

### `padStart`

현재 문자열의 시작을 다른 문자열로 채워, 주어진 길이를 만족하는 새로운 문자열을 반환한다.

```jsx
String(this.state.minutes).padStart(2, "0");
```

**Ref**
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/padStart

### state는 어디에?

앱의 모든 상태를 `App.js`가 갖고 있는 것은 좋지 않다. 컴포넌트별로, 사용하는 곳과 가장 가까운 곳에 state를 배치하는 것이 좋다.

---

# 2️⃣ Step2

## useRef

`useRef`는 DOM element를 조작하는 경우가 아닐 때에도 사용할 수 있다.

`useRef`로 생성한 객체는 컴포넌트의 전 생애주기를 통해 유지된다. 이 객체는 렌더링을 할 때 동일한 ref 객체를 제공한다.
따라서 컴포넌트의 전 생애주기를 통해 유지되는 값에 사용한다. 앱의 플로우 상 변화가 거의 발생하지 않거나, 잦은 변화가 발생하지만 그때마다 컴포넌트를 리렌더링하지 않아야 하는 경우에 사용하면 좋다.

```jsx
const refContainer = useRef(initialValue);
```

`useRef`는 `.current` 프로퍼티에 변경 가능한 값을 담고 있는 “상자”와 같다. class의 instance 필드를 사용하는 것과 유사하게, 가변값을 유지하는 데 사용할 수 있다.

```jsx
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;

    return () => {
      clearInterval(intervalRef.current);
    };
  });
  // ...
}
```

**👾 왜 ref가 아닌 .current를 쓸까?**
`useRef()`도 클로저를 리턴하는데, 이때 한번 생성된 ref의 내부값을 변경할 수가 없다. 하지만 객체로 생성된 `useRef` 객체의 프로퍼티 값인 `ref.current`값은 변경이 가능하기 때문에 `.current`를 사용한다.

**Ref**

- https://ko.reactjs.org/docs/hooks-reference.html#useref
- https://ko.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
- https://woowacourse.github.io/javable/post/2021-05-15-react-ref/

---

## useEffect 안에서 비동기 함수 호출하기

`useEffect`의 두 번째 인자인 dependency에 아무 값도 넣어주지 않으면, 컴포넌트가 마운트될 때 `timer`를 세팅해주고 1초마다 시간을 갱신해준다.

```jsx
const [currentTime, setCurrentTime] = useState({ minutes: 10, seconds: 0 });

useEffect(() => {
  const timer = setInterval(() => timePass(), 1000);
  const { minutes, seconds } = currentTime;

  if (minutes === 0 && seconds === 0) clearInterval(timer);

  return () => clearInterval(timer);
});
```

---

## 기타

### React 컴포넌트 관리 방법

- 앱의 확장성을 고려하여 **재사용** 가능한 컴포넌트 분리하기
- 컴포넌트를 **말랑말랑하게** 만드는 것이 좋다. 컴포넌트가 받는 `props`에 따라서 상황에 맞는 일을 해줄 수 있어야 한다.
- 기능과 레이아웃(presentational, container) 컴포넌트를 분리하는 방법도 있다.
- 컴포넌트는 독립적인 단위모듈이어야 한다. 즉 컴포넌트는 해당 기능에 대해서 독립적으로 수행이 될 수 있고, 새로운 모듈로 교환될 수 있어야 한다.

**Ref**
https://jeonghwan-kim.github.io/dev/2020/01/28/component-design.html
[https://vallista.kr/2020/03/29/Component-%EB%B6%84%EB%A6%AC%EC%9D%98-%EB%AF%B8%ED%95%99](https://vallista.kr/2020/03/29/Component-분리의-미학)
