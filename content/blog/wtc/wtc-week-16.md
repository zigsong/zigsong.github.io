---
title: 우테코 16주차 기록
date: 2021-05-22 22:45:17
tags: ["woowacourse"]

---

useCallback과 useMemo | React의 Router | Redux Middlware

<!-- more -->

---

## 페어 프로그래밍

목요일이나 되어서야 새 페어가 매칭되었다. 지난번에 매칭됐다가, 옮겨지느라 같이 하지 못한 엘라! 마지막으로 또 친구인 크루가 걸렸다. 아직 이것저것 많이 맞춰가는 단계고, 이번엔 디자인 시안도 구체적으로 주어지지 않아 시행착오가 많다. 하지만 항상 열정 넘치는 크루같아 보인다. 마감일까지 열심히 잘 달릴 수 있을 것 같다!

---

## 테코톡 - 프론트엔드의 비동기 (callback -> promise -> async/await)

(정리 중)
우테코 가수 카일의 FE 비동기가 주제였다.
카일 발표 거의 철학자…

---

## 공부하기

### CRA 앱에서 babel 설정을 도와주는 친구들

`CRA`로 React 앱을 만들면 babel 설정을 마음대로 하기가 어렵다. `.babelrc` 파일을 생성해도 적용이 되지 않는다.
`node_modules/react-scripts/config/webpack.config.js`를 들어가 보면 다음과 같이 `babelrc`가 `false`로 되어 있기 때문이다.

```jsx
{
  // ...
  babelrc: false,
  // ...
}
```

물론 `eject`를 통해 `config`들을 모두 꺼내볼 수 있지만, 한 번 `eject`를 하면 모든 설정들과 프로젝트의 dependency들이 밖으로 나오기 때문에 복잡하며, 다시 돌이킬 수도 없다는 문제가 있다.

이를 해결해주는 모듈이 몇 개 있다. 가장 대표적인 것은 **react-app-rewired**이다.

```shell
yarn add react-app-rewired
```

`scripts`를 수정해 준다.

```jsx
// package.json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  ...
},
```

`config-overrides.js` 파일을 만들어 설정을 바꿔준다.
이때 `customize-cra`를 사용하면 편리하다.

```jsx
// config-overrides.js
const { override, useBabelRc } = require("customize-cra");

module.exports = override(useBabelRc());
```

이제 CRA에 설정된 값을 필요에 따라 override하여 사용할 수 있다.

비슷한 모듈로 **craco**가 있다.

```shell
yarn add @craco/craco
```

마찬가지로 `scripts`를 수정해 준다.

```jsx
// package.json
"scripts": {
	"start": "craco start",
	"build": "craco build",
	"test": "craco test",
}
```

**Ref**

- https://www.npmtrends.com/@craco/craco-vs-customize-cra-vs-react-app-rewired
- https://micalgenus.github.io/articles/2019-02/React-eject-없이-babelrc-적용

### TypeScript any vs unknown

anyScript는 지양해야 하지만, TypeScript로 개발을 하다보면 정말 넘어가고 싶은 부분들마저도 끈질기게 타이핑을 요구하는 부분들이 있다. 이때 잠시 `any`를 쓰려고 하면 `eslint@typescript-eslint/no-explicit-any` rule에 의해 eslint가 잔소리를 뿜어댄다.

그런데 여기서 `unknown`을 쓰면 다시 잠잠해진다. 알쏭달쏭한데, 각각 어떤 상황에서 쓰는 것일까?

**any**는 우선 TypeScript 기본 타입에 등록되어 있다. 동적인 데이터를 받아오는 경우 등 타입 검사를 하지 않고, 그 값들이 컴파일 시간에 검사를 통과하길 원할 때 사용한다.
또한, any 타입은 타입의 일부만 알고 전체는 알지 못할 때 유용하다. 예를 들어, 여러 다른 타입이 섞인 배열에 `any`를 사용할 수 있다.

```tsx
let list: any[] = [1, true, "free"];
```

**any**는 어떠한 타입이든(`never` 제외) 다른 타입에 할당할 수 있도록 만드는 ‘타입 와일드카드’와도 같다.

**unknown** 타입은 **any**와 마찬가지로 모든 타입의 값이 할당될 수 있다.

```tsx
let variable: unknown;

variable = true; // OK (boolean)
variable = 1; // OK (number)
variable = "string"; // OK (string)
variable = {}; // OK (object)
```

하지만 조금 다른 것은 **unknown** 타입으로 선언된 변수는 **any**를 제외한 다른 타입으로 선언된 변수에 할당될 수 없다는 것이다.

```tsx
let variable: unknown;

let anyType: any = variable;
let booleanType: boolean = variable;
// Error: Type 'unknown' is not assignable to type 'boolean'.(2322)
let numberType: number = variable;
//  Error: Type 'unknown' is not assignable to type 'number'.(2322)
let stringType: string = variable;
//  Error: Type 'unknown' is not assignable to type 'string'.(2322)
let objectType: object = variable;
//  Error: Type 'unknown' is not assignable to type 'object'.(2322)
```

unknown 타입으로 선언된 변수는 프로퍼티에 접근할 수 없으며, 메소드를 호출할 수 없으며, 인스턴스를 생성할 수도 없다. 말 그대로 **unknown**이기 때문이다.

```tsx
let variable: unknown;

variable.foo.bar; // Error: Object is of type 'unknown'.(2571)
```

