---
title: webpack 설정 뜯어보기
date: 2021-09-11 20:25:58
tags: [frontend, webpack]
thumbnailImage: https://i.imgur.com/2Dqm3wS.jpg
---

it’s 재정비 타임~

<!-- more -->

놀토 프로젝트에서 사용하는 webpack 설정 재정비 중!

### ✅ webpack dev prod config 분리

development와 production의 빌드 목표는 서로 다르다. development에서는 강력한 소스 매핑, localhost 서버에서는 라이브 리로딩이나 HMR(Hot Module Replacement) 기능을 원한다. production의 목표는 로드 시간을 줄이기 위해 번들 최소화, 가벼운 소스맵 및 에셋 최적화에 초점을 맞춰야 한다. 공식 문서에서는 webpack 설정을 분리하여 작성하는 것을 권장하고 있다.

dev와 prod에서 공통으로 사용하는 설정들은 **webpack.common.js**에 작성하고, `webpack-merge`를 사용하여 common의 설정 내용을 dev와 prod에서 확장하여 사용할 수 있다.

### ✅ babel/preset-env의 target browserslist 설정하기

앱을 만들 때 지원할 브라우저를 명시할 수 있다. ES6와 같은 최신 자바스크립트 문법을 사용할 때 browserslist를 명시해 주면, 트랜스파일러나 모듈 번들러가 현재 타겟으로 하는 브라우저를 알 수 있다. 최신 문법을 지원하지 않는 브라우저(IE 11버전 이하)를 그대로 사용한다면 별도의 polyfill을 설치해줘야 한다.

