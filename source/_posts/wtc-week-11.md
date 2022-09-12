---
title: 우테코 11주차 이야기
date: 2021-04-17 08:59:44
tags: woowacourse
---

webpack으로 React 프로젝트 시작하기 | React setState의 비동기성 | React 이모저모

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 페어 프로그래밍

브랜과 일주일이라는 짧은 시간 동안 페어를 진행했다. 전공자라는 메리트도 있겠지만, 무엇보다도 공식문서를 잘 확인하는 습관이 멋진 페어다. 대충 구글링하여 스택오버플로우나 블로그에서 필요한 정보만 쏙쏙 베껴왔던 지난날의 모습들을 반성한다. 브랜 덕분에 처음으로 CRA 없이 React App을 처음부터 만들어 보았다. 중간중간에 내가 잘 따라오고 있는지 한번씩 질문도 해준 덕에 잊지 않고 정리할 수 있었다.

다만 브랜도 나만큼 타이핑이 빠를 뿐 아니라 생각하는 시간과 그것을 코드로 옮기는 시간도 아주 빠르다. 종종 벅찬 기분이 들었다! 그래도 중간중간에 말을 하면서 어느 정도 해소가 되었다. 그리고 “깔끔하다”, “좋다” 등의 긍정적인 피드백을 남발하여(?) 점점 신빙성이 떨어지긴 했지만 페어에게 자신감을 주고 우리 코드에 확신을 가지게끔 도와줬던 것 같다.

브랜은 내게 낯선 것을 겁내지 말고 시도했으면 좋겠다고 했다. 고작 몇 개월 아마추어스러운 React를 다뤘다고 코드 스타일이 조금 남아 있어서, 처음 보는 방식들을 낯설어 하고 내 코드 스타일이 일반적인 패턴이라고 생각하는 면이 없잖아 있었다. 소신 있게 코드를 적용하고, 틀리면 지적 받을 수 있는 용기를 가지자.

---

## 공부하기

### JavaScript Web Worker

싱글 스레드 언어인 JavaScript는 한번에 하나의 일 밖에 수행하지 못한다. 그러나 JavaScript가 동작하는 브라우저는 싱글 스레드가 아니다. 따라서 스크립트 연산을 웹 어플리케이션의 메인 스레드와 분리된 별도의 백그라운드 스레드에서 작동시키기 위한 기술이 필요한데, JavaScript에서는 **Web Worker**를 사용한다.

worker는 `Worker()` 객체를 만들어서 사용한다. worker로 생성한 파일은 현재 window와는 다른 전역 맥락에서 동작하는 워커 스레드에서 작동한다.
워커 스레드는 사용자 인터페이스(UI)를 방해하지 않고 작업을 수행한다.

워커와 메인 스레드 간의 데이터 교환은 메시지 시스템을 사용한다. `postMessage()`로 데이터를 전송하고, `onMessage()`로 데이터를 수신한다. 이때 데이터는 공유가 아닌 복제를 통해 전달된다.

```html
<body>
  <!-- contents -->
</body>
<script>
  if (window.Worker) {
    const worker = new Worker("worker.js");
    worker.onmessage = (event) => {
      console.log(event.data);
      // 'done'
      worker.terminate();
    };
  }
</script>
```

1. main thread에서 `new Worker('worker.js')` 로 worker thread를 만든다.
2. main thread에서 `worker.onmessage` 에 worker의 메시지를 전달받기 위한 이벤트 핸들러를 등록한다.
3. worker thread에서 `worker.js`의 작업을 처리한 후 `postMessage()`로 데이터를 main thread의 `worker.onmessage`에 전달한다.
4. 만약 더이상 worker thread가 필요 없거나 작업을 종료해야 한다면 `worker.terminate()`를 호출한다.

부모-자식 간에만 소통하는 `DedicatedWorker`와, 다른 worker와 작업을 공유할 수 있는 `SharedWorker`로 구분된다. `Dedicated Worker` 는 Worker를 처음에 생성한 스크립트만 액세스 할 수 있는 반면, `Shared Worker`는 복수의 스크립트에서 액세스할 수 있다.

