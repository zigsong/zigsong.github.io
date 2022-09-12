---
title: 우테코 8주차 기록
date: 2021-03-27 09:09:52
tags:
---

우테코 8주차 기록

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

벌써 8주차, 2달이 지났다. lv1이 끝나간다. 다음 레벨부터는 글 제목을 ‘회고’ 대신 ‘이야기’로 해보면 어떨까 생각이 든다. ‘회고’라고 하니까, 미션마다 주어지는 회고 같아서. 😬

## 페어 프로그래밍

- 확실히 매일 5분씩이라도 그날의 회고를 남겨놓는 게 좋다. 오늘 뭘 배우고 적용했는지, 무슨 문제로 토론하거나 삽질했는지, 그날의 기분은 어땠는지 돌이켜볼 수 있다.
- 1단계 이후 대공사를 마무리했다. 다행히도 큰 문제없이 머지되었다.
- API 상의 이슈가 많아 크루들, 코치들과 많은 이야기를 나누었다. 백엔드와 소통하다보니 정말 현업하는 것 같은 느낌도 살짝 든다. (아님)
- 정규표현식, 웹 접근성 등 서니의 변태스러운(!) 집착들을 배웠다.
- 서로 조금 지치거나 생각할 시간이 필요할 때 말을 잘 하지 못해 불편했던 부분들이 있었는데, 회고 시간을 가지면서 발전적으로 함께 이야기를 나눌 수 있었다.
- 서니와 닭발에 소주 먹으러 가자는 이야기를 했다.

---

## 포수타

- 레벨 3,4에서 진행하는 서비스 개발은 기업협력 서비스가 될 수도 있다고 한다! 😮 그때쯤이면 내 실력이 얼만큼 향상됐을지, 어떤 서비스를 만들고 있을지 궁금하다.
- 방학이 다가오니 lv1에서 미뤘던 부분들을 잘 마무리하자!

---

## 테코톡

이번주 주제는 유조의 Callback!
무시무시하고 인상 깊은 발표자료를 준비했다.

callback 함수의 문제는, 중첩 시 가독성이 매우 떨어지는 callback 지옥을 경험하게 된다는 것이다. 😱

```jsx
setTimeout((name) => {
  let names = "";

  if (!name) {
    throw new Error("이름을 찾을 수 없습니다.");
  } else {
    names += name;
    console.log(names);
  }
  setTimeout((name) => {
    if (!name) {
      throw new Error("이름을 찾을 수 없습니다.");
    } else {
      names += name;
      console.log(names);
    }

    setTimeout((name) => {
      if (!name) {
        throw new Error("이름을 찾을 수 없습니다.");
      } else {
        names += name;
        console.log(names);
      }
    }, 500);
  }, 400);
}, 500);
```

`Promise`는 callback 지옥에서 개발자를 구원해준다.
비동기 작업이 넘어올 때, `resolve`와 `reject`를 통해 각각 성공/실패한 경우를 처리한다.

`async-await`은 ES6에 추가된 `Promise`의 syntactic sugar이다.
함수 앞에 `async`를 명시하여 비동기 함수의 실행을 기다릴 수 있다.

```jsx
const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const doSomething = async () => {
  await delay(1000);
  console.log("우아한");
  await delay(1000);
  console.log("테크코스");
};

doSomething();
```

---

## 👨‍🏫 강의

### 지하철 노선도 미션 공통 피드백 - 1

**명확한 계층 분리**
어떤 크루의 멋진 코드 😮

```jsx
const accessToken = {
  value: "",
  init() {
    // ...
  },
  set(newAccessToken, keepLogin = false) {
    // ...
  },
  clear() {
    this.value = "";
    // ...
  },
  get() {
    return this.value;
  },
};
```

**HoC를 이용한 네비게이션 보디가드**
바닐라로 리액트 컴포넌트를 잘 구현했던 크루의 코드다. 로그인의 여부에 따라서 갈 수 있는 경로를 구분해 준다.
과연 여기서 `authenticatedRoute`와 `unauthenticatedRoute`는 어떤 식으로 작성된 코드일 지 생각해보자 🤔 (생각보다 복잡하지 않다!)

```jsx
const routeHandler = {
  "/": () => authenticatedRoute(mountStations),

  "/login": () => unauthenticatedRoute(mountLogin),
  "/signup": () => unauthenticatedRoute(mountSignup),

  "/search": () => authenticatedRoute(mountSearch),
  "/sections": () => authenticatedRoute(mountSections),
  "/stations": () => authenticatedRoute(mountStations),
  "/map": () => authenticatedRoute(mountMap),
  "/lines": () => authenticatedRoute(mountLines),
};
```

