---
title: 우테코 14주차 이야기
date: 2021-05-08 23:34:15
tags: woowacourse
---

git hook | React + TypeScript | Redux

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 페어 프로그래밍

우여곡절 끝에 3인 페어가 되었다. 입아체 체프와, 투두 출신 개발자 유조! 둘 다 실력자라서 내가 잘할 수 있을지 긴장되었다. 그래도 꿀잼으로 잘 진행하고 있다. 온라인으로 할 때는 3명이라 오디오가 때때로 물려서 불편하긴 한데, 의사결정과 작업 속도가 더 빠른 느낌이다. 지난 3인 페어를 거쳐간 크루들이 말했듯 ‘짝’보다는 ‘팀’에 가까운 형태라, 뭔가 더 으쌰으쌰 힘도 난다. 첫 오프라인 페어 때는 거의 흥의 민족이 되어 신나게 코딩했다.

체프는 이것저것 정말 많이 잘 알고 있다. 나도 그런 편이지만, 이유는 모른 채 깨작깨작 어디선가 조금씩 코드 긁어다 붙여놓기만 했던 나와는 다르다. 진짜 생각을 하고 이유 있는 코드를 작성한다. 배울 만한 자세다. 어디선가 막히면, 혼자서라도 문제를 해결해와서 공유해 준다. 대단하다! 또 이것저것 많이 컨벤션을 준비해와서 일을 체계적으로 착착 진행할 수 있었다. 반장 재질…

유조는 redux와 thunk 모두 처음이라고 했는데, 충분히 금방 해낼 수 있을 것 같다. 따로 시간 내서 배우고 연습해보려는 열정이 대단하다. 그리고 정말 다른 사람들의 의견을 잘 받아준다. 수동적으로 받아들이기만 하는 것이 아니라, 충분한 고려 끝에 수용한다. 의견을 제시한 사람의 기분을 좋게 만들어 주기도 한다. 유조의 ‘좋아요’라는 어투가 너무 재미있다. 중독될 것 같다.

이번 미션부터는 typescript로 작업하고 싶었던 내 의견도 모두 긍정적으로 받아줘서 정말 고마웠다. 부끄럽지 않게 시간 내서 공부해야겠다. 일단 UI 작업은 끝냈다. 특히 체프가 정말 CSS의 고수여서 수월하게 작업할 수 있었던 것 같다. 나도 빨리 짬이 차서 CSS에 능숙해지면 좋겠다! 많이 연습해야지.

---

## 테코톡 - Virtual DOM

(정리 중)

이번주 테코톡은 바로 나였다… 녹화 도중 구급차가 시끄럽게 지나가서 조금 웃긴 것 같았지만, 끝내서 후련하다!

---

## 공부하기

### React.FC, 사용해야 할까?

TypeScript로 리액트 앱을 개발하면 `React.FC` (Function Component)를 사용할 수 있다.

```tsx
type TodoItemProps = {
  text: string;
}

const TodoItem: react.FC<TodoItemProps> = ({ name }) => {
  return (
    // ...
  )
}
```

세부적인 구조는 아래와 같이 생겼다.

```tsx
interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P>;
  contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}
```

`React.FC`를 사용하면 props에 기본적으로 `children`이 들어간다. 이는 장점이 될 수도, 단점이 될 수도 있다. `children`이 옵셔널 형태로 들어가기 때문에 props 타입이 명확해지지 않고, `children`이 필요하지 않거나 들어가면 안 되는 컴포넌트의 경우 사용이 곤란하다.

또 `React.FC`를 사용하면 컴포넌트의 defaultProps, propTypes, contextTypes를 설정할 때 자동완성이 가능하다.
그러나 이 경우 defaultProps가 제대로 작동하지 않는다.

```tsx
type TodoItemProps = {
  text: string;
};

const TodoItem: React.FC<TodoItemProps> = ({ name }) => {
  return <div>{name}</div>;
};

TodoItem.defaultProps = {
  text: "some todo",
};

export default TodoItem;
```

해당 컴포넌트를 사용하는 곳에서 prop을 넘겨주지 않는다면 에러가 발생한다.

```tsx
const App: React.FC = () => {
  return <TodoItem />; // Property 'text' is missing
};
```

