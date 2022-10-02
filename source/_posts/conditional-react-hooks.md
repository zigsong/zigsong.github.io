---
title: react hook은 왜 조건문 안에서 쓰면 안 될까?
date: 2021-08-28 20:42:30
tags: react
thumbnailImage: https://i.imgur.com/stTzX5o.png
---

react hook은 왜 조건문 안에서 쓰면 안 될까?

<!-- more -->

---

[react 공식 문서](https://ko.reactjs.org/docs/hooks-rules.html#explanation)에 따르면 react hook을 사용하는 규칙 중 아래와 같은 내용이 있다.

> 최상위(at the Top Level)에서만 Hook을 호출해야 합니다

React는 Hook이 호출되는 순서에 의존하기 때문에 모든 렌더링에서 Hook의 호출 순서를 동일하게 보장해줘야고 한다는데, 이게 도통 무슨 말인지 알수가 없다.

`useState`와 `useEffect`를 직접 만들어 보면서 React의 Hook 호출 방식을 살펴보자.

---

## useState

클로저를 활용하여 `useState` 함수를 구현할 수 있다. `_value`의 형태로 함수 내부에 private한 변수를 정의하고, 해당 값을 리턴해주는 변수 `state`와 그 값을 변경시킬 수 있는 유일한 함수인 `setState`를 배열로 담아 리턴해준다.

```jsx
function useState(initialValue) {
  let _value = initialValue;

  const state = _value;
  const setState = (newValue) => {
    _value = newValue;
  };

  return [state, setState];
}

const [count, setCount] = useState(1);

console.log(count); // 1
setCount(2);
console.log(count); // 1
```

하지만 이렇게 해서는 `setCount` 호출 이후에도 값이 변하지 않는다. `count`는 `useState` 함수를 처음 호출할 때 한번 반환되고 끝나버린 값이기 때문이다.

따라서 내부에서 업데이트된 값을 가져올 수 있도록 `state`의 값을 함수 형태로 바꿔준다. 기존의 변수명 `state`는 함수로 사용하기 위해 getter 느낌을 살려 `getState`로 바꿔주었다.

```jsx
function useState(initialValue) {
  let _value = initialValue;

  // 호출할 때마다 값을 가져오기 위해 함수 형태로 사용
  const getState = () => _value;
  const setState = (newValue) => {
    _value = newValue;
  };

  return [getState, setState];
}

const [getState, setCount] = useState(1);

console.log(getState()); // 1
setCount(2);
console.log(getState()); // 2
```

이렇게 하면 외부에서 `useState` 함수 내부 변수인 `_value`의 값에 접근하거나 값을 변경할 수 있다. 이제 컴포넌트에 붙여보자! `MyReact`라는 가상의 리액트 모듈을 만들고, `render` 메서드를 통해 실제 DOM 렌더링을 대체했다.

```jsx
const MyReact = (function () {
  function useState(initialValue) {
    let _value = initialValue;

    const state = _value;
    const setState = (newValue) => {
      _value = newValue;
    };

    return [state, setState];
  }

  function render(Component) {
    const C = Component();
    C.render();
    return C;
  }

  return { useState, render };
})();

function Counter() {
  const [count, setCount] = MyReact.useState(1);

  return {
    render: () => console.log(count),
    click: () => setCount(count + 1),
  };
}

var App = MyReact.render(Counter); // 1
App.click();
var App = MyReact.render(Counter); // 1
```

여기서 `click` 전후의 `count`의 값은 초기값 그대로 변하지 않는다. `useState`를 호출할 때마다 내부 변수인 `_value`의 값이 다시 1로 초기화되기 때문이다. (`_value`를 가져오는 방식을 함수로 변경해도 마찬가지다.) `useState` 함수가 동일한 `_value` 값을 가리킬 수 있도록 `_value`의 위치를 MyReact 내부로 끌어올린다.

```jsx
const MyReact = (function () {
  let _value;

  function useState(initialValue) {
    const state = _value ||  initialValue;
    // ...
  }
```

하나의 컴포넌트 안에서 `_value`의 값이 유지되기 때문에 `useState`가 정상적으로 동작하는 것을 확인할 수 있다.

그렇다면 컴포넌트 안에 여러 개의 상태를 선언하고 싶다면 어떨까?

```jsx
function Component() {
  const [count, setCount] = MyReact.useState(1);
  const [text, setText] = MyReact.useState("apple");

  return {
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: (word) => setText(word),
  };
}

var App = MyReact.render(Component); // { count: 1, text: 'apple' }
App.click();
var App = MyReact.render(Component); // { count: 2, text: 2 }
App.type("banana");
var App = MyReact.render(Component); // { count: 'banana', text: 'banana' }
```

`count`와 `text` 두 가지로 선언한 상태값이 모두 동일한 값으로 덮어씌워진다! `count`와 `text` 모두 `MyReact` 컴포넌트 내의 같은 변수 `_value`에 저장하고 있기 때문이다.

여러 개의 상태가 독립적인 값을 유지하게끔 하기 위해 각 `state` 값을 배열에 담아 관리한다.

```jsx
const MyReact = (function () {
  let hooks = [];
  let idx = 0;

  function useState(initialValue) {
    const state = hooks[idx] || initialValue;
    const _idx = idx; // 이 hook이 사용해야 하는 인덱스를 붙잡아둔다.
    const setState = (newValue) => {
      hooks[_idx] = newValue;
    };
    idx++; // 다음 hook은 다른 인덱스를 사용하도록 한다.

    return [state, setState];
  }

  function render(Component) {
    idx = 0; // 렌더링 시 hook의 인덱스를 초기화한다.
    const C = Component();
    C.render();
    return C;
  }

  return { useState, render };
})();
```

하나의 컴포넌트 내 여러 개 생성된 상태들은 hooks라는 배열 안에서 각각의 독립적인 인덱스를 가지고 있고, 이 인덱스를 통해 자신의 상태 업데이트 이전의 값을 참조할 수 있다. 따라서 조건부로 hook이 호출되거나 loop 안에서 hook이 호출된다면 인덱스의 순서를 보장할 수 없고, 상태의 관리도 보장할 수 없다.

---

## useEffect

`useEffect`의 실행 방식은 아래와 같다. 사이드 이펙트를 실행하는 함수를 `useEffect`의 첫 번째 인자로 넘겨주고, 두 번째 인자로는 그 사이드 이펙트의 실행 여부를 결정할 의존성 배열을 넣어준다. 의존성 배열의 요소 중 하나라도 변경이 발생하면 `useEffect` 내의 사이드 이펙트가 실행된다.

```jsx
function Component() {
  const [count, setCount] = MyReact.useState(1);
  const [text, setText] = MyReact.useState("apple");

  MyReact.useEffect(() => {
    console.log("side effect");
  }, []);
}
```

앞서 만든 `MyReact` 모듈 안에 `useEffect` hook을 작성한다. 컴포넌트를 렌더링할 때마다 이미 저장되어 있는 의존성 배열의 값들과 새로운 의존성 배열의 값들을 비교하여 하나라도 다르다면 인자로 넘겨준 콜백 함수를 실행한다.

```jsx
const MyReact = (function() {
  let hooks = [];
  let idx = 0;

  function useEffect(cb, depsArray) {
    const oldDeps = hooks[idx]; // 이미 저장되어 있는 의존성 배열이 있는지 확인한다.
    let hasChanged = true;

    if (oldDeps) {
      hasChanged = depsArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }

    if (hasChanged) {
      cb();
    }

    hooks[idx] = depsArray;
    idx++;
  }

  // ...
}
```

> 👾 `Object.is`는 `===` 비교 연산자와 동일하지만, NaN, -0 및 +0에 대한 특수 처리를 수행하지 않는다.
>
> ```
> NaN === NaN; // false
> Object.is(NaN, NaN); // true
> +0 === -0; //true
> Object.is(+0, -0); // false
> ```

`useEffect`의 두 번째 인자로 넘겨주는 의존성 배열도 같은 컴포넌트 내에서 hooks 배열의 인덱스로 관리되고 있기 때문에, 호출 순서를 보장해야 한다.

---

## react hook을 조건문 안에서 쓰면 안 되는 이유

React는 hook이 호출되는 순서에 의존한다. 모든 렌더링에서 hook의 호출 순서는 같다고 보장되어야 한다. 이때 각각의 hook 호출이 이전의 hook 상태들 중 자신이 참조해야 할 값을 알 수 있는 방법은 바로 🔥**hook 호출의 순서**🔥에 달려있다.

hook을 조건부로 실행한다면, 렌더링 간에 hook을 건너 뛰기 때문에 hook의 호출 순서는 달라지고, hook의 호출이 하나씩 밀리면서 버그를 발생시킨다. 리액트 공식 문서의 다음 예제를 살펴보자. (편의를 위해 `useEffect`의 두 번째 인자로 빈 배열을 각각 추가해주었다.)

```jsx
function Form() {
  const [name, setName] = useState("Mary");

  useEffect(function persistForm() {
    localStorage.setItem("formData", name);
  }, []);

  const [surname, setSurname] = useState("Poppins");

  useEffect(function updateTitle() {
    document.title = name + " " + surname;
  }, []);

  // ...
}
```

모든 렌더링에서 hook의 호출 순서는 같기 때문에 위 예시는 올바르게 동작한다.

```jsx
// 첫 번째 렌더링
useState("Mary"); // 1. 'Mary'라는 name state 변수를 선언한다. -> hooks[0] = 'Mary'
useEffect(persistForm); // 2. 폼 데이터를 저장하기 위한 effect를 추가한다. -> hooks[1] = []
useState("Poppins"); // 3. 'Poppins'라는 surname state 변수를 선언한다. -> hooks[2] = 'Poppins'
useEffect(updateTitle); // 4. 제목을 업데이트하기 위한 effect를 추가한다. -> hooks[3] = []
// 두 번째 렌더링
useState("Mary"); // 1. name state 변수를 읽는다.(인자는 무시된다)  -> hooks[0] = 'Mary'
useEffect(persistForm); // 2. 폼 데이터를 저장하기 위한 effect가 대체된다. -> hooks[1] = []
useState("Poppins"); // 3. surname state 변수를 읽는다.(인자는 무시된다) -> hooks[2] = 'Poppins'
useEffect(updateTitle); // 4. 제목을 업데이트하기 위한 effect가 대체된다. -> hooks[3] = []
```

만약 hook의 호출이 다음과 같이 조건문 안에서 발생한다면,

```jsx
if (name !== "") {
  useEffect(function persistForm() {
    localStorage.setItem("formData", name);
  });
}
```

렌더링 간에 hook을 건너뛰면서 각 hook이 이전 값을 참조하는 과정에서 문제를 일으킨다.

```jsx
useState("Mary"); // 1. name state 변수를 읽는다. (인자는 무시된다) -> hooks[0] = 'Mary'의 값을 읽어온다
// useEffect(persistForm) // 🔴 Hook을 건너뛰었다!
useState("Poppins"); // 🔴 2 (3이었던). surname state 변수를 읽는 데 실패한다. -> hooks[1] = []의 값을 읽어온다.
useEffect(updateTitle); // 🔴 3 (4였던). 제목을 업데이트하기 위한 effect가 대체되는 데 실패한다. -> hooks[2] = 'Poppins'의 값을 읽어온다.
```

따라서 결론은, react hook의 규칙을 잘 지켜서 컴포넌트의 최상단에서 사용하도록 하자!

👾 `setState`의 로직을 state와 setter를 분리해서 생각한 [다음 글](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)도 참고해보면 좋다.

---

**Ref**
https://ko.reactjs.org/docs/hooks-rules.html#explanation
https://it-eldorado.tistory.com/155
https://rinae.dev/posts/getting-closure-on-react-hooks-summary
