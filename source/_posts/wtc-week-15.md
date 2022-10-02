---
title: 우테코 15주차 기록
date: 2021-05-15 23:23:04
tags: woowacourse
thumbnailImage: https://i.imgur.com/bHl7fHd.jpg
---

우아한테크코스 15주차

useCallback과 useMemo | React의 Router | Redux Middleware

<!-- more -->

---

## 페어 프로그래밍

redux thunk를 본격적으로 사용하기 시작했다. api 호출을 위해 액션을 3개씩 만드는 것에서 다들 불편함과 답답함을 느끼게 되는 것 같다. redux toolkit 등 redux action을 관리해주는 도구의 필요성을 느끼고 있다. 처음부터 좋아보여 쓰는 것이 아니라, 필요에 의한 도구의 도입! 좋은 깨달음인 것 같다.

TypeScript도 중간중간 막혔다. 유일하게 TS를 해본 멤버인 내가 많이 기여했어야 했는데, 나도 다 까먹어서 계속 헤맨 것 같아 미안하다. 그래도 체프와 유조가 여기저기서 잘 찾아다 줘서 AnyScript 없이 잘 쓸 수 있었다. 일단 any는 eslint가 욕한다. 쓸 수 없다.

Immer도 쓰게 되었다. 상태가 깊어지면서 불변성을 유지하며 업데이트를 하기 어려웠는데, 모든 리듀서에 Immer를 쓰는 것이 옳은 방식인지는 잘 모르겠다.

긴 미션에 다들 조금씩 지쳐가는 게 보였다. 물론 나도… 그리고 자꾸 힘 빠지면 시니컬하게 말하는 습관이 있는 것 같은데, 내가 들어도 가끔 기분 나쁘게 들린다. 페어들은 아니라고 해줬지만, 반성하고 고쳐야겠다. snackbar 때문에 거의 이틀을 날리고 라이브러리를 사용했다. 주화입마에 빠지게 된 걸까? 이것저것 해보다가 PR을 조금 늦게 냈다.

주말에 모여서 맥주 한잔 했다. 내가 너무 졸려서 많은 얘기를 나누진 못했지만, 좋은 페어들과 값진 시간을 보냈다. 자꾸 ‘나는 바보야’를 외치는 체프와, 이상한 드립을 고수하는 유조와 함께 즐거운 페어를 한 것 같다! 마지막 날 회고 때, 유조가 적어준 말이 인상 깊다. “페어가 1명 늘어났지만 배운 것은 3배는 늘어난 것 같다.” 나도 마찬가지!

---

## 테코톡 - 브라우저 렌더링

(정리 중)
페어였던 체프가 발표한 브라우저 렌더링
지난 주에 내 차례에서도 살짝 다뤘기 때문에 어느 정도 알고 있다 생각했는데, 생각보다 모르는 내용이 많다.

특히 Performance에서 이것저것 체크해볼 수 있는 건 정말 멋지다.
아래는 발표 후 체프가 올려준 자료

**Ref** https://d2.naver.com/helloworld/59361

---

## 공부하기

### useCallback, useMemo

**useCallback**
메모이제이션된 콜백을 반환한다. 두 번째 인자로 들어가는 콜백의 의존성이 변경되었을 때만 콜백 함수가 새로 생성된다. (기본적으로는 컴포넌트가 리렌더링될 때마다 함수가 새로 만들어진다.)

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
const getProducts = useCallback(async () => {
  setLoading(true);

  try {
    const response = await api.get("/products");
    setProducts(response.data);
  } catch (error) {
    enqueueSnackbar(MESSAGE.GET_PRODUCTS_FAILURE);
  }

  setLoading(false);
}, [enqueueSnackbar]);
```

`enqueueSnackbar`가 변경될 때마다 `getProducts`가 재생성되고, 그때마다 `useEffect` 내의 호출을 통해 api 요청을 다시 보낸다.
사실상 `enqueueSnackbar`는 변경되지 않기 때문에 `getProducts`는 한번만 생성되고 호출도 한번만 발생하지만, eslint의 deps 규칙에 의해 의존성 배열에 추가되었다.

**useMemo**
메모이제이션된 값을 반환한다. 의존성이 변경되었을 때만 값을 다시 계산한다.
미션은 아니지만, 학교 수업 팀플에서 웹을 제작하는 중에 `useMemo`를 사용할 상황에 마주했다.

```tsx
const Home = () => {
  const [selectedLength, setSelectedLength] = useState<number>(0);
  const shuffledCorps = useMemo(() => _.shuffle(corporations), []);

  const handleSelectCard = () => {
    setSelectedLength(selectedLength + 1);
  };

  return (
    <Styled.Root>
      <Styled.GridContainer>
        {shuffledCorps.map((corp) => (
          <TarotCard key={corp.id} corp={corp} onClickCard={handleSelectCard} />
        ))}
      </Styled.GridContainer>
    </Styled.Root>
  );
};
```

`TarotCard`를 클릭할 때마다 `useState`로 선언한 `selectedLength`가 변경되어 `shuffle`을 새로하고 있었다.
컴포넌트가 마운트될 때 `shuffle`을 한 번만 실행시켜주기 위해 `useMemo`를 사용했다.

**Ref** https://ko.reactjs.org/docs/hooks-reference.html

### React의 Router

많이 사용하는 `BrowserRouter`, `HashRouter`, `MemoryRouter` 모두 `Router`의 하위 항목들이다.

**BrowserRouter**는 HTML5의 history API (`pushState`, `replaceState`, `popstate`)를 이용한다. 이전 브라우저들을 지원하지 않는다.
특정 path에서 새로고침 시 경로를 찾지 못해 404 에러가 발생한다. React에서 Redirection을 설정해 줘도 인지하지 못하는 것이다.

**HashRouter**는 URL의 hash 조각을 이용한다. 그래서 주소에 해쉬(`#`)가 붙으며, 검색 엔진이 읽지 못한다.
`location.key`나 `location.state`를 지원하지 않는다는 점에 유의하자. 이전 브라우저들을 지원하며, 공식 문서에서는 `BrowserRouter`를 사용할 것을 권장하고 있다.