장단점이 있겠지만, `React.FC`를 쓰지 않는 편이 나을 것 같다!

**Ref**

- https://velog.io/@velopert/create-typescript-react-component
- https://fettblog.eu/typescript-react-why-i-dont-use-react-fc/

---

### d.ts에 특정 모듈 기능 추가하기

Ambient declaration은, 기존 JavaScript 모듈을 TypeScript에서 사용하기 위해 기존 JavaScript 모듈의 타입 정보를 별도의 파일로 선언한 것을 의미한다. `npm install [module-name]` 또는 `npm install @types/[module-name]`으로 사용했던 것들은 모두 이미 존재하는 모듈의 `.d.ts`를 가져다 쓰고 있는 것이다.

style 모듈로 `emotion`을 사용하면서, default theme에 대한 정의가 필요했다. TypeScript를 사용하고 있기 때문에 해당 theme에 대한 타입 정의도 필요해졌다. 아래와 같이 작성했다.

```tsx
// emotion.d.ts
import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    bgColor: {
      primary: string;
      secondary: string;
      lightGrey: string;
    };
    // ...
  }
}
```

export하고자 하는 내용을 `interface` 또는 `type`으로 작성할 수 있다.
JavaScript에서 `declare`가 의미하는 바가 무엇인지는 정확히 알아내지 못했다. 🤔

**Ref**

- https://www.slideshare.net/gloridea/dts-74589285
- https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html

---

### type vs interface

TypeScript에서 타입 선언 시 사용되는 두 가지 방식이다.

**Type**

- union, tuple 등에는 type만 사용이 가능하다.

- 기본타입, 배열과 튜플, 유니온타입에 새로운 이름을 붙일 수 있다. (Interface는 불가능)

  ```tsx
  type Name = string;

  type myAction =
    | { type: "INCREMENT"; count: number }
    | { type: "DECREMENT"; count: number };
  ```

- 실제로는 새 타입을 생성하는 것이 아니기 때문에 타입과 관련된 에러 발생 시 실제 타입을 보여준다.

- 객체 타입으로 표시된다.

  ```tsx
  type Alias = { num: number };

  interface Interface {
    num: number;
  }
  declare function aliased(arg: Alias): Alias;
  declare function interfaced(arg: Interface): Interface;
  ```

  `interfaced`에 hover하면 `interface`가 표시되지만, `aliased`에 hover하면 객체 타입으로 표시된다.

**Interface**

- 같은 이름으로 여러 번 선언해도 컴파일 시점에 합쳐지기 때문에 확장성이 좋다. (Declaration Merging)
- `extends`, `implements`를 통해 확장할 수 있다.

**Ref**

- https://velog.io/@swimme/Typescript-type-vs-Interface
- https://joonsungum.github.io/post/2019-02-25-typescript-interface-and-type-alias/

---

## 알아보기

### git hooks & husky

**git hooks**
git을 사용할 수 있도록 도와주는 기능이다. git에서 commit, push 등 특정 이벤트 발생 순간에 hook 즉 갈고리를 걸어서 특정 스크립트가 실행될 수 있게 해준다.
모든 git repository에 기본적으로 설치되어 있으며, `cd .git/hooks`에 들어가면 모든 기본 hook들을 확인할 수 있다.

husky는 프론트엔드 개발 환경에서 git hook을 손쉽게 제어하도록 도와주는 도구이다.
husky pre-commit 명령어에 `lint-staged`를 작성하여 git에 staged된 파일에 대해서 lint 검사를 수행해 준다. 검사가 실패하면 commit을 할 수 없다.

```
yarn add -D husky lint-staged
npx husky add .husky/pre-commit "npx lint-staged"
```

**Ref**

- https://woowabros.github.io/tools/2017/07/12/git_hook.html
- https://www.huskyhoochu.com/how-to-use-lint-staged/

### json server

json 문법으로 간단하게 데이터베이스를 만들 수 있다.

```jsx
// data.json
{
  "todos": [
    {
      "id": "1a",
      "text": "블로그 작성"
    },
        {
      "id": "2b",
      "text": "친구 약속"
    },
    {
      "id": "3c",
      "text": "코드리뷰"
    },
  ]
}
```

