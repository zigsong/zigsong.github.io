---
title: 이펙티브 타입스크립트 2장 - 2
date: 2021-12-11 14:28:48
tags: ["effective-typescript"]

---

타입스크립트의 타입 시스템

<!-- more -->

---

## 아이템 13: 타입과 인터페이스의 차이점 알기

- 인터페이스와 타입 모두 사용 가능한 것

  - 인덱스 시그니처

  - 함수 타입

  - 제너릭

    ```tsx
    type TPair<T> = {
      first: T;
      second: T;
    }
    interface IPair<T> = {
      first: T;
      second: T;
    }
    ```

- 인터페이스는 타입을 확장할 수 잇으며, 타입은 인터페이스를 확장할 수 있다

  - 하지만 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지는 못한다

  - 클래스 구현 시 타입과 인터페이스 둘 다 사용 가능하다

    ```tsx
    class StateT implements TState {
      name: string = "";
      capital: string = "";
    }
    class StateT implements IState {
      name: string = "";
      capital: string = "";
    }
    ```

- 인터페이스와 타입의 차이점

  - 유니온 타입은 있지만 유니온 인터페이스는 없다

    ```tsx
    type AorB = "a" | "b";
    ```

    - 유니온 타입 확장이 필요한 경우

      ```tsx
      type Input = {
        /* ... */
      };
      type Output = {
        /* ... */
      };
      interface VariableMap {
        [name: string]: Input | Output;
      }
      ```

  - 유니온 타입에 추가 속성을 붙인 타입 만들기

    ```tsx
    type NamedVariable = (Input | Output) & { name: string };
    ```

    → 인터페이스로 표현 불가!

  - 튜플과 배열 타입

    ```tsx
    type Pair = [number, number];
    type StringList = string[];
    type NamedNums = [string, ...number[]];
    ```

    - 인터페이스로 튜플과 비슷하게 구현하기 (제한적, 튜플 메서드 사용 불가)

      ```tsx
      interface Tuple {
        0: number;
        1: number;
        length: 2;
      }
      const t: Tuple = [10, 20]; // 정상
      ```

  - 타입에는 없는 인터페이스의 보강 기능 (선언 병합)

    ```tsx
    interface IState {
      name: string;
      capital: string;
    }
    interface IState {
      population: number;
    }
    const wyoming: IState = {
      name: "Wyoming",
      capital: "Cheyenne",
      population: 500_000,
    }; // 정상
    ```

    - 타입스크립트는 여러 버전의 자바스크립트 표준 라이브러리에서 타입을 모아 병합한다
    - 타입은 기존 타입에 추가적인 보강이 없는 경우에만 사용해야 한다

- 복잡한 타입이라면 타입 별칭을, 간단한 객체 타입이라면 인터페이스를 사용하자

- 👩‍🏫 하지만 무엇보다 일관성이 가장 중요!

---

## 아이템 14: 타입 연산과 제너릭 사용으로 반복 줄이기

- 타입에 이름 붙이기

  - 타입이 반복적으로 등장하는 함수

    ```tsx
    function distance(
      a: { x: number; y: number },
      b: { x: number; y: number }
    ) {
      return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    ```

  - 타입에 이름을 붙여 개선하기

    ```tsx
    interface Point2D {
      x: number;
      y: number;
    }
    function distance(a: Point2D, b: Point2D) {
      /* ... */
    }
    ```

- 함수의 타입 시그니처 개선하기

  - 몇몇 함수가 같은 타입 시그니처를 공유하는 경우

    ```tsx
    function get(url: string, opts: Options): Promise<Response> {
      /* ... */
    }
    function post(url: string, opts: Options): Promise<Response> {
      /* ... */
    }
    ```

  - 해당 시그니처를 명명된 타입으로 분리하기

    ```tsx
    type HTTPFunction = (url: string, opts: Options) => Promise<Response>;
    function get: HTTPFunction = (url, opts) => { /* ... */ }
    function post: HTTPFunction = (url, opts) => { /* ... */ }
    ```

- 인터페이스를 확장하여 반복 제거하기

  ```tsx
  interface Person {
    firstName: string;
    lastName: string;
  }

  interface PersonWithBirthDate extends Person {
    birth: Date;
  }
  ```

- 이미 존재하는 타입을 확장하는 경우 인터섹션 연산자(`&`) 사용하기

  ```tsx
  type PersonWithBirthDate = Person & { birth: Date };
  ```

- 전체 애플리케이션의 상태를 표현하는 `State` 타입과 부분만 표현하는 `TopNavState` 합치기

  ```tsx
  interface State {
    userId: string;
    pageTitle: string;
    recentFiles: string[];
    pageContents: string;
  }
  interface TopNavState {
    userId: string;
    pageTitle: string;
    recentFiles: string[];
  }
  ```

  - ‘매핑된 타입’ 사용하기

    ```tsx
    type TopNavState = {
      [k in "userId" | "pageTitle" | "recentFiles"]: State[k];
    };
    ```

  - 유틸 타입 `Pick` 사용하기

    ```tsx
    type TopNavState = Pick<State, "userId" | "pageTitle" | "recentFiles">;
    ```

