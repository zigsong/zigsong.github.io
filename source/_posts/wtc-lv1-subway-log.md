---
title: 우테코 Lv1 subway 학습로그
date: 2021-04-10 09:06:43
tags: woowacourse
thumbnailImage: https://i.imgur.com/frkONDC.jpg
---

우테코 Lv1 subway 학습로그

<!-- more -->

---

[PR-Step1](https://github.com/woowacourse/javascript-subway/pull/8#issuecomment-826063318)
[PR-Step2,3](https://github.com/woowacourse/javascript-subway/pull/50#issuecomment-826063465)

---

# Step1

## history event customize하여 SPA Routing 흉내내기

### `history.pushState()`

브라우저의 세션 기록 스택에 상태를 추가한다.

```jsx
history.pushState(state, title[, url]);
```

### `history.popState()`

- 브라우저의 백 버튼이나 (`history.back()` 호출) 등을 통해서만 발생한다.
- `history.pushState()` 또는 `history.replaceState()`는 popstate 이벤트를 발생시키지 않으며, 같은 document에서 두 히스토리 엔트리 간의 이동이 있을 때만 발생한다.

### `CustomEvent`로 `pushState` 재정의하기

```jsx
const routeTo = (path) => {
  history.pushState({ path }, null, path);
  window.dispatchEvent(new CustomEvent("pushState", { detail: path }));
};

window.addEventListener("popstate", (e) => {
  routeTo(e.state.path);
});

window.addEventListener("pushState", (e) => {
  this.components[e.detail].init();
});
```

**링크**

- https://developer.mozilla.org/ko/docs/Web/API/History/pushState
- https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event

---

## JWT Usage

**🍪cookie**
후속 요청으로 서버로 다시 보내야 하는 데이터 (token 등)를 저장한다. 주로 서버에서 읽기 위한 목적으로 사용한다.

`httpOnly` flag와 함께 전송하면 클라이언트 측 액세스(JavaScript로 접근)이 불가하며, XSS 공격을 막을 수 있다.
하지만 여전히 CSRF 공격의 위험성이 존재한다. 인증된 유저가 존재하는 페이지에 악성 코드를 심어, cookie에 저장된 token이 현재 어느 웹페이지에 있든 요청에 담길 수 있다.

**📮 storage**
XSS (Cross-Site Scripting) 공격에 취약하다. XSS 공격은 웹 애플리케이션에 권한이 없는 사용자가 스크립트를 삽입할 때 발생한다. 사용자의 쿠키를 탈취하는 경우도 발생한다.

cookie에 token 저장하기

```jsx
export const setCookie = ({ key, value, expireDays }) => {
  const expireDate = new Date();

  expireDate.setDate(expireDate.getDate() + expireDays);
  document.cookie = `${key}=${value}; expires=${expireDate}`;
};

setCookie({
  key: "token",
  value: userToken,
  expireDays: SESSION_EXPIRE_DAYS,
});
```

서버에 토큰 담아 요청 보내기

```jsx
const response = await fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});
```

### Bearer HTTP Authentication

JWT 토큰을 사용하여 인증하는 경우 인증 타입을 bearer 로 사용하고, 이러한 인증 방법을 Bearer Authentication라고 한다.

**Ref**
https://techcourse.woowahan.com/s/r1RL8HTw/ls/0aOaOoeY

---

## SPA를 위한 webpack 설정

### SPA (Single Page App)

- 애플리케이션에 필요한 모든 정적 리소스를 최초 한번에 다운로드하고, 그후 새로운 페이지 요청이 발생할 경우 필요한 데이터만 전달 받아 페이지를 갱신한다.

- CSR (Client Side Rendering)

- 페이지의 일부만 바뀌고, 페이지 이동 시 전체를 새로 업데이트할 필요 없기 때문에 반응 속도가 빠르다

- vs MPA (Multi Page App) (ref)

  - SSR (Server Side Rendering)
  - 완성된 html을 서버로부터 받기 때문에 SEO에 유리하다

### `HtmlWebpackPlugin`

- 번들링 결과 dist에 html 파일을 생성해준다.
- 웹팩 번들링 결과의 css와 js 파일을 각각 html에 심어준다.
