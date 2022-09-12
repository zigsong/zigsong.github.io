---
title: 하프 스터디 6주차 - this
date: 2021-05-02 08:34:13
tags: havruta
---

with 디토

<!-- more -->

<img src="/images/thumbnails/havruta-thumbnail.jpeg" />

---

## Q1. `apply()`, `call()` 메소드는 언제, 어떻게 사용할 수 있을까요? `bind`와의 차이점은 무엇인가요?

관련 문제

```jsx
const person = { name: "zig" };

function sayHi(age) {
  console.log(`${this.name} is ${age}`);
}

sayHi.call(person, 17); // zig is 17
sayHi.bind(person, 17); // function
```

`apply()`와 `call()` 모두 `this` 키워드를 참조하고자 하는 객체와 바인딩할 수 있다.

`call()`은 인자로 인수 목록을 받지만, 최근에는 rest parameter로 대체할 수 있다.
예전에는 유사배열을 배열로 변환시키기 위해 사용되었다. 첫 번째 인자로 바인딩할 this를 받고, 두 번째 인자로(선택) 함수를 호출할 때 필요한 인자를 받는다.

```jsx
function func() {
  const args = Array.prototype.slice.call(arguments);
  console.log(args); // [1, 2, 3]
}

func(1, 2, 3);
```

ES6의 rest parameter로 대체할 수 있다.

```jsx
function func(...args) {
  // rest parameter
  console.log(args); // [1, 2, 3]
}

func(1, 2, 3);
```

`apply()` 역시 call과 같다. 하지만 두 번째 인자로 배열을 넘긴다는 점이 다르다. 배열로 넘기게 되면 배열 자체가 들어가지 않고, 풀어서 들어간다.

```jsx
const numbers = [1, 2, 3];
Math.min.apply(null, numbers); // 1
Math.min(1, 2, 3); // 1
```

최근에는 역시 spread 문법으로 대체할 수 있다.

```jsx
Math.min(...numbers); // 1
```

`bind()`는 함수의 **복사본** 을 리턴하지만, 즉시 실행되지 않는 ‘바인딩 콘텍스트’다.

`call()`과 `apply()`는 함수를 즉히 호출하지만 `bind()`는 함수를 호출하지 않고 정보를 저장해둔다. 클로저 함수처럼 사용할 수 있는 것이다.

```jsx
function func(...args) {
  console.log(args); // [1, 2, 3, 4]
}

const bindFunc = func.bind(null, 1, 2, 3); // 1, 2, 3을 인수로 저장
bindFunc(4); // 호출 시 할당한 인수를 포함해서 함수를 실행
```

---

## Q2. 아래 문제를 같이 풀어보아요.

```jsx
function hello() {
  console.log(this.name);
}

var obj = {
  name: "ditto",
  hello: hello,
};

helloFn = obj.hello;

name = "global";

helloFn(); // 'ditto'일까 'global'일까?
```

`obj` 객체의 프로퍼티에 `hello()` 함수를 할당했지만, `helloFn`에 레퍼런스를 저장하는 순간 이것은 일반 함수가 된다.

this는 함수 호출 단계에서 동적으로 결정된다. 따라서 일반함수 `helloFn()`을 호출하면 기본 바인딩 규칙을 따르게 된다.

`helloFn()`을 호출한 시점에서는 this가 window에 바인딩된다. 함수를 실행하는 순간 글로벌 컨택스트가 this에 바인딩되고 `this.name`은 `obj.name`이 아닌 전역객체(window)의 name인 ‘global’를 가리키게 되는 것이다.

아래와 같이 `setTimeout` 등의 함수에 콜백으로 넘겨주는 경우도 마찬가지다.

```jsx
function hello() {
  console.log(this.name);
}

var obj = {
  name: "ditto",
  hello: hello,
};

setTimeout(obj.hello, 1000);

name = "global";
```

1초 뒤 `setTimeout`의 콜백 호출 시 obj.hello는 obj에 대한 바인딩을 잃어버린 상태다. ‘global’을 출력한다.

**Ref** https://jeonghwan-kim.github.io/2017/10/22/js-context-binding.html

---

## Q3. `new` 바인딩은 어떤 역할을 할까요?

```jsx
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const zig = new Person("Zig", "Song");
const ditto = Person("Ditto", "Cheon");

console.log(zig); // Person { firstName: "Zig", lastName: "Song" }
console.log(ditto); // undefined -> 왜 undefined일까요?
console.log(firstName); // Ditto 😮
```

생성자 함수가 가지고 있는 new 연산자를 사용하면 인스턴스를 생성할 수 있다. 이 경우 인스턴스에 this가 바인딩된다.

