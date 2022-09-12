---
title: Error Boundary와 Suspense
date: 2021-07-24 17:51:18
tags: frontend
---

Error Boundary와 Suspense

<!-- more -->

<img src="/images/thumbnails/frontend-thumbnail.jpeg" />

---

지난 미션들을 거치며 기술 부채로 남겨놨던 비동기 에러 핸들링을 드디어 맘 먹고 도전해보았다! 페어가 있었기에 가능한 일이었다.

에러가 발생할 수 있는 경우들과 사용자에게 보여야 할 화면 또는 알림창을 제어하기 위해 이틀 간 코딩은 못하고 수많은 논의를 거친 끝에, 완벽하진 않지만 어느 정도 만족스러운 에러 핸들링 컨벤션에 다다랐다. 여기에 http 요청의 loading 상태까지 컨트롤할 수 있는 `Suspense`를 덧붙여 코드를 작성했다.

합의된 내용은 다음과 같다.

- 일반적인 에러를 다룰 `CustomError` 객체를 만든다.
- http 통신에서 발생하는 에러를 다룰 `HttpError` 객체를 만든다.
- 모든 에러는 최상위의 `ErrorBoundary`가 잡는다.
- http 통신이 발생하는 최소 단위의 컴포넌트를 `ErrorBoundary`와 `Suspense`를 결합한 `AsyncBoundary`로 감싸준다.
- 대부분의 http 통신 코드를 담당하는 react-query에서 에러 발생 시 해당 에러를 `HttpError`로 래핑한 후 다시 throw하여 `AsyncBoundary`의 경계에서 잡히게끔 한다.
- http 통신에서 에러 발생 시 `AsyncBoundary`의 error fallback 컴포넌트(즉, 에러 페이지)를 보여주기 전에 사용자에게 alert 등으로 알림 메시지를 띄워준다.

우선 `Error`를 상속받는 `CustomError` 클래스를 만들어준다. 디버깅용으로 콘솔에 찍어줄 `message`를 클래스 필드로 가지고 있다.

```tsx
// CustomError.ts
export default class CustomError extends Error {
  name: string;

  constructor(message?: string) {
    super(message);
    this.name = new.target.name;
  }
}
```

그 다음 `CustomError`를 상속받는 `HttpError` 클래스를 만든다. `statusCode`가 추가된다.

```tsx
// HttpError.ts
import CustomError from "./CustomError";

class HttpError extends CustomError {
  statusCode: number;

  constructor(statusCode: number, message?: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export default HttpError;
```

http 통신 에러 뿐 아니라 모든 에러를 잡을 `ErrorBoundary`의 코드는 [react 공식 문서](https://ko.reactjs.org/docs/error-boundaries.html)에서 가져왔다.

그런데 여기서 타입스크립트 타이핑이 너무나 어려웠다… 특히 `constructor` 대신에 아래처럼 `state`를 정의해주는 부분. 생각해보니 클래스 컴포넌트를 타입스크립트로 작성해본 적이 없었던 것이다!

```tsx
// ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  // TypeScript에서는 constructor 대신 이렇게 써줄 수 있다!
  // 이때 State 인터페이스를 반드시 명시해줘야 한다.
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

`AsyncBoundary`는 http 통신의 로딩과 에러를 모두 잡기 위해 위에서 작성한 `ErrorBoundary`와 `Suspense`를 모두 사용한다. 그리고 각 상황에서 보여줄 컴포넌트를 각각 `rejectedFallback`과 `pendingFallback` 인자로 넘겨준다. 이 부분에서도 타이핑이 꽤나 문제였는데, 우선 복잡한 타이핑은 걸러내고 우리가 사용할 수 있는 선에서 타이핑해주기로 결정했다.

```tsx
// AsyncBoundary.tsx
import React, { Suspense } from "react";

import ErrorBoundary from "./ErrorBoundary";
import Loading from "components/@common/Loading/Loading";

interface Props {
  pendingFallback?: React.ReactNode;
  rejectedFallback: React.ReactNode;
  children: React.ReactNode;
}

const AsyncBoundary = ({
  pendingFallback = <Loading />,
  rejectedFallback,
  children,
}: Props) => {
  return (
    <ErrorBoundary fallback={rejectedFallback}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;
```

`AsyncBoundary`가 제 역할을 하려면 http 통신 코드에서 로딩과 에러를 구분해서 알려줘야 한다. `Suspense`와 `ErrorBoundary`를 함께 사용할 수 있으면 좋겠다.

react-query에서 관련 옵션을 제공한다. `useQuery`에서 사용하는 http 요청이 각각 `Suspense`와 `ErrorBoundary`의 영역에 들어가게끔 하기 위해 App 전체를 감싸는 `QueryClientProvider`의 인자에 옵션을 넣어준다.

```tsx
// App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    // ...
    </QueryClientProvider>
  )
```

물론 앱 전체의 global 옵션 대신 아래처럼 query마다 다르게 옵션을 지정해줄 수도 있다.

```tsx
useQuery<Feed[], HttpError>("hotFeeds", getHotFeeds, { suspense: false });
```

http 요청에 문제가 발생했다면, `useQuery`가 리턴한 에러를 `HttpError`로 감싸 다시 한번 throw해준다.

```tsx
// useHotFeeds.ts
type ErrorType = "feeds-001" | "feeds-002";

const getHotFeeds = async () => {
  try {
    const { data } = await api.get("/feeds/hot");

    return data;
  } catch (error) {
    console.error(error);

    const { status, data } = error.response;
    const errorMap: Record<ErrorType, string> = {
      ["feeds-001"]: "임시 에러 메시지 1",
      ["feeds-002"]: "임시 에러 메시지 2",
    };

    // 커스텀한 HttpError 인스턴스를 만들어 던져준다.
    // 이 에러는 AsyncBoundary에서 catch될 것이다.
    throw new HttpError(status, errorMap[data.error as ErrorType]);
  }
};

export default function useHotFeeds(
  option: UseQueryOptions<Feed[], HttpError>
) {
  return useQuery<Feed[], HttpError>("hotFeeds", getHotFeeds, option);
}
```

이때 컴포넌트에서 단순히 `useQuery`가 다시 throw한 에러를 던져 ErrorBoundary의 fallback 페이지를 보여주기 전에, alert로 사용자에게 먼저 경고를 띄워준다. (아래 alert는 추후 custom한 alert로 변경하였다.)

```tsx
const Home = () => {
  const { data: hotFeeds } = useHotFeeds({
    onError: () => alert('에러가 발생했습니다.'),
  });

  return (
    // ...
  )
}
```

마지막으로 http 요청을 사용하는 컴포넌트를 `AsyncBoundary`로 감싸준다. `ErrorBoundary`와 `Suspense` 내부에는 1개의 컴포넌트만 들어갈 수 있기 때문에, http 통신을 사용하는 컴포넌트의 부분 조각들을 모두 개별 컴포넌트 파일로 작성해주기로 했다.

```tsx
return (
  <AsyncBoundary rejectedFallback={<h1>임시 에러 페이지</h1>}>
    <Home />
  </AsyncBoundary>
);
```

길고 복잡했지만 뿌듯했던 에러 핸들링의 대장정 끝!

---

**Ref**

- https://rinae.dev/posts/how-to-handle-errors-1
- https://rinae.dev/posts/how-to-handle-errors-2
- https://jbee.io/react/error-declarative-handling-1/
- https://reactjs.org/docs/concurrent-mode-suspense.html
- https://ko.reactjs.org/docs/error-boundaries.html
- https://helloinyong.tistory.com/162
- https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
