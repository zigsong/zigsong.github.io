---
title: CRA 없이 svg 사용하기
date: 2021-07-11 22:22:02
tags: frontend
thumbnailImage: https://i.imgur.com/2Dqm3wS.jpg
---

CRA 없이 svg를 React component로 사용하기

<!-- more -->

---

그동안은 CRA로만 리액트 앱을 만들어왔는데, webpack 설정부터 하나하나 하고 보니 svg가 먹통이었다. 원래 svg는 따로 설정을 해줘야 하는데, CRA에서는 알아서 해주고 있던 것이었다. 이제 스스로… 하나하나 해결해 보자.

### 1. `@svgr/webpack` 설치

```shell
yarn add -D @svgr/webpack
```

CRA에서는 svg를 자동으로 처리해주지만, CRA를 사용하지 않은 경우 webpack config를 통한 사용 설정이 필요하다.

```jsx
// webpack.config.js
module: {
  rules: [
    // ...
    {
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    },
  ],
},
```

### 2. **custom.d.ts** 생성

TypeScript는 svg 확장자를 알지 못하기 때문에, 타입 정의가 필요하다.

```tsx
declare module "*.svg" {
  const content: string;
  export default content;
}
```

**tsconfig.json**에도 해당 파일을 추가해준다.

```tsx
// tsconfig.json
{
  // ...
  "include": ["src", "custom.d.ts"]
}
```

이제 아래와 같이 svg 파일을 React Component로 import하여 사용할 수 있다.

```tsx
// Card.tsx

import Flag from "assets/flag.svg";

const StretchCard = () => {
  return <Flag />;
};
```

그런데 이렇게 하면 svg 파일을 React component로밖에 사용하지 못한다.
아래 두 가지 방법 모두 사용할 수 있다면 좋을 텐데, **custom.d.ts**에 svg 모듈을 어떻게 두 가지 방식으로 설정해야 하는지 마땅한 해결책을 아직 찾지 못했다.

```tsx
// 1. svg를 React component로 사용하는 방법
import { ReactComponent as Flag } from "assets/flag.svg";

const StretchCard = () => {
  return <Flag />;
};
```

```jsx
// 2. svg를 React component로 사용하는 방법
import flag from "assets/flag.svg";

const StretchCard = () => {
  return <img src={flag} />;
};
```

### storybook 설정

storybook의 fileLoader 기본 설정 rule에서 svg를 제거하고, `svgr` 모듈을 사용하도록 수정한다. modules 배열은 사용하는 라이브러리를 오른쪽에서부터 읽기 때문에, override할 라이브러리를 `unshift`로 가장 앞에 넣어준다.

```jsx
// .storybook/main.js
webpackFinal: (config) => {
  const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'));
  fileLoaderRule.exclude = /\.svg$/;

  config.module.rules.unshift({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });

  return config;
},
```

---

**Ref**

- https://blog.doitreviews.com/development/2020-05-08-react-svg-usage-with-webpack/
- https://bogmong.tistory.com/19
