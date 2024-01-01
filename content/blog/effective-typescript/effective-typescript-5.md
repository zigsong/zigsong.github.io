---
title: 이펙티브 타입스크립트 5장
date: 2021-12-29 09:43:09
tags: ["effective-typescript"]

---

any 다루기

<!-- more -->

---

## 아이템 38: any 타입은 가능한 한 좁은 범위에서만 사용하기

- 두 가지 any 작성 방식

  ```tsx
  function f1() {
    const x: any = expressionReturningFoo(); // 이렇게 하지 말자
    processBar(x);
  }

  function f2() {
    const x = expressionReturningFoo(); // 이게 낫다
    processBar(x as any);
  }
  ```

  - `any` 타입이 `processBar` 함수의 매개변수에만 사용된 표현식이므로 다른 코드에는 영향을 미치지 않기 때문이다

- 타입스크립트가 함수의 반환 타입을 추론할 수 있는 경우에도 함수의 반환 타입을 명시하는 것이 좋다

- 강제로 타입 오류 제거 시 `any` 대신 `@ts-ignore` 사용하기

  ```tsx
  function f1() {
    const x = expressionReturningFoo();
    // @ts-ignore
    processBar(x);
    return x;
  }
  ```

  → 근본적인 문제 해결은 아니다

- 객체와 관련한 `any`의 사용법

  ```tsx
  const config: Config = {
    a: 1,
    b: 2,
    c: {
      key: value,
    },
  } as any; // 이렇게 하지 말자
  ```

  → 모든 속성이 타입 체크가 되지 않는 부작용 발생

  ```tsx
  const config: Config = {
    a: 1,
    b: 2, // 이 속성은 여전히 체크된다
    c: {
      key: value as any,
    },
  };
  ```

---

## 아이템 39: any를 구체적으로 변형해서 사용하기

- 일반적인 상황에서는 `any`보다 더 구체적으로 표현할 수 있는 타입이 존재할 가능성이 높다

  ```tsx
  function getLengthBad(array: any) {
    // 이렇게 하지 말자
    return array.length;
  }

  function getLength(array: any[]) {
    return array.length;
  }
  ```

- 함수의 매개변수로 객체 사용 시 타입 구체화하기

  ```tsx
  function hasTwelveLetterKey(o: { [key: string]: any }) {
    for (const key in o) {
      if (key.length === 12) {
        return true;
      }
    }
    return false;
  }
  ```

- 함수의 타입 구체화하기

  ```tsx
  type Fn0 = () => any; // 매개변수 없이 호출 가능한 모든 함수
  type Fn1 = (arg: any) => any; // 매개변수 1개
  type FnN = (...args: any[]) => any; // 모든 개수의 매개변수 ("Function" 타입과 동일)
  ```

---

## 아이템 40: 함수 안으로 타입 단언문 감추기

- 함수 내부에는 타입 단언을 사용하고 함수 외부로 드러나는 타입 정의를 정확히 명시하는 것이 좋다

- 어떤 함수든 캐싱할 수 있는 래퍼 함수 `cacheLast`

  ```tsx
  declare function cacheLast<T extends Function>(fn: T): T;

  declare function shallowEqual(a: any, b: any): boolean;
  function cacheLast<T extends Function>(fn: T): T {
    let lastArgs: any[] | null = null;
    let lastResult: any;

    return function (...args: any[]) {
      // 🚨 '(...args: any[]) => any' 형식은 'T' 형식에 할당할 수 없습니다
      if (!lastArgs || !shallowEqual(lastArgs, args)) {
        lastResult = fn(...args);
        lastArgs = args;
      }
      return lastResult;
    };
  }
  ```

  → 타입스크립트는 반환문에 있는 함수와 원본 함수 `T` 타입이 어떤 관련이 있는지 알지 못하기 때문에 오류 발생

- 단언문을 추가해서 오류를 제거

  ```tsx
  function cacheLast<T extends Function>(fn: T): T {
    let lastArgs: any[] | null = null;
    let lastResult: any;

    return function (...args: any[]) {
      if (!lastArgs || !shallowEqual(lastArgs, args)) {
        lastResult = fn(...args);
        lastArgs = args;
      }
      return lastResult;
    } as unknown as T;
  }
  ```

- 객체를 매개변수로 하는 `shallowObjectEqual`

  ```tsx
  declare function shallowObjectEqual<T extends object>(a: T, b: T): boolean;

  function shallowObjectEqual<T extends object>(a: T, b: T): boolean {
    for (const [(k, aVal)] of Object.entries(a)) {
      if (!(k in b) || aVal !== (b as any)[k]) {
        // b[k] 구문에 타입 단언 필요
        return false;
      }
    }
    return Object.keys(a).length === Object.keys(b).length;
  }
  ```

---

## 아이템 41: any의 진화를 이해하기

- 예제

  ```tsx
  function range(start: number, limit: number) {
    const out = []; // 타입이 any[]
    for (let i = start; i < limit; i++) {
      out.push(i); // out의 타입이 any[]
    }
    return out; // 타입이 number[]
  }
  ```

  - out의 타입은 `any[]`로 선언되었지만 `number` 타입의 값을 넣는 순간부터 타입은 `number[]`로 진화한다

- 타입의 진화

  - 배열에 다양한 타입의 요소를 넣으면 배열의 타입이 확장되며 진화한다

    ```tsx
    const result = []; // 타입이 any[]
    result.push("a");
    result; // 타입이 string[]
    result.push(1);
    result; // 타입이 (string | number)[]
    ```

