---
title: useRef의 배신
date: 2023-06-28 20:35:38
thumbnailImage: https://i.imgur.com/stTzX5o.png
---

useRef는 첫 렌더링 시 값을 가지지 않을 수도 있다

<!-- more -->

---

### 🙀 `useRef`가 비어있다!

특정 DOM 요소의 height를 구할 때, `useRef`를 사용하여 DOM에 ref를 붙일 수 있다.

요렇게...

```tsx
const MenuItem = () => {
  const menuItemRef = useRef<HTMLDivElement>(null);

  return <div ref={menuItemRef}>{/* ... */}</div>;
};
```

🚨 그런데!

`menuItemRef`가 가져온 DOM element의 height를 구하려 했는데, 첫 번째 렌더 시에 `menuItemRef.current`의 값이 null이 나온다.

**🤔 왜 첫 번째 렌더링에서 Ref의 값이 비어있을까?**

리액트에서 업데이트는 두 단계로 이루어진다.

1. **render phase** - 무엇이 스크린에 그려져야 할지 알아내기 위해 리액트는 컴포넌트를 호출한다
2. **commit phase** - 리액트는 변경사항을 DOM에 반영한다

일반적으로, render phase에서 ref에 접근하지는 않는다. (특히 ref가 DOM에 붙은 경우) 첫 번째 렌더 시에, DOM node들이 아직 생성되지 않았기 때문에 `ref.current`의 값은 `null`이 될 수 있다.

리액트는 commit phase에서 `ref.current`의 값을 설정한다. 그리고 DOM을 업데이트하기 전에, 리액트는 `ref.current`의 값을 `null`로 설정한다. DOM 업데이트가 완료된 후에, 리액트는 즉시 `ref.current`의 값을 DOM node의 값으로 설정한다.

`ref.current` 값이 변경되더라도 리렌더링을 유발하지 않기 때문에, `useRef`는 컴포넌트의 내용이 바뀌어도 변경사항을 알려주지 않는다. 즉 첫 번째 렌더 시에 `ref={menuItemRef}`는 업데이트되겠지만, 새로운 리렌더링을 유발하진 않는다.

(🙃 TanStack Query의 메인테이너도 `useRef`의 동작 방식에 가스라이팅 당했다고 한다 ([출처 - 트위터](https://twitter.com/tannerlinsley/status/1641548458526908417)))

**💡 `ref.current` 값의 업데이트에 따라 리렌더링을 하고 싶다면 ref 대신 `useCallback`을 사용하는 방법도 있다 ([React 공식 문서 - How can I measure a DOM node?](https://legacy.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node))**

```tsx
const MenuList = () => {
  const menuItemRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setMenuHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return <div ref={menuItemRef}>{/* ... */}</div>;
};
```

리액트는 ref가 새로운 노드에 붙을 때마다 callback을 수행한다. 그렇기 때문에 callback ref를 사용하면 자식 컴포넌트가 ref가 붙은 노드를 나중에 표시할 때도(ex. 사용자의 인터랙션 이후) 업데이트된 값을 제공한다.

`useCallback`의 deps로 빈 배열(`[]`)을 넣어서 ref callback이 리렌더링 사이에 바뀌지 않도록 한다. 예제에서, ref가 붙은 `<div>` 요소는 리렌더링 간에도 계속 존재하기 때문에 callback ref는 오직 컴포넌트 마운트/언마운트 시에만 호출된다.

### 🔍 `useRef`의 구현 방식

```tsx
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

첫 번째 렌더 시에, `useRef`는 `{ current: initialValue }`를 반환한다. 이 객체는 리액트에 저장되고, 따라서 다음 렌더 시에도 같은 객체(참조값)가 반환된다. `useRef`는 항상 같은 객체를 반환하기 때문에 `useState`의 setter는 사용되지 않는다. (unused)

### 🤔 `useEffect`의 deps에 `ref.current` 값을 넣고 `ref.current` 값이 바뀌면 `useEffect`가 호출될까?

- 정답은 🙅‍♂️
  - `.current`값은 의도적으로 변경 가능하게(mutable) 설계되었다.
    → 값이 변경되어도 리렌더링되지 않는다.
- 리렌더링이 발생하여 `useEffect`가 호출되는 경우는 다음 경우 뿐이다.
  - state가 바뀌었을 때
  - prop이 바뀌었을때
  - 부모 컴포넌트가 리렌더링했을 때

### Ref

- [When React attaches the refs](https://react.dev/learn/manipulating-the-dom-with-refs#when-react-attaches-the-refs)
- [Can global or mutable values be dependencies?](https://react.dev/learn/lifecycle-of-reactive-effects#can-global-or-mutable-values-be-dependencies)
- [**useRef 대신 useCallback 사용하기 출처(stackoverflow)**](https://stackoverflow.com/questions/65941536/useref-value-is-undefined-on-initial-render)
