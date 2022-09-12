---
title: 하프 스터디 5주차 - 변수와 데이터타입
date: 2021-04-25 08:40:34
tags: havruta
---

with 곤이

<!-- more -->

<img src="/images/thumbnails/havruta-thumbnail.jpeg" />

---

## Q1. 원시 값과 객체가 메모리에 할당되는 과정을 이야기해봐요

> **선언**: 메모리에서 비어있는 공간을 확보하고 그 공간의 이름을 설정하는 것
> **할당**: 데이터를 저장하기 위한 별도의 메모리 공간을 다시 확보해서 데이터를 저장하고 그 주소를 변수 영역에 저장하는 것

> **원시 타입**: Boolean, Null, Undefined, Number, String, Symbol → 기본형
> **참조 타입**: 배열, 함수, Date, 정규표현식, Map, WeakMap, Set, WeekSet 등 → 참조형

참조형 데이터와 기본형 데이터의 변수 할당 과정의 차이는, 참조형 데이터는 객체의 변수(프로퍼티) 영역이 별도로 존재한다는 것이다. 이때 객체 변수 영역에 값들의 주소값을 가지고 있는 것이 아니라, 프로퍼티들을 저장하기 위해 별도로 마련한 영역의 주소를 가지고 있다.

원시 타입은 변수 값의 메모리 주소를 참조하는 식별자들이 여러 개 있을 수 있기 때문에, 해당 메모리 주소의 데이터가 변경되면 사이드 이펙트가 발생할 수 있다. 따라서 값이 변하지 않는다. (불변성)

원시타입의 경우 새로 만드는 동작에 의해서만 값이 변한다.

```jsx
let a = 10;
let b = 10;

console.log(a === b); // true - 같은 식별자값을 참조한다.
b = 15; // 15라는 값을 새로운 주소에 할당해서 참조하기 때문에 a의 값은 영향 받지 않는다

console.log(a); // 10 - 값이 바뀌지 않는다.
console.log(b); // 15
```

할당된 값이 같다면 같은 메모리 영역을 참조하는 원시타입과 달리,
객체를 생성할 때는 항상 새로운 주소값으로 할당된다.

```jsx
const obj1 = { a: 1 };
const obj2 = { a: 1 };

obj1 === obj2; // false
```

객체는 동적으로 내부 값이 변경될 수 있으며, 이때 내부 값 참조하는 데이터 영역의 값 자체가 바뀌게 된다. 새로운 객체가 만들어지는 것이 아니라 기존 객체 내부의 값만 바뀌는 것이다.

```jsx
const obj1 = {
  a: 1,
  b: "bb",
};

const obj2 = obj1;

obj2.a = 2; // obj1.a가 참조하는 메모리 영역의 주소와 obj2.a가 참조하는 메모리 영역의 주소는 같다.
console.log(obj1.a); // 2
```

**Ref**

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Memory_Management
- https://velog.io/@yujuck/JavaScript-데이터-타입-데이터-할당의-동작원리

---

## Q2. 자바스크립트의 콜스택과 힙에는 각각 어떤 것들이 저장될까요? 그리고 자바스크립트는 왜 힙이라는 별도의 메모리 공간을 가질까요?

**콜스택**

- JavaScript에서 함수를 실행하면 콜스택에 쌓인다.
- 콜스택은 메모리에서 Last-In-First-Out으로 동작하는 영역이다.
- 실행 중인 코드를 트래킹하는 곳으로, 메모리 힙에서 작업 수행에 필요한 것들을 찾아서 작업을 수행한다.
- 콜스택의 각 단계를 Stack Frame이라고 하며, 콘솔에서 확인이 가능하다 (Stack Trace)

**메모리 힙**

- 정보를 저장하는 공간 (메모리 할당이 발생하는 공간)
- 간단한 변수들(원시값)은 스택에 저장될 수 있지만, 배열이나 객체 등 복잡한 자료구조의 경우 메모리 힙에 저장된다.
- 동적으로 메모리를 할당할 때 사용한다. (원시값은 타입에 따라 정해진 크기만큼 메모리를 확보하여 저장)
- 변수, 함수의 저장, 호출 등의 작업이 발생하는 공간
  - tilde(`~`) 로 표시되는 객체의 프로퍼티 데이터 주소값은 힙에 저장된다.
  - 객체의 프로퍼티들이 참조하는 원시값은 다시 콜스택에서 참조 가능하다.

