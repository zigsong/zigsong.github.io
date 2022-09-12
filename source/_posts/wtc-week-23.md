---
title: 우테코 23주차 기록
date: 2021-07-11 22:15:10
tags: woowacourse
---

Git, Github 활용하기 | React App에서 svg 다루기 | babelrc vs webpack

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 놀토 프로젝트

### API 설계

백엔드 크루들과 API 명세를 함께 짰다. 스키마, api 등 각자 사용하는 명칭이 다르기도 했고, 세부적인 기능들의 request url을 query parameter(`/recent?filter=progress`)로 할 것인지 path variable(`recent/progress`)로 할 것인지에 대한 의견도 조금씩 갈렸다. 역시 같은 프로젝트를 한다고 해도 머릿속에 그리는 내용은 조금씩 다르다. 이래서 페어 프로그래밍, 협업의 과정이 정말 중요한 것 같다. 그래도 팀원들 모두 열정적이고 화기애애해서 합이 잘 맞아가는 것 같아 재미있다!

그밖에는 UI 틀을 어느 정도 잡고 프론트엔드 작업에 들어갔다.
github의 신기한 기능들을 접하면서 개발을 하니 정말 일하는 기분도 들고 설렌다.

### Git Flow

[우아한 형제들 기술 블로그](https://techblog.woowahan.com/2553/)를 참조하여 우리 팀만의 Git Flow를 정했다.

<img src="01.png" />

- `upstream/main` - 완전한 프로덕트가 배포될 브랜치
- `upstream/develop` - 실제 개발이 이루어지는 브랜치
- `upstream/release` - `release-1.0.0`과 같은 버전들로 구분한다. 특정 시점에 정해진 기능들을 하나의 단위로 모아 배포하기 위한 목적으로 분리하였다.
- `origin/feature/~~~end/XXX` - `frontend`, `backend`로 구분한다. 팀원들이 각자 fork한 자신의 레포지토리(`origin`)에 브랜치를 따서 맡은 기능을 작업한다. 작업 후에는 `develop`으로 PR을 보낸다.
- `origin/hotfix/~~~end/XXX` - `frontend`, `backend`로 구분한다. 버그가 생겼을 때 빠르게 수정한 후 `main`과 `develop` 브랜치로 merge한다.

**Ref** https://techblog.woowahan.com/2553/

---

## 프론트엔드 공부

### .babelrc와 webpack.config

🍀 [여기서 읽기](https://zigsong.github.io/2021/07/11/fe-babel-webpack/)

### CRA 없이 svg를 React component로 사용하기

🍀 [여기서 읽기](https://zigsong.github.io/2021/07/11/fe-svg-without-cra/)

---

## 공부하기

### PR, ISSUE 템플릿 등록하기

PR과 ISSUE를 등록할 때 사용할 템플릿을 미리 만들어둘 수 있다.
지금은 아래와 같이 3가지 템플릿으로 분리해 두었다.

<img src="02.png" />

**Ref**
https://soft.plusblog.co.kr/66

### CSS box-shadow vs filter: drop-shadow

CSS의 `box-shadow` 속성은 요소의 테두리를 감싼 그림자 효과를 추가한다.

```jsx
export const Card = styled.div`
  box-shadow: 4px 4px 8px 4px rgba(85, 85, 85, 0.2);
  // ...
`;
```

아무래도 ‘그림자’인만큼 빛이 투과하는 방향 한쪽으로만 shadow가 생긴다.
반대 대각선 방향으로도 shadow를 번지게 하고 싶다면 확산 정도를 나타내는 blur 옵션(4번째 인자)을 줄 수 있지만, 뭔가 불충분한 느낌이었다.

<img src="03.png" width="400px" />

이때 우연히 `filter: drop-shadow` 속성을 발견했다!

CSS `filter` 속성은 흐림 효과나 색상 변형 등 그래픽 효과를 요소에 적용한다.

```jsx
const Root = styled.form`
  // ...
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.25));
`;
```

<img src="04.png" width="400px" />

위와 같이 요소의 모든 stroke에 흐림 효과를 줄 수 있다.

**Ref**

- https://developer.mozilla.org/ko/docs/Web/CSS/box-shadow
- https://developer.mozilla.org/ko/docs/Web/CSS/filter

### storybook에서 절대경로 import

React App에서 컴포넌트드를 import할 때, 점이 많이 생기는 게 싫어서 절대경로로 import하는 것을 선호한다. 절대경로 import를 위해 **tsconfig.json**에서 `baseUrl`을 아래와 같이 설정했다.

```jsx
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "baseUrl": "src"
  },
}
```

그런데 storybook에서는 절대경로 import가 먹히지 않는다!

TypeScript 탓일까, storybook에서도 `webpack` 설정을 따로 해줘야 했다.
**.storybook/webpack.config.js**에 만들어줄 수도 있지만, **.storybook/main.js**의 `webpackFinal`에 config를 추가해주는 방법도 있다.

프로젝트에서 TypeScript를 사용할 때 alias(단축경로)를 쓰려면 **tsconfig.json**과 **webpack.config.js** 두 곳에 모두 설정을 추가해줘야 하는데, `tsconfig-paths-webpack-plugin`를 이용하여 간단히 해결할 수 있다.

```jsx
yarn add -D tsconfig-paths-webpack-plugin
// .storybook/main.js
const TsconfigPathsPlugin  = require('tsconfig-paths-webpack-plugin')

module.exports = {
  webpackFinal: async (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin({}));
    return config;
  },
};
```

**Ref**
https://bugtypekr.tistory.com/84

### Context Provider는 실제 DOM element일까?

React에서 `Context`로 감싼 요소는 실제 DOM element인지 궁금해졌다. (아닐 것 같지만)

```tsx
const ThemeContext = React.createContext("light");

const App = () => {
  return (
    <ThemeContext.Provider value="dark">
      <div>안녕하세요!</div>
    </ThemeContext.Provider>
  );
};
```

<img src="05.png" width="480px" />

역시 실제 DOM에 렌더링되는 것은 아니었다.

React devtools에서는 확인 가능하다.

<img src="06.png" width="480px" />

### extends `HTMLAttributes`

TypeScript를 이용하여 React App 개발 시, 컴포넌트에 들어갈 Props를 `extends`해서 사용할 수 있다. 특히 `button`과 같은 특정 목적을 가지는 컴포넌트의 경우 해당하는 html 태그의 기본 속성들을 확장해서 사용하면 유용하다.

```tsx
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle: ButtonStyle;
  reverse?: boolean;
  children: React.ReactNode;
}
```

`ButtonHTMLAttributes`는 아래와 같은 interface로 정의되어 있다. `<button>` 태그가 가질 수 있는 속성들이 optional로 나열되어 있다. `<T>` 자리에 알맞은 제네릭을 넣어주면 된다.

```tsx
interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
  autoFocus?: boolean;
  disabled?: boolean;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  name?: string;
  type?: "submit" | "reset" | "button";
  value?: string | ReadonlyArray<string> | number;
}
```

### storybook의 Controls와 Actions

storybook의 **Controls** 패널에서는 GUI로 컴포넌트의 인자들을 변경할 수 있다.

기본적으로 컴포넌트의 props 값들이 Controls 패널에 표시된다.

```tsx
const Toggle = ({ labelText = '', checked = false, onChange }: Props) => {
  return (
    // ...
  );
};
```

위 컴포넌트에는 props로 내려받는 `labelText`, `checked`, `onChange` 3개의 값이 들어간다.

<img src="07.png" width="520px" />

**Actions**에서는 이벤트 핸들러 콜백이 실행될 때의 데이터를 보여준다.

```tsx
export default {
  title: "components/common/Toggle",
  component: Toggle,
  argTypes: { onClick: { action: "toggled" } },
};
```

이렇게 해주거나, 아래처럼 `on`으로 시작하는 모든 action들을 감지하게끔 작성해 준다.

```tsx
export default {
  title: "components/common/Toggle",
  component: Toggle,
  parameters: { actions: { argTypesRegex: "^on.*" } },
};
```

또는 **.storybook/preview.js**에 미리 `parameters`를 등록해줄 수도 있다.

```tsx
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

<img src="08.gif" width="520px" />

**Ref**

- https://storybook.js.org/docs/riot/essentials/controls
- https://storybook.js.org/docs/riot/essentials/actions

---

## etc

### 모바일에서 localhost 환경 구성하기

[우테코 크루의 정리글](https://www.notion.so/localhost-aa4d8d08bf2344c4b2893698ca7009e8)

**Ref**
https://chinsun9.github.io/2021/07/01/remote-debug-android-chrome/

### useMemo, useCallback은 언제 써야하는가?

**Ref**
https://haragoo30.medium.com/usememo-usecallback을-언제-써야되나-6a5e6f30f759

---

## 마무리

UI를 어느 정도 마무리 짓고 프론트엔드 개발에 들어갔다.
우리 팀만의 git flow도 정하고 github도 이것저것 설정하고 나니 정말 일하는 기분이 든다.
아직 시작 단계라 몰아치는 게(?) 많은데, 페이스를 잃지 않고 끝까지 무사히 완주했으면 좋겠다!
