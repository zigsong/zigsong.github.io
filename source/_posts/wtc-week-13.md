---
title: 우테코 13주차 이야기
date: 2021-05-01 08:37:39
tags: woowacourse
---

React Portal | Context API

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 페어 프로그래밍

콜린이랑 마지막 페어 주간! 내가 주도적으로 개발한 것 같아서, 콜린의 의견이 어떻냐고 자주 물어봤다. 그래도 항상 다 괜찮다고 해주니까, 괜히 너무 걱정하지 말고 그 말을 믿어야겠다. 나는 사실 생각하지 않고 코드를 일단 짜는 스타일인데, 중간중간에 콜린이 사소한 실수들을 잘 잡아줘서 삽질할 뻔 한 시간들을 많이 줄일 수 있어서 좋았다.

전체적으로 무난하고 평화로운(?) 코딩이었다. 시간에 조금 쫓겨서 에러 처리를 완벽히 하지 못한 점이 아쉽다. 언제나 여유가 좀만 더 있었으면, 생각하게 된다.

---

## 테코톡 - 웹접근성 & 웹표준

(정리 중)
요 미키쓰의 테코톡
신기한 툴을 사용했다

---

## 공부하기

### class component에서의 this binding

자식 컴포넌트에 props로 넘겨주는 부모 컴포넌트의 메소드 내부에서 `this`를 참조하지 않고 있다면 바인딩을 안 해줘도 될까? 하는 의문이 문득 들었다. 답은 일단 **YES**긴 한데, 왜냐면 참조해야할 값이 없으니까. 그렇지만 컴포넌트의 마운트/언마운트 시점을 예측 불가할 수도 있기 때문에 자식 컴포넌트에서 props로 받고 있는 메소드가 this 참조값을 잃어버릴 수도 있겠다는 생각은 든다. 일단 바인딩하자!

### React Portal

부모 컴포넌트의 외부 DOM에 컴포넌트를 렌더링하는 기능이다. 마스킹된 숫자를 입력해야 하는 일부 자식 컴포넌트에서, 현재의 view 상위에서 가상 키보드를 보여줘야 할 상황에서 사용했다.

우선 `index.html`의 `root`와 같은 층위에, Portal 컴포넌트를 띄울 곳을 `id` attribute와 함께 지정해 준다.

```html
<!-- public/index.html -->
<div id="root"></div>
<div id="keyboard"></div>
```

hook을 사용하고 있기 때문에 `React.createPortal`을 사용했다. 첫 번째 인자로는 Portal을 통해 보여줄 컴포넌트, 두 번째 인자는 보여줄 DOM 노드를 전달해준다.

```jsx
// VirtualKeyboard.js
export const KeyboardPortal = ({ children }) => {
  const el = document.getElementById('keyboard');
  return createPortal(children, el);
};

const VirtualKeyboard = (props) => {
  return (
    // ...
  );
}
```

사실 root와 같은 층위에 새로운 DOM 요소를 삽입해주는 것이 부담스러워서(?), Keyboard를 사용하는 상위 React 컴포넌트에 해당 노드를 심어주고자 했으나 ‘Target DOM’을 찾을 수 없다는 에러가 계속 발생했다.

리뷰를 통해 에러의 원인을 확실히 할 수 있었다.

> `document.getElementById`로 셀렉팅 해올 수 있는 경우는 DOM 오브젝트가 생성된 이후입니다.
> 리액트 컴포넌트의 렌더링 순서에 의존하는 코드를 작성하면 그 코드는 잘못 작성된 것

사용하는 곳에서는 Portal 컴포넌트로 실제 렌더링할 컴포넌트를 한번 감싸준다.

```jsx
// CardPasswordInput.js
return (
  <KeyboardPortal>
    <VirtualKeyboard inputNumbers={cardPas  sword} setInputNumbers={setCardPassword} />
  </KeyboardPortal>
)
```

**Ref**

- https://ko.reactjs.org/docs/portals.html
- https://velog.io/@velopert/react-portals

---

## 알아보기

### 서로 떨어진 form과 button 연결하기

React를 사용하다보면 컴포넌트의 요소들을 조립하기가 난감해지는 상황이 종종 발생한다. 이번에는 `form`과 `button`을 연결하고 싶은데, `button`이 컴포넌트 상으로 `form`과 같은 컴포넌트 내에 위치하기가 어려워졌다.

이럴 때!
`button`의 `form` 속성을 활용하면 멀리 떨어진 `form`과 연결할 수 있다. React에서는 `formId` 속성을 사용한다.

```jsx
<form id="register">
  <input />
</form>

<button form="register">
```

### PropTypes.shape

`prop-types`를 통해 vanilla JS를 사용하면서도 React 컴포넌트에 들어가야 할 props에 대해 타입 제한을 걸 수 있다.

```jsx
PageHost.propTypes = {
  navigationTitle: PropTypes.string.isRequired,
  hasBackButton: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  handleGoBack: PropTypes.func,
};
```

