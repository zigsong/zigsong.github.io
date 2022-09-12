---
title: Next.js 없이 React 앱 SSR 적용하기
date: 2021-10-02 18:53:39
tags: react
---

SSR | express | hydration

<!-- more -->

<img src="/images/thumbnails/react-thumbnail.png" />

세상에 어떤 사람들이 Next.js를 사용하지 않고 리액트 앱을 SSR로 마이그레이션할까 싶지만… 우리는 해낸다!

🐭 [페어 미키의 글](https://tecoble.techcourse.co.kr/post/2021-09-10-ssr/)에도 비슷한 내용이 정리되어 있다.

---

## webpack.server.js 세팅

`module`과 같은 기본적인 세팅은 기존의 클라이언트 webpack 설정과 비슷하게 작성해주었다. server용 webpack 설정에서 눈여겨볼 부분은 아래와 같다.

```jsx
// webpack.server.js
const path = require('path');
const nodeExternals = require('webpack-node-externals'); // 1️⃣

module.exports = {
  entry: './server/index.tsx', // 2️⃣
  output: {
    path: path.resolve(__dirname, 'dist-server'), // 3️⃣
    filename: '[name].js',
    publicPath: '/',
    clean: true,
  },
  target: 'node', // 4️⃣
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  module: {
    // ...
  }
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  externals: [nodeExternals()], // 1️⃣
};
```

- 1️⃣ **webpack-node-externals** 라이브러리를 통해 node_modules 패키지들을 번들에서 제외(`import`-`export`로 서로 의존하는 파일들을 번들 파일에 모두 넣는 것을 방지)하기 위해 사용한다. 서버의 실행 환경이 될 node는 node_modules의 패키지들을 이미 가지고 있기 때문에 빌드 과정에서 제외시켜, 빌드 시간을 단축하고 불필요한 모듈들의 의존성을 제거할 수 있다.
- 2️⃣ webpack 번들링의 시작점을 server 파일로 잡아준다.
- 3️⃣ server 번들링 결과물을 `dist-server`라는 디렉토리에 넣어준다.
- 4️⃣ server 번들링 파일이 실행되는 환경은 web이 아닌 node이므로 `target`에 작성해준다.

---

## server 파일 작성

node 서버 실행을 위해 express 프레임워크를 사용할 것이기 때문에 express를 설치해 준다.

```
$ yarn add express
$ yarn add -D @types/express
```

기본 코드는 아래와 같이 작성했다.

```tsx
// server/index.tsx
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

import express from "express";
import path from "path";
import fs from "fs";

import App from "../src/App";

const PORT = process.env.PORT || 9000;
const app = express(); // 1️⃣
const sheet = new ServerStyleSheet(); // 2️⃣

app.use(express.json()); // 3️⃣

app.use(express.static(path.resolve(__dirname, "../dist"))); // 4️⃣

app.get("/", async (req, res) => {
  // 5️⃣
  const reactApp = ReactDOMServer.renderToString(
    // 6️⃣
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </StyleSheetManager>
  );

  const styleTags = sheet.getStyleTags(); // 2️⃣

  const indexFile = path.resolve(__dirname, "../dist/index.html"); // 7️⃣

  fs.readFile(indexFile, "utf8", (err, data) => {
    // 8️⃣
    if (err) {
      console.error("Node.js 서버에서 에러가 발생했습니다.", err);
      return res.status(500).send("서버에서 에러가 발생했습니다. 🔫");
    }

    const result = data
      .replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`) // 9️⃣
      .replace(/<head>(.+)<\/head>/s, `<head>$1 ${styleTags}</head>`); // 2️⃣

    return res.send(result); // 🔟
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

숫자 이모지가 🔟까지밖에 없어서, 최대한 분리해보았다 😬

