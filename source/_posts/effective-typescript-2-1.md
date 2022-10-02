---
title: 이펙티브 타입스크립트 2장 - 1
date: 2021-12-11 14:34:28
tags: effective-typescript
thumbnailImage: https://i.imgur.com/cKyZ5Kn.jpg
---

타입스크립트의 타입 시스템

<!-- more -->

---

## 아이템 6: 편집기를 사용하여 타입 시스템 탐색하기

- 타입스크립트에서 실행할 수 있는 프로그램
  - 타입스크립트 컴파일러(tsc)
  - 단독 실행 가능한 타입스크립트 서버(tsserver)
- 타입스크립트 서버에서 제공하는 언어 서비스를 사용하자
- 많은 편집기에서 타입스크립트가 그 타입을 어떻게 판단하는지 확인 가능
- 편집기상의 타입 오류를 살펴보는 것도 타입 시스템을 파악하는 데 좋은 방법
- 라이브러리와 라이브러리의 타입 선언
  - Go to Definition 옵션으로 `d.ts`에서 타입 정의 확인 가능

---

## 아이템 7: 타입이 값들의 집합이라고 생각하기

- 런타임에 모든 변수는 자바스크립트 세상의 값으로부터 정해지는 각자의 **고유한 값**을 가진다

- 그러나 코드가 실행되기 전, 즉 타입스크립트가 오류를 체크하는 순간에는 **타입**을 가지고 있으며,
  이는 **할당 가능한 값들의 집합**이다.

- 집합의 종류

  - `never` - 아무것도 포함하지 않는 공집합. 아무 값도 할당 불가

    ```tsx
    const x: never = 12; // 🚨 '12' 형식은 'never' 형식에 할당할 수 없습니다.
    ```

  - 리터럴(유닛) 타입 - 한 가지 값만 포함하는 타입

    ```tsx
    type A = "A";
    ```

  - 유니온 타입 - 두 개 혹은 세 개, 값 집합들의 합집합

    ```tsx
    type AB = "A" | "B";
    ```

- ‘할당 가능’하다는 뜻 - ‘부분 집합’

  ```tsx
  const a: AB = "A"; // 'A'는 집합 {'A', 'B'}의 원소
  ```

- 실제 다루게 되는 타입은 대부분 범위가 무한대

  ```tsx
  type Int = 1 | 2 | 3 | 4 | 5; // | ...
  ```

- 원소를 서술하는 방법

  ```tsx
  interface Identified {
    id: string;
  }
  ```

- 타입 = 값의 집합

  - `&` 연산자는 두 타입의 인터섹션(교집합)을 계산

  - `|` 연산자는 두 인터페이스의 유니온, 교집합이 없는 두 개 이상의 타입에서 사용 시 주의

    ```tsx
    interface Person {
      name: string;
    }
    interface Lifespan {
      birth: Date;
      death?: Date;
    }
    type PersonSpan = Person & Lifespan;

    type K = keyof (Person | Lifespan); // 타입이 never
    ```

- `extends` - ~에 할당 가능한, ~의 부분집합

  - 서브타입 - 어떤 집합이 다른 집합의 부분집합

    ```tsx
    interface Vector1D {
      x: number;
    }
    interface Vector2D extends Vector1D {
      y: number;
    }
    interface Vector3D extends Vector2D {
      z: number;
    }
    ```

    - `Vector3D`는 `Vector2D`의 서브타입, `Vector2D`는 `Vector1D`의 서브타입

- 제네릭에서의 `extends`

  ```tsx
  function getKey<K extends string>(val: any, key: K) {
    // ...
  }
  ```

  - 집합의 관점에서 `string`을 상속

    - `string` 리터럴 타입, `string` 리터럴 타입의 유니온, `string` 자신을 포함

- 타입이 집합이라는 관점에서 배열과 튜플의 관계 살펴보기

  ```tsx
  const list = [1, 2]; // 타입은 number[]
  const tuple: [number, number] = list;
  // 🚨 'number[]' 타입은 '[number, number]' 타입의 0, 1 속성에 없습니다
  ```

- 트리플

  ```tsx
  const triple: [number, number, number] = [1, 2, 3];
  const doulbe: [number, number] = triple;
  // 🚨 숫자의 length값이 맞지 않기 때문에 할당문에 오류 발생
  ```

- 타입이 값의 집합이라는 뜻은, 동일한 값의 집합을 가지는 두 타입은 같다는 의미

---

## 아이템 8: 타입 공간과 값 공간의 심벌 구분하기