## 셀프 리뷰 - 행운의 로또

이번에도 한 달 전 진행한 미션에 대한 셀프 리뷰를 진행했다.

- 내가 생각했을 때 바보 같지만 나눠보고 싶은 질문
  - 하나의 블록 내부에서 변수를 먼저 모두 선언하고 아래에 함수들을 정의하는 게 좋을지, 아니면 변수와 함수 선언이 조금 번갈아가며 나오더라도 의미상으로 관련 있는 코드들끼리 묶는 게 좋을지? 🤔
- 그때는 몰랐지만 지금은 알 수 있는 것

  - `HTMLFormElement.elements`를 사용하여 폼 컨트롤이 되는 대상들의 목록을 쉽게 가져올 수 있다. 하나의 form 안에 있는 여러 input의 값을 가져오는 데에 유용하다.
  - model에 너무 많은 역할을 부여하지 말자

- 그때도 몰랐고 아직도 잘 모르겠는 것

  - `createElement`를 사용해도 될까? 속성들까지 붙이기엔 코드가 조금 과해지는 것 같기도 하다. `innerHTML`은 XSS 공격 등에 취약하다는데, JavaScript로 만드는 DOM 요소를 어떻게 붙여 넣는 것이 가장 좋은 방식일까?
  - 웹 접근성을 충분히, 진지하게 고민하진 않은 것 같다 😅

- 반복되고 있는 실수 및 습관이 있다면?
  - `id`와 `class`를 기준 없이 생각나는 대로 사용하고 있다
  - 반복적으로 특정 부분을 실수하기보다는, 많은 내용들을 별 생각 없이 가져다 쓰는 것이 큰 문제 😞
    기존에 작성하던 방식에서 코드를 단순히 가져와서 사용한 경우는 없는지
  - `CustomEvent`에 대한 근본적인 이해 없이 이전 단계들에서 페어가 만들어 준 class를 기계적으로 상속 받아 사용하고 있었다.
- 확실하게 말할 수 있는 발전한 1가지
  - 다른 미션을 진행하며 혼자 `CustomEvent`를 찾아보면서, 사용하는 패턴과 방식을 익혀 조금 더 자연스럽게 쓸 수 있게 되었다
  - 함수의 목적과 의도가 잘 드러나게끔, 하나의 함수는 하나의 일만 하게끔 작성하는 습관을 조금이나마 들인 것 같다.
    다시 로또 미션 코드를 작성한다면 어떻게 작성할 것인가?
  - 코드를 읽는 사람이 별도 설명 없이 코드만 보고 알아차릴 수 있게끔 작성하기
  - 사용자의 입장에서 프로세스가 진행되는 논리 단계에 따라 코드를 작성하기
  - `view`는 여러 개 인데 `controller`를 하나만 쓰다보니 파일이 방대해졌다. 설계를 잘 잡고, `controller`도 역할 별로 분리시킨다면 더욱 깔끔해질 것이다.

---

## SMART한 페어와의 회고

**창의성**
부정적인 분위기가 우리의 창의력 수준을 떨어뜨릴 수 있고 긍정적인 감정 상태가 창의력을 촉진해 문제 해결에 도움이 된다.

창의성이 가장 필요할 때 창의성 발휘가 좀처럼 잘 되지 않는, “창의성의 아이러니 제2법칙”

**터널 비전**
부정적인 감정이 들면 눈의 창문이 더욱 좁아진다. 이런 식으로 악순환이 될 것이다.프로그래머나 테스터라면 이런 경험이 매우 친근할 것이다. 화면에 에러가 뜬다. 호흡이 가빠지고 머리로 열이 오르기 시작한다. 왜 안 되지? 이상하네. 다시 한 번 해본다. 또 안 된다. 머리 부하가 높아진다. 한참을 헤매다가 원인을 찾아냈다. 욕이 절로 나온다. 너무도 뻔한 실수였다. 수십 번 훑어본 소스 코드에, 그리고 구글 검색까지 해본 에러 메시지에 분명히 원인이 드러나 있는데 무슨 숨은 그림 찾기도 아니고 도무지 눈에 보이지 않았다.

**1. 다른 사람 활용하기**
내가 찾지 못하는 물건을 엄마는 항상 잘 찾는다. 다른 사람에게 부탁하자. 내 방을 잘 모르는 사람일수록 더욱 좋다.

