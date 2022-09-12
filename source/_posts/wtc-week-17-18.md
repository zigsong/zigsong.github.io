---
title: 우테코 17-18주차 기록
date: 2021-06-05 22:33:41
tags: woowacourse
---

React Testing Library | msw | custom hook

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

17주차가 상상을 초월할 만큼(?) 너무나 바쁘기도 했고, 18주차는 사실상 해탈하고 몸과 정신이 이미 방학해버렸기 때문에 하나의 포스팅으로 작성한다.

---

## 페어 프로그래밍

또 열심히 페어를 해봤다. `useFetch`, `useNotify` 등의 custom hook도 만들고, redux toolkit도 TypeScript 붙여서 무사히 적용했다. SUBWAY 테마를 이용해서 귀엽게 페이지도 꾸몄다. 마지막 날까지 백엔드 크루들과 정신없이 타임어택 코딩했지만, QA처럼 들어오는 수정사항들에 즉각적으로 코드를 고쳐 재배포하는 것도 나름 굉장한 경험이었다. 3팀을 뽑아 시연하는 날 우리 팀이 뽑혔는데, 크게 오작동 없이 작동해서 다행이었다.

<img src="01.png" />

그런데 테스트는 정말 머리가 아프다! 결국 마지막 주말에 뇌절하고 말았다.

---

## 테코톡 - 프론트엔드에서 Component란 & 프론트엔드에서의 테스트 종류

브랜 & 도비
정리 중…

---

## 공부하기

### msw (Mock Server Worker)

RTL을 사용하면서 mock server를 사용했다.

```tsx
const server = setupServer(
  rest.get("/stations", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(stationsData));
  })
);
```

실제 앱에서 보내는 데이터를 가로채서 localhost의 mock server로 보내주는 역할을 한다.

리액트의 대가 Kent C. Dodds 선생님께서도 msw를 권장하고 있다.
물론 클라이언트에서 서버로 보내는 요청을 test 단에서 처리하기 위해

```tsx
// jest.mock
jest.mock("../../utils/api-client");
```

위처럼 함수를 mocking하거나

```tsx
window.fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ success: true }),
});

expect(window.fetch).toHaveBeenCalledWith(
  "/checkout",
  expect.objectContaining({
    method: "POST",
    body: JSON.stringify(shoppingCart),
  })
);
```

이 같은 방식으로 `window.fetch`를 mocking할 수도 있다.

그러나 이는 클라이언트 테스트를 위해 매 요청마다 백엔드 서버 자체를 중복으로 건드려야 하는 문제가 있으며, 모든 테스트들을 작은 단위로 나눠서 각각 실행시키기 때문에 통합 테스트의 관점에서도 올바르지 못하다 (사실 정확히 무슨 말인지는 이해하지 못했다 😕)

이때 사용할 수 있는 것이 **msw**다. msw를 통해 실제 서버에서 돌리는 것처럼 클라이언트의 api 요청을 처리할 수 있다. Node.js의 **nock**도 비슷한 역할을 하는데, msw는 브라우저 환경에서도 실행 가능한 것이 장점이다.

**Ref**

- https://testing-library.com/docs/react-testing-library/example-intro/
- https://github.com/mswjs/msw
  https://kentcdodds.com/blog/stop-mocking-fetch

### (TypeScript) 객체타입에서의 두 가지 함수 표기법

```tsx
type ObjType = {
  foo: () => void;
  bar(): void;
};

interface ObjInterface {
  foo: () => void;
  bar(): void;
}
```

함수에 타입을 붙여주는 두 방식은 언뜻 보면 단지 스타일 차이같지만, strict mode를 활성화시키면 명확한 차이가 발생한다.

다음과 같이 `Animal` 타입과 이를 상속받는 `Dog` 타입이 존재한다.

```tsx
interface Animal {
  id: number;
}
interface Dog extends Animal {
  name: string;
}
```

이때 `Viewer`의 아래 타이핑 방식은 어떻게 동작할까?

```tsx
interface Viewer<T> {
  view: (v: T) => void;
}

declare let animalViewer: Viewer<Animal>;
declare let dogViewer: Viewer<Dog>;

dogViewer = animalViewer; // OK!
animalViewer = dogViewer; // Error!
```

`(v: T) => void`는 반변한다.

`dogViewer`에 `animalViewer`를 대입할 경우, `Dog`을 제공했을 때 모든 `Dog`은 `id`를 갖고 있으므로 정상동작한다. 반면 `animalViewer`에 `dogViewer`를 대입할 경우, `Animal`을 제공했을 때 `Animal`은 `Dog`이 갖고 있는 `name`을 갖고 있지 않을 수 있으므로 정상동작을 장담할 수 없다.

그러나 아래와 같은 타이핑은 어떻게 동작할까?

```tsx
interface Viewer<T> {
  view(v: T): void;
}

declare let animalViewer: Viewer<Animal>;
declare let dogViewer: Viewer<Dog>;

dogViewer = animalViewer; // OK!
animalViewer = dogViewer; // OK..?
```

`animalViewer = dogViewer`는 성립하지 않아야 하지만 타입 시스템은 아무런 문제도 찾지 못한다. 속성 단축 표기법을 사용할 경우 실제 공변/반변성과는 달리 양변(bivariant) 타입이 된다. strict mode임에도 불구하고 타입 시스템의 안정성을 확보할 수 없는 부분이 생기는 것이다.

그러므로 정말로 양변하는 타입을 의도한 것이 아니라면 항상 화살표 표기법을 사용하는 것이 좋다!

**Ref**
https://sorto.me/posts/2021-03-16+variance