**Ref**

- https://pks2974.medium.com/web-worker-간단-정리하기-4ec90055aa4d
- https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API

### webpack으로 React App 시작하기

`CRA(create-react-app)`을 사용하는 대신, webpack을 이용해 필요한 모듈들과 React 패키지를 직접 설치하여 React App을 만들어 보자. (이번 미션에서 페어 브랜이 많이 도와줬다!)

**1. `yarn init`으로 `package.json` 설치**

**2. `react`와 `react-dom` 패키지 설치**

```shell
yarn add react react-dom
```

**👾 `react`와 `react-dom` 패키지의 차이**
`react`는 React 자체를 제공하는 라이브러리, `react-dom`은 React와 브라우저 DOM을 연결해주는 역할을 한다.

**3. babel 세팅**

```shell
yarn add babel-loader @babel/core @babel/preset-react @babel/preset-env -D
```

- `babel-loader`: JavaScript 파일을 babel preset/plugin과 webpack을 사용하여 ES5로 컴파일해주는 plugin
- `@babel/core`: ES6 문법을 ES5로 바꿔준다.
- `@babel/preset-react`: react의 JSX를 JavaScript로 바꿔준다.
- `@babel/preset-env`: ES6의 모든 문법들 뿐 아니라 브라우저에 맞춰서 컴파일해준다. babel이 갖고 있는 여러 plugin들을 모아둔 것.

**4. webpack 설정**

```shell
yarn add webpack webpack-dev-server webpack-cli html-webpack-plugin -D
```

- `webpack-cli`: build 스크립트를 통해 webpack 커맨드를 사용할 수 있게 해준다.

- `webpack-dev-server`: webpack에서 제공하는 development mode용 서버

- `html-webpack-plugin`
  - fileName: dist 파일에서 생성해주는 파일. 디폴트는 `index.html`이다.
  - template: webpack 번들링 결과로 나온 html 파일들 중 script를 심어줘야 할 파일

여기에 더해 `style-loader`와 `css-loader`를 추가해준다.
`style-loader`는 css를 DOM에 주입시키는 역할,
`css-loader`는 css 파일들을 읽어 html의 `<style>`에 넣어주는 역할을 한다.
이때 webpack의 설정은 오른쪽부터 적용되기 때문에, `css-loader`를 `style-loader` 이후에 배치한다.

👾 만약 style 태그 대신 css파일로 만들고 싶은 경우 `MiniCssExtractPlugin`을 사용한다.

아래와 같이 `webpack.config.js` 파일을 세팅했다.

```jsx
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: "3.10",
                },
              ],
              "@babel/preset-react",
            ],
            plugins: ["babel-plugin-styled-components"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9000,
    hot: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: "./index.html" })],
};
```

**Ref**

- https://velog.io/@pop8682/번역-React-webpack-설정-처음부터-해보기
- https://www.zerocho.com/category/Webpack/post/58ac2d6f2e437800181c1657

---

## 알아보기

### yarn eject

CRA(Create-React-App)로 만든 React App에서 `yarn eject`를 실행하면 숨겨진 모든 설정 파일들을 밖으로 추출해 준다. `config`와 `scripts` 뿐만 아니라 `babel`과 관련된 세팅들까지 확인할 수 있다. `package.json`에서 babel plugin 등을 추가적으로 세팅할 수도 있다.

👾 주의! `yarn eject`로 한번 뜯어놓은 앱은 다시 돌이킬 수 없다.

### `<noscript>`

`<noscript>` 태그는 클라이언트 사이드 스크립트(client-side scripts)를 사용하지 않도록 설정했거나, 스크립트를 지원하지 않는 브라우저를 위한 별도의 콘텐츠를 정의할 때 사용한다.

**Ref**
http://www.tcpschool.com/html-tags/noscript

### `<script defer>`

```jsx
<script src="index.js" defer="defer"></script>
```

`<script>` 태그의 `defer` 속성은 페이지가 모두 로드된 후에 해당 외부 스크립트가 실행됨을 명시한다.

