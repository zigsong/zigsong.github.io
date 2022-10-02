---
title: 우테코 Lv2 shoppingcart 학습로그
date: 2021-05-19 23:17:43
tags: woowacourse
thumbnailImage: https://i.imgur.com/frkONDC.jpg
---

우테코 Lv2 shoppingcart 학습로그

<!-- more -->

---

- [PR-Step1 바로가기](https://github.com/woowacourse/react-shopping-cart/pull/21)
- [PR-Step2 바로가기](https://github.com/woowacourse/react-shopping-cart/pull/42)

# 1️⃣ Step1

---

## useCallback

메모이제이션된 콜백을 반환한다. `useCallback`의 콜백의 의존성이 변경되었을 때에만 함수가 변경된다.

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**👾 자식 컴포넌트가 무겁거나 반복될 때 `useCallback`으로 최적화하기**

만약 자식 컴포넌트가 `React.memo()` 와 같은 API로 최적화되어 있고 그 자식 컴포넌트에게 callback 함수를 `props`로 넘길 때, 상위 컴포넌트에서 `useCallback` 으로 함수를 선언하는 것이 유용하다. (함수 컴포넌트에서는 리렌더가 발생할 때마다 그 내부의 메서드들을 재정의한다.) 함수가 매번 재선언되면 하위 컴포넌트는 넘겨 받은 `props`가 달라졌다고 인식하여 리렌더되기 때문이다.

그러나 자식 컴포넌트를 리렌더링하는 데 큰 퍼포먼스적 이슈가 발생하지 않는다면 `useCallback`을 사용하지 않는 것이 좋다 (굳이 최적화하는 것이 더 큰 비용을 필요로 하기 때문이다.) 모든 최적화는 복잡성을 증대시킨다.

```jsx
const ProductsPage = () => {
 const getProducts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get('/products');
      setProducts(snakeToCamel(response.data));
    } catch (error) {
      enqueueSnackbar(MESSAGE.GET_PRODUCTS_FAILURE);
    }

    setLoading(false);
  }, [enqueueSnackbar]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    // ...
  )
}
```

`getProducts`는 컴포넌트의 초기 렌더 시에만 호출되도록 의도하였으나, `getProducts` 메서드 자체가 custom hook의 리턴값이라 `useEffect`의 deps에 들어간다. 이때 컴포넌트가 리렌더될 때마다 `getProducts` 메서드가 재정의되어 `useEffect`가 다시 호출된다는 문제가 발생한다. 따라서 `useCallback`을 이용하여 `getProducts` 메서드를 메모이제이션해준다.

**Ref**

- https://github.com/woowacourse/react-shopping-cart/pull/21#discussion_r632967515
- https://dmitripavlutin.com/dont-overuse-react-usecallback/
- https://leehwarang.github.io/2020/05/02/useMemo&useCallback.html

---

## case mapper 함수

snake_case로 내려온 api 반환 값을 camelCase로 바꿔주기 위해 사용했다.

소스 출처는 스택오버플로우를 비롯한 여기저기서…

```tsx
// snakeToCamel.ts
// '-' 또는 '_' 뒤에 오는 문자열을 CamelCase로 변경
const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

// array 타입 체크
const isArray = (a: unknown) => Array.isArray(a);

// object 타입 체크
const isObject = (o: unknown) =>
  o === Object(o) && !isArray(o) && typeof o !== "function";

type NestedObject = Record<string, unknown>;
type NestedType = NestedObject | NestedObject[];

// api 통신을 통해 받아오는 json 객체가 nested되어있을 경우 재귀적으로 케이스 변환 시행
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const snakeToCamel = (o: NestedType): any => {
  if (isObject(o)) {
    const n: NestedObject = {};

    Object.keys(o as NestedObject).forEach((k) => {
      n[toCamel(k)] = snakeToCamel((o as NestedObject)[k] as NestedType);
    });

    return n;
  }

  if (isArray(o)) {
    return (o as NestedObject[]).map((i: unknown) =>
      snakeToCamel(i as NestedType)
    );
  }

  return o;
};

export default snakeToCamel;
```

---

## TypeScript interface vs type

interface는 **객체의 추상화를** 위해 사용하는 것이라면, type은 **타입 그 자체**에 포커스가 맞춰져 있다.

- 교차 타입 및 유니언 타입
  type은 교차 타입(`&`)과 유니언 타입(`|`) 작성이 가능하다. interface는 `extends` 키워드를 통해 한 개 이상의 타입으로부터 확장할 수 있다.

```tsx
type SuperUser = User & { super: true }
// ...
interface SuperUser extends User {
  super: true
}
type Z = A & B & C & D & E
// ...
interface Z extends A, B, C, D, E {}
type Z = A | B
//...
interface IZ extends A | B {} // <- ❌ INVALID SYNTAX,
```

- 재선언 (Redeclaration)

  type은 재선언이 불가하며, interface는 가능하다. interface를 같은 이름으로 재선언하는 경우 컴파일 타임에 선언적 병합이 이루어져 하나의 interface로 합쳐진다.

  ```tsx
  interface User {
    name: string;
  }

  interface User {
    gender: string;
  }

  const user: User = { name: "Ronald", gender: "male" };

  type User = { name: string };
  type User = { gender: string }; // ❌ Compilation error
  // "Duplicate identifier 'User'."
  ```

**👾 React에서는 type vs interface?**
대다수의 React library에서는 type 대신 interface를 채택하고 있다. 이후 사용자가 프로퍼티를 추가하는 등 interface를 재정의하거나 확장하는 데 있어 interface가 편리하기 때문이다. 그러나 언제나 상황에 따라 알맞는 컨벤션을 선택해야 한다!

**Ref**
https://dev.to/reyronald/typescript-types-or-interfaces-for-react-component-props-1408

---

## dispatch에서 then chaining 사용하기

```tsx
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "modules";

const dispatch = useDispatch<ThunkDispatch<RootState, null, Action>>();

dispatch(addCartItemRequest(product))
  .then(() => {
    enqueueSnackbar(MESSAGE.ADDED_CART_ITEM_SUCCESS);
  })
  .catch((error: Error) => {
    enqueueSnackbar(error.message);
  });
```

thunk middleware를 사용하는 redux action에서 api 요청 이후 success, error 상황에 대한 dispatch 함수를 리턴해주기 때문에 `dispatch~then~catch` 체이닝이 가능하다.

```tsx
// actions.ts

export const addCartItemRequest =
  (product: T.Product) =>
  async (dispatch: Dispatch<AddCartItemAction | GetCartItemsAction>) => {
    dispatch({ type: ADD_CART_ITEM_REQUEST, productId: product.productId });

    try {
      const response = await api.post("customers/zigsong/carts", {
        product_id: product.productId,
      });
      const { location } = response.headers;
      const cartId = location.substring(location.lastIndexOf("/") + 1);

      dispatch({ type: ADD_CART_ITEM_SUCCESS, payload: { cartId, product } });
    } catch (error) {
      dispatch({ type: ADD_CART_ITEM_FAILURE, error });
      throw error;
    }
  };
```

**Ref** https://blog.jscrambler.com/async-dispatch-chaining-with-redux-thunk/

---

## useHistory와 useLocation으로 컴포넌트 간 데이터 주고받기

`OrderListPage`에서 아이템 클릭을 통해 `OrderDetailPage`로 이동할 때, 현재 클릭한 주문 아이템의 정보를 전달한다.

```tsx
// OrderListPage.jsx
const OrderListPage = () => {
  const history = useHistory();

  const handleClickDetail = useCallback(
    (order: T.Order) => {
      history.push({
        pathname: '/order/detail',
        state: { order },
      });
    },
    [history]
  );

  return (
    // ...
  )
}
```

```tsx
// OrderDetailPage.jsx
interface LocationState {
  order: T.Order;
}

const OrderDetailPage = () => {
  const location = useLocation<LocationState>();
  const { order } = location.state;

  return (
    // ...
  )
}
```

👾 컴포넌트를 `withRouter` HoC로 감싸준다면 `useHistory`를 사용하지 않고 `history` 객체(BrowserRouter, Switch에 의해 생성된 defaultProps)를 props로 전달받을 수 있다. (`history`, `match`, `location` 값을 반환받는다.) `withRouter`로 감싼 컴포넌트는 앱의 최상단에 선언되는 `Router`(BrowserRouter, HashRouter 등)에 포함되어 있어야 하지만, 특정 path를 가리키는 `Route` 태그로 감싸주지 않아도 된다. 이때 해당 컴포넌트는 가장 가까운 `Route` path를 찾아 그에 맞는 값을 반환한다.

```tsx
import React from "react";
import { withRouter } from "react-router-dom";

const Home = ({ history }) => {
  return <div onClick={() => history.push("/auth")}>Hello!</div>;
};

export default withRouter(Home);
```

이 경우 마찬가지로 `useLocation` 대신 defaultProps 중 하나인 `location`을 사용할 수 있다.

**Ref**

- https://reactrouter.com/web/api/Hooks
- https://velog.io/@yiyb0603/React-Router-dom의-유용한-hooks들)

---

## 기타

### useEffect의 의존성 배열에 들어가는 dispatch

```jsx
useEffect(() => {
  dispatch(getCartItemsRequest());
}, [dispatch]);
```

`dispatch`는 hook이기 때문에 변할 가능성이 있고, `callback`은 `dispatch`에 의존성을 가졌기 때문에 `dispatch`가 바뀌었을 때 `callback`이 수행되어야 한다.

**Ref**
https://github.com/woowacourse/react-shopping-cart/pull/21#discussion_r634469756

---

### axios customize

아래와 같이 특정한 api 요청을 생성한다.

```tsx
const api = axios.create({
  baseURL: "https://shopping-cart.techcourse.co.kr/api/",
});
```

axios interceptor를 사용하여 요청/응답 시 처리할 로직을 추가할 수 있다.

```tsx
// 요청 인터셉터 추가
axios.interceptors.request.use(
  function (config) {
    // 요청을 보내기 전에 수행할 일
    // ...
    return config;
  },
  function (error) {
    // 오류 요청을 보내기전 수행할 일
    // ...
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
axios.interceptors.response.use(
  function (response) {
    // 응답 데이터를 가공
    // ...
    return response;
  },
  function (error) {
    // 오류 응답을 처리
    // ...
    return Promise.reject(error);
  }
);
```

**Ref** [https://이듬.run/axios/guide/interceptors.html](https://xn--xy1bk56a.run/axios/guide/interceptors.html)

---

### CSS 형제 선택자 `~`

현재 요소 다음에 오는 형제 요소(들)를 선택한다.

```css
div ~ p {
  background: grey;
}
```

```html
<p>para</p>
<div>my div</div>
<!-- selected -->
<p>change bg</p>
<!-- selected -->
<p>change bg</p>
```

👾 `+` 선택자는 바로 다음에 오는 형제 요소만 선택한다.

```css
div + p {
  background: blue;
}
```

```html
<div></div>
<!-- selected -->
<p></p>
<!-- not selected -->
<p></p>
```

---

### Immer.js

리덕스 스토어의 값을 불변성을 유지해주면서 업데이트할 때 편리하게 사용할 수 있다. `baseState`와 `draft`, `produce` 함수 를 사용한다.

**👾 redux store 값은 왜 불변성을 유지해야 할까?**

데이터의 불변성은 데이터 예측과 데이터 핸들링을 더욱 쉽게 만들어 준다…라고 하기엔 너무 애매하다!

redux의 데이터 변경 감지 방식은 얕은 비교(shallow comparison)를 통해 이루어진다. 변경되는 데이터를 단순하고 쉽게 감지하고 다시 렌더링하는 기술을 사용하기 때문에 단순 비교를 통해 좋은 성능을 유지하는 것이다.

이때 redux는 이전 state와 바뀐 state를 구분하는 방법이 참조값이 바뀌었는지 확인하고, 참조값이 바뀌면 state가 바뀌었다고 인식하여 해당 state를 사용하는 컴포넌트에게 리렌더링을 요청한다. 그런데 직접적으로 state를 변경하면 참조값이 변하지 않아 redux는 값이 바뀌었다고 인식하지 않고 리렌더링하지 않을 것이다.

redux의 time-travel debugging은 dispatch된 액션들 사이에 왔다갔다 하면서 실제 UI가 어떻게 보여질지를 결정한다. 이렇게 왔다갔다 하기 위해 reducer는 사이드 이펙트가 없는 순수함수여야 한다. reducer가 데이터를 직접 변경한다면, 상태의 전후 전환에서 사이드 이펙트가 발생할 것이다.

**Ref**

- https://immerjs.github.io/immer/
- https://redux.js.org/faq/immutable-data
- https://velog.io/@cyranocoding/redux에-Immutable.js을-끼얹어-상태-관리를-해보자불변성-관리

---

### api 요청 상태 구분하기

```tsx
export enum AsyncStatus {
  IDLE = "IDLE",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

export type CartState = {
  cartItems: {
    data: T.CartItem[];
    status: T.AsyncStatus;
  };
};
```

### react-app-rewired

👾 블로그 다른 글 참고

**Ref**
[CRA 앱에서 babel 설정을 도와주는 친구들](https://zigsong.github.io/2021/05/22/woowa-week-16/#CRA-앱에서-babel-설정을-도와주는-친구들)

# 2️⃣ Step2

---

## useDispatch & useSelector TypeScript customize

TypeScript외 redux를 사용한다면 store의 상태와 연결지어 `useDispatch`와 `useSelector`의 타입을 미리 정의할 수 있다.

```tsx
// modules/store.ts
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";

export const store = configureStore({
  reducer: {
    cartSlice,
  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

`useDispatch`와 `useSelector`에 대한 hook을 정의해 준다.

```tsx
// modules/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

React 컴포넌트에서 추가적으로 타이핑을 해주지 않아도 된다.

```tsx
// SomeComponent.jsx
const SomeComponent = () => {
  // const dispatch = useDispatch<Dispatch<StoreEvent>>();
  const dispatch = useAppDispatch();
  // const cartItems: CartState['cartItems'] = useSelector((state: RootState) => state.cartSlice.cartItems);
  const cartItems: CartState['cartItems'] = useAppSelector((state) => state.cartSlice.cartItems);

  return (
    // ...
  )
}
```

**Ref**

- https://redux-toolkit.js.org/usage/usage-with-typescript
- https://dev.to/sarimarton/easy-type-safety-with-usedispatch-and-useselector-4fii

---

## redyx toolkit `rejectWithValue`

`thunkAPI`의 옵션으로, `createAsyncThunk`에서 에러 핸들링을 위해 사용한다.

```tsx
rejectWithValue(value, [meta]);
```

`rejectWithValue`는 비동기 요청의 rejected된 응답을 지정된 `payload`와 `meta`와 함께 리턴하기 위해 사용된다. rejected되었을 때 실행될 액션의 payload에 값을 전달한다.

`return` 또는 `throw`할 수 있다.

```tsx
export const getCartItems = createAsyncThunk<{ cartItems: T.CartItem[] }>(
  "cartItems/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("customers/zigsong/carts");

      return { cartItems: snakeToCamel(response.data) };
    } catch (error) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response.data);
    }
  }
);
```

`rejectWithValue`로 던져진 에러 객체는 redux toolkit의 slice 객체에서 Promise가 rejected되었을 때 `action`의 `payload` 대신 `action.error`로 접근할 수 있다.

```tsx
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ...
  },
  extraReducers: {
    [getCartItems.pending.type]: ({ cartItems }) => {
      // ...
    },
    [getCartItems.fulfilled.type]: ({ cartItems }, action: PayloadAction<{ cartItems: T.CartItem[] }>) => {
      // ...
    },
    [getCartItems.rejected.type]: ({ cartItems }, action: PayloadAction<{ error: AxiosError }>) => {
      cartItems.status = T.AsyncStatus.FAILURE;
      //👇 action.error로 접근
      cartItems.error = action.error.message;
    },
```

**Ref**
https://redux-toolkit.js.org/api/createAsyncThunk#examples

---

## 기타

### Media Query 상수화

```tsx
const deviceSizes = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
};

const device = {
  mobile: `screen and (max-width: ${deviceSizes.mobile})`,
  tablet: `screen and (max-width: ${deviceSizes.tablet})`,
  laptop: `screen and (max-width: ${deviceSizes.laptop})`,
};

export const theme: Theme = {
  // ...
  device,
};
```

```tsx
// styles.ts
const Nav = styled.nav``;
  border: none;
  background: none;
  cursor: pointer;
  @media ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`;
```