- 태그된 유니온에서 인덱싱하기

  ```tsx
  interface SaveAction {
    type: "save";
    // ...
  }
  interface LoadAction {
    type: "load";
    // ...
  }
  type Action = SaveAction | LoadAction;
  type ActionType = Action["type"]; // 타입은 'save' | 'load'
  ```

- 타입을 선택적 필드를 포함하는 타입으로 변환하기

  ```tsx
  interface Options {
    width: number;
    height: number;
    color: string;
    label: string;
  }
  interface OptionsUpdate {
    width?: number;
    height?: number;
    color?: string;
    label?: string;
  }
  ```

  - 매핑된 타입과 `keyof` 사용하기

    ```tsx
    type OptionsUpdate = { [k in keyof Options]?: Options[k] };
    ```

  - 유틸 타입 `Partial` 사용하기

    ```tsx
    type OptionsUpdate = Partial<Options>;
    ```

- 값의 형태에 해당하는 타입을 정의하고 싶은 경우

  ```tsx
  const INIT_OPTIONS = {
    width: 640,
    height: 480,
    color: "#00FF00",
    label: "VGA",
  };

  type Options = typeof INIT_OPTIONS;
  ```

- 함수나 메서드의 반환 값에 명명된 타입 만들기

  ```tsx
  function getUserInfo(userId: string) {
    // ...
    return { userId, name, age, height, weight, favoriteColor };
  }
  // 추론된 반환 타입은 { userId: string; name: string; age: number, ... };
  ```

  - `ReturnType` 제네릭 사용하기

    ```tsx
    type UserInfo = ReturnType<typeof getUserInfo>;
    ```

- 제너릭 타입에서 매개변수 제한하기

  ```tsx
  interface Name {
    first: string;
    last: string;
  }
  type DancingDuo<T extends Name> = [T, T];

  const couple1: DancingDuo<{ first: string }> = [
    { first: "Sonny" },
    { first: "Cher" },
  ]; // 🚨 에러
  ```

  - `extends`를 사용하여 `Pick`의 정의 완성하기

    ```tsx
    type Pick<T, K extends keyof T> = {
      [k in K]: T[k];
    };

    type FirstLast = Pick<Name, "first" | "last">; // 정상
    type FirstMiddle = Pick<Name, "first" | "middle">; // 🚨 에러
    ```

---

## 아이템 15: 동적 데이터에 인덱스 시그니처 사용하기

- 타입스크립트에서는 타입에 ‘인덱스 시그니처’를 명시하여 유연하게 매핑을 표현

  ```tsx
  type Rocket = { [property: string]: string };
  const rocket: Rocket = {
    name: "Falcon 9",
    variant: "v1.0",
    thrust: "4,940 kN",
  }; // 정상
  ```

  - `{[property: string]: string}` - 키의 이름(키의 위치만 표시하는 용도)/ 키의 타입/ 값의 타입
    → 🚨 자동완성, 정의로 이동, 이름 바꾸기 등에서 문제 발생

  - 인덱스 시그니처는 부정확하므로 인터페이스 사용

    ```tsx
    interface Rocket {
      name: string;
      variant: string;
      thrust_kN: number;
    }
    ```

- 인덱스 시그니처는 동적 데이터를 표현할 때 사용한다

  - CSV 파일의 데이터 행을 열 이름과 값으로 매핑하는 객체로 나타내고 싶은 경우, 열 이름이 무엇인지 미리 알 방법이 없을 때

    ```tsx
    function parseCSV(input: string): { [columnName: string]: string }[] {
      const lines = input.split("\n");
      const [header, ...rows] = lines;
      const headerColumns = header.split(",");
      return rows.map((rowStr) => {
        const row: { [columnName: string]: string } = {};
        rowStr.split(",").forEach((cell, i) => {
          row[headerColumns[i]] = cell;
        });
        return row;
      });
    }
    ```

  - 👩‍🏫연관 배열의 경우, 객체에 인덱스 시그니처를 사용하는 대신 `Map` 타입을 사용하는 것을 고려

- 어떤 타입에 가능한 필드가 제한되어 있는 경우라면 인덱스 시그니처로 모델링하지 말아야 한다

  ```tsx
  interface Row1 {
    [column: string]: number;
  } // 너무 광범위
  interface Row2 {
    a: number;
    b?: number;
    c?: number;
    d?: number;
  } // 최선
  type Row3 =
    | { a: number }
    | { a: number; b: number }
    | { a: number; b: number; c: number }
    | { a: number; b: number; c: number; d: number }; // 가장 정확하지만 사용하기 번거로움
  ```

  - `Record` 사용하기

    ```tsx
    type Vec3D = Record<"x" | "y" | "z", number>;
    ```

  - 매핑된 타입 사용하기

    ```tsx
    type Vec3D = { [k in "x" | "y" | "z"]: number };
    type ABC = { [k in "a" | "b" | "c"]: k extends "b" ? string : number };
    ```

    → 키마다 별도의 타입 사용 가능

