---
title: 크롬 익스텐션 수정기
date: 2023-04-27 20:42:15
tags: https://imgur.com/a/Apcuti8
---

결자해지

<!-- more -->

---

## 🥊 Intro

약 두 달 전 얼렁뚱땅 유튜브 타임라인 댓글 크롬 익스텐션을 만들어놓고, [오만가지 삽질 후기 글](https://zigsong.github.io/2023/02/20/chrome-extension/)을 남겼었다. 온갖 버그가 더 많았지만 흐린눈하고 그대로 호주로 튀었다지...

결자해지(結者解之) ~~그냥 한자 한번 써보고 싶었다.~~ 저질러 놓은 사람이 해결해야 하는 법. 내가 코드로 싼 똥을 다시 열심히 치워야 하는 법... 시간이 더 늘어지면 답도 없다. 더 바빠지기 전에 정신차리고 해야 한다.

---

## 🐞 알고 있던 버그

는 유튜브 영상 A - 유튜브 목록 - 유튜브 영상 B를 왔다갔다 하는 새에 영상 아래로 끌어올려진 hook 댓글이 사라지지도 않을 뿐더러, 한번 url을 그렇게 이동하고 나면 아무 동작이 먹히지 않는다는 것이었다.

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzFjMTZhMTVlMjg0NWFkMjUzMWU3ZGQwOTE2NjE3NmYyY2YxYjRmMiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/2R11v9I2RxwVQjoHRJ/giphy-downsized-large.gif" width="100%" />

크롬 익스텐션에서, url이 바뀔 때 기존의 hook 댓글을 삭제하고 동작들을 처음으로 reset시켜주는 방법이 필요했다.

`background.js` 파일을 만들고 다음과 같이 적어준다.

```jsx
// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { url: changeInfo.url }, (response) =>
      console.log(response)
    );
  }
});
```

이벤트를 보내는 곳이 있으면, 받는 곳도 있어야 한다.

```jsx
// main.js
chrome.runtime.onMessage.addListener(function (request) {
  if (request.url.includes("watch")) {
    reset();
  }
});

const reset = () => {
  commentsContainerObserver.disconnect();

  const toastContainer = document.querySelector("div.toast-container");
  if (toastContainer) {
    toastContainer.remove();
  }

  isContainerLoaded = false;

  commentsContainerObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
```

url 변경 이벤트를 바꾸면 `reset()` 함수를 호출한다.
`reset()` 함수에는 이전의 hook 댓글(코드에서 `toastContainer`)을 삭제하고, 새로운 영상의 새로운 댓글 목록을 다시 관찰할 수 있도록 `MutationObserver`를 다시 `observe()`시킨다.

`chrome.tabs`를 사용하므로 `manifest.json`에 권한도 작성해줘야 한다.

```jsx
{
  "manifest_version": 3,
  "name": "Hook Timeline",
  "description": "Hook timeline comment you've clicked",
  "version": "0.1.0",
  // ✅ 추가
  "background": {
    "service_worker": "./scripts/background.js"
  },
  "content_scripts": [
    {
      "matches": ["*://*.youtube.com/*"],
      "js": ["./scripts/main.js"],
      "run_at": "document_start"
    }
  ],
  // ✅ 추가
  "permissions": ["tabs"],
  "icons": {
    "128": "assets/hook-timestamp-128.png"
  }
}
```

잘 된다!

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWViZGZjOWRjOWY4ZjQyZTUwYzVmZTU1YjI5NDVmNWM2YTFhMzM1NCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/0AZbeTEVRSqxqAidbz/giphy.gif" width="100%" />

---

## ✏️ 코드 개선

유튜브 댓글들은 API를 뒤늦게 호출하여 조금 늦게 불러와지기 때문에, `MutationObserver`를 사용하여 댓글 목록이 생기는 시점을 캐치해야 했다. 심지어 1) 댓글들의 컨테이너 역할을 하는 DOM에 1개, 2) 실제 댓글 아이템들을 관찰하는 DOM에 1개 총 2개의 `MutationObserver`를 관찰해야만 했다. 아주 불편...

```tsx
document.addEventListener("DOMContentLoaded", () => {
  commentsContainerObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

const commentsContainerLoaded: MutationCallback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    const target = mutation.target as HTMLElement;

    if ((target as HTMLElement).id === "comments") {
      if (isContainerLoaded) return;

      const commentsContainer = target.querySelector("#contents");
      if (commentsContainer) {
        commentsContentObserver.observe(commentsContainer, {
          childList: true,
          subtree: true,
        });
        isContainerLoaded = true;
      }

      observer.disconnect();
    }
  }
};

const commentsContentLoaded: MutationCallback = (mutationsList) => {
  for (const mutation of mutationsList) {
    const target = mutation.target as HTMLElement;

    if (target.tagName === "YTD-COMMENT-THREAD-RENDERER") {
      const thread = target;
      const content = thread.querySelector("#comment-content") as HTMLElement;

      if (!content) continue;

      const links = content.querySelectorAll("a");
      const timestamps = [...links].filter((a) =>
        a.getAttribute("href")?.startsWith("/watch?v")
      );

      if (timestamps.length > 0) {
        timestamps.forEach((timestamp) => {
          timestamp.addEventListener("click", () =>
            handleClickTimeStamp(
              content,
              thread.querySelector("#main") as HTMLElement
            )
          );
        });
      }
    }
  }
};

const commentsContainerObserver = new MutationObserver(commentsContainerLoaded);
const commentsContentObserver = new MutationObserver(commentsContentLoaded);
```

