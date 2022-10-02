---
title: 리액트 훅 테스트
date: 2021-08-01 17:39:23
tags: frontend
thumbnailImage: https://i.imgur.com/stTzX5o.png
---

react hook test

<!-- more -->

---

custom hook으로 작성한 react query의 동작을 테스트하기 위해 **react-hooks-testing-library**를 사용했다. 기본적으로 `renderHook`이라는 메서드를 제공하여, hook 테스트를 위해 별도의 컴포넌트를 작성하여 hook을 호출할 필요가 없다. 내부적으로 HTTP request를 사용하는 hook이나, 복잡한 컴포넌트 로직 내에서 동작하는 hook의 경우에 **react-hooks-testing-library**를 사용하여 간단하게 테스트를 진행해볼 수 있다.

`renderHook`에 테스트하고자 하는 hook 함수를 넘겨주고, 반환값인 `result`를 이용하여 hook 호출의 성공 여부(`isSuccess`)와 반환된 데이터(`data`)를 검사한다.

```tsx
import { renderHook } from "@testing-library/react-hooks";

describe("useRecentFeeds 테스트", () => {
  it("최신 피드를 불러올 수 있다.", async () => {
    const { result, waitFor } = renderHook(() =>
      useRecentFeeds({ filter: FilterType.PROGRESS })
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockFeeds);
  });
});
```

hook 실행 후 일정 시간이 지나야 통과되는 비동기적인 실행이라면, `renderHook`에서 반환되는 `waitForNextUpdate` 함수를 통해 hook 내부 로직에서 변화가 발생하는 시점까지 기다린 후 `expect`문을 실행할 수 있다.

```tsx
import { renderHook } from "@testing-library/react-hooks";

describe("useOAuthLogin 테스트", () => {
  it("github으로부터 액세스 토큰을 받아올 수 있다.", async () => {
    const { waitForNextUpdate } = renderHook(() => useOAuthLogin("github"));

    await waitForNextUpdate();

    expect(localStorage.getItem("accessToken")).not.toBeNull();
  });

  it("google로부터 액세스 토큰을 받아올 수 있다.", async () => {
    const { waitForNextUpdate } = renderHook(() => useOAuthLogin("google"));

    await waitForNextUpdate();

    expect(localStorage.getItem("accessToken")).not.toBeNull();
  });
});
```

테스트에 사용된 hook들은 모두 서버 데이터를 가져오는 react query 코드였는데, 이때 [msw(mock-service-worker)](https://mswjs.io/)를 이용하여 실제 서버로 가는 요청을 가로채 지정한 응답을 반환해줬다. 실제 서버는 언제든지 터지거나 사이드 이펙트가 발생할 수 있기 때문에, 서버를 mocking하여 기대하는 결과값이 나오는지 검사해준다.

```tsx
rest.get(`${BASE_URL.production}/login/oauth/:type/token`, (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      accessToken: 'mock-access-token-abc-123',
    }),
  );
}),
```

이밖에도 `act` 함수를 통해 hook 내부에 정의한 함수를 실행시켜줄 수도 있으며, `renderHook`에 전달되는 hook에 인자를 넘겨줄 수도 있다. 여러모로 유용하게 hook test를 작성할 수 있다!

---

**Ref**

- https://react-query.tanstack.com/guides/testing
- https://react-hooks-testing-library.com/
- https://kentcdodds.com/blog/how-to-test-custom-react-hooks
- https://testing-library.com/docs/react-testing-library/example-intro/#mock
- https://mswjs.io/