일반적으로 `<script>`는 html의 `<head>` 안에 작성한다. `<script>`를 `<head>`에 작성하면 css 등 외부로부터 불러오는 리소스 파일을 한 군데에서 관리할 수 있는 장점이 있다. 그런데 브라우저는 html 마크업을 파싱하여 DOM 트리를 구성하고 페이지를 렌더링한다. html 파싱하는 동안 브라우저는 `<script>`를 만날 때마다 파싱을 중지하고 스크립트를 로드하고 실행한다. 이 과정에서 렌더링이 지연되기 때문에, html 파싱이 끝난 후 `<script>`를 로드하기 위해 html 파일의 가장 아래, `<body>`가 닫히기 전에 작성해주기도 한다.

`<script>`는 기본적으로 다운로드와 실행이 순차적으로 진행되지만, `defer` 속성을 추가하면 브라우저가 `<script defer>`를 만났을 때 다운로드를 시작하지만, html 파싱을 막지 않고 `</html>`을 만났을 때 실행된단. 즉 `DOMContentLoaded` 이벤트 이전에 실행되는 것이다.

webpack의 번들링 결과 생성된 `dist/index.html`의 `<script>`에서 `defer` 속성을 확인할 수 있다.

```jsx
<head>
  <script defer src="bundle.js"></script>
</head>
```

**Ref**

- https://webdir.tistory.com/322
- https://kimlog.me/js/2019-10-05-script/

### package.json에 contributor 명시하기

```jsx
// package.json
"contributors": [
  {
    "name": "zigsong",
    "email": "wldms5764@gmail.com"
  },
  {
    "name": "somebody",
    "email": "somebody@naver.com"
  }
],
```

위와 같이 명시해주면,
별다른 설정 없이 상대방이 한 commit에 내 이름도 함께 올라간다.
<img src="01.png" />

github의 commit 주인(?)에도 두 명 모두 귀엽게 올라가 있다.
<img src="02.png" />

### Tailwind CSS

tailwind는 직역시 ‘순풍’이라는 뜻이다. 왜 이런 이름을 채택했을까? 모르겠다.

Tailwind CSS는 Bootstrap 등과 비슷하게, 미리 정해진 class명을 태그의 class 속성에 넣어주기만 하면 CSS를 입혀주는 방식이다.

```jsx
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click Me!
</button>
```

Utility-First 컨셉이라고 하는데, html 코드의 태그에 스타일을 정의할 수 있기 때문에 별도의 CSS 파일을 관리할 필요가 없다는 장점이 있다.
또 class명을 따로 짓지 않아도 돼서 BEM, OOCSS 사용 시의 불편함도 해결할 수 있다.
이와 유사하게 평소 써왔던 styled-component의 어려움은 매번 컴포넌트를 새로 만들어야 한다는 점이었는데, tailwind CSS는 그런 고민을 없애준다.

현재 github과 nuxt.js 공식 사이트 등에서 Tailwind CSS를 사용하고 있다.

**Ref**

- https://tailwindcss.com/docs
- https://wonny.space/writing/dev/hello-tailwind-css

### reset CSS

브라우저마다 기본으로 제공되는 HTML tag들의 `padding`, `display` 등의 스타일 속성을 모두 초기화해준다.
`reset.css`에 내용을 작성 후 `import` 하면 반영된다.

**Ref** https://meyerweb.com/eric/tools/css/reset/

---

## 질문하기

### Virtual DOM

#### Q. 우리는 JavaScript만으로 앱을 구성할 때 명령형으로 작성했을까요? 선언형으로 작성했을까요?

명령형 프로그래밍은 **‘어떻게(HOW)’**, 선언형 프로그래밍은 **‘무엇(WHAT)’** 에 중점을 두고 있다.

집에서 루터회관에 간다고 했을 때, 명령형 방식은
“집에서 나온다. ➡️ 9호선을 탑승한다. ➡️ 종합운동장 역에서 2호선으로 환승한다. ➡️ 잠실역에서 내린다 ➡️ … “
로 이루어질 것이다.

반면 선언형 방식은 “루터회관은 잠실역 8번 출구 근처에 위치해 있다.”라고 할 것이다.

