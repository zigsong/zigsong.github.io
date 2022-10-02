---
title: UI runtime으로서의 리액트
date: 2021-09-26 19:01:55
tags: react
thumbnailImage: https://i.imgur.com/stTzX5o.png
---

UI runtime으로서의 리액트

<!-- more -->

---

어쩌다 보니 [Dan Abramov의 글](https://overreacted.io/react-as-a-ui-runtime/)을 모두 번역해 버린 포스팅

---

### Host Tree

리액트는 시간이 지나면서 바뀔 수 있는 트리를 반환한다. 이 트리는 UI와 함께 그려지는데, 이를 ‘호스트 트리’라고 한다. 이 트리는 DOM 등의 형태로 리액트의 바깥에 위치한다. 리액트는 그의 상단에 놓인 레이어일 뿐이다.

리액트는 두 가지 원칙을 기반으로 한다.

- 안정성 - 호스트 트리는 안정적이며 전체적인 구조를 급진적으로 바꾸지 않는다.
- 규칙성 - 호스트 트리는 일관적인 UI 패턴들로 나눠진다.

### Host Instances

호스트 트리는 노드들로 구성되는데, 이를 ‘호스트 인스턴스’라고 한다. DOM 환경에서 호스트 인스턴스들은 일반적인 DOM 노드를 가리킨다. 호스트 인스턴스는 자신만의 프로퍼티들을 가지고 있으며, 다른 호스트 인스턴스들을 자식으로 가질 수 있다.

호스트 인스턴스를 조작할 수 있는 API들이 있다(ex. `appendChild`, `removeChild`, `setAttribute`). 리액트 앱을 만들 때는 이 API들을 직접적으로 호출하지 않는다. 리액트는 이 일을 대신 해준다!

### Renderers

렌더러는 리액트가 특정한 호스트 환경을 파악하고 호스트 인스턴스를 관리하게끔 해준다. React DOM 등이 리액트의 렌더러다. (자신만의 리액트 렌더러를 만들 수도 있다.)

렌더러의 대부분은 ‘변화 모드’(mutating mode)로 동작한다. 우리는 노드를 생성하고, 프로퍼티를 할당하고, 자식 요소를 추가하거나 삭제할 수 있다. 호스트 인스턴스는 변경 가능한 요소다.

리액트는 ‘지속 모드’(persistent mode)로도 동작한다. 부모 트리를 복제하여 항상 최상위 자식 요소를 대체하는 호스트 환경에서 사용한다. 호스트 트리의 불변성은 멀티쓰레딩을 도와준다. (cf. [React Fabric](https://reactnative.dev/blog/2018/06/14/state-of-react-native-2018))

### React Elements

호스트 환경에서, DOM 노드와 같은 호스트 인스턴스는 구성 요소의 최소 단위다. 이를 ‘리액트 엘리먼트’라고 한다. 리액트 엘리먼트는 순수한 자바스크립트 객체다. 이는 호스트 인스턴스를 설명한다.

```jsx
// JSX is a syntax sugar for these objects.
// <button className="blue" />
{
  type: 'button',
  props: { className: 'blue' }
}
```

호스트 인스턴스와 마찬가지로, 리액트 엘리먼트는 트리를 형성할 수 있다.

```jsx
// JSX is a syntax sugar for these objects.
// <dialog>
//   <button className="blue" />
//   <button className="red" />
// </dialog>
{
  type: 'dialog',
  props: {
    children: [{
      type: 'button',
      props: { className: 'blue' }
    }, {
      type: 'button',
      props: { className: 'red' }
    }]
  }
}
```

그러나, 리액트 엘리먼트는 자체적으로 동일성을 지속하는 방법이 없다. 언제나 재생성되고 사라질 수 있다.

리액트 엘리먼트는 불변성을 유지한다. 따라서 리액트 엘리먼트의 자식 요소나 프로퍼티를 직접 바꿀 수 없다. 다른 것을 렌더링하고 싶다면, 새로운 리액트 엘리먼트 트리를 다시 만들어야 한다.

리액트 엘리먼트는 특정한 순간의 UI를 스냅샷처럼 캡쳐할 뿐, 스스로 바뀌지는 않는다!

### Entry Point

각각의 리액트 렌더러는 ‘엔트리 포인트’가 있다. 이는 리액트에게 컨테이너 호스트 인스턴스 내부에 리액트 엘리먼트 트리를 렌더하도록 지시한다.

ReactDOM의 엔트리 포인트는 `ReactDOM.render`로 작성한다.

```jsx
ReactDOM.render(
  // { type: 'button', props: { className: 'blue' } }
  <button className="blue" />,
  document.getElementById("container")
);
```

`ReactDOM.render(reactElement, domContainer)`과 같은 코드는 리액트에게 `domContainer`라는 호스트 트리를 `reactElement`에 대응하게끔 만들 것을 지시한다.

### Reconciliation

`ReactDOM.render()`로 동일한 컨테이너를 두 번 호출하면 어떻게 될까?

```jsx
ReactDOM.render(
  <button className="blue" />,
  document.getElementById("container")
);

// ... later ...

// Should this *replace* the button host instance
// or merely update a property on an existing one?
ReactDOM.render(
  <button className="red" />,
  document.getElementById("container")
);
```

호스트 트리를 주어진 리액트 엘리먼트 트리와 동일하게 만드는 것은 리액트의 역할이다. 새로운 정보에 따라 호스트 인스턴스 트리를 구성하는 작업을 ‘재조정(reconciliation)’이라고 한다.

호스트 인스턴스 트리를 업데이트하는 간단한 방법은 기존 트리를 모두 날리고 처음부터 다시 만드는 것이겠지만, 실제 DOM에서 이 과정은 느리게 동작하며 중요한 정보들을 잃을 수도 있다.

리액트는 기존의 호스트 인스턴스를 언제 새로운 리액트 엘리먼트로 업데이트해야 하는지, 그리고 언제 새로 만들어야 하는지 결정한다. 이전과 이후의 렌더에서 요소가 트리에서 동일한 위치에 있다면, 리액트는 기존의 호스트 인스턴스를 그대로 재사용한다.

```jsx
// let domNode = document.createElement('button');
// domNode.className = 'blue';
// domContainer.appendChild(domNode);
ReactDOM.render(
  <button className="blue" />,
  document.getElementById("container")
);

// Can reuse host instance? Yes! (button → button)
// domNode.className = 'red';
ReactDOM.render(
  <button className="red" />,
  document.getElementById("container")
);
```

### Conditions

HTML 태그의 타입이 일치하여 재사용할 수 있는 호스트 인스턴스의 경우 리액트는 해당 인스턴스를 재사용하며, 타입이 바뀌었을 경우 새로 생성한다.

그런데 특정 시점에 생성되는 조건부 요소라면 어떨까?

```jsx
function Form({ showMessage }) {
  let message = null;
  if (showMessage) {
    message = <p>I was just added here!</p>;
  }
  return (
    <dialog>
      {message}
      <input />
    </dialog>
  );
}
```

위 예제에서 `<input />` 요소는 `showMessage`값이 변화할 때 새롭게 추가되는 `<p>` 요소에 의해 위치가 밀려나게 된다. 이때 단순히 위치의 이동이 필요한 요소의 경우 제거 후 다시 생성하지 않는다. `<input />` 요소는 렌더 간에 항상 동일한 위치를 유지할 것이다.

`showMessage`의 값이 `true`이든 `false`이든 상관없이, `message` 요소가 `<dialog>`의 첫 번째 자식으로 들어가있을 것이기 때문이다. `showMessage`의 값이 `false`일 때, `message` 요소는 `null`을 반환한다.

리액트는 `insertBefore` 등의 DOM API를 사용하여 해당하는 위치에 새로운 요소를 삽입한다.

```jsx
let inputNode = dialogNode.firstChild;
let pNode = document.createElement("p");
pNode.textContent = "I was just added here!";
dialogNode.insertBefore(pNode, inputNode);
```

### Lists

호스트 인스턴스의 재사용과 재생성 여부를 판단하기 위해서는 트리에에서 같은 위치에 있는 요소의 타입을 비교하는 것으로 충분하지만, 이는 자식 요소들의 위치가 정적일 때만 정상적으로 동작한다. 동적인 리스트에서, 순서는 항상 보장되지 않는다.

```jsx
function ShoppingList({ list }) {
  return (
    <form>
      {list.map((item) => (
        <p>
          You bought {item.name}
          <br />
          Enter how many do you want: <input />
        </p>
      ))}
    </form>
  );
}
```

위 코드는 아래로 변환될 것이다.

```jsx
for (let i = 0; i < 10; i++) {
  let pNode = formNode.childNodes[i];
  let textNode = pNode.firstChild;
  textNode.textContent = "You bought " + items[i].name;
}
```

아이템이 추가되는 등 정렬이 바뀔 때, 위 과정을 매번 반복해야 한다.

그러나 리액트는 모든 리스트 아이템들을 다시 정렬하는 대신, 각 요소를 성능상으로 효과적으로 업데이트한다. 리액트가 이 작업을 수행하기 위해 우리는 배열의 요소들에 `key` prop을 전달해야 한다.

```jsx
function ShoppingList({ list }) {
  return (
    <form>
      {list.map((item) => (
        <p key={item.productId}>
          You bought {item.name}
          <br />
          Enter how many do you want: <input />
        </p>
      ))}
    </form>
  );
}
```

`key`를 통해 리액트는 동일한 부모 요소의 안에서 렌더 사이에 위치가 바뀌는 자식 요소들이 개념적으로는 동일하다는 것을 알 수 있다. 렌더 이후에 동일한 키를 가진 호스트 인스턴스가 있다면 리액트는 이를 재사용하고, 이에 따라 형제 요소들을 재정렬한다.

`key`는 특정한 부모 요소 안에서만 유효하다. `key`는 리스트의 순서가 바뀌어도 아이템이 동일함을 보장해야 하기 때문에, 고유한 ID 값을 사용하는 것이 바람직하다.

### Components

컴포넌트는 객체 해쉬(object hash)라는 하나의 값을 갖는다. 이는 props를 포함한다.

### Purity

리액트 컴포넌트는 그들의 props에 대해서 순수함을 보장한다. 즉 리액트에서 props는 변경할 수 없다.

```jsx
function Button(props) {
  // 🔴 Doesn't work
  props.isActive = true;
}
```

그러나 지역 변수의 변경은 가능하다.

```jsx
function FriendList({ friends }) {
  let items = [];
  for (let i = 0; i < friends.length; i++) {
    let friend = friends[i];
    items.push(<Friend key={friend.id} friend={friend} />);
  }
  return <section>{items}</section>;
}
```

위 예제에서 `items`는 렌더링 과정에서 생성되었으며, 다른 컴포넌트들에 영향을 미치지 않기 때문에 직접 변경할 수 있다.

컴포넌트를 여러 번 호출하는 것이 안전하고 다른 컴포넌트들의 렌더링에 영향을 주지 않는다면, 리액트는 해당 컴포넌트가 100% 순수함을 보장하지 않는다. 리액트에서는 순수성보다 멱등성(Idempotence)이 더 중요하다.

### Recursion

컴포넌트들은 함수이므로 우리는 이를 호출할 수 있다.

```jsx
let reactElement = Form({ showMessage: true });
ReactDOM.render(reactElement, domContainer);
```

그러나 런타임에서 우리는 컴포넌트 함수를 직접 호출하지 않는다. 이는 리액트가 할 일이다. 우리는 React Element를 이용하여 컴포넌트의 호출을 리액트에게 위임한다.

```jsx
// { type: Form, props: { showMessage: true } }
let reactElement = <Form showMessage={true} />;
ReactDOM.render(reactElement, domContainer);
```

컴포넌트 함수들은 대문자로 시작해야 한다는 규칙이 있다. JSX는 대문자로 시작하는 요소들만을 리액트 컴포넌트로 인식한다.

```jsx
console.log((<form />).type); // 'form' string
console.log((<Form />).type); // Form function
```

리액트는 컴포넌트를 호출하고, 그 컴포넌트가 어떤 요소를 렌더하고 싶은지 파악한다. 이 과정은 컴포넌트가 렌더하는 자식 컴포넌트들에 대해서 재귀적으로 반복된다.

재조정 과정이 재귀적인 이유다. 리액트는 요소 트리를 탐색하면서. `type`이 컴포넌트인 요소를 만나게 된다. 리액트는 해당 요소를 호출하고 반환된 리액트 엘리먼트 트리를 따라 계속 내려간다. 모든 컴포넌트에 다다르면, 리액트 트리는 호스트 트리에서 무엇을 바꿔야 하는지 알게 된다. (이 과정에서 같은 위치에 있던 요소의 `type`이 바뀌면 호스트 인스턴스를 제거하고 재생성하는 것이다!)

### Inversion of Control

왜 컴포넌트를 직접적으로 호출하지 않을까?

리액트가 컴포넌트들의 관계를 잘 알고 있기만 하다면, 우리보다 이 일을 훨씬 더 잘 수행하기 때문이다.

```jsx
// 🔴 React has no idea Layout and Article exist.
// You're calling them.
ReactDOM.render(Layout({ children: Article() }), domContainer);

// ✅ React knows Layout and Article exist.
// React calls them.
ReactDOM.render(
  <Layout>
    <Article />
  </Layout>,
  domContainer
);
```

이는 대표적인 **제어의 역전(inversion of control)** 의 사례다.

- 컴포넌트는 함수보다 할 수 있는 것이 많다. 리액트는 트리에서 컴포넌트의 로컬 변수를 다룰 수 있으며, 기본적인 추상화를 해준다. 리액트는 UI 트리를 렌더하고 사용자 인터랙션에 반응한다. 만약 컴포넌트를 직접 호출한다면, 이 모든 기능들을 스스로 구현해야 할 것이다.
- 컴포넌트 타입은 재조정 과정에 관여한다. 리액트가 모든 컴포넌트를 호출하게 함으로써, 트리의 개념적인 구조를 리액트에게 알려줄 수 있다.
- 리액트는 재조정을 지연시킬 수 있다. 리액트가 우리의 컴포넌트에 대해 제어권을 갖는다면, 많은 일들을 할 수 있다. 예를 들면, 컴포넌트 호출 간 브라우저에게 다른 일을 시켜 큰 컴포넌트 트리가 리렌더되는 동안 메인 쓰레드를 블라킹하지 않게 해준다.
- 디버깅 히스토리가 남는다. JavaScript 함수로 구현한 컴포넌트는 많은 라이브러리들이 두러워하는 일급 객체(🤔)인데, 리액트를 사용하면 개발 단계에서 훌륭한 디버깅 툴을 활용할 수 있다.

### Lazy Evaluation

자바스크립트에서 함수를 호출하면, 인자들은 호출 이전에 평가된다.

```jsx
// (2) This gets computed second
eat(
  // (1) This gets computed first
  prepareMeal()
);
```

하지만 리액트 컴포넌트들은 상대적으로 순수(pure)하다. 컴포넌트를 스크린에 렌더하기 전까지는 실행시킬 이유가 없다. 만약 컴포넌트를 함수처럼 호출한다면, 해당 자식 컴포넌트를 렌더하는 부모 컴포넌트가 해당 컴포넌트를 조건부로 렌더링하고 싶은 상황에서도 무조건적으로 자식 컴포넌트를 호출할 것이다.

```jsx
function Story({ currentUser }) {
  return (
    <Page user={currentUser}>
      <Comments />
    </Page>
  );
}
function Page({ user, children }) {
  // early exit
  if (!user.isLoggedIn) {
    return <h1>Please log in</h1>;
  }
  return <Layout>{children}</Layout>;
}
```

`Comments` 컴포넌트에는 early exit 조건이 존재한다. `user.isLoggedIn`의 값이 `false`라면 `Layout`과 `children`을 렌더링하지 않아도 된다.

```jsx
function Component() {
  return <Page>{Comments()}</Page>;
}
```

그러나 위처럼 `Comments` 컴포넌트를 함수로 호출하면, `Comments` 내부의 조건에 상관없이 우선 평가되어 실행된다.

하지만 리액트 엘리먼트에서는, 개발자가 컴포넌트를 직접 호출하지 않는다. 컴포넌트의 호출 시점을 결정하는 것은 리액트의 책임이다. 위 예제에서 `Page` 컴포넌트가 children prop을 렌더하기 전에 early exit하게 된다면, 리액트는 `Comments` 함수를 호출하지 않을 것이다. 이는 불필요한 렌더링을 줄여주고, 코드의 안전성을 보장해 준다!

### State

호스트 인스턴스는 모든 종류의 로컬 상태(local state)을 가질 수 있다. 이 값들은 컴포넌트의 업데이트 이후 동일한 UI를 렌더 시 유지되어야 한다. 반면 개념적으로 다른 내용을 렌더할 때 요소를 제거할 수도 있어야 한다.

리액트의 컴포넌트는 로컬 상태를 가질 수 있다. 이를 ‘hooks’라고 부른다.

리액트에서 기본으로 제공하는 `useState` hook은 값과 해당 값을 업데이트할 수 있는 함수를 반환한다.

```jsx
function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### Consistency

재조정 과정을 논-블로킹 작업으로 분리하고 싶어도, 실제 호스트 트리에서는 이를 단일한 동기적인 과정으로 구현해야 한다. 그렇게 해야 절반만 업데이트된 UI를 렌더링하지 않을 수 있고, 브라우저가 불필요한 레이아웃과 스타일 재계산의 과정을 거치지 않음을 보장할 수 있다.

이것이 리액트가 모든 작업을 ‘렌더 단계(render phase)’와 ‘commit phase(커밋 단계)’로 나누는 이유다. 렌더 단계에서 리액트는 컴포넌트를 호출하고 재조정을 실행한다. 커밋 단계에서 리액트는 호스트 트리를 조작한다. 이 과정은 항상 동기적이다.

### Memoization

부모 컴포넌트가 `setState`를 호출하여 업데이트를 발생시킨다면, 리액트는 모든 자식 서브트리에 대해 재조정을 실시한다. 리액트는 부모의 업데이트가 자식을 언제 업데이트시키는지 모르기 때문이다.

트리가 너무 깊거나 넓으면, 리액트가 서브트리를 메모(memoize)할 수 있게끔 만들어줄 수 있다. 리액트는 렌더 이전의 결과와 prop 간의 얕은 비교를 통해 서브트리를 재사용한다.

```jsx
function Row({ item }) {
  // ...
}

export default React.memo(Row);
```

각각의 표현식에 대해 `useMemo` hook을 사용할 수도 있다. 메모이제이션이 기억하는 캐시는 컴포넌트 트리에 한정적이며, 지역 변수와 함께 사라진다. 메모이제이션은 오직 마지막 값만 기억하고 있다.

### Raw Models

아이러니하게도, 리액트는 ‘반응형(reactivity)’이 아니다. 상위에서의 모든 업데이트는 변화가 필요한 컴포넌트 뿐 아니라 모든 컴포넌트에 재조정을 유발한다.

웹앱에서는 TTI(Time To Interactive)가 중요하고, 이벤트 리스너를 등록하기 위해 모든 모델을 탐색(traverse)하는 것은 시간 낭비다. 많은 앱에서, 상호작용은 UI 업데이트를 유발하고, 세밀하게 설계된 구독(subscription) 시스템에서 이는 메모리 낭비로 이어진다.

리액트의 핵심 디자인 원칙 중 하나는 리액트는 날 것(raw)의 데이터를 다룬다는 것이다. 네트워크에서 받은 자바스크립트 객체들이 있다면, 이를 어떤 전처리 과정 없이 컴포넌트로 직접 연결할 수 있다. 직접 프로퍼티에 접근할 수 없으며, 구조 변경 시 예측 불가능한 성능 절벽이 발생하지 않는다.

주식 티커와 같은 경우 세밀하게 설계된 구독 시스템이 유리할 수도 있다. 이는 모든 것이 동일한 시점에 지속적으로 업데이트되어야 하는 경우 사용된다. 리액트는 이런 경우에는 최선의 선택지가 아니다.

### Batching

하나의 이벤트에 대해 여러 컴포넌트가 상태를 업데이트하고 싶을 수 있다.

```jsx
function Parent() {
  let [count, setCount] = useState(0);
  return (
    <div onClick={() => setCount(count + 1)}>
      Parent clicked {count} times
      <Child />
    </div>
  );
}

function Child() {
  let [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Child clicked {count} times
    </button>
  );
}
```

위 예제에서 Child의 `onClick`이 먼저 실행되어 `setState`를 호출하고, Parent의 `onClick`이 실행되어 `setState`가 호출될 때 리액트가 각각의 `setState` 호출에 대해 즉시 컴포넌트를 리렌더한다면 Child 컴포넌트는 두 번 리렌더될 것이다. 이때 Child 컴포넌트의 첫 번째 렌더링은 낭비된다.

리액트는 이벤트 핸들러들 안에서 업데이트를 그룹화(batch)한다.

```
*** Entering React's browser click event handler ***
Child (onClick)
  - setState
Parent (onClick)
  - setState
*** Processing state updates                     ***
  - re-render Parent
  - re-render Child
*** Exiting React's browser click event handler  ***
```

`setState` 호출은 즉시 리렌더를 유발하지 않는다. 리액트는 모든 이벤트 핸들러를 우선 실행한 후, 그에 해당하는 업데이트들을 묶어서 한번 리렌더한다.

batching은 성능상으로 효과적이지만, 아래와 같은 코드에서는 예측이 어려울 수 있다.

```jsx
const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1);
}

function handleClick() {
  increment();
  increment();
  increment();
}
```

`handleClick` 내부에서 호출되는 `increment` 작업들은 모두 하나로 묶여 실행되기 때문에, `setCount(1)`을 세 번 호출하게 된다.

이런 문제를 해결하기 위해 리액트는 `setState`에 updater 함수를 전달하는 것을 권장한다.

```jsx
const [count, setCount] = useState(0);

function increment() {
  // count의 이전 상태(업데이트 이후의 상태)를 보장한다.
  setCount((c) => c + 1);
}

function handleClick() {
  increment();
  increment();
  increment();
}
```

`useState` 호출이 복잡해진다면, `useReducer` hook을 사용하여 로컬의 상태를 표현하는 것을 권장한다.

```jsx
const [counter, dispatch] = useReducer((state, action) => {
  if (action === "increment") {
    return state + 1;
  } else {
    return state;
  }
}, 0);

function handleClick() {
  dispatch("increment");
  dispatch("increment");
  dispatch("increment");
}
```

### Call Tree

프로그래밍 언어는 종종 콜 스택을 가진다. 리액트는 자바스크립트 기반으로 동작하기 때문에 자바스크립트의 규칙을 따른다. 리액트는 내부적으로 현재 렌더중인 컴포넌트를 기억하는 콜 스택을 가진다.

리액트는 UI 트리의 렌더링을 목적으로 하기 때문에, 일반적인 언어들의 런타임과는 다르다. 이 트리들은 사용자와의 인터랙션을 위해 ‘stay alive’해야 한다. DOM은 첫 번째 `ReactDOM.render` 호출 이후 사라지지 않아야 한다.

리액트 컴포넌트를 ‘콜 스택’보다는 ‘콜 트리’로 생각하는 것이 좋다. 특정 컴포넌트 바깥으로 나가더라도, 리액트 ‘콜 트리’는 제거되지 않아야 한다. (콜 스택에서는 함수가 호출되면 해당 함수는 콜 스택에서 사라진다.) 어디선가는 로컬 상태값과 호스트 인스턴스에 대한 참조를 유지하고 있어야 한다. (cf. [React Fiber](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7))

이 ‘콜 트리’ 프레임은 재조정이 필요하다고 판단될 때에 로컬 상태와 호스트 인스턴스와 같이 제거된다. Fiber는 로컬 상태가 실제로 살아있는 고간이다. 상태가 변경되면, 리액트는 Fiber에 재조정이 필요함을 마킹하고, 컴포넌트들을 호출한다.

### Context

리액트에서는 다른 컴포넌트에게 props를 통해 데이터를 전달한다. 하지만 모든 계층을 따라 props를 전달하는 것은 귀찮은 일이다.

리액트는 이에 대한 대안으로 Context API를 제공한다. Context는 컴포넌트들에게 동적인 스코프를 제공하는 것과 같다. 상위(Context Provider)에 데이터를 위치시키면, 자식 요소(Context Consumer)들에서 해당 데이터에 접근하거나 데이터의 변경에 따라 리렌더를 할 수 있다.

### Effects

리액트 컴포넌트의 리렌더링 시에는 사이드 이펙트가 있어서는 안되지만, 때때로 사이드 이펙트가 필요한 경우가 있다. focus를 조절하거나, canvas를 그리거나, 데이터의 원천을 구독할 경우 등이다. 이 경우 `useEffect` hook을 사용할 수 있다.

리액트는 브라우저가 스크린을 리페인트할 때까지 effect의 실행을 가능한 지연시킨다. 이로써 데이터 구독과 같은 코드가 TTI(Time to Interactive)와 TTFP(Time to First Paint)를 저하시키지 않음을 보장한다. (모든 것을 동기적으로 동작시키는 [useLayoutEffect hook](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)도 있다.)

effect는 디펜던시 배열에 따라 컴포넌트의 마운트 후에도 여러 번 실행될 수 있으며, cleanup 함수를 통해 컴포넌트 언마운트(제거) 시 실행할 동작을 정의할 수도 있다.

```jsx
useEffect(() => {
  DataSource.addSubscription(handleChange);
  return () => DataSource.removeSubscription(handleChange);
});
```

특정한 변수값을 넣어 해당 값이 바뀔 때만 리렌더링을 수행할 수도 있다.

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);
```

### Custom Hooks

`useState`와 `useEffect` 등의 hook들은 모두 함수 호출이기 때문에, 우리는 이것들을 우리만의 hook으로 조합할 수 있다.

custom hook은 서로 다른 컴포넌트들이 상태를 포함하고 있는, 재사용 가능한 로직을 공유하도록 해준다. 이때 상태(state) 자체는 공유되지 않는다. 각각의 hook 호출은 독립적인 상태를 가진다.

### Static Use Order

리액트에서 상태는 컴포넌트에 국한된다. `use` prefix는 문법은 아니지만, hooks의 네이밍 컨벤션이다.

또한 hook은 오직 컴포넌트 내부에서 선언되어야 하며, 조건부로 선언되어서는 안 된다. (cf. [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html))

각 hook은 linked list의 형태로 호출된다. `useState`를 호출하면, 다음 아이템으로 포인터를 옮긴다. 컴포넌트의 ‘콜 트리’를 벗어나면, 다음 렌더가 있을 때까지 hook 호출의 결과들을 리스트로 관리한다.

### What’s Left Out

리액트 잘 쓰자! 😜

---

**Ref** https://overreacted.io/react-as-a-ui-runtime/