이게 뭐람... 흑흑

그런데 갑자기 이것저것 만져보다보니, 유튜브 DOM 구조가 바뀌었는지 아니면 뭔가 API 호출 로직이 바뀌었는지...

그냥 `querySelectorAll`이나 `getElementsByClassName`으로도 댓글 목록들을 가리키는 요소들이 잘 불러와지는 게 아니겠어 😲 여기서는 `getElementsByClassName`을 선택했다. static DOM인 NodeList를 반환하는 `querySelectorAll`과는 달리, `getElementsByClassName`이 반환하는 요소는 live DOM이라 동적으로 계속 추가될 수 있다. 즉 여기서는 인피니트 스크롤 동작에 따라 댓글을 추가적으로 불러오는 API가 호출되면, `getElementsByClassName`이 반환하는 결과 리스트에 계속 자동으로 댓글 아이템이 추가되는 것이다.

하지만, 다시 생각해보니 자바스크립트의 이벤트 위임이 낫겠다 😄 싶어 댓글 하나하나 대신 부모에 이벤트를 위임하는 것으로 결정...

```jsx
const commentsContainerLoaded: MutationCallback = (mutationsList) => {
  const comments = document.querySelector("#comments");
  if (comments) {
    const commentsContent = comments.querySelector("#contents");
    if (commentsContent) {
      isContainerLoaded = true;
      commentsContent.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.getAttribute("href")?.startsWith("/watch?v")) {
          handleClickTimeStamp(
            target.parentElement as HTMLElement,
            target.parentElement?.parentElement?.parentElement as HTMLElement
          );
        }
      });

      return;
    }
  }
  // ...
}
```

그런데, 컨테이너의 `MutationObserver` 실행에 따라 `commentsContainerLoaded`이 반복적으로 실행되어서, 위 코드의 `commentsContent`에 붙인 click 이벤트에 대한 핸들러가 여러 번 붙게 되고, 그렇게 되면 실제 결과는...

<img src="01.png" width="100%" />

😱😱😱

왜 똑같은 이벤트리스너가 여러 개 붙는거야!

수소문 끝에, 한 [stackoverflow](https://stackoverflow.com/questions/11430672/javascript-how-to-check-if-event-already-added) 글을 보니 이벤트핸들러가 저렇게 익명함수로 되어있으면 서로 다른 함수로 인식하여 중복으로 붙일 수 있다고 한다... 같은 `click` 이벤트에 대해서는 이벤트핸들러를 한번만 붙일 수 있게 이름을 붙인 콜백함수 형태로 넘겨주자.

```jsx
const commentsContainerLoaded: MutationCallback = (mutationsList) => {
  const comments = document.querySelector("#comments");
  if (comments) {
    const commentsContent = comments.querySelector("#contents");
    if (commentsContent) {
      isContainerLoaded = true;
      commentsContent.addEventListener("click", handleClickComment);

      return;
    }
  }
  // ...
}

const handleClickComment = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.getAttribute("href")?.startsWith("/watch?v")) {
    handleClickTimeStamp(
      target.parentElement as HTMLElement,
      target.parentElement?.parentElement?.parentElement as HTMLElement
    );
  }
};
```

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTkyNzEzMDlmYTMxYTFlZGUzODY2OGFjMjk5ZmE0ODY2YWYxYmE3MSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/ulvzpmZ1LRBasKYa8Y/giphy.gif " width="100%" />

편안 🤗

---

## 🙈 이제 고칠 버그

나는 유튜브 프리미엄을 쓰지 않는다. 그대신 유튜브 광고를 제거해주는 Adblock Suite라는 익스텐션을 사용한다.

그런데! 워낙 이 익스텐션에 익숙해져있다보니, 원래 유튜브에서는 광고가 안나온다고 생각했나보다... 🥲

유튜브 영상 실행 전에 광고가 나와버리면, 이벤트의 부착과 실행 순서가 꼬여버릴 때가 있다.

근데 이건 지금 재현이 안 되네... 다음에 해야지 🙄

---

## 🧞‍♂️ 마무리

100% 완벽하진 않지만 아무튼 올해 안에 익스텐션 하나 만들어보기를 끝냈다! 로고도 설명도 업뎃하고...

오랜만에 내 개발 해서 재밌는 시간이었다 😎

그리고 순수 자바스크립트로 개발하는게 이렇게 힘든 일인지 다시 한번 느낀다 💦