**🤔 메모리 힙은 왜 필요할까?**

- 긴 생명주기를 가지는 데이터들을 저장할 수 있다. (크기가 크고, 서로 다른 코드블럭들에서 공유되는 객체들의 경우)
- 런타임 시 메모리의 크기를 동적으로 결정할 수 있다.

**👾 메모리 누수**

- 메모리 힙이 제대로 관리되지 않을 경우 메모리 공간의 범위를 넘어서 정보들이 저장되는 경우가 발생
- 전역변수가 많을 경우/ 이벤트리스너를제거하지 않은 경우/ setInterval을 계속 사용하는 경우 등

**Ref**
https://medium.com/@allansendagi/javascript-fundamentals-call-stack-and-memory-heap-401eb8713204
https://soldonii.tistory.com/53

---

## Q3. 자바스크립트에서 호이스팅은 왜 일어나는 걸까요?

> **호이스팅**: 함수(스코프) 안에 있는 선언들을 모두 끌어올려서 해당 함수(스코프) 유효 범위의 최상단에 선언하는 것

- JavaScript 함수는 실행 전 함수 안에 필요한 변수값을 모두 모아 유효 범위의 최상단에 선언한다
- JavaScript Parser가 함수 실행 전 해당 함수를 한번 훑어, 함수 안에 존재하는 변수/함수 선언 정보를 기억하고 있다가 필요 시 실행시킨다
- 실제 메모리에는 변화가 없으며, JavaScript Parser 내부적으로 끌어올려 처리한다.
- 유효 범위는 함수 블록 `{}` 내부

**🤔 왜 발생할까?**
JavaScript 인터프리터가 소스코드의 실행을 2단계로 나누어 실행하기 때문이다.

1. 변수와 함수 선언문들을 찾아 실행 컨텍스트의 렉시컬 환경에 등록한다.
   (이때 아래쪽에 선언된 변수가 끌어올려진다.)
2. 실제 소스코드를 첫줄부터 차례로 실행하며 값을 할당하고 참조한다.

**Ref**

- https://gmlwjd9405.github.io/2019/04/22/javascript-hoisting.html
- https://stackoverflow.com/questions/15005098/why-does-javascript-hoist-variables

---

## Q4. var, let, const의 호이스팅은 어떠한 차이가 있을까요? 그리고 TDZ는 무엇일까요?

`var`에서만 호이스팅이 일어나며, `let`/`const`에서는 호이스팅이 발생하지 않는다.

```jsx
console.log(name1); // undefined
console.log(name2); // ReferenceError

var name1; // 선언, 초기화 (기본값 undefined)
let name2; // 선언
```

이때 선언만 호이스팅되며, 할당은 호이스팅되지 않는다.
최초 선언 시 초기화한 경우에도 선언과 할당으로 분리하여 호이스팅한다.

```jsx
// 선언부만 호이스팅되기 때문에, 초기값은 undefined이다.
console.log(name1); // undefined

var name1 = "zig";
console.log(name1); // zig
```

위 코드는 아래와 같이 실행된다.

```jsx
var name1; // 변수 선언부만 끌어올려짐
console.log(name1); // undefined

var name1 = "zig";
console.log(name1); // zig
```

**TDZ (Temporal Dead Zone; 일시적 사각지대)**

- 초기화되지 않은 변수가 있는 곳이다.

- `let`, `const`도 호이스팅되지만, TDZ에 영향을 받아 `ReferenceError`가 발생한다.

  - 변수가 초기화되는 순간 TDZ에서 빠져나온다.

다음은 TDZ에 갇힌 변수를 참조하려고 하는 상황이다.

```jsx
let name1;
{
  // name1이 TDZ에 영향을 받는다.
  console.log(name1); // 코드블럭 내의 lexical scope에서 가장 가까운 name1를 참조 한다.
  let name1 = "zag"; // name1이 초기화되어 TDZ를 탈출한다.
}
// ReferenceError: Cannot access 'name1' before initialization
```

