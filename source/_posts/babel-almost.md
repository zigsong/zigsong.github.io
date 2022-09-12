---
title: Babel의 (조금) 모든 것
date: 2021-09-05 20:33:00
tags: frontend
---

Babel의 (조금) 모든 것

<!-- more -->

<img src="/images/thumbnails/frontend-thumbnail.jpeg" />

프로젝트를 수행하며 Babel에 대해 알고 싶은 내용들만 정리해보는 글

## Babel

babel은 source-to-source compiler로, ES6 버전 이상의 JavaScript 코드를 ES5 코드로 변환하는 구문 변환(syntax transform)을 수행한다. JavaScript 언어를 컴퓨터 수준의 기계어로 바꾸는 것이 아니라 같은 레벨의 언어를 형태만 변환하는 것이므로 babel을 트랜스파일러(transpiler)라고 부르기도 하지만, 넓은 의미에서 컴파일러(compiler)라고 알려져 있다. babel 덕분에 개발자들은 최신 문법의 JavaScript로 편하게 개발을 할 수 있게 되었다.

---

## Babel 트랜스파일링 과정

babel 컴파일 과정은 아래와 같다.

1. **파싱(parsing) 단계** - babel이 소스코드를 파싱하여 AST를 생성한다. (이때 생성되는 트리는 JSON 형태와 비슷하다). AST에서 각각의 노드들은 관계를 형성한다.
2. **변환(transform) 단계** - AST를 브라우저가 지원하는 코드로 변환한다. 이때 개발자가 설정한 **plugin**과 **preset**들에 의해서 컴파일된다.
3. **생성(generate) 단계** - AST를 코드로 출력한다.

> **🤔 AST가 뭔가요?**
> AST(Abstract Syntax Tree)란 프로그래밍 언어의 문법에 따라 소스코드 구조를 표시하는 계층적 프로그램 표현이다. HTML을 파싱할 때도 사용된다. babel 플러그인은 babel 컴파일 단계에서 AST(Abstract Syntax Tree)를 변형하는 역할을 수행한다. Babel은 플러그인이 변형시킨 AST를 가지고 타깃 코드를 생성한다.

**Ref** https://gyujincho.github.io/2018-06-19/AST-for-JS-devlopers

---

## Babel config

babel 설정 파일을 만들어주는 방법에는 **babel.config.json**과 **.babelrc.json**이 있다. 각각은 사용하는 경우가 조금 다르다.

### 🌱 babel.config.json

babel 설정 파일을 root 폴더에 생성한다. 프로젝트 전체의 설정을 위해서 사용하며, 하나의 레포(monorepo)를 사용하고 있는 경우 권장된다. babel 6 까지는 .babelrc로 설정을 관리했지만, babel 7부터는 babel.config.json 파일을 사용하는 것을 권장한다.

