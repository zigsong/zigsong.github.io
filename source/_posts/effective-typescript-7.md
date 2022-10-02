---
title: 이펙티브 타입스크립트 7장
date: 2022-01-15 00:01:25
tags: effective-typescript
thumbnailImage: https://i.imgur.com/cKyZ5Kn.jpg
---

코드를 작성하고 실행하기

<!-- more -->

---

## 아이템 53: 타입스크립트 기능보다는 ECMAScript 기능을 사용하기

- 자바스크립트에 새로 추가된 기능은 타입스크립트의 초기 기능과 호환성 문제를 발생시켰다

  - 자바스크립트의 신규 기능을 그대로 채택하고 타입스크립트 초기 버전과 호환성을 포기했다
  - 그러나 이미 사용되고 있던 몇 가지 기능(호환성 문제로 지양하는 방식)이 있다.

- **열거형(`enum`)**

  - 몇몇 값의 모음을 나타내는 방식

  - 😵 문제점

    - 숫자 열거형에 0, 1, 2 외의 다른 숫자가 할당되면 매우 위험하다
    - 상수 열거형(`const enum`)은 런타임에 완전히 제거되어, 문자열 열거형에서 문제를 일으킨다
    - `preserveConstEnums` 플래그를 설정한 상수 열거형은 런타임 코드에 정보를 유지한다
    - 문자열 열거형은 구조적 타이핑이 아닌 명목적 타이핑을 사용한다

  - 문자열 열거형의 명목적 타이핑은 자바스크립트와 동작이 다르다는 문제가 있다

    ```tsx
    enum Flavor {
      VANILLA = "vanilla",
      CHOCOLATE = "chocolate",
      STRAWBERRY = "strawberry",
    }

    let flavor = Flavor.CHOCOLATE; // 타입이 Flavor
    flavor = "strawberry"; // 🚨 'strawberry' 형식은 'Flavor' 형식에 할당할 수 없습니다
    ```

    → 열거형 대신 리터럴 타입의 유니온 사용을 권장한다

    ```tsx
    type Flavor = "vanilla" | "chocolate" | "strawberry";
    ```

- **매개변수 속성**

  - 생성자의 매개변수를 사용하여 클래스 초기화 시 타입스크립트에는 간결한 문법을 제공한다

    ```tsx
    class Person {
      constructor(public name: string) {}
    }
    ```

  - 😵 문제점

    - 실제로는 코드가 늘어난다
    - 매개변수 속성은 런타임에는 실제로 사용되지만, 타입스크립트에서는 사용되지 않는 것처럼 보인다
    - 매개변수 속성과 일반 속성을 섞어서 사용하면 클래스의 설계가 혼란스러워진다

- **네임스페이스와 트리플 슬래시 임포트**

  ```tsx
  namespace foo {
    function bar() {}
  }

  /// <reference path="other.ts" />
  foo.bar();
  ```

  → ES2015 스타일의 모듈(`import`와 `export`) 사용을 권장한다

- **데코레이터**

  - 클래스, 메서드, 속성에 annotation을 붙이거나 기능을 추가하는 것
  - 😵 문제점
    - 표준화가 완료되지 않았기 때문에 비표준으로 바뀌거나 호환성이 깨질 가능성이 있다

---

## 아이템 54: 객체를 순회하는 노하우

- 편집기에서 오류가 발생하는 경우

  ```tsx
  const obj = {
    one: "uno",
    two: "dos",
    three: "tres",
  };

  for (const k in obj) {
    const v = obj[k];
    // 🚨 obj에 인덱스 시그니처가 없기 때문에 엘리먼트는 암시적으로 'any' 타입입니다
  }
  ```

  → `k`가 `string` 으로 인식되기 때문이다

  - `k`의 타입을 더욱 구체적으로 명시해서 해결한다

    ```tsx
    let k: keyof typeof obj;
    for (k in obj) {
      const v = obj[k]; // 정상
    }
    ```

- 🤔 `k`가 `string`으로 추론된 이유

  ```tsx
  interface ABC {
    a: string;
    b: string;
    c: number;
  }

  function foo(abc: ABC) {
    for (const k in abc) {
      const v = abc[k]; // 🚨
    }
  }
  ```

  - `a`, `b`, `c` 외에 다른 속성이 존재하는 객체도 `foo` 함수의 매개변수 `abc`에 할당 가능하기 때문이다

- `keyof`을 사용하는 것의 문제

  - `v`도 `string | number`로 한정되어 범위가 너무 좁아진다

- 단지 객체의 키와 값을 순회하고 싶다면 `Object.entries`를 사용한다

  ```tsx
  function foo(abc: ABC) {
    for (const [k, v] of Object.entries(abc)) {
      k; // string 타입
      v; // any 타입
    }
  }
  ```

---

## 아이템 55: DOM 계층 구조 이해하기

- DOM 엘리먼트를 사용할 때 타입스크립트의 에러