그 사람은 나와 다르다. 나와 다른 부분에 주목한다. 시야각이 확장된다. 이를 인지적 유연성이라고 한다.

코딩하다 삽질을 30분 이상 하고 있는 것 같으면, “🙋‍♀️삽질!”하고 외쳐 주변 개발자들에게 도움을 구하자.

**2. 마법의 주문**
스스로에게 전하는 마법의 주문, “Hm… That’s interesting! 😲”

**3. 기분 전환**
오늘 저녁 맥주 한잔? 🍻

**4. 자신의 반응을 선택하기**
현재 스트레스 수준과 감정 상태를 인지하고 스스로를 돌아본다. ‘아, 내가 지금 당황하고 있구나. 머리에 열이 나네. 얼마 동안 삽질했구나. 어떻게 해야 할까?’

“당신은 자신에게 일어나는 사건(event)을 통제할 수는 없습니다. 하지만 그 사건에 대한 자신의 반응(reaction)을 통제할 수 있습니다.”

**SMART 회고**

- Specific, 구체적이고
- Measurable, 측정할 수 있고
- Achievable, 달성 가능하며
- Relevant, 적절하고
- Timely, 시기 적절한

**논리에 대한 환상**
인간은 컴퓨터가 아니기 때문에, 논리적인 질문을 한다고 논리적인 답변을 하지 않는다.
논리적으로 질문을 하면, 압박감 속에 논리적인 답변을 하고자 가짜 답변을 지어내는 경우가 많다.

저 사람이 어떤 감정 상태일까? 를 먼저 생각하라.

---

## Webpack & Module Bundler

ES6 이후로 JavaScript에서는 모듈 시스템이 공식적으로 제공되고 있다. Webpack은 프론트엔드 프레임워크에서 많이 사용되는 Module Bundler로,
의존 관계를 가지고 있는 JavaScript, CSS, 이미지 등의 리소스들을 하나(또는 여러 개)의 파일로 번들링해 준다.

<img src="01.png" />

Webpack은 아래와 같은 문제를 해결해준다.

1. JavaScript 스코프
   여러 개의 자바스크립트 파일에서 선언된 변수와 함수들의 스코프는 전역적으로 설정된다. 어디서나 접근할 수 있기 때문에, 변수의 충돌이나 로딩 순서 등에 취약하다는 단점이 있다.

Webpack은 이를 모듈이라는 단위로 관리할 수 있게 도와준다.

2. 브라우저별 HTTP 요청 숫자의 제약
   브라우저에서 한번에 서버로 보낼 수 있는 HTTP 요청 숫자는 제약되어 있다. 보통 크롬의 경우 한 번에 6개의 요청을 할 수 있는데 webpack을 통해 번들링하면 요청해야 하는 파일의 수 또한 적어지므로 성능이 개선된다.

3. Dynamic Import & Lazy Loading
   SPA의 단점은, 초기에 필요하지 않은 페이지에 대한 스크립트들도 불러온다는 것이다.
   하지만 웹팩을 통한 모듈 번들링을 이용하면 필요한 페이지에 따른 스크립트 모듈을 동적으로 불러오는 것이 가능하다.
   목적별로 여러 `entry`를 설정하여, 특정 페이지 렌더링을 위한 코드로 분리하는 것이다.

   ```jsx
   // webpack.config.js
   module.exports = {
     entry: {
       home: "home.js",
       about: "about.js",
     },
   };
   ```

