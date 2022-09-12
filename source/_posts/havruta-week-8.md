---
title: 하프 스터디 8주차 - 에러 핸들링
date: 2021-05-23 22:42:50
tags:
---

with 썬

<!-- more -->

<img src="/images/thumbnails/havruta-thumbnail.jpeg" />

---

## Q1. 클라이언트에서 마주하는 에러 종류에 따라 예외 처리를 어떻게 해주면 좋을까요? 같이 이야기해보아요

**1. 예상 X 해결 방법 O**

- 네트워크 에러
- 일시적인 에러 표시, 다시 시도할 가이드 제공
- 👾 snackbar나 toast같은 noti를 사용하는 건 어떨까?
- 🌞 snackbar는 정상작동의 경우에만 사용
  - 네트워크 에러 (ex. 상품 목록을 불러오는 데 실패할 경우)
  - 보여줄 상품 목록이 없으므로 페이지 전체에 에러 표시하는 게 좋지 않을까?
  - snackbar는 사라져 버리니까 사용자가 이유를 모를 수도 있음
  - 사용자에게 동작을 요청할 만한 에러

**2.예상 X 해결 방법 X**

- 개발자 제어권 밖
- 고객 센터 문의 경로 제공
- Sentry 등

**3. 예상 O 해결 방법 X**

- 보안 에러
- 사용자가 고의적으로 비정상적인 접근
- CORS, XSS → 보안팀과 협력?
  - 🌞 input 창에 ‘?’ 등 query에 사용되는 특문 사용 금지
  - innerHTML을 지양해야 하는 이유
  - cf) React `dangerouslySetInnerHTML`

**4. 예상 O 해결 방법 O**

- 400대 에러
- 비즈니스 로직
- 적절한 가이드, 별도 페이지
- 👾 권한이 없는 사용자일 때 에러 처리 어떻게?
  - 🌞 토큰이 유효하지 않으면 login page로 redirect하는 건 사용자 입장에서 영문도 모른 채 쫓겨나는 기분 (ex. 우테코 LMS)
  - session 만료되기 전에 (ex. 은행 페이지) 알려주는 방법
  - 👾 수강신청 페이지!
- 👾 form input validation 어떻게?
  - 🌞 이름 제한 또는 메시지 띄우는 방식
    - 사용자 행동을 너무 강하게 제한하면, 사용자 경험이 안 좋아질 수도 있는 문제
    - 이유를 알려주는 정도!
  - ex) payments에서 이름 입력 시, 한글 이름이 안 쳐지는 경우!
