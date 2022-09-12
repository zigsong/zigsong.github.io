---
title: 이펙티브 타입스크립트 8장
date: 2022-01-20 23:56:59
tags: effective-typescript
---

타입스크립트로 마이그레이션하기

<!-- more -->

<img src="/images/thumbnails/typescript-thumbnail.jpeg" />

---

## 아이템 58: 모던 자바스크립트로 작성하기

- 타입스크립트의 컴파일러를 자바스크립트의 ‘트랜스파일러’로 사용

  - 타입스크립트는 자바스크립트의 상위집합이므로 타입스크립트를 자바스크립트로 컴파일할 수 있다

- ECMAScript 모듈 사용하기

  - ES2015에 등장한 `import`와 `export` 를 사용하는 모듈이 표준이 되었다

- 프로토타입 대신 클래스 사용하기

  ```tsx
  class Person {
    first: string;
    last: string;

    constructor(first: string, last: string) {
      this.first = first;
      this.last = last;
    }

    getName() {
      return this.first + " " + this.last;
    }
  }

  const marie = new Person("Marie", "Curie");
  const personName = marie.getName();
  ```

- `var` 대신 `let` / `const` 사용하기

  - 스코프 문제 피하기
  - 함수 선언문 대신 함수 표현식을 사용하여 호이스팅 문제 피하기

- `for(;;)` 대신 `for-of` 또는 배열 메서드 사용하기

  - `for-of` 루프는 코드가 짧고 인덱스 변수를 사용하지 않아 실수를 줄일 수 있다
  - 인덱스 변수가 필요한 경우엔 `forEach` 메서드 사용 권장

- 함수 표현식보다 화살표 함수 사용하기

  - 상위 스코프의 `this`를 유지할 수 있다
  - 코드를 더 직관적이고 간결하게 작성할 수 있다

- 단축 객체 표현과 구조 분해 할당 사용하기

  - 변수와 객체 속성의 이름이 같은 경우

    ```tsx
    const x = 1,
      y = 2,
      z = 3;
    const pt = { x, y, z };
    ```

  - 객체 속성 중 함수를 축약해서 표현하는 방법

    ```tsx
    const obj = {
      onClickLong: function (e) {
        // ...
      },
      onClickCompact(e) {
        // ...
      },
    };
    ```

  - 객체 구조 분해

    ```tsx
    const {
      props: { a, b },
    } = obj;
    ```

- 함수 매개변수 기본값 사용하기

  - 기본값을 기반으로 타입 추론이 가능하기 때문에, 타입스크립트로 마이그레이션 시 매개변수에 타입 구문을 쓰지 않아도 된다

- 저수준 프로미스나 콜백 대신 `async / await` 사용하기

  - 버그나 실수를 방지할 수 있고, 비동기 코드에 타입 정보가 전달되어 타입 추론을 가능하게 한다

- 연관 배열에 객체 대신 `Map`과 `Set` 사용하기

  - 인덱스 시그니처 사용 시

    - `constructor` 등의 특정 문자열이 주어지는 경우 예약어로 인식하는 문제

  - `Map` 사용하기

    ```tsx
    function countWordsMap(text: string) {
      const counts = new Map<string, number>();
      for (const word of text.split(/[\s,.]+/)) {
        counts.set(word, 1 + (counts.get(word) || 0));
      }
      return counts;
    }
    ```

- 타입스크립트에 `use strict` 넣지 않기

  - 타입스크립트는 기본적으로 `'use strict'`를 사용
  - `alwaysStrict` 또는 `strict` 컴파일러 옵션 설정 권장

- TC39나 타입스크립트 릴리즈 노트를 통해 최신 기능 확인 가능

---

## 아이템 59: 타입스크립트 도입 전에 @ts-check와 JSDoc으로 시험해 보기

- `@ts-check` 지시자를 사용하여 타입 체커가 파일을 분석하고, 발견된 오류를 보고하도록 지시할 수 있다

  - 매우 느슨한 수준으로 타입 체크를 수행한다
  - 타입 불일치나 함수의 매개변수 개수 불일치 등

- 선언되지 않은 전역 변수

  - 숨어 있는 변수라면 변수를 제대로 인식할 수 있게 별도로 타입 선언 파일을 만들기

    ```tsx
    // @ts-check
    console.log(user.firstName);
    ```

    ```tsx
    // types.d.ts
    interface UserData {
      firstName: string;
      lastName: string;
    }

    declare let user: UserData;
    ```

  - 선언 파일을 찾지 못하는 경우 ‘트리플 슬래시’ 참조를 사용하여 명시적으로 임포트

    ```tsx
    // @ts-check
    /// <reference path="./types.d.ts" />
    console.log(user.firstName); // 정상
    ```

- 알 수 없는 라이브러리

  - 서드파티 라이브러리의 타입 정보
    - `@types/xxx` 설치하기

- DOM 문제

  ```tsx
  // @ts-check
  const ageEl = /** @type {HTMLInputElement} */ document.getElementById("age");
  ageEl.value = "12"; // 정상
  ```

- 부정확한 JSDoc

  - 타입스크립트 언어 서비스는 타입을 추론해서 JSDoc을 자동으로 생성해 준다

    ```tsx
    // @ts-check
    /**
     * @param {number} val
     */
    function double(val) {
      return 2 * val;
    }
    ```

---

## 아이템 60: allowJS로 타입스크립트와 자바스크립트 같이 사용하기

- `allowJS` 옵션

  - 타입 체크와 관련이 없지만, 기존 빌드 과정에 타입스크립트 컴파일러를 추가하기 위함
  - 모듈 단위로 타입스크립트로 전환하는 과정에서 테스트를 수행하기 위함

- 프레임워크 없이 빌드 체인 직접 구성하기

  - `outDir` 옵션 사용하기

---

## 아이템 61: 의존성 관계에 따라 모듈 단위로 전환하기

- 의존성 관련 오류 없이 작업하려면, 다른 모듈에 의존하지 않는 최하단 모듈부터 작업을 시작해서 의존성의 최상단에 있는 모듈을 마지막으로 완성해야 한다

  - 서드파티 라이브러리 타입 정보를 가장 먼저 해결 (`@types/`)
  - 외부 API의 타입 정보 추가

- 리팩터링은 타입스크립트 전환 작업이 완료된 후에 해야 한다

- 선언되지 않은 클래스 멤버

  → ‘누락된 모든 멤버 추가’ 빠른 수정

  ```tsx
  class Greeting {
    greeting: string;
    name: any; // 직접 수정 필요

    constructor(name) {
      this.greeting = "Hello";
      this.name = name;
    }

    greet() {
      return this.greeting + " " + this.name;
    }
  }
  ```

- 타입이 바뀌는 값

  ```tsx
  const state = {};
  state.name = "New York";
  // 🚨 '{}' 유형에 'name' 속성이 없습니다
  state.capital = "Albany";
  // 🚨 '{}' 유형에 'capital' 속성이 없습니다
  ```

  → 한번에 객체 생성 또는 타입 단언문 사용하기

- 자바스크립트에서 JSDoc과 `@ts-check`를 사용해 타입 정보를 추가한 상태라면, 타입스크립트로 전환하는 순간 타입 정보가 ‘무효화’된다는 점에 주의

- 마지막으로 테스트 코드를 타입스크립트로 전환

---

## 아이템 62: 마이그레이션의 완성을 위해 noImplicitAny 설정하기

- `noImplicitAny` 설정을 통해 타입 선언과 관련된 실제 오류를 드러낼 수 있다
- 최종적으로 가장 강력한 설정은 `"srict: true"`