new 연산자를 사용하는 경우 부모가 가진 prototype을 인스턴스의 `__proto__`에 그대로 할당하게 되기 때문에 부모가 가진 프로퍼티를 자신의 것처럼 사용할 수 있게 된다.

`ditto`는 일반 함수로서 호출되었기 때문에 객체를 암묵적으로 생성하여 반환하지 않는다.

아래와 같이 `new.target`을 이용하여, 생성자 함수의 인스턴스가 생성되었는지 여부를 판단할 수 있다.

```jsx
function Person(firstName, lastName) {
  console.log(new.target);
  if (!new.target) {
    // return;
    return new Person(firstName, lastName);
  }

  this.firstName = firstName;
  this.lastName = lastName;
}

const zig = Person("Zig", "Song");
```

**👩‍🏫 잠깐 정리!**

👾 일반 함수를 호출하면 this는 전역객체에 바인딩되지만 new 연산자와 함께 생성자 함수를 호출하면 this는 생성자 함수가 암묵적으로 생성한 빈 객체에 바인딩된다.
👾 생성자 함수 내부의 this에는 생성자 함수가 (미래에) 생성할 인스턴스가 바인딩된다.

---

## Q4. React class 컴포넌트의 메소드에 this 바인딩이 필요한 이유는 무엇일까요?

JSX에서 반환하는 컴포넌트의 이벤트 핸들러 콜백으로 넘겨주기 위해서는 해당 메소드가 현재 컴포넌트에 바인딩되었다는 것을 명확히 하기 위해 JSX 콜백 안에서 this의 사용에 주의해야 한다. JavaScript에서 클래스 메서드는 기본적으로 바인딩되어 있지 않다.

```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // 콜백에서 `this`가 작동하려면 아래와 같이 바인딩 해주어야 한다.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      isToggleOn: !state.isToggleOn,
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? "ON" : "OFF"}
      </button>
    );
  }
}
```

`render()` 내에서 `this.handleClick`을 바인딩하지 않고 `onClick`에 전달하였다면, 함수가 실제 호출될 때 this는 `button`이 아닌 `undefined`가 된다. 따라서 이벤트 핸들러를 넘겨주는 상황에서는 this 바인딩이 필요하다.

👾 이벤트핸들러에 `() ⇒ method()`의 형태로 넘겨주는 것은, 매번 함수를 새로 만드는 것이기 때문에 좋지 않다

또 자식 컴포넌트에 props로 메서드를 넘겨줄 때, this 바인딩이 필요하다.

```jsx
class ParentComponent extends React.Component {
  // ...
  handleClick() {
    this.setState((state) => ({ count: state.count + 1 }));
  }

  render() {
    return <ChildComponent onCounterClick={this.handleClick} />;
  }
}

class ChildComponent extends React.Component {
  constructor() {
    super(props);
  }

  render() {
    return <button onClick={props.onCounterClick}>클릭</button>;
  }
}
```

this 바인딩을 하지 않으면 ChildComponent의 `props.onCounterClick`에서 this를 찾지 못한다.
props로 넘겨주는 `handleClick`에서 호출하는 `this.setState`의 `this`를 찾을 수 없어 오류가 발생하는 것이다.

**Ref** https://ko.reactjs.org/docs/handling-events.html

---

## Q5. 아래의 결과와 그 이유를 설명해주세요.

```jsx
const obj = {
  result1() {
    console.log(this); // obj 👉 호출한 객체 context에 바인딩
  },

  result2: () => {
    console.log(this); // window 👉 화살표 함수는 상위 스코프에 바인딩
  },

  inner: {
    result3() {
      console.log(this); // obj.inner 👉 호출한 객체 context에 바인딩

      const innerInner1 = () => {
        console.log(this); // obj.inner 👉 화살표 함수는 상위 스코프에 바인딩
      };

      function innerInner2() {
        console.log(this); // window 👉 객체 메소드의 내부함수(중첩함수)일 경우 this는 전역객체에 바인딩
      }

      innerInner1();
      innerInner2();
    },

    result4: () => {
      // 실행 컨텍스트는 window
      console.log(this); // window 👉 result4라는 화살표 함수의 상위 스코프는 전역

      const innerInner1 = () => {
        console.log(this); // window 👉 result4라는 화살표 함수의 상위 스코프는 전역
      };

      function innerInner2() {
        console.log(this); // window 👉 객체 메소드의 내부함수(중첩함수)일 경우 this는 전역객체에 바인딩
      }

      innerInner1();
      innerInner2();
    },
  },
};

obj.result1(); // 1번
obj.result2(); // 2번
obj.inner.result3(); // 3번
obj.inner.result4(); // 4번
```

