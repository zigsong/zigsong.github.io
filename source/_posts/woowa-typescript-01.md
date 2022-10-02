---
title: 우아한 타입스크립트 1부
date: 2021-12-19 14:11:53
tags: typescript
thumbnailImage: https://i.imgur.com/cKyZ5Kn.jpg
---

타입시스템 올바르게 사용하는 법

<!-- more -->

---

지난 8월 우아한테크세미나 발표 주제였던 [우아한 타입스크립트](https://www.youtube.com/watch?v=ViS8DLd6o-E&t=13s) 영상을 보고 정리한 내용이다.

---

## 1. 작성자와 사용자

타입스크립트의 타입 시스템은 컴파일러에게 타입을 명시적으로 지정하거나, 컴파일러가 자동으로 타입 추론하게끔 할 수 있다. 형태를 정해둔 함수의 경우 구현자와 사용자가 모두 이해할 수 있는 타입 구문을 작성해야 한다.

타입이란 해당 변수가 할 수 있는 일을 결정한다. 매개변수의 타입이 없는 자바스크립트는 함수 사용법에 대한 오해를 야기할 수 있다. 타입스크립트의 추론에 의지하는 경우, 함수의 매개변수 타입을 지정하지 않고 타입스크립트 컴파일러가 리턴타입을 추론하게끔 한다.

- **`noImplicitAny` 옵션**

  - 타입을 명시적으로 지정하지 않은 경우, 타입스크립트가 추론 중 `any` 라고 판단하게 되면 컴파일 에러를 발생시킨다.

    ```tsx
    // 🚨 Parameter 'a' implicitly has an 'any' type
    function f(a) {
      return a * 25;
    }
    ```

  - 함수의 리턴타입을 명시하지 않은 경우

    ```tsx
    // 함수의 리턴타입은 number로 추론된다
    function f(a: number) {
      if (a > 0) {
        return a * 25;
      }
    }

    console.log(f(5)); // 125
    console.log(f(-5) + 5); // NaN 🚨 런타임과 컴파일타임의 타입이 다름
    ```

- **`strictNullChecks` 옵션**

  - 모든 타입에 자동으로 포함되어 있는 `null`과 `undefined`를 제거해준다.

    ```tsx
    // 명시적으로 지정하지 않은 함수의 리턴타입은 number | undefined로 추론된다
    function f(a: number) {
      if (a > 0) {
        return a * 25;
      }
    }

    console.log(f(-5) + 5); // 🚨 Object is possibly undefined
    ```

    👩‍🏫 작성자의 입장에서 바디의 추론을 정확하게 할 수 있도록 명시적으로 리턴타입을 지정해야 한다.

- **`noImplicitReturns` 옵션**

  - 함수 내에서 모든 코드가 값을 리턴하지 않으면, 컴파일 에러를 발생시킨다

    - ex) 조건문 등에 걸려서 `return` 하지 않는 경우

  - 매개변수에 object가 들어오는 경우

    ```tsx
    function f(a) {
      return; // ...
    }

    f({ name: "Zig", age: 25 });
    f({ name: "Zig" }); // 🚨
    ```

  - object literal type 또는 `interface`, `type`을 이용하여 커스텀한 타입을 만들 수 있다.

    ```tsx
    interface PersonInterface {
      name: string;
      age: number;
    }
    ```

---

## 2. interface와 type alias

- structural type system - 구조가 같으면 같은 타입

- **nominal type system - 구조가 같아도 이름이 다르면 다른 타입**

- 타입스크립트에서 이름 기반의 nominal type system을 사용하는 방법

  ```tsx
  type PersonID = string & { readonly brand: unique symbol };

  function PersonID(id: string): PersonID {
    return id as PersonID;
  }

  function getPersonById(id: PersonID) {}

  getPersonById(PersonID("id-aaaaaa"));
  getPersonById("id-aaaaaa");
  // 🚨 Argument of type 'string' is not assignable to parameter of type 'PersonID'
  ```

---

## 3. 서브타입과 슈퍼타입

