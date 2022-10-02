---
title: 이펙티브 타입스크립트 6장
date: 2022-01-06 09:29:03
tags: effective-typescript
thumbnailImage: https://i.imgur.com/cKyZ5Kn.jpg
---

타입 선언과 @types

<!-- more -->

---

## 아이템 45: devDependencies에 typescript와 @types 추가하기

- npm의 의존성 구분

  - dependencies - 현재 프로젝트 실행 시 필수적인 라이브러리
  - devDependencies - 런타임에는 필요없는 라이브러리
  - peerDependencies - 런타임에 필요하긴 하지만, 의존성을 직접 관리하지 않는 라이브러리

- 타입스크립트는 개발 도구일 뿐이고 타입 정보는 런타임에 존재하지 않기 때문에, 타입스크립트와 관련된 라이브러리는 일반적으로 devDependencies에 속한다

- 타입스크립트 프로젝트에서 고려해야 할 의존성

  1. 타입스크립트 자체 의존성

  - 타입스크립트를 시스템 레벨로 설치하기보다는 devDependencies에 넣는 것을 권장한다
    → `npm install` 시 팀원들 모두 항상 정확한 버전의 타입스크립트 설치 가능
  - 대부분의 타입스크립트 IDE와 빌드 도구는 devDependencies를 통해 설치된 타입스크립트의 버전을 인식할 수 있다

  1. 타입 의존성(`@types`)을 고려

  - `DefinitelyTyped`에서 라이브러리에 대한 타입 정보를 얻을 수 있다
  - `@types` 라이브러리는 타입 정보만 포함하고 있으며 구현체는 포함하지 않는다
  - 원본 라이브러리 자체가 dependencies에 있더라도 `@types` 의존성은 devDependencies에 있어야 한다

---

## 아이템 46: 타입 선언과 관련된 세 가지 버전 이해하기

- 타입스크립트 사용 시 고려해야 할 사항

  - 라이브러리의 버전
  - 타입 선언(`@types`)의 버전
  - 타입스크립트의 버전

- 타입스크립트에서 의존성을 사용하는 방식

  - 특정 라이브러리는 dependencies로, 타입 정보는 devDependencies로 설치

- 실제 라이브러리와 타입 정보의 버전이 별도로 관리되는 방식의 문제점

  1. 라이브러리를 업데이트했지만 실수로 타입 선언은 업데이트하지 않은 경우

  - 타입 선언도 업데이트하여 라이브러리와 버전을 맞춘다
  - 보강 기법 또는 타입 선언의 업데이트를 직접 작성한다

  2. 라이브러리보다 타입 선언의 버전이 최신인 경우

  - 라이브러리 버전을 올리거나 타입 선언의 버전을 내리기

  3. 프로젝트에서 사용하는 타입스크립트 버전보다 라이브러리에서 필요로 하는 타입스크립트 버전이 최신인 경우

  - 타입스크립트의 최신 버전을 사용한다
  - 라이브러리 타입 선언의 버전을 내리거나, `declare module` 선언으로 라이브러리의 타입 정보를 없애 버린다

  4. `@types` 의존성이 중복되는 경우

  - ex) `@types/bar`가 현재 호환되지 않는 버전의 `@types/foo`에 의존하는 경우

    - 전역 네임스페이스에 있는 타입 선언 모듈인 경우 중복 문제가 발생한다.
      → 서로 버전이 호환되도록 업데이트한다

  - 일부 라이브러리는 자체적으로 타입 선언을 포함(번들링)한다.

    - `package.json` 의 `types` 필드가 `.d.ts` 파일을 가리키도록 되어 있다
    - 버전 불일치 문제를 해결할 수 있지만, 네 가지 부수적인 문제점이 있다
      1. 번들된 타입 선언에 보강 기법으로 해결할 수 없는 오류가 있는 경우, 또는 공개 시점에는 잘 동작했지만 타입스크립트 버전이 올라가면서 오류가 발생하는 경우 - 번들된 타입에서는 `@types`의 버전 선택 불가능
      2. 프로젝트 내의 타입 선언이 다른 라이브러리의 타입 선언에 의존하는 경우 - devDependencies에 들어간 의존성을 다른 사용자는 설치할 수 없기 때문
         → `DefinitelyTyped`에 타입 선언을 공개하여 타입 선언을 `@types`로 분리한다
      3. 프로젝트의 과거 버전에 있는 타입 선언에 문제가 있는 경우
         → 과거 버전으로 돌아가서 패치 업데이트를 한다
      4. 타입 선언의 패치 업데이트를 자주 하기 어렵다는 문제

- 잘 작성된 타입 선언은 라이브러리를 올바르게 사용하는 방법에 도움이 되며 생산성을 크게 향상시킨다

- 라이브러리 공개 시, 타입 선언을 자체적으로 포함하는 것과 타입 정보만 분리하여 `DefinitelyTyped`에 공개하는 것의 장단점을 비교해 보자

- 라이브러리가 타입스크립트로 작성된 경우만 타입 선언을 라이브러리에 포함하는 것을 권장한다