**MemoryRouter**는 URL의 history를 메모리에 저장한다. (페이지의 주소창과 관련이 없다) 테스트나 non-browser 환경(React Native) 등에서 사용한다. 미션에서는 스토리북 설정에서 사용했다.

```tsx
import { MemoryRouter } from "react-router-dom";

addDecorator((story) => (
  <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
));
```

**Ref**

- https://reactrouter.com/web/guides/quick-start
- https://medium.com/@daniel.hramkov/browserrouter-vs-hashrouter-e8bf1c3824ce
- https://ui.dev/build-your-own-react-router-v4/

### redux에서 middleware가 필요한 이유

Dan이 StackOverflow에 직접 답을 남기기도 하는구나 신기하다.
다른 무엇보다도, redux의 action creator가 순수함수여야 한다는 원칙은 사실 틀렸다는 것이 가장 충격적이었다.

Dan의 답변은,

> So it is just easier from the maintenance point of view to extract action creators into separate functions.

그냥 action creator들을 더 작은 조각으로 분리시키기 위함이었다! 일종의 syntax sugar인 셈이다.

middleware가 없이 action을 생성했다면, redux action을 사용하는 컴포넌트에서는 다음과 같이 작성해야 한다.

```tsx
// action creator
function loadData(dispatch, userId) { // needs to dispatch, so it is first argument
  return fetch(`http://data.com/${userId}`)
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_DATA_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_DATA_FAILURE', err })
    );
}

// component
componentWillMount() {
  loadData(this.props.dispatch, this.props.userId); // don't forget to pass dispatch
}
```

컴포넌트에서 해당 함수가 async인지 여부를 알고 있어야 하는 것이다.
그러나 middleware를 거쳐 action을 작성한다면, 일반적인 방식의 dispatch 호출이 가능하다.

```tsx
// action creator
function loadData(userId) {
  return dispatch => fetch(`http://data.com/${userId}`) // Redux Thunk handles these
    .then(res => res.json())
    .then(
      data => dispatch({ type: 'LOAD_DATA_SUCCESS', data }),
      err => dispatch({ type: 'LOAD_DATA_FAILURE', err })
    );
}