- 예제1

  ```tsx
  // sub1 타입은 sup1 타입의 서브타입
  let sub1: 1 = 1;
  let sup1: number = sub1;
  sub1 = sup1; // 🚨 Type 'number' is not assignable to type '1';
  ```

  ```tsx
  // sub2 타입은 sup2 타입의 서브 타입
  let sub2: number[] = [1];
  let sup2: object = sub2;
  sub2 = sup2; // 🚨 Type '{}' is missing the following properties from type 'number[]';
  ```

  ```tsx
  // sub3 타입은 sup3 타입의 서브 타입
  let sub3: [number, number] = [1, 2]; // 튜플, 2개만 들어갈 수 있음
  let sup3: number[] = sub3;
  sub3 = sup3; // 🚨 Type 'number[]' is not assignable to type '[number, number]'.
  ```

- 예제2

  ```tsx
  // sub4 타입은 sup4 타입의 서브 타입
  let sub4: number = 1;
  let sup4: any = sub4;
  sub4 = sup4;
  ```

  ```tsx
  // sub5 타입은 sup5 타입의 서브 타입
  let sub5: never = 0 as never;
  let sup5: number = sub5;
  sub5 = sup5; // 🚨 Type 'number' is not assignable to type 'never';
  ```

  → `never` 는 모든 타입이 서브타입으로 가지고 있는 타입

  ```tsx
  class SubAnimal {}
  class SubDog extends SubAnimal {
    eat() {}
  }

  // sub6 타입은 sup6 타입의 서브 타입
  let sub6: SubDog = new SubDog();
  let sup6: SubAnimal = sub6;
  sub6 = sup6;
  ```

1. 같거나 서브타입인 경우 할당이 가능하다

   → 공변

   ```tsx
   // primitive type
   let sub7: string = "";
   let sup7: string | number = sub7;

   // object - 각각의 프로퍼티가 대응하는 프로퍼티와 같거나 서브타입이어야 한다
   let sub8: { a: string; b: number } = { a: "", b: 1 };
   let sup8: { a: string | number; b: number } = sub8;

   // array - object와 마찬가지
   let sub9: Array<{ a: string; b: number }> = [{ a: "", b: 1 }];
   let sup9: Array<{ a: string | number; b: number }> = sub9;
   ```

2. 함수의 매개변수 타입만 같거나 슈퍼타입인 경우, 할당이 가능하다

   → 반변

   ```tsx
   class Person {}
   class Developer extends Person {
     coding() {}
   }
   class StartupDeveloper extends Developer {
     burning() {}
   }

   function tellme(f: (d: Developer) => Developer) {}

   // 정상
   tellme(function dToD(d: Developer): Developer) {
     return new Developer();
   }

   // 정상 - 매개변수에 슈퍼타입을 할당하는 경우
   tellme(function pToD(d: Person): Developer) {
     return new Developer();
   }

   // 🚨 에러 - 매개변수에 서브타입을 할당하는 경우
   tellme(function sToD(d: StartupDeveloper): Developer) {
     return new Developer();
   }
   ```

**→ `strictFunctionTypes` 옵션으로 에러 확인 가능**

- `any` 대신 `unknown` 사용하기

  ```tsx
  function fany(a: unknown): number | string | void {
    a.toString(); // 🚨 a: unknown일 때만 에러 발생 (any에서는 허용)

    if (typeof a === "number") {
      return a * 25;
    } else if (typeof a === "string") {
      return `Hello ${a}`;
    }
  }
  ```

---

## 4. 타입 추론 이해하기

- `let`과 `const`의 타입 추론

  ```tsx
  let a = "Zig"; // string
  const b = "Zig"; // 'Zig', literal type
  ```

- `as const`

  ```tsx
  const arr = ["Zig", "Sun", "Haru"] as const;
  // readonly ['Zig', 'Sun', 'Haru']
  ```

- Best commen type

  ```tsx
  let a = [0, 1, null]; // (number | null)[]
  const a = [0, 1, null]; // (number | null)[]
  ```

  ```tsx
  class Animal {}
  class Rhino extends Animal {}
  class Elephant extends Animal {}
  class Snake extends Animal {}

  const a = [new Rhino(), new Elephant(), new Snake()];
  // (Rhino | Elephant | Snake)[]
  const b = [new Animal(), new Rhino(), new Elephant(), new Snake()];
  // Animal[]
  const b: Animal[] = [new Rhino(), new Elephant(), new Snake()];
  // Animal[]
  ```

- Contextual Typing - 위치에 따라 추론이 다름

  ```tsx
  const click = (e) => {
    e; // any
  };

  document.addEventListener("click", (e) => {
    e; // MouseEvent
  });
  ```

---

## 5. Type Guard로 안전함을 파악하기