- 기타

  - 조건문에서는 분기에 따라 타입이 변화한다
  - 변수의 초깃값이 null인 경우도 any의 진화가 발생한다

- any 타입의 진화는 `noImplicitAny`가 설정된 상태에서 변수의 타입이 암시적 any인 경우에만 발생한며, 명시적 any 선언 시 타입이 그대로 유지된다

- any 타입의 진화는 암시적 any 타입에 어떤 값을 할당할 때만 발생하며, 암시적 any 타입은 함수 호출을 거쳐도 진화하지 않는다.

- 타입을 안전하게 지키기 위해서는 암시적 any를 진화시키는 방식보다 명시적 타입 구문을 사용하는 것이 좋다

---

## 아이템 42: 모르는 타입의 값에는 any 대신 unknown을 사용하기

- 함수의 반환값에 `unknown` 사용하기

  ```tsx
  function parseYAML(yaml: string): any {
    // ...
  }

  function safeParseYAML(yaml: string): unknown {
    return parseYAML(yaml);
  }

  const book = safeParseYAML(`
    name: Villette
    author: Charlotte Bronte
  `) as Book;

  alert(book.title); // 🚨 'Book' 형식에 'title' 속성이 없습니다
  book("read"); // 🚨 이 식은 호출할 수 없습니다
  ```

- `any`가 강력하면서도 위험한 이유

  - 어떠한 타입이든 `any` 타입에 할당 가능하다

    - 어떠한 타입이든 `unknown` 타입에 할당 가능하다
    - 어떠한 타입도 `never`에 할당할 수 없다

  - `any` 타입은 어떠한 타입으로도 할당 가능하다

    - `unknown`은 오직 `unknown`과 `any`에만 할당 가능하다
    - `never` 타입은 어떠한 타입으로도 할당 가능하다

  → 타입 시스템과 상충된다

- `instanceof` 체크 후 `unknown`에서 원하는 타입으로 변환하기

  ```tsx
  function processValue(val: unknown) {
    if (val instanceof Date) {
      val; // 타입이 Date
    }
  }
  ```

- 사용자 정의 타입 가드로 `unknown`에서 원하는 타입으로 변환하기

  ```tsx
  function isBook(val: unknown): val is Book {
    return (
      typeof val === "object" &&
      val !== null &&
      "name" in val &&
      "author" in val
    );
  }

  function processValue(val: unknown) {
    if (isBook(val)) {
      val; // 타입이 Book
    }
  }
  ```

- `unknown` 대신 제네릭 매개변수 사용하기

  ```tsx
  function safeParseYAML<T>(yaml: string): T {
    return parseYAML(yaml);
  }
  ```

  → 타입 단언문과 똑같다! → 제네릭보다는 `unknown`을 반환하고 사용자가 직접 단언문을 사용하거나 원하는 대로 타입을 좁히도록 강제하는 것이 좋다

- 단언문

  ```tsx
  declare const foo: Foo;
  let barAny = foo as any as Bar;
  let barUnk = foo as unknown as Bar;
  ```

  - `unknown`의 경우 분리되는 즉시 오류를 발생하므로 `any`보다 안전하다(에러가 전파되지 않는다)

- 정말 `null`과 `undefined`가 불가능하다면 `unknown` 대신 `{}` 사용하기

---

## 아이템 43: 몽키 패치보다는 안전한 타입을 사용하기

- 자바스크립트에서는 객체나 클래스에 임의의 속성을 추가할 수 있다

  ```tsx
  window.monkey = "Tamarin";
  document.monkey = "Howler";
  ```

  - 일반적으로 좋은 설계는 아니다 (전역 변수 사이드 이펙트의 문제)

  - 타입스크립트에서는 에러

    ```tsx
    document.monkey = "Tamarin";
    // 'Document' 유형에 'monkey' 속성이 없습니다
    ```

  - 해결 방법

    ```tsx
    (document as any).monkey = "Tamarin"; // 정상
    ```

    → 👎 타입 안정성을 해치는 안 좋은 코드

- 차선책 1. `interface` 의 보강(augmentation)

  ```tsx
  interface Document {
    monkey: string;
  }

  document.monkey = "Tamarin"; // 정상
  ```

  - 모듈의 관점에서라면 `global` 선언 추가

    ```tsx
    export {};
    declare global {
      interface Document {
        monkey: string;
      }
    }

    document.monkey = "Tamarin"; // 정상
    ```

  - 보강은 전역적으로 적용되기 때문에, 코드의 다른 부분이나 라이브러리로부터 분리할 수 없다

- 차선책 2. 더 구체적인 타입 단언문 사용

  ```tsx
  interface MonkeyDocument extends Document {
    monkey: string;
  }

  (document as MonkeyDocument).monkey = "Macaque"; // 정상
  ```

---

## 아이템 44: 타입 커버리지를 추적하여 타입 안전성 유지하기

- `any` 타입이 여전히 프로그램 내에 존재할 수 있는 두 가지 경우

  - 명시적 `any` 타입

    - ex) `any[]`, `{[key: string]: any}`

  - 서드파티 타입 선언

    - `@types` 선언 파일로부터 `any` 타입이 전파되는 경우

    - 가장 극단적인 예 - 전체 모듈에 `any` 타입을 부여하는 경우

      ```tsx
      declare module "my-module";
      ```

      → `my-module`에서 어떤 것이든 오류 없이 임포트할 수 있다

    - 타입에 버그가 있는 경우

      - 선언된 타입과 실제 반환된 타입이 맞지 않는 경우

- npm의 type-coverage 패키지 활용하여 `any` 추적하기