아래와 같이 실행하여 로컬에 json server를 띄운다.

```shell
yarn global add json-server
json-server --watch data.json --port 3001
```

간단한 배포는 heroku로 가능하다고 한다.
**Ref** https://react.vlpt.us/redux-middleware/08-json-server.html

### redux toolkit

액션타입, 액션생성함수, 리듀서를 모두 준비해야 하는 redux의 불편함을 한결 덜어주는 도구다. 리덕스 개발팀에서 만들었다.

리듀서, 액션타입, 액션생성함수, 초기상태를 하나의 함수 `slice`로 편하게 선언할 수 있다.

```tsx
import { createSlice } from "@reduxjs/toolkit";

const msgboxSlice = createSlice({
  name: "msgbox",
  initialState: {
    open: false,
    message: "",
  },
  reducers: {
    open(state, action) {
      state.open = true;
      state.message = action.payload;
    },
    close(state) {
      state.open = false;
    },
  },
});

export default msgboxSlice;
```

**Ref** https://velog.io/@velopert/using-redux-in-2021

### react에서 svg를 컴포넌트처럼 사용하기

```jsx
import logoSvg from "../assets/images/logo.svg";

const Header = () => {
  return <img src={logoSvg} alt="logo" />;
};
```

위와 같이 img 태그의 src에 넣어주는 것이 일반적이지만, svg를 바로 리액트 컴포넌트처럼 사용할 수도 있다.

```jsx
import { ReactComponent as Logo } from "../assets/images/logo.svg";

const Header = () => {
  return <Logo />;
};
```

**Ref** https://kyounghwan01.github.io/blog/React/handling-svg/

### CSS

- `justify-items`

- `input`, `button` 등은 globalStyle이 안 먹힐 수 있기 때문에 `font-family: inherit`이 필요하다.

- `display: grid`에도 `justify-content: center` 적용이 가능하다.

- `~`와 `+` 선택자의 차이 (인접 선택자)

  - x + y: x 바로 뒤에 있는 하나의 y만 선택
  - x ~ y: x 다음의 모든 y 선택

- `user-select: none` - 드래그를 막아준다.

- flexbox 활용하기 - 컨테이너에 `display: flex`를 하고 하나의 자식 요소에 width (또는 height)를 적용한 후 다른 자식 요소를 `flex: 1`로 준다면 첫 번째 요소가 차지하고 남은 영역만큼을 모두 차지할 수 있다.

- `z-index`에 음수값 넣기

**Ref** https://code.tutsplus.com/ko/tutorials/the-30-css-selectors-you-must-memorize--net-16048

### react-app-rewired

cra 프로젝트에서 babel이나 webpack 설정을 변경해야할 때가 있다.
이때 eject를 할 수도 있지만, 모든 모듈들이 풀어 헤쳐지기 때문에 복잡해진다는 문제가 있다.
이럴 때 `react-app-rewired`를 사용한다. 해당 툴은 webpack 설정을 override해준다.
사용 시 스크립트를 변경해줘야 한다.

```
// package.json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject",
  "storybook": "start-storybook -p 6006 -s public",
  "build-storybook": "build-storybook -s public"
},
```

### enum 사용을 지양하는 이유

- treeshaking의 문제
- 정수형 enum 사용 시 enum에 정수로 접근하고자 하는 경우(위험) TypeScript가 에러를 뱉지 않는다.

**Ref**
https://blog.logrocket.com/why-typescript-enums-suck/
https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/

### storybook에 argTypes 넣기

```
// Button.stories.js
export default {
  title: 'shared/Button',
  component: Button,
  argTypes: {
    size: {
      type: 'radio',
      options: ['REGULAR', 'LARGE'],
    },
  },
};
```

특정 컴포넌트의 스토리북에서 바꿔보고 싶은 인자를 미리 설정해서 편리하게 사용할 수 있다.

<img src="01.png" width="520px" />

---

## 질문하기

### Flux Architecture

- Flux는 MVC의 어떤 문제를 해결했을까?
- Flux 패턴의 다양한 구현 라이브러리가 있는 이유는 무엇일까?
- 이전 미션에서와 같이 React 자체에서 제공하는 방법으로만 상태를 관리하는 것에 비해 어떤 장점이 있을까요?

