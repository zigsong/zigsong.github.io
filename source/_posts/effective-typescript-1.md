---
title: 이펙티브 타입스크립트 1장
date: 2021-12-02 16:29:35
tags: effective-typescript
thumbnailImage: https://i.imgur.com/cKyZ5Kn.jpg
---

타입스크립트 알아보기

<!-- more -->

---

## 아이템 1: 타입스크립트와 자바스크립트의 관계 이해하기

**“타입스크립트는 자바스크립트의 상위집합(superset)이다”**

- 그렇기 때문에 자바스크립트 코드는 이미 타입스크립트다.

  - 기존 자바스크립트 코드를 타입스크립트로 마이그레이션하는 데 엄청난 이점!
  - 타입 구문을 사용하는 순간부터 자바스크립트는 타입스크립트 영역으로 들어가게 된다

- 타입 시스템에서는 런타임에 오류를 발생시킬 코드를 미리 찾아낸다

  ```tsx
  const states = [
    { name: "Alabama", capital: "Montogmery" },
    { name: "Alaska", capital: "Juneau" },
    { name: "Arizona", capital: "Phoenix" },
    // ...
  ];
  for (const state of states) {
    console.log(state.capitol); // JS에서는 undefined, TS에서는 에러
  }
  ```

- 타입을 명시적으로 선언하여 의도를 분명하게 하면 오류를 구체적으로 알 수 있다.

  ```tsx
  interface State {
    name: string;
    capital: string;
  }
  const states: State[] = [
    { name: "Alabama", capitol: "Montogery" },
    { name: "Alaska", capitol: "Juneau" },
    { name: "Arizona", capitol: "Phoenix" },
  ];
  // 🚨 Error
  // 'State' 형식에 'capitol'이 없습니다.
  // 'capital'을(를) 쓰려고 했습니까?
  for (const state of states) {
    console.log(state.capital);
  }
  ```

- 타입스크립트 타입 시스템은 자바스크립트의 런타임 동작을 ‘모델링’한다

- 런타임에서 정상 동작하는 코드에 타입스크립트가 오류를 표시하는 경우

  ```tsx
  const a = null + 7;
  // ✅ JS에서는 a의 값이 7이 된다.
  // 🚨 TS Error: '+' 연산자를 ... 형식에 적용할 수 없습니다.
  ```

---

## 아이템 2: 타입스크립트 설정 이해하기

- tsconfig.json으로 타입스크립트 설정 작성하기

  ```tsx
  {
    "compilerOptions": {
      // ...
    }
  }
  ```

- `noImplicitAny` - 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어

  ```tsx
  function add(a, b) {
    return a + b;
  }
  ```

  - `add` 부분에 hover 시 타입스크립트가 추론한 함수의 타입 확인 가능

    ```tsx
    function add(a: any, b: any): any;
    ```

    → 이를 암시적 any라고 부른다

  - `noImplicitAny`가 설정되었다면 오류 발생

- `strictNullChecks`

  - `null`과 `undefined`가 모든 타입에서 허용되는지 확인한다

    ```tsx
    // strictNullChecks 해제 시
    const x: number = null; // 정상

    // strictNullChecks 설정 시
    const x: number = null; // 🚨 에러: 'null' 형식은 'number' 형식에 할당할 수 없습니다.
    ```

  - `null`을 사용하지 않으려면 `null`을 체크하는 코드나 단언문을 추가해야 한다

    ```tsx
    const el = document.getElementById("status");
    el.textContent = "Ready"; // 🚨 에러

    if (el) {
      el.textContent = "Ready"; // 정상, null을 제외
    }
    el!.textContent = "Ready"; // 정상, el이 null이 아님을 단언
    ```

  - 타입스크립트에서 엄격한 체크를 하고 싶다면 `strict` 설정을 고려

---

## 아이템 3: 코드 생성과 타입이 관계없음을 이해하기

- 타입스크립트 컴파일러는 두 가지 역할을 수행한다.

  - 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일한다.
  - 코드의 타입 오류를 체크한다.

- 타입 오류가 있는 코드도 컴파일이 가능하다.

  - 컴파일은 타입 체크와 독립적으로 동작하기 때문이다.
  - 작성한 타입스크립트가 유효한 자바스크립트라면 타입스크립트 컴파일러는 컴파일을 해 낸다.

- 런타임에는 타입 체크가 불가능하다.

  - 타입스크립트의 타입은 ‘제거 가능’하다. 즉 자바스크립트로 컴파일되는 과정에서 모든 인터페이스, 타입, 타입 구문은 그냥 제거되어 버린다

  - 런타임에 타입 정보를 유지하는 방법

    - 특정 속성이 존재하는지 체크

    - ‘태그’ 기법 - 런타임에 접근 가능한 타입 정보를 명시적으로 저장

      ```tsx
      interface Square {
        kind: "square";
        width: number;
      }
      interface Rectangle {
        kind: "rectangle";
        height: number;
        width: number;
      }
      type Shape = Square | Rectangle; // '태그된 유니온(tagged union)'

      function calculateArea(shape: Shape) {
        if (shape.kind === "rectangle") {
          shape; // 타입이 Rectangle
          return shape.width * shape.height;
        } else {
          shape; // 타입이 Square
          return shape.width * shape.width;
        }
      }
      ```

    - 타입(런타임 접근 불가)과 값(런타임 접근 가능)을 둘 다 사용하는 기법

      - 타입을 클래스로 만들기 → 타입과 값으로 모두 사용할 수 있다