---

## 아이템 16: number 인덱스 시그니처보다는 Array, 튜플, ArrayLike를 사용하기

- 자바스크립트 객체의 키는 문자열만 가능

  - 숫자는 키로 사용 불가
  - 배열의 인덱스도 사실은 문자열

- 타입스크립트는 숫자 키를 허용하고, 문자열 키와 다른 것으로 인식

  - `Array`의 타입 선언(`lib.es5.d.ts`)

    ```tsx
    interface Array<T> {
      // ...
      [n: number]: T;
    }
    ```

- 인덱스 시그니처가 `number`로 표현되어 있다면 입력한 값이 `number`여야 한다는 것을 의미하지만, 실제 런타임에 사용되는 키는 `string` 타입이다

- 만약 숫자로 인덱싱을 한다면 **`Array`** 또는 **`튜플`** 타입을 사용하는 것을 권장

- 🤔 그러나 Array의 메서드를 사용하고자 하는 게 아니라면?

  → `ArrayLike` 타입을 사용

  ```tsx
  function checkedAccess<T>(xs: ArrayLike<T>, i: number): T {
    if (i < xs.length) {
      return xs[i];
    }
    throw new Error("...");
  }
  ```

  - `ArrayLike`는 **길이**와 **인덱스 시그니처**만 있다
  - `ArrayLike`도 키는 여전히 **문자열**

---

## 아이템 17: 변경 관련된 오류 방지를 위해 readonly 사용하기

- 함수 파라미터로 넘어가는 배열의 변경을 방지

- `readonly`

  - 배열의 요소를 읽을 수 있지만, 쓸 수는 없다
  - length를 읽을 수 있지만, 바꿀 수는 없다
  - 배열을 변경하는 `pop`을 비롯한 다른 메서드를 호출할 수 없다

- `number[]` 는 `readonly number[]` 의 서브타입

- 매개변수를 `readonly`로 선언하면?

  - 타입스크립트는 매개변수가 함수 내에서 변경이 일어나는지 체크한다
  - 호출하는 쪽에서는 함수가 매개변수를 변경하지 않는다는 보장을 받게 된다
  - 호출하는 쪽에서 함수에 `readonly` 배열을 매개변수로 넣을 수도 있다

- 자바스크립트에서는 기본적으로 함수가 매개변수를 변경하지 않는다고 가정하지만, 이러한 암묵적인 방법은 타입 체크에 문제를 일으킬 수 있다

- 어떤 함수를 `readonly` 로 만들면, 그 함수를 호출하는 다른 함수들도 모두 `readonly`로 만들어야 한다
  → 타입의 안전성을 높인다

- `readonly` 배열을 조작하는 방법

  - `arr.length = 0` 대신 `arr = []`
  - `arr.push('abc')` 대신 `arr = arr.concat(['abc'])`

- `readonly`는 얕게(shallow) 동작한다

  - 객체로 구성된 `readonly` 배열이 있다면, 그 객체 자체는 `readonly`가 아니다

  - 객체에 사용할 때는 `Readonly` 제네릭을 사용

    ```tsx
    interface Outer {
      inner: {
        x: number;
      };
    }

    const o: ReadOnly<Outer> = { inner: { x: 0 } };
    o.inner = { x: 1 }; // 🚨 에러
    o.inner.x = 1; // 정상
    ```

    - cf) ts-essentials의 `DeepReadonly` 제네릭

  - 인덱스 시그니처에 `readonly`를 사용하면 객체 속성 변경 방지 가능

---

## 아이템 18: 매핑된 타입을 사용하여 값을 동기화하기

- 여러번 반복되는 타이핑 줄이기

  ```tsx
  interface ScatterProps {
    xs: number[];
    ys: number[];
    xRange: [number, number];
    yRange: [number, number];
    color: string;
    onClick: (x: number, y: number, index: number) => void;
  }

  const REQUIRES_UPDATE: { [k in keyof ScatterProps]: boolean } = {
    xs: true,
    ys: true,
    xRange: true,
    yRange: true,
    color: true,
    onClick: false,
  };

  function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
    let k: keyof ScatterProps;
    for (k in oldProps) {
      if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
        return true;
      }
    }
    return false;
  }
  ```

  - 매핑된 타입을 사용해서 관련된 값과 타입을 동기화할 수 있다
  - 인터페이스에 새로운 속성을 추가할 때, 선택을 강제하도록 매핑된 타입을 고려하자!