- 1️⃣ express 앱을 생성한다.
- 2️⃣ 클라이언트의 리액트 앱에서 styled-components를 사용하고 있기 때문에, 미리 스타일링 코드를 받아서 서버에서 내려주기 위한 용도로 사용한다. 클라이언트에 전달할 `<head>` 태그 안에 심어서 보내준다.
- 3️⃣ express 서버에서 json으로 이루어진 request body를 받았을 경우 이를 해석하기 위해 사용하는 메서드다. express v4 이전까지는 `body-parser`라는 별도의 모듈을 설치해 사용했다.
- 4️⃣ 이미지, CSS 파일 및 JavaScript 파일과 같은 정적 파일을 제공하기 위해서 사용하는 express의 기본 제공 미들웨어 함수이다. webpack 빌드 시 생성되는 파일들을 불러오기 위해 사용한다.
- 5️⃣ root url(`/`)로 들어오는 요청을 처리한다.
- 6️⃣ `ReactDOMServer`는 컴포넌트를 정적 마크업으로 렌더링할 수 있게 해주는 객체로, 주로 Node 서버에서 사용한다. `renderToString`는 리액트에서 지원하는 서버사이드 렌더링 메서드로, 리액트 엘리먼트의 초기 HTML을 렌더링한다. 클라이언트 리액트 코드의 `hydrate`와 함께 사용한다.
- 7️⃣ 번들 파일이 위치한 디렉토리의 html 파일을 가져온다.
- 8️⃣ node에서 기본으로 제공하는 file system 모듈로, 파일을 읽고 쓸 수 있는 메서드를 제공한다. 여기서는 번들 결과의 html 파일을 읽어 클라이언트에 내려주기 위한 목적으로 사용한다.
- 9️⃣ 번들 결과의 html 파일을 가져왔다면, 리액트 앱이 시작되는 `<div id="root">`에 아까 `renderToString`으로 마크업한 기본 HTML 파일을 심어준다.
- 🔟 express 서버에 요청을 보낸 클라이언트에 지금까지 생성한 응답을 반환한다.

> **👾 path.join vs path.resolve**
>
> **path.join**은 나열된 인자들을 순서대로 연결해주기만 한다.
>
> 반면 **path.resolve**는 현재 디렉토리를 기반으로 절대경로의 URL을 반환한다. 전달 받은 인자들의 오른쪽부터 왼쪽으로 인자를 합쳐나가며, 이 과정에서 ‘/‘를 만나면 절대경로로 인식해서 나머지 인자들을 무시한다.
> 만약 ‘/‘를 끝까지 만나지 못한다면 ‘/현재경로/생성된경로’ 형태로 결과를 리턴한다.
>
> ```
> path.join('/a', '/b'); // 'a/b'
> path.resolve('/a', '/b'); // '/b'
> ```

---

## React hydration

위와 같이 서버를 구성했다면, 기존 리액트 렌더링 코드도 조금 수정해줘야 한다. SSR을 적용한 리액트 앱은 hydration을 수행한다. hydration은 직역하면 수분화, 즉 수분을 보충하는 행위다.

지금까지는 아래 코드를 통해 브라우저 DOM에 리액트 코드를 삽입했다.

```jsx
ReactDOM.render(element, container[, callback]);
```

컨테이너 DOM에 리액트 엘리먼트를 렌더링해준다. 컨테이너의 자식으로 리액트 컴포넌트를 넣어주는데, 기존에 이미 렌더링된 리액트 컴포넌트가 있다면 새로 렌더링하는 것이 아니라 업데이트만 해준다. 그리고 렌더링이 완료되면 세 번째 인자로 전달된 콜백을 실행한다.

SSR을 사용할 때는 `ReactDOM.hydrate` 메서드를 사용한다. hydrate는 렌더링은 하지 않고 이벤트 핸들러만 붙여준다. 서버에서 이미 마크업된 결과물을 가져오므로 모든 걸 다시 render해줄 필요가 없다.

```jsx
ReactDOM.hydrate(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
```

서버는 dehydration을 통해 동적인 컴포넌트를 정적으로 만들어서 완성된 HTML을 보내준다. 클라이언트(리액트 앱)는 서버로부터 받은 정적인 HTML을 동적인 리액트 컴포넌트 트리로 변환하는데, 이것을 (re)hydrate라고 한다. hydrate이 완료된 이후부터는 컴포넌트를 리액트가 관리하게 된다.

이렇게 첫 페이지에 대한 SSR을 우선적으로 완료했다! `node` 명령어로 앱 실행 후 브라우저를 열어 확인해보자.