선언형 프로그래밍의 경우 함수 실행 시 동일한 인자 입력에 대해 사이드 이펙트 없이 항상 같은 값을 반환 받는다는 보장이 있다. 데이터 중심의 순수함수로 작성되는 것이다. 이 때문에 코드의 가독성과 재사용성을 높일 수 있다는 장점이 있다.

그동안의 JavaScript 앱은 많은 경우 명령형의 방식으로 작성해왔다.
예를 들어, 로또 당첨 결과를 가지고 모달을 띄워주는 함수가 있을 때 다음과 같이 필요한 `rankCounts`와 `earningRate` 정보를 받아 화면에 모달을 표시해준다.

```jsx
openModal(rankCounts, earningRate) {
  this.$modal.classList.add('open');
  this.showRanks(rankCounts);
  this.showEarningRate(earningRate);
}
```

하지만 선언형 방식으로 작성한 경우도 있다. 다음 코드는 수동 로또를 생성해서 현재 앱의 `lottos` 배열에 직접 값을 담아주고 있다.

```jsx
createManualLottos(manualTickets) {
  this.lottos = manualTickets.map(manualNumbers => new Lotto(manualNumbers));
}
```

또 React에서 주로 사용되는 JSX 문법은 선언형 프로그래밍을 가능하게 해준다. html과 같은 형태의 코드를 통해 결과물을 바로 확인할 수 있는 것이다.

아래 예시는 버튼을 클릭했을 때, `openModal` 함수가 실행되어야 함을 알려준다.

```jsx
<button onClick={this.openModal}>
```

#### Q. React 이전의 SPA 라이브러리들은 무엇이 있었을까요?

jQuery, Backbone, Vue.js, Angular, Ember 등

#### Q. React 탄생 배경은 어떻게 될까요?

Backbone, AngularJS가 생태계를 장악하던 시절, SPA 제작을 위한 보다 구조화된 방식의 프레임워크가 필요해졌다.

**Component**
UI를 구성하는 개별 뷰 단위인 Component는 앱에서 각 부분들의 재사용성을 크게 향상시켜준다.

**JSX**

```jsx
class MyComponent extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
ReactDOM.render(<HelloMessage name="zig" />, root);
```

위와 같이 작성한 JSX 코드는 babel 컴파일 과정을 거쳐 다음과 같이 변환된다.

```jsx
class MyComponent extends React.Component {
  render() {
    return React.createElement("div", null, "Hello ", this.props.name);
  }
}

ReactDOM.render(React.createElement(MyComponent, { name: "zig" }), root);
```

html 코드를 통해 선언적으로 작성한 뷰 단의 코드를 통해 최종 결과물에 직관적으로 도달할 수 있다. 덕분에 코드는 더욱 예측 가능해지고, 협업과 유지보수에도 크게 도움이 되었다.

React는 이러한 Component, JSX 등의 매력적인 feature와 함께 **Virtual DOM**이라는 강력한 무기를 가지고 탄생하였다. 컴포넌트가 render하는 return값을 가지고 현재 브라우저에 띄워진 DOM과 비교하여, 서로 다른 부분만을 다시 그려내는 것이다.

이를 통해 브라우저가 DOM을 해석하고 렌더링하는 비싼 작업을 Virtual DOM을 통해 미리 최적화시키고 컴포넌트 단위로 묶어서 관리할 수 있게 되었다.

Virtual DOM은 단순한 DOM 조작 도구가 아니라, 컴포넌트 단위로 움직이는 선언적인 프로그래밍을 위해 동작한다. DOM 조작은 `react-dom` 라이브러리에 맡기고, 화면이 어떻게 보여져야 하는지만 이벤트와 데이터의 흐름을 통해 조작하면 된다. 이로 인해 데이터의 흐름 방향과 요소들 간의 연관성을 파악하기가 수월해졌다.

**Ref**

- https://boxfoxs.tistory.com/430
- https://2020.stateofjs.com/en-US/technologies/front-end-frameworks/
- https://medium.com/@RianCommunity/https://medium.com/@RianCommunity/react의-탄생배경과-특징-4190d47a28f

---

### JSX