4. 웹 개발 작업 자동화
   지금은 live-server와 같은 도구를 이용하여 브라우저에서 새로고침을 하지 않아도 손쉽게 변경된 코드 내용을 확인할 수 있지만, 이전에는 브라우저에서의 새로고침이 반복적으로 필요했다. 또한 웹 서비스를 개발하고 웹 서버에 배포할 때는 HTML, CSS, JS 및 이미지 압축, CSS 전처리기 변환 등의 작업이 추가적으로 필요했다.
   webpack만의 종속성 관리는 위와 같은 작업들을 자동으로 수행해 준다. 파일들의 압축과 전처리를 위해 [loader](https://webpack.js.org/loaders/)를 사용할 수 있다.

현재 프로젝트에서 사용 중인 webpack의 설정 내용은 다음과 같다.

```jsx
const path = require("path");
const webpack = require("webpack");
// HTML 파일의 생성을 도와준다.
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    publicPath: "",
    filename: "subway.bundle.js", // 번들링된 결과물의 파일 이름
    path: path.resolve(__dirname, "./dist"), // 번들링된 결과물을 저장하는 디렉토리
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  devServer: {
    port: 8080,
    hot: true,
    contentBase: "/dist/",
    historyApiFallback: true,
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // 생성된 html 파일에 자동으로 번들링된 javascript 파일을 <script> 태그로 넣어준다.
    new HtmlWebpackPlugin({ filename: "index.html", template: "./index.html" }),
  ],
};
```

**Ref**

- https://webpack.js.org/
- https://medium.com/@chullino/웹팩-3-4-js모듈화-역사-돌아보기-1-9df997f82002
- https://pks2974.medium.com/dynamic-import-로웹페이지-성능-올리기-caf62cc8c375
- https://webpack.js.org/guides/lazy-loading/

---

## Login with JWT(Json Web Token)

유저 인증을 할 때, 세션을 사용하여 모든 기록을 서버에 저장하는 방식은 서버에 무리가 갈 수 있다.
또한 서버를 확장하는 것이 어려워진다는 단점이 있다. 이러한 문제를 해결하기 위해 탄생한 것이 **토큰**이다.

토큰 기반 시스템은 stateless, 즉 상태를 갖고 있지 않다. 유저의 인증 정보를 서버나 세션에 담아두지 않고, 서버에 데이터를 요청할 때마다 토큰을 함께 전달한다.
토큰을 사용함으로써 유저는 처음 로그인한 서버 외에도 다른 서버들에 자유롭게 요청을 보낼 수 있으며, 이로 인해 서버의 분산이 이루어져 서버의 확장이 용이해진다.

오늘날 많이 사용되는 토큰은 JWT이다. JWT는 필요한 모든 정보를 자체적으로 갖고 있다. 따라서 별도의 데이터베이스 없이도 해당 토큰의 유효성을 검증할 수 있다.

<img src="02.png" />

JWT를 이용한 Authentication은 아래와 같은 흐름으로 이루어진다.
<img src="03.png" />

1. 사용자가 로그인을 한다.
2. 서버에서는 계정정보를 읽어 사용자를 확인 후, 사용자의 고유한 ID값을 부여한다. 그리고 기타 정보와 함께 Payload에 넣는다.

- 이때 JWT 토큰의 유효기간을 설정한다.

3. 암호화할 SECRET KEY를 이용해 ACCESS TOKEN을 발급한다.
4. 클라이언트는 Access Token을 받아 저장한다. (쿠키, 세션 등)
5. 클라이언트는 인증이 필요한 요청마다 토큰을 헤더에 실어 보낸다.
6. 서버에서는 해당 토큰의 Verify Signature를 SECRET KEY로 복호화한 후, 조작 여부, 유효기간을 확인한다.
7. 검증이 완료된다면, Payload를 디코딩하여 사용자의 ID에 맞는 데이터를 가져온다.

이때 5번 과정에서 Access Token을 Auth 헤더에 실어 보낼 때, Bearer Authentication 방법을 사용한다.

```
Authorization: <type> <credentials>
Authorization: Bearer <access-token>
```

인증 타입은 bearer 이외에도 Basic, Digest, HOBA, Mutual 등이 있다.

**Ref** https://velopert.com/2350

---

## 📚 배우기

### 태그

HTML의 `<main>` 태그는 문서 `<body>`의 주요 콘텐츠를 나타내며, 문서의 핵심 주제나 앱의 핵심 기능에 직접적으로 연결됐거나 확장하는 콘텐츠로 이루어진다.
문서에 하나 이상의 `<main>` 요소가 존재해선 안 된다! 😮

또 `<main>`은 문서 영역을 구분 짓는 용도로 사용되기 때문에 `<article>`, `<aside>`, `<footer>`, `<header>`, `<nav>` 요소의 자손 요소가 되어서는 안 된다.

**Ref**
https://developer.mozilla.org/ko/docs/Web/HTML/Element/main
http://www.tcpschool.com/html-tags/main

### MiniCssExtractPlugin

webpack에서 css 파일들을 묶어 별도로 추출하기 위해 사용하는 플러그인이다. JS 파일의 에 포함된 css를 별도의 파일로 추출해준다. `css-loader`와 함께 사용하는 것이 권장된다.

```jsx
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

**Ref**

- https://webpack.js.org/plugins/mini-css-extract-plugin/
- https://joshua1988.github.io/webpack-guide/tutorials/code-splitting.html#실습-절차

### input pattern

`<input>` 태그에 `pattern`이라는 속성이 있다! 😮
`<input>` 요소의 값을 검사할 때 사용될 정규 표현식을 지정해 준다.

### Custom Validations

페어와 3시간 여를 삽질했음에도 불구 아주 신났던(왜 그랬을까🤔?) Custom Validity 만들기

요소의 `validityState`를 받아서, 유효하지 않은 원인에 따라 서로 다르게 `setCustomValidity`를 해줄 수 있다.
경고창을 띄우고 싶은 시점에 `reportValidity`를 호출해주면 된다. 미션에서는 아래와 같이 작성했다.

```jsx
setInputValidity() {
  const validityState = this.$stationNameInput.validity;

  if (validityState.valueMissing) {
    this.$stationNameInput.setCustomValidity('역 이름을 입력해 주세요.🙀');
  } else if (validityState.tooShort) {
    this.$stationNameInput.setCustomValidity('2글자 이상 입력해 주세요.👾');
  } else if (validityState.patternMismatch) {
    this.$stationNameInput.setCustomValidity('공백, 특수문자를 제외한 한글을 입력해 주세요.🤓');
  } else {
    this.$stationNameInput.setCustomValidity('');
  }
}

async handleNameSubmit(event) {
  event.preventDefault();
  this.$stationNameInput.reportValidity();
  await this.addStation(event);
}
```

화면에는 아래처럼 보인다.
<img src="04.png" width="520px" />

**Ref**

- https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity
- https://developer.mozilla.org/en-US/docs/Web/API/ValidityState

### invalid event

JavaScript DOM event에 `invalid`라는 것이 있다.
위에서 사용한 Custom Validation의 연장선에서 살펴볼 수 있다.
폼 제출 시 input의 요소가 정의한 기준((`min`, `max`, `pattern` 등의 속성)에서 `invalid`한 값을 가질 때 발생한다.

**Ref** https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event

### Custom Promise

`Promise` 다시 공부하기 😵

Promise 개념 짚고 가기 ⬇️
https://www.freecodecamp.org/news/how-to-write-a-javascript-promise-4ed8d44292b8/

Promise chaining 대신 async-await을 사용하자! ⬇️
https://blog.logrocket.com/promise-chaining-is-dead-long-live-async-await-445897870abc/
https://blog.patricktriest.com/what-is-async-await-why-should-you-care/

비동기 함수의 `return`과 `await`, `return await`이 헷갈린다면 ⬇️
https://flaviocopes.com/how-to-return-result-asynchronous-function/
https://jakearchibald.com/2017/await-vs-return-vs-return-await/

generator와 async 함수 비교 ⬇️
https://hackernoon.com/async-await-generators-promises-51f1a6ceede2

Custom Promise 만들기 (어려운 편 😵) ⬇️
https://p-iknow.netlify.app/js/custom-promise

---

## 기타

### gh-pages: dist directory만 deploy하기

**Ref** https://velog.io/@bigsaigon333/gh-pages-dist-디렉토리만-deploy-하기

### 효과적인 피드백

- “덜 가르치고 더 많은 피드백을 제공하라! (Teach less and provide more feedback!)”
- 피드백을 어떻게 ‘주느냐’보다 어떻게 ‘받아들이는가’가 중요하다.

**Ref** https://21erick.org/column/5251/

### 정규표현식 사이트

정규표현식 마스터 서니가 알려준 정규표현식을 만들어주는 사이트
**Ref** https://regexr.com/

---

## 😎 마무리

글쓰기 미션 제출 주간이라 그런지, 크루들의 글이 빠른 속도로 리젠(!)되고 있다.
아직 힘든 걸까, 아니면 그냥 그때 많이 무너진 마음이 아직까지 말랑해진 채로 위태롭게 유지되고 있는 걸까.
일주일 내내 이야기 나누는 프론트 크루들 뿐 아니라 백엔드 크루들의 글까지.
전혀 슬픈 내용도 아닌데 읽으면서 많이 울었다.

그냥 다른 사람들이 나랑 비슷한 걱정과 고민들을 하며 보냈을 불안한 나날들을 떠올리면 눈물이 난다. 언제쯤 그칠까 🤷‍♀️
그렇지만 이런 나 그대로도 나쁘지 않은 것 같다.
크루들과 더 많은 시간을 보내며 더 깊은 이야기들을 나눠보고 싶다.