```
$ node ./dist-server/main.js
```

개발자 도구의 네트워크 탭을 열어보면, 서버에서 만든 응답에서부터 이미 모든 HTML 요소들이 마크업되어 내려오는 것을 확인할 수 있다. (왜 Happy Chuseok이 뜨는지는…)

<img src="01.png" />

---

## loadable components와 연결

현재 리액트 앱에서 코드 스플리팅을 위해 [loadable components](https://loadable-components.com/)를 사용하고 있는데, SSR을 적용할 경우 서버에서도 관련된 처리가 필요하다.

> **👾 SSR에서 코드 스플리팅이 필요한 이유**
>
> 기본적으로 코드스플리팅된 파일들은 main.js를 모두 로드하고 나서야 로드된다. 이게 바로 서버사이드 렌더링용 코드 스플리팅이 필요한 이유다. 현재는 코드를 나누기만 했을 뿐 결국 하나의 번들과 똑같은 로딩시간을 필요로 한다. 오히려 서버에 요청하는 request 횟수만 늘린 꼴이 된다.
>
> ex) About 페이지로 초기 진입(혹은 새로고침)했을 때, SSR 코드스플리팅이 적용되어 있지 않았다면 main에서 필요한 코드를 모두 가져온 후 main에서 About 페이지 접속 시 다시 About 청크 파일에 대한 요청을 한다. 이는 SSR을 활용하지 못하고 있는 셈이다.
>
> 따라서 SSR에도 코드스플리팅을 적용하여 초기 진입 페이지에서 필요한 JS 파일을 `<script>` 태그에 넣어서 병렬적으로 로드한다.

우선 babel이 loadable component를 이해할 수 있도록 서버용 webpack 설정에 `@loadable/babel-plugin`을 넣어준다.

```
$ yarn add -D @loadable/babel-plugin
```

```jsx
// webpack.server.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                // ...
              ],
              plugins: [
                // ...
                '@loadable/babel-plugin',
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
}
```

그리고 loadable components들을 번들링한 결과물을 json 형태의 파일로 추출하기 위해 기존 webpack 설정에 `@loadable/webpack-plugin`을 추가한다.

```
$ yarn add -D @loadable/webpack-plugin
```

```jsx
// webpack.common.js
const LoadablePlugin = require("@loadable/webpack-plugin");

module.exports = {
  // ...
  plugins: [
    // ...
    new LoadablePlugin(),
  ],
};
```

이 상태로 빌드(클라이언트)를 하면, dist 폴더 안에 `loadable-stats.json` 파일이 생성된다. 내용물은 대략 아래와 같다.

```json
{
  "hash": "584b21677c2d7ccac8e5",
  "publicPath": "/",
  "outputPath": "/Users/songji/Desktop/woowacourse/lv3/2021-nolto/frontend/dist",
  "assetsByChunkName": {
    "main": [
      "main.55573f72591fb92bbd79.js"
    ],
    "About": [
      "About.68ffc067e6ca06e7f93c.js"
    ],
    "vendor": [
      "vendor.8782ff7e073e2517c89c.js"
    ],
    // ...
  },
  "assets": [
    {
      "type": "asset",
      "name": "vendor.8782ff7e073e2517c89c.js",
      "size": 528835,
      "emitted": false,
      "comparedForEmit": false,
      "cached": true,
      "info": {
        // ...
      },
      // ...
      "chunkNames": [
        "vendor"
      ],
      "chunkIdHints": [
        "vendor"
      ],
      // ...
    },
    // ...
}
```

이제 이 json 파일을 서버에서 불러와서 chunk 파일로 분리해줄 것이다.

```tsx
// server/index.tsx
import { ChunkExtractor } from '@loadable/server';

// chunk 정보를 담고 있는 json 파일을 불러온다.
const statsFile = path.resolve(__dirname, '../dist/loadable-stats.json');

const extractor = new ChunkExtractor({ statsFile });

app.get('/', async (req, res) => {
  const jsx = extractor.collectChunks(
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </StyleSheetManager>,
  );

  const scriptTags = extractor.getScriptTags();

  const reactApp = ReactDOMServer.renderToString(jsx);

  // ...
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      // ...
    }

    const result = data
      .replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
      .replace(/<head>(.+)<\/head>/s, `<head>$1 ${styleTags} ${scriptTags}</head>`); // head 태그에 scriptTags 삽입

    return res.send(result);
  });
}
```

