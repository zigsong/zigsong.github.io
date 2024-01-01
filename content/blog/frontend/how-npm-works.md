---
title: npm은 어떻게 동작할까
date: 2021-10-31 16:46:52
tags: ["npm"]
thumbnailImage: https://i.imgur.com/4i7MZ1Z.jpg
---

npm은 어떻게 동작할까

<!-- more -->

---

어느날 갑자기 눈뜨자마자 궁금해졌다. 꿈에서 이상한 계시를 받았나? 아무 생각없이 npm을 사용하고 있었는데, 만약 누군가 이게 대체 어떻게 돌아가는 건지 묻는다면 대답을 못할 것 같았다.

### 패키지가 뭘까?

- 패키지: `package.json`에 기재된 파일 또는 디렉토리
- 모듈: Node.js의 `require()` 문법으로 로드된 파일 또는 디렉토리. 일반 자바스크립트 파일 뿐 아니라 `package.json`에 `main` 필드를 포함하는 패키지도 모듈이 될 수 있다.

대부분의 npm 패키지들은 `require`로 로드되기 때문에 모듈에 해당한다. 하지만 npm 패키지들이 반드시 모듈일 필요는 없다. 하지만 `main` 필드가 없다면 모듈이 아니다.

> `main` 항목은 프로그램의 시작점이 되는 모듈의 ID다. ‘zig’라는 패키지가 있을 때, 이 패키지를 설치한 사용자가 `require('zig')`를 실행 시 `main`으로 지정한 모듈의 exports 객체가 반환된다.

### 파일과 디렉토리 이름

`package.json` 파일은 패키지를 정의한다.

`node_modules` 폴더는 Node.js가 모듈을 찾는 위치다.

`node_modules`에 있는 파일이라도 `package.json`이 없다면 패키지가 아니다.

반대로 `package.json`이 있더라도 `index.js`나 `main` 필드가 존재하지 않는다면 모듈이 아니다. 따라서 `require()`의 인자로 사용할 수 없다.

### 의존성 지옥

A와 B, C 모듈이 있을 때, A는 B v1.0을 필요로 하고, C는 B v2.0을 필요로 한다고 가정해 보자. 앱에 A와 C 모듈이 모두 필요하다면, 패키지 매니저는 B의 어떤 버전을 제공해야 할까?

이를 의존성 지옥이라고 한다.

### Node 모듈 로더

대부분의 모듈 로더들은 메모리에 같은 모듈에 대해 2가지 버전을 로드할 수 없다. Node.js 모듈 로더는 이 문제를 해결한다!

npm과 Node.js 모듈 로더는 의존성 관리를 위한 런타임에서 유용하게 동작한다.

### 😮 npm install 시 무슨 일이 일어날까?

의존성 트리에 있는 모든 의존성들을 불러온다. 모든 의존성 파일들을 불러오는 대신, 특정 의존성의 이름과 버전, 또는 github url을 명시해줄 수도 있다.

구체적으로 살펴보자.

`npm install`을 실행하면 `node_modules` 또는 `package-lock.json` 파일을 확인하고 의존성 트리(폴더 구조)를 따라 내려가며 트리를 복제한다.

이후 `package.json`에서 관련있는 의존성들을 가져와 트리 복제본에 추가한다. 그리고 원본 트리와 트리 복제본을 비교하며 의존성들을 원본 트리에 추가한다. 이때 의존성들은 트리의 다른 루트나 브랜치들과 충돌하지 않도록 추가된다.

마지막으로 원본 트리와 트리 복제본을 비교하여 `node_modules`에 새롭게 복제된 트리를 얻기 위한 동작들을 수행한다.

> **package-lock.json의 역할**
>
> A 패키지는 `B@v1.0`을, C 패키지는 `B@v2.0`을 필요로 할 때, 아래와 같이 npm package를 서로 다른 순서로 설치하는 두 가지 경우를 생각해보자.

**✔️ 시나리오 1**

```
npm install A
npm install C
```

**✔️ 시나리오 2**

```
npm install C
npm install A
```

두 경우 모두 `package.json`은 아래와 같을 것이다.

```jsx
{
  "dependencies": {
    "A": "1.0.0",
    "C": "2.0.0"
  }
}
```

하지만 의존성 트리를 표현하는 `package-lock.json`에는 차이가 발생한다.

**✔️ 시나리오 1**

```jsx
{
  "dependencies": {
    "A": {
      "version": "1.0.0",
      "requires": {
        "B": "1.0.0",
      }
    },
    "B": {
      "version": "1.0.0",
    },
    "C": {
      "version": "2.0.0",
      "requires": {
        "B": "2.0.0",
      },
      "dependencies": {
        "B": {
          "version": "2.0.0",
        }
      }
    }
  }
}
```

**✔️ 시나리오 2**

```jsx
{
  "dependencies": {
    "A": {
      "version": "1.0.0",
      "requires": {
        "B": "1.0.0",
      },
      "dependencies": {
        "B": {
          "version": "1.0.0",
        }
      }
    },
    "B": {
      "version": "2.0.0",
    },
    "C": {
      "version": "2.0.0",
      "requires": {
        "B": "2.0.0",
      }
    }
  }
}
```

만약 앱에서 `B` 패키지를 아래와 같이 로드한다면,

```jsx
const b = require("B");
```

시나리오 1에서는 `B@v1.0`을 가리킬 것이며, 시나리오 2에서는 `B@v2.0`를 가리키게 된다. 따라서 프로젝트의 모든 팀원들이 같은 의존성 트리를 사용할 수 있도록 `package-lock.json`을 github에 올려야 한다.

> **🤔 nvm은 또 뭘까?**
> nvm은 node-version-manager로, 서로 다른 node와 npm의 버전을 관리해준다.

---

**Ref**
https://npm.github.io/how-npm-works-docs/
https://programmingsummaries.tistory.com/385
https://dev.to/shree_j/how-npm-works-internally-4012