- 타입 연산은 런타임에 영향을 주지 않는다

  - 값을 정제하기 위해서는 런타임의 타입을 체크해야 하고 자바스크립트 연산을 통해 변환을 수행해야 한다

- 런타임 타입은 선언된 타입과 다를 수 있다.

  - `switch~case` 구문의 `default` 구문
  - API 요청의 반환값을 사용하는 경우

- 타입스크립트 타입으로는 함수를 오버로드할 수 없다.

  ```tsx
  function add(a: number, b: number) {
    return a + b;
  } // 🚨 에러: 중복된 함수 구현입니다.
  function add(a: string, b: string) {
    return a + b;
  } // 🚨 에러: 중복된 함수 구현입니다.
  ```

  - 타입스크립트의 함수 오버로딩은 타입 수준에서만 가능하다 (구현체는 불가)

    ```tsx
    function add(a: number, b: number): number;
    function add(a: string, b: string): string;
    ```

- 타입스크립트 타입은 런타임 성능에 영향을 주지 않는다

  - 타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문이다
  - ‘런타임’ 오베허드가 없는 대신, 타입스크립트 컴파일러는 ‘빌드타임’ 오버헤드가 있다
  - 타입스크립트가 컴파일하는 코드는 오래된 런타임 환경을 지원하기 위해 호환성을 높이고 성능 오버헤드를 감안할지, 호환성을 포기하고 성능 중심의 네이티브 구현체를 선택할지의 문제에 맞닥뜨릴 수도 있다.

---

## 아이템 4: 구조적 타이핑에 익숙해지기

- 자바스크립트는 본질적으로 덕 타이핑(duck typing) 기반

  > 🐤 **덕 타이핑**
  > 객체가 어떤 타입에 부합하는 변수와 메서드를 가질 경우 객체를 해당 타입에 속하는 것으로 간주하는 방식

- 타입스크립트는 이 동작을 그대로 모델링한다.

- 예제

  ```tsx
  interface Vector2D {
    x: number;
    y: number;
  }

  function calculateLength(v: Vector2D) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  interface NamedVector {
    name: string;
    x: number;
    y: number;
  }
  ```

  - `NamedVector`의 구조가 `Vector2D`와 호환되기 때문에 `calculateLength` 함수 호출 가능

- 🚨 문제

  ```tsx
  interface Vector3D {
    name: string;
    x: number;
    y: number;
  }

  function normalize(v: Vector3D) {
    const length = calculateLength(v);

    return {
      x: v.x / length,
      y: v.y / length,
      z: v.z / length,
    };
  }

  normalize({ x: 3, y: 4, z: 5 });
  // { x: 0.6, y: 0.8, z: 1 }
  ```

  - `Vector3D` 는 `calculateLength` 함수 호출 시 `Vector2D`와 호환된다
  - 이때 `z`가 정규화에서 무시되기 때문에 잘못된 결과를 출력한다

- 구조적 타이핑과 클래스 할당문

  ```tsx
  class C {
    foo: string;
    constructor(foo: string) {
      this.foo = foo;
    }
  }

  const c = new C("instanceof C");
  const d: C = { foo: "object literal" }; // 정상
  ```

  - d는 string 타입의 foo 속성을 가지고, `Object.prototype`으로부터 비롯된 생성자를 가진다

- 구조적 타이핑을 사용하면 유닛 테스트를 쉽게 할 수 있다

  ```tsx
  interface DB {
    runQuery: (sql: string) => any[];
  }
  function getAuthors(database: DB): Author[] {
    const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`);
    return authorRows.map((row) => ({ first: row[0], last: row[1] }));
  }
  ```

  - 타입스크립트는 테스트 DB가 특정 인터페이스를 충족하는지 확인한다
  - 추상화(DB)를 함으로써, 로직과 테스트를 특정한 구현으로부터 분리한다

---

## 아이템 5: any 타입 지양하기

- any 타입에는 타입 안정성이 없다

  ```tsx
  let age: number;
  age = "12" as any; // 정상
  age += 1; // 런타임에 정상, 🚨 age는 '121'
  ```

- any는 함수 시그니처를 무시해 버린다

  ```tsx
  function calculateAge(birthDate: Date): number {
    // ...
  }
  let birthDate: any = "1997-09-12";
  calculateAge(birthDate); // 정상 (🚨 추후 에러 발생 가능)
  ```

- any 타입에는 언어 서비스가 적용되지 않는다

  - IDE의 자동완성 기능과 적절한 도움말 제공 불가

- any 타입은 코드 리팩터링 때 버그를 감춘다

  - any가 아닌 구체적인 타입을 사용하여 타입 체커가 오류를 발견하도록 해야 한다

- any는 타입 설계를 감춰버린다

  - 애플리케이션 상태 등의 객체 설계 시 any 사용을 지양해야 한다

- any는 타입시스템의 신뢰도를 떨어뜨린다

  - 사람은 항상 실수를 한다
  - any 타입을 쓰지 않으면 런타임에 발견될 오류를 미리 잡을 수 있고 신뢰도를 높일 수 있다

---

**Ref** 이펙티브 타입스크립트 1장: 타입스크립트 알아보기