loadable로 분리된 청크 파일들이 모두 병렬적으로 로드되어 scripts에 들어갈 때까지 기다리도록 리액트 진입점의 코드도 수정해준다.

```tsx
// src/index.tsx
import { loadableReady } from "@loadable/component";

// loadableReady로 감싸준다.
loadableReady(() => {
  ReactDOM.hydrate(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
```

About 페이지에서 접속 시 아래와 같이 script 태그로 About의 청크 파일을 불러오는 것을 볼 수 있다. 다른 페이지에서부터 리액트 라우터를 통해 접속 시에는 여기서 가져오지 않고, 클라이언트에서 새로 요청을 통해 받아온다.

(서버 코드 파일에서 ‘/about’ url 요청에 대한 처리를 위해 `app.get` 코드도 추가해준 상태다.)

<img src="02.png" />

---

## React 18 설치

짜잔! … SSR이 정상적으로 적용된 줄 알았더니, 한 가지 고비가 더 있었다.

```
Error: ReactDOMServer does not yet support Suspense.
```

😑

그렇다. loadable components는 SSR을 지원하지만, Suspense까지는 지원하지 않는 것이었다. 그래서 코드 스플리팅 도구를 선택할 때, Suspense를 필수적으로 써야하는 `React.lazy`는 SSR을 지원하지 않는다고 한 것 같다.

react-query까지 이용하는 마당에 Suspense를 걷어낼 수는 없어서, 불과 몇 달 전 발표된, Suspense를 지원하는 React 18을 사용하기로 했다!

```
$ yarn add react@alpha react-dom@alpha
```

