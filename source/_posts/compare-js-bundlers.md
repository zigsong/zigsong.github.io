---
title: 자바스크립트 번들러 비교
date: 2023-01-05 22:31:56
tags: frontend
thumbnailImage: https://i.imgur.com/2Dqm3wS.jpg
---

webpack vs parcel vs rollup vs esbuild vs vite

<!-- more -->

---

## webpack

- 여러 개의 entry point로 의존성 그래프를 빌드하여, 각 모듈을 하나 이상의 모듈로 합친다.
- JS 이외 파일(CSS, 애셋 파일 등) 처리 시 loader 필요
- parcel, rollup보다 code splitting 안전성 높음
- webpack-dev-server 지원 (live-reload 지원)
- 가장 역사가 깊으며, 레퍼런스가 많고 안정적이다
- 👎 tree-shaking을 ES6 모듈에서만 지원하기 때문에 `SideEffects` 항목 별도 기재 필요
  - `{ sideEffects: false }` 를 표시하여 사용하지 않는 export는 제거해도 괜찮음을 webpack에게 알려준다.
  - 즉 side effect가 발생해도, 해당 구문을 사용하지 않는다면 제거한다.
- **✔️ 많은 서드파티를 필요로 하는 복잡한 애플리케이션**
- **✔️ 이것저것 설정을 많이 하고 싶다. 그리고 레퍼런스가 많으면 좋겠다.**

---

## parcel

- `불꽃 튀게 빠르고 설정이 필요 없는 웹 애플리케이션 번들러` 라고 한다… (한글 공식 문서)
- zero-configuration
- 빠른 빌드 속도
  - parcel의 JS 컴파일러, CSS transformer, sourcemap은 성능을 위해 Rust로 작성되었다.
  - parcel의 JS 컴파일러는 SWC를 기반으로 트리셰이킹, 핫-리로딩 등을 지원한다.
    - ☝️ SWC는 Rust 기반
    - ES6 및 CommonJS 모듈 모두에 대해 tree-shaking을 지원한다.
  - 워커 쓰레드를 사용한 병렬 빌드
  - 캐싱을 사용한 빠른 빌드 속도
    - 모든 것은 캐시된다 (transformation, dependency resolution, bundling, optimizing…)
    - 코드가 바뀌면 부분적으로 캐시를 무효화한다.
      → webpack보다 최대 20배 빠름 (캐시 사용 시)
- 플러그인 없이 JS, CSS, HTML, 파일 애셋, 그 외 많은 것들에 대한 지원을 기본으로 제공
  - JS 이외 파일 처리 시에도 별도의 loader 불필요
  - 앱 진입을 위한 HTML을 직접 읽을 수 있다.
    - JS 엔트리포인트를 지정할 필요가 없다
- 필요하다면 Babel, PostCSS, PostHTML같은 트랜스파일러들을 기본으로 지원한다
  - `.babelrc`, `.postcssrc` 등의 파일을 발견하면 자동으로 변환한다
  - (심지어 `node_modules`까지도.)
- 동적 import 문을 사용해서 output 번들을 분할 할 수 있다.
  - 이를 통해 초기 로드시 필요한 것들만 로드할 수 있다.
  - dev에서는, 브라우저에서 요청이 있을 때까지 번들링을 지연할 수 있다.
    - 실제 필요한 페이지만 로드하며, 적절하게 code split 시 dev server 실행 시간을 줄여준다.
- HMR 기본 지원
  - React, Vue 사용 시에도 fast refresh 가능
- dev server 기본 제공
- 프로덕션 자동 최적화
  - 트리셰이킹 - 동적 모듈 import, 공용 모듈, CSS 모듈에 대해서도 적용된다
  - 최소화 및 난독화 - JS, CSS, HTML, SVG minifier를 제공한다
  - 이미지 최적화도 지원한다
- 코드 스플리팅
  - 앱의 여러 파트에서 동일한 모듈에 의존하고 있다면, 해당 모듈을 자동으로 별도의 번들로 분리해준다.
  - CSS도 마찬가지로 지원
- 모든 output 파일에 대해 content hash를 제공한다
  - 브라우저 캐시에 유리하다
- **✔️ 복잡한 설정을 피하고 간단한 애플리케이션을 빠르게 만들고 싶다면**

---

## rollup

- ES6 모듈(ESM) 형식으로 빌드 결과물을 생성한다. (webpack은 only CommonJS 형태만 가능)
- 여러 개의 모듈을 하나의 단일 모듈로 합쳐서 코드를 최적화한다.
  - 진입점을 다르게 설정하여 번들링 가능
  - 코드들을 동일한 수준으로 호이스팅 한 후 한 번에 번들링을 진행
  - code splitting에 강점 (중복 제거에 특화)이 있다.
  - cf) webpack의 `ModuleConcatenationPlugin`이 비슷한 역할
- 트리셰이킹 기본 지원
  - JS 이외 파일 처리 시 플러그인 사용코드를 정적으로 분석하여 미사용 코드는 제외한다
- 데브서버 지원, 하지만 live-reload를 위해서는 추가 플러그인 설치가 필요하다.
- HMR - 플러그인으로 지원
- 👎 파일의 해시 캐스캐이딩(hash cascading; 하나의 파일의 해시가 바뀌면 그것을 참조한 파일의 해시도 알아서 바뀜) 이 약함
- 👎 CommonJS 종속성이 많은 경우
- 👎 서드파티 라이브러리 통합이 어렵다 (이유 까먹음)
- **✔️ 최소한의 서드파티로 라이브러리를 만들고 싶다면**
- **✔️ 디자인 시스템 등에서 사용 (배시시도?)**