그런데 nesting된 object가 들어올 경우 타입을 뭐라고 명시해줘야 할까?

`PropTypes.shape()`를 쓰면 된다!

```jsx
CardCompletion.propTypes = {
  cardData: PropTypes.shape({
    bankId: PropTypes.string.isRequired,
    cardNumbers: PropTypes.object.isRequired,
    expirationDate: PropTypes.object.isRequired,
    ownerName: PropTypes.string.isRequired,
  }),
  handleConfirmPage: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  cardId: PropTypes.string,
};
```

### em vs rem

재사용되는 컴포넌트의 크기를 페이지마다 다르게 하다보니, 사이즈의 정확한 픽셀값보다 상대적인 값을 사용하기로 했다.

`em`은 실제 사용된 요소의 폰트 크기에 의해서 정해진다.

```css
html {
  font-size: 100%; /* 16px by default */
}

h1 {
  font-size: 2em; /* 16px * 2 = 32px */
}
```

`rem`은 루트의 em을 의미한다. 1rem은 브라우저에서 설정된 `<html>`의 `font-size`와 동일하다.

**Ref**
https://jeongwooahn.medium.com/번역-rem-vs-em-5eac6122b8ea

### global attribute `hidden`

global attribute인 `hidden` attribute는 해당 element가 아직 관련이 없거나, 더 이상 관련이 없는지를 나타내는 boolean attribute이다. 예를 들어, 현재 상황과 관련없는 페이지의 elements를 숨기는데 사용될 수 있다. 브라우저는 `hidden` attribute가 설정된 elements를 설정하지 않는다.

```jsx
<p hidden>This node won't be rendered.</p>
```

hidden attribute는 단순히 어떤 요소를 표시하지 않기 위해 사용하면 안 된다. 만약 어떤 것이 hidden으로 설정되면, 스크린 리더기 등 모든 표현방식에서 사라지게 된다. 단순히 보이지 않게 하고 싶다면, css의 `display: none`을 사용하자.

css의 `display: none`과 같이 html element의 스타일 속성을 명시적으로 지정한 경우에는, hidden 속성이 있더라도 이를 override한다.

**Ref**
https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/hidden
https://velog.io/@bigsaigon333/Level1-javascript-racingcar

---

## 질문하기

### Context API

- Context API를 쓰면 Redux를 사용할 필요가 없다는 말이 있던데 사실인가요?
- 레벨1에서 전역 변수를 지양해야한다는 피드백이 많았는데 React에서는 전역 상태를 사용해도 되는 될까요?

---

## 기타

### 모의면접

패턴에 막혀서 대부분의 시간을 당황해 하며 보냈다. 😭 역시 인생에 예측대로, 뜻대로 되는 건 없다!

### 지속 가능한 소프트웨어를 만들어가는 방법

**비즈니스 로직**
Service 단에 작성하는 코드
비즈니스 흐름 기준으로 각 역할을 가진 협력 도구 클래스들을 중계해 주는 역할을 하며, 각 협력 도구 클래스들이 명시적으로 한 가지 일을 담당한다.

> 상세 구현 로직은 잘 모르더라도 비즈니스의 흐름은 이해 가능한 로직이어야 한다.

**소프트웨어 레이어**
<img src="01.jpeg" />

1. Presentation Layer - 외부 영역에 대한 처리를 담당하는 코드나 요청이 이루어진다. 외부 변화에 민감한, 외부 의존성이 높은 영역이다.
2. Business Layer - 비즈니스 로직을 투영하는 레이어
3. Implement Layer - 비즈니스 로직을 이루기 위해 도구로서 상세 구현 로직을 갖고 있는 클래스들을 가진다. 가장 많은 클래스들이 존재하고 있으면서 구현 로직을 담당하기 때문에 재사용성도 높은 핵심 레이어다.
4. Data Access Layer는 - 상세 구현 로직이 다양한 자원에 접근할 수 있는 기능을 제공하는 레이어. 기술 의존성을 격리하여 구현 로직에게 순수한 인터페이스를 제공하며, 일반적으로 별도의 모듈로 구성된다.

**모듈화**
새로운 기술 또는 기술의 전환이 필요할 때 비교적 쉽고 빠르게 기존 비즈니스에 가장 적은 영향을 끼치며 모듈 단위로 변경이 가능해지게끔 구성

👾 **통제**와 **제어**를 통해 소프트웨어를 예측 가능하게 만들자. 지속 성장하면서 운영 가능한 소프트웨어를 위해서!

**Ref** https://geminikim.medium.com/지속-성장-가능한-소프트웨어를-만들어가는-방법-97844c5dab63

### React 학습 문서 추천

**Ref**

- https://reactjs.org/docs/thinking-in-react.html
- https://reactjs.org/docs/jsx-in-depth.html
- https://kentcdodds.com/blog/
- https://overreacted.io/

### 앱 접근성, 스크린리더 확인

iOS - 손쉬운 사용
크롬 익스텐션 - WAVE

---

## 마무리

밀리고 밀린다..! 사람 살려!!