**unknown** 값을 사용하기 위해서는 Type Guard가 필요하다.

```tsx
let variable: unknown;
declare function isFunction(x: unknown): x is Function;

if (isFunction(variable)) {
  variable(); // OK
}
```

**any**가 사용될 곳이라면 **unknown** 타입으로 대체할 수 있다. **unknown** 타입으로 지정된 값은 타입을 먼저 확인 후에 무언가를 할 수 있기 때문에 안전하다.

👾 결론! **any**보다는 **unknown**을 사용하는것이 좀 더 안전한 방법이다.

**Ref**

- https://typescript-kr.github.io/pages/basic-types.html#any
- https://jbee.io/typescript/TS-9-unknown/
- [https://overcurried.netlify.app/안전한%20any%20타입%20만들기/](https://overcurried.netlify.app/안전한 any 타입 만들기/)

### React hooks의 필요성

**Ref** https://blog.bitsrc.io/6-reasons-to-use-react-hooks-instead-of-classes-7e3ee745fe04

### Redux Toolkit + TypeScript + Thunk

**Ref** https://www.newline.co/@bespoyasov/how-to-use-thunks-with-redux-toolkit-and-typescript--1e65fc64

---

## 알아보기

### CSS :focus-within

html의 `<label>`과 `<input>`은 뗄레야 뗄 수 없는 관계다.
아래 두 가지 작성 방식이 있다.

```jsx
<label>Click me
  <input type="text" name="username">
</label>
<label for="username">Click me</label>
<input type="text" id="username">
```

`for` 속성이 필요하지 않고 연결 관계가 명확한 첫 번째 방식을 쓸 때가 많다.
이때 `<input>`에 focus가 되었을 시 `<input>`의 색상 뿐 아니라 `<label>`의 색상도 바꾸게 하고 싶었다.

하지만 CSS에는 부모 요소를 선택하는 방법이 없다. 두 번째 방식으로 형제 선택자를 사용하려 했으나, 형제 선택자는 ‘다음’ 요소만 선택이 가능하다고 한다.

이때 `<label>`에 `:focus-within` 선택자를 사용하면 된다. `:focus-within` 선택자를 부모 요소에 사용하면 내부 자식 요소에 포커스 된 경우까지 잡아준다.

아래는 styled-components로 작성한 예시

```jsx
const Label = styled.label`
  // ...

  &:focus-within {
    color: ${PALETTE.DEFAULT_BLACK};
  }
`;
```

### TypeScript Record type

object 형태의 데이터를 다룰 때 사용하는 타입이다. `Partial`, `Pick` 등과 마찬가지로 Utility Type에 속한다.
`Record<Keys,Type>`의 형태로 사용한다.

```tsx
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;

const cats: Record<CatName, CatInfo>;
```

**Ref** https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype

### AbortController

MDN에 따르면,

> `AbortController` 인터페이스는 하나 이상의 웹 요청을 취소할 수 있게 해준다.

라고 적혀 있다.
인터페이스? JavaScript에서 인터페이스라는 용어를 만난 건 처음인 것 같다.

비동기 요청을 보냈을 때 해당 요청을 취소할 수 있는 툴이 있는 것들과 유사하게,
`AbortController`는 `document.querySelector`와 같은 DOM 요청을 취소해줄 수 있다.

물론 비동기 요청도 취소가 가능하다.

```tsx
const abortController = new AbortController();
const signal = abortController.signal;

fetch("http://example.com", { signal }).catch(({ message }) => {
  console.log(message);
});

abortController.abort();
```

**Ref**

- https://developer.mozilla.org/ko/docs/Web/API/AbortController
- https://genie-youn.github.io/journal/자바스크립트에서_AbortController를_활용하여_비동기_작업_중단하기.html

### optional map

Array가 `undefined`일 수 있는 상황에 대비하여 Array 자체에 `?`로 optional을 붙여줄 수도 있지만,

```tsx
let arr = [1, 2, 3];

arr?.push(4);
```

`map` 메소드를 사용하는 변수가 Array 객체인지 확인하기 위해 `map` 메소드에도 `?`를 붙여줄 수 있다.

```tsx
let arr = [1,2,3];

arr.map?.((item) => /* ... */);
```

### CSS flexbox

`display: flex`, `justify-content: center`만 주구장창 쓰지 말고 `flexbox` 제대로 이해하고 사용하자!

**Ref** https://d2.naver.com/helloworld/8540176

---

## 질문하기

### 테스트 코드에 대해 처음 배운 뒤로 시간이 꽤 흘렀습니다. 그동안 여러분 스스로 경험한, 테스트 코드를 작성해야 하는 이유가 있나요?

### 무엇을 테스트해야 할까요?

---

## 기타

### PR을 꾸며주는 익스텐션

**Ref** https://chrome.google.com/webstore/detail/github-writer/diilnnhpcdjhhkjcbdljaonhmhapadap

---

## 마무리

개인적으로는 정말 울적한 나날들의 연속이다. 데일리 조와 한강 나들이도 너무 즐거웠고, 주말에 루터 등교를 째고(?) 만난 친구들과의 소란스러웠던 만남도 행복했다. 집에 오면 다시 그 시간 만큼의 울적함이 몰려오긴 하는데, 아마 크루들이 없었다면 정말 더 힘들었을 것 같다.

미션도 마지막을 향해 간다. 우테코도 절반이 지나간다.