- 타입스크립트의 심벌(`symbol`)은 타입 공간이나 값 공간 중의 한 곳에 존재

  ```tsx
  interface Cylinder {
    radius: number;
    height: number;
  }

  const Cylinder = (radius: number, height: number) => ({ radius, height });
  ```

  - `interface Cylinder`에서 `Cylinder`는 타입, `const Cylinder`와 무관

  - 일반적으로 `type`이나 `interface` 다음에 나오는 심벌은 타입, `const`나 `let` 선언에 쓰이는 값은 값

    - 컴파일 타입에서 타입 정보는 제거된다

- `class`와 `enum` 은 상황에 따라 타입과 값 두 가지 모두 가능

  ```tsx
  // 타입으로 쓰인 Cylinder 클래스
  class Cylinder {
    radius = 1;
    height = 1;
  }

  function calculateVolume(shape: unknown) {
    if (shape instanceof Cylinder) {
      shape; // 정상, 타입은 Cylinder
      shape.radius; // 정상, 타입은 number
    }
  }
  ```

  - 클래스가 타입으로 쓰일 때는 형태(속성과 메서드)가 사용되는 반면,
    값으로 쓰일 때는 생성자가 사용된다

- `typeof` - 타입에서 쓰일 때와 값에서 쓰일 때 다른 기능을 한다.

  ```tsx
  type T1 = typeof p; // 타입은 Person
  type T2 = typeof email; // 타입은 (p: Person, subject: string, body: string) => Response

  const v1 = typeof p; // 값은 'object'
  const v2 = typeof email; // 값은 'function'
  ```

  - 타입의 관점에서 `typeof` 은 값을 읽어서 타입스크립트 타입을 반환
  - 값의 관점에서 `typeof` 은 자바스크립트 런타임의 `typeof` 연산자를 반환 (심벌의 런타임 타입을 가리킴)

- 클래스

  ```tsx
  type T = typeof Cylinder; // 타입이 typeof Cylinder

  declare let fn: T;
  const c = new fn(); // 타입이 Cylinder
  ```

  - `InstanceType` 제너릭을 사용해 생성자 타입과 인스턴스 타입 전환 가능

    ```tsx
    type C = InstanceType<typeof Cylinder>; // 타입이 Cylinder
    ```

- 속성 접근자 `[]`

  - `obj['field']`와 `obj.field`는 값이 동일하더라도 타입은 다를 수 있으므로, 타입의 속성을 얻을 때는 `obj['field']`를 사용한다

- 👩‍🏫 타입스크립트에서 타입 공간과 값 공간을 혼동해서 잘못 작성하는 경우 주의

---

## 아이템 9: 타입 단언보다는 타입 선언을 사용하기

- 타입 단언은 오류를 발견하지 못한다

  ```tsx
  interface Person {
    name: string;
  }

  const alice: Person = {}; // 🚨 'Person' 유형에 필요한 'name' 속성이 '{}' 유형에 없습니다.
  const bob = {} as Person; // 오류 없음
  ```

  - 속성을 추가할 때도 마찬가지
    - 타입 선언문에서는 잉여 속성 체크가 동작하지만, 단언문에서는 적용되지 않는다

- 화살표 함수의 타입 선언

  ```tsx
  const people = ["alice", "bob", "jan"].map((name) => ({ name }));
  // Person[]을 원했지만 결과는 { name: string; }[]...
  ```

  - 단언문 대신 화살표 함수의 반환 타입을 선언

    ```tsx
    const people = ["alice", "bob", "jan"].map((name): Person => ({ name })); // 타입은 Person[]
    ```

  - 그러나 함수 호출 체이닝이 연속되는 곳에서는 체이닝 시작에서부터 명명된 타입을 가져야 오류가 정확하게 표시된다

- 타입 단언이 꼭 필요한 경우

  - 타입 체커가 추론한 타입보다 개발자가 판단하는 타입이 더 정확할 때

    ```tsx
    document.querySelector("#myButton").addEventListener("click", (e) => {
      e.currentTarget; // 타입은 EventTarget
      const button = e.currentTarget as HTMLButtonElement;
      button; // 타입은 HTMLButtonElement
    });
    ```

- `!` 문법을 사용해서 `null`이 아님을 단언하는 경우

  ```tsx
  const elNull = document.getElementById("foo"); // 타입은 HTMLElement | null
  const el = document.getElementById("foo")!; // 타입은 HTMLElement
  ```

- 타입 단언문으로 임의의 타입 간에 변환

  - `A`가 `B`의 부분집합(서브타입)인 경우 사용

---

## 아이템 10: 객체 래퍼 타입 피하기

- 자바스크립트는 기본형과 객체 타입을 서로 자유롭게 변환 가능 (래퍼 객체)