[babel 공식 문서](https://babeljs.io/docs/en/usage#configuration)에서 제공하는 babel.config.json 파일의 내용은 다음과 같다.

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        }
      }
    ]
  ]
}
```

### 🌱 .babelrc.json

babel 설정을 해당 파일이 속한 package에만 적용한다. 프로젝트의 일부에만 적용되는 설정 작성 시 사용하며, 특정 파일들에 대해서 컴파일을 할 때 유용하다.

### babel-loader

webpack을 사용하고 있다면 babel을 webpack에서 실행시켜주는 도구인 `babel-loader`를 사용할 수 있다. `babel-loader` 설치 후 webpack config의 loader 목록에에 `babel-loader`를 넣고 필요한 옵션을 추가하면 된다. package.json에 명시한 scripts를 통해 webpack을 실행하면 번들링 과정에서 babel이 코드의 트랜스파일링을 진행한다.

현재 참여중인 프로젝트에서는 `babel-loader` 옵션에 꽤나 많은 preset과 plugins들을 사용하고 있다. 이때 `node_modules`는 트랜스파일링이 필요 없으므로 `exclude` 옵션으로 제외시켜 준다.

```jsx
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        exclude: "node_modules",
        use: {
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
            ],
          },
        },
      },
    ],
  },
};
```

**Ref**
https://babeljs.io/docs/en/configuration
https://webpack.js.org/loaders/babel-loader/

---

## plugin과 presets

### plugin

babel에서 코드의 변환은 plugin의 구성에 따라 결정된다. babel plugin은 babel 컴파일 단계에서 AST를 변형하는 역할을 한다. babel은 plugin이 변형시킨 AST를 가지고 타겟 코드를 생성한다.

**Ref** https://tech.kakao.com/2020/12/01/frontend-growth-02/

### presets

preset은 plugin들의 집합이다. plugin을 하나하나 추가해주는 대신, 적용할 규칙들을 그룹으로 묶은 preset으로 한번에 지정해줄 수 있다. 예를 들면 ES6 문법들을 모아둔 es2015 preset과 react에서 사용하는 문법들을 모아둔 react preset이 있다. preset들을 우선적으로 추가하고, 추가적으로 사용하고 싶은 plugin들을 기재해준다.

babel이 제공하는 공식 babel preset들은 아래와 같다.

- `@babel/preset-env`
- `@babel/preset-flow`
- `@babel/preset-react`
- `@babel/preset-typescript`

이 중 `@babel/preset-env`은 타겟 환경에 필요한 구문 변환(syntax transform), 브라우저 폴리필(browser polyfill)을 제공하며, 나머지 항목들은 각각 flow, react, typescript 사용 시 babel에서 지원해주는 preset이다.

**Ref** https://babeljs.io/docs/en/babel-preset-env

---

## Babel과 React

React에서 babel을 사용하면 JSX 문법을 트랜스파일링해줄 수 있다. 이때 **@babel/preset-react**이 필요하다. **@babel/preset-react**은 JSX 코드를 `React.createElement` 호출 코드로 바꿔준다.

```jsx
// babel 컴파일 전
const profile = (
  <div>
    <img src="profile.png" className="profile" />
    <h1>{[user.firstName, user.lastName].join(" ")}</h1>
  </div>
);
```

```jsx
// babel 컴파일 후
const profile = React.createElement(
  "div",
  null,
  React.createElement("img", { src: "profile.png", className: "profile" }),
  React.createElement("h1", null, [user.firstName, user.lastName].join(" "))
);
```

**Ref**
https://babeljs.io/docs/en/#jsx-and-react
https://babeljs.io/docs/en/babel-preset-react
https://tech.kakao.com/2020/12/01/frontend-growth-02/

---

## Babel과 TypeScript

**@babel/preset-typescript** preset을 설치하여 babel을 TypeScript와 함께 사용할 수 있다. 하지만 babel은 타입 체크까지 해주지는 않는다. 타입 체킹은 TypeScript에게 맡기기 위해 webpack 설정에서 **ts-loader**를 사용할 수 있다.

다만 **ts-loader**는 속도가 느리기 때문에, **babel-loader**를 사용하는 것을 권장하고 있다. (**ts-loader**는 HMR도 지원하지 않는다!) **babel-loader** 단독으로는 타입 체킹을 해주지 않기 때문에, **fork-ts-checker-webpack-plugin**과 같은 별도의 타입 체크 plugin을 설치해준다.

**Ref** https://babeljs.io/docs/en/#type-annotations-flow-and-typescript

---

## polyfill

Babel을 사용한다고 해서 모든 JavaScript 최신 함수를 사용할 수 있는 것은 아니다. babel 문법을 변환해주는 역할만 한다. polyfill은 구형 브라우저에서 지원하지 않는 객체를 지원하도록 특별한 코드를 추가한다. babel은 컴파일 타임에 실행되고, babel-polyfill은 런타임에 실행된다.

> **🤔 Babel 트랜스파일링 시 polyfill은 어떻게 동작할까?**
>
> 1. `.babelrc`, `.babelrc.json`, `package.json`, 또는 `babel.config.js`에 명시된 `browserslist`의 타겟 브라우저를 탐색한다.
> 2. 타겟 브라우저를 `core-js`와 매핑한다.
> 3. 특정 문법을 지원하지 않는 구형 브라우저의 경우 polyfill을 주입한다.

**@babel/polyfill**은 **core-js**와 **regenerator-runtime**을 포함하여 ES6 이상의 환경을 완전히 지원할 수 있다. **babel/polyfill**은 `Promise`, `WeakMap`과 같은 객체들을 전역 스코프에 추가해준다. 그러나 필요하지 않은 코드까지 불러와 번들 크기가 커진다는 단점이 있다.

또한 전역에 `import`로 모듈들을 불러오기 때문에, 전역 스코프를 오염시키는 문제가 있다. 이제 바벨은 위 방식 대신 **@babel/plugin-transform-runtime**과 **core-js@3** plugin을 사용하여 설정 파일을 작성할 것을 권장한다. (webpack을 사용한다면 webpack 설정 파일에 추가해준다.)

```jsx
// webpack.config.js
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 3, // corejs 설정
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

