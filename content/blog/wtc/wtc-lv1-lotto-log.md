---
title: 우테코 Lv1 lotto 학습로그
date: 2021-03-02 10:08:29
tags: ["woowacourse"]
thumbnailImage: https://i.imgur.com/frkONDC.jpg
---

우테코 Lv1 lotto 학습로그

<!-- more -->

---

[PR-Step1](https://github.com/woowacourse/javascript-lotto/pull/23#issuecomment-826061032)
[PR-Step2](https://github.com/woowacourse/javascript-lotto/pull/43#issuecomment-826061662)
[PR-Step3](https://github.com/woowacourse/javascript-lotto/pull/64#issuecomment-826062118)

---

# Step1

## 정적 팩토리 메서드 패턴

클래스의 인스턴스를 new 키워드로 생성하면, 객체의 생성 방법을 사용자측에서 너무 자세히 알아야 하는 문제가 있다. 객체를 생성하는 정적 메서드를 제공해주고 이 메서드를 사용하게끔 하여 문제를 해결할 수 있다.

👾 객체 생성을 캡슐화하는 기법

- 객체 생성의 역할을 하는 클래스 메서드 (`static`)

- 생성자 대신 정적 팩토리 메서드를 사용할 수 없는지 생각해보기

  ```jsx
  class Lotto = {
    constructor() {
      // ...
    }

    static newLotto() {
      return new Lotto(generateRandomNumbers());
    }
  }

  // bad
  const lotto = new Lotto(generateRandomNumbers());

  // good
  const lotto = Lotto.newLotto();
  ```

**링크**

- https://johngrib.github.io/wiki/static-factory-method-pattern/
- https://velog.io/@ljinsk3/정적-팩토리-메서드는-왜-사용할까

---

## DOM 선택자로 `class` 대신 `id`(단일 엘리먼트), `dataset`(여러 개) 사용하기

`class`로 선택하는 경우 기능과 상관없이 스타일이 바뀌었을 때 일일이 찾아 수정해주어야 하는 번거로움이 있으며, 이는 프로그램이 깨지기 쉬운 취약한 구조이다.

문서에 한 개뿐인 단일 요소이면 `id`를, 특정한 데이터 속성을 가지고 있다면 `dataset`을 사용하자. 또, `dataset`은 `id`와 `class`를 사용하기 적절하지 않은 상황에서만 사용하는 것이 좋다.

**링크**
https://stackoverflow.com/questions/17184918/best-practice-class-or-data-attribute-as-identifier/17185248

---

## private class field, hash `#`

JavaScript의 private class field를 나타내는 해쉬(`#`)는 ES2019에서 추가된 문법이다. `#` prefix를 추가해 private class field를 선언할 수 있다.

```jsx
class ClassWithPrivateField {
  #privateField;
}

class ClassWithPrivateMethod {
  #privateMethod() {
    return "hello world";
  }
}

class ClassWithPrivateStaticField {
  static #PRIVATE_STATIC_FIELD;
}
```

private class field는 class 선언문 내부의 class 생성자에서 접근이 가능하다.

**링크**
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_class_fields

---

# Step2

## 모든 View들이 상속 받는 parent View class

외부에서 사용 시 method chaining을 위해 class method 구현부에서 `return this`를 사용할 수 있다.

```jsx
export default class View {
  constructor() { ... }

  show() {
  // ...
    return this;
  }

  hide() {
  // ...
    return this;
  }

class SomeView extends View { ... }

const someView = new SomeView();
someView.show().hide(); // chaining
```

---

## 상속과 합성

### 상속

- is-a 관계
- 공통적인 메서드를 부모에 두는 패턴으로 작성하여 중복 제거에 유리하다.
- 부모 클래스와 자식 클래스 간의 결합도가 높아지고 자식 클래스는 부모 클래스의 구현에 의존한다.
- 부모 클래스가 모든 내용을 갖고 있는 객체, 즉 God Object가 되어 너무 많은 역할을 하게 된다. 이는 코드의 수정을 어렵게 만든다. 부모 클래스의 구조가 변하면 이를 상속 받는 모든 자식 클래스가 영향을 받는다.

### 합성

- has-a 관계
- 이미 구현되어 있는 기능을 빌려 쓰는 개념이다.
- 객체가 하는 일(What things do)에 초점을 맞추어, 필요한 동작드을 고유한 함수로 추상화할 수 있다.

**링크**
https://mingcoder.me/2020/07/19/Programming/JavaScript/inheritance-vs-composition/

---

## CustomEvent, dispatchEvent

이벤트의 이름과 전달 데이터를 명시하여 이벤트를 사용자화할 수 있다.

```jsx
obj.addEventListener("go", function (e) {
  console.log(e + "going");
});

const event = new CustomEvent("go", { detail: "zig" });

obj.dispatchEvent(event);
```

**링크**
https://developer.mozilla.org/ko/docs/Web/API/CustomEvent/CustomEvent

---

## (웹접근성) html aria-label

### ARIA

- 접근가능한 리치 인터넷 어플리케이션(Accessible Rich Internet Applications, ARIA)
- 장애를 가진 사용자가 웹 콘텐츠와 웹 어플리케이션(특히 JavaScript를 사용하여 개발한 경우)에 더 쉽게 접근할 수 있는 방법을 정의하는 여러 특성
- `role`과 `aria-*` 속성을 사용한다.
- ex) 스크린 리더 등의 보조기기 사용 시 요소를 명확하게 식별하기 위해 사용한다.

### aria-label

- label의 텍스트를 표시하지 않을 경우 사용한다. 태그의 목적을 설명한다.

  ```html
  <input
    type="number"
    class="winning-number mx-1 text-center"
    aria-label="winning-number-1"
  />
  ```

- `aria-labelledby`가 우선순위가 더 높다

**링크**
https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA

---

## 기타

### util의 의미

하나의 프로젝트에서 util은 특정 도메인은 알지 못하고 범용적으로 사용할 수 있는 것들의 모음이다. 특정 도메인에 국한되지 않도록 작성할 수 있어야 한다.

### input change vs input event

- **`change`** - input 요소의 값이 바뀌었을 때 발생. 포커스를 잃거나, 엔터를 입력하는 등의 경우에 발생한다.
- **`input`** - input 요소의 value 속성이 바뀔 때마다 발생

---

# Step3

## 객체 프로그래밍의 기본

객체 프로그래밍은 각 객체별로 역할을 나누고 객체에게 인자 처리를 요청하는 흐름으로 이루어진다.

필요한 데이터를 추상화시켜 상태와 행위르 가진 객체를 만들고 그 객체들 간의 유기적인 상호작용을 통해 로직을 구성하는 것이다.

**링크**
[https://jeong-pro.tistory.com/95](https://jeong-pro.tistory.com/95)

---

## show/hide와 append

### 웹페이지 렌더 과정

1. DOM, CSSOM 생성
2. render tree 생성
3. layout (reflow): 브라우저 뷰포트 내에서 각 노드들의 정확한 위치와 크기를 계산
4. (re)paint

- 페이지 초기 로딩 시 보이지 않아야 할 요소를 미리 DOM에 넣어 놓고 show/hide를 하는 경우가 필요한 상황에서 해당 요소를 append하는 것보다 빠르다.
- show/hide는 이미 만들어진 DOM tree에 조작만 해서 render tree에만 변경이 일어나고, append는 DOM tree와 render tree 모두 변경되기 때문이다
  - **DOM tree**: 실제 모든 html 요소들을 포함하는 트리
  - **render tree**: DOM과 CSSOM 트리가 결합된, 실제 화면에 표현되는 요소들의 트리
- 미리 보여도 상관없는 요소라면 show/hide를 사용하자.

**링크**

- https://stackoverflow.com/questions/31759719/what-is-the-difference-between-browser-dom-tree-and-render-tree
- https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=ko
- https://boxfoxs.tistory.com/408

---

## 기타

### Array 내장 메서드 사용하기

```jsx
const lottoTickets = Array.from(
  { length: this.count },
  (_, idx) => `<li>....</li>`
).join("");
```

`Array.from()` 메서드는 유사 배열 객체(array-like object)나 반복 가능한 객체(iterable object)를 얕게 복사해 새로운 Array 객체를 만든다.

**링크**
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/from

### `nextElementSibling`

선택한 요소의 바로 다음 요소를 리턴한다.

**링크**
https://developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling

### form.elements

```jsx
const inputs = document.getElementById("my-form").elements;
const inputByIndex = inputs[0];
const inputByName = inputs["username"];
```

**링크**
https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
