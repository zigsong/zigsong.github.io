---
title: TypeScript declare
date: 2021-09-18 20:01:52
tags: typescript
---

(다시 쓸 예정)

<!-- more -->

<img src="/images/thumbnails/typescript-thumbnail.jpeg" />

놀토 프로젝트에서 사용하는 Kakao API를 TypeScript와 함께 사용하기 위해서는 아래처럼 Kakao API를 초기화해주는 작업이 필요하다.

```jsx
window.Kakao.init(process.env.KAKAO_API_KEY);
```

이때 TypeScript는 `window`에서 Kakao를 찾지 못하므로, 직접 window 객체에 Kakao를 정의해줘야 한다. Type declare의 방식을 사용했다.

```tsx
// global.d.ts
export {};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}
```

또한 `svg` 확장자 파일을 사용하기 위해서도 해당 확장자에 대한 `declare`를 선언해줘야 한다.

```tsx
// custom.d.ts
declare module "*.svg" {
  const content: ({ fill, width, height }: SVGProps) => JSX.Element;

  export default content;
}
```

**🤔 declare는 무엇이고, 왜 사용하는 걸까?**

`xxx.d.ts` 파일은, TypeScript를 지원하지 않는 서드파티 라이브러리를 사용할 때 타입을 직접 선언해주기 위해 필요하다. 해당 파일은 구현부가 아닌 선언부만을 작성하는 용도로, JavaScript 코드로 컴파일되지 않으며 TypeScript 컴파일러에게 타입 정보를 알려주기만 한다. `xxx.d.ts` 파일을 만든 후 tsconfig.json에도 해당 declare 파일을 쓸 것이라고 알려준다.

> 인스톨 시 `@types/`로 시작하는 라이브러리를 함께 설치하는 경우 별도의 타입 선언이 필요하지 않다. TypeScript는 기본적으로 `@types/`로 시작하는 패키지들을 컴파일에 포함한다. 해당 패키지들은 [DefinitelyTyped](http://definitelytyped.org/)에 의해 선언부가 정의되어 있다.

```tsx
// tsconfig.json
{
  "compilerOptions": {
    // ...
  },
  "includes": ["src", "global.d.ts", "custom.d.ts"]
}
```

또는 `typeRoots`를 작성해줄 수도 있다. `typeRoots`를 지정하면, TypeScript는 `typeRoots`의 경로에 지정된 패키지만 컴파일 과정에 포함한다.

```tsx
{
  "compilerOptions": {
    //
    "typeRoots": [
      "src/types",
      "node_modules/@types"
    ]
  }
}
```

`xxx.d.ts` 파일을 만들었다면, `declare` 키워드를 통해 모듈을 선언한다. `declare`를 이용한 모듈의 기본 선언 방식을 **앰비언트 선언(ambient declaration)** 이라고 한다. 이는 TypeScript 컴파일러에 JavaScript 구현 ‘환경’에 대한 정보를 알려주는 것으로, 구체적인 실행에 대한 내용 없이 선언부만 작성하기 때문에 ‘앰비언트’라고 한다.

아래처럼 변수를 선언할 수도 있으며,

```tsx
declare var hello: any;
```

`module` 키워드를 사용해 엠비언트 모듈을 선언할 수도 있다. 이때 모듈 내에는 interface, class, function 등의 요소를 선언할 수 있다.

```tsx
declare module "module1" {
  // ...
}
```

또한 속기 선언 방식을 통해 선언부의 body 없이 빠르게 앰비언트 선언을 작성할 수 없다.

```tsx
// 와일드카드(*)를 사용한 속기 선언 방식
declare module "*.png";
```

namespace도 정의해줄 수 있는데, 이때 `namespace` 키워드를 생략할 수 있다.

```tsx
declare namespace global {
  // ...
}
```

module과 namespace로 선언한 선언부의 경우 내부에 `export`를 붙인 필드만 외부에서 참조가 가능하다.

> 👾 **module vs namespace**
>
> - **module** - import & export로 사용하며, 코드와 선언부 모두를 포함한다. 모듈은 모듈 로더(ex. CommonJS 등)에 대한 의존성이나 ESModule이 제공하는 런타임을 가지고 있다.
> - **namespace** - 전역 namespace에서 JavaScript 일반 객체로 컴파일된다. (`declare` 키워드로 선언 시 JavaScript로 컴파일되지 않는다.) IIFE 함수에 해당 객체를 전달하고 그 함수를 즉시 호출하는 방식으로 컴파일된다. 모듈과 달리 여러 개의 파일을 포함할 수 있다.

이렇게 작성한 선언들은 자동으로 `export` 키워드가 붙게 되며, 명시적으로 import하지 않고도 프로젝트의 모든 파일에서 전역적으로 사용할 수 있다.

import-export를 사용하는 일반 모듈 파일들에서도 전역 참조가 가능한 선언부를 작성하고 싶을 때에는 `global` 키워드를 사용한다. 위에서 사용했던 Kakao API 사용을 위한 declare global이 여기에 해당한다.

> 👾 global 객체를 확장하려는 경우 ambient 또는 external module을 사용해야 하는데, ambient module을 사용할 수 없으므로(= module로 선언할 수 없으므로) `export {}`를 통해 external module로 만들어준다.

```jsx
export {};

declare global {
  // ...
}
```

**Ref**
https://it-eldorado.tistory.com/127
https://soft91.tistory.com/74
https://typescript-kr.github.io/pages/namespaces-and-modules.html
https://typescript-kr.github.io/pages/modules.html
https://elfi-y.medium.com/typescript-ambient-module-8816c9e5d426
