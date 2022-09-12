---
title: 하프 스터디 4주차 - 함수
date: 2021-04-18 08:51:40
tags: havruta
---

with 카일

<!-- more -->

<img src="/images/thumbnails/havruta-thumbnail.jpeg" />

---

## Q1. js 내의 함수는 일급 객체로 다루어진다고 하는데, 일급 객체의 특징에는 무엇이 있을까요?

특정 언어의 ‘일급 객체’란 보통 다른 객체들에게 적용 가능한 연산을 모두 지원하는 객체를 말한다.

👾 **JavaScript**가 일급 객체인 이유

1. 함수 할당하기

- 변수에 할당하기

  ```jsx
  const func1 = function () {};
  ```

- 객체의 값에 할당하기

  ```jsx
  const student = {
    name: "zig",
    grade: 5,
    study: function () {
      console.log(`${this.name} is studying`);
    },
  };
  ```

- 함수를 호출하지 않고 변수에 할당하기

  ```jsx
  const add = function (a, b) {
    return a + b;
  };

  const newAdd = add;
  newAdd(2, 3); // 5
  ```

1. 함수를 다른 함수의 인자로 전달하기

   ```jsx
   const test = function (func) {
     func(); // 파라미터로 받은 함수 호출
   };

   // test() 함수에 다른 함수를 파라미터로 넣어 호출
   test(function () {
     console.log("javascript");
   });
   ```

2. 함수 반환하기 (→ 클로저)

   ```jsx
   function add(a) {
     return function (b) {
       return a + b;
     };
   }

   const add5 = add(5);
   add5(5); // 10
   ```

이름이 있는 함수를 리턴하는 것도 가능하다. 재귀함수 등 자기 자신을 참조하는 경우에는 이름이 있는 것이 편리하다.

여기에

```
- 런타임(runtime) 생성이 가능하다 // new Function()으로 생성 시 (bad case)
- 익명(anonymous)으로 생성이 가능하다
```

위 조건들까지 붙은 것이 ‘일급 함수(=일급 객체)’라고 보는 의견도 존재한다.

**Ref**
https://soeunlee.medium.com/javascript에서-왜-함수가-1급-객체일까요-cc6bd2a9ecac
https://frontsom.tistory.com/3

---

## Q2. 클래스의 필드 문법으로 메서드를 선언할 때, regular function 과 arrow function 중 무엇을 선호하는지, 또 그 이유를 들어볼 수 있을까요?

class의 constructor에 정의된 값들은 class의 인스턴스를 생성해도, prototype chaining을 통해서 참조된다.
아래와 같이 class를 작성한 후, class의 인스턴스를 생성하여 콘솔에서 확인이 가능하다.

```jsx
class MyClass {
  a = 1; // 인스턴스 객체의 프로퍼티
  func1 = () => {}; // 인스턴스 객체의 메소드
  func2() {} // 프로토타입 객체의 메소드
}

const test = new MyClass();
```

<img src="01.png" width="400px" />

react class의 constructor에 선언한 메소드의 경우 모두 class 인스턴스에 매핑된다.

```jsx
class MyClass {
  constructor() {
    this.a = 1; // 인스턴스마다 생성
    this.method1 = () => {}; // 인스턴스마다 생성
  }

  method2() {} // MyClass의 prototype에 생성 (인스턴스에서 호출 시 prototype chaining을 타고 올라가 참조)

  method3 = () => {}; // 인스턴스마다 생성
}

const test = new MyClass();
```

<img src="02.png" width="440px" />

이때 `method3()`과 같은 선언 방식은 아래와 같은 문제들이 뒤따른다.

1. 인스턴스마다 호출되기 때문에, 성능 저하의 문제가 있다.
2. constructor에서 `super()`를 통한 상속이 불가하다.
3. 인스턴스의 메서드로만 호출되기 때문에 자식 class로 상속되지 않는다.

**Ref**

- https://levelup.gitconnected.com/arrow-function-vs-regular-function-in-javascript-b6337fb87032
- https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/

---

## Q3. IIFE 는 무엇이고, 어떤 경우에 사용하면 좋을까요?

JavaScript의 즉시실행함수는 정의와 동시에 즉시 실행되는 함수를 의미한다.
함수 리터럴 표현식을 통해 즉시 실행함수를 정의할 수 있다. 즉시실행함수는 함수 리터럴을 `()`로 감싼 뒤 바로 실행한다.

✅ `()`로 묶는 이유: 함수 선언문이 아닌 표현식임을 명확히 하기 위해

```jsx
(function () {
  console.log("Hello World");
})();
// Hello World
```

IIFE를 변수에 할당하면 IIFE 자체는 저장되지 않고, 함수가 실행된 결과만 저장된다. (출처 - MDN)

```jsx
const result = (function () {
  const name = "Zig";

  return name;
})();
// 즉시 결과를 생성한다.
result; // "Zig"
```

**👾 사용 예시**
전역 스코프를 오염시키지 않기 위해 즉시실행함수를 사용할 수 있다. 함수를 리턴하는 클로저와 함께 private 변수를 생성하여, 해당 변수를 외부에 노출시키지 않을 수 있다. 특정 데이터를 은닉시키는 것이다.

