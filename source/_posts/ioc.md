---
title: Inversion of Control (IOC)
date: 2021-10-23 16:59:24
tags: design
---

IOC | 제어의 역전

<!-- more -->

<img src="/images/thumbnails/design-thumbnail.jpg" />

Kent C Dodds의 [Inversion of Control](https://kentcdodds.com/blog/inversion-of-control)을 ~~내맘대로~~ 번역한 글이다.

여러분은 리액트 컴포넌트나 hook 등 재사용할 수 있는 코드를 만들어봤을 것이다. 이후 누군가가 해당 코드가 필요하지만, 약간의 변형이 필요하다고 말한다면? 여러분은 그 코드에 argument/prop/option 및 관련된 로직을 추가할 것이고, 이 과정은 반복된다. 재사용 가능했던 코드는 이제 유지보수하기에 끔찍한 악몽이 되고 만다 😭

이 코드가 유지보수하기에 두려운 이유는 다음과 같다.

- 번들 사이즈와 성능상의 문제가 발생한다. 아무도 이 문제를 해결하기 위해 코드를 들여다봐주지 않을 것이다!
- 유지보수에 오버헤드가 발생한다. 코드를 사용할 때 수많은 variation이 존재하고, 문서화도 어려워진다. 사용 시 어떤 것이 옳은 접근 방식인지도 판단하기 어렵다.
- 실행이 복잡해진다. 수많은 arguments/options/props의 조합은 누가 사용하고 있는지조차 몰라 함부로 바꾸거나 없앨 수도 없다.
- API가 복잡해진다. 다양한 arguments/options/props들로 인해 문서가 복잡해지며, 이를 사용하는 사람들이 배워야 할 것이 많아진다.

---

## 도입: Inversion of Control

단순한 추상화를 위한 효율적인 메커니즘의 원칙 중 하나가 ‘Inversion of Control’이다. 추상화를 거친 코드는 일을 적게 하고, 사용자가 더 일을 많이 하도록 한다. ‘추상화’라는 개념을, ‘복잡하고 반복되는 일들을 추상화함으로써 나머지 코드는 간단하고 깔끔하게 작성하는 방법으로 생각할 수도 있다. 하지만, 전통적인 개념의 추상화는 반드시 그렇게 동작하는 것은 아니다.

---

## Inversion of Control의 코드 예시

굉장히 인위적인 아래 코드를 살펴보자.

```jsx
// let's pretend that Array.prototype.filter does not exist
function filter(array) {
  let newArray = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element !== null && element !== undefined) {
      newArray[newArray.length] = element;
    }
  }
  return newArray;
}

// use case:

filter([0, 1, undefined, 2, null, 3, "four", ""]);
// [0, 1, 2, 3, 'four', '']
```

전형적인 ‘추상화 생명주기’에 따라 관련 있어 보이는 use case들을 추가해보자.

```jsx
// let's pretend that Array.prototype.filter does not exist
function filter(
  array,
  {
    filterNull = true,
    filterUndefined = true,
    filterZero = false,
    filterEmptyString = false,
  } = {}
) {
  let newArray = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (
      (filterNull && element === null) ||
      (filterUndefined && element === undefined) ||
      (filterZero && element === 0) ||
      (filterEmptyString && element === "")
    ) {
      continue;
    }

    newArray[newArray.length] = element;
  }
  return newArray;
}

filter([0, 1, undefined, 2, null, 3, "four", ""]);
// [0, 1, 2, 3, 'four', '']

filter([0, 1, undefined, 2, null, 3, "four", ""], { filterNull: false });
// [0, 1, 2, null, 3, 'four', '']

filter([0, 1, undefined, 2, null, 3, "four", ""], { filterUndefined: false });
// [0, 1, 2, undefined, 3, 'four', '']

filter([0, 1, undefined, 2, null, 3, "four", ""], { filterZero: true });
// [1, 2, 3, 'four', '']

filter([0, 1, undefined, 2, null, 3, "four", ""], { filterEmptyString: true });
// [0, 1, 2, 3, 'four']
```

이제 문맥상 6개의 use case를 갖게 되었지만, 이들을 조합하면 25개의 경우의 수가 탄생한다. 그리고 이는 일반적으로 간단한 편에 속한다. 하지만 시간이 지나고 다시 코드를 살펴본다면, 위 코드가 실제로 고려하고 있는 use case들을 더 간단하게 작성할 수 있다는 것을 깨닫게 될 것이다. 물론 위 코드가 제공하는 기존 기능들은 없애지 않으면서 말이다!

이제 생각을 좀 더 하고 이 함수를 추상화해보자. 여기서 모든 use case를 지원하기 위해 Inversion of control을 적용할 수 있다.

```jsx
// let's pretend that Array.prototype.filter does not exist
function filter(array, filterFn) {
  let newArray = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (filterFn(element)) {
      newArray[newArray.length] = element;
    }
  }
  return newArray;
}

filter(
  [0, 1, undefined, 2, null, 3, "four", ""],
  (el) => el !== null && el !== undefined
);
// [0, 1, 2, 3, 'four', '']

filter([0, 1, undefined, 2, null, 3, "four", ""], (el) => el !== undefined);
// [0, 1, 2, null, 3, 'four', '']

filter([0, 1, undefined, 2, null, 3, "four", ""], (el) => el !== null);
// [0, 1, 2, undefined, 3, 'four', '']

filter(
  [0, 1, undefined, 2, null, 3, "four", ""],
  (el) => el !== undefined && el !== null && el !== 0
);
// [1, 2, 3, 'four', '']

filter(
  [0, 1, undefined, 2, null, 3, "four", ""],
  (el) => el !== undefined && el !== null && el !== ""
);
// [0, 1, 2, 3, 'four']
```

굿! 훨씬 간단하다. 제어권을 바꾼 것이다. `filter` 함수가 리턴하는 새로운 배열의 요소들을 결정하는 책임을 `filter` 함수의 호출부로 옮겼다.

이전 방식의 추상화도 그렇게 나쁘진 않았을 것이다. 하지만 제어를 역전함으로써 use case를 더 많이, 자유롭게 추가할 수 있게 되었다.

```jsx
filter(
  [
    { name: "dog", legs: 4, mammal: true },
    { name: "dolphin", legs: 0, mammal: true },
    { name: "eagle", legs: 2, mammal: false },
    { name: "elephant", legs: 4, mammal: true },
    { name: "robin", legs: 2, mammal: false },
    { name: "cat", legs: 4, mammal: true },
    { name: "salmon", legs: 0, mammal: false },
  ],
  (animal) => animal.legs === 0
);
// [
//   {name: 'dolphin', legs: 0, mammal: true},
//   {name: 'salmon', legs: 0, mammal: false},
// ]
```

---

## 더 나쁜 API?

제어가 역전된 API에 대해 사람들이 일반적으로 하는 불평은, “이전보다 사용하기 더 어려워졌다”는 것이다. 다음 예시를 살펴보자.

```jsx
// before
filter([0, 1, undefined, 2, null, 3, "four", ""]);
```

```jsx
// after
filter(
  [0, 1, undefined, 2, null, 3, "four", ""],
  (el) => el !== null && el !== undefined
);
```

분명히 before의 코드가 사용하긴 더 쉬워보인다. 하지만 우리는 제어의 역전이 적용된 API를 사용하여 이전의 API를 간단하게 다시 사용할 수 있다.

```jsx
function filterWithOptions(
  array,
  {
    filterNull = true,
    filterUndefined = true,
    filterZero = false,
    filterEmptyString = false,
  } = {}
) {
  return filter(
    array,
    (element) =>
      !(
        (filterNull && element === null) ||
        (filterUndefined && element === undefined) ||
        (filterZero && element === 0) ||
        (filterEmptyString && element === "")
      )
  );
}
```

위와 같이, 제어가 역전된 API의 상단부에 추상화를 설계하여 사람들에게 필요한 간단한 API를 제공할 수 있다. 또 만약 우리의 “간단한” API가 모든 use case를 다루기 충분하지 않다면, 더 복잡한 태스크를 해결하기 위해 비슷한 코드블럭을 쌓아나갈 수 있다.

아래 재미있는(!) 예시처럼 말이다.

```jsx
function filterByLegCount(array, legCount) {
  return filter(array, (animal) => animal.legs === legCount);
}

filterByLegCount(
  [
    { name: "dog", legs: 4, mammal: true },
    { name: "dolphin", legs: 0, mammal: true },
    { name: "eagle", legs: 2, mammal: false },
    { name: "elephant", legs: 4, mammal: true },
    { name: "robin", legs: 2, mammal: false },
    { name: "cat", legs: 4, mammal: true },
    { name: "salmon", legs: 0, mammal: false },
  ],
  0
);
// [
//   {name: 'dolphin', legs: 0, mammal: true},
//   {name: 'salmon', legs: 0, mammal: false},
// ]
```

이렇게 일반적인 use case를 사용하면서도 추가적으로 원하는 여러 태스크들을 조합할 수 있다.

---

## 실제로 사용되나?

이런 추상화 방식이 좋아보이긴 하는데, 실제로 먹히는 컨셉일까? 아마 우리는 눈치채지 못한 새 제어가 역전된 API를 사용하고 있을지 모른다. 예를 들어, `Array.prototype.filter` 함수는 제어가 역전되었다. `Array.prototype.map`도 마찬가지다.

최애 패턴 두 가지는 ‘[Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks)‘와 ‘[State Reducers](https://kentcdodds.com/blog/the-state-reducer-pattern)‘이다.

### Compound Components

`Menu` 컴포넌트를 만들고 싶다고 해보자. 메뉴를 여는 버튼이 있고, 클릭했을 때 메뉴 아이템의 리스트를 보여준다. 아이템이 선택되면, 특정한 액션을 수행한다. 일반적으로 props를 만들어서 컴포넌트를 만들 것이다.

```jsx
function App() {
  return (
    <Menu
      buttonContents={
        <>
          Actions <span aria-hidden>▾</span>
        </>
      }
      items={[
        { contents: "Download", onSelect: () => alert("Download") },
        { contents: "Create a Copy", onSelect: () => alert("Create a Copy") },
        { contents: "Delete", onSelect: () => alert("Delete") },
      ]}
    />
  );
}
```

우리는 메뉴 아이템을 마음대로 커스터마이징할 수 있다. 하지만 메뉴 아이템 앞에 삭제 버튼을 추가해야 하면 어떨까? 아이템 객체에 옵션을 추가한다면? 🤯 API는 점점 꼬일 것이다.

좋은 API를 만들기 위해서는, if문이나 삼항 연산자 등의 남용은 자제해야 한다. 제어의 역전을 생각해 보자. 이 경우에, 단지 우리 메뉴에 대한 책임을 유저에게 넘기면 어떨까? 그게 리액트 컴포넌트의 조합이 갖고 있는 최고 강점 중 하나이니까!

```jsx
function App() {
  return (
    <Menu>
      <MenuButton>
        Actions <span aria-hidden>▾</span>
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => alert("Download")}>Download</MenuItem>
        <MenuItem onSelect={() => alert("Copy")}>Create a Copy</MenuItem>
        <MenuItem onSelect={() => alert("Delete")}>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
}
```

위 코드의 특징 중 하나는 컴포넌트를 사용하는 곳에서는 ‘상태(state)’를 볼 수 없다는 것이다. 상태는 컴포넌트들 간에 암묵적으로 공유되고 있다. 이것은 컴포넌트의 조합(compound) 패턴의 핵심 가치다. 이를 이용해서 우리는 렌더링하는 제어권을 컴포넌트의 사용부에 넘길 수 있으며, 코드 추가도 쉽고 직관적으로 바뀐다.

### State Reducer

이 패턴은 컴포넌트 로직을 커스터마이징하기 위한 것이다. 검색, 타이핑(typeahead), 자동완성 등이 가능한 `Downshift`라는 라이브러리를 추가했다. 이제 이 컴포넌트에서 아이템은 복수 선택이 가능하며, 아이템이 선택된 이후에도 메뉴가 계속 열려있어야 한다고 생각해 보자.

누군가는 `closeOnSelection`이라는 prop을 추가할 것이다. 하지만 이는 별로인 것 같다.

그 대신, 상태 변화를 제어하는 API를 떠올려 보자. 컴포넌트의 상태가 변할 때마다 호출되는 state reducer 함수를 만들 수 있다. 이 함수는 상태가 변화하려 할 때 개발자가 상태를 바꿀 수 있도록 해준다.

다음 예시를 살펴보자.

```jsx
function stateReducer(state, changes) {
  switch (changes.type) {
    case Downshift.stateChangeTypes.keyDownEnter:
    case Downshift.stateChangeTypes.clickItem:
      return {
        ...changes,
        // we're fine with any changes Downshift wants to make
        // except we're going to leave isOpen and highlightedIndex as-is.
        isOpen: state.isOpen,
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}

// then when you render the component
// <Downshift stateReducer={stateReducer} {...restOfTheProps} />
```

이 prop을 추가함으로써, 우리는 컴포넌트를 커스터마이징하는 요청을 획기적으로 줄일 수 있다. 이제 원하는 태스크의 추가를 자유자재로 간단하게 할 수 있다.

### Render Props

[render props](https://reactjs.org/docs/render-props.html) 패턴은 완벽한 제어의 역전이다. 그러나 여기서는 다루지 않을 것임.

---

## 주의사항

제어의 역전은 앞으로 use case를 추가할 수 있는 상황에 대비해서 재사용 가능한 코드를 작성하는 훌륭한 방식이다. 하지만 그전에, 몇몇 주의사항이 있다. 처음에 만났던 인위적인 코드의 예시를 다시 한번 보자.

```jsx
// let's pretend that Array.prototype.filter does not exist
function filter(array) {
  let newArray = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element !== null && element !== undefined) {
      newArray[newArray.length] = element;
    }
  }
  return newArray;
}

// use case:
filter([0, 1, undefined, 2, null, 3, "four", ""]);
// [0, 1, 2, 3, 'four', '']
```

만약 이것이 `filter`가 수행해야 하는 전부이며, `null`과 `undefined`를 제외하고 모든 것들을 필터링해야 한다면 어떨까? 이 경우 단 하나의 use case를 위해 제어의 역전을 적용하는 것은 더욱 코드를 복잡하게 만들 뿐이다.

모든 추상화는 항상 신중한 고려 후에 작성해야 한다. 시작 전에 [AHA Programming](https://kentcdodds.com/blog/aha-programming)의 원칙을 살펴보고, 성급한 추상화를 피하도록 하자!

---

## 생각

막연하게 ‘제어의 역전’이라는 말을 어렵게만 생각하고 있었는데, 쉬운 예시를 들어가며 이해하기 쉽게 정리한 것 같다. 정말 자주 사용하는 `Array`의 `filter`나 `map` 등의 메서드도 제어의 역전으로 볼 수 있다니, 주어진 기술을 단지 생각없이 사용하는 것보다 ‘이게 왜 이렇게 탄생했는지?’ 생각해보는 연습이 중요한 것 같다.

추상화 단계를 조금 더 세분화해보면 `filter`라는 가장 추상화된 함수에서 `filterByLegCount`와 같은 또 다른 중간 단계의 추상화를 만들 수도 있으며, 개발자들이 정말 유연하게 사용할 수 있는 코드라는 것이 이런 지점에서 출발하는 것이 아닐까 생각이 든다.

React의 컴포넌트 역시 이러한 추상화의 방식으로 컴포넌트를 분리하고, 이후 기능 추가에 대비해 유연하게 작성되어 있다는 점을 알 수 있었다.

제어의 역전은 어쩌면 선언형 프로그래밍과도 맥이 이어지는 방식이라고 생각한다. ‘어떻게’ 할 것인지에 초점을 두는 명령형 프로그래밍과는 달리 선언형 프로그래밍은 ‘무엇을’ 할지에 관심을 둔다. 하지만 선언형 프로그래밍은 단지 사용하는 쪽에서 코드를 최대한 단순하게 쓸 수 있도록 해야 한다는 생각에 사용부에서 많은 것을 알아야 하는 위 예시들과는 조금 다르다고 생각했다.

그러나 사용하는 쪽에서 ‘많이’ 알아야 하는 것이 잘못된 것은 아니다. 단순히 누가 많이 알고 적게 아는 것이 아니라, 함수가 온전하게 역할이 분리되어 있고 재사용 가능한 로직들을 적절하게 잘 분리했다면, 추상화한 함수 스스로 ‘무엇을’ 할 것인지에 대한 역할을 수행하고 있다고 생각한다.

함수를 분리하며 누가 제어권을 가져야 좋을지, 이후 유지보수 과정도 잘 생각해 보면서 코드를 짜는 연습을 해야겠다.