### Redux

- 3가지 원칙이 있는 이유는 무엇일까요?
- Flux와 다른 점이 무엇일까요?
- 불변성을 지키기위해 많은 노력이 들어가는데 꼭 지켜야할까요?

### Router

- 서버 사이드 라우팅으로 할 수 없는, 클라이언트 사이드 라우팅의 장점이 있을까요?
- 클라이언트 사이드에서 라우팅을 적용할 때, 대응해야 하는 케이스에는 어떤 것들이 있을까요?

---

## 기타

### React 꽃길만 걷기

**Styling**

- CSS 대신 PostCSS 등 SASS 툴 사용하기
- styled components 사용하기
- UI library 사용 지양

**함수 컴포넌트 사용하기**

- `useEffect`로 lifecycle API 흉내내기
- 다양한 내장 Hook, 반복되는 로직은 Custom hook으로 작성

**상태관리**

- Context API + useReducer
- Redux, Mobx는?
  ➡️ 미들웨어/ 리덕스 개발자도구/ 유틸함수 등 지원
- 스토어에 넣어야 하는 값: 이유가 있을 때만!
  - 상태를 다른 컴포넌트와 공유해야 할 때
  - 다른 컴포넌트에서 해당 값을 바꿔야 할 때
  - 컴포넌트 엄청 깊숙한 곳에서 상태를 필요로 할 때
  - 서버사이드 렌더링시에 데이터 재사용이 필요할 때

**Container & Presentational**
Container component에는 하나의 Presentational component만 있어도 된다.

**Reducer 똑똑하게 작성하기(객체화)**

```jsx
const counter = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};
```

대신 redux-actions, redux-act, typesafe-actions 등 사용 가능

```jsx
const counter = createReducer(
  {
    // (payload는 여기서 사실 필요 없음 - 이해를 돕기 위한 코드)
    [INCREMENT]: (state, { payload: null }) => ({
      ...state, count: state.count + 1
    }),
    [DECREMENT]: (state, { payload: null }) => ({
      ...state, count: state.count - 1
    }),
  },
  initialState,
)
```

**상태는 최대한 깊지 않게 관리**
만약에 깊어진다면 Immer.js 사용하기

**Ducks 패턴**
액션타입, 액션생성함수, 리듀서를 한 파일에 선언

**데이터 요청 상태 관리하기**
리덕스 미들웨어에서 받아오는 데이터 요청의 성공/실패 등 로딩 상태를 관리하는 리듀서 분리하기

**SSR(서버사이드렌더링)**
SEO를 위해선 필수!
Next.js를 사용할 수 있다.

**타입스크립트와 테스트 자동화 도입하기**

**Ref** https://drive.google.com/file/d/18MJDVzre8DYnEx9OITrYZOC_cVUeaSdV/view

### Redux 어떻게 써야 잘 썼다고 소문 날까?

**언제 리덕스가 필요할까?**

1. 리덕스를 사용한 개발 스타일이 너무 마음에 들 때
2. 미들웨어
3. 서버사이드 렌더링
4. 더 쉬운 테스팅
5. 컴포넌트가 아닌 곳에서 글로벌 상태를 사용하거나 업데이트를 해야할 때
6. 그냥 많이 사용돼서

**Ref** https://velog.io/@velopert/using-redux-in-2021

### 프론트엔드 웹서비스에서 우아하게 비동기 처리하기

**Ref** https://www.youtube.com/watch?v=FvRtoViujGg

---

## 마무리

다른 크루들과 오랜만의 회고 시간을 가지면서, 다들 하루하루 너무나도 벅찬 이 감정 상태와 고민을 공유했다. 확실히 다들 지쳐가는 게 보이긴 한다. 티는 안 내려고 하는 것 같지만… 다들 고민이 많은 것 같다. 나는 그런 고민할 시간도 힘도 없어서 그냥 오늘 하루만 알차게 보내자는 마음으로 살고 있는데. 말도 안 되는 소리긴 하지만, 일부러라도 여유를 조금 가지고 사는 편이 나은 것 같다. 스스로에게 질식 당하는 일은 너무 무서운 일이니까.
