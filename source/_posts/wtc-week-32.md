---
title: 우테코 32주차 기록
date: 2021-09-18 20:20:47
tags: woowacourse
thumbnailImage: https://i.imgur.com/bHl7fHd.jpg
---

Lv4 1차 데모데이 | 애플 클론코딩

<!-- more -->

---

## 놀토 프로젝트

### 카카오 공유하기

Kakao API를 이용해서 카카오 공유 기능을 만들었다! TypeScript 타이핑 때문에 조금 복잡했지만 쉽게 사용할 수 있었다.

<img src="01.png" />

### 마크다운 컴포넌트 작성

[react-markdown](https://www.npmjs.com/package/react-markdown) 라이브러리를 사용해서 피드 업로드 시 마크다운 문법을 사용할 수 있도록 해주었다.

<img src="02.png" />

[remove-markdown](https://www.npmjs.com/package/remove-markdown) 라이브러리를 추가적으로 사용해서 피드 썸네일에서는 일반 텍스트로 나오게끔 작성해 주었는데, 왠지 하나의 기능에 라이브러리를 떡칠(…)한 것 같아서 어떻게 할지 고민이다.

### gif to mp4

진입 페이지의 FCP(First Contentful Paint)와 LCP(Largest Contentful Paint)에 큰 영향을 주는 피드의 gif 확장자 파일들을 mp4 확장자로 변경하여 렌더링하기로 했다. 백엔드에서 [FFmpeg](https://ffmpeg.org/) 툴을 활용하여 변환해주었다. 뚝딱뚝딱 잘 만들어주는 우리팀 백엔드 팀원들에게 무한 감사를… 🙇‍♀️

덕분에 페이지 진입 시 받아오는 리소스의 용량이 1/10 수준으로 줄어들었다!

### 페이지 전체의 focusout 이벤트 처리

검색창의 옵션, 프로필 드롭다운 등 무언가 부수적인 렌더링 요소가 보였다가 다른 곳을 클릭하면 사라져야 하는 이슈가 아직 해결되지 않고 있었다. 이번 스프린트에 리팩토링을 진행하며 이슈를 해결해보았다. (천재 코더 페어 미키의 작품 👍)

드롭다운의 열고 닫힌 상태를 관리하는 상황이라고 가정해보자.

1. 컴포넌트 단에서 `useFocusOut` hook을 실행한다.
2. 드롭다운을 닫는 콜백함수를 전달하여 `registeredCallbackInfos` 배열에 담아준다.
3. 현재 페이지를 가리키는 `document`에 `mousedown` 이벤트를 걸어준다. 그러면 페이지에서 발생하는 마우스 클릭 이벤트에 대해서 이벤트 핸들러가 trigger될 것이다.
4. 이때 마우스를 클릭한 곳이 `event.target` 즉 `ref`가 가리키는 DOM 요소가 아니라면 (현재 열려 있는 드롭다운의 외부를 클릭했다면) 해당 드롭다운을 닫는 콜백함수를 실행한다.
5. 마지막으로 드롭다운 컴포넌트 unmount 시 더 이상 해당 콜백 함수는 의미가 없어지므로 `useEffect`의 cleanup 함수를 통해서 해제해준다.

```tsx
import React, { useEffect, useRef, useState } from "react";
import { genNewId } from "utils/common";

interface RegisteredCallbackInfo {
  id: number;
  callback: () => void;
  targetElementRef: React.MutableRefObject<Element>;
}

const idGenerator = genNewId();

let registeredCallbackInfos: RegisteredCallbackInfo[] = [];

// (3)
document.addEventListener("mousedown", (event) => {
  registeredCallbackInfos.forEach((callbackInfo) => {
    if (!callbackInfo.targetElementRef.current) return;

    // (4)
    if (
      !callbackInfo.targetElementRef.current?.contains(event.target as Node)
    ) {
      callbackInfo.callback();
    }
  });
});

const useFocusOut = (callback: () => void) => {
  const [id, _] = useState(idGenerator.next().value);
  const targetElementRef = useRef(null);

  useEffect(() => {
    // (2)
    registeredCallbackInfos.push({
      id,
      callback: callback,
      targetElementRef,
    });

    // (5)
    return () => {
      registeredCallbackInfos = registeredCallbackInfos.filter(
        (callbackInfo) => callbackInfo.id !== id
      );
    };
  }, []);

  return targetElementRef;
};

export default useFocusOut;
```

사용하는 측에선 간편하게 렌더링 요소를 보이지 않게끔 하는 콜백함수만 넘겨주면 된다.

```tsx
const SearchOption = ({ searchType, setSearchType }: Props) => {
  const [isOptionOpened, setIsOptionOpened] = useState(false);

  // (1)
  const ref = useFocusOut(() => {
    setIsOptionOpened(false);
  });

  return (
    <Styled.Root ref={ref} $isOpen={isOptionOpened}>
      {/* ... */}
    </Styled.Root>
```

아래처럼 각종 드롭다운이나 열려있는 옵션 창들에 대해, 외부를 클릭해도 닫히는 자연스러운 인터랙션을 구현할 수 있게 되었다!

<img src="03.gif" />

### 데모데이

우연의 장난으로(?) 백신 2차 접종을 막 마친 두 명의 크루가 발표를 진행했다. 깜짝 준비한 추석 테마🌝에 대한 호응이 좋았다. 다른 팀들을 보니 우리도 성능 최적화와 웹 접근성 개선에 조금 더 공을 들여야할 것 같다.

---

## 프론트엔드

### 애플 클론코딩 미션

🍀 [여기서 읽기](https://zigsong.github.io/2021/09/18/apple-clone/)

### TypeScript declare

🍀 [여기서 읽기](https://zigsong.github.io/2021/09/18/typescript-declare/)

---

## 공부하기

### 프론트에서 안전하게 로그인 처리하기

앱 로그인 시 refreshToken을 사용하여 보다 세션을 오래 유지하면서 token을 안전하게 처리할 수 있는 방법을 소개한 글이다. JWT 형식으로 생성된 accessToken은 일정 시간이 지나면 만료되지만, 클라이언트에서 refreshToken을 오래 유지하면서 지속적으로 서버에 요청을 보내면 그때마다 새로운 accessToken을 보내줄 수 있기 때문에 유용하다.

알고 있는 대로 token을 localStorage나 쿠키에 저장하는 것은 XSS 공격과 CSRF 공격에 취약할 수 있다. 이때 쿠키에 refreshToken만 저장하고 새로운 accessToken을 받아와 인증에 이용하는 구조에서는 CSRF 공격을 방어할 수 있다. 여기서 쿠키를 이용할 때는 `secure` 옵션과 `httpOnly`를 사용해야 한다.

> ✅ **secure** - HTTPS가 아닌 통신에서는 쿠키를 전송하지 않는다.
> ✅ **httpOnly** - 브라우저에서 JavaScript로 쿠키에 접근할 수 없다. (오직 http를 통한 전송만 가능)

쿠키에 refreshToken만을 `secure` `httpOnly` 쿠키에 저장하고, accessToken은 앱 내 변수로 관리한다. 그러나 XSS 취약점을 이용한 API 요청 공격은 클라이언트와 서버에서 추가적으로 방어해줘야 한다. 시간이 지나 accessToken이 만료되었다면 클라이언트는 서버에 refreshToken을 보내 새로운 refreshToken과 accessToken을 전달 받는다.

> XSS 공격의 취약점을 방어하기 위해서는 사용자가 악의적으로 입력한 코드가 HTML 또는 JavaScript로 인식되지 않도록 escape 처리를 해주는 등의 방식이 있다. (React에서는 자동으로 처리해주기도 한다.)

refreshToken과 accessToken을 결합하여 세션이 만료되어도 유저가 다시 직접 로그인하도록 유도하지 않고 조용히 자동으로 로그인을 연장하게끔 기능을 구현할 수도 있다.

**Ref** https://velog.io/@yaytomato/프론트에서-안전하게-로그인-처리하기

### 비동기 처리 시 race condition 고려하기

하나의 처리를 위해 다수의 작업이 동시에 수행되는 경우, 처리를 제어하는 입장에서 무엇이 먼저 완료될지 예측하는 것은 어렵다. 즉 요청 순서와 응답 순서가 반드시 같지는 않다.

여러 개의 요청을 보냈을 때 마지막 응답의 결과는 매번 바뀔 수 있기 때문에, 마지막 요청에 대한 응답만을 처리해줘야 하는 상황이 발생한다. 이때 **AbortController**를 사용하여 특정 시점 자체의 요청 자체를 중단시킬 수 있다. AbortController는 브라우저 Web API로, `fetch` 등의 요청을 취소할 수 있는 메서드를 제공한다.

```jsx
// AbortController 인스턴스를 생성한다.
const controller = new AbortController();

fetch(url, {
  signal: controller.signal,
});

// 원하는 시점에 해당 요청을 취소한다.
controller.abort();
```

> debounce, throttle 등 불필요한 이벤트의 반복을 줄일 수 있는 방법을 함께 사용한다면 비동기 처리의 안전성을 더욱 높일 수 있다!

**Ref**
https://github.com/woowacourse/tecoble/blob/2c793ef26f3004480c822d4aff79b96a525027a2/src/content/post/2021-09-12-race-condition-handling.md (테코블 업로드되면 수정 필요)
https://developer.mozilla.org/ko/docs/Web/API/AbortController

---

## 기타

### React Design Principles

**Ref** https://ko.reactjs.org/docs/design-principles.html

### S3, Cloudfront, 도메인 연결, dev server 추가

**Ref** https://wnsah052.tistory.com/199?category=922546

### 메모&정리용 앱

**Ref**
https://www.mindnode.com/
https://botobo.kr/
https://transno.com/
https://workflowy.com/hello/

---

## 마무리

미션하느라 며칠 제대로 자지도 못하고 거의 울상이었다. 백신도 맞은 채로 무리한 게 확실하다. 피할 수 없었던 번아웃이 온 게 맞지만 회복할 여유조차 없다. 약간 예민해져 있었는데, 그래도 잘 컨트롤하려고 노력했던 것 같다.

마지막 데모데이 날 대유행어가 탄생하고 말았다. 이제 혼자 두 달 남짓한 기간 동안에도 잘할 수 있겠지? 그래왔던 것처럼.
