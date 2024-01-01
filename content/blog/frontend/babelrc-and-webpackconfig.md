---
title: babelrc와 webpack.config
date: 2021-07-11 22:23:28
tags: ["frontend"]

---

babelrc와 webpack.config

<!-- more -->

---

webpack으로 React App 세팅을 설정해나가다가, TypeScript 설정을 위해 `@babel/preset-typescript`를 설치하게 되었다.

[babel 공식 문서](https://babeljs.io/docs/en/babel-preset-typescript)를 따라 모듈을 세팅하다가,

```jsx
{
  "presets": ["@babel/preset-typescript"]
}
```

위 코드의 `presets`가 **.babelrc**에 있어야 하는지, **webpack.config.js**에 있어야 하는지 알 수 없어 각 파일의 목적을 알아보았다.

**.babelrc**는 `babel`의 설정을 위해 사용한다.

```jsx
// .babelrc.json
{
  "presets": [...],
  "plugins": [...]
}
```

물론 **webpack.config.js**는 `webpack`의 설정을 위해 사용한다. 프로젝트 파일의 번들링과 관련된 설정들을 작성해준다.

```jsx
// webpack.config.js
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: { ... },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        ],
        exclude: /node_modules/,
      },
      // ...
    ],
  },
  resolve: { ... },
  plugins: [ ... ],
  mode: 'development',
};
```

`babel`과 관련된 설정들을 **.babelrc**가 아닌 **webpack.config.js**에서 `babel-loader`를 설정한 부분에 작성해줄 수도 있다

결론은, `babel`의 `presets`는 **webpack.config.js**와 **.babelrc** 파일 둘 중 한 곳에만 있으면 된다! 그러나 babel cli를 이용하여 직접 코드 변환을 수행하거나 babel test 등을 돌릴 때에는 `webpack`을 거치지 않기 때문에 **.babelrc**에 작성하는 방식이 권장된다,

> 👾 **babel.config** vs **.babelrc**
>
> - **babel.config**은 여러 디렉토리를 포함하는 프로젝트 전체의 구성에 주로 사용된다.
> - **.babelrc**는 서브 디렉토리에서 특정한 플러그인 사용 시 유용하다.

---

**Ref**

- https://babeljs.io/docs/en/configuration
- https://webpack.js.org/configuration/
- https://stackoverflow.com/questions/43206062/- why-do-i-have-to-put-babel-presets-inside-babelrc-and-webpack-config-js
- https://stackoverflow.com/questions/56463846/should-i-configure-babel-through-babelrc-or-webpack
- https://kschoi.github.io/cs/babel-config-js-vs-babelrc/