---

## 아이템 47: 공개 API에 등장하는 모든 타입을 익스포트하기

- 라이브러리 제작자는 프로젝트 초기에 타입 익스포트부터 작성해야 한다

  - 타입을 익스포트하지 않았을 경우

    ```tsx
    interface SecretName {
      first: string;
      last: string;
    }

    interface SecretSanta {
      name: SecretName;
      gift: string;
    }

    export function getGift(name: SecretName, gift: string): SecretSanta {
      // ...
    }
    ```

    - 해당 라이브러리 사용자는 `SecretName` 또는 `SecretSanta` 를 직접 임포트할 수 없고, `getGift`만 임포트할 수 있다

  - `Parameters`와 `ReturnType`을 이용해 추출하기

    ```tsx
    type MySanta = ReturnType<typeof getGift>; // SecretSanta
    type MyName = Parameters<typeof getGift>[0]; // SecretName
    ```

→ 사용자가 추출하기 전에 공개 메서드에 사용된 타입은 익스포트하자!

---

## 아이템 48: API 주석에 TSDoc 사용하기

- 함수 주석에 `// ...` 대신 JSDoc 스타일의 `/** ... **/` 을 사용하면 대부분의 편집기는 함수 사용부에서 주석을 툴팁으로 표시해 준다

- 타입스크립트 관점의 TSDoc

  ```tsx
  /**
   * Generate a greeting
   * @param name Name of the person to greet
   * @param title ...
   * returns ...
   */
  function greetFullTSDoc(name: string, title: string) {
    return `Hello ${title} ${name}`;
  }
  ```

- 타입 정의에 TSDoc 사용하기

  ```tsx
  /** 특정 시간과 장소에서 수행된 측정 */
  interface Measurement {
    /** 어디에서 측정되었나? */
    position: Vector3D;
    /** 언제 측정되었나? */
    time: number;
    /** 측정된 운동량 */
    momentum: Vector3D;
  }
  ```

  → `Measurement` 객체의 각 필드에 마우스를 올려 보면 필드별로 설명을 볼 수 있다

- 😮 주의! 타입스크립트에서는 타입 정보가 코드에 있기 때문에 TSDoc에서는 타입 정보를 명시하면 안 된다

---

## 아이템 49: 콜백에서 this에 대한 타입 제공하기

- 자바스크립트에서 this는 다이나믹 스코프

  - ‘정의된’ 방식이 아니라 ‘호출된’ 방식에 따라 달라진다

- 타입스크립트는 자바스크립트의 this 바인딩을 그대로 모델링한다

- this를 사용하는 콜백 함수에서 this 바인딩 문제 해결하기

  - 콜백 함수의 매개변수에 this를 추가하고, 콜백 함수를 `call`로 호출하는 방법

    ```tsx
    function addKeyListener(
      el: HTMLElement,
      fn: (this: HTMLElement, e: KeyboardEvent) => void
    ) {
      el.addEventListener("keydown", (e) => {
        fn.call(el, e);
      });
    }
    ```

    - 👩‍🏫 이때 반드시 `call` 을 사용해야 한다

  - 만약 라이브러리 사용자가 콜백을 화살표 함수로 작성하고 this를 참조하려고 하면 타입스크립트가 문제를 잡아낸다

    ```tsx
    class Foo {
      registerHandler(el: HTMLElement) {
        addKeyListener(el, (e) => {
          this.innerHTML; // 🚨 'Foo' 유형에 'innerHTML' 속성이 없습니다
        });
      }
    }
    ```

- 콜백 함수에서 this 값을 사용해야 한다면 this는 API의 일부가 되는 것이기 때문에 반드시 타입 선언에 포함해야 한다

---

## 아이템 50: 오버로딩 타입보다는 조건부 타입을 사용하기

- 두 가지 타입의 매개변수를 받는 함수

  ```tsx
  function double(x: number | string): number | string;
  function double(x: any) {
    return x + x;
  }

  const num = double(12); // string | number
  const str = double("x"); // string | number
  ```

  - 선언문에는 `number` 타입을 매개변수로 넣고 `string` 타입을 반환하는 경우도 포함되어 있다

  → 제네릭을 사용하여 동작을 모델링할 수 있다

  ```tsx
  function double<T extends number | string>(x: T): T;
  function double(x: any) {
    return x + x;
  }

  const num = double(12); // 타입이 12
  const str = double("x"); // 타입이 'x' (😮 string을 원하고 있다.)
  ```

  → 타입이 너무 과하게 구체적인 문제

- 조건부 타입

  - 타입 공간의 if 구문

    ```tsx
    function double<T extends number | string>(
      x: T
    ): T extends string ? string : number;
    function double(x: any) {
      return x + x;
    }
    ```

  - 개별 타입의 유니온으로 일반화하기 때문에 타입이 더 정확해진다

  - 각각이 독립적으로 처리되는 타입 오버로딩과 달리, 조건부 타입은 타입 체커가 단일 표현식으로 받아들이기 때문에 유니온 문제를 해결할 수 있다