// component
componentWillMount() {
  this.props.dispatch(loadData(this.props.userId)); // dispatch like you usually do
}
```

지난 2년 간 낚였던 redux의 3대 원칙… Dan의 마지막 답변.

> Action creators were never required to be pure functions.

😐

**Ref**

- https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux

### redux로 전역 상태 관리하기 & normalize 다루기

**Ref**

- https://jbee.io/react/react-2-redux-architecture/
- https://jbee.io/react/react-redux-normalize/

---

## 알아보기

### heroku로 json server 배포하기

페어 체프가 도와줬다!

1. [Heroku](https://id.heroku.com/login)에 가입한다.

2. 새로운 앱을 만든다.
   <img src="01.png" />
   화면의 'Create a new app'을 클릭하거나 터미널에 아래와 같이 입력한다.

```shell
heroku login
heroku create [app-name]
```

3. json server 사용을 위한 파일을 추가한다.

   3-1. 프로젝트 루트 디렉토리에 `server` 폴더 생성

   3-2. `db.json` 생성

   3-3. `server.js`

   생성 후 아래 코드 입력

   ```jsx
   const jsonServer = require("json-server");
   const server = jsonServer.create();
   const router = jsonServer.router("db.json");
   const middlewares = jsonServer.defaults();
   const port = process.env.PORT || 3000;

   server.use(middlewares);
   server.use(router);

   server.listen(port);
   ```

   3-4. `package.json`에 아래 코드 입력

   ```jsx
   {
     "name": "json-server-deploy",
     "version": "1.0.0",
     "description": "Simple json database to deploy to the host of your choice",
     "main": "server.js",
     "scripts": {
       "start": "node server.js"
     },
     "keywords": [
       "json-server,heroku, node, REST API"
     ],
     "author": "Jesper Orb",
     "license": "ISC",
     "dependencies": {
       "json-server": "^0.16.2"
     }
   }
   ```

   3-5. `yarn` 설치

   ```shell
   yarn install
   ```

   [코드 출처](https://github.com/jesperorb/json-server-heroku)

   3-6. `gitignore`에 `node_modules` 추가

4. heroku에 배포하기
   `git add`, `git commit` 후 heroku 서버에 push해주면 끝!

   ```shell
   git push heroku master
   ```

👾 heroku로 배포한 도메인에 몇 시간 동안 접속 요청이 없는 경우, 앱이 수면 상태로 전환되어 초기 접속이 느력진다. 이때 수면 상태로 전환되는 것을 방지하기 위해 계속 request를 보내줄 수 있는 서비스가 있다. 이름도 귀여운 아래 사이트에 도메인을 등록하면 된다.
👉 https://kaffeine.herokuapp.com/

**Ref**
https://velog.io/@jjunyjjuny/Node.js-프로젝트-배포하기-Heroku

### styled-component에서 css 객체 사용하기

아래와 같이 import하여 객체 프로퍼티 값으로 활용할 수 있다.

```jsx
import styled, { css } from 'styled-components';

const buttonStyle = {
  small: css`
    width: ...;
    height: ...;
  `

  large: css`
    width: ...;
    height: ...;
  `
}

const CartButton = styled.button`
  // ...
  ${({ type }) => buttonStyle[type]};
`
```

### a11y

웹 접근성을 의미한다. ‘accessibility’의 줄임말이다.

### currying & partial application

모두 함수형 프로그래밍의 기법이다.

**Partial Application**
여러 개의 인자를 받는 함수가 있을 때 일부의 인자를 고정한 함수를 만드는 기법이다.

```jsx
const add = function (a, b) {
  return a + b;
};

function partial(fn, x) {
  return function (y) {
    return fn(x, y);
  };
}

const add10 = partial(add, 10);

add10(20); // 30
```

partial에 의해 만들어진 `partial` 함수에 고정되지 않은 나머지 인자를 전달해서 `add` 함수를 호출한다.

`bind` 함수를 쓰면 더 깔끔하다.

```jsx
const add10 = add.bind(null, 10);
add10(20); // 30
```

**Currying**
Partial Application처럼 인자를 미리 고정할 수 있지만 하나씩만 고정한다. 또한 모든 인자를 받을 때까지 계속 함수를 생성한다.

```jsx
function addThree(x) {
  return function (y) {
    return function (z) {
      return x + y + z;
    };
  };
}

// 인자를 하나씩 세 번 받아야 호출된다.
addThree(1)(2)(3); // 6
```

curry는 함수 조합의 경우 등에 유용하게 사용될 수 있다.

**Ref**

- https://blog.rhostem.com/posts/2017-04-20-curry-and-partial-application
- https://www.zerocho.com/category/JavaScript/post/579236d08241b6f43951af18

### propTypes vs TypeScript

> Typescript: 정적인 타입 체크
> PropTypes: 런타임 타입 체크

TypeScript를 쓸 때는 PropTypes가 필요 없다. PropTypes는 pure JS로 개발할 때 사용한다.

👾 **Flow**라는 것도 있다. JavaScript 코드를 위한 정적 타입 체커로, 페이스북에서 개발했다. 모듈로 설치해서 사용한다.

```shell
yarn add --dev flow-bin
```

다음 명령어를 통해 실행시킨다.

```shell
yarn run flow init
```

`@flow`를 주석으로 작성하여, 코드 작성 시 타입을 명시해줄 수 있다.

```tsx
// @flow
function concat(a: string, b: string) {
  return a + b;
}