#### Q. `#root`를 미리 선언해놓는 이유는 무엇일까요?

React 앱의 entry인 `index.js`에는 항상 아래 코드가 존재한다.

```jsx
ReactDOM.render(<App />, document.getElementById("root"));
```

html 파일의 정해진 지점에 React DOM을 삽입하기 위한 목적이다. 일반적으로 html 파일의 `body` 태그 내부에 그려진다.

```jsx
<body>
  <div id="root"></div>
</body>
```

React DOM에 의해 관리되는 모든 것이 이 요소 안에 들어가므로 이것을 **root DOM 노드**라고 부른다.

**Ref**

- https://www.w3schools.com/react/react_render.asp
- https://reactjs-kr.firebaseapp.com/docs/rendering-elements.html#dom에서-요소-렌더링하기

#### Q. `import` 방법도 다른 것 같네요

#### Q. React는 들어본 것 같은데 `react-dom`은 무엇일까요?

`ReactDOM`은 React와 실제 DOM을 연결해주는 다리로, root DOM 노드 안에 들어가는 엘리먼트를 모두 관리하는 역할을 한다. `ReactDOM`의 `render` 메소드는 React 엘리먼트를 container DOM에 렌더링하고 컴포넌트에 대한 참조를 반환한다.

```jsx
ReactDOM.render(<App />, document.getElementById('root');
```

**Ref**

- https://ko.reactjs.org/docs/react-dom.html
- https://ko.reactjs.org/docs/rendering-elements.html

#### Q. `render`가 하는 일은 무엇일까요?

컴포넌트의 `render` 메소드는 virtual DOM을 생성한다. 이때 업데이트 이후의 상태를 기존 화면의 DOM과 비교하여 달라진 부분만 렌더링해준다.

#### Q. JSX와 표현식은 같은 걸까요?

JSX는 표현식이다. 컴파일이 끝나면, JSX 표현식이 정규 JavaScript 함수 호출이 되고 JavaScript 객체로 인식된다.

표현식이기 때문에 변수에 할당할 수 있으며,

```jsx
const element = <div tabIndex="0"></div>;
```

if문 안에 사용할 수 있고,

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

함수의 반환값으로 사용된다.

```jsx
function MyComponent() {
  return <h1>Hello, {props.name} </h1>;
}
```

JSX 내부에서는 문을 사용할 수 없다.

```jsx
// wrong
function MyComponent() {
  return (
    {
      if (props.name) {
        <h1>Hello, {props.name} </h1>
      } else {
        <h1>Hello, world} </h1>
      }
    }
  );
}
```

삼항연산자는 표현식으로 사용 가능하기 때문에 JSX 내부에서 사용할 수 있다.

```jsx
// good
function MyComponent() {
  return (
    {
      props.name ?
      <h1>Hello, {props.name}</h1> :
      <h1>Hello, world </h1>
    }
  );
}
```

#### Q. JSX와 `React.createElement()` 는 무슨 관계일까요?

JSX는 객체를 표현한다. 아래 두 예시는 동일하다.

```jsx
const element = <h1 className="greeting">Hello, world!</h1>;
const element = React.createElement(
  "h1",
  { className: "greeting" },
  "Hello, world!"
);
```

JSX는 컴파일 후 `React.createElement()`의 결과로 생성된 element와 같은 형태로 바뀐다.

#### Q. `document.createElement()`와 다른 점은 무엇일까요?

브라우저에서 제공하는 `createElement()`와 React에서 제공하는 `createElement()`는 받는 인자와 작성 방식이 서로 다르다.

```jsx
document.createElement(tagName[, options]);
React.createElement(component, props, ...children);

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

---

### Class

---

### State

#### Q. 상태를 직접 변경하지 않고 굳이 `setState()`를 사용하는 이유가 무엇일까요?

직접 state를 수정하면 컴포넌트가 리렌더링되지 않는다. 오로지 `setState()`만이 상태를 올바르게 업데이트하고 컴포넌트를 리렌더할 수 있다.

#### Q. `setState()`는 비동기적으로 작동할까요?

React는 성능을 위해 여러 `setState()` 호출을 단일 업데이트로 한꺼번에 처리한다.
`setState()`의 인자로 객체가 들어오면 상태가 즉시 업데이트되지 않을 수 있다.

```jsx
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