### `useFetch` hook

오만가지 시도 끝에… `useFetch` custom hook을 구현해 보았다.

```tsx
type HTTP_METHOD = "GET" | "POST" | "PUT" | "DELETE";

const useFetch = (method: HTTP_METHOD = "GET") => {
  const [loading, setLoading] = useState<boolean>(false);
  const BASE_URL = useAppSelector((state) => state.serverSlice.server);

  const fetchData = async (endpoint: string, data?: unknown) => {
    setLoading(true);
    try {
      const response = await axios({
        method,
        url: `${BASE_URL}/${endpoint}`,
        data,
      });

      return { status: API_STATUS.FULFILLED, data: response.data };
    } catch (error) {
      console.error(error);

      return {
        status: API_STATUS.REJECTED,
        message: error.response?.data.message || ALERT_MESSAGE.SERVER_ERROR,
      };
    } finally {
      setLoading(false);
    }
  };

  return [fetchData, loading] as const;
};
```

대부분의 `useFetch` hook은 `GET` 요청일 때를 default로 구현이 되어 있다. 컴포넌트의 초기 마운트 시 데이터를 요청해오는 형태가 일반적이기 때문에 hook 메서드 내부에서 `useEffect` 호출을 통해 데이터를 fetch해 오는데, `POST`와 `PUT`, 그리고 `DELETE`까지 CRUD를 모두 다 쓰는 앱에서는 어쩔 수 없이 data를 fetch해오는 함수 (`fetchData`) 자체를 리턴해줘야 했다.

그리고 리턴타입을 객체가 아닌 배열로 하여 쓰고 싶은데, TypeScript 린트가 계속 해결할 수 없는 에러를 뱉어서 이런저런 시도 끝에 `as const`를 붙여줬다. 참조타입인 객체 또는 배열은 속성값이 언제든 변경될 수 있는 위험 때문에, 타입 추론의 범위를 좁혀주기 위해 const assertion을 사용해야 하는 것 같다. const assertion을 해준 객체의 프로퍼티 또는 배열의 원소들은 모두 `readonly`로 변경된다. (중첩된 경우에도 모두 `readonly`가 적용된다고 한다!)

리뷰어님께서 알려주신 [`use-http`의 `useFetch`](https://use-http.com/#/)에는 상당히 많은 http 관련 hook들이 있다.
cache와 interceptor, persist와 abort, suspense 등 http 요청의 부가적인 기능들까지 수행할 수 있는 나만의 custom hook을 만들어보는 것도 재밌을 것 같다!

**Ref**

- https://medium.com/@seungha_kim_IT/typescript-3-4-const-assertion-b50a749dd53b
- https://velog.io/@logqwerty/Enum-vs-as-const

---

## 알아보기

### NavLink

navigation bar를 구현할 때 사용했다. `Route`를 구현할 때, 현재 matching된 URL에 해당한 링크만 하이라이팅해줄 수 있다.

```tsx
const NavBar = () => {
  return (
    <NavLink to={ROUTE.LOGIN} activeStyle={selectedNavStyle}>
      <Styled.NavItem>로그인</Styled.NavItem>
    </NavLink>
    <NavLink to={ROUTE.SIGNUP} activeStyle={selectedNavStyle}>
      <Styled.NavItem>회원가입</Styled.NavItem>
    </NavLink>
  )
}
```

**Ref** https://reactrouter.com/web/api/NavLink

---

## 기타

### 실용적인 프론트엔드 테스트 전략

**Ref**
https://www.youtube.com/watch?v=q9d631Nl0_4&t=1595s

### 프론트엔드에서 우아하게 비동기 처리하기

**Ref**

- **React Concurrent Mode**
- **useTransition**
- **useDeferredValue**
  https://www.youtube.com/watch?v=FvRtoViujGg

### 웹 브라우저의 렌더링 프로세스와 웹 성능 최적화

**Ref** https://cresumerjang.github.io/2019/06/24/critical-rendering-path/

### 기타 테스트 도구들

**react-hook-test-library**
https://react-hooks-testing-library.com/

**redux-saga-test-plan**
https://www.npmjs.com/package/redux-saga-test-plan

### React Hooks: What’s going to happen to my tests?

**Ref** https://kentcdodds.com/blog/react-hooks-whats-going-to-happen-to-my-tests

---

## 마무리

일단 React Testing Library가 너무나도 어렵다… 🤯
하다보면 정말 재미가 없고, 돌아가지도 않고, 개발을 포기하고 싶어지기까지 한다!
그치만 뭐 별 수 있나 계속 해야지 😑 마냥 재밌기만 한 일은 없는 것 같다.

코치 공원과 면담을 했다. 사실상 면담이 아닌 만담이었지만.
정말 내 주변엔 내가 기댈 수 있는 좋은 사람들이 많이 있다는 것을 알았다. 많이 고맙다.
지칠 때도 있겠지만, 모두가 똑같을 것이다. 모두 누군가의 도움을 필요로 할 것이고, 서로 도와주면서 버텨내는 것이다. 나도 누군가에게 힘이 되어줄 수도 있을까?

리뷰어이자 배민 FE 개발자이신 Vallista님과도 식사를 했다.
온통 모르는 이야기들이 많이 나와서 조금 어질어질했지만,
단순한 비즈니스 관계가 아니라 정말 우리에게 많은 도움을 주시고자 신경 써주신다는 점을 느낄 수 있었다.
그리고 개인적으로는 정말 대단하신 분이다. 누가 봐도 대단한 사람.
나만의 `엣지`를 갖춘 개발자가 되자, 지그!
