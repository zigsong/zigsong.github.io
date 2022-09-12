---
title: 리액트가 함수 컴포넌트와 클래스 컴포넌트를 구별하는 법
date: 2021-11-16 16:37:21
tags: react
---

Overreacted

<!-- more -->

<img src="/images/thumbnails/react-thumbnail.png" />

---

Dan abramov의 글, [리액트가 함수 컴포넌트와 클래스 컴포넌트를 구별하는 법](https://overreacted.io/how-does-react-tell-a-class-from-a-function/)을 내 스타일대로 정리해보았다.

---

## React는 함수 컴포넌트와 클래스 컴포넌트를 각각 어떻게 호출할까?

React의 함수 컴포넌트는 다음과 같이 작성한다.

```jsx
function Greeting() {
  return <p>Hello</p>;
}
```

같은 코드를 클래스 컴포넌트로 작성하면 아래와 같다.

```jsx
class Greeting extends React.Component {
  render() {
    return <p>Hello</p>;
  }
}
```

`Greeting` 컴포넌트를 함수 컴포넌트로 작성하든, 클래스 컴포넌트로 작성하든 상관은 없다.

만약 `Greeting`이 함수라면, 리액트는 이를 내부적으로 아래와 같이 호출할 것이다.

```jsx
const result = Greeting(props); // <p>Hello</p>
```

하지만 만약 `Greeting`이 클래스라면, 리액트는 이를 `new` 키워드를 통해 인스턴스를 만들고 `render` 메서드를 호출해야 한다.

```jsx
// Inside React
const instance = new Greeting(props); // Greeting {}
const result = instance.render(); // <p>Hello</p>
```

그런데, 리액트는 컴포넌트가 클래스인지 함수인지 어떻게 아는 걸까? 🤔

물론 이는 리액트가 알아서 해주기 때문에 사용하는 입장에서 반드시 알아야 할 필요는 없다. 하지만 궁금하지 않은가?!

### 추측 1: 모두 `new` 키워드로 인스턴스화 해준다.

리액트가 모든 컴포넌트를 `new` 키워드로 인스턴스화해준다면 어떨까?

클래스 컴포넌트의 경우 인스턴스를 만드는 것이 기본이므로 문제없이 동작할 것이다.

```jsx
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    alert("Hi, I am " + this.name);
  }
}

let fred = new Person("Fred");
fred.sayHi();
```

JavaScript에서 클래스 문법의 전신(?)인 생성자 함수의 경우에도 `new` 키워드를 통해 인스턴스를 만들고, prototype method를 상속받아 사용할 수는 있다.

```jsx
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  alert("Hi, I am " + this.name);
};

var fred = new Person("Fred");
fred.sayHi();
```

하지만 리액트 컴포넌트는 화살표 함수로도 선언이 가능하다는 점을 잊어서는 안 된다.

```jsx
const Greeting = () => <p>Hello</p>;

new Greeting(); // 🚨 Greeting is not a constructor
```

리액트 문법을 떠나서, JavaScript의 화살표 함수는 자체적인 `this`를 갖지 않는다. `prototype`도 생성하지 않으며, `constructor`가 없어 생성자 함수로 동작할 수도 없다. `new` 키워드를 통해 인스턴스를 만들 수 없는 것이다.

또, (약간 억지긴 하지만) instance object를 리턴하지 않는 함수가 있을 수도 있다.

```jsx
function Greeting() {
  return "Hello";
}

Greeting(); // ✅ 'Hello'
new Greeting(); // 😳 Greeting {}
```

`Greeting`을 마치 생성자 함수처럼 선언해 놓고, 인스턴스가 아닌 원시값을 리턴한다면 인스턴스를 반환하지 않게 된다. `new` 연산자를 사용하는 의미가 없다!

### 추측 2: 그렇다면 `new` 키워드 없이 그냥 함수 호출하듯 호출해준다면?

안 된다.

JavaScript의 클래스는 인스턴스를 만드는 것이 주요 목적이기 때문에, `new` 키워드를 통해 인스턴스를 생성해주지 않으면 에러가 발생한다.

```jsx
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    alert("Hi, I am " + this.name);
  }
}

let george = Person("George");
// 🚨 Uncaught TypeError: Class constructor Person cannot be invoked without 'new'
```

생성자 함수에서도 위험하긴 마찬가지다.

```jsx
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  alert("Hi, I am " + this.name);
};

let george = Person("George");
```

`Person` 함수를 `new` 키워드 없이 호출할 수는 있지만, 인스턴스가 생성되지 않는다. 이때 `this`는 인스턴스가 아닌 `window`(또는 `undefined`)를 가리키게 된다. 정확한 동작을 예측할 수 없게 되는 것이다.

### 그래서, 컴포넌트의 형태를 어떻게 구분하는 걸까?

컴포넌트를 클래스로 정의하면 `React.Component`를 상속(`extends`)받게 된다.

```jsx
class Greeting extends React.Component {
  render() {
    return <p>Hello</p>;
  }
}
```

클래스를 상속한다는 것은, 부모 클래스의 `prototype`의 인스턴스가 된다는 말로도 이해할 수 있다.

```jsx
class A {}
class B extends A {}

console.log(B.prototype instanceof A); // true
```

클래스나 생성자 함수를 `new` 키워드로 호출하여 생성한 인스턴스들은 해당 클래스(또는 함수)의 `prototype`을 상속받게 되는 것이다.

```jsx
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  alert("Hi, I am " + this.name);
};

var fred = new Person("Fred");
// fred.__proto__ === Person.prototype
```

모든 클래스 컴포넌트는 `React.Component`를 상속받는다. 클래스 컴포넌트 내부에서 `setState` 등의 메서드를 사용할 수 있는 것도 이 때문이다.

즉 클래스 컴포넌트를 사용하면, 인스턴스의 `__proto__` 체인이 클래스 계층 구조를 가리키게 된다.

```jsx
// `extends` chain
Greeting
  → React.Component
    → Object (implicitly)

// `__proto__` chain
new Greeting()
  → Greeting.prototype
    → React.Component.prototype
      → Object.prototype
```

따라서 `instanceof` 메서드를 통해 현재 클래스 컴포넌트가 `React.Component`의 자식 객체, 즉 인스턴스인지 확인하는 방법을 사용할 수 있다.

컴포넌트의 형태를 확인하는 또 다른 방법으로, 리액트는 베이스 컴포넌트에 특별한 flag, `isReactComponent`를 추가했다.

```jsx
// Inside React
class Component {}
Component.prototype.isReactComponent = {};

// We can check it like this
class Greeting extends Component {}
console.log(Greeting.prototype.isReactComponent); // ✅ Yes
```

`React.Component`를 상속받는 클래스의 경우 리액트는 프로토타입 체인 상에서 `isReactComponent` 프로퍼티를 찾게될 것이다. (`isReactComponent`의 값을 boolean이 아닌 object 타입으로 설정한 것은 Jest의 초기 버전에서 자동 mocking된 결과라고 한다.)

이 방법은 [실제 리액트 코드](https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js#L297-L300)에서 사용되고 있다. 😮

---

## 생각

클래스 컴포넌트는 인스턴스를 생성하기 때문에, 컴포넌트에서 지속적으로 유지되는 상태를 만들 수 있다.

반면 함수 컴포넌트는 호출된 후 사라지며 렌더링할 때마다 다시 생성된다. 따라서 상태를 가질 수 없으며, 상태를 흉내내기 위해 컴포넌트와 별도로 구현한 것이 hook이다.

이렇듯 클래스 컴포넌트와 함수 컴포넌트는 리액트에서 호출되고 소멸하기까지의 과정에서 큰 차이가 있는데, 리액트에서 이 둘을 어떻게 구분하여 관리하는지는 생각해보지 못한 것 같다.

실제 내용은 생각보다 간단한 JavaScript의 기본 원리(프로토타입 체인, 클래스 상속)로 컴포넌트를 구분해서 호출하고 있었다. 역시 리액트를 잘 하려면 JavaScript에 대한 깊은 이해가 필요하겠다.

앞으로 더 많은 의심을 하고 궁금증을 갖는 개발자가 되자! 🤩

---

**Ref** https://overreacted.io/how-does-react-tell-a-class-from-a-function/
