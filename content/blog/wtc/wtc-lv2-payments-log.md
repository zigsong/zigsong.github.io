---
title: 우테코 Lv2 payments 학습로그
date: 2021-05-04 08:31:52
tags: ["woowacourse"]
thumbnailImage: https://i.imgur.com/frkONDC.jpg
---

우테코 Lv2 payments 학습로그

<!-- more -->

---

- [PR-Step1 바로가기](https://github.com/woowacourse/react-payments/pull/17)
- [PR-Step2 바로가기](https://github.com/woowacourse/react-payments/pull/33)

# 1️⃣ Step1

---

## Prop drilling

데이터를 직접적으로 사용하지 않고 전달에만 사용하는 컴포넌트에서 발생한다. React Component 트리의 한 부분에서 다른 부분으로 데이터를 전달하는 프로세스이다.

prop drilling의 depth가 깊어지면 실제 데이터가 사용되는 컴포넌트 로직을 알기 어려우며, 관련 있는 상태는 될 수 있으면 가까운 곳에 선언하는 것이 좋다.

또는 React 계층에서 깊숙이 위치한 상태라면 Context API 등을 사용하여 상태를 전역 변수로 관리할 수 있다. 그러나 단순 데이터 전달만을 위한 컴포넌트가 과도하게 만들어지는 것이 아니라면, Context API 등은 오히려 복잡도를 증가시키는 오버엔지니어링이 될 수도 있으므로 상황에 따라 도입해야 한다.

**Ref**

- https://kentcdodds.com/blog/prop-drilling
- https://github.com/woowacourse/react-payments/pull/17#issuecomment-830758509

---

## React Portal

부모 컴포넌트의 DOM 계층 구조 바깥에 있는 DOM 노드로 자식을 렌더링한다.

1. portal을 띄울 DOM node 만들기

   ```html
   <!-- index.html -->

   <div id="root"></div>
   <div id="keyboard"></div>
   ```

2. `React.createPortal`로 Portal 컴포넌트 만들기

   ```jsx
   // VirtualKeyboard.js
   export const KeyboardPortal = ({ children }) => {
     const el = document.getElementById("keyboard");
     return createPortal(children, el);
   };

   const VirtualKeyboard = (props) => {
     // ...
     return (
       <Style.Root className="keyboard-inner">
         {keypads}
         <Style.Keypad></Style.Keypad>
         <Style.Keypad onClick={onDeleteKeypad}>DELETE</Style.Keypad>
       </Style.Root>
     );
   };
   ```

3. Portal 컴포넌트 사용하기

   ```jsx
   // SomeComponent.js
   const SomeComponent = (props) => {
     // ...
     return (
       <KeyboardPortal>
         {isVirtualKeyboardOpened && (
           <VirtualKeyboard
             inputNumbers={secureCode}
             setInputNumbers={setSecureCode}
           />
         )}
       </KeyboardPortal>
     );
   };
   ```

Dialog나 Modal 등, 상위 컴포넌트의 스타일에 영향을 받지 않으면서 컴포넌트를 렌더링하고 싶을 때 Portal을 사용한다. 애니메이션 등을 사용할 때 트리 구조브 앱으로 구현했다면 키보드가 뜰 때 input이 가려지지 않게 조정하는 방법이 있었을 테지만, 웹으로 구현하다 보니 그냥 화면이 아래로 내려가게끔 하는 수밖에 없었다 (scrollTo 메서드 이용) 상의 위치에 따라 성능 문제가 발생하는 경우에도 사용한다고 한다.

**👾 Portal, React 컴포넌트 트리 어디에?**
Portal이 DOM 트리의 어디에도 존재할 수 있다 하더라도 모든 다른 면에서 일반적인 React 자식처럼 동작한다. (context와 같은) React의 기능은 자식이 portal이든지 아니든지 상관없이 정확하게 같게 동작한다. 이는 DOM 트리에서의 위치에 상관없이 portal은 여전히 React 트리에 존재하기 때문이다. (HTML DOM 구조만 바뀌며, React 컴포넌트 트리는 바뀌지 않는다.)

따라서 어떠한 부모 컴포넌트 하위의 자식 컴포넌트가 portal을 사용해서 DOM 트리에서는 부모-자식 관계가 아니더라도, React 트리 상에서는 여전히 부모-자식 관계로 이루어져 있기 때문에 부모 컴포넌트는 자식 컴포넌트의 이벤트를 포착할 수 있다.

**Ref**
https://reactjs-kr.firebaseapp.com/docs/portals.html

---

## 기타

### 컴포넌트에 전달하는 prop method의 네이밍

사용되는 컴포넌트의 관심사가 아닌, 사용하는 컴포넌트의 관심사 측면에서 prop을 네이밍해야 한다.

```jsx
// bad😕
const CardRegisterForm = () => {
  // ...
  return (
    // ...
    <CardNumbersInput cardNumbers={cardNumbers} setCardNumbers={setCardNumbers} />
  )
}

const CardNumbersInput = ({ cardNumbers, setCardNumbers }) => {
  // ...
  return (
    // ...
  )
}
```

```jsx
// good 😉
const CardRegisterForm = () => {
  // ...
  return (
    // ...
    <CardNumbersInput cardNumbers={cardNumbers} onChange={setCardNumbers} />
  )
}

const CardNumbersInput = ({ cardNumbers, onChange }) => {
  // ...
  return (
    // ...
  )
}
```

`setCardNumbers`라는 함수가 구체적으로 무엇을 수행하는지는 `CardNumbersInput` 컴포넌트가 아니라 `CardNumbersInput`을 사용하는 `CardRegisterForm` 측의 관심사다.

**Ref**
https://github.com/woowacourse/react-payments/pull/17/files#r624647027

---

# 2️⃣ Step2

## useEffect 내부에서 비동기 호출

`useEffect`의 시그니처는 다음과 같다.

```tsx
function useEffect(effect: EffectCallback, deps?: DependencyList): void;

type EffectCallback = () => void | (() => void | undefined);
```

Promise를 리턴하는 async 함수는 useEffect의 첫 번째 인자로 들어갈 수 없으며, void 형의 함수 또는 void 형의 함수를 반환하는 함수만 사용할 수 있다.

effect에는 callback 함수가 들어가기 때문에 async 함수를 그대로 전달해주면 된다. (`useEffect` 내부에서 즉시 호출되는 것이 아니라, 해당 함수를 등록해놓는 것일 뿐이다.)

```tsx
const SomeComponent = () => {
  async fetchData = () => {
    await something...
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    // ...
  )
}
```

`useEffect` 내부에서 비동기 호출 시 `try~catch`를 이용하여 에러 핸들링을 해주었다.

```tsx
// 비동기 함수 한번 wrapping하기
useEffect(() => {
  const fetchData = async () => {
    try {
      const cardsData = await getCardsRequest();
      // do something...
    } catch (error) {
      console.error(error);
      // error handling...
    }
  };
  fetchData();
}, []);
```

```tsx
// 즉시실행함수
useEffect(() => {
  (async function () {
    try {
      const cardsData = await getCardsRequest();
      // do something...
    } catch (error) {
      console.error(error);
      // error handling...
    }
  })();
}, []);
```

**Ref**
https://github.com/woowacourse/react-payments/pull/33#discussion_r627522014

---

## 컴포넌트에 props로 함수 전달하기

자식 컴포넌트인 A와 B는 동일하게 작동한다. (각 컴포넌트에 props로 메소드를 전달한다.)
f2와 같은 형태로 전달하면 함수에 파라미터를 전달할 수 있다.

```tsx
const SomeComponent = () => {
  const f = () => {}
  const f2 = () => () => {}

  return (
    <A f={f} />
    <B f={f2()} />
  );
}
```

---

## 기타

### input.focus & input.blur

input에 focus 활성화 & 비활성화하기

```jsx
ref.current.focus();
ref.current.blur();
```

### 서로 떨어진 submit button과 form 연결하기

`form`에 `id`값을 부여하여 연결할 수 있다.

```jsx
// Button.js
const Button = (props) => {
  const { type, text, formId } = props;

  return (
    <Style.Root type={type} form={formId}>
      {text}
    </Style.Root>
  );
};
// CardRegister.js
const CardRegister = (props) => {
  const onSubmitForm = () => {
    // ...
  };

  return (
    <>
      <form id="register-form" onSubmit={onSubmitForm} />
      <Button type="submit" text="다음" formId="register-form" />
    </>
  );
};
```