concat("A", "B"); // Works!
concat(1, 2); // Error!`
```

첫 번째 링크는 크루 차얀의 블로그
**Ref**

- https://chayan.oopy.io/a5278e0d-99b5-4cf9-96cc-4f3317f5bc00
- https://davemn.com/2020-07/typescript-vs-proptypes
- https://ko.reactjs.org/docs/static-type-checking.html
- https://flow.org/en/docs/types/

### VFC, FC

‘VFC(Void Function Component)’ 타입은 prop으로 `children`을 받지 않음을 명시한다. 그러나 임시적으로 react에서 제공하고 있는 타입이라 사용하지 않는 것이 좋다. `@types/react 18` version에서 deprecated될 버전이다.

‘FC(Function Component)’ 역시 사용하지 않는 것이 좋다. ([Ref](https://zigsong.github.io/2021/05/08/woowa-week-14/#React-FC-사용해야-할까))

### CSS-in-JS vs CSS-in-CSS

**CSS-in-JS**
👍 장점

- Global namespace: class명이 build time에 유니크한 해시값으로 변경되기 때문에 별도의 명명 규칙이 필요하지 않다.
- Dependencies: CSS가 컴포넌트 단위로 추상화되기 때문에 CSS 파일(모듈)간에 의존성을 신경 쓰지 않아도 된다.
- Dead Code Elimination: 컴포넌트와 CSS가 동일한 구조로 관리되므로 수정 및 삭제가 용이하다.
- Minification: 네임스페이스 충돌을 막기위해 BEM 같은 방법론을 사용하면 class명이 길어질 수 있지만, CSS-in-JS는 짧은 길이의 유니크한 클래스를 자동으로 생성한다.
- Sharing Constants: CSS 코드를 JS에 작성하므로 컴포넌트의 상태에 따른 동적 코딩이 가능하다.
- Non-deterministic Resolution: CSS가 컴포넌트 스코프에서만 적용되기 때문에 우선순위에 따른 문제가 발생하지 않는다.
- Isolation: CSS가 JS와 결합해 있기 때문에 상속에 관한 문제를 신경 쓰지 않아도 된다.

👎 단점

- 번들 크기가 커진다.
- 인터랙션이 늦다.

성능에 초점을 맞춘다면 **CSS-in-CSS**를, 개발 생산성에 초점을 맞춘다면 **CSS-in-JS**를 사용하는 것이 좋다.

**Ref**

- https://blueshw.github.io/2020/09/14/why-css-in-css/
- https://blueshw.github.io/2020/09/27/css-in-js-vs-css-modules/

---

## 질문하기

### Middleware

- Closure와 Currying의 차이는 무엇일까요?
- Currying을 실생활에 적용한 적이 있다면 Middleware말고 어디에 또 있을까요?
- Redux에서 Middleware가 필요한 이유는 무엇이며 비동기 처리를 Middleware로 해야할 이유는 무엇일까요?

### Front-end TDD

**Ref**

- https://ui.toast.com/fe-guide/ko_TEST
- https://ui.toast.com/weekly-pick/ko_20181226
- https://ui.toast.com/weekly-pick/ko_20190116

---

## 기타

### TTFB

**Time To First Byte**의 약자로, HTTP 요청을 했을 때, 처음 byte(정보)가 브라우저에 도달해서 이 정보가 브라우저에서 프로세싱이 시작되는 시간을 측정해 이 시간을 TTFB라고 한다. 브라우저의 성능에 따라 TTFB는 달라지며, 브라우저가 아닌 TTFB를 측정해주는 웹 서비스를 사용해서 확인해야 한다.

TTFB는 서버의 성능속도를 보여주는 척도로 사용될 수 있다.
또 TTFB가 좋게 나올수록 구글의 SEO 랭킹이 높아지기 때문에, 고려해야 할 부분이기도 하다.

**Ref**
https://hackya.com/kr/ttfb-에-대한-개념탑재를-해봅시다/

### 스토리북 배포하기

**Ref**
https://storybook.js.org/tutorials/intro-to-storybook/react/ko/deploy/

### Under the hood - React

**Ref**
https://bogdan-lyashenko.github.io/Under-the-hood-ReactJS/

### Redux Toolkit

**Ref**
https://jbee.io/react/introduce-redux-starter-kit/

---

## 마무리

스승의날 파티도 있었고, 코치 없는 코치의 생일 파티도 했다. 5월은 정말 화려보스…
Lv2도 끝나가고 날씨도 덥고, 비가 오면서 조금씩 처지는 기분이다.

아, 배달의민족 COO 한명수님의 말랑특강은 정말 유익하고(?) 충격적이었다…
나중에 다시봐야겠다.

캡틴 포비의 나태해지고 있다는 말에 상처 받은 크루들이 있는 것 같다. 아무 생각도 들지 않는 나는 뭘까 🤔
거의 그냥 되는대로 살고 있는 것 같다. 큰 부담도 없고, 별 생각도 없다. 해탈한 걸까
