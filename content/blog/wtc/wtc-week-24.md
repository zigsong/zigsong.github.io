---
title: 우테코 24주차 기록
date: 2021-07-18 19:36:53
tags: ["woowacourse"]

---

우테코 24주차 기록

<!-- more -->

---

## 놀토 프로젝트

### 이미지 처리

백엔드와 사진 데이터를 어떻게 보내고 받을 것인지 많은 논의가 있었다. 결국 JSON 형식 대신 form-data 형식으로 body를 전송하기로 했다. 잘 저장되고, 잘 받아지고 있다! 아무래도 백엔드 인원이 많고, API가 빨리빨리 처리되다 보니 프론트엔드 측에서 살짝씩 밀리고 있었어서 조금 부담감과 긴장감이 생겼다.

### recoil? react query?

1. **react query** 완전 fancy하고 편리하다. 사용하자 (지그)
2. 우리 앱은 서버와의 즉각적인 통신이 필요하지 않을 것 같으니 **recoil**로도 충분하다 (미키)
3. **react query** 완전 편리한 것 같다. 상태관리할 데이터도 딱히 없을 것 같다. (미키)
4. 포코가 상태관리 나중에 하면 힘들어질 거라고 했다. 다른 크루들도 사용할 때 **recoil**을 사용해보는 게 좋겠다. (지그)
5. **recoil** 너무 복잡하다. 더군다나 cache된 데이터만 가져오고, 서버에서 신규 데이터를 가져오는 과정이 복잡하다. (미키)

> 결론: **react-query** 쓰자! 🙆‍♂️🙆‍♀️

---

## 프론트엔드 공부

### `<input type="file" />` 다루는 법

🍀 [여기서 읽기](https://zigsong.github.io/2021/07/18/fe-file-input/)

### 왜 `forwardRef`를 사용할까?

🍀 [여기서 읽기](https://zigsong.github.io/2021/07/18/fe-forward-ref/)

### TypeScript의 index signature

🍀 [여기서 읽기](https://zigsong.github.io/2021/07/18/fe-index-signature/)

### ModalProvider 만들기

🍀 [여기서 읽기](https://zigsong.github.io/2021/07/18/fe-Modal-Provider/)

---

## 공부하기

### historyApiFallback

**react-router-dom**의 `Link`를 통해 페이지를 라우팅하면 문제없이 동작하지만, 직접 주소창에 `/upload` 등을 입력하여 접속하거나 새로고침을 하면 404 에러가 발생한다. 특정 주소로 바로 접속 시 서버 쪽 라우터에서 먼저 연결할 곳이 있는지 확인하는데, `/upload`와 같은 URL 엔드포인트는 서버쪽 라우터가 아닌 **react-router**로 동작하는 SPA 라우터기 때문이다.

`historyApiFallback` 옵션을 켜서 문제를 해결할 수 있다. history API를 사용하는 SPA에서, `historyApiFallback`을 사용하면 404 에러 발생 시 `index.html`로 리다이렉트 해준다.

```jsx
// webpack.config.js
devServer: {
  // ...
  historyApiFallback: true,
},
```

**Ref**

- https://velog.io/@yhe228/주소창에-url-직접-입력시-라우팅-안되는-이슈
- https://velopert.com/1173
- https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback

### router 내부 페이지에서 reload 시 페이지가 날아가 버리는 경우

webpack은 기본적으로 output에 설정해둔 경로(default는 `/`)에서 번들링된 파일(bundle.js)를 가져오려고 한다.

페이지 reload 시 기본적으로 서버에 해당 주소로 요청이 가는데, 상기했듯 SPA에서 서버는 주소에 해당하는 페이지를 가지고 있지 않다. 이러한 요청은 **react-router**가 클라이언트 단에서 처리하여, 어떤 JavaScript를 렌더링할지 결정한다. 따라서 서버가 특정 주소로의 접근을 이해할 수 있도록 만들어줘야 한다.

서버(`devServer`)와 클라이언트(`output`)의 route를 동일하게 맞춰줌으로써 문제를 해결할 수 있다. webpack 설정을 통해 번들링된 파일을 항상 같은 곳에서 가져올 수 있도록 수정한다.

```jsx
// webpack.config.js
output: {
  // ...
  publicPath: '/',
},
devServer: {
  // ...
  publicPath: '/',
},
```

**Ref**

- https://stackoverflow.com/questions/54786191/react-router-not-working-when-url-contains-multiple-paths
- https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
- https://webpack.js.org/configuration/dev-server/#devserverpublicpath-

---

## etc

### 웹 접근성 참고자료

- https://sungdoo.dev/programming/accessibility-is-not-about-supporting-blind-people/
- https://sungdoo.dev/retrospective-or-psa/how-accessibility-nudges-you-to-be-better-developer/
- https://onwah.tistory.com/m/24
- [Naver NULI](https://nax.naver.com/index)
- [레진코믹스 WAI-ARIA](https://github.com/lezhin/accessibility/tree/master/aria)

### 프론트엔드 엔지니어 vs 웹 퍼블리셔

- https://hyeonseok.com/blog/396
- https://hyeonseok.com/blog/657
- [클래스101의 디자인 시스템](https://medium.com/class101/클래스101의-디자인-시스템-one-product-system-35681c551343)

### 크롬 개발자도구의 소소한 기능들

- https://www.youtube.com/watch?v=toXJLUa7i0Y

### vscode에서 api를 테스트해주는 익스텐션

- https://www.thunderclient.io/

### github learning lab

- https://lab.github.com/

---

## 마무리

두 번째 코로나 검사 받았다 😷 아팠다.

리팩토링할 일들이 쌓여간다…
평일 6시 퇴근이라는 유토피아를 살아가는 팀은 없었다. 다들 누가 더 오래 버티나 내기 중. 그래도 정말 갈수록 재미있어지는 것 같다.