현재 프로젝트에서는 크롬 50버전 이상 또는 전체 브라우저의 최신 2개의 버전을 지원하며, IE 11 버전 이하의 브라우저는 지원하지 않기로 했다. 전체 query 목록은 [여기](https://github.com/browserslist/browserslist#queries)서 확인할 수 있다.

babel의 `@babel/preset-env` 설정에 browserslist를 명시해주는 방법도 있지만, 현재 패키지에서 확인하는 방법이 좋다고 생각하여 package.json에 작성 후 webpack에서 참조하도록 했다.

```jsx
// package.json
{
  // ...
  "browserslist": "chrome > 50 or last 2 versions and not ie <= 11",
}
```

webpack에는 아래와 같이 적어주었다. browserslist 설정이 있다면 `target` 옵션은 디폴트로 해당 browserslist를 가리키게 된다.

```jsx
// webpack.config.js
module.exports = {
  // ...
  target: "browserslist",
};
```

아래 명령어를 통해 현재 앱에서 타겟 환경으로 지정한 브라우저와 그 버전을 명시한 목록을 볼 수 있다.

```
npx browserslist
```

<img src="01.png" />

### ✅ file-loader 대신 asset/resource

file-loader 모듈은 개발 시 `import`/`require` 구문으로 사용되는 에셋 파일들을 번들 결과의 output 폴더에 생성해준다. webpack v5부터 deprecate되었으며, 현재는 asset/resource를 사용한다. `generator` 옵션을 사용하여 번들 이후 생성될 파일의 이름을 설정해줄 수 있다.

```jsx
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/[name][ext]",
        },
      },
    ],
  },
};
```

### ✅ 타입 체킹 기능 사용

babel은 ES6 코드를 ES5 이하의 문법으로 컴파일해주지만, 타입 체크는 해주지 않는다. babel에서 기본으로 제공하는 `@babel/preset-typescript` preset은 타입스크립트 문법을 브라우저가 이해할 수 있게끔 해주는 역할만 수행할 뿐, 타입 체크를 해주지 않는다. 별도의 타입 체크를 위해 tsc와 같은 타입스크립트 컴파일러를 설치하여 타입 체크를 수행할 수 있지만, 그보다 webpack과의 결합도를 위해 `fork-ts-checker-webpack-plugin`을 사용하였다. `fork-ts-checker-webpack-plugin`은 babel 컴파일 과정에서 별도로 동작하여, 타입 체크와 babel 컴파일을 병렬적으로 수행할 수 있다는 장점이 있다.

> ts-loader를 사용하여 babel에서 타입 체크를 수행할 수 있지만, 혼자 트랜스파일링과 타입 체크를 모두 다 하게 되기 때문에 느리다는 단점이 있다. 공식 문서에서는 babel-loader의 사용을 권장한다.

### ✅ DefinePlugin

컴파일 타임에 사용할 값들을 지정해준다. 구체적으로는 production mode에서 사용할 환경변수들을 가져와 정의해줄 수 있다. Github Actions나 Jenkins 등 CI/CD를 도와주는 툴에 secret variable로 앱에서 사용하는 API key 등의 환경변수를 설정하고, 빌드 시점에 해당 환경에서 필요한 변수를 취득하여 앱에 적용해 준다.

production mode에서 SENTRY의 DSN을 불러와 사용해주기 위해 작성해주었다. DefinePlugin의 key-value 쌍에서 key값은 항상 아래처럼 문자열로 감싸줘야 하며, value도 `JSON.stringify`로 바꿔줘야 한다.

```jsx
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    // ...
    new DefinePlugin({
      "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN),
    }),
  ],
};
```

> `DefinePlugin`과 유사하게 동작하지만, 환경 변수 전용으로 사용되는 `EnvironmentPlugin`이라는 플러그인도 있다.

### ✅ filename vs chunkfilename

- **filename** - 각 출력 번들의 이름을 결정하며, 각 번들에 대해 독립적이다. 단일 entry 지점의 경우 정적인 이름으로 설정할 수 있다. (ex. bundle.js)
- **chunkFilename** - 초기가 아닌 청크 파일의 이름을 결정하며, 런타임에서 파일 이름을 생성한다. 코드 스플리팅 시 webpack에 의해 자동 생성되는 파일 이름이다. (async chunk의 경우 chunkFilename 채택하는 듯하다. 그런데 아직 잘 안 된다 😵)

```jsx
// webpack.config.js
module.exports = {
  output: {
    path: path.resolve(\_\_dirname, './dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].js',
    publicPath: '/',
  },
  // ...
}
```

### ✅ Tree-shaking을 위한 sideEffects 설정

tree-shaking은 사용하지 않는 코드를 제거함으로써 용량을 줄이는 방식을 말한다. webpack은 v5부터 **terser** 라이브러리를 통해 기본적인 tree-shaking을 수행하고 있다.

하지만 ESM의 `import`/`export` 키워드를 사용할 때, `import`한 모듈들을 아무 곳에서도 참조하지 않는 등의 상황이 발생하면 webpack의 tree-shaking 과정에서 문제가 생긴다. 따라서 tree-shaking 시 sideEffects가 발생하지 않을 것이라고 개발자가 webpack을 안심시켜줘야(?) 한다.

package.json에 `sideEffects: false` 옵션을 명시해준다.

```jsx
// package.json
{
"name": "nolto",
"version": "1.0.1",
"sideEffects": false,
}
```

`import`한 모듈을 사용하지 않는 경우 외에도 tree-shaking이 적용되지 않는 경우들은 아래와 같다.

- 전역 함수를 사용하는 경우
- 함수 실행 코드에서 멤버변수를 변경하고 반환하는 경우
- static class properties를 사용하는 경우
- class를 사용하는 경우 등

> 원래는 babel config에 “modules”: false 옵션까지 지정하여, babel이 import 구문까지 commonJS의 require로 바꿔주는 것을 방지했다. (webpack의 tree-shaking은 import문만 이해하기 때문) 하지만 해당 옵션은 default로 false가 적용된다고 한다.

> CommonJS의 `require`는 동기적으로 이루어진다. (원래 Node.js를 위한 것이며, 브라우저용으로 탄생한 방식이 아니다!) 반면 ESM은 가져온 스크립트를 바로 실행하지 않고 `import`/`export` 구문을 찾아서 스크립트를 파싱한다. 그리고 더 이상 import 것이 없어질 때까지 import를 찾은 다음 dependencies의 모듈 그래프를 만들어 낸다.

---

**✔️ Ref**
https://webpack.kr/guides/production/
https://ui.toast.com/weekly-pick/ko_20191212
https://github.com/browserslist/browserslist
https://webpack.js.org/guides/asset-modules/
https://webpack.js.org/plugins/define-plugin/
https://www.debugbear.com/blog/bundle-splitting-components-with-webpack-and-react
https://github.com/styled-components/styled-components/issues/2254#issuecomment-560027361
https://medium.com/naver-fe-platform/webpack에서-tree-shaking-적용하기-1748e0e0c365
https://webpack.js.org/configuration/optimization/#optimizationsideeffects
https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1

```

```
