---
title: 우테코 6주차 기록
date: 2021-03-13 09:53:28
tags: woowacourse
---

우테코 6주차 기록

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 페어 프로그래밍

진득하게 오래했던 3단계 유튜브 미션을 마무리하고 페어 회고를 진행했다.

[심바 to 지그]

- 역시 가장 큰 내용은 무척 재밌었다는 것이었다. 때론 산만하기도 했지만, 페어와 합이 잘 맞았던 것 같다. 하지만 모든 크루들이 그런 것은 아니기 때문에 항상 신경 쓰기!
- 그렇게 시끄럽게 떠들다보면 다시 자기 할 일로 돌아오지 못해서 케어가 필요한 친구들도 있는데, 나는 내 일을 제어도 잘 해서 그럴 걱정은 없다고 말해줬다. 심바는 왠지 나이 차이 많이 나는 사촌오빠같은 느낌이다 😗
- 페어도 나도, 앞뒤가 다른 사람이다. 입게으름뱅이. 말로는 열심히 안 한다고, 게으르다고 하지만 사실 누구보다 부지런하고 열심이다 😂
- 학습 속도도 빠르고, 기억력도 좋다고 했다. 다만 기억력이 관계형은 아닌 것 같다고 🤣 무슨 말인지 알 것 같다.

[지그 to 심바]

- 페어하는 과정 내내 많이 신났어서 텐션을 감추지 못하고 시끄러워져버렸는데 티키타카를 아주 잘 받아주는 고마운 페어였다.
- 다른 크루들과 놀고 싶어서 여기저기 쏘다니는 나를 잘 데려다 앉혀놓고 코딩을 시켜서 어느 정도 제정신을 유지할 수 있었다.
- 솔직히 나라면 대충 하고 넘겼을 기능들을 꼼꼼하게 물고 가져와서 같이 고민해볼 수 있었다. CSS에도 관심이 많아서 같이 배울 수 있었다.
- 실력이 비슷한 것 같고, 설계나 구조 등에 있어서 둘 다 새롭게 배우려는 의지가 커서 함께 처음부터 맨땅에 헤딩하듯 삽질해가면서 작업을 할 수 있었다.
- 드라이버 네비게이터를 따로 분리하지 않고 정말 동시코딩을 하는 진정한 의미의(?) 페어 프로그래밍이었다 🙃

---

## 포수타

- 갈수록 점점 집중 안하는 포수타 😵 프론트/백 등교일자 변경 건의안은 기각되었다 😭

---

## 글쓰기 교육

- 이번주부터 본격 글쓰기 과제가 시작되었다. 첫 글쓰기 주제는 우테코 한달 회고 🤓

---

## 테코톡

요즘 아주 흥미롭게 여겨졌던, javascript의 event loop를 주제로 테코톡을 진행했다.
3가지만 잘 기억하기!

1. 코드가 쌓이는 **call stack**(LIFO)
2. 비동기 함수(DOM, AJAX, timeout 등)의 처리를 기다리는 **web api**
3. **web api**에서 넘어온 비동기적으로 실행된 콜백함수를 보관하는 **callback queue**
4. **call stack**이 비면 **callback queue**의 동작을 **call stack**으로 옮겨주는 **event loop**

👩‍🏫 이 모든 것은 자바스크립트는 call stack이 1개인 single thread 언어이기 때문에 발생한다.

https://velog.io/@thms200/Event-Loop-이벤트-루프

---

## 👨‍🏫 강의

### 유튜브 미션 공통 피드백 - 1

**사용성 고려하기**
모달이 열린 상태에서 dimmed 영역 클릭시 모달이 닫히는 기능이나, 시스템 상으로 에러가 발생했을 때 사용자에게 메시지로 알려주는 등의 기능을 작성할 수 있다.
또 사용자의 행동을 예측하거나 분석하여 상황에 맞게끔 코드를 작성하는 습관을 들이자.

**객체의 불변성 지키기**
객체의 불변성을 지켜주지 않으면, 원치 않게 다른 곳에서 데이터가 변경될 수 있는 side effect의 가능성이 있다. 또 데이터의 변경 사항을 추적하기 어려워진다. 그러면 야근 당첨! 😎 원본 객체에 변경이 가해지는 것을 주의하자!