1. `typeof` Type Guard - 보통 primitive 타입일 경우

   ```tsx
   function getNumber(value: number | string): number {
     value; // number | string

     if (typeof value === "number") {
       value; // number
       return value;
     }
     value; // string

     return -1;
   }
   ```

2. `instanceof` Type Guard - `Error` 객체 구분에 많이 쓰임

   ```tsx
   class NegativeNumberError extends Error {}

   function getNumber(value: number): number | NegativeNumberError {
     if (value < 0) return new NegativeNumberError();

     return value;
   }

   function main() {
     const num = getNumber(-10);

     if (num instanceof NegativeNumberRror) {
       return;
     }

     num; // number
   }
   ```

3. `in` operator Type Guard - object의 프로퍼티 유무로 처리하는 경우

   ```tsx
   function redirect(user: Admin | User) {
     if ("role" in user) {
       // ...
     } else {
       // ...
     }
   }
   ```

4. literal Type Guard - object의 프로퍼티가 같고, 타입이 다른 경우

   tagged type을 사용한다

   ```tsx
   function getWheelOrMotor(machine: Car | Boat): number {
     if (machine.type === "CAR") {
       return machine.wheel;
     } else {
       return machine.motor;
     }
   }
   ```

5. custom Type Guard

   ```tsx
   function getWheelOrMotor(machine: Car | Boat): number {
     if (isCar(machine)) {
       return machine.wheel;
     } else if (isBoat(machine)) {
       return machine.motor;
     } else {
       return -1;
     }
   }

   function isCar(arg: any): arg is Car {
     return arg.type === "CAR";
   }

   function isBoat(arg: any): arg is Boat {
     return arg.type === "BOAT";
   }
   ```

→ lodash 등의 라이브러리에서도 많이 사용하는 방식

---

## 6. Class를 안전하게 만들기

- Class Property의 타입을 명시적으로 지정해야 한다

  ```tsx
  // v3.9.7
  class Square1 {
    area; // 🚨 implicit any
    sideLength; // 🚨 implicit any
  }
  ```

  ```tsx
  // v3.9.7
  class Square2 {
    area: number;
    sideLength: number;
  }

  const square2 = new Square2();
  console.log(square2.area); // 컴파일타임에는 number, 런타임에는 undefined
  console.log(square2.sideLength); // 컴파일타임에는 number, 런타임에는 undefined
  ```

**→ `strictPropertyInitialization` 옵션**

- Class의 Property가 생성자 혹은 선언에서 값이 지정되지 않으면 컴파일 에러가 발생한다

  ```tsx
  // v3.9.7
  class Square2 {
    area: number = 0;
    sideLength: number = 0;
  }
  ```

- v4~부터의 Class Property 타입 추론

  ```tsx
  // v4.0.2
  class Square3 {
    area; // 생성자에 의해 추론
    sideLength; // 생성자에 의해 추론

    constructor(sideLength: number) {
      this.sideLength = sideLength;
      this.area = sideLength ** 2;
    }
  }
  ```

- 여전히 생성자를 벗어나면 추론되지 않는다

  ```tsx
  // v4.0.2
  class Square4 {
    sideLength!: number; // !로 의도를 표현

    constructor(sideLength: number) {
      this.initialize(sideLength);
    }

    initialize(sideLength: number) {
      this.sideLength = sideLength;
    }

    get area() {
      return this.sideLength ** 2; // 🚨
    }
  }
  ```

---

## 정리

서브타입과 수퍼타입에 대해 애매하게 알고 있었던 것 같다. 이펙티브 타입스크립트에서는 서브타입의 범위가 수퍼타입보다 넓은 것으로 설명하고 있었던 것 같은데, 수학적 개념의 집합과 타입스크립트의 ‘값의 범위’로서의 타입은 서로 다른 개념이라는 것을 제대로 알고 있어야겠다.

공변과 반변에 대해서도 언젠가 들어본 내용을 확실하게 짚고 넘어갈 수 있었다. 일반적인 객체 형태의 타입이 아니라 함수 매개변수로 쓰인 타입의 경우 타입 필드의 사용 여부에 따라서 할당 가능 여부를 판단할 수 있어야 할 것이다.

타입 가드를 하는 방법도, `arg is T` 방법만 쓰는 것이 아니라 여러 실용적인 방법들을 앞으로도 많이 활용해봐야겠다!

---

**Ref** https://sorto.me/posts/2021-03-16+variance