- `string` 기본형과 `String` 래퍼 객체가 항상 동일하게 동작하는 것은 아니다

  - `String` 객체는 오직 자기 자신하고만 동일하다

    ```tsx
    "hello" === new String("hello"); // false
    new String("hello") === new String("hello"); // false
    ```

- 타입스크립트는 기본형과 객체 래퍼 타입을 별도로 모델링한다

  ```tsx
  function isGreeting(phrase: String) {
    return ["hello", "good day"].includes(phrase);
    // 🚨 'String' 형식의 인수는 'string' 형식의 매개변수에 할당될 수 없습니다.
  }
  ```

  - `string`은 `String`에 할당할 수 있지만 `String`은 `string`에 할당할 수 없다
  - 타입스크립트가 제공하는 타입 선언은 전부 **기본형 타입**이다

---

## 아이템 11: 잉여 속성 체크의 한계 인지하기

- 타입이 명시된 변수에 객체 리터럴을 할당할 때 타입스크립트는 해당 타입의 속성이 있는지, 그리고 ‘그 외의 속성은 없는지’ 확인한다.

  ```tsx
  interface Room {
    numDoors: number;
    ceilingHeightFt: number;
  }

  const obj = {
    numDoors: 1,
    ceilingHeightFt: 10,
    elephant: "present",
  };

  const r: Room = obj; // 정상
  ```

  - `obj` 타입은 `Room` 타입의 부분 집합을 포함하므로, `Room`에 할당 가능하며 타입 체커도 통과한다
  - 잉여 속성 체크는 할당 가능 검사와는 별도의 과정이다

- 타입스크립트는 런타임 오류 뿐 아니라 의도와 다르게 작성된 코드까지 찾는다

  ```tsx
  interface Options {
    title: string;
    darkMode?: boolean;
  }
  function createWindow(options: Options) {
    if (options.darkMode) {
      setDarkMode();
    }
    // ...
  }
  createWindow({
    title: "Spider Solitaire",
    darkmode: true, // 🚨 에러
  });
  ```

  - 런타임에 에러가 발생하지 않지만, 타입스크립트에서 에러가 발생한다

- `Options`는 넓은 타입으로 해석된다

  ```tsx
  const o1: Options = document; // 정상
  const o2: Options = new HTLMAnchorElement(); // 정상
  ```

  - `document`와 `HTLMAnchorElement`의 인스턴스 모두 `string` 타입인 `title` 속성을 갖고 있기 때문에 할당문은 정상

- 잉여 속성 체크는 객체 리터럴만 체크한다

  ```tsx
  const o: Options = { darkmode: true, title: "Ski Free" }; // 🚨 에러

  const intermediate = { darkmode: true, title: "Ski Free" };
  const o: Options = intermediate; // 정상

  // 타입 단언문을 사용할 때도 적용되지 않는다
  const o: Options = { darkmode: true, title: "Ski Free" } as Options; // 정상
  ```

---

## 아이템 12: 함수 표현식에 타입 적용하기

- 타입스크립트에서는 함수 선언문이 아닌 함수 표현식을 권장

  - 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 재사용할 수 있다는 장점이 있다

    ```tsx
    type DiceRollFn = (sides: number) => number;
    const rollDice: DiceRollFn = (sides) => {
      /* ... */
    };
    ```

- 반복되는 함수 시그니처를 하나의 함수로 통합하여 불필요한 코드의 반복을 줄일 수 있다

  - 라이브러리는 공통 함수 시그니처를 타입으로 제공하기도 한다
    - ex) 리액트의 `MouseEventHandler`

- 시그니처가 일치하는 다른 함수가 있을 때도 함수 표현식에 타입 적용 가능

  - ex) fetch 함수

    ```tsx
    const responseP = fetch("/quote?by=Mark+Twain"); // 타입이 Promise<Response>
    ```

  - 응답의 데이터를 추출

    ```tsx
    async function getQuote() {
      const response = await fetch("/quote?by=Mark+Twain");
      const quote = await response.json();

      return quote;
    }
    ```

  - 이때 `/quote`가 존재하지 않는 API거나 `fetch`가 실패하는 경우 버그가 발생한다

    → 상태 체크를 수행해 줄 `checkedFetch` 함수 작성

    - 함수 선언문을 함수 표현식으로 바꾸고, 함수 전체에 타입을 적용

    ```tsx
    // lib.dom.d.ts
    declare function fetch(
      input: RequestInfo,
      init?: RequestInit
    ): Promise<Response>;
    ```

    ```tsx
    const checkedFetch: typeof fetch = async (input, init) => {
      const response = await fetch(input, init);
      if (!response.ok) {
        throw new Error("Request failed: " + response.status);
      }
      return response;
    };
    ```