- 에러 전파를 막기 위한 장치 → 👾 Error Boundary에 대한 생각?
  - [Jbee’s AsyncBoundary](https://jbee.io/react/error-declarative-handling-1/#asyncboundary)
  - 🌞 여러 에러가 공존하는 경우 에러 난 부분에서만 처리하는 건 좋은 것 같음
  - fb 댓글창 버그의 경우 하던 동작이 날라가버리지 않기 위해 → 방지용으로 바운더리 설정

**Ref** https://jbee.io/react/error-declarative-handling-2/

---

## Q2. Promise의 `then~catch` 체이닝에서 잡는 에러와, async-await 구문의 `try~catch`에서 잡는 에러는 어떤 차이가 있을까요?

```tsx
const makeRequest = () => {
  try {
    getJSON()
      .then((result) => {
        // this parse may fail
        const data = JSON.parse(result);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

const makeRequest = async () => {
  try {
    // this parse may fail
    const data = JSON.parse(await getJSON());
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
```

→ Promise의 then chaining 안에서 발생한 JSON.parse에러는 `try~catch` 문에서 잡히지 않는다.

- 🌞 400 error의 경우 catch에서 잡히지 않는다
  → `response.ok`로 한번 더 잡아줌

\+ 👾 async-await에서 try-catch를 쓰는 게 무의미하다? ([참고](https://velog.io/@vraimentres/async-함수와-try-catch))

→ 최초로 fetch를 해오고, 다음 함수에서 JSON.parse하고, 다음 함수에서 사용해줄 때

- 중간에서 한 번 더 `try~catch`로 묶어줄 필요가 없다. 어차피 상위에서 내려오기 때문에 Error catch가 가능하다.

**Ref** https://medium.com/@constell99/자바스크립트의-async-await-가-promises를-사라지게-만들-수-있는-6가지-이유-c5fe0add656c

---

## Q3. 장바구니 미션에서 redux를 사용하며 에러처리를 어떻게 했는지 함께 이야기해 봐요!

```tsx
// action creator
export const getCartItemsRequest =
  () => async (dispatch: Dispatch<GetCartItemsAction>) => {
    dispatch({ type: GET_CART_ITEMS_REQUEST });

    try {
      const response = await api.get("customers/zigsong/carts");
      const cartItems = snakeToCamel(response.data);

      dispatch({ type: GET_CART_ITEMS_SUCCESS, cartItems });
    } catch (error) {
      dispatch({ type: GET_CART_ITEMS_FAILURE, error });
    }
  };
```

```tsx
// 사용처
dispatch(addCartItemRequest(product))
  .then(() => {
    enqueueSnackbar(MESSAGE.ADDED_CART_ITEM_SUCCESS);
  })
  .catch((error: Error) => {
    enqueueSnackbar(error.message);
  });
```

---

## Q4. ErrorBoundary를 사용해보거나, 고려해본 적이 있나요?

**Ref** https://ko.reactjs.org/docs/error-boundaries.html

---

## Q5. finally를 사용해본 경험이 있나요? 어떤 상황에서 사용하면 좋을까요?

- 프로그램을 종료시키는 상황
  - Java에서는 파일을 열고 닫는 상황에서 사용 (IO)
  - 파일을 열고 try 구문에서 제대로 읽었던, 파일을 썼던 상관 없이 finally에서는 닫아줘야 함
- 요청을 성공하든, 실패하든 loading 상태를 바꿔주기 위해 사용
  - https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally

---

## Q6. 아래와 같은 리뷰를 받는다면 어떤 식으로 반영하실 건가요?

> 403, 500 과 같은 공통적으로 처리 할 수 있는 에러들은 미들웨어 같은 역할의 레이어에서 처리하도록 하여 매 함수마다 중복되는 코드를 제거 할 수 있습니다. axios 같은 라이브러리는 그런 기능을 지원하지만 fetch API 에는 그런 기능이 없기 때문에 별도로 만들어서 쓰거나 다른 라이브러리를 쓰거나 해야 합니다.

- React Query [예시코드](https://react-query.tanstack.com/quick-start)

  - 비동기 요청의 데이터 무결함에 대한 책임을 개발자가 아니라 React 앱 자체가 책임지게 하는 라이브러리

- axios interceptor [링크](https://xn--xy1bk56a.run/axios/guide/interceptors.html)

  ```tsx
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === "400") {
        // 에러 핸들링
      }
      return Promise.reject(err);
    }
  );

  const api = axios.create({
    baseURL: "https://shopping-cart.techcourse.co.kr/api/",
  });

  // 컴포넌트
  api.get("").then(() => {});
  ```

  [깃헙 링크](https://github.com/axios/axios#interceptors)

  - 🌞 500 에러의 경우 유용하게 사용할 수 있을 것 같다!
    - 공통적으로 처리될 수 있는 에러

---

## Q7. 지금까지 미션을 진행하며 가장 마음에 들었던 에러처리 사례를 하나 소개해주세요!

- 클라이언트단 에러

  - javascript-subway 미션의 `setCustomValidity`

    ```tsx
    setInputValidity() {
      const validityState = this.$stationNameInput.validity;

      if (validityState.valueMissing) {
        this.$stationNameInput.setCustomValidity('역 이름을 입력해 주세요.🙀');
      } else if (validityState.tooShort) {
        this.$stationNameInput.setCustomValidity('2글자 이상 입력해 주세요.👾');
      } else if (validityState.patternMismatch) {
        this.$stationNameInput.setCustomValidity('공백, 특수문자를 제외한 한글을 입력해 주세요.🤓');
      } else {
        this.$stationNameInput.setCustomValidity('');
      }
    }
    ```

- 비동기 에러 처리

  - shoppingcart 미션에서의 리덕스 에러 핸들링 (dispatch~then chaining)
  - 🌞 굳이 try~catch로 에러를 중간에서 한번 더 던져줄 필요도 없는 것 같다 (2번 질문의 링크 참조)
  - 👾`reponse.ok` 도 잘 사용하기!