아래 경우는 어떨까?

```jsx
let name2;
{
  console.log(name2); // undefined
  name2 = "zig";
}
```

콘솔을 찍는 시점에서 `name2`는 코드블럭 내부가 아닌 전역 스코프의 `name2`를 참조하기 때문에,
아직 값이 할당되지 않은 상태의 `name2`(`undefined`)가 찍힌다.

한번 이것저것 테스트!

```jsx
let name3;
{
  name3 = "kim";
  console.log(name3); // kim
  name3 = "zig";
}

console.log(name3); // zig
```

명시적으로 선언한 블록(`{}`)이 아닌 전역에 변수를 등록하면,
initialization(초기화) 에러가 아닌 not defined(선언) 에러가 발생한다.

```jsx
console.log(name4);
let name4;
// ReferenceError: name4 is not defined
```

**Ref**

- https://velog.io/@wrfg12/ES6-Hoisting-Temporal-Dead-ZoneTDZ
- https://velog.io/@open_h/Hoisting-and-TDZ

---

## Q5-1. `var`, `let`, `const` 각각의 스코프는 어떻게 정의되나요?

**var**

- 함수 레벨 스코프 (함수의 코드 블록만을 스코프로 인정)
- 전역 함수 외부에서 생성한 변수는 모두 전역 변수 (전역 변수를 남발할 가능성)
- for문의 변수 선언문에서 선언한 변수를 for문의 코드블록 외부에서 참조 가능

**let**

- 블록 레벨 스코프 (대부분의 프로그래밍 언어도 마찬가지)
- 모든 코드 블록 (함수, if문, for문, while문, try/catch문 등) 내에서 선언한 변수는 코드블록 내에서만 유효하며 코드블록 외부에서는 참조할 수 없다. 즉 코드블록 내부에서 선언한 변수는 지역 변수이다.

**👾 var를 지양해야 하는 이유**

```jsx
// 어떻게 될까요?
for (let i = 0; i < 5; i++) {
  console.log(i);
}
console.log(i);

// 어떻게 될까요?
for (var i = 0; i < 5; i++) {
  console.log(i);
}
console.log(i);
```

**Ref**

- https://poiemaweb.com/es6-block-scope
- https://soldonii.tistory.com/63?category=862198
- https://discuss.codecademy.com/t/whats-wrong-with-var/224975/5

---

## Q5-2. `var`, `let`, `const` 각 경우 변수는 언제 메모리에 할당되나요?

변수선언은 소스코드가 순차적으로 실행되는 시점인 런타임 이전에 먼저 실행되지만, 값의 할당은 소스코드가 순차적으로 실행되는 시점인 런타임에 실행된다.

변수 선언의 과정은 3단계로 이루어진다

1. **선언:** 변수 객체에 변수를 등록. 이 변수 객체는 스코프가 참조할 수 있는 대상이 된다.
2. **초기화:** 변수 객체에 등록된 변수를 메모리에 할당한다. 이때 변수는 undefined로 초기화된다.
3. **할당:** undefined로 초기화된 변수에 실제값을 할당한다.

**var** 선언 단계와 초기화(undefined를 할당) 단계가 한번에 이루어진다

- 스코프 체인이 가리키는 변수 객체에 변수가 등록되고 변수는 undefined로 초기화된다.

**let, const** 선언, 초기화 단계가 분리

- 스코프에 변수를 등록(선언)하지만 초기화는 변수 선언문에 도달했을 때 이루어진다.
- 초기화 이전에 변수에 접근하려고 하면 변수가 아직 초기화되지 않았기 때문에 Reference Error가 발생한다.
- 스코프의 시작 지점부터 초기화 시작 지점까지의 구간을 **TDZ**라고 한다.

**Ref**

- https://poiemaweb.com/es6-block-scope
- https://poiemaweb.com/js-execution-context

---

## Q6. 원시 타입과 참조 타입이 복사되는 방식을 설명해주세요

> **원시 타입(기본형)**: 값이 담긴 주소값을 바로 복제한다.
> **참조 타입**: 값이 담긴 주소값들로 이루어진 묶음을 가리키는 주소값을 복제한다.