---

## esbuild

- Go로 작성되어 **100배!✨** 빠른 번들링 속도
- 코드 파싱, 출력과 소스맵 생성을 모두 병렬로 처리한다.
- CommonJS, ES6, JSX, Typescript, Tree shaking을 지원한다.
  - 👎 ES5 이하의 문법을 아직 100% 지원하지 않기 때문에, IE 대응이 어렵다
- 빌드 도구이지 통합 툴이 아니라서, 기존의 툴(webpack, parcel, rollup 등)을 사용해야 한다
  **→ snowpack 또는 vite와 결합하여 사용한다**
- 👎 버전 1.0도 안 됐다
- 👎 대규모 프로덕션 사이트에는 사용 지양
- 👎 live/hot reload(HMR) 지원하지 않음
- 👎 PostCSS와 기타 전처리기 자동 변환 X
- 👎 AST 변환 작업을 지원하지 않는다 (플러그인 필요)
- 👎 문서가 너무 못생겼다
- **✔️ 다 필요없고 빌드나 빨랐으면 좋겠다**

---

## vite

- `차세대 프런트엔드 개발 툴` 이라고 한다 (공식문서)
- react, vue, preact를 지원
  - CRA, vue-cli의 대체재
- 사전 번들링(Pre-bundling)
  - esbuild를 사용하여 기존 번들링 대비 10-100배 빠른 속도
- Native ESM 제공 (dev)

  - 번들링 없이 온디맨드(on-demand)로 파일을 제공할 수 있다.
  - JSX, CSS 또는 Vue/Svelte 컴포넌트와 같이 컴파일링이 필요하고, 수정이 잦은 Non-plian JS 소스코드
    → Native ESM을 이용해 소스코드를 제공하여, 브라우저를 번들러처럼 사용한다.
    - 조건부 동적 import 이후의 코드는 현재 화면에서 실제로 사용되어야만 처리된다
      <img src="01.png" >
  - ☝️production에서는 rollup을 사용한다

    > 💡 **production에서는 esbuild가 아닌 번들링 방식을 사용하는 이유**
    > 프로덕션에서 번들 되지 않은 ESM을 가져오는 것은 중첩된 import로 인한 추가 네트워크 통신으로 인해 여전히 비효율적이다.
    >
    > - 프로덕션 환경에서 최적의 로딩 성능을 얻으려면 트리 셰이킹, 지연 로딩 및 청크 파일 분할(더 나은 캐싱을 위해)을 이용하여 번들링 하는 것이 더 좋다.
    > - `Esbuild`는 번들링에 필수적으로 요구되는 기능인 코드 분할(Code-splitting) 및 CSS와 관련된 처리가 아직 미비하다

    → 즉, vite는 esbuild(dev)와 rollup(prod)으로 구성되어 있다

- dependencies(패키지)와 소스코드를 분리하여 빌드한다
  - 패키지 - 설치 후에 내용이 바뀌지 않음
  - 소스코드 - 빈번하게 바뀜
- 빠른 HMR 지원
  - 번들러가 아닌 native ESM을 사용하기 때문이다. (브라우저가 곧 번들러)
  - 모듈 수정 시 해당 부분만 교체하고, 브라우저에서 해당 모듈을 요청할 때까진 사용되지 않는다
- 기본적으로 TypeScript, JSX, CSS 등을 지원한다.
  - 내부적으로 esbuild를 사용
- 빌드 최적화

  - CSS를 자동으로 추출해 파일로 분리
  - 빌드 시 Direct import 구문에 대해 `<link ref="modulepreload">` 디렉티브를 이용해 미리 모듈을 캐싱하도록 자동으로 변환
  - 모든 Direct import 구문을 preload하여 불필요한 네트워크 요청을 줄인다
    <img src="02.png" >

- 👎 tree-shaking, 코드 스플리팅을 지원하지 않는다.
- 👎 rollup 번들러를 사용한 pre-configured 빌드 환경에서 rollup config를 뜯어내기가 아주 어렵다
- **✔️ esbuild 쓰고 싶은데 통합 번들러도 필요하다.**
- **✔️ React 아니고 Vue 쓴다**

---

### cf) state-of-js 2021

이럴수가..?

<img src="03.png" >

---

## Refs

- [https://webpack.js.org/concepts/](https://webpack.js.org/concepts/)
- [https://webpack.js.org/concepts/why-webpack/](https://webpack.js.org/concepts/why-webpack/)
- [https://parceljs.org/](https://parceljs.org/)
- [https://ko.parceljs.org/](https://ko.parceljs.org/)
- [https://heropy.blog/2018/01/20/parcel-1-start/](https://heropy.blog/2018/01/20/parcel-1-start/)
- [https://rollupjs.org/guide/en/](https://rollupjs.org/guide/en/)
- [https://dantechblog.gatsbyjs.io/posts/rollup/](https://dantechblog.gatsbyjs.io/posts/rollup/)
- [https://vitejs-kr.github.io/guide/why.html](https://vitejs-kr.github.io/guide/why.html)
- [https://vitejs-kr.github.io/guide/features.html#build-optimizations](https://vitejs-kr.github.io/guide/features.html#build-optimizations)
- [https://engineering.ab180.co/stories/webpack-to-vite](https://engineering.ab180.co/stories/webpack-to-vite)
- [https://ui.toast.com/posts/ko_20220127](https://ui.toast.com/posts/ko_20220127)
- [https://velog.io/@subin1224/Parcel-vs-Rollup-vs-Webpack-비교](https://velog.io/@subin1224/Parcel-vs-Rollup-vs-Webpack-%EB%B9%84%EA%B5%90)