---

## 아이템 51: 의존성 분리를 위해 미러 타입 사용하기

- CSV 파일을 파싱하는 라이브러리 작성 시 NodeJS 사용자를 위해 매개변수에 `Buffer` 타입을 허용하는 경우

  - `Buffer` 타입 정의를 위해 `@types/node` 패키지 필요
  - 그러나 다른 라이브러리 사용자들은 해당 패키지가 불필요하다

- 각자가 필요한 모듈만 사용할 수 있도록 구조적 타이핑 적용하기

  ```tsx
  interface CsvBuffer {
    toString(encoding: string): string;
  }
  function parseCSV(
    contents: string | CsvBuffer
  ): { [column: string]: string }[] {
    // ...
  }
  ```

  - `CsvBuffer`가 `Buffer` 타입과 호환되기 때문에 NodeJS 프로젝트에서도 사용 가능

    ```tsx
    parseCSV(new Buffer("column1, column2\nval2,val2", "utf-8"));
    ```

- **미러링**: 작성 중인 라이브러리가 의존하는 라이브러리의 구현과 무관하게 타입에만 의존한다면, 필요한 선언부만 추출하여 작성 중인 라이브러리에 넣는 것

- 다른 라이브러리의 타입이 아닌 구현에 의존하는 경우에도 동일한 기법을 적용할 수 있고 타입 의존성을 피할 수 있다

→ 유닛 테스트와 상용 시스템 간의 의존성을 분리하는 데도 유용하다

---

## 아이템 52: 테스팅 타입의 함정에 주의하기

- 타입 선언 테스트하기

  - 유틸리티 라이브러리에서 제공하는 `map` 함수의 타입 작성하기

    ```tsx
    declare function map<U, V>(array: U[], fn: (u: U) => V): V[];
    ```

  - 단순히 함수를 호출하는 테스트만으로는 반환값에 대한 체크가 누락될 수 있다 (’실행’에서의 오류만 검사한다)

- 반환값을 특정 타입의 변수에 할당하여 간단히 반환 타입을 체크할 수 있는 방법

  ```tsx
  const lengths: number[] = map(["john", "paul"], (name) => name.length);
  ```

  - `number[]` 타입 선언은 `map` 함수의 반환 타입이 `number[]` 임을 보장한다

- 그러나 테스팅을 위해 할당을 사용하는 방법에는 두 가지 문제가 있다

  1. 불필요한 변수를 만들어야 한다

  - 일반적인 해결책은 변수 도입 대신 헬퍼 함수를 정의하는 것이다

    ```tsx
    function assertType<T>(x: T) {}
    assertType<number[]>(map(["john", "paul"], (name) => name.length));
    ```

  1. 두 타입이 동일한지 체크하는 것이 아니라 할당 가능성을 체크한다

  - 객체의 타입을 체크하는 경우

    ```tsx
    const beatles = ["john", "paul", "george", "ringo"];
    assertType<{ name: string }[]>(
      map(beatles, (name) => ({
        name,
        inYellowSubmarine: name === "ringo",
      }))
    ); // 정상
    ```

    - 반환된 배열은 `{name: string}[]` 에 할당 가능하지만, `inYellowSubmarine` 속성에 대한 부분이 체크되지 않았다

  - 타입스크립트의 함수는 매개변수가 더 적은 함수 타입에 할당 가능하다는 문제

    ```tsx
    const double = (x: number) => 2 * x;
    assertType<(a: number, b: number) => number>(double); //  정상?!
    ```

  - `Parameters`와 `ReturnType` 제네릭 타입을 이용해 함수의 매개변수 타입과 반환 타입만 분리하여 테스트할 수 있다

    ```tsx
    const double = (x: number) => 2 * x;
    let p: Parameters<typeof double> = null;
    assertType<[number, number]>(p);
    // 🚨 '[number]' 형식의 인수는 '[number, number]' 형식의 매개변수에 할당될 수 없습니다
    let r: ReturnType<typeof double> = null;
    assertType<number>(r); // 정상
    ```

    - `map`의 콜백 함수에서 사용하게 되는 this 값에 대한 타입 선언 테스트
      ```tsx
      declare function map<U, V>(
        array: U[],
        fn: (this: U[], u: U, i: number, array: U[]) => V
      ): V[];
      ```

- 타입 시스템 내에서 암시적 `any` 타입을 발견하기 위해 DefinitelyTyped의 타입 선언을 위한 도구 `dtslint` 사용하기

  ```tsx
  const beatles = ["john", "paul", "george", "ringo"];
  map(
    beatles,
    function (
      name, // $ExpectType string
      i, // $ExpectType number
      array // $ExpectType string[]
    ) {
      this; // $ExpectType string[]
      return name.length; // $ExpectType number[]
    }
  );
  ```

  - `dtslint`는 할당 가능성을 체크하는 대신 각 심벌의 타입을 추출하여 글자 자체가 같은지 비교한다
