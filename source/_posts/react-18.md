---
title: React 18 톺아보기
date: 2021-10-03 18:39:51
tags: react
---

React 18의 새로운 feature

<!-- more -->

<img src="/images/thumbnails/react-thumbnail.png" />

loadable components에서 SSR로 마이그레이션하다가,

> 🚨 Error: ReactDOMServer does not yet support Suspense.

위 에러에 부딪혀서 돌고 돌아 결국 React 18을 선택하게 되었다.

정식 버전도 배포가 되지 않은, 실험 단계의 버전이지만 나 역시 실험적인 교육생이므로(?) 일단 설치하고 무엇이 있는지 알아보도록 한다. 심지어 `@alpha` 태그를 붙여서 사용해야 할 만큼 새 버전이다!

(그나저나 아래 공식 문서 링크는 ‘ko’가 붙었는데 왜 번역이 안 됐는지 😑 내가 하고 싶다.)

React 18은 다음 기능들을 제공한다.

---

## ✅ 1. Automatic batching

리액트에서는 여러 개의 `setState` 호출을 묶어서 한 번에 실행한다. ‘batch’는 하나로 묶는다는 뜻으로, `setState`를 호출할 때마다 리렌더링이 발생하는 것은 비효율적이기 때문에, 상태 업데이트들을 모아서 하나의 리렌더링으로 처리하는 것이다.

현재 리액트는 click과 같은 브라우저 이벤트에 대해서만 batch를 진행하기 때문에, 이벤트가 호출된 이후 상태의 업데이트가 발생하는 아래와 같은 예제에서는 batch가 동작하지 않는다.

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 17 and earlier does NOT batch these because
      // they run *after* the event in a callback, not *during* it
      setCount((c) => c + 1); // Causes a re-render
      setFlag((f) => !f); // Causes a re-render
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

`createRoot`를 사용하는 React 18부터는, 모든 상태 업데이트들이 자동으로 batch된다. timeout, promise, 네이티브 이벤트 핸들러와 같은 모든 종류의 이벤트들이 동일하게 동작한다. 이를 통해 렌더링을 더욱 효율적으로 할 수 있다.

```jsx
ReactDOM.createRoot(rootElement).render(<App />);
```

batch를 사용하고 싶지 않은 경우 `ReactDOM.flushSync`를 사용할 수 있다. `flushSync` 메서드는 상태 업데이트를 강제한다. (사용을 권장하진 않는다!)

```jsx
import { flushSync } from "react-dom"; // Note: react-dom, not react

function handleClick() {
  flushSync(() => {
    setCounter((c) => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag((f) => !f);
  });
  // React has updated the DOM by now
}
```

---

## ✅ 2. startTransition

사용자와 인터랙션이 많은 경우, 스크린 상에서 많은 부분이 업데이트가 되어야 하는 경우 렌더링마다 페이지가 느려질 수 있다. 사실 인터랙션에는 중요하고 긴급하게 업데이트해야 할 경우도 있을 것이고, 조금 여유 있게 처리해도 되는 업데이트가 있을 것이다.

예를 들어, 사용자의 입력에 따라 input 필드의 값이 바뀌는 경우에는 UI가 즉각 리렌더링되어야 한다. 그러나 검색 결과를 보여주는 것은 긴급한 업데이트 항목이 아니다.

```jsx
// Urgent: Show what was typed
setInputValue(input);

// Not urgent: Show the results
setSearchQuery(input);
```

지금까지 리액트는 모든 업데이트를 반영해 즉시 렌더링해왔다. 위 예제 코드의 상황에서 두 번의 상태 업데이트와 렌더링이 동시에 발생하면, 모든 것이 렌더될 때까지 사용자의 인터랙션은 차단된다.

React 18의 `startTransition`은 이 문제를 해결한다.

```jsx
import { startTransition } from "react";

// Urgent: Show what was typed
setInputValue(input);

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
});
```

`startTransition`으로 래핑된 업데이트는 급하지 않은 동작으로 처리되고, `keyPress`와 같이 즉시 처리되어야 하는 다른 동작들이 먼저 처리된다. 사용자와의 즉각적인 인터랙션들로 인해 `startTransition`으로 감싸진 동작이 stale해진다면, 중간 과정은 생략하고 가장 최신의 업데이트만 렌더링된다.

공식 문서에서는 즉각적인 업데이트(Urgent updates)와 트랜지션 업데이트(Transition updates)의 상황을 아래와 같이 구분한다.

> **Urgent updates** reflect direct interaction, like typing, clicking, pressing, and so on.
> **Transition updates** transition the UI from one view to another.

`setTimeout`을 이용한 throttling이나 debouncing과도 비슷해보일 것이다. 그러나 `setTimeout`과 다른 점은, `startTransition`은 스케쥴링되지 않는다는 것이다.

`startTransition`은 즉시 실행되고, `startTransition`에 전달된 함수는 동기적으로 동작한다. 다만 그 함수에서 발생하는 업데이트가 ‘transition’으로 마킹될 뿐이다. 리액트는 업데이트에 따른 렌더링을 할 때 이 정보를 활용한다. `setTimeout`보다는 빠를 수밖에 없다. 속도가 빠른 디바이스에서는 업데이트들 사이의 딜레이가 더 적을 것이다.

또 `setTimeout` 내부에 만약 화면상의 큰 변화가 발생하는 업데이트가 있을 때 해당 콜백을 실행하는 동안 다른 인터랙션들은 블로킹되지만, `startTransition`은 블로킹되지 않는다. `startTransition`에 전달되는 함수는 언제든지 간섭받을 수 있기 때문에, 그동안에 발생하는 유저 인터랙션들에 따라 중간 과정의 불필요한 렌더링은 자연스레 삭제되는 셈이다.

