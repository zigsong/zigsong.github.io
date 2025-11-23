---
title: next.js 15 뒷북
date: 2025-11-22 10:21:01
tags: ["frontend"]
description: 뒤늦게 찍어먹는 next.js 15와 App Router
---

next.js 15 버전이 나온지 1년이 지나서 공부하는 뒷북~^^ 

참고로 올해 이직한 우리 회사는 아직 next.js 12 버전을 쓰고 있었고,
와중에 상당히 두터운(?) 사내 로직들로 감싸져 있어 무슨 기능들이 있는지도 잘 몰랐던 상황...

### Breaking Changes

일단 공홈에 나온 Next.js 15버전 Breaking Changes라고 하는 것들은 다음과 같다.

- `@next/codemod` CLI: 최신 Next.js와 React 버전으로 쉽게 업그레이드 가능 

- Async Request APIs (Breaking): 단순화된 렌더링과 캐싱 모델로의 점진적 스텝 

- Caching Semantics (Breaking): `fetch` 요청, `GET` 라우트 핸들러, 클라이언트 네비게이션은 기본으로 캐시되지 않음

- React 19 Support: React 19, React Compiler (Experimental) 지원과 하이드레이션 에러 개선.

- Turbopack Dev (Stable): 성능과 안정성 향상

- Static Indicator: 개발 환경에서 정적(static)인 라우트에는 Static Indicator 표시

- `unstable_after` API (Experimental): 응답 스트리밍이 끝난 후 코드를 실행 

- `instrumentation.js` API (Stable): 서버 라이프사이클 관찰을 위한 새로운 API

- Enhanced Forms (`next/form`): 클라이언트 네비게이션과 함께하는 개선된 HTML 폼

- `next.config`: next.config.ts에 타입스크립트 지원

- Self-hosting Improvements: Cache-Control 헤더 조작 가능.

- Server Actions Security: 예측하지 못하는 엔드포인트와 사용되지 않는 액션 제거 

- Bundling External Packages (Stable): App/Pages 라우터에 새로운 config 옵션

- ESLint 9 Support: ESLint 9 지원

- Development and Build Performance: 개발 시간과 빠른 리프레시 개선

언뜻 보면 그렇게 breaking하진 않은 것 같기도? 

여기서 가장 실무에 와닿는 것은 아마, **React 19 지원**이 아닐까 싶다.

### React 19 지원

React 19에서는 React Server Components 기능이 안정화되었다고 한다.

Next.js 측에서도 React 19 도입을 단순히 "최신 React 버전 대응' 차원이 아니라, 서버 컴포넌트 + 캐싱 + 요청 처리 아키텍처를 더 발전시키는 전략으로 보고 있다. 

Next.js의 Server/Client 컴포넌트 구분은 React 19 이전부터 있었던 개념이지만, React 19의 안정화된 RSC(Server Components) + Server Actions 모델이 이 전략을 더욱 실용적으로 만들었다.

### Server vs Client

Next.js에서 선언하는 컴포넌트는 기본적으로 서버 컴포넌트가 된다. React 19의 RSC를 Next.js 방식으로 구현한 것이다.

클라이언트 기능 사용을 위해 클라이언트에서 실행되는 컴포넌트를 선언하려면 다음과 같이 `'use client'` 디렉티브를 붙여줘야 한다.

```tsx
'use client'

export default function Component() {
  return null
}
```

그렇다면 Next.js는 왜 이렇게 서버 컴포넌트에 집착(?)하며 서버/클라이언트 컴포넌트를 명확히 분리하는 방향을 선택했을까? 

**1. 명확해진 렌더링**

- 기본적으로 Next.js (특히 App Router를 쓸 때)는 컴포넌트를 서버에서 렌더링하는 것을 기본으로 한다.
- 클라이언트 측 인터랙티브한 부분(버튼 클릭, 상태 변경 등)이 필요하면, "use client" 디렉티브를 파일 최상단에 선언해서 Client Component로 만든다. 

**2. 성능 이점**
	
- Server Component는 브라우저로 자바스크립트 번들 전체를 보내지 않기 때문에 번들 사이즈가 줄고, 초기 로딩이 빨라질 수 있다.

- 또한 서버에서 데이터 fetching이 가능하므로, 클라이언트에 불필요한 요청을 덜 보낼 수 있고 보안상 민감한 로직(예: DB 접근, API 키 처리)을 서버에 보관할 수 있다. 

**3. 컴포지션 전략**
	
