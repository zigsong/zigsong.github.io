---
title: 크롬 익스텐션 개발기
date: 2023-02-20 08:51:11
tags: https://imgur.com/a/Apcuti8
---

라고 쓰고 삽질기라고 읽는

<!-- more -->

---

## 🤔 뭐가 그렇게 불편해

별 것도 아닌데 오랜 꿈이었던(?)... 크롬 익스텐션을 만들었다. 설날에 시작해서 하루이틀 만에 끝낼 줄 알았는데, 만드는 아이템이 이렇게까지 까다로운 줄 모르고 🫠 설연휴가 끝나고 띄엄띄엄 하다보니 결국 한 달 만에 만들었다. 그래도 호주 가기 전에 만들어서 다행이다^^

처음에는 유튜브 댓글 중에서 한글(한국인) 댓글만 필터링하는 아주 간단한 익스텐션을 만드려고 했다. (일반인들에겐 그렇게 유용하지 않을 수도 있지만, 국내 아이돌 덕질을 하는 덕후들에겐 아주 필요하다...) 그런데 역시 이미 있었고 ㅠ ([한댓](https://chrome.google.com/webstore/detail/한댓-유튜브-한글-댓글만-보기/ljbjgmahddhnccggldafiaemkgacmmld?hl=ko)) 만들어진지 꽤 돼서 무수한 버그 제보에도 방치되고 있는 앱 같았지만 뭔가 더 신선한 걸 만들어보고 싶었다.

'유튜브'라는 카테고리에 봉착되어 유튜브에서 무엇이 불편한고...를 계속 생각하게 되었고, 얼마 지나지 않아 꽤나 날 귀찮게 만들었던 동작을 떠올렸다!

<img src="01.jpeg" />

고것은 바로... 유튜브의 타임라인 댓글.

<img src="02.png" width="360px" />

유튜브 영상에 댓글을 달 때, 내가 맘에 들었던 순간의 재생시간을 따서 붙이면 댓글 본문 앞에 링크 형태로 타임 라인 댓글이 붙는다. 이 링크를 클릭하면 영상의 해당 시간대로 돌아가서 그 부분부터 재생이 된다!

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTg5ZDU3YzMzMmMxY2I1ZTAyN2VkOThlN2NhYjZiMzhkZDJjYTY1MSZjdD1n/1AAhV0IVJLazT8hnF9/giphy.gif" width="100%" />

그런데 덕후들은 이렇게 하나만 눌러보지 않는다. 다른 사람들이 공유한 내새끼의 귀여운 모먼트들을 하나라도 놓칠 수 없다. (뭐... 축구경기나 e-sports 덕후들도 비슷하지 않을까?) 타임라인 댓글을 클릭하면 스크롤은 해당 영상으로 올라가고, 다시 그 타임라인 댓글까지 내려오려면 사용자가 직접 다시 스크롤을 내려야 한다. 한~참 밑에 있는 댓글이었다면, 스크롤을 한 ~참 내려야 하는 것이다.

즉

- 방금 클릭한 타임라인 댓글의 본문이 뭐였는지 까먹을 수 있음
- 다른 타임라인 댓글도 봐야 하는데, 한참 밑에 있던 댓글일 경우 스크롤을 하염없이 내려야 함

요 두 가지 불편함이 있는 것이었다...

주변 사람들에게도 물어보니 불편하다고 했다. 아무튼 내가 불편했다. 나만 잘 써도 성공한 것이다(?)

요걸 어떻게 fancy하게 개선해낼 수 있을까.

별 깊은 고민은 하지 않고 직관적으로 생각해봤다.

1. 타임라인 댓글을 클릭하면 스크롤이 영상으로 올라갈 때, 방금 클릭한 댓글도 복사되어 영상 바로 하단에 보여준다.
2. 1에서 끌어올려진 댓글을 클릭하면, 그 댓글이 원래 있던 곳으로 돌아간다.

꽤나 멋진걸~

이 꽤나 멋지고도 코딩도 간단해보이는 동작을 위해... 2023년 설날에 그렇게 시작해버리고 만 것이다.

---

## 🛹 시작 전에

익스텐션을 어떻게 만드는 지도 몰랐는데, 처음엔 다음 세 포스팅을 참고했다.

- <https://techblog.woowahan.com/2707/>
- <https://wikidocs.net/168240>
- <https://developer.chrome.com/docs/extensions/mv3/>

생각보다 크롬 개발자 문서나 MDN 등 공식 문서들은 친절한 느낌이 아니어서 ㅠ 결국 이것저것 참고하게 되었다.

---

## 🛫 manifest.json

브라우저 상관없이 모든 익스텐션은 manifest.json이라는 파일을 만들어야 한다. manifest는 브라우저에게 익스텐션의 정보(ex. 익스텐션의 주요 파일이나 기능들)을 제공하는 파일이다.

크롬 공식문서에서 가이드로 보여주는 manifest.json은 이렇게 생겼다. 참고로 Manifest v3을 쓰라고 한다.

```json
{
  "manifest_version": 3,
  "name": "Reading Time",
  "description": "Add the reading time to Chrome Extension documentation articles",
  "version": "1.0",
  "icons": {
    "16": "images/icon-16.png",
    "32": "images/icon-32.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  },
  "content_scripts": [
    {
      "js": ["scripts/content.js"],
      "matches": [
        "https://developer.chrome.com/docs/extensions/*",
        "https://developer.chrome.com/docs/webstore/*"
      ]
    }
  ]
}
```

- `manifest_version`, `name`, `version`: 필수 필드로, 익스텐션의 기본 메타데이터를 포함한다.
- `description` - 옵셔널이지만, 권장된다. Add-on 매니저(크롬 익스텐션 대시보드 등)에 표시된다.
- `icons`: 옵셔널이지만, 권장된다. Add-on 매니저에 표시되는 아이콘.
- `contents_scripts`: 웹페이지의 동작할 스크립트다. 브라우저가 방문하는 웹페이지의 DOM 등 세부 정보를 읽거나, 변경하거나, 부모 익스텐션에 정보를 넘겨줄 수 있다. 어떤 스크립트 파일을 실행할지(`js`), 어디서 실행할지(`run_at`), 어느 사이트에서 적용될지(`matches`) 등을 정할 수 있다.

이밖에 사용되는 대표적인 필드들은 다음과 같다.

- `browser_action`: 브라우저 이벤트에 대해 반응할 스크립트를 정의한다. 우측 상단에 표시되는 아이콘과, 그 아이콘을 클릭했을 때 뜰 팝업 창에 대한 정보를 담는다.
- `background`: 백그라운드 스크립트를 정의한다. 개별 페이지의 생애주기와 관련없이 특정 작업을 하고 싶을 때 이곳에서 처리한다. 익스텐션의 service worker를 등록할 수도 있다.
- `permissions`: 플러그인에서 사용될 권한들을 정의한다. tabs, bookmarks, storage, webRequest 등을 사용할 수 있다. 전체 목록은 [여기](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)서 확인 가능.

첫 번째 익스텐션인 만큼, 괜히 이것저것 많은 것들을 사용하기보다 쏘 심플하게 manifest 파일을 작성해주었다.

```json
{
  "manifest_version": 3,
  "name": "Hook Timestamp",
  "description": "Hook timestamp you've clicked",
  "version": "0.0.1",
  "content_scripts": [
    {
      "matches": ["*://*.youtube.com/*"],
      "js": ["./scripts/main.js"],
      "run_at": "document_start"
    }
  ],
  "icons": {
    "128": "assets/hook-timestamp-128.png"
  }
}
```

이제 `contents_scripts`에 들어가는 자바스크립트 파일인 main.js를 작성해보자!

---

## 💬 댓글 목록 선택하기

가장 먼저 해야 할 일은, 유튜브 영상의 댓글을 선택하는 일일 것이다. 그래야 각 댓글의 타임라인 링크에 이벤트 핸들러를 달 수 있으니까...

시작부터 난관이었다.

아래 캡쳐에서처럼 무난하게 `<ytd-comments id="comments">`를 불러오면 된다고 생각했는데,

<img src="03.png" />

`document.querySelector("#comments")`는 계속 null이 뜨는 것이 아니겠어... 😇

근데 그럴 수밖에 없는 게, 유튜브 댓글 목록은 조금 늦게 뜬다. 아무래도 서버에서 불러오는 시간이 있을 테다보니...

✔️ 1차 시도.

```jsx
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#comments");
});
```

얘도 실패. `null`이 뜬다.

> DOMContentLoaded 이벤트는 초기 HTML 문서를 완전히 불러오고 분석했을 때 발생합니다. 스타일 시트, 이미지, 하위 프레임의 로딩은 기다리지 않습니다.

라면서 ㅠㅠ

그런데, 스크립트를 기다린다는 말은 안 했다. 아무래도 유튜브에서도 자바스크립트로 API를 호출하고 그 결과를 기다리겠지...

그렇다고 유튜브 댓글을 불러오는 API를 찾기도, 그걸 기다리기도 애매한 듯 하여 조금 더 DOM스러운 방법을 쓸 수는 없을까 고민하다가... `MutationObserver`라는 것을 발견했다.

[공식 문서](https://developer.mozilla.org/ko/docs/Web/API/MutationObserver) 설명

> MutationObserver 는 개발자들에게 DOM 변경 감시를 제공합니다.

오 왠지 될 것 같아!

✔️ 2차 시도.

`IntersectionObserver`처럼, observer를 하나 만들고 콜백을 등록한 후, `observe()` 메서드로 관찰할 컨테이너 노드를 지정한다.

다음과

```jsx
document.addEventListener("DOMContentLoaded", () => {
  commentsContainerObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

let isContainerLoaded = false;

const commentsContainerLoaded = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.target.id === "comments") {
      if (isContainerLoaded) return;

      const commentsContainer = mutation.target.querySelector("#contents");
      console.log(commentsContainer); // ✅ 찾았다!

      observer.disconnect();
    }
  }
};

const commentsContainerObserver = new MutationObserver(commentsContainerLoaded);
```

`MutationObserver` 생성자에 `commentsContainerLoaded`라는 콜백을 넣어주고, 해당 인스턴스인 `commentsContainerObserver`가 `document.body`를 `observe()`하게 한다. 이제 `document.body` 내부에서 DOM의 변경이 일어날 때마다 `commentsContainerLoaded` 함수가 실행될 것이다. 변경되는 DOM 노드 중에서 내가 필요한 것은 `id`가 `comments`인 노드이므로, `mutation.target.id`를 통해 필요한 노드를 잡아 원하는 처리를 해준다.

이제 `commentsContainer`를 정상적으로 불러올 수 있게 되었다!

(왠지 모르게 `MutationObserver`가 2번씩 실행되어, 구리지만 `isContainerLoaded`라는 전역 변수 플래그를 두어 재실행을 방지해주었다.)

그런데! 댓글 목록의 컨테이너 역할을 하는 `commentsContainer`는 불러왔는데, 실제 댓글 아이템 하나하나는 바로 불러오지 않는다... 괘씸한 녀석들 ㅠㅠ

그래서 어쩔 수 없이 한 번 더 `MutationObserver`로 감싸주었다.

```jsx
const commentsContainerLoaded = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.target.id === "comments") {
      if (isContainerLoaded) return;

      const commentsContainer = mutation.target.querySelector("#contents");
      // ✅ 한 겹 더 감싸서 observe 해주었다.
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

// ✅ 새로 추가된 녀석 1
const commentsContentLoaded = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.target.tagName === "YTD-COMMENT-THREAD-RENDERER") {
      const thread = mutation.target;
      const content = thread.querySelector("#comment-content");

      if (!content) continue;

      // To Be Continued...
      observer.disconnect();
    }
  }
};

const commentsContainerObserver = new MutationObserver(commentsContainerLoaded);
// ✅ 새로 추가된 녀석 2
const commentsContentObserver = new MutationObserver(commentsContentLoaded);
```

`commentsContentLoaded`에서 붙잡은 `const content = thread.querySelector("#comment-content");`로 댓글 각 아이템을 선택할 수 있게 되었다!

<img src="04.png" />

---

## ⏰ 타임라인 댓글에 이벤트 핸들러 붙이기

이제 댓글 각 아이템까지 불러왔으니, 타임라인 링크에 이벤트 핸들러를 붙일 차례다.

여기서 대난관이 시작되는데...

처음에 짰던 시나리오는 이렇다.

1. 타임라인을 클릭한다.
2. 영상의 해당 시간으로 이동하는 기본 동작은 유지한 채, 타임라인이 포함된 댓글을 유튜브 영상 하단에 띄워서 방금 클릭한 댓글이 무엇이었는지 보여준다.
3. 영상 하단에 띄운 댓글을 클릭하면 다시 원래 댓글 위치로 돌아간다.

2번 동작을 수행하려면, 유튜브 댓글 노드를 복제해야 했다. 그리고 Web API에는 [cloneNode()](https://developer.mozilla.org/ko/docs/Web/API/Node/cloneNode)라는 유용한 메서드가 있으니까 이걸 쓰면 되겠지...

그러나 유튜브는 생각보다 호락호락하지 않았다. 위에서 `id="comment-content"`로 셀렉팅한 개별 댓글 요소는 또 내부적으로 자식 요소를 많이 가지고 있는데, 그중 `<!--css-build:shady-->`라고 표시된 부분이 있었다.

<img src="05.png" />

문제는, `id="comment-content"`에 해당하는 요소를 그대로 복사해서 영상 하단에 붙이면 `<!--css-build:shady-->` 하위의 노드들은 복사되지 않는다는 것이었다...

아래 캡쳐는 어떤 댓글의 타임라인을 클릭한 직후인데, 댓글이 복사될 '영역(컨테이너)'는 생성이 되었지만 우측 인스펙터에서도 볼 수 있듯, `id="comment-content"` 하위의 요소가 아무것도 딸려오지 않은 것을 알 수 있다.

<img src="06.png" />

유튜브에서 왜 `<--css-build:shady-->` 이런걸 사용하는진 모르겠지만, 그대로 검색해보니 [Polymer CSS Builder](https://github.com/Polymer/polymer-css-build)라는 것을 쓰는 것 같다... 그리고 이 라이브러리가 궁극적으로 만들고자 하는 것은 아마도, [shadow dom](https://developer.mozilla.org/ko/docs/Web/Web_Components/Using_shadow_DOM)이 아닐까. 특정 UI를 프리셋으로 만들어놓고 두고두고 편리하게 사용할 목적의 웹 컴포넌트를 만든 것 같다. 아무튼 며칠 내내 그 어떤 방법을 써도 `<--css-build:shady-->` 안의 것들을 복사할 수는 없었다.

그래서 그냥 복제하지 않고 갖다 쓰기로. ㅎㅎ;

```jsx
const handleClickTimeStamp = (commentNode, originContainer) => {
  // 3️⃣
  // bottomArea - 영상 하단 영역
  // toastContainer - 영상 하단에 붙일 댓글의 컨테이너
  const bottomArea = document.querySelector("div#below");
  const toastContainer = document.createElement("div");

  // 4️⃣ 인자로 받은 commentNode를 영상 하단 영역에 붙인다.
  toastContainer.appendChild(commentNode);
  bottomArea.insertBefore(toastContainer, bottomArea.firstChild);
};

const commentsContentLoaded = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.target.tagName === "YTD-COMMENT-THREAD-RENDERER") {
      const thread = mutation.target;
      const content = thread.querySelector("#comment-content");

      if (!content) continue;

      const links = content.querySelectorAll("a");
      // 1️⃣ 타임라인 링크(여기서는 timestamp라고 표현)를 찾아서
      const timestamps = [...links].filter((a) =>
        a.getAttribute("href")?.startsWith("/watch?v")
      );

      // 2️⃣ 해당 타임라인 링크를 포함하는 댓글(content)를 이벤트 핸들러(handleClickTimeStamp)의 인자로 넘겨준다.
      if (timestamps.length > 0) {
        timestamps.forEach((timestamp) => {
          timestamp.addEventListener("click", () =>
            handleClickTimeStamp(content)
          );
        });
      }
    }
  }
};
```

요렇게 하면 현재 선택한 댓글이 영상 하단으로 잘 옮겨가긴 하지만, 더 큰 문제가 있었으니... 코드 4️⃣에서처럼 `commentNode`를 새로 만든 `toastContainer`에 `appendChild()`하면, `commentNode`가 기존 부모에게서 떨어져나가게 된다^^

MDN 문서를 보면 이렇다.

> `Node.appendChild()` 메소드는 한 노드를 특정 부모 노드의 자식 노드 리스트 중 마지막 자식으로 붙입니다. 만약 주어진 노드가 이미 문서에 존재하는 노드를 참조하고 있다면 `appendChild()` 메소드는 **노드를 현재 위치에서 새로운 위치로 이동**시킵니다. (문서에 존재하는 노드를 다른 곳으로 붙이기 전에 부모 노드로 부터 지워버릴 필요는 없습니다.)

정말 슬프다... 왜 내 뜻대로 API를 만들어놓지 않았을까? 없애버리지 않는 편이 모두에게 더 유용했을 것 같은데... 😇

---

## 🙈 안 된다면 꼼수를 써보자

이 문제 역시 몇날며칠을 고민하다가... 그냥 꼼수를 쓰기로 했다. 아무튼 방금 선택한 댓글 요소는 문서에 딱 한 개만 있을 수밖에 없는 것. 그렇다면 댓글 타임라인을 클릭했을 때 영상 하단으로 끌어올려버리고, 사용자가 해당 댓글을 다시 클릭하거나 스크롤을 내리면 잽싸게 댓글을 다시 원위치로 복귀시켜놓자.

댓글을 "원위치"로 복귀시켜주기 위해 `handleClickTimeStamp()`에는 원래 댓글이 있던 부모 요소인 `originContainer`도 인자로 넣어주었다.

```jsx
const handleClickTimeStamp = (commentNode, originContainer) => {
  // MARK: copy할 수 있는 방안을 찾기
  const bottomArea = document.querySelector("div#below");
  const toastContainer = document.createElement("div");

  toastContainer.appendChild(commentNode);
  bottomArea.insertBefore(toastContainer, bottomArea.firstChild);

  // 1️⃣ IntersectionObserver를 사용하여 사용자가 스크롤을 내리는 동작을 감지한다.
  observeOriginContainer(commentNode, originContainer, toastContainer);

  // 2️⃣ 방금 영상 하단에 임시로 옮겨놓은 댓글 영역을 클릭하면 댓글이 다시 원래 자리(originContainer)로 돌아간다.
  toastContainer.addEventListener("click", () => {
    originContainer.insertBefore(commentNode, originContainer.lastElementChild);
    originContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    toastContainer.remove();
  });
};

const observeOriginContainer = (
  commentNode,
  originContainer,
  toastContainer
) => {
  const options = {
    threshold: 1.0,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        originContainer.insertBefore(
          commentNode,
          originContainer.lastElementChild
        );
        toastContainer.remove();
        observer.unobserve(originContainer);
      }
    });
  }, options);

  observer.observe(originContainer);
};

const commentsContentLoaded = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.target.tagName === "YTD-COMMENT-THREAD-RENDERER") {
      // ...
      if (timestamps.length > 0) {
        timestamps.forEach((timestamp) => {
          timestamp.addEventListener("click", () =>
            // ✅ #main은 현재 선택한 댓글의 부모 노드이다.
            handleClickTimeStamp(content, thread.querySelector("#main"))
          );
        });
      }
    }
  }
};
```

1️⃣과 2️⃣, 두 가지 동작에 모두 대응할 수 있도록 준비해두었다.

이제 진짜 다 만들었다구...

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDQ2MGY2MWFlZDNkMzdkOTY0NDM5YjM0Mzk0ZjMyOTVjZjg3ZTY2NiZjdD1n/StKu7UYfYrK01Y3jev/giphy.gif" width="100%" />

---

## 🐞 버그를 고칠 시간

만들긴 다 만들었다. 이제 QA 해야지

아직 크롬의 승인을 받지도 않은 상태로 단짝에게 베타 테스트를 맡긴 결과,

<i>🙋🏻‍♂️: "끌어올려진 댓글에서 타임라인 다시 누르면 버그 나는데?"~</i>
<i>🤦‍♀️: ...</i>

노란색으로 표시한 타임라인 링크에도 클릭 이벤트가 붙어있고, 파란 점선으로 표시된 `toastContainer`에도 클릭 이벤트가 붙어있어서 충돌하고 있었다.

<img src="06.png" />

노란 타임라인 링크 영역이 파란 점선 영역보다 작은 자식 요소이고, 이미 끌어올려진 댓글에서 타임라인을 또다시 클릭했을 때에는 타임라인 링크의 클릭 이벤트만 동작하는 것이 바람직하므로 부모 요소(파란 점선)의 클릭 이벤트를 임시 해제하거나 자식 요소까지 이벤트가 전파되는 것을 막아야 했다.

이거 해결한다고 자바스크립트 이벤트의 `preventDefault()`, `stopPropagation()`, `stopImmediatePropagation()`, `addEventListener(..., { once: true })`, `removeEventListener()` 등 가지가지 써봤지만 모두 뜻대로 되지 않았다. 진짜 순수 자스는 사람 미치게 만든다...

모든 걸 다 포기하려던 그 찰나, 불현듯 캡쳐링을 막아야겠단 생각이 들었다.

```jsx
const handleClickTimeStamp = (commentNode, originContainer) => {
  // ...
  toastContainer.addEventListener(
    "click",
    () => {
      originContainer.insertBefore(
        commentNode,
        originContainer.lastElementChild
      );
      originContainer.scrollIntoView({ behavior: "smooth", block: "center" });
      toastContainer.remove();
    },
    // ✅ 여기!!
    { capture: true }
  );
};
```

그래... 이벤트가 '하위' 요소로 전파되는 캡쳐링 단계를 막아야 하니 `stopPropagation()` 등으로 버블링을 막을 게 아니라 캡쳐링을 막아야 하는 거였어 🥲

정말 눈물이 앞을 가린다. 프론트엔드 개발 1년차, 이렇게까지 멍청했을 수가! 사실 종종 그렇다고 생각한다.

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjlhZjkwM2RlM2U3MTg4MDUxYzc2NGM2ODAwYjVkNmM5MmQzZDExMyZjdD1n/XgTaDtRGal4Lr8j9v3/giphy.gif" width="100%" />

## 🎸 그리고 수많은 삽질들 + 마무리

사실 이것 말고도 200배는 더 많은 삽질들이 있었다... 예를 들면 [지난주 위클리 포스팅](https://zigsong.github.io/2023/02/18/2023-2-week-3/)에 썼던

> - querySelector는 live한 DOM을 잡아주지만, querySelectorAll은 static DOM을 잡는다. 여러 개의 live한 DOM을 잡으려면 `getElementsByTagName` 을 사용한다. 왜 이렇게 헷갈리게 뒤죽박죽 해놨어! 🤯 ([Ref](https://stackoverflow.com/questions/51302039/queryselector-return-static-node-list-or-live-node-list))

이런 것들?

지금까지의 전체 코드는 너무 길고 더러워서 부끄러우니까 [깃헙에만](https://github.com/zigsong/youtube-goback-timestamp) 올린다.

이렇게까지 🐶고생을 하면서 만들었는데... 크롬에서 자꾸 뭐 개인정보 처리방침 링크가 잘못되었다며 받아주지 않는다. 2번이나 까였다. 나 호주 가기 전에 배포하고 가는 게 꿈이었는데... 크롬에서 받아주면 포스팅 올려야겠다 🫠 누가 여기까지 읽나 싶지만, 여기까지 읽은 사람 중에 포스팅 전반과 후반의 캡쳐가 라이트 모드 -> 다크 모드로 바뀐 것을 눈치 챈 사람도 드물 것이다. 아침에 좀 쓰고 낮에 일하다가 저녁에 마저 쓰는 내인생 레전드. 말 많은 주인 만나 고생하는 키보드에게 미안하다.

올라가면 나라도 열심히 써야지... 이거 만드느라고 뉴진스 스춤 영상만 몇 백 번을 봤는지 모르겠다. 하지만 하니는 정말 귀여우니까 괜찮아. 결론은 뉴진스 만세
