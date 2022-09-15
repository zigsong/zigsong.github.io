---
title: 우테코 31주차 기록
date: 2021-09-11 20:29:54
tags: woowacourse
---

렌더링 성능 최적화 | webpack 설정

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 놀토 프로젝트

### Sentry

production에서 발생하는 에러를 잡기 위해 Sentry라는 도구를 사용해주었다. 뭔가를 실수로 잘못 눌러 무료 14일 체험판이 신청되어, 슬랙과도 연동을 시켜 놓았다.

전체 에러에 대해서 Sentry 에러를 발생시키고, Http 에러가 아닌 개발자가 확인하지 못한 에러들에 대해서는 유저 리포트를 띄워 문제 발생 케이스를 참고할 수 있도록 했다.

<img src="01.png" />

### webpack 설정 재정비

🍀 [여기서 읽기](https://zigsong.github.io/2021/09/11/webpack-config/)

### 성능 최적화

**✅ 정적 이미지 파일 확장자 변경**
사용자가 업로드하는 이미지 파일이 gif아닌 서비스 자체에서 사용하는 정적 이미지들의 확장자를 `webp`로 변경했다. `<picture>`와 `<source>` 태그를 활용하여 `webp` 확장자를 지원하지 않는 브라우저에서도 `png` 확장자 파일로 받아와서 이미지가 문제없이 로딩될 수 있게끔 작성했다.

```jsx
return (
  <picture>
    <source srcSet={webpUrl} type="image/webp" />
    <source srcSet={pngUrl} type="image/png" />
    <img src={pngUrl} width="180px" alt={name} />
  </picture>
);
```

**✅ loadable을 이용한 코드 스플리팅**
각 라우터에 해당하는 페이지의 자바스크립트 소스코드를 각 페이지에 진입할 때마다 불러올 수 있게 하기 위해서 코드 스플리팅을 진행했다. React에서 기본 제공하는 `lazy` 대신, `preload` 옵션을 줄 수 있는 **loadable components**를 사용했다.

각 컴포넌트에 대하여 코드 스플리팅 이후 분리될 청크 파일의 이름을 아래와 같이 지정할 수 있다.(`webpackChunkName` 옵션)

```jsx
const Home = loadable(() =>
  import(/* webpackChunkName: "Home" */ "pages/Home/Home")
);
const About = loadable(() =>
  import(/* webpackChunkName: "About" */ "pages/About/About")
);
const Upload = loadable(() =>
  import(/* webpackChunkName: "Upload" */ "pages/Upload/Upload")
);
```

특정 페이지로 진입하고자 할 때 클릭하는 버튼 등에 `mouseOver` 이벤트 리스너를 달아주어 필요한 컴포넌트의 로드 시점을 앞당겼다.

```jsx
return (
  <li onMouseOver={() => Page.RecentFeeds.preload()}>
    <NavLink to={ROUTE.RECENT} className="nav-link" activeClassName="selected">
      Toy Projects
    </NavLink>
  </li>
);
```

**✅ splitChunks**
`optimization.splitChunks` 설정 시 webpack은 기본적으로 번들링 과정에서 청크를 분할한다. 구체적으로 webpack은 다음 조건에 따라 자동으로 청크를 분할한다.

- 새 청크를 공유할 수 있거나 모듈이 node_modules 폴더에 있는 경우
- 새 청크가 20kb보다 클 경우(minimize + gzip 이전에)
- 요청 시 청크를 로드할 때 최대 병렬 요청 수가 30개 이하일 경우
- 초기 페이지 로드 시 최대 병렬 요청 수가 30개 이하일 경우

`splitChunks.chunks`는 최적화를 위해 선택될 청크를 나타낸다. 값으로 `all`, `async` 및 `initial`을 넣을 수 있다. 여기서 `async` 즉 비동기 청크란 컴파일 단계에서 초기에 로드되는 청크가 아닌, 런타임에서 동적으로 로드되는 청크를 가리킨다.

캐시그룹(`splitChunks.cacheGroups`)을 사용하여 특정 조건으로 청크 파일을 생성할 수 있다. 디폴트 옵션에 나와있는 대로 `node_modules`를 별도의 청크로 분리하고, 이름은 vendor로 지정해주었다. 나머지 청크 파일들에 대해서는 prefix를 통해 filename만 따로 명시해주었다.

> 👾 비동기 모듈은 따로 파일을 분리해야 동적으로 불러올 수 있기 때문에 비동기로 import되는 모듈들은 따로 옵션을 주지 않아도 webpack이 알아서 별도의 파일로 분리해준다.

```jsx
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        vendor: {
          chunks: "all",
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
        },
        default: {
          filename: "common-[name].js",
        },
      },
    },
  },
};
```

**Ref**
https://webpack.js.org/plugins/split-chunks-plugin/#root
https://simsimjae.medium.com/webpack4-splitchunksplugin-옵션-파헤치기-19f5de32425a

---

## 프론트엔드

### 렌더링 성능 개선 강의

**✅ 브라우저 렌더링 개선**
브라우저의 메인 스레드 일이 넘치면 어떻게 될까? 당연히 유저 인터랙션이나 페이지 전환 시 화면이 버벅거리게 되며, 이 현상을 ‘쟁크’라고 부르기도 한다.. 문제를 방지하기 위해 일반적인 스크린의 주사율인 60FPS를 맞춰 화면 업데이트를 끊기지 않도록 하는 것이 좋다.

> 1초에 60프레임 = 1프레임 당 16.67ms (paint를 위한 시간을 고려하면 약 10ms)

reflow, repaint를 줄이거나 memoization을 사용하여 똑같은 작업을 매번 새로하지 않도록 해주는 것도 좋은 생각이다. 특히 repaint 시 layer를 적절하게 사용한다면 repaint 작업을 브라우저의 메인 스레드가 아닌 GPU에서 수행하도록 도와주기 때문에 작업 비용을 줄일 수 있다.

페이지의 layer 확인은 크롬 개발자 도구의 점 세 개 → More Tools → Layers에서 확인할 수 있다.

<img src="02.png" width="560px" />

한편 web worker를 사용하여 브라우저의 일을 나눠서 처리해줄 수도 있다. web worker는 스크립트 연산을 웹 어플리케이션의 주 실행 스레드와 분리된 별도의 백그라운드 스레드에서 실행할 수 있는 기술이다.

> 🚨 **layout thrashing**은 위험하다!

layout thrashing이란, 동기적으로 레이아웃의 변경을 강제하는 동작으로, 아래와 같은 코드에 해당한다.

```jsx
const paragraphs = document.querySelector("p");
const greenBlock = document.getElementById("block");

for (let i = 0; i < paragraphs.length; i++) {
  let blockWidth = greenBlock.offsetWidth;
  paragraphs[i].style.width = blockWidth + "px";
}
```

이처럼 자바스크립트로 스타일링 값을 읽고 강제로 할당하는 것만으로도 layout 단계에서 다시 JavaScript 파싱 단계로 돌아가게 되므로 연산이 낭비되는 문제가 있다.

> **🔮useLayoutEffect**
> DOM이 모두 로드된 후 실행되는 `useEffect`와 달리, `useLayoutEffect`는 React에서 DOM을 업데이트하고 브라우저가 paint하기 전에 인자로 받은 콜백을 **동기적으로** 실행한다. `useLayoutEffect`에는 DOM이 실제로 화면에 그려지기 전에 미리 실행되어야 할 동작을 정의할 수 있다.

**Ref**
https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API
https://www.youtube.com/watch?v=a9wbrTbg_RI
https://www.youtube.com/watch?v=kU5Z4D5N3Kk

**✅ 프레임워크/라이브러리가 (미리) 해주는 일**

- 기본 수준의 최적화 (DOM 제어 & lifecycle)
- `React.memo`를 활용하자

**✅ 사용자 경험을 위한 성능**
실제 성능 지표도 중요하지만, 사용자가 ‘체감하는’ 속도가 중요하다. 빈 페이지가 뜨는 시간을 최소화하고, 아직 컨텐츠가 로딩되지 않은 페이지에는 뭐라도 보여야 한다. 기본적인 로딩 UI를 활용하거나, 스켈레톤 UI를 활용하는 것도 좋은 방법이다.

모두 만족스럽지 않다면, SSR을 사용해보는 것은 어떨까? 😲

### Web Server와 WAS

🍀 [여기서 읽기](https://zigsong.github.io/2021/09/12/web-server-was/)

---

## 공부하기

### styled-component, 왜 다르게 보일까?(dev와 prod에서)

production에서 styled-component는 CSSOM API를 이용해서 스타일을 바로 집어넣는다! 그래서 styled-components에 대한 내용이 구구절절 나오는 dev에서와는 다르게 보인다.

**<dev에서의 구구절절한 styled-components 태그>**
<img src="03.png" />

**<prod에서 깔끔한 styled-components 태그>**
<img src="04.png" />

### 웹 폰트 사용하기

여태까지 `@import` 구문만을 믿고 잘못 가져오고 있었다! 세상에 그래서 페어의 윈도우와 내 MacOS에서의 화면이 더욱 다르게 보였나보다.

html `<link>` 태그의 `preload` 속성을 사용하여 웹 폰트의 링크를 **“먼저”** 불러온 후 사용할 수도 있다. 하지만 폰트 링크를 한번 불러오고, 실제 폰트 파일을 내려받는 2차례의 과정을 거치게 된다. 또한 vietnamese나 latin-ext와 같이 사용하지 않는 폰트의 형식까지 모조리 불러와 불러오는 font 파일이 매우 많아지게 되는 문제가 발생한다. 실제로 아래와 같이 작성했을 때 불러오는 전체 폰트 파일의 크기는 무려 469kB에 달했다. (총 3개의 폰트 사용)

```html
<!-- index.html -->
<link
  href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"
  rel="preload"
  as="font"
  onload="this.rel='stylesheet'"
  crossorigin="anonymous"
/>
```

그래서 사용할 폰트를 `preload`를 사용하여 무엇보다 빠르게 불러오는 선택지보다, 우리가 실제 사용할 폰트만 선택적으로 불러와 전체 파일의 용량을 줄이는 방향을 선택했다. 폰트 파일의 확장자들 중 용량이 가장 낮은 `woff2`를 기본으로 선택하고, `woff2` 확장자를 지원하지 않는 브라우저에 대비하여 `truetype`을 추가로 넣어주었다.

```html
<!-- index.html -->
<style>
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url("./fonts/OpenSans-Regular.woff2") format("woff2"), url("./fonts/OpenSans-Regular.ttf")
        format("truetype");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
      U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
      U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /* ... */
</style>
```

앱 전체에서 사용하는 Global Style에 styled-components를 이용하여 `@font-face`를 넣어줄까도 고민했었지만, 자바스크립트로 작성된 styled-components를 한번 파싱하고 CSS를 또 불러오는 것은 성능이 좋지 못하다고 판단하여 앱의 진입점인 index.html에 `<style>` 태그로 바로 넣어주었다. `<head>` 안에 있는 `<style>`이나 `<link>`에 포함된 리소스들은 `<body>` 태그 내부에서의 DOM 파싱과 병렬적으로 이루어지기 때문에 리소스를 보다 빠르게 로드할 수 있다.

**Ref** https://www.youtube.com/watch?v=4YCBBoSg2fk

---

## 기타

### 언제 나온 문법이지? 어느 브라우저 지원? 바벨이 컴파일해주나?

**Ref** https://kangax.github.io/compat-table/es6/

### 인상적인 랜딩 페이지

**Ref** https://www.tossbank.com/?referral=5131843

---

## 마무리

무난한 컨디션이 계속된다. 조급한 건 여전히 디폴트지만, 이번주는 그래도 여유롭게 지나갔다. 코딩은 많이 못해서 일에 사실 큰 재미는 느끼지 못한다. 파도 파도 끝없는 성능 최적화 때문에… 강의도 많고, 계속해서 뭔가 일정이 있었다.

팀원들과 감정회고도 진행했다. 우리 팀원들 정말 아기자기하고 귀엽다. 벌써 9월도 절반 가까이 지났는데, 루터 가서 빨리 만나고 싶다. 😆
