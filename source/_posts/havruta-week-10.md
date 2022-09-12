---
title: 하프 스터디 10주차 - 프로토타입
date: 2021-06-06 22:27:56
tags: havruta
---

with 피터

<!-- more -->

<img src="/images/thumbnails/havruta-thumbnail.jpeg" />

---

## Q1. 아래 두 방식은 어떻게 서로 다를까요?

```jsx
// 1번
function Circle(radius) {
  this.radius = radius;
  this.getArea = function () {
    return Math.PI * this.radius ** 2;
  };
}

const circle1 = new Circle(1);
const circle2 = new Circle(2);

console.log(circle1.getArea === circle2.getArea); // false

// 2번
function Circle(radius) {
  this.radius = radius;
}

Circle.prototype.getArea = function () {
  return Math.PI * this.radius ** 2;
};

const circle1 = new Circle(1);
const circle2 = new Circle(2);

console.log(circle1.getArea === circle2.getArea); // true
```

- 1번
  - 인스턴스를 생성할 때마다 `getArea` 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.
  - 메모리의 불필요한 낭비, 퍼포먼스에 악영향을 끼친다.
- 2번
  - `Circle` 생성자 함수가 생성한 모든 인스턴스가 `getArea` 메서드를 공유해서 사용할 수 있도록 프로토타입에 추가한다.
  - 프로토타입은 `Circle` 생성자 함수의 prototype 프로퍼티에 바인딩된다.
  - `getArea` 메서드는 단 하나만 생성한다.
  - `Circle` 생성자 함수가 생성하는 모든 인스턴스는 `getArea` 메서드를 상속받아 사용한다.

👾 생성자 함수가 생성할 모든 인스턴스는 별도의 구현 없이 상위(부모) 객체인 프로토타입의 자산을 공유하여 사용할 수 있다

---

## Q2. `hasOwnProperty`와 `getOwnPropertyDescriptor`를 사용해본 적 있나요? 언제 어떻게 사용하면 좋을까요?

**hasOwnProperty**

- `Object.prototype.hasOwnProperty`
- 객체에 특정 프로퍼티가 존재하는지 확인한다.
- 인수로 전달받은 프로퍼티 키가 객체 고유의 프로퍼티 키인 경우에만 true를 리턴하며, 상속받은 프로토타입의 프로퍼티 키인 경우 false를 리턴한다.

```jsx
const person = { name: "Zig" };

console.log(person.hasOwnProperty("name")); // true
console.log(person.hasOwnProperty("toString")); // false

console.log("toString" in person); // true
console.log(Object.prototype.hasOwnProperty("hasOwnProperty")); // true
console.log(person.hasOwnProperty("hasOwnProperty")); // false
```

- 프로토타입 체인과 `hasOwnProperty`

```jsx
function Person(name) {
  this.name = name;
}

const me = new Person("Zig");
me.hasOwnProperty("name"); // true
```

- me 객체에서 `hasOwnProperty` 메서드를 검색한다.

- me에는 `hasOwnProperty` 메서드가 없으므로 프로토타입 체인을 따라, `[Prototype]]` 내부 슬롯에 바인딩되어 있는 프로토타입(Person.prototype)으로 이동하여 `hasOwnProperty` 메서드를 검색

- `hasOwnProperty`가 있는 Object까지 프로토타입 체인을 타고 올라간다. Object에서 `hasOwnProperty`를 호출한다.

  - 이때 `hasOwnProperty`는 me를 바인딩한 형태로 호출된다. 즉 `Object.prototype.hasOwnProperty.call(me, 'name')`

**getOwnPropertyDescriptor**

- `Object.getOwnPropertyDescriptor(obj, prop)`

- 주어진 객체 자신의 속성(즉, 객체에 직접 제공하는 속성, 객체의 프로토타입 체인을 따라 존재하는 덕택에 제공하는 게 아닌)에 대한 속성 설명자(descriptor)를 반환한다.

- value, writable, get, set, configurable, enumerable

  ```jsx
  var obj = {};

  // 새로운 속성을 정의
  Object.defineProperty(obj, "prop", {
    value: "Hello",
    writable: false,
  });

  console.log(Object.getOwnPropertyDescriptor(obj, "prop"));
  // > {"value":"Hello","writable":false,"enumerable":false,"configurable":false}
  ```

- enumerable = false이면 `for..in` 연산문에서 빠진다

  ```jsx
  const person = {
    name: "Zig",
    address: "Seoul",
  };

  console.log("toString" in person); // true
  for (const key in person) {
    console.log(key + ": " + person[key]);
  }

  // name: Zig
  // address: Seoul
  ```

- `Object.prototype.toString` 프로퍼티의 `[[Enumerable]]` 값이 false이기 때문

```jsx
Object.getOwnPropertyDescriptor(Object.prototype, "toString");
// {writable: true, enumerable: false, configurable: true, value: ƒ}
```