React 18의 최신 기능에 대한 내용은 [여기](https://zigsong.github.io/2021/10/03/react-18/)서 확인할 수 있다.

---

## TroubleShooting

### node에서는 못 찾는 window 분리하기

(아직 해결 중인 문제)

localStorage나 window.Kakao 등 `window` 객체에 접근해야 하는 코드가 이곳저곳 산발되어 있었는데, node 서버로 실행한 환경에는 window가 없다. 문제를 해결하기 위해 급한 대로 말도 안 되는 이름(windowDetector)의 util을 만들어 node 환경에서는 window를 실행하는 코드를 무시하고 넘어가도록 했다.

```jsx
// windowDetector.js
const hasWindow = typeof window !== "undefined" ? true : false;

export default hasWindow;
```

사용하는 곳에서는 대략 이런 느낌…

```jsx
if (process.env.KAKAO_API_KEY && !window.Kakao.isInitialized()) {
  if (hasWindow) {
    window.Kakao.init(process.env.KAKAO_API_KEY);
  }
}
```

### ESModule 타입의 패키지를 nodeExternals에서 제외하기

(아직 해결 중인 문제)

서버 번들링 파일에서 node_modules를 제외하기 위해 webpack-node-externals를 사용했다. 그 결과 node_modules로 설치한 패키지들은 번들 파일에 모두 들어가지 않고, 개별적으로 `require` 메서드를 통해 불러오게 된다.

그런데! 프로젝트에서 사용하고 있는 라이브러리 중 react-markdown이 `require`를 사용하는 CommonJS 형태의 모듈 방식을 지원하지 않아 문제가 발생했다. (해당 라이브러리의 package.json을 보면 `"type": "module"`이라고 적혀있는 것을 확인할 수 있다.)

> Must use import to load ES Module:

그래서 이 친구는… `externals`에서 제외시켜줘야 한다. 다행히 `allowlist` 옵션을 통해 원하는 모듈만 번들에 다시 포함시킬 수 있게 해줄 수 있을 줄 알았는데, peerDependency 문제인지 하나를 해결하면 줄줄이 다 위와 같은 에러가 발생하여 일단은 어디까지 가나 보자, 하는 심정으로 모조리 넣어주었다. 굉장히 못생긴 코드가 탄생했고, 다른 방법을 계속해서 찾아볼 예정이다. 😑

```jsx
// webpack.server.js
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // ...
  externals: [nodeExternals()]
}
externals: [
  nodeExternals({
    allowlist: [
      'react-markdown',
      'unified',
      'bail',
      'is-plain-obj',
      'trough',
      'remark-rehype',
      'mdast-util-to-hast',
      'unist-util-generated',
    ],
  }),
],
```

### 서버의 express.static이 index.html을 가져가버리는 문제

```tsx
// server/index.tsx
app.use(express.static(path.resolve(__dirname, "../dist")));

app.get("/", async (req, res) => {});
```

위와 같이 작성하면, ‘../dist’ 폴더로 접근했을 때의 root url(`/`)이 index.html을 가리키고 있기 때문에 클라이언트에서 root url로 요청을 보내는 경우 `app.get` 요청까지 갈 수가 없어 원하는 응답을 받을 수 없다.

아래와 같이 `{ index: false }` 옵션을 제공하여 `static` 미들웨어가 root url(`/`)에서 index.html을 포함시킬 수 없도록 해주면 문제가 해결된다.

```tsx
// server/index.tsx
app.use(express.static(path.resolve(__dirname, "../dist"), { index: false }));
```

---

## 정리

최종적으로 작성한 코드는 다음과 같다. (아마 수정될 것이다)

```tsx
// server/index.tsx
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { ChunkExtractor } from "@loadable/server";

import express from "express";
import path from "path";
import fs from "fs";

import App from "../src/App";

const PORT = process.env.PORT || 9000;
const app = express();
const sheet = new ServerStyleSheet();

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../dist"), { index: false }));

const statsFile = path.resolve(__dirname, "../dist/loadable-stats.json");

const extractor = new ChunkExtractor({ statsFile });

app.get(["/", "/about", "/feeds/:feedId"], async (req, res) => {
  const jsx = extractor.collectChunks(
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </StyleSheetManager>
  );

  const scriptTags = extractor.getScriptTags();

  const reactApp = ReactDOMServer.renderToString(jsx);

  const styleTags = sheet.getStyleTags();

  const indexFile = path.resolve(__dirname, "../dist/index.html");

  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Node.js 서버에서 에러가 발생했습니다.", err);
      return res.status(500).send("서버에서 에러가 발생했습니다. 🔫");
    }

    const result = data
      .replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
      .replace(
        /<head>(.+)<\/head>/s,
        `<head>$1 ${styleTags} ${scriptTags}</head>`
      );

    return res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

```jsx
// webpack.server.js
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./server/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist-server"),
    filename: "[name].js",
    publicPath: "/",
    clean: true,
  },
  target: "node",
  mode: process.env.NODE_ENV !== "production" ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              plugins: [
                "@babel/plugin-transform-runtime",
                "babel-plugin-styled-components",
                "@loadable/babel-plugin",
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(png|jpe?g|gif|webp|mp4)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  externals: [
    nodeExternals({
      allowlist: [
        "react-markdown",
        "unified",
        "bail",
        "is-plain-obj",
        "trough",
        "remark-rehype",
        "mdast-util-to-hast",
        "unist-util-generated",
      ],
    }),
  ],
};
```

```tsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { loadableReady } from "@loadable/component";

import App from "./App";

loadableReady(() => {
  ReactDOM.hydrate(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
```

(추가) react-query 데이터 prefetch와 React Portal 문제 해결
🍀 [여기서 읽기](https://zigsong.github.io/2021/10/09/wtc-week-34/)

---

**Ref**

- https://simsimjae.tistory.com/389
- https://minoo.medium.com/next-js-처럼-server-side-rendering-구현하기-7608e82a0ab11
- https://www.digitalocean.com/community/tutorials/react-server-side-rendering
- https://www.npmjs.com/package/webpack-node-externals
- https://jamong-icetea.tistory.com/349
- https://ko.reactjs.org/docs/react-dom-server.html
- https://www.hanumoka.net/2018/11/08/node-20181108-node-path-join-vs-resolve/