어떤 데이터 타입이든 변수에 할당하기 위해서는 주소값을 복사해야 하기 때문에, 엄밀히 따지면 JavaScript의 모든 데이터 타입은 참조형 데이터일 수밖에 없다. 이때 기본형은 주소값을 복사하는 과정이 한번만 이루어지고, 참조형은 한 단계를 더 거친다.

```jsx
// a, b 모두 같은 데이터 영역의 주소값을 참조한다
let a = 10;
let b = a;

// obj1, obj2 모두 같은 데이터 영역의 주소값을 참조한다
let obj1 = { c: 10, d: "zig" };
let obj2 = obj1;
```

데이터 변경 시 기본형은 데이터 영역에서 참조하는 주소값이 달라져 원본에 영향을 주지 않지만,
객체의 경우 객체 자체가 가리키는 값이 달라지지 않으며, 내부 프로퍼티의 값이 가리키는 주소가 변경되어 원본 객체의 프로퍼티가 참조하는 값도 함께 바뀐다.

```jsx
let a = 10;
let b = a;

let obj1 = { c: 10, d: "zig" };
let obj2 = obj1;

// 데이터 영역에서 참조하는 주소값이 달라진다
b = 15;
// 데이터 영역에서 참조하는 주소값이 달라지지 않으며,
// 새로운 값(20)을 c 프로퍼티가 저장되어 있는 위치에 다시 저장한다
obj2.c = 20;

console.log(a); // 10
console.log(b); // 15
console.log(obj1); // { c: 20, d: 'zig' }
console.log(obj2); // { c: 20, d: 'zig' }
```

아예 새로운 객체로 대체할 경우 데이터 영역에서 참조하는 주소값이 달라진다.

```jsx
let obj1 = { c: 10, d: "zig" };
let obj2 = obj1;

obj2 = { c: 20, d: "zag" };

console.log(obj1); // { c: 10, d: 'zig' }
console.log(obj2); // { c: 20, d: 'zag' }
```

**Ref** https://velog.io/@yujuck/JavaScript-데이터-타입-데이터-할당의-동작원리#변수-복사

---

## Q7. 다음의 두 코드는 어떤 차이가 있나요?

```jsx
// 1번
const str1 = "abc";

// 2번
const str2 = new String("abc");
```

> **원시 래퍼 객체**: String, Number, Boolean, Symbol

원시 래퍼 객체는 원시값을 감싸 객체화시켜주기 위해 사용된다.

아래 예제는, String 타입의 메소드 `toUpperCase`의 호출을 위해 string 자료형을 래퍼 객체로 임시 변환한다.

```jsx
"zig".toUpperCase(); // ZIG
```

래퍼 객체의 `valueOf()` 메서드는 원시값을 반환한다.

```jsx
const str = new String("zig");
str.valueOf(); // zig
```

JavaScript는 String 오브젝트와 원형의 문자열을 다르게 취급한다.

```jsx
new String("zig") === new String("zig"); // false
new String("zig") == new String("zig"); // false

"zig" == "zig"; // true
"zig" === "zig"; // true
typeof new String("zig"); // 'object';
new String("zig") instanceof String; // true

typeof "zig"; // 'string';
"zig" instanceof String; // false

new String("zig") == "zig"; // true
new String("zig") === "zig"; // false
```

**Ref**

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String#문자열_원형과_string_객체의_차이
- https://includestdio.tistory.com/26

## Q8. `null`과 `undefined`에는 어떤 차이가 있나요?

**null**

- 명시적으로 값이 비어있음을 나타낸다.
- null의 type은 `object`이다.

```jsx
console.log(typeof null); // object

// 😮 왜일까?
let a = null;
a.__proto__; // Uncaught TypeError: Cannot read property '__proto__' of null
```

**undefined**
데이터 타입이자 값으로 평가된다.

```jsx
console.log(typeof undefined); // undefined
```

값이 할당되지 않은 변수의 기본값으로 사용된다.

```jsx
let something;
console.log(something); //undefined
```

😮 이건 뭘까?

```jsx
undefined = 'zig'; // 'zig'
null = 'zig'; // Ref Error

let undefined = 1;
// Uncaught SyntaxError: Identifier 'undefined' has already been declared
```