- `writable`이 false이면 read-only처럼 동작한다.(할당 연산자를 사용한 값의 재할당을 의미한다). 즉 writable이 false이면 할당연산자를 이용한 할당이 불가능하다.
- `enumerable`이 false이면 나열이 불가능하다.(`for...in` 문이나 `Object.keys()`로의 접근이 불가능하다.)
- `configurable`이 false이면 해당 속성을 설정하는 것이 더이상 불가능해진다. (`defineProperty`를 사용한 값의 재할당이 불가하다.)

---

## Q3. `__proto__`와 `Object.getPrototypeOf` 메서드는 어떻게 다를까요?

- `__proto__` 접근자 프로퍼티 대신 프로토타입의 참조를 취득하고 싶은 경우 `getPrototypeOf`을 사용한다.

- `__proto__` 프로퍼티에 접근하면 내부적으로 `Object.getPrototypeOf`가 호출되어 프로토타입 객체를 반환한다.

  - 할당값이 객체인 경우에는 객체의 프로토타입이 바뀔 수 있어서 치명적인 버그가 발생할 수 있다. 버그 뿐 아니라, 프로토타입 객체를 직접 변경하는 연산은 프로퍼티 접근 관련 최적화를 망치기 때문에 퍼포먼스 이슈가 발생한다.

- `getPrototypeOf`은 **readOnly** → `setPrototypeOf`을 사용해서 프로토타입을 새로 할당한다.

```jsx
const obj = {};

obj.__proto__ = null;
obj.__proto__; // undefined
Object.getPrototypeOf(obj); // null

obj.__proto__ = "peter";
obj.__proto__; // peter -> __proto__가 obj의 key값처럼 사용됨
Object.getPrototypeOf(obj); // null이 유지됨
```

**Ref** https://ko.javascript.info/prototype-methods

---

## Q4. 객체 리터럴에 의해 생성된 객체의 프로토타입은 어떻게 만들어지나요?

```jsx
const obj = { x: 1 };

console.log(obj.constructor === Object); // true
console.log(obj.__proto__ === Object.prototype); // true
console.log(obj.hasOwnProperty("x")); // true
```

- 객체 리터럴에 의해 생성된 객체는 내부적으로 `Object` 생성자 함수를 사용해서 생성된 객체이다. 🔫

- 리터럴로 선언한 객체는 추상 연산 `OrdinaryObjectCreate`에 의해 생성된다.

  - 추상 연산 `OrdinaryObjectCreate`을 호출하여 빈 객체를 생성하고 프로토타입을 추가한다.
  - 이때 필수적으로 자신이 생성할 객체의 프로토타입을 인수로 전달받는다.
  - 인수로 전달받은 프로토타입을 자신이 생성한 객체의 `[[Prototype]]` 내부 슬롯에 할당한 다음, 생성한 객체를 반환한다.

→ 👾 프로토타입은 추상 연산 `OrdinaryObjectCreate`에 전달되는 인수에 의해 결정된다!

```jsx
obj1 = new Object(123);
console.log(obj1); // Number {123}

obj2 = new Object("abc");
console.log(obj2); // String {'abc'}
```

- 객체 리터럴에 의해 생성된 obj 객체는 `Object.prototype`을 프로토타입으로 갖게 되며, 이로써 `Object.prototype`을 상속받는다.

