---
title: 타입스크립트의 index signature
date: 2021-07-18 19:40:26
tags: ["typescript"]

---

타입스크립트의 index signature

<!-- more -->

---

앱에서 사용하는 feed의 필드를 아래와 같이 정의했다.

```tsx
// types.ts
export interface Feed {
  id: number;
  author: User;
  title: string;
  content: string;
  techs: Tech[]; // custom type
  step: string;
  sos: boolean;
  thumbnailImage: File;
}
```

그리고 사용자가 feed를 새로 업로드할 때, 하나의 form 안의 각각의 input에서 가져온 값을 FormData에 key-value 값으로 매핑하여 담아주고 싶었다.

```tsx
// form의 event handler
const uploadFeed = (data: Feed) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, String(data[key]));
  });

  uploadFeeds.mutate(formData);
};
```

그런데 formData에 append할 value로 들어가는 `data[key]`에서 문제가 발생했다.

> 🚨 Element implicitly has an ‘any’ type because expression of type ‘string’ can’t be used to index type ‘Feed’. No index signature with a parameter of type ‘string’ was found on type ‘Feed’

TypeScript는 기본적으로 객체의 프로퍼티를 읽을 때, `string` 타입의 key 사용을 허용하지 않는다. TypeScript에서는 `string literal` 타입과 `string` 타입을 구분하기 때문이다.

아래 예제에서 a, b, c는 모두 같은 값을 가지지만 타입은 서로 다르다.

```tsx
const a = "Hello world"; // 'Hello world' 타입 (string literal)
let b = "Hello world"; // string 타입
const c: string = "Hello world"; // string 타입
```

b 변수는 let으로 선언되어 언제든지 재할당이 가능하기 때문에 컴파일러는 이 변수를 string 타입으로 추론한다.

c 변수는 명시적으로 string 타입으로 선언했기 때문에 그냥 string 타입이다.

a 변수는 조금 특이하다. TypeScript 컴파일러는 이 변수를 string이 아닌 좁은 타입(narrowed type)으로 선언한 것으로 추론한다. 리터럴 타입, 말 그래도 ‘Hello world’ 타입이 된 것이다.

위에서 언급한 문제에서도, `Object.keys(data)`를 돌며 `data`의 인덱싱 값으로 사용하려 했던 `key`라는 변수가 `Feed` 타입의 필드 네임으로 정의되지 않은 문자열일 수도 있기 때문에 오류를 뱉는 것이다.

index signature를 사용하여 이 문제를 해결했다. 원래 index signature는 객체에 대괄호(`[]`)를 통해 인덱싱하는 것을 의미한다.

```tsx
const foo = {};
foo["zig"] = "song";
console.log(foo["zig"]); // song
```

TypeScript에서는 특정 객체에 인덱싱 값으로 사용할 수 있는 변수의 타입을 명시적으로 선언해주기 위해 index signature를 사용할 수 있다. 여기서는 index 타입으로 `string`을 사용했다.

> TypeScript의 index signature는 `string`이나 `number` 타입을 강제한다.
> (➕ `Symbol` 타입도 지원한다.)

```tsx
export interface Feed {
  [index: string]: number | User | string | Tech[] | boolean | File;
  id: number;
  author: User;
  title: string;
  content: string;
  techs: Tech[]; // custom type
  step: string;
  sos: boolean;
  thumbnailImage: File;
}
```

(`index`라는 네이밍은 편의를 위한 것이며, 얼마든지 바꿔도 된다. `key` 등의 네이밍도 괜찮다고 생각한다.)

index signature의 타입을 string으로 강제했다. 또 index signature를 선언한 경우 모든 멤버가 그에 따라야 하므로, 멤버에 해당하는 모든 타입들을 index signature의 value 타입에 열거해준다.

이제 외부에서 `Feed` 타입의 객체를 순회할 때, index에는 string 타입의 값이 들어오며 value의 타입은 위와 같은 union type에 속한 타입들 중 하나에 해당한다는 것을 알 수 있다. string 타입의 key로 정상적으로 인덱싱을 할 수 있게 되었다!

---

**Ref**

- https://itmining.tistory.com/87
- https://soopdop.github.io/2020/12/01/index-signatures-in-typescript/