상태의 동기적인 업데이트를 위해 객체보다는 함수를 인자로 사용하는 다른 형태의 `setState()`를 사용할 수 있다.

```jsx
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment,
}));
```

#### Q. 불변성을 지켜야 하는 이유는 무엇일까요?

의도하지 않은 특정 객체가 변경되면 참조하고 있던 객체에서도 변경이 일어난다. 이 상태를 유지할 경우 side-effect가 발생할 확률과 프로그램의 복잡도가 높아지기 때문에 상태의 불변성을 지키는 것은 중요하다.

---

### Handling Events

#### Q. `bind`를 사용해야하는 이유는 무엇일까요?

```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // constructor에서 binding
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
```

this binding을 해주지 않고 `handleClick`을 전달한다면, 함수가 실제 동작할 때 `this`는 `undefined`가 된다. (이때 `handleClick`에서 `this`를 출력해보면, 콜백이 전달되는 곳인 `button` 태그가 찍힌다.)
class 컴포넌트의 `constructor`에서의 this binding을 통해 현재 컴포넌트에서 선언한 `handleClick`이 해당 컴포넌트에 binding되어 있는 메소드임을 명시하여, 콜백으로 올바르게 동작하게끔 할 수 있다.

#### Q. 매번 사용하는 `bind`를 생략하는 방법이 있을까요?

1. public class field 문법 사용 (실험적인 방법)

   ```jsx
   class Toggle extends React.Component {
     // 이 문법은 `this`가 handleClick 내에서 바인딩되도록 합니다.
     // 주의: 이 문법은 *실험적인* 문법입니다.
     handleClick = () => {
       console.log('this is:', this);
     }
   ```

   위와 같이 사용하면 `handleClick`은 `Toggle` 클래스의 prototype이 아닌 `Toggle` 인스턴스의 메소드로 선언된다. 따라서 프로그램에서 사용되는 시점에서의 문맥 상 `this`를 참조할 수 있다.

2. 콜백에 화살표 함수 사용하기

   화살표 함수로 콜백을 전달하면, `this`는 해당 메소드가 바인딩된 컴포넌트를 가리키게 된다.

   ```jsx
   class Toggle extends React.Component {
     //...

     render() {
       // 이 문법은 `this`가 handleClick 내에서 바인딩되도록 합니다.
       return <button onClick={() => this.handleClick()}>Click me</button>;
     }
   }
   ```

#### Q. JSX 내부에 이벤트 핸들러로 콜백 함수를 전달하는 것과 함수를 전달해서 사용하는 것은 어떤 차이가 있을까요?

위에서 설명한 내용

**Ref** https://ko.reactjs.org/docs/handling-events.html

---

### Key

#### Q. 왜 리스트의 key값으로 index를 사용하는 것은 안티 패턴일까요?

```jsx
todos.map((todo, index) => (
    <Todo {...todo} key={index} />
  ));
}
```

위와 같이 리스트의 key값으로 index를 사용할 경우, 리스트에 새로운 아이템이 추가되거나 삭제되었을 때 react가 방금 수정된 index의 아이템에 매칭되는 컴포넌트를 올바르게 찾지 못할 수 있다.

리스트의 재배열이 일어나지 않는다면 key값을 index로 사용해도 문제가 없겠지만, 가능한 변하지 않는, 영구적이고 고유한 값을 key값으로 사용하는 것이 좋다.

#### Q. 데이터에 고유한 id 값이 없다면 어떻게 key 값을 설정하는 게 좋을까요?