**Ref(Q1~Q4)** [모던 자바스크립트 Deep Dive](http://www.yes24.com/Product/Goods/92742567)

---

## Q5. 프로토타입 패턴에 대해 설명해주세요.

- 자바스크립트를 이루고 있는 거의 ‘모든 것’은 객체이다.
- 객체: 속성을 통해 여러 개의 값을 하나의 단위로 구성한 복합적인 자료구조
- 프로토타입 객체는 객체 간 상속을 구현하기 위해 사용된다.
  - 원본 객체가 존재하며, 그 객체를 복제해서 새로운 객체를 생성한다.

---

## Q6. 그렇다면, 자바스크립트가 Prototype을 사용하는 이유는 무엇인가요?

- 프로토타입을 기반으로 상속을 구현하여 불필요한 중복을 제거할 수 있다.

- `new` 키워드를 사용하여 객체지향 패턴을 흉내낼 수는 있지만, 실제로 자바스크립트의 상속이나 오브젝트간의 연결은 프로토타입으로 구현한다.

- JavaScript에서는 **함수**를 이용하여 객체를 만든다.

  - 함수가 생성될 때 자동으로 그 함수의 프로토타입 객체도 함께 생성되며, 해당 함수의 prototype 프로퍼티와 연결된다
  - 함수의 프로토타입 객체를 복제하는 것이다.

  ```jsx
  function Person() {}

  const zig = new Person();
  console.log(zig); // Person { __proto__: Object }
  ```

**👾 옛날 이야기!**
Prototype을 이용하면 객체의 생성 비용을 효과적으로 줄일 수 있기 때문이다.

자바스크립트가 처음 도입되던 옛 환경에서는 메모리가 부족했다. 그래서 객체의 생성비용을 효과적으로 줄일 수 있는 프로토타입 디자인 패턴이 도입되었다.

또한, 당시에는 웹 브라우저가 등장한 지 얼마 안됐던 시기였고, HTML과 CSS를 이용해서 웹 사이트를 만드는 것이 굉장히 쉬웠기 때문에 기존에 다른 개발을 경험해보지 않고 웹 개발부터 시작한 사람들이 많았다. 이런 사람들은 메모리 관리나 프로그래밍에 대한 이해가 부족했기 때문에, 그런 사람들이 아무렇게나 짜도 최대한 효율적으로 코딩이 가능하도록 언어를 만드는 게 중요했다. 그래서 크게 신경을 쓰지 않고도 프로토타입을 통해 메모리가 더 효율적으로 관리되는 Prototype을 사용하게 된 것이다.

하지만 지금에 와서는 메모리도 충분하고 객체의 생성 비용을 옛날만큼 신경쓸 필요가 없어졌다!

👾 ES6의 `class` - prototype을 이용한 syntactic sugar!

---

## Q7. `[[Prototype]]` 객체에 접근할 수 있는 방법에는 어떤 것들이 있을까요?

`[[Prototype]]` 내부 슬롯에는 직접 접근이 불가하다.

1. `__proto__` 접근자 프로퍼티를 통해 자신의 프로토타입, 즉 자신의 `[[Prototype]]` 내부 슬롯이 가리키는 프로토타입에 간접적으로 접근할 수 있다.

- `__proto__`는 getter/setter라고 부르는 접근자 함수를 통해 `[[Prototype]]` 내부 슬롯의 값, 즉 프로토타입을 취득하거나 할당한다.
- `__proto__`는 객체가 직접 소유하는 프로퍼티가 아닌 `Object.prototype`의 프로퍼티이다.
- 모든 객체는 상속을 통해 `Object.prototype.__proto__` 접근자 프로퍼티를 사용할 수 있다.

```jsx
const person = { name: "Zig" };

console.log(person.hasOwnProperty("__proto__")); // false
console.log(Object.prototype.hasOwnProperty("__proto__")); // true

console.log(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__"));
// {enumerable: false, configurable: true, get: ƒ, set: ƒ}

console.log(person.__proto__ === Object.prototype); // true
```

2. `Object.getPrototypeOf`

```jsx
const obj = {};
const parent = { x: 1 };

Object.getPrototypeOf(obj); // obj.__proto__;
```

3. `obj.prototype` 프로퍼티를 이용한 접근 (생성자 함수)

---

## Q8. 위와 같이, `[[Prototype]]` 객체에 접근할 수 있는 방법이 다양한 이유는 무엇인가요?

모든 객체가 `__proto__` 접근자 프로퍼티를 사용할 수 있는 것은 아니기 때문이다.
(ex. 직접 상속을 통해 `Object.prototype`을 상속받지 않는 객체를 생성할 경우)

(`Object.create` 메서드는 프로토타입 체인의 종점에 위치하는 객체를 생성)

→ 프로토타입 체인의 종점에 위치하는 객체는 `Object.prototype`의 빌트인 메서드 사용 불가

```jsx
const obj = Object.create(null);
// Object.create(null)로 객체를 만들면 __proto__ getter와 setter를 상속받지 않는다.

console.log(obj.__proto__); // undefined
console.log(Object.getPrototypeOf(obj)); // null
// Object.prototype의 빌트인 메서드는 아래와 같이 간접적으로 호출하는 것이 좋다
console.log(Object.prototype.hasOwnProperty.call(obj, 'a');
```

👾 짚고 넘어가기! - 정적 메서드

```jsx
// Object.create는 정적 메서드
const obj = Object.create({ name: "Zig" });

// Object.prototype.hasOwnProperty는 프로토타입 메서드
obj.hasOwnProperty("name"); // false
```

👾 비하인드 스토리

- 생성자 함수의 `"prototype"` 프로퍼티는 아주 오래전부터 그 기능을 수행하고 있었다.
- 그런데 2012년, 표준에 `Object.create`가 추가되었다. `Object.create`를 사용하면 주어진 프로토타입을 사용해 객체를 만들 수 있긴 하지만, 프로토타입을 얻거나 설정하는것은 불가능했다. 그래서 브라우저는 비표준 접근자인 `__proto__`를 구현해 언제나 프로토타입을 얻거나 설정할 수 있도록 했다.
- 이후 2015년에 `Object.setPrototypeOf`와 `Object.getPrototypeOf`가 표준에 추가되면서 `__proto__`와 동일한 기능을 수행할 수 있게 되었다. 그런데 이 시점엔 `__proto__`가 모든 곳에 구현되어 있어서 사실상 표준(de-facto standard)이 되어버렸다. 표준의 부록 B(Annex B)에 추가되기도 했다. 이 부록에 추가되면 브라우저가 아닌 환경에선 선택사항이라는것을 의미한다.

**Ref** https://ko.javascript.info/prototype-methods#ref-271
