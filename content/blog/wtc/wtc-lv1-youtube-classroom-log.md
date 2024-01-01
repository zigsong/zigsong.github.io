---
title: 우테코 Lv1 youtube classroom 학습로그
date: 2021-03-18 09:50:49
tags: ["woowacourse"]
thumbnailImage: https://i.imgur.com/frkONDC.jpg
---

우테코 Lv1 youtube classroom 학습로그

<!-- more -->

---

[PR-Step1](https://github.com/woowacourse/javascript-youtube-classroom/pull/7#issuecomment-826062608)
[PR-Step2](https://github.com/woowacourse/javascript-youtube-classroom/pull/32#issuecomment-826062783)
[PR-Step3](https://github.com/woowacourse/javascript-youtube-classroom/pull/54#issuecomment-826062950)

---

# Lv1

## custom dom library

- 추상화 수준이 높아질수록 DOM 라이브러리는 더욱 복잡하고 비대해진다. 문서화와 유지보수가 중요하다
- jQuery, React 등 잘 만들어진 라이브러리를 참고해보자
- [custom dom library 파일 링크](https://github.com/zigsong/javascript-youtube-classroom/blob/1c7404330fb17721361d350598a83e646f92aa70/src/js/utils/dom.js)

**링크**
https://gomakethings.com/how-to-create-your-own-vanilla-js-dom-manipulation-library-like-jquery/

---

## HTTP Cache

HTTP Cache를 이용하면 이전에 가져온 리소스들을 재사용하여 성능을 향상시킬 수 있다. 저장소 내에 리소스를 저장하여, 이후 요청 시 요청을 가로채 서버로부터 리소스를 다시 다운로드하는 대신 리소스의 복사본을 반환한다.

서버에서 응답을 내려줄 때 HTTP 헤더에 `Cache-Control` 옵션을 포함시켜 보내준다.

**링크**

- https://developer.mozilla.org/ko/docs/Web/HTTP/Caching
- https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control
- https://pjh3749.tistory.com/264

---

## promise-then보다는 async-await

async-await을 사용하면 동기적 코드의 흐름으로 개발이 가능하며, 코드가 더욱 간결해진다.

또, 동작의 분기를 간편하게 작성할 수 있어 코드의 가독성을 높인다.

Promise를 이용한 방법

```jsx
const posts = () => {
  getJSON()
    .then(data => {
      return getPosts(data);
        .then(posts => {
          console.log(posts);
          return posts;
        })
    })
}
```

async-await을 이용한 방법

```jsx
const posts = async () => {
  const data = await getJSON();
  const posts = await getPosts(data);

  console.log(posts);
  return posts;
};
```

`async-await`은 `try~catch`로 에러 핸들링이 가능하며, 에러 발생 위치를 파악하기 쉽다.

**링크**

- https://ithub.tistory.com/223
- https://medium.com/@constell99/자바스크립트의-async-await-가-promises를-사라지게-만들-수-있는-6가지-이유-c5fe0add656c

---

## throttle

`setTimeout`으로 작성한 throttle을 이용하여 사용자 이벤트의 감지를 지연시킬 수 있다.

```jsx
export default function throttle(callback, delay) {
  let ticking;

  return function () {
    if (ticking) return;

    ticking = setTimeout(() => {
      ticking = null;
      callback.apply(this, arguments);
    }, delay);
  };
}
```

**👾 `callback.apply()`를 쓰는 이유**
현재 throttle 함수 내부의 `this`를 참조한 상태로(ticking을 기억한 상태로) callback(이벤트 핸들러의 콜백)을 실행하기 위해

**링크**
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply

---

## JSON.stringify와 LocalStorage의 저장값 - array, object

배열 [1,2,3,4]가 있을 때,

localStorage에 배열을 바로 저장하면 join된 형태 그대로 저장된다. (1,2,3,4) 이때 저장된 값은 JSON string 타입이 아니기 때문에 `JSON.parse`를 호출할 필요없이 즉시 사용 가능하다. (`JSON.parse` 호출 시 에러 발생)

반면 localStorage에 배열을 `JSON.stringify`로 변환하여 저장하면 배열 형태로 저장된다 ([1,2,3,4])

- `JSON.stringify`의 인자에 잘못된 값이 들어왔을 때 예외처리를 하자(default 부여)
- 인자에 순환 참조 (cyclic object value) 값이 들어왔을 경우 TypeError가 발생한다
  - undefined, 함수, 심볼(symbol)은 변환될 때 생략되거나(객체 안에 있을 경우) null 로 변환된다(배열 안에 있을 경우)

**👾`JSON.stringify` & `JSON.parse`를 쓰는 이유**

- 직접 객체를 선언하는 객체 리터럴 방식보다, 객체의 내용을 문자열로 변환 후 `JSON.parse` 메소드를 이용하는 것이 더욱 빠르다.
- JSON 문법이 JavaScript 문법보다 간단하고, 문법 파싱에 리소스가 덜 들기 때문이다.

**링크**

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
- https://wormwlrm.github.io/2019/12/04/Why-JSON-parse-is-faster-than-object-literal.html

---

## 기타

### api key 관리

프론트엔드만 있는 프로젝트에서는 완벽하게 API key를 숨길 수 없다. 별도 서버에 키를 두고, 그 서버에 proxy로 api를 요청하거나 api 키에 다른 보안 정책(referer 등)을 추가하는 방법 밖에 없다.

### `toLocaleString`

```jsx
this._publishedAt.toLocaleDateString("ko-KR", options);
```

지역별로 다른 객체로 재정의된다. (문자열로 반환)

**링크**
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString

### URLSearchParams ([ref](https://github.com/woowacourse/javascript-youtube-classroom/pull/7#discussion_r588850069))

URL의 쿼리들을 조합하는 메소드를 제공한다

```jsx
const searchParams = new URLSearchParams({
  key: youtubeKey,
  type: "video",
  part: "snippet",
  maxResults: VALUE.CLIPS_PER_SCROLL,
  q: keyword,
});

if (pageToken) {
  searchParams.set("pageToken", pageToken);
}
```

**링크**
https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

### `img` 태그 작성 시 `alt` 명기하기

---

# Step2

## Observer pattern

객체의 상태 변화를 관찰하는 관찰자들, 즉 옵저버들의 목록을 객체에 등록하여 상태 변화가 있을 때마다 메서드 등을 통해 객체가 직접 목록의 각 옵저버에게 통지하도록 하는 디자인 패턴이다.

store에 앱에 필요한 데이터들을 저장하고, 이 데이터들의 상태를 구독할 observer들을 등록(register)한다.
observer(또는 controller)에서 앱의 실행에 따라 store의 데이터를 update하고, 해당 데이터를 구독하는 모든 observer에게 데이터의 상태 변화를 notify하여 새로운 데이터를 반영할 수 있도록 한다.

**🤓 생각하는 장점**

- 데이터를 한 곳에 모아 관리할 수 있다
- 데이터를 사용하는 측(controller)에서 실시간으로 데이터의 상태 변화를 감지할 수 있다
- 직접 일을 요청하는 명령형 프로그래밍이 아닌, 데이터 조작(update) → store 상태 업데이트 → 상태변화 알림(notify)의 순서대로 선언적으로 흐름을 구성할 수 있다.

**링크**
https://medium.com/@yeon22/design-pattern-observer-pattern-이란-ef4b74303359

---

## 기타

### 이벤트 위임

- 동적으로 새로 추가될 요소들에 이벤트를 등록할 때, 새로 추가된 요소에 일일이 `addEventListener`를 등록해주는 것보다 이벤트 위임 방식을 사용하는 것이 효율적이다.
- 많은 핸들러를 할당하지 않아도 되기 때문에 초기화가 단순해지고 메모리가 절약된다.
- 요소들의 공통 조상에 이벤트 핸들러를 할당하여 여러 요소를 한꺼번에 다룰 수 있다.
- (컨테이너 수준에 할당된 핸들러가 응답할 필요가 있는 이벤트이든 아니든 상관없이 모든 하위 컨테이너에서 발생하는 이벤트에 응답해야 하므로 CPU 작업 부하가 늘어날 수 있다. 그런데 이런 부하는 무시할 만한 수준이므로 실제로는 잘 고려하지 않는다.)

**링크**
https://ko.javascript.info/event-delegation

### `DOMContentLoaded`

```jsx
window.addEventListener("DOMContentLoaded", App);
```

초기 HTML 문서를 완전히 불러오고 분석했을 때 발생한다. 스타일 시트, 이미지, 하위 프레임의 로딩은 기다리지 않는다.

**링크**
https://developer.mozilla.org/ko/docs/Web/API/Window/DOMContentLoaded_event

---

# Step3

## IntersectionObserver

대상 요소가 화면에 보이는 부분에 따라 동작을 실행한다. 페이지 스크롤을 구현할 때 이미지 또는 iframe에 lazy loading을 등록하여 로딩을 지연시키는 경우에 사용한다.

```jsx
export default function lazyLoading() {
  const options = {
    threshold: 1.0, // 요소가 보이는 부분의 경계를 10%로 설정
    document.querySelector('#modal-videos') // 뷰포트의 기준이 되는 root 요소
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { // 등록한 요소가 교차했을 때
        entry.target.src = entry.target.dataset.src; // 원하는 동작 실행
        observer.unobserve(entry.target); // observer를 해지한다
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  const modalClips = document.querySelectorAll('#modal-videos iframe');

  modalClips.forEach((clip) => {
    observer.observe(clip); // 관찰할 요소들
  });
}
```

**링크**

- https://developer.mozilla.org/ko/docs/Web/API/IntersectionObserver/IntersectionObserver
- http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/

---

## CSS grid

- 가로-세로 2차원 레이아웃 시스템
- grid container, grid item으로 구분
- grid의 형태와 정렬 등을 정의할 수 있다

**링크**
https://studiomeal.com/archives/533

---

## 기타

### `loading="lazy"`

페이지를 읽어들이는 시점에 중요하지 않은 리소스 로딩을 추후에 하는 기술이다. `<img>`, `<iframe>`에 사용한다.

```jsx
<img src="image.jpg" alt="..." loading="lazy">
<iframe src="video-player.html" title="..." loading="lazy"></iframe>
```

초기 로딩 시 필요한 이미지 또는 iframe의 수를 줄일 수 있기 때문에 성능 향상에 도움이 된다.

**링크**

- https://scarlett-dev.gitbook.io/all/it/lazy-loading
- https://techcourse.woowahan.com/s/r1RL8HTw/ls/zgzWB3Aw
