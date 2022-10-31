---
title: 타입스크립트 declare 다시 알아보기
date: 2022-10-29 22:41:18
tags: typescript
thumbnailImage: https://i.imgur.com/cKyZ5Kn.jpg
---

이 글은 작년 9월에 쓴 글이 너무 구려서(...) 언젠가 다시 쓰겠노라 다짐만 하다가, 1년도 더 지난 지금 드디어 반성하며 작성하는 글이다.

<!-- more -->

## 모듈부터 알아보자

---

ES6 이후 자바스크립트에는 '모듈'이라는 개념이 등장했다. 모듈 덕분에 전역에서 모든 것을 선언하여 갖다 쓰는 지저분한(;) 방식 대신, 특정 스코프에서 변수, 함수 등등을 선언해서 그 안에서만 사용하거나, 외부로 export된 모듈을 명시적으로 import하여 사용할 수가 있게 되었다.

타입스크립트는 ES6처럼 모듈을 지원한다. 이때 파일에 `import`나 `export`가 있어야만 모듈로 간주하며, `import`-`export` 없이 선언한 코드는 전역 스코프에서 사용 가능한 것으로 여겨진다.

그래서 당연히 우리가 아는 일반적인 형태의 모듈은..

```tsx
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
```

이렇게 작성하고, 외부에서 `StringValidator`를 갖다 쓰는 방식.

```tsx
import { ZipCodeValidator } from "./ZipCodeValidator";
let myValidator = new ZipCodeValidator();
```

## Namespace(네임스페이스)는 뭘까?

---

여러 동일한 코드가 반복될 때, 네임스페이스로 묶을 수 있다. 네임스페이스는 글로벌 네임스페이스에서 자바스크립트 객체로 컴파일된다. 구체적으로는 IIFE(즉시실행함수)에 해당 객체를 전달하고, 그 함수를 즉시 호출하는 식으로 컴파일된다.

> 네임스페이스는 이전에 '내부 모듈(internal module)'이라고 불렸었다.
> 네임스페이스의 모든 의존성은 HTML 페이지의 `<script>` 태그로 포함한다.

`Validation` 네임스페이스를 예로 들어보자.

```tsx
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
// Some samples to try
let strings = ["Hello", "98052", "101"];
// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {};
validators["Letters only"] = new Validation.LettersOnlyValidator();
// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

`Validation`이라는 네임스페이스를 선언하고, 그 안의 인터페이스와 클래스를 네임스페이스 바깥에서도 사용할 수 있도록 `export`해주었다. (`export`하지 않은 `lettersRegexp`와 같은 변수들은 네임스페이스 바깥에선 사용할 수 없다.) 네임스페이스 바깥에서는 `Validation.StringValidator`와 같이 네임스페이스의 이름 뒤에 `.`(점) 연산자를 붙여서 원하는 인터페이스나 클래스를 사용할 수 있다.

`Validation` 네임스페이스를 여러 파일에 분리해서 작성할 수도 있다. 이를 다중 파일 네임스페이스(multi-file namespaces)라고 한다. 파일 간 의존성이 있으므로, 참조 태그를 추가하여 컴파일러에게 파일 간의 관계를 알린다.

```tsx
// Validation.ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

```tsx
// LettersOnlyValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

> 트리플 슬래시 지시어 (`/// <reference path="..." />`)를 사용하면 파일 간의 의존성 선언을 가져올 수 있다. 컴파일러는 컴파일 과정에서 추가적인 파일들을 포함시킨다.

위와 같이 파일이 분리되었더라도 타입스크립트 컴파일러는 각각이 같은 네임스페이스로 선언된 것처럼 취급할 수 있다.

## Ambient Module(앰비언트 모듈)

---

모듈과 네임스페이스를 알아봤다. 그런데! 이것만 있으면 재미가 없다. 타입스크립트에는 **'앰비언트 모듈(ambient module)'** 이라는 친구도 존재한다. 일반적인 모듈은 코드와 선언 둘 다 포함할 수 있지만, '앰비언트' 모듈은 이름에서도 드러나듯 구체적인 구현체를 포함하지 않으며, 타입 선언부만 존재한다.

> 구현체를 정의하지 않은 선언문을 'ambient'라고 부르며, 일반적으로 `.d.ts` 파일에 작성한다.
> 앰비언트 모듈은 `declare` 키워드를 사용하여 선언한다.
> `.d.ts` 파일은 자바스크립트로 컴파일되지 않는다.

앰비언트 모듈은 자바스크립트로 작성된 라이브러리들을 타입스크립트로 작성된 것처럼 안전하게 가져다 쓸 수 있게 해주는 타입스크립트의 기능이다. 주로 프로젝트나 라이브러리 단위의 타입 정의를 포함한다.

우리는 이미 수많은 앰비언트 모듈들을 본 적이 있는데, 바로 자바스크립트 라이브러리들에 대한 타입을 선언한 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)가 대표적인 예시다. `@types/react`와 같이, npm으로 자바스크립트 라이브러리를 설치할 때 `@types/` prefix가 붙은 파일 설치 시 사용할 수 있다.

만약 설치하고자 하는 라이브러리에 타입 정의가 없다면(`@types/` 파일이 없다면), 앰비언트 모듈을 사용하여 직접 라이브러리의 타입 정의 파일을 추가해주어야 한다.