| 타입              | 예시                         |
| :---------------- | :--------------------------- |
| EventTarget       | window, XMLTHttpRequest      |
| Node              | document, Text, Comment      |
| Element           | HTMLElement, SVGElement 포함 |
| HTMLElement       | `<i>`, `<b>`                 |
| HTMLButtonElement | `<button>`                   |

- `EventTarget`

  - DOM 타입 중 가장 추상화된 타입으로, 이벤트리스너의 추가/제거, 이벤트 보내기만 가능

    ```tsx
    function handleDrag(eDown: Event) {
      const targetEl = eDown.currentTarget;
      targetEl.classList.add('dragging');
      // 🚨 개체가 null인 것 같습니다.
      // 🚨 'EventTarget' 형식에 'classList' 속성이 없습니다
    ```

  - `Event`의 `currentTarget` 속성의 타입은 `EventTarget | null`

- `Node`

  - `Element`가 아닌 `Node`
  - 텍스트 조각과 주석

- `Element`와 `HTMLElement`

  - HTML이 아닌 엘리먼트
  - `SVGSvgElement`

- `HTMLxxxElement`

  - `HTMLxxxElement` 형태의 특정 엘리먼트들은 자신만의 고유한 속성을 가지고 있다

    - ex) `HTMLImageElement` - `src`, `HTMLInputElement` - `value`

  - 항상 정확한 타입을 얻을 수 있는 것은 아니다

    ```tsx
    // 정확한 타입
    document.createElement("button"); // HTMLButtonElement

    // 정확한 타입이 아닌 경우
    document.getElementById("my-div"); // HTMLElement
    ```

  - 타입 단언문 사용
    ```tsx
    document.getElementById("my-div") as HTMLDivElement;
    ```

- `strictNullChecks` 설정 시 엘리먼트가 `null`인 경우를 체크한다

- `Event` 는 가장 추상화된 이벤트로, 별도의 계층구조를 가진다

  - ex) `UIEvent`, `MouseEvent`, `TouchEvent`, `WheelEvent`, `KeyboardEvent`
  - 더 많은 문맥 정보를 제공하여 DOM에 대한 타입 추론을 가능하게 해야 한다

---

## 아이템 56: 정보를 감추는 목적으로 private 사용하지 않기

- `public`, `protected`, `private` 같은 접근 제어자

  - 타입스크립트 키워드기 때문에 컴파일 후에 제거된다

- 심지어 단언문을 사용하면 타입스크립트 상태에서도 `private` 속성에 접근 가능하다

  ```tsx
  class Diary {
    private secret = "cheated on my English test";
  }

  const diary = new Diary();
  (diary as any).secret; // 정상
  ```

  → 정보를 감추기 위해 `private` 을 사용하면 안 된다

- 정보를 감추기 위해 클로저 사용하기

  ```tsx
  declare function hash(text: string): number;

  class PasswordChecker {
    checkPassword: (password: string) => boolean;
    constructor(passwordHash: number) {
      this.checkPassword = (password: string) => {
        return hash(password) === passwordHash;
      };
    }
  }

  const checker = new PasswordChecker(hash("s3cret"));
  checker.checkPassword("s3cret"); // true
  ```

  - `PasswordChecker` 의 생성자 외부에서 `passwordHash` 변수에 접근할 수 없기 때문에 정보가 숨겨진다

    - 이때 `passwordHash`에 접근하는 메서드 역시 생성자 내부에 정의되어야 한다
    - 메서드 정의가 생성자 내부에 있으면, 인스턴스 메서드로 생성된다는 점을 기억하자 (메모리 낭비)

- 비공개 필드 (현재 표준화 진행중) 사용하기

  - 접두사 `#`
  - 타입 체크와 런타임 모두에서 비공개
  - 클래스 외부에서는 접근할 수 없지만, 클래스 메서드나 동일 클래스의 개별 인스턴스끼리는 접근이 가능하다.

---

## 아이템 57: 소스맵을 사용하여 타입스크립트 디버깅하기

- 디버거는 런타임에 동작하며, 현재 동작하는 코드가 어떤 과정을 거쳤는지 모른다

- 디버깅 문제를 해결하기 위해 브라우저는 소스맵(source map) 기능을 제공한다

  - 변환된 코드의 위치와 심벌들을 원본 코드의 원래 위치와 심벌들로 매핑한다

- 타입스크립트의 소스맵 활성화

  ```tsx
  // tsconfig.json
  {
    "compilerOptions": {
      "sourceMap": true
    }
  }
  ```

  → 각 `.ts` 파일에 대해서 `.js`와 `.js.map` 두 개의 파일을 생성한다

- 소스맵에 대해 알아야 할 사항들

  - 타입스크립트와 함께 번들러나 압축기를 사용하고 있다면, 번들러나 압축기가 각자의 소스맵을 생성한다. 이상적인 디버깅을 위해서는 생성된 자바스크립트가 아닌 원본 타입스크립트 소스로 매핑되도록 해야 한다.
  - 상용 환경에 소스맵이 유출되고 있는지 확인해야 한다. 소스맵에 원본 코드의 인라인 복사본이 포함되어 있다면 공개해서는 안될 내용이 들어있을 수 있다.
