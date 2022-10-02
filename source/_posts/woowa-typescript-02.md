---
title: 우아한 타입스크립트 2부
date: 2021-12-19 13:59:34
tags: typescript
thumbnailImage: https://i.imgur.com/cKyZ5Kn.jpg
---

실전 타입스크립트 코드 작성하기

<!-- more -->

---

지난 8월 우아한테크세미나 발표 주제였던 [우아한 타입스크립트](https://www.youtube.com/watch?v=ViS8DLd6o-E&t=13s) 영상을 보고 정리한 내용이다.

👉 [1부 보러가기](https://zigsong.github.io/2021/12/19/woowa-typescript-01/)

---

## 1. Conditional Type 활용하기

- `Item<T>` - `T`에 따라 달라지는 container

  ```tsx
  interface StringContainer {
    value: string;
    format(): string;
    split(): string[];
  }

  interface NumberContainer {
    value: number;
    nearestPrime: number;
    rount(): number;
  }
  ```

- `T`가 `string`이면 StringContainer, 아니면 NumberContainer

  ```tsx
  type Item1<T> = {
    id: T,
    container: T extends string ? StringContainer : NumberContainer
  };

  const item1 = Item1<string> = {
    id: 'aaa',
    container: null;
  };
  ```

- `T`가 `string`도 `number`도 아니면 사용 불가

  ```tsx
  type Item2<T> = {
    id: T extends string | number ? T : never;
    container: T extends string
      ? StringContainer
      : T extends number
      ? NumberContainer
      : never;
  };

  const item2 = Item2<boolean> = {
    id: true, // 🚨 Type 'boolean' is not assignable to type 'never'
    container: null; // 🚨 Type 'null' is not assignable to type 'never'
  };
  ```

- `ArrayFilter<T>` - `T` 에 들어오는 요소들 중에 `Array` 만 필터링

  ```tsx
  type ArrayFilter<T> = T extends any[] ? T : never;

  type StringsOrNumbers = ArrayFilter<string | number | string | number[]>;

  // 1. string | number | string[] | number[]
  // 2. never | never | string[] | number[] -> 여기서 never는 사라짐
  // 3. string[] | number[]
  ```

- Table or Dino

  ```tsx
  interface Table {
    id: string;
    chairs: string[];
  }

  interface Dino {
    id: number;
    legs: number;
  }

  interface World {
    getItem<T extends string | number>(id: T): T extends string ? Table : Dino;
  }

  let world: World = null as any;

  const dino = world.getItem(10);
  const what = world.getItem(true); // 🚨 Argument of type 'boolean' is not assignable to parameter of type 'string | number'
  ```

- `Flatten<T>`

  ```tsx
  type Flatten<T> = T extends any[]
    ? T[number]
    : T extends object
    ? T[keyof T]
    : T; // 아마 primitive type

  const numbers = [1, 2, 3];
  type NumbersArrayFlattened = Flatten<typeof numbers>;
  // 1. number[]
  // 2. number

  const person = {
    name: "Zig",
    age: 25,
  };

  type SomeObjectFlattened = Flatten<typeof person>;
  // 1. 'name' | 'age'
  // 2. T['name' | 'age'] -> string | number

  const isMale = false;
  type SomeBooleanFlattened = Flatten<typeof isMale>;
  // false
  ```

- infer

  ```tsx
  type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;
  const promises = [Promise.resolve("Zig"), Promise.resolve(25)];

  type Expected = UnpackPromise<typeof promises>; // string | number
  ```

- 함수의 리턴 타입 알아내기 - `MyReturnType`

  ```tsx
  function plus1(seed: number): number {
    return seed + 1;
  }

  type MyReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
  ) => infer R
    ? R
    : any;

  // 컴파일타임의 typeof은 타입스크립트 타입을 반환
  type Id = MyReturnType<typeof plus1>;

  lookupEntity(plus1(10));

  function lookupEntity(id: Id) {
    // ...
  }
  ```

  - 👩‍🏫 여기서 제네릭은 **‘함수여야 하는’ 제약사항**을 의미한다

- 내장 conditional types(1)

  ```tsx
  // type Exclude<T, U> = T extends U ? never : T;
  type Excluded = Exclude<string | number, string>; // number - diff

  // type Extract<T, U> = T extends U ? T : never;
  type Extracted = Extract<string | number, string>; // string - filter

  // Pick<T, Exclude<keyof T, K>>; (Mapped Type)
  type Picked = Pick<{ name: string; age: number }, "name">;
  // 타입이 { name: string }

  // type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
  type Omited = Omit<{ name: string; age: number }, "name">;
  // 타입이 { age: number }

  // type NonNullable<T> = T extends null | undefined ? never : T;
  type NonNullabled = NonNullable<string | number | null | undefined>;
  // 타입이 string | number
  ```

  - mapped type - `keyof` 를 사용하는 타입 헬퍼

- 내장 conditional types(2)

  ```tsx
  type ReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
  ) => infer R
    ? R
    : any;

  type Parameters<T extends (...args: any) => any> = T extends (
    ...args: infer P
  ) => any
    ? P
    : never;

  type MyParameters = Parameters<(name: string, age: number) => void>;
  // [name: string, age: number]
  ```

- 내장 conditional types(3)

  ```tsx
  interface Constructor {
    new (name: string, age: number): string;
  }

  type ConstructorParameters<T extends new (...args: any) => any> =
    T extends new (...args: infer P) => any ? P : never;

  type MyConstructorParameters = ConstructorParameters<Constructor>;
  // [name: string, age: number]

  type InstanceType<T extends new (...args: any) => any> = T extends new (
    ...args: any
  ) => infer R
    ? R
    : any;

  type MyInstanceType = InstanceType<Constructor>; // string
  ```

  → 👩‍🏫 여기서 제네릭은 `new` 키워드가 있어야 한다는 **제약사항!**

  **⇒ 이런 식으로 내장타입을 찾아가면서 공부해야 한다**

- `Function`인 프로퍼티 찾기

  ```tsx
  type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
  }[keyof T];
  type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

  type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T];
  type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

  interface Person {
    id: number;
    name: string;
    hello(message: string): void;
  }

  type T1 = FunctionPropertyNames<Person>; // 타입이 'hello'
  type T2 = NonFunctionPropertyNames<Person>; // 타입이 'id' | 'name'
  type T3 = FunctionProperties<Person>; // 타입이 '{ hello: (message: string) => void; }'
  type T4 = NonFunctionProperties<Person>; // 타입이 '{ id: number; name: string; }'
  ```

---

## 2. Overloading을 활용하기

- 자바스크립트는 오버로딩이 불가능

- 타입스크립트의 오버로딩

  - 이름은 같지만 시그니처가 다른 형태

  - 타입스크립트의 오버로딩에서 로직 구현은 함수 안에서 (런타임에) 알아서 하게 되므로, 타이핑만 명시한다

    ```tsx
    function shuffle(value: string): string;

    function shuffle<T>(value: T[]): T[];

    function shuffle(value: string | any[]): string | any[] {
      if (typeof value === "string") {
        return value
          .split("")
          .sort(() => Math.random() - 0.5)
          .join("");
      }
      return value.sort(() => Math.random() - 0.5);
    }

    shuffle("Hello, Zig!");
    shuffle(["Hello", "Zig", "long", "time", "no", "see"]);
    shuffle([1, 2, 3, 4, 5]);
    ```

    → 함수 호출 시 IDE가 시그니처를 알려줌

  - 이때 위 두 개의 시그니처를 모두 허용할 수 있는 형태로 함수 바디를 구현해야 함

- 클래스의 메서드 오버로딩

  ```tsx
  class ExportLibraryModal {
    public openComponentsToLibrary(
      libraryId: string,
      componentIds: string[]
    ): void;
    public openComponentsToLibrary(componentIds: string[]): void;
    public openComponentsToLibrary(
      libraryIdOrComponentIds: string | string[],
      componentIds?: string[]
    ): void {
      if (typeof libraryIdOrComponentIds === "string") {
        if (componentIds !== undefined) {
          // 첫 번째 시그니처
          libraryIdOrComponentIds;
          componentIds;
        }
      }

      if (componentIds === undefined) {
        // 첫 번째 시그니처
        libraryIdOrComponentIds;
      }
    }
  }
  ```

---

### 3. readonly, as const를 남발하기

- `ReadonlyArray<T>`와 `as const`

  ```tsx
  class Layer {
    id!: string;
    name!: string;
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
  }

  const LAYER_DATA_INITIALIZE_INCLUDE_KEYS: ReadonlyArray<keyof Layer> = [
    "x",
    "y",
    "width",
    "height",
  ];

  const x = LAYER_DATA_INITIALIZE_INCLUDE_KEYS[0];
  // 'id' | 'name' | 'x' | 'y' | 'width' | 'height'
  const LAYER_DATA_INITIALIZE_INCLUDE_KEYS = ["id", "name"] as const;
  const id = LAYER_DATA_INITIALIZE_INCLUDE_KEYS[0]; // 'id'
  ```

- `ReadonlyArray<T>`

  ```tsx
  const weekdays: ReadonlyArray<string> = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  weekdays[0]; // readonly string[]
  weekdays[0] = "Fancyday"; // 🚨 Index signature in type 'readonly string[]' only permits reading
  ```

- `as const`

  ```tsx
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;

  weekdays[0]; // 'Sunday'
  weekdays[0] = "Fancyday"; // 🚨 Cannot assign to '0' because it is a read-only property
  ```

- Mapped Types

  ```tsx
  interface IPerson {
    name: string;
    age: number;
  }

  type ReadonlyPerson = Readonly<IPerson>;

  const person: ReadonlyPerson = Object.freeze<IPerson>({
    name: "Zig",
    age: 25,
  });

  person.name = "Sun"; // 🚨
  person.age = 27; // 🚨
  ```

- 타입도 map을 돌면서 하나하나 `readonly`로 바꿔줄 수 있다

  ```tsx
  interface IPerson {
    name: string;
    age: number;
  }

  type Nullable<T> = {
    [P in keyof T]: T[P] | null;
  };

  type Stringify<T> = {
    [P in keyof T]: string;
  };

  type PartialNullablePerson = Partial<Nullable<Stringify<IPerson>>>;
  /*
  type PartialNullablePerson = {
    name?: string | null | undefined;
    age?: string | null | undefined;
  }
  */

  let pnp: PartialNullablePerson;
  pnp = { name: "Zig", age: 25 };
  pnp = { name: "Zig" };
  pnp = { name: undefined, age: null };
  ```

- 내장된 Mapped Types

  ```tsx
  type Partial<T> = {
    [P in keyof T]?: T[P];
  };

  type Required<T> = {
    [P in keyof T]-?: T[P];
  };
  // 💡 -?: 모든 optional을 제거해줌

  type Readonly<T> = {
    readonly [P in keyof T]: T[P];
  };

  type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  type Record<K extends keyof any, T> = {
    [P in K]: T;
  };
  ```

- `Readonly<T>`

  ```tsx
  interface Book {
    title: string;
    author: string;
  }

  interface IRootState {
    book: {
      books: Book[];
      loading: boolean;
      error: Error | null;
    };
  }

  type IReadonlyRootState = Readonly<IRootState>;
  let state1: IReadonlyRootState = {} as IReadonlyRootState;
  const book1 = state1.book.books[0];
  book1.title = "new"; // 😮 값이 바뀐다! depth가 깊기 때문
  ```

  **→ `DeepReadonly<T>` 를 사용**

  ```tsx
  type DeepReadonly<T> = T extends (infer E)[]
    ? ReadonlyArray<DeepReadonlyObject<E>>
    : T extends object
    ? DeepReadonlyObject<T>
    : T;

  type DeepReadonlyObject<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

  type IDeepReadonlyRootState = DeepReadonly<IRootState>;
  let state2: IDeepReadonlyRootState = {} as IDeepReadonlyRootState;
  const book2 = state2.book.books[0];
  book2.title = "new"; // 🚨
  ```

- readonly keyword in return type

  - return값이 배열이나 튜플인 경우

    ```tsx
    function freturn1(): string[] {
      return ["readonly"];
    }

    const fr1 = freturn1();
    fr1[0] = "hello"; // 🤔 가능

    function freturn2(): readonly string[] {
      return ["readonly"];
    }

    const fr2 = freturn2();
    fr2[0] = "hello"; // 🚨
    ```

---

## 4. optional type보단 Union Type을 사용하기

- Result1은 optional type

  - r1의 데이터가 있으면 error는 null이고 loading은 false

    ```tsx
    type Result1<T> = {
      data?: T;
      error?: Error;
      loading: boolean;
    };

    declare function getResult1(): Result1<string>;

    const r1 = getResult1();
    r1.data; // string | undefined
    r1.error; // Error | undefined
    r1.loading; // boolean

    if (r1.data) {
      r1.error; // Error | undefined (😮 data가 있을 때는 error가 있으면 안되는데)
      r1.loading; // boolean
    }
    ```

- Result2는 union type

  - `in` operator type guard를 활용하여 r2를 제한시키기

    ```tsx
    type Result2<T> =
      | { loading: true }
      | { data: T; loading: false }
      | { error: Error; loading: false };

    declare function getResult2(): Result2<string>;

    const r2 = getResult2();
    r2.data; // 🚨 Property 'data' does not exist on type '{ loading: true }'
    r2.error; // 🚨 Property 'error' does not exist on type '{ loading: true }'
    r2.loading; // boolean

    if ("data" in r2) {
      r2.error; // 🚨
      r2.loading; // false
    }
    ```

- Result3은 union type

  - type guard를 활용하여 r3을 명시적으로 제한시키기

    ```tsx
    type Result3<T> =
      | { type: "pending"; loading: true }
      | { type: "success"; data: T; loading: false }
      | { type: "fail"; error: Error; loading: false };

    declare function getResult3(): Result3<string>;

    const r3 = getResult3();

    if (r3.type === "success") {
      r3; // { type: 'success'; data: string; loading: false; }
    } else if (r3.type === "pending") {
      r3; // { type: 'pending'; loading: true; }
    } else if (r3.type === "fail") {
      r3; // { type: 'fail', error: Error; loading: false; }
    } else {
      // ...
    }
    ```

---

## 5. never 활용하기

- Toast는 모두 type을 가지고 type은 enum 중 하나를 가지는 경우

  ```tsx
  enum ToastType {
    AFTER_SAVED,
    AFTER_PUBLISHED,
    AFTER_RESTORE,
  }

  interface Toast {
    type: ToastType,
    createdAt: string,
  }

  const toasts: Toast[] = [...];
  ```

- if와 else if로 이루어진

  잘못된 추론

  ```tsx
  // toastNodes1 -> (JSX.Element | undefined)[]
  // 😮 왜 undefined도 있을까?
  const toastNodes1 = toasts.map((toast) => {
    if (toast.type === ToastType.AFTER_SAVED) {
      return (
        // ...
      )
    } else if (toast.type === ToastType.AFTER_PUBLISHED) {
      return (
        // ...
      )
    } else if (toast.type === ToastType.AFTER_RESTORE) {
      return (
        // ...
      )
    }
  });
  ```

  → 무조건 `else` 구문도 넣어야 한다! (그러면 리턴타입이 `JSX.Element[]`만 나옴)

- 🤔 새로운 `ToastType`이 추가된다면?

  → 마지막 else에 `never` 를 검사

  ```tsx
  const toastNodes2 = toasts.map((toast) => {
    if (toast.type === ToastType.AFTER_SAVED) {
      // ...
    } else if (toast.type === ToastType.AFTER_PUBLISHED) {
      // ...
    } else if (toast.type === ToastType.AFTER_RESTORE) {
      // ...
    } else {
      return neverExpected(toast.type);
    }
  });

  function neverExpected(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
  }
  ```

  → `switch`와 `default never`를 통한 처리

  ```tsx
  const toastNodes3 = toasts.map((toast) => {
    switch(toast.type) {
      case ToastType.AFTER_SAVED:
        return (
          // ...
        );
      case ToastType.AFTER_PUBLISHED:
        return (
          // ...
        );
      case ToastType.AFTER_RESTORE:
        return (
          // ...
        );
      default:
        return neverExpected(toast.type);
    }
  });
  ```

---

## 정리

`infer` 키워드는 정말 처음이다. 그 누구도 알려주지 않았었는데 유용하게 활용할 수 있을 듯하다. 그동안 두려움의 대상이었던(!) `<T extends K>`를 비롯한 그 확장 버전 타입들에 대해서도 도전 정신이 불타오른다.🔥

`Pick`, `Omit` 등의 유틸리티 타입 뿐 아니라 `ReturnType`, `ParameterType` 등 함수에서 뽑아낼 수 있는 타입들의 실제 구현부를 함께 배울 수 있어서 좋았다. 정리하면서 2번째 다시 훑는 중이지만, 일하면서도 다시 여러번 참고해볼 만한 알차고 멋진 발표였다. 👍