```tsx
// some-pureJS-library.d.ts
declare module "some-pureJS-library";
```

그리고 tsconfig의 `compilerOptions`에 해당 파일 경로를 추가해준다.

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [..., "./some-pureJS-library"]
  }
}
```

Node.js에서, 대부분의 작업(task)은 하나 이상의 모듈을 로드해서 이루어진다. 각 모듈마다 `.d.ts` 파일을 작성하여 최상위에서 export할 수도 있겠지만, 그보다는 하나의 큰 `d.ts` 파일에 작성하는 것이 좋겠다. 이를 위해 **앰비언트 모듈**이 탄생했다.

Node.js에서 앰비언트 모듈을 사용하는 방식을 보자.

```tsx
// node.d.ts
declare module "url" {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }
  export function parse(
    urlStr: string,
    parseQueryString?,
    slashesDenoteHost?
  ): Url;
}
declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```

삼중 슬래시 지시어(`///`)를 사용하여, node.d.ts에 선언된 앰비언트 모듈을 직접 가져다 쓸 수 있다.

```tsx
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("https://www.typescriptlang.org");
```

삼중 슬래시 지시어(`///`)를 사용하는 대신, tsconfig.json 파일의 `compilerOptions`를 통해서 앰비언트 모듈을 사용할 수도 있다.

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./types"]
  }
}
```

`paths`를 사용하여 사용하고자 하는 앰비언트 모듈의 경로를 표현식으로 지정해줄 수도 있다.

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "sample-module": ["../types/sample-module"]
    }
  }
}
```

## Wildcard 모듈 선언 사용하기

---

SystemJS나 AMD같은 모듈 로더들은 자바스크립트가 아닌 콘텐츠도 쓰게 해준다. 착하다... 이런 케이스들을 다루기 위해 와일드카드 모듈 선언문이 쓰인다.

```tsx
declare module "*.png" {
  const content: string;
  export default content;
}
```

이제 `'*.png'` 파일을 갖다 쓸 수 있다.

```tsx
import catImg from "images/cat.png";

ReactDOM.render(<img src={catImg} alt="meow">, document.getElementById('root'),)
```

## Ambient Namespace(앰비언트 네임스페이스)

---

'앰비언트'는 모듈 뿐 아니라 네임스페이스에도 적용된다.

다른 자바스크립트 라이브러리들을 사용한다면, 해당 라이브러리가 제공하는 API를 타입스크립트로 확장하여 선언할 수 있다.

자바스크립트 D3 라이브러리를 예시로 들어보자. 이 라이브러리는 `d3`이라는 글로벌 객체에 함수들을 정의한다. D3 라이브러리는 모듈 로더가 아닌 `<script>` 태그를 통해 로드되므로, 타입스크립트는 이 형태를 보기 위해 앰비언트 네임스페이스 선언을 사용한다. 앰비언트 네임스페이스 역시 앰비언트 모듈과 마찬가지로 `declare` 키워드를 이용하여 선언한다.

```tsx
// D3.d.ts
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }
  export interface Event {
    x: number;
    y: number;
  }
  export interface Base extends Selectors {
    event: Event;
  }
}
declare var d3: D3.Base;
```

## 이제 `declare`의 쓰임새를 정리해보자.

---

`declare` 키워드를 사용하여 변수, 상수, 함수, 또는 클래스가 어딘가에 이미 선언되어 있음을 알릴 수 있다. 자바스크립트 코드로는 컴파일되지 않으며, 타입스크립트 컴파일러에게 타입 정보를 알리기만 한다.

`declare`는 크게 세 가지 방식으로 작성할 수 있다.

- `declare namespace Validator`

  - '앰비언트 네임스페이스' 또는 '내부 모듈(internal-module)'이라고 불리며, 일반적인 네임스페이스처럼 자바스크립트 객체로 컴파일되지 않는다.
  - 몇몇 타입들을 의미적으로 묶고 싶은 경우 사용한다.

- `declare module "Validator"`

  - '앰비언트 모듈 선언' 파일에 작성하는 블록으로, '앰비언트 모듈' 또는 '외부 모듈(external-module)'이라고 불린다.
  - 컴파일 대상에 포함되기만 한다면 이곳에 선언된 모듈(`Validator`)의 타입 정보를 참조할 수 있게 된다. (블록 내에서 `export`를 붙인 필드만 외부에서 참조할 수 있다.)

- `declare global`
  - 모듈 파일에서도 전역 참조가 가능한 선언 코드를 작성하고 싶을 때 사용한다.
    ```tsx
    // global.d.ts
    declare global {
      interface Window {
        newProperty: string;
      }
    }
    ```
    ```tsx
    window.newProperty;
    ```
  - 오로지 `declare module` 블록 안에서만 중첩이 가능하다.

> `.d.ts` 파일에 작성되는 `declare namespace` 블록과 `declare module` 블록의 필드들에는 `export` 키워드가 기본적으로 붙어있으므로, 추가적으로 작성할 필요가 없다.

---

### Ref

- <https://www.typescriptlang.org/docs/handbook/modules.html>
- <https://www.typescriptlang.org/docs/handbook/namespaces.html>
- <https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html>
- <https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html>
- <https://it-eldorado.tistory.com/127>
- <https://isamatov.com/typescript-ambient-module/>