화살표 함수가 상위 scope (lexical scope)에 바인딩된다는 것은, 호출한 실행 컨텍스트를 타고 올라가는 것이다. 이때 객체는 실행 컨텍스트가 되지 못하며, 함수 호출만이 실행 컨텍스트에 해당한다. 실행 컨텍스트를 타고 window까지 올라가면서 중간에 this 바인딩할 곳을 만나면 그곳에서 멈추게 된다.

JavaScript의 호출 스택을 생각하면 된다.

---

## Q6. 위의 경우에서 this가 원하는 대상을 바라보지 않는 경우, 어떻게 원하는 대상을 바라보게 할 수 있을까요? this를 원하는 대상에 바인딩 할 수 있는 메서드에 대해 설명해주세요!

`call()`, `apply()`, `bind()`를 사용하는 문제

```jsx
const obj = {
  result1() {
    console.log(this);
  },

  result2: () => {
    console.log(this);
  },

  inner: {
    result3() {
      console.log(this);

      const innerInner1 = () => {
        console.log(this);
      };

      function innerInner2() {
        console.log(this);
      }

      innerInner1.apply(obj); // obj.inner 👉 화살표 함수의 명시적 바인딩은 소용 X
      innerInner2.apply(obj); // obj

      innerInner1.apply(obj.inner); // obj.inner 👉 화살표 함수의 명시적 바인딩은 소용 X
      innerInner2.apply(obj.inner); // obj.inner

      innerInner1.apply(this); // obj.inner 👉 화살표 함수의 명시적 바인딩은 소용 X
      innerInner2.apply(this); // obj.inner
    },

    result4: () => {
      console.log(this);

      const innerInner1 = () => {
        console.log(this);
      };

      function innerInner2() {
        console.log(this);
      }

      innerInner1.apply(obj); // window 👉 화살표 함수의 명시적 바인딩은 소용 X
      innerInner2.apply(obj); // obj

      innerInner1.apply(obj.inner); // window 👉 화살표 함수의 명시적 바인딩은 소용 X
      innerInner2.apply(obj.inner); // obj.inner

      innerInner1.apply(this); // window 👉 화살표 함수의 명시적 바인딩은 소용 X
      innerInner2.apply(this); // window 👉 result4가 화살표 함수기 때문에 전역객체에 바인딩된 상태
    },
  },
};

obj.inner.result3();
obj.inner.result4();
```

👾 화살표 함수를 `call()`, `bind()`, `apply()`를 사용해 호출할 때 this의 값을 정해주더라도 무시한다. (언제나 상위 스코프의 this 바인딩 참조) 사용할 매개변수를 정해주는 건 문제 없지만, 첫 번째 매개변수(thisArg)는 null을 지정해야 한다.

---

## Q7. 일반 모드와 strict 모드에서의 this 바인딩은 어떤 차이점이 있는지 설명해주세요.

```jsx
function f1() {
  return this;
}

function f2() {
  "use strict";
  return this;
}

f1(); // window
f2(); // undefined
```

strict 모드에서 this는 정의되지 않은 경우 `window`가 아닌 `undefined`가 된다.
명시적 바인딩을 해주면 비엄격 모드일 때와 동일하게 바인딩된다.

```jsx
"use strict";
function fun() {
  return this;
}

console.assert(fun() === undefined);
console.assert(fun.call(2) === 2);
console.assert(fun.apply(null) === null);
console.assert(fun.call(undefined) === undefined);
console.assert(fun.bind(true)() === true);
```

**Ref** https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode

---

## Q8. this는 언제 어떻게 결정되는 것인지 설명해주세요.

함수 호출 방식에 의해 `this`가 바인딩할 객체가 동적으로 결정된다.

**1. 함수 호출**

- 기본적으로 일반적인 함수 호출 시 this는 전역객체(window)에 바인딩 (브라우저 환경)
- 전역 함수, 내부 함수, 객체 메서드의 내부 함수, 콜백 함수 (setTimeout 등)

**2. 메서드 호출**

- 해당 메서드를 호출한 객체에 바인딩
- 프로토타입 객체에도 동일하게 적용

**3. 생성자 함수 호출**

- this는 new 연산자에 의해 새롭게 만들어진 객체에 바인딩

**4. apply/call/bind 호출 → 명시적 바인딩**

- 사용자가 명시적으로 this에 바인딩될 객체를 지정하는 방법
- Function.prototype에 정의되어 있다 (Function.prototype.call, …)