> 👾 **@babel/plugin-transform-runtime**
> babel은 모든 helper 함수들을 매번 중복으로 생성하는 것을 방지하기 위해, babel 런타임을 별도의 모듈로 분리하고자 사용한다. 설정 시 헬퍼 함수들을 한 곳(`@babel/runtime`)에서 참조하여 코드의 크기를 줄일 수 있다. 또 내부적으로 **regenerator-runtime**과 **core-js**를 peerDependencies로 갖고 있어 따로 설정을 해주지 않고 필요한 polyfill을 사용할 수 있다.

**👩‍🏫 정리!** babel은 자바스크립트의 최신 문법을 자바스크립트 ES5 표준으로 바꿔주는 역할을 한다. polyfill은 자바스크립트 문법으로 인식은 하고 있지만 `Promise`, `Set`, `Map`처럼 구형 브라우저에서 지원하지 않는 객체들을 정의해주는 역할을 한다.

**Ref**
https://medium.com/@makk.bit/babel-under-the-hood-63e3fb961243
https://tech.kakao.com/2020/12/01/frontend-growth-02/
https://babeljs.io/docs/en/config-files#project-wide-configuration
https://ljs0705.medium.com/babel-이해하기-a1d0e6bd021a
https://okchangwon.tistory.com/3

### 🤔 (추가) Babel에서 Promise를 처리하는 방식

ES6에서 등장한 Promise는 구형 브라우저들에서는 이해하지 못하는 문법이다. 따라서 polyfill이 필요하다.

Promise는 babel에서 아래와 같이 컴파일된다.

**<ES6에서 Promise>**

```jsx
let promise = new Promise((resolve, reject) => {
  return resolve(1);
});

promise.then((value) => console.log(value)).catch((e) => console.error(e));
```

**<babel로 변환된 Promise>**

```jsx
var promise = new Promise(function (resolve, reject) {
  return resolve(1);
});
promise
  .then(function (value) {
    return console.log(value);
  })
  ["catch"](function (e) {
    return console.error(e);
  });
```

Promise 자체는 코드의 변화는 크지 않다. 그렇다면 비동기 처리에서 Promise의 체이닝보다 간결하게 코드를 작성하기 위해 ES8에서 등장한 async~await 문법은 babel에서 어떻게 변환될까?

**<ES6의 async-await>**

```jsx
async function testFunc() {
  let value = await promise;
  console.log(`async ${value}`);
}

testFunc();
```

**<babel로 변환된 async-await>**

```jsx
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function testFunc() {
  return _testFunc.apply(this, arguments);
}

function _testFunc() {
  _testFunc = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      var value;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return promise;

            case 2:
              value = _context.sent;
              console.log("async ".concat(value));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })
  );
  return _testFunc.apply(this, arguments);
}

testFunc();
```

`async` 키워드는 `generator`에, `await` 키워드는 `yield`에 대응된다. 하나의 로직이 종료될 때마다 이터레이터 객체의 메서드인 `next`를 호출하여 다음 로직을 수행한다. 이때 반환값이 완료(`done`) 상태라면 값을 성공적으로 반환(`resolve`)하고, 그렇지 않다면 다시 `Promise`를 재귀적으로 호출한다.

이때 `generator`도 ES5에 정의되지 않았기 때문에 babel은 regenerator 라이브러리를 사용하여 `generator`를 흉내낸 함수를 구현한다. 여기서는 `_asyncToGenerator`가 그 역할을 하고 있다.

> 👾 generator는 비동기적 패턴을 yield를 통해 동기적인 “모습”으로 바꾸어주고, promise는 generator로 만든 iterator를 반복해서 실행해주는 역할을 한다. `await` keyword에 사용하는 함수가 항상 Promise를 반환해야하는 이유다.

**Ref**
https://www.tutorialspoint.com/babeljs/babeljs_babel_polyfill.htm
https://betterprogramming.pub/how-polyfill-works-in-babel-b8cfbbc8351f
https://velog.io/@ansrjsdn/Promise와-async-await은-ES5에서-어떻게-바뀔까