**input 태그의 사용성**
input 태그에 사용할 수 있는 [속성](https://developer.mozilla.org/ko/docs/Web/HTML/Element/Input)들을 참고하자. 다른 html 태그들도 많은 기본 속성들을 제공한다!

**submit 이벤트 핸들러에서 값 찾기**

- `HTMLFormElement.elements['elementName']`는 많이 사용하는 방법 중 하나
- `target.currentTarget`으로 이벤트를 바인드한 타겟도 불러올 수 있다.
- 계층구조를 넘나드는 것은 위험하다. 부모의 조상의 조상까지 거슬러 올라간다면..😵
- closest를 사용하자. (다만, 일부 브라우저에서는 지원이 안 된다.)

**URLSearchParams 브라우저 API**

- URL을 하나의 객체처럼 다루는 방법

- 아래처럼 사용했다.

  ```jsx
  const searchParams = new URLSearchParams({
    type: "video",
    part: "snippet",
    maxResults: VALUE.CLIPS_PER_SCROLL,
    q: keyword,
  });

  if (pageToken) {
    searchParams.set("pageToken", pageToken);
  }

  const requestURL = SEARCH_URL + searchParams;

  return await httpRequest(requestURL);
  ```

**localStorage 사용 시 고려사항**

- localStorage의 키값들을 상수로 관리하자.
- localStorage에 저장하려는 값을 직렬화(`JSON.stringify`)할 수 없는 경우(undefined, function, Symbol, cyclic object)를 대비해서 가드문을 추가하자.
- JSON을 다룰 때 순환참조(cyclic object) 문제를 잘 기억하자
- localStorage에 값이 없을때 디폴트값을 지정하자.
- localStorage는 동기식으로 작동하기 때문에 키 하나에 너무 큰 객체나 값을 담지 말자.
- localStorage의 용량을 고려해야 한다.
- array보다는 key값을 넣어서 object로 저장한다면 탐색 시간이 줄어들 수 있다.

### 유튜브 미션 공통 피드백 - 2

**srcdoc**
`<iframe>`에 `srcdoc` 속성을 사용해보자. `<iframe>` 태그의 `srcdoc` 속성은 `<iframe>` 요소에 보일 웹 페이지의 HTML 코드를 명시한다. (`src`보다 우선됨)

**http request API와 브라우저 API 호출**

```jsx
fetch(url).then((response) => {
  if (!response.ok) {
    alert("잘못된 요청입니다."); // 브라우저 API
  }
});
```

http request api 안에서 바로 브라우저 api를 호출하지 말자. api는 api의 역할만 해야 하는데, 에러 화면에 대한 처리 등은 못하고 무조건 alert만 하게 되는 문제가 발생한다.
😮 코드의 재사용성을 고민하자!

**초기화와 생성자**

- class 내에 `constructor`가 없고 `init`만 있는 것은 조금 어색할 수도 있다.
- 생성자 내에서 `init` 메소드를 호출하는 등의 방식으로 변경하거나, 별도의 초기화 전용 함수도 고려해보자.

**try-catch**

- `try-catch` 문에는 `finally` 를 쓰자!
- `||` 연산자로 default value를 리턴하는 방식도 좋다.

**함수 파라미터의 기본값**

- 함수의 인자에 기본값을 반드시 줘야하는 컨벤션도 있을 것이고, `try-catch`를 사용해야할 수도 있다.
- 내가 만든 함수를 사용하는 사람이 실수한다면, 그 실수할 여지를 준 사람의 잘못이다.

**`querySelector`의 의미**

- `querySelector`를 사용하면 인자에 `div > .className`과 같은 방식으로 nested된 요소를 선택할 수 있다.
- `getElementsByClassName`으로는 불가하다.

**`data-XXX` 로 관리할 데이터에 대한 고민**

- 사실 DOM에는 `data-` 없어도 아무 이름이나 주입이 가능하다. 즉 `data-video-id="XXX"` 대신 `video-id="XXX"`도 가능하다. 😮
- 앱의 ‘상태’를 DOM에 위임하는 것은, 나중에 상태가 바뀔 때 위험

**디자인 패턴**

- 주화입마라는 말을 처음 들어봤다. 무협지에서 쓰는 말이라고 하는데, 심리적인 원인 등으로 인해 몸속의 기가 뒤틀려 통제할 수 없는 상태를 가리킨다고 한다. 나와 크루들의 현 상황에 적절한 표현인 것 같기도 하다 🤣
- 일단 스스로 사고할 수 있는 힘을 기르자. 정해진 MVC 패턴에 너무 고통 받지 말고 가이드라인 없이 많은 것들을 시도해 보자. 그리고 프로젝트에 맞는 패턴들을 생각해서 활용하자.
- MVC 패턴을 정해놓고 쓰지는 말자는 뜻!

### 자동차 경주게임 셀프 코드 리뷰

부끄럽긴 하지만, 아주 좋은 기회였다. 분명히 한 달 뒤에 보면 또 부끄럽겠지 😂
셀프 리뷰를 마치고 느낀 점은 크게 두 가지.

1. 리뷰어님의 코멘트 하나하나를 그저 수정하기에 급급하기보다는, 어떤 부분을 지적하거나 수정을 요청하셨는지를 조금 더 시간을 가지고 고민하고 직접 찾아보는 시간을 가져야겠다.
2. 다른 크루들의 PR을 많이 보지 않았다면 수정사항을 찾기 어려웠을 것 같은데, 매주 강의를 비롯하여 크루들의 PR에서도 많이 배울 수 있는 만큼 미션 완료 후 다양한 방식으로 다시 코드를 검토하고 시도해봐야겠다.

### loading & Skeleton UI

여태까지 spinner가 좋은 줄 알고 그것만 사용했는데, 다양한 서비스 특히 무한 스크롤이 발생하는 페이스북이나 유튜브 등에서는 생각해 보면 skeleton UI를 이용하여 사용자가 콘텐츠 로드를 기다릴 수 있게끔 만들어 놓았따.
이러한 loading UI를 사용하는 이유는, UX적인 관점에서 사용자는 콘텐츠가 페이지에 로드되는 동안 계속 참여해야 이탈률이 낮아지기 때문이다. 기존의 빙글빙글 돌아가기만 하는 spinner보다는, 실제 로드될 컨텐츠의 모양과 유사한
skeleton UI를 사용하면 사용자들이 컨텐츠가 곧 로드될 것이라고 기대하여 사이트에 머물게 된다. 즉 사용자가 콘텐츠 로드하는 시간동안 목표로 향해 나아가고 있다는 것을 알려준다.

<img src="01.png" />

**Ref**

- https://www.smashingmagazine.com/2020/04/skeleton-screens-react/
- https://blog.logrocket.com/improve-ux-in-react-apps-by-showing-skeleton-ui/

### lazy loading

lazy loading은 가능한 한 길게 미루어 웹페이지에서 보여줄 콘텐츠들이 실제로 화면에 보일 때까지 미룬 후 로딩하는 기술이다.
고화질의 사진이나 유튜브의 iframe과 같은 무거운 컨텐츠들을 로드할 때, 한 번에 모든 것을 로드할 때까지 기다린다면 사용자 경험이 좋지 못할 것이다.
또한 lazy loading은 웹 성능과 디바이스 내 리소스 활용도 증가, 그리고 연관된 비용을 줄이는 데 도움을 줄 수 있다.

lazy loading을 구현하는 방법 중 하나는 이미지 로딩을 사전에 막는 것이다.
일반적으로 이미지는 `src` 속성을 이용하여 이미지를 로드한다. 그런데 이 방식은 HTML 내 모든 `img` 태그가 `src` 속성을 가지기만 한다면, 이미지를 무조건 로드한다는 치명적인 단점이 있다.
그래서 `src` 속성 대신 다른 속성에 이미지 URL을 넣는 방식으로 lazy loading을 이용할 수 있다.
예를 들어 태그에 `data-src`라는 속성에 이미지 URL을 지정한다면, 초기에 html 태그가 웹페이지에 그려질 때는 이미지가 로드되지 않는다.

```jsx
<img data-src="https://ik.imagekit.io/demo/default-image.jpg" />
```

하지만 이렇게만 작성하면 실제 이미지가 로드되지 않기 때문에 해당 이미지를 언제 로딩할 것인지 알려줘야 한다.
이를 위해서 해당 이미지(현재는 placeholder 상태)가 뷰포트에 들어왔는지(사용자가 보는 페이지에 들어왔는지) 확인해야 한다.

자바스크립트의 `scroll`, `resize`, `orientationChange`(디바이스 화면 방향 변경을 감지) 이벤트나 `IntersectionObserver API`를 이용하여
이미지가 로딩될 시점을 설정할 수 있다.

**Native Lazy Loading**
최신 브라우저에는 아래처럼 `img`나 `iframe`에 `loading="lazy"` 속성을 넣어, 뷰포트에 해당 컨텐츠가 보일 때 loading시켜줄 수 있다.

```jsx
<img src="image.jpg" alt="..." loading="lazy">
<iframe src="video-player.html" title="..." loading="lazy"></iframe>
```

**Ref**

- https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API
- https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading
- https://helloinyong.tistory.com/297

### debounce, throttle

`scroll` 이벤트와 같이 약간의 동작에도 `addEventListener`에서 실행되는 콜백 함수가 계속해서 호출되는 문제를 막기 위해 `debounce`와 `throttle`을 사용한다.

**debounce**
이벤트를 그룹화하여 특정 시간이 지난 후 하나의 이벤트만 발생하도록 하는 기술이다. 즉, 순차적 호출을 하나로 ‘그룹화’한다. 그래서 연속적으로 호출되는 함수 중 마지막 함수(또는 제일 처음)만 호출할 수 있다.

**throttle**
`throttle` 이벤트를 일정한 주기마다 발생하도록 하는 기술이다. `throttle`이 걸린 이벤트는 설정한 시간 동안 최대 한 번만 발생하게 된다. 즉 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 해 준다.

미션에서는 아래와 같이 `throttle`을 사용하여 무한 스크롤 이벤트 구현 과정에 지연을 발생시켰다.

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

🤓 `debounce`는 이벤트가 끝날 시점에 한 번, `throttle`은 정해진 시간 주기마다 한 번!

**Ref** https://developer.mozilla.org/en-US/docs/Tools/Network_Monitor/Throttling

### CSS: Grid Layout

`grid`는 부모-자식, 그리고 column-row의 2차원 관계만 신경 쓰면 어렵지 않게 사용할 수 있다!

```css
.wrapper {
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 50px 50px;
}
```

css는 항상 내용이 방대하기 때문에 링크로 대체 🙄

**Ref**

- https://studiomeal.com/archives/533
- https://code.tutsplus.com/ko/tutorials/introduction-to-css-grid-layout-with-examples--cms-25392

---

## 📚 배우기

### DOMContentLoaded

`DOMContentLoaded` 이벤트는 초기 HTML 문서를 완전히 불러오고 분석했을 때 발생한다. 스타일 시트, 이미지, 하위 프레임의 로딩은 기다리지 않는다.

DOM Element가 그려지기 전에 자바스크립트에서 DOM에 접근했을때에 오류가 발생하거나, 자바스크립트를 파싱하고 실행하는 동안 다른 작업들이 블로킹 상태가 되기 때문에
일반적으로 자바스크립트 파일을 body 태그 끝에서 부르는 이유와도 관련이 있다.

```jsx
const App = () => {
  init() {
    ...
  }
}
window.addEventListener('DOMContentLoaded', App);
```

**Ref** https://developer.mozilla.org/ko/docs/Web/API/Window/DOMContentLoaded_event

### vanilla js로 상태관리 구축하기

- 모든 구독(subscribe)을 돌며 해당 페이로드로 콜백을 발생시키는 Pub/Sub 패턴
- 중심 객체인 store 만들기
- store 객체가 모든 변화를 추적하기 위해 위해 Proxy 사용
  - proxy는 객체가 데이터를 요청할 때마다 모니터링
  - get 트랩을 추가하면 객체가 데이터를 요청할 때마다 모니터링
  - set 트랩으로 객체에 대한 변경을 감시
- 기초 컴포넌트와, 이를 상속 받는 각 컴포넌트들을 구현

**Ref** https://devtimothy.tistory.com/86

### cyclic object

`JSON`에서 객체 참조를 할 때 발생한다. (이때 `JSON.stringify`는 실패하므로, localStorage의 값을 관리할 때 주의할 것! 😮)

```jsx
const circularReference = { otherData: 123 };
circularReference.myself = circularReference;
```

**Ref** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value

### 객체 리터럴 프로퍼티

```jsx
const BREAD = {
  CROISSANT: "croissant",
  BAGUETTE: "baguette",
};

const TASTE = {
  // []로 object의 key 접근
  [BREAD.CROISSANT]: "great",
};

console.log(TASTE); // { croissant: 'great' };
```

위와 같이 한 객체의 프로퍼티를 다른 객체의 key로 사용할 때 대괄호([])를 사용해야 하는 이유를 몰라서 헤맸었다. 알고 보니 별 건 아니었음 🙄  
JavaScript 객체의 프로퍼티 키는 동적으로 생성할 수 있는데(=computed property), ES5에서는 프로퍼티 키를 동적으로 생성하려면 객체 리터럴 외부에서 대괄호([]) 표기법을 사용해야 한다.

```javascript
const prefix = "intro";
const langs = [html, css, javascript];

var obj = {};

obj[prefix + "-" + langs[0]] = "HTML";
obj[prefix + "-" + langs[1]] = "CSS";
obj[prefix + "-" + langs[2]] = "JAVASCRIPT";
```

ES6에서는 객체 리터럴 내부에서도 프로퍼티 키를 동적으로 생성할 수 있다.

```jsx
const obj = {
  [prefix + "-" + langs[0]]: "HTML",
  [prefix + "-" + langs[1]]: "CSS",
  [prefix + "-" + langs[2]]: "JAVASCRIPT",
};
```

**Ref** https://poiemaweb.com/es6-enhanced-object-property

**observer pattern**
이번 미션을 수행하면서 적용했던 observer pattern 🤓

1. 앱의 state를 담아두는 Store를 만들고,
2. Store의 값을 받아와야 하는 observer(미션에서는 controller)들은 Store를 구독(register 또는 subscribe)한다.
3. Store의 값이 변하면 Store에 register된 observer들에게 상태변화를 notify하고
4. 상태 변화를 감지한 observer들에서 업데이트된 Store의 값을 가지고 동작을 수행한다.

**Ref** https://medium.com/@yeon22/design-pattern-observer-pattern-이란-ef4b74303359

### event delegation

기존 DOM에 있는 element가 아닌, 동적으로 생성된 새로운 element에도 event를 attach하기 위해서는 그때그때 loop를 돌며 `addEventListener`를 달아주는 방법도 있지만,
element의 상위 DOM에 event를 위임하여 해당 DOM의 내부에 새로 생성될 element들에 event를 붙여줄 수 있다. 이를 event delegation(이벤트 위임)이라고 한다.

그러나 아래 코드에서도 볼 수 있듯, 상위 DOM에서 이벤트가 발생할 때 해당 요소가 우리가 찾는 요소인지를 파악하기 위해 event의 target을 한 번 확인해줘야 하는 문제가 발생한다.
이때문에 event delegation이 기존의 모든 새로운 element에 `addEventListener`를 붙여주는 것보다 성능이 좋지 않다고 생각할 수 있다.

```jsx
document.addEventListener(
  "click",
  function (event) {
    if (!event.target.matches(".sandwich")) return;
    console.log(event.target);
  },
  false
);
```

하지만 event delegation을 사용하는 것이 성능이 더욱 좋다. event listener를 만들 때마다 브라우저의 메모리를 사용하게 된다.

여러 개의 이벤트를 다는 것보다, 하나의 이벤트를 생성해 놓고 이를 추적하는 것이 훨씬 효율적이다.

만약 한 개의 element에만 event를 달고자 한다면 직접 다는 것이 좋다. 그러나 여러 개의 element에 event를 달고자 한다면, event delegation을 사용하는 것이 바람직하다 🤓

**Ref**
https://gomakethings.com/why-is-javascript-event-delegation-better-than-attaching-events-to-each-element/

### encodeURIComponent

`encodeURIComponent()` 함수는 URI의 특정한 문자를 UTF-8로 인코딩해 이스케이프 문자로 나타낸다. `encodeURI`와는 인코딩 대상과 방식에 차이가 있다.

```jsx
const set1 = ";,/?:@&=+$"; // Reserved Characters
const set2 = "ABC abc 123"; // Alphanumeric Characters + Space

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // ABC%20abc%20123 (the space gets encoded as %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // ABC%20abc%20123 (the space gets encoded as %20)
```

**Ref** https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent

## 기타

**만다오, 우아한형제들 웹 프론트엔드 신입 개발자 파일럿 프로젝트 개발기**
https://woowabros.github.io/woowabros/2021/03/08/mandao.html

**API key 서버에서 가져오기**
한 크루가 모두를 위해 만들었다. netlify로 배포할 수 있다. 대단쓰 😮
https://github.com/bigsaigon333/hide-api-key-with-serverless-functions

**CypressWrapper 사용하기**
https://github.com/woowacourse/javascript-racingcar/pull/20#discussion_r574992460

**코드 의존성을 파악해주는 도구**
https://github.com/sverweij/dependency-cruiser

**우아한형제들 개발자 채용**
https://www.youtube.com/watch?v=vcL81FAYgys&feature=youtu.be

**프론트 캡틴이 등장하는 우아한형제들 면접**
https://www.youtube.com/watch?v=JBS3H3PzI58&feature=youtu.be

---

## 🤔 생각해보기

**디자인 패턴은 언제 공부하는 게 좋을까? 🤔**
많은 크루들이 디자인 패턴 때문에 고민하는 것을 보고, 캡틴이 보내준 메시지
결론은, 일단 패턴 신경쓰지 말고 개발을 시작하자!
패턴에는 정해진 답도 없고, 처음부터 하나의 패턴만 고집하는 것은 좋지 않다.
https://okky.kr/article/133477

---

## 😎 마무리

무야-호
이제는 바쁜지도 모르겠다. 학교도 개강해 버렸다 😵 그리고 다른 사이드 프로젝트들은 결국 던져졌다. 코치님께 뭐 질문하려다가 한 시간 면담을 해버렸다. 지금처럼 즐기자! 🤓