외부 코드에서 사용되지 않는, 단 한번 호출하는 코드에서도 유용하게 사용할 수 있다.

```jsx
// 전체에서 단 한번 실행할 코드
function init() {
  const operate = "init";
  console.log(operate);
}

init();

// 즉시실행함수로 아래처럼 사용
(function init() {
  const operate = "init";
  console.log(operate);
})();
const uniqueId = (function () {
  let count = 0;
  return function () {
    return ++count;
  };
})();

console.log(uniqueId()); // 1
console.log(uniqueId()); // 2
```

**Ref**

- https://velog.io/@doondoony/javascript-iife
- https://medium.com/sjk5766/iife-immediately-invoked-function-expression-정리-53ab6543b828

---

## Q4. 함수 표현식은 왜 사용하나요?

```jsx
const square = function (number) {
  return number * number;
};
const x = square(4); // x = 16
```

🤔 함수를 문으로 선언해도 똑같이 작동하는데(아래 예시), 함수 표현식을 쓰는 이유는 무엇일까요?

```jsx
const multiply1 = function (num) {
  return num * 2;
};

function multiply2(num) {
  return num * 2;
}

function calculate(f, arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result[i] = f(arr[i]);
  }
  return result;
}

console.log(calculate(multiply1, [1, 2, 3])); // [2,4,6]
console.log(calculate(multiply2, [1, 2, 3])); // [2,4,6]
```

- 화살표함수를 쓰는 표현식은 `function` 키워드를 생략한다는 점이 장점일 수 있다.
- 인자 값을 보낼 때 ‘문’보다는 ‘식’으로 보내는 게 의미론적으로 자연스럽다.
- **hoisting** 가능 여부 (위에서부터 읽어내려가는 코딩 스타일)

---

## Q5. JavaScript에서 함수의 호이스팅은 어떻게 이루어지나요? (함수의 호출 범위)

👾 **호이스팅**이란?
함수 안에 있는 선언들을 모두 끌어올려서 해당 함수 유효 범위의 최상단에 선언하는 것이다.

함수의 범위는 함수가 선언된 곳이거나, 전체 프로그램 에서의 최상위 레벨(전역)에 선언된 곳이다. 함수 호이스팅은 오직 **함수 선언**과 함께 작동하고, **함수 표현식**에서는 동작하지 않는다.

함수선언문은 코드를 구현한 위치와 관계없이 자바스크립트의 특징인 호이스팅에 따라 브라우저가 자바스크립트를 해석할 때 맨 위로 끌어 올려진다

regular function을 사용하면 호출 시점에 따른 문제가 발생하지 않는다.

```jsx
// regular function - working
function higher() {
  lower();
}

higher(); // 정상 작동

function lower() {
  // ...
}

// arrow function - not working
const higher2 = () => {
  lower2();
};

higher2(); // ReferenceError: Cannot access 'lower2' before initialization

const lower2 = () => {};
```

그러나 함수표현식에서는 선언과 할당의 분리가 이루어지기 때문에, 호이스팅이 이루어지지 않는다. 표현식은 ‘변수 키워드 호이스팅’에 해당되기 때문이다.

컴파일 단계에서 선언과 초기화가 모두 이루어지는 기존의 `var` 키워드와 달리, ES6 문법인 `let`, `const`로 선언한 변수는 코드 실행 전 컴파일 단계에서 선언만 이루어진다. 메모리 자체에 등록되지 않는 것이다. 따라서 `var` 키워드로 선언한 함수표현식은 `TypeError`와 함께 호이스팅이 실패하고, `let` 또는 `const` 키워드로 선언한 함수표현식은 `RefError`와 함께 호이스팅이 실패한다.

```jsx
const higher2 = () => {
  lower2(); // TypeError
  lower3(); // RefError
};

higher2(); // 호출

var lower2 = () => {}; // 할당
let lower3 = () => {}; // 초기화 & 할당
```

---

## Q6. Array 내장 메소드(map, filter 등)가 내부적으로는 고차함수를 사용한다고 하는데, 그 작동 원리가 궁금합니다!

함수를 리턴하는 것 뿐 아니라, 함수를 인자로 받는 것도 고차함수의 특징에 해당한다. `map`, `filter` 등의 인자값은 모두 콜백함수이므로, 함수를 인자로 받는 고차함수에 해당한다.

```jsx
Array.prototype.customMap = function (fn) {
  const newArr = [];
  for (let i = 0; i < this.length; i++) {
    newArr.push(fn(this[i]));
  }
  return newArr;
};

const multiple = [1, 2, 3].customMap((num) => num * 2);
console.log(multiple); // [2,4,6]
```

**Ref**

- https://poiemaweb.com/js-array-higher-order-function
- https://velog.io/@jakeseo_me/자바스크립트-개발자라면-알아야-할-33가지-개념-22-자바스크립트-자바스크립트-고차-함수Higher-Order-Function-이해하기