- Server Component와 Client Component를 섞는 다양한 패턴이 존재한다. (ex. 레이아웃은 서버 컴포넌트로, 그 안의 버튼이나 상태 관리 컴포넌트는 클라이언트 컴포넌트로 구성하면 번들 크기를 최적화할 수 있다.)

- 하지만 제약도 있음: 예를 들어 Client Component 내부에 Server Component를 import하는 것은 지원되지 않는다. 

**4. 렌더링 전략 (스트리밍, static, dynamic)**
	
- Next.js에서는 Server Component에 대해 Static Rendering, Dynamic Rendering, Streaming 같은 전략을 쓸 수 있다. 

몇몇 제약이나 러닝 커브가 있긴 하지만, 컴포넌트를 만드는 위치를 서버/클라이언트로 명확하게 구분함으로써 여러가지 이점을 취하려고 한 것 같다.

그런데 여기서 말하는 서버 컴포넌트란 무엇일까? 

SSR(Server-Side Rendering)? 아니면 React 19의 RSC(React Server Component)?

### 기존의 SSR vs 새로운 RSC

기존에 Next.js Pages Router에서 사용하던 SSR 방식은 다음과 같이 이루어진다.

> - 서버: HTML + JS 번들 생성
> - 브라우저: HTML 먼저 렌더 → JS로 하이드레이션
<br />

하지만 RSC 기반의 Server Component는 이렇게 동작해:

> - 서버: React 트리 계산 → "RSC payload" 생성
> - 클라이언트: 이를 기반으로 UI 구성 (HTML + 일부는 스트리밍)
<br />

👆 여기서 핵심 포인트는,
HTML이 "완전한 DOM"으로 날아오는 것이 아니라,
React 전용 스트림 포맷이 같이 온다는 것이다. 

그리고 이 데이터는 하이드레이션 대상이 아니다. 

### Pages Router vs App Rotuer

위에서 잠깐 SSR을 소개하며, **Next.js Pages Router**를 언급했다. 

Pages Router는 전통적인 Next.js에서 쓰는 방식이고, 
App Router는 Next.js의 최신 방식이다. 

사실 App Router는 이번에 새로 생긴 것이 아니라, Next.js 13부터 도입되었다. 

Pages Router와 App Router의 핵심 차이는 다음과 같다. 

|      | **Pages Router**       | **App Router**                       |
| ------ | ---------------------- | ------------------------------------ |
| 도입 시기  | 기존 방식 (Next.js 초기) | Next.js 13부터 도입된 최신 방식               |
| 라우팅 위치 | `/pages` 디렉토리          | `/app` 디렉토리                          |
| 기본 렌더링 | **CSR + SSR 중심**       | **RSC (React Server Components)** 중심 |
| 설계 철학  | "페이지 단위 라우팅"           | "컴포넌트 단위 서버 중심 구조"                   |

자세한 파일 구조는 다음에 알아보기로 하고, **설계 철학**을 보자.

Pages Router는 서버/클라이언트 컴포넌트 구분에는 관심이 없고, '페이지 단위 라우팅'으로 개발의 편의성을 높였다.

그 이후에 나온 App Router는, 페이지 단위 라우팅은 유지하면서 '컴포넌트 단위 서버 중심'에 집중했다.

그래서 App Router의 파일 구조는 이렇게 되었다.

```
/app
  layout.tsx         → 공통 레이아웃
  page.tsx           → 해당 경로의 페이지
  loading.tsx        → 로딩 UI
  error.tsx          → 에러 UI
  not-found.tsx      → 404 처리
  posts/
    [id]/
      page.tsx
      loading.tsx
```

처음부터 서버 컴포넌트를 더 잘 지원하도록 설계되었기 때문에, 페이지에 더해 로딩/에러 UI를 프레임워크 단에서 제공하고 있는 것이다.

물론 어느 프레임워크나 그렇듯이, Pages Router와 App Router는 각각의 상황에 맞게 도입하는 것이 좋다. (그리고 섞어 쓸 수도 있다!)

### 급 마무리 🏄

Next.js 최신 버전의 앱 라우터가 어쩌고, React 19의 Server Component가 어쩌고...

머릿 속에서 둥둥 떠다니던 애매한 개념들을 잇고 보니 결국 하나로 만나게 되었다!

나온지 1년이나 지나서 배경과 개념을 겨우 찍먹한 수준이지만.

그런데, 공부하면 할수록 뭔가 애매하고 복잡스럽기만 해서 실무에서 잘 활용할 수 있을진 모르겠다? 🙄

### Refs 

- https://nextjs.org/blog/next-15
- https://www.heropy.dev/p/n7JHmI
- https://nextjs.org/docs/app