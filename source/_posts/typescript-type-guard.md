---
title: 타입스크립트 타입 가드
date: 2021-08-01 17:41:16
tags: typescript
---

TypeScript type guard

<!-- more -->

<img src="/images/thumbnails/typescript-thumbnail.jpeg" />

---

서버 데이터를 가져오는 과정에서 에러 핸들링을 하면서 TypeScript와의 굉장한 싸움에 시달렸다. 그러던 중 type guard에 대해서 알게 되었다.

type guard를 사용하면 조건문에서 객체의 타입을 좁혀나갈 수 있다. `typeof`, `instanceof`, `in` 등 기본으로 제공하는 타입 가드 연산자를 사용할 수도 있지만, 사용자 정의 type guard를 작성할 수도 있다.

사용자 정의 type guard 함수는 단순히 **어떤 인자명은 어떠한 타입이다**라는 값을 리턴하는 함수다.

```tsx
interface Foo {
  foo: number;
  common: string;
}

interface Bar {
  bar: number;
  common: string;
}

/**
 * 사용자 정의 Type Guard!
 */
function isFoo(arg: any): arg is Foo {
  return arg.foo !== undefined;
}
```

`arg is Foo`는 사용자가 정의한 type predicate에 해당한다. `parameterName is Type`에서 `parameterName`은 현재 함수 시그니처의 인수 이름과 같아야 한다. 여기서는 `arg`라는 인자가 `Foo` 타입이라고 예측하여 넘겨준 다음, 정말 `Foo` 타입이 맞는지를 검사해서 반환한다.

```tsx
// 사용자 정의 Type Guard 사용 예시
function doStuff(arg: Foo | Bar) {
  if (isFoo(arg)) {
    console.log(arg.foo);
    console.log(arg.bar); // Property 'bar' does not exist on type 'Foo'
  } else {
    console.log(arg.foo);
    console.log(arg.bar); // Property 'foo' does not exist on type 'Bar'
  }
}

doStuff({ foo: 123, common: "123" }); // 123 undefined
doStuff({ bar: 123, common: "123" }); // undefined 123
```

프로젝트에서는 에러 응답 형식을 구분하여 알맞은 방식으로 처리해주기 위해 아래처럼 type guard를 사용했다.

우선 사용한 인터페이스는 다음과 같다.

```tsx
// types.tsx
export interface ErrorResponse {
  status: number;
  data: unknown;
}

export interface HttpErrorResponse extends ErrorResponse {
  data: {
    message: string;
    errorCode: ERROR_CODE_KEY;
  };
}
```

`isErrorResponse`, `isErrorCode`, `isHttpErrorResponse` 세 가지 방식으로 에러 응답의 타입을 확인해주었다.

```tsx
// typeGuard.ts
export const isErrorResponse = (response: any): response is ErrorResponse => {
  if (typeof response.status !== "number") {
    return false;
  }

  if (response.data === undefined) {
    return false;
  }

  return true;
};

export const isErrorCode = (data: unknown): data is keyof typeof ERROR_CODE => {
  if (typeof data !== "string") {
    return false;
  }

  return Object.keys(ERROR_CODE).some((key) => key === data);
};

export const isHttpErrorResponse = (
  errorResponse: any
): errorResponse is HttpErrorResponse => {
  if (!isErrorResponse(errorResponse)) {
    return false;
  }

  const { data } = errorResponse;

  if (typeof (data as any).message !== "string") {
    return false;
  }

  if (!isErrorCode((data as any).errorCode)) {
    return false;
  }

  return true;
};
```

완벽하지 않을 수 있지만, 사용할 때 보다 안전하게 타입 체킹을 한 후 에러 핸들러를 작성할 수 있게 되었다!

---

**Ref**

- https://radlohead.gitbook.io/typescript-deep-dive/type-system/typeguard
- https://www.typescriptlang.org/docs/handbook/advanced-types.html
