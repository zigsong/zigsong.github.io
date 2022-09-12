---
title: 왜 forwardRef를 사용할까?
date: 2021-07-18 19:42:08
tags: react
---

React의 forwardRef

<!-- more -->

<img src="/images/thumbnails/react-thumbnail.png" />

---

**react-hook-form**은 기본적으로 `ref`를 심어주는 비제어 컴포넌트를 사용한다. `useForm`에서 리턴 받은 register를 input의 `ref`에 담아, input의 이름으로 값을 가져온다.

```tsx
const { register } = useForm()

<input name="firstName" ref={register} />
```

그런데 사용하는 input이 만약 React component로 커스터마이징한 input이라면, `ref`를 다시 해당 input 컴포넌트의 실제 input 태그로 전달해줘야 한다.

```tsx
// Upload.tsx
const { register, handleSubmit, setValue, watch } = useForm<FeedToUpload>();

const Upload = () => {
  return (
    <Styled.VerticalWrapper>
      <Label text="제목" required={true} />
      <FormInput {...register("title", { required: true })} />
    </Styled.VerticalWrapper>
  );
};
```

FormInput이 아래와 같이 구현되어 있을 때,

```tsx
// FormInput.tsx
const FormInput = ({ ...options }) => {
  return <Styled.Root {...options} />;
};
```

Upload 페이지에서 사용하는 FormInput 컴포넌트에 스프레드(`{...options}`)해준 props로 `ref`가 자동으로 넘어갈 것이라고 생각했으나, 그렇게 작성하지 말라는(!) 오류가 발생한다. 일반적인 방식의 props가 아니라고 경고하는 것이다.

이때 아래와 같이 props를 다른 이름(여기서는 `formRef`)으로 내려주면 에러는 해결된다.

```tsx
const Upload = () => {
  return (
    <Styled.VerticalWrapper>
      <Label text="제목" required={true} />
      <FormInput name="title" formRef={register} />
    </Styled.VerticalWrapper>
  );
};
```

하지만 우리는 `ref`의 값을 예측 가능하게끔 만들기 위해 `ref`라는 이름으로 내려주고 싶다!

여기서 `forwardRef`가 등장한다. `forwardRef`는 말 그대로 `ref`를 밀어준다(?)는 의미로, 부모 컴포넌트의 `ref`를 렌더링하는 자식 컴포넌트로 밀어준다. `forwardRef`를 사용하면 자식 컴포넌트는 함수의 두 번째 인자로 `ref`를 받게 된다. `ref`는 props와 별개로 취급되고 있다.

```tsx
type Props = InputHTMLAttributes<HTMLInputElement>;

const FormInput = React.forwardRef<HTMLInputElement, Props>(
  ({ ...options }, ref) => {
    return <Styled.Root ref={ref} {...options} />;
  }
);
```

TypeScript를 사용하는 경우 타이핑은 아래와 같이 작성해준다. 첫 번째 타입으로 `RefType`을, 두 번째 타입으로 `PropsType`을 넣어준다.

```tsx
const Component = React.forwardRef<RefType, PropsType>((props, ref) => {
  return someComponent;
});
```

### createRef vs useRef

클래스 컴포넌트에서는 `createRef`로 `ref`를 생성한다. 보통 컴포넌트의 인스턴스가 생성될 때 `ref`를 프로퍼티로서 추가하고, 그럼으로써 컴포넌트의 인스턴스의 어느 곳에서도 `ref`에 접근할 수 있게 된다.

```tsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

함수 컴포넌트에서도 `createRef`를 사용할 수는 있다. 하지만 함수 컴포넌트는 클래스형 컴포넌트와 달리 인스턴스를 생성하지 않기 때문에 리렌더링될 때마다 `createRef` 함수는 새로 호출될 것이며, 이에 따라 `createRef`로 생성된 `ref` 값이 새로 생성된다. 컴포넌트의 생애주기 내에서 값을 유지하지 못하는 것이다.

따라서 함수 컴포넌트에서는 `useRef`라는 hook을 사용하여 컴포넌트 생애주기 전체에서 값을 유지해준다. `useRef`로 생성한 ref 객체는 컴포넌트의 렌더링 시 `ref.current`의 값을 유지해주게 된다.

```tsx
function CustomTextInput(props) {
  const textInput = useRef(null);

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input type="text" ref={textInput} />
      <input type="button" value="Focus the text input" onClick={handleClick} />
    </div>
  );
}
```

---

**Ref**

- https://stackoverflow.com/questions/62931216/why-exactly-do-we-need-react-forwardref
- https://kyounghwan01.github.io/blog/React/useRef-createRef/#함수형-컴포넌트
- https://woowacourse.github.io/tecoble/post/2021-05-15-react-ref/
- https://www.carlrippon.com/react-forwardref-typescript/