마지막으로 `setTimeout`이 단지 업데이트를 지연시킨다면, `transition`은 리액트가 pending 상태를 트래킹할 수 있도록 만들어 기다리는 동안 유저에게 피드백을 받을 수 있다.

`useTransition`이 반환하는 `isPending` 상태값을 받아 `transition`에 따른 렌더링 결과를 분기쳐줄 수도 있다.

```jsx
import { useTransition } from "react";

const [isPending, startTransition] = useTransition();
{
  isPending && <Spinner />;
}
```

`startTransition`은 리렌더링을 조절하고, 느린 네트워크에 대응하고자 하는 상황에서 유용하다.

---

## ✅ 3. New Suspense SSR Architecture

리액트 팀이 정말 공을 들여 만든 기능이라고 한다! 리액트에서 SSR을 지원하기 위해 구조적인 개편을 이뤘다. 특히 `Suspense`를 지원함으로써 리액트 앱을 더욱 작은 단위들로 분리하고, 서버에서 필요한 자원을 받아 화면을 렌더링하는 과정이 각 컴포넌트 단위별로 독립적으로 동작함으로써 앱 전체를 무너뜨리지 않게끔 해준다.

> 👾 `React.lazy`에서도 SSR을 쓸 수 있게 되었다고 한다!

### 기존 SSR의 문제

기존 SSR의 문제점은, 서버에서 모든 데이터를 불러와야 한다는 점이었다. 데이터를 모두 불러올 때까지 클라이언트 단의 리액트는 hydrating를 시작하지 못한 채 서버를 기다려야 했다.

또, 인터랙션이 가능해지기 전에 모든 컴포넌트가 hydrate될 때까지 기다려야 한다는 문제가 있었다. 리액트의 hydrate는 이벤트핸들러를 붙여주는 역할을 하는데, 서버에서 HTML이 다 불러와져야 오류 없이 이벤트핸들러를 붙여줄 수 있기 때문이다.

이 문제점들은 리액트 앱의 기존 SSR 방식의 ‘waterfall’한 흐름 때문이었다.

> fetch data (server) → render to HTML (server) → load code (client) → hydrate (client).

각 단계의 작업은 이전 단계가 끝나야지만 시작될 수 있었다. React 18은 이 단계들을 독립적으로 분류하여, 앱 전체가 아닌 화면의 각 부분들로 쪼개는 방법을 고안했다.

React 18에서 SSR을 위해 제공하는 두 가지 기능은 다음과 같다.

- **Streaming HTML** on the server
- **Selective Hydration** on the client

### HTML 스트리밍

기존의 SSR은 아래와 같이 모든 HTML을 한번에 렌더링한다.

```jsx
<main>
  <nav>
    <a href="/">Home</a>
  </nav>
  <aside>
    <a href="/profile">Profile</a>
  </aside>
  <article>
    <p>Hello world</p>
  </article>
  <section>
    <p>First comment</p>
    <p>Second comment</p>
  </section>
</main>
```

이때 페이지의 상태는 ‘아예 안 보이거나’, ‘완전히 다 보이거나’ 둘 중 하나가 될 것이다.

React 18에서는 Suspense를 사용할 수 있다. 컴포넌트를 분리하고, 필요에 따라 `<Suspense>`로 감싼다.

```jsx
<Layout>
  <NavBar />
  <Sidebar />
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
```

`Suspense`로 감싸진 `Comments` 컴포넌트는, 해당 부분의 HTML이 모두 그려질 때까지 기다리는 대신 `fallback` 컴포넌트를 반환한다.

<img src="01.png" />

(프론트)서버에서 `Comments`에 필요한 데이터 fetching이 완료되면, 리액트는 **같은 stream**으로 추가적인 HTML을 전달한다. 이렇게 뒤늦게 HTML을 쑤셔 넣는(?) 것을 ‘**pop in**‘이라고 한다. 각 컴포넌트는 서로 다른 컴포넌트의 데이터가 완전히 로드될 때까지 기다릴 필요가 없다.

클라이언트 단의 **Selective Hydration**은 데이터를 모두 불러올 때까지 페이지의 다른 부분들이 블로킹되는 문제를 해결한다. 리액트는 로드되는 순서대로 부분적으로 hydration을 진행한다.

### 선택적 hydration

React 18은 코드 스플리팅을 하는 경우에도 잘 동작한다. `Suspense`를 사용하면 HTML이 모두 로드되기 전에 hydrate를 시작할 수 있다.

```jsx
import { lazy } from "react";

const Comments = lazy(() => import("./Comments.js"));

// ...

<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>;
```

`Suspense`로 필요한 컴포넌트를 감싸면, 다른 컴포넌트들의 스트리밍이나 hydrating 과정을 블로킹하지 않는다.

### 컴포넌트가 hydrate되기 전 인터랙션

React 18은 정말 똑똑하다. 두 개의 독립적인 컴포넌트 A, B에서 hydration이 수행되고 있다고 가정해 보자. 이때 컴포넌트 B에서 click 이벤트가 발생한다면, 리액트는 해당 이벤트를 기록해두고 B 컴포넌트의 hydration을 먼저 진행한다. 그리고 hydration이 끝나면, 기록해두었던 click 이벤트를 다시 실행시켜 인터랙션에 대한 응답을 반환한다. 자동으로 우선순위을 조정하여 hydration을 진행하는 것이다! (이건 정말 대박인 것 같다 😮)

---

**Ref**
https://github.com/reactwg/react-18/discussions/21
https://github.com/reactwg/react-18/discussions/41
https://github.com/reactwg/react-18/discussions/37
01