그러나 데이터 자체에 고유한 id값이 없다면 무엇을 key값으로 사용해야할지 고민이 될 것이다.
이럴 때는 [nanoid](https://www.npmjs.com/package/nanoid)나 [nanoid](https://www.npmjs.com/package/uuid) 등 잘 만들어진 id 부여 모듈을 사용해볼 수 있다.

**Ref** https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318

---

### Ref

#### Q. Ref를 사용해야 하는 케이스는 무엇이 있을까요?

React 공식문서에 기재된 Ref를 사용해야 하는 케이스에는 다음의 경우들이 있다.

- 포커스, 텍스트 선택영역, 혹은 미디어의 재생을 관리할 때

- 애니메이션을 직접적으로 실행시킬 때

- 서드 파티 DOM 라이브러리를 React와 같이 사용할 때

#### Q. Ref를 남용하면 안되는 이유는 무엇일까요?

React는 props를 통해서만 컴포넌트 간의 소통이 가능하도록 한다. 그러나 ref를 사용하면 다른 컴포넌트들에 직접적으로 접근할 수 있다. ref는 데이터의 동기화를 보장하지 않고 데이터의 캡슐화는 실패한다. 데이터의 변경이 의도한 방식과 다르게 동작하여 state는 업데이트되지 않아 컴포넌트의 리렌더링이 발생하지 않는 상황이 발생할 수 있다.

또 React는 상태 주도(state-driven) 개발을 지향하며, 상태를 갖는 컴포넌트들 간의 관계로 구성된다. ref를 사용하는 것은 이벤트 주도(event-driven) 개발이 되어, React 컴포넌트들에서 상태를 관리하기가 어려워진다.

state와 props를 사용하여 컴포넌트 간의 관계를 유지하자. props chain이 복잡해졌을 때는 redux 등의 상태 관리 도구를 사용해볼 수도 있다.

**Ref**

- https://ko.reactjs.org/docs/refs-and-the-dom.html#gatsby-focus-wrapper
- https://blog.logrocket.com/why-you-should-use-refs-sparingly-in-production/

---

### Lifecycle

---

### Function Component

---

## 기타

### 잘 정리된 이력서보다 중요한 것

작년 내내 면접을 보러다닐 일이 많았는데, 대부분은 잘 보지 못했던 것 같다.
아무래도 지식 수준이 많이 떨어졌기 때문에 😞

앞으로 제출할 이력서와 보러 다니게 될 면접을 준비하며 생각해볼 만한 이야기들이다.

**1. 지원동기를 명확히 하자**
지원하는 회사의 그 팀에서 정말 하고 싶은 일이 있다는 것을 명확히 밝히자. 확실한 이유가 있다면 회사에서도 더욱 눈여겨볼 것이다. 그리고 동기부여는 누가 주입시켜주는 것이 아니라는 사실.

**2. 함께 일하기**
혼자서 일하는 회사는 없다. 많은 사람들과 커뮤니케이션하고 일했던 경험을 보여주자.

**3. 퍼포먼스를 기재하기**
과정만큼 중요한 것이 **결과**이다. 인턴이든, 외주든 그동안 수동적으로 일해온 것이 대부분이었기에 어떤 일을 했고, 그래서 어떤 퍼포먼스를 냈는지는 자신 있게 말하지 못했던 것 같다. 지원하는 회사에 나와 비슷한 수많은 사람들이 있는데 내가 떨어져서 억울하다면, 나 자신이 과연 더욱 나은 성과를 낼 수 있는 사람인지 돌이켜보자.

**4. 어려움 경험하기**
어려움을 일부러 경험할 수는 없겠지만, 프로덕트를 개발하다 장애를 맞딱뜨리는 등의 상황을 잘 헤쳐나간 경험이 있다면 좋은 이야기가 될 것이다.

**5. 본인에 대해 잘 이해하기**
지원하는 회사의 팀과 나의 지향점이 맞는지를 판단할 수 있어야 한다. 팀이 일하는 방식과 목표가 나와 같은 방향인지 확인하고 어필하자.

Ref https://minieetea.com/2021/04/archives/6193

---

## 마무리

Lv2가 시작되었다! 짧았던 방학은 순식간에 지나가버리고 이제는 React로 시작해야 한다.
Lv1도 순식간이었는데, 이만큼의 시간을 보내고 나면 더 이상 수업과 페어 프로그래밍이 없다니 아쉽기도 하다. 아쉬워지기 전에 Lv2의 하루하루도 소중하고 알차게 보내기로 다짐!
