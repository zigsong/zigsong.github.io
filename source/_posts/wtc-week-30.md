---
title: 우테코 30주차 기록
date: 2021-09-04 20:36:02
tags: woowacourse
---

놀토 UI 개편 | 성능 베이스캠프

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 놀토 프로젝트

### UI 전면 개편 & 반응형 만들기

카드형 UI를 전면 개편하면서 각 페이지의 반응형 대응을 본격적으로 시작하고 있다. 아기자기 귀엽고 특색 있는 UI도 좋지만, 사용자에게 보다 콘텐츠를 깔끔하게, 적절한 개수를 보여줄 수 있는 UI가 필요한 것 같다. 지난번 UT들에서도 ‘한 번에 더 많은 피드를 볼 수 있으면 좋겠다’라는 의견이 많이 나오기도 했고.

카드 UI는 레진코믹스를 많이 참고했다. 이미지를 보다 확실하게 크게 보여주고, 하나의 열에 보여주는 컨텐츠의 개수를 늘렸다. 그리고 shadow를 없애 보다 플랫하게, 깔끔하게 가기로 했다. 카드 좌측 상단의 flag도 레진코믹스를 거의 따라했다(ㅎ)

**<레진코믹스 메인페이지>**
<img src="01.png" />
<img src="02.png" />

**<개편 중인 놀토 페이지>**
<img src="03.png" />

반응형 작업은 디바이스의 break points 별로 딱딱 요소의 크기나 폰트 사이즈를 변경하는 대신, 뷰포트의 크기에 맞춰서 스무스하게 조절될 수 있도록 `rem`이나 `px` 대신 `%` 단위를 사용하고 있다. 모바일에서도 쉽게 사용할 수 있을 정도의 UI가 완성되면 Lv4가 끝나기 전 PWA에도 도전해보고 싶다.

아직까지도 고생 중인 부분은 헤더다. 위에서 언급한 레진코믹스 외에도 에어비앤비, 오늘의집, 네이버웹툰 등의 페이지를 참조하고 있는데, 작디 작은 모바일 화면에서 무엇을 삭제할지, Navigation 메뉴들의 배치는 어떻게 할지 감이 잡히질 않는다. 페어와 오래오래 고민하고 토론한 끝에 우선은 한 차례 의사결정이 된 듯하다. 개발 후 모양이 나와봐야 알겠지만, 완벽하진 않더라도 사용자가 한 눈에 봤을 때 이해할 수 있는 UI를 제작하고 싶다.

### 페이지네이션 api

인피니티 스크롤 구현을 위해 백엔드와 페이지네이션 api를 논의했다. [유튜브의 search api](https://developers.google.com/youtube/v3/guides/implementation/search?hl=ko)를 참고하여, 필수적으로 필요한 `results`와 `pageToken`이 있으면 된다고 생각했다. `results`는 한 번에 가져올 컨텐츠의 개수를, `pageToken`은 다음에 불러올 page의 고유한 식별자를 가리킨다. 여기에 추가적으로 다음 페이지의 존재 여부를 확인하는 `hasNextPage` 정도의 필드가 응답에 있어야 하지 않을까? 생각했다.

그런데 까다롭게 고려해야 할 부분이 있었다.

> 무한 스크롤 도중 최신 피드가 추가된다면?

피드는 최신순으로 가져와야 하기 때문에, 늦게 생성된 id의 피드부터 불러온다. 총 10개의 피드가 있다고 가정해 보자.

1. 0번째 페이지를 불러오며 10/9/8번 피드(최신순)를 가져온다.
2. 다음 스크롤에서 1번째 페이지를 불러오며 7/6/5번 피드를 가져온다.
3. (2번째 페이지를 불러오기 전에) 11번 피드가 추가된다.
4. 0번째 페이지에는 11/10/9번 피드가, 1번째 페이지에는 8/7/6번 피드가, 2번째 페이지에는 5/4/3번 피드가 포함된다. 즉 앞서 불러온 5번 피드는 11번 피드의 추가로 인해 중복으로 불러와지는 문제가 발생한다.

피드의 추가 뿐 아니라 삭제 시에도 문제가 발생한다. 5개의 피드를 가져오는 도중 그 5개에 포함된 피드를 삭제한다면, 5개의 피드를 요청했음에도 4개의 피드만 불러와지는 경우가 발생할 수 있다.

따라서 동적으로 페이지네이션 조건을 적용해야 한다. 놀토 팀에서는 아래와 같이 api를 구성했다.

```
/feeds/recent/nextFeedId=7&countPerPage=5
```

`nextFeedId` 파라미터를 사용하여 현재 시점 기준으로 다음 순서의 피드부터 가져오게끔 했다.

`countPerPage`는 상기한 유튜브 api의 `results`와 같다.

응답은 아래와 같다.

```json
{
  feeds: [
    { id : 7, ...}
    { id : 6, ...},
    { id : 5, ...},
    { id : 4, ...},
    { id : 3, ...},
  ],
  nextFeedId: 8 // 또는 null
}
```

api 요청 시 `countPerPage`값을 통해 한번에 불러올 피드의 개수를 지정하고, 서버에서 피드의 배열과 함께 받은 `nextFeedId`를 다시 전송하여 해당 id보다 작은 id를 가진 피드들을 추가적으로 불러온다. 이때 중간에서 어떤 피드가 삭제되어도 (설령 그게 `nextFeedId`에 해당하는 피드라 할지라도) `nextFeedId`보다 id가 ‘작은’ 피드들만 불러오면 되기 때문에 문제없이 피드를 순서대로 받아올 수 있다.

현재 상태에서 가장 마지막 페이지, 즉 `nextFeedId`가 없을 때에는 null을 반환하여 클라이언트에서 더 이상 요청을 보내지 않도록 한다.

> 👾 새로운 피드가 추가되었을 때 가장 최신 피드를 즉시 불러올 방법은 없지만, 놀토는 피드의 실시간 업데이트가 중요한 SNS와 같은 플랫폼이 아니기 때문에 반영하지 않았다.

**Ref**
https://wbluke.tistory.com/18
https://jojoldu.tistory.com/528

---

## 프론트엔드

### 로딩 성능 개선 강의

공원의 섬세하고 친절한 프론트엔드 로딩 성능 개선 강의가 있었다. 간만에 모르는 개념들이 와르르르 쏟아지다보니 정신이 없었지만 다시 잘 주워 담는 중이다.

**✅ 요청 다이어트**

- Network 탭의 워터폴 차트에서 다운로드 시간을 줄여보자. 놀토의 `bundle.js` 파일 로드 시간도 꽤나 오래 걸리고 있다. (아직 성능 개선 전이므로^^)
- TTFB(Time To First Byte)는 서버의 문제!

**✅ 소스코드 압축**

- minify & uglify는 webpack에서 자동으로 해준다.
- CSS-in-JS도 babel transpile 과정에서 minify된다.
- `brotli`, `gzip` 등의 압축 방식이 있다. 브라우저는 압축된 상태로 받은 리소스를 다시 압축 해제해서 사용한다.

**✅ 이미지 & 폰트**

- 해상도 조절을 위해 image resize를 활용하자.

- `srcset`을 활용해 각 디바이스별로 충분한 크기의 이미지를 사용하자.

- 이미지의 포맷 변경과 압축, 메타 정보(EXIF)를 제거하여 더욱 용량을 줄일 수 있다.

  - 이미지 포맷들 중 png, webp, jpeg, gif의 특징을 잘 알고 비교하여 사용하자.

- progressive jpeg도 좋은 방법!

- 애초에 이미지를 불러오지 않고, svg나 css 등 코드로 해결할 수 있는 부분은 없는지 생각해 보자.

- `subset`을 활용하여 한글 폰트에 대응하자

- `font-display` 속성을 활용

  - 웹폰트 로드 여부에 관계없이 항상 텍스트가 보이게 하려면 `swap`, `fallback`, `optional` (`fallback`, `optional`은 100ms의 매우 짧은 시간 동안만 텍스트가 로딩되지 않는다.) 값을 사용하자.

**✅ 브라우저의 호스트 당 최대 Connection 수 제한**

- Domain Sharding에 대해서 알아보자.
  - Domain sharding은 리소스를 여러 개의 서브 도메인으로 나눠서 다운받는 방법이다. 브라우저는 더 많은 리소스를 한번에 더 많이 받을 수 있으며, page load time을 향상시킬 수 있다.
  - 하지만 각 도메인과의 연결을 생성할 때마다 비용이 발생한다는 문제가 있다. HTTP2는 multiplexing 기능을 지원하기 때문에, Domain sharding을 사용할 필요가 없다.
- HTTP/2는 뭔가 다르다! 뭐가 다를까? [손너잘의 테코톡](https://www.youtube.com/watch?v=ZgSC5K1sUYM)을 통해 확인해보자.
- Server push를 통해 서버에게 맡기는 방법도 있다.
  - 클라이언트가 요청하지 않은 JS, CSS, font, 이미지 파일 등과 같이 필요하게 될 특정 파일들을 서버에서 단일 HTTP 요청 응답 시 함께 전송할 수 있다.

**✅ 요청 수 줄이기**

- tree-shaking
- dynamic import
  - `React.lazy`, `Suspense`
- lazy loading & `IntersectionObserver`
- route별 code splitting
- 이미지는 sprite를 사용하거나 css, svg 코드로 대체하자.

**✅ 미리 가져오기**

- preload

  - 미리 리소스를 받아와서 브라우저에 캐시해 둔다.
  - 브라우저에 명시적으로 우선순위를 지정해준다.
  - `onload` 핸들러가 필요하다.
  - 폰트나 LCP에 영향을 미치는 요소에 적용하면 좋다.

- prefetch

  - 브라우저에게 미래에 필요할 수 있는 전체 페이지, 혹은 특정 리소스(script, css 등)를 미리 다운로드 받아두라고 알려준다.
  - 렌더링이 다 끝난 이후라 블로킹이 되지는 않는다.
  - 페이징된 목록에서 다음 페이지의 컨텐츠 등을 불러올 때 사용할 수 있다.
  - 웹팩에서는 chunk로 다 나누고 불러오는 과정으로 설정

- preconnect

  - 브라우저에게 서버와 연결만 미리 맺어두고 있으라고 알려준다.

- `defer`와 `async`

  - `defer`는 HTML 파싱이 끝날 때까지 스크립트 실행을 지연한다. HTML 파싱이 모두 끝난 후, `DOMContentLoaded` 이전에 실행된다.
  - `async`는 `DOMContentLoaded`나 다른 스크립트들과는 독립적으로 동작한다. 스크립트를 다운 받는 동안에 HTML 파싱을 차단하지는 않지만, 스크립트가 실행되는 동안에는 HTML 파싱이 중단된다.

**✅ 캐시**

- 메모리 캐시 vs 디스크 캐시
  - 메모리 캐시는 RAM에 저장하여 휘발된다. 작지만 속도가 빠르다.
  - 디스크 캐시는 CPU에 저장되므로 영구적으로 보존된다.
- Cache-Control
  - `no-store`: 캐시 불가능. 매번 서버에서 새로 받아와야 한다.
  - `no-cache`: 캐시 가능하긴 하지만 origin 서버에 매번 캐시 유효성 검증 요청을 보낸다.
  - `must-revalidate`: 캐시는 사용하기 이전에 기존 리소스의 상태를 반드시 확인해야 하며 만료된 리소스는 사용되어서는 안된다.
- 조건부 요청
  - `Last-Modified` → `If-Modified-Since`로 확인
  - `ETag` → `If-None-Match`로 확인
- 유효 기간 설정
  - `max-age`
  - `Expires`

**✅ CDN**

- Cache-Control
  - `public`: 중간 프록시(ex. CDN)에도 캐시를 저장할 수 있다.
  - `private`: 최종 끝단의 클라이언트에만 캐시가 가능하다.
- 리소스 업데이트를 반영하기 위해 정적 리소스에 고유한 값(ex. bundle의 chunk hash)을 사용하거나 cache busting, caching purge 등을 알아보자.

---

## 공부하기

### img onError

<img> 태그에 onError 속성이 있었다! img 태그에 사용한 이미지의 링크가 존재하지 않아 엑박이 뜨는 경우 사용한다.

```jsx
return (
  <img
    src={feedDetail.thumbnailUrl}
    onError={(event: SyntheticEvent<HTMLImageElement>) => {
      event.currentTarget.src = DEFAULT_IMG.FEED;
    }}
  />
);
```

CSS의 background-image로 쓰고 싶다면 url을 2개 넣어주면 된다. 두 번째 url에 이미지 에러 시 들어갈 디폴트 url 주소가 들어간다. styled-components 사용 시 아래와 같이 작성한다.

```jsx
const FeedContainer =
  styled(Card) <
  { imageUrl: string } >
  `
  background-image: url(${({ imageUrl }) => imageUrl}), url(${
    DEFAULT_IMG.FEED
  });
  background-size: cover;
  cursor: pointer;
`;
```

### transition maxHeight

요소의 height를 스무스하게 늘렸다 줄였다 할 수 있도록 transition을 줘야 하는데, 그게 요소의 자식 컨텐츠의 양에 따라 height가 변하는 상황이라면?

요소의 height를 `fit-content`로 주면 되겠지만, transition을 사용하기 위해서는 height에 `px`등의 단위로 고정값을 줘야 한다. 즉 `fit-content`를 사용한 요소는 transition이 먹지 않는다!

이때 `max-height` 값을 사용할 수 있다. `max-height`를 넉넉히 계산해서 먹이면, 마치 자식 컨텐츠의 크기에 따라서 부모 요소의 height가 움직이는 것처럼 보인다.

```jsx
const SubCommentWrapper = styled.div<{
  $isFold: boolean;
  isReplyFormVisible: boolean;
  replyCount: number;
>`
  // ...
  transition: max-height ${({ $isFold }) => ($isFold ? '0.35s ease' : '0.85s ease')};

  max-height: ${({ $isFold, isReplyFormVisible, replyCount }) => {
    if ($isFold) return 0;

    let height = 0;

    if (isReplyFormVisible) height += 30;

    return `${replyCount * 50 + height}rem`;
  }};
`;
```

답글의 개수와 각 답글의 줄 수에 따라서 height가 부드럽게 조절되는 것을 볼 수 있다.

<img src="05.gif" />

### Generic function in TypeScript

TypeScript로 함수를 작성할 때 제네릭을 사용하는 방식을 알아보자.

아래와 같은 type alias가 있을 때, 제네릭 타입 T에 string과 같은 특정한 타입을 넣어 함수를 만들 수 있다.

```tsx
type ComparatorType<T> = (a: T, b: T) => number;
const comparator: ComparatorType<string> = (a, b) => a.length - b.length;
```

이번엔 type alias문에서 제네릭 선언부의 위치를 함수 매개변수 바로 앞으로 옮겨보자.

```tsx
type ComparatorFunction = <T>(a: T, b: T) => number;
```

이 상태만으로는 에러가 발생하지 않는다. 하지만 위 타입을 사용해서 똑같이 실제 함수 선언을 작성하면 에러가 발생한다.

```tsx
const comparator: ComparatorFunction<string> = (a, b) => a.length - b.length;
// type 'ComparatorFunction' is not generic
```

왜일까? 🤔

두 번째 type alias에서는 제네릭 함수 타입의 **‘값’** 이 제네릭이기 때문이다. 이는 미래에 선언할 서로 다른 구체적인 함수 타입들의 모든 집합과도 같다. 제네릭 함수 타입에서, 타입 파라미터는 함수 파라미터 앞에 `<>`로 묶어서 작성한다.

제네릭 함수의 타입 자체는 제네릭이 아니다. 따라서 위에서 `Comparator` 자체에는 타입 파라미터가 없으므로, `Comparator<string>`과 같이 사용할 수 없다. **함수를 호출**할 때 비로소 타입을 명시해줘야 한다.

```tsx
declare const comparatorFunc: ComparatorFunction;
const comparator = comparatorFunc<string>("apple", "banana");
```

아래 두 type alias의 차이점을 정리해 보자.

```tsx
type ComparatorType<T> = (a: T, b: T) => number;
type ComparatorFunction = <T>(a: T, b: T) => number;
```

첫 번째 type alias는 **구체적인 함수의 선언을 가리킬 제네릭 타입**이고, 두 번째 type alias는 **제네릭 함수를 가리키는 특정한 타입**이다.

**Ref**
https://stackoverflow.com/questions/58770087/generic-function-type-alias
https://www.typescriptlang.org/docs/handbook/2/generics.html

### useEffect 내부에서 async를 지양하는 이유

미션의 코드 중에 아래와 같은 코드가 있었다. `useEffect` 안에서 바로 `async` 함수를 사용하여 api 호출을 하고, cleanup 함수를 통해 컴포넌트 언마운트 시 loading 상태를 다시 바꿔준다.

```jsx
useEffect(async () => {
  if (loading) {
    const gifs = await fetchTrendingGifs();

    setGifList(gifs);
    setLoading(false);
  }

  return () => setLoading(true);
}, []);
```

그러나 이 코드에서 cleanup 함수 즉 `return`문은 실행되지 않는다!
`async` 함수는 항상 Promise를 리턴하기 때문에 Promise가 fulfilled 상태가 되기 전까지는 값을 반환할 수 없기 때문이다.

따라서 `useEffect` 안에서 `async` 함수를 곧바로 사용하는 것은 지양해야 한다. 위 코드는 아래와 같이 바꿀 수 있다. `async` 함수를 별도로 분리한 후 호출하는 방식이다.

```jsx
const loadTrendingGifs = async () => {
  if (loading) {
    const gifs = await fetchTrendingGifs();

    setGifList(gifs);
    setLoading(false);
  }
};

useEffect(() => {
  loadTrendingGifs();

  return () => setLoading(true);
}, []);
```

**Ref** https://dev.to/danialdezfouli/what-s-wrong-with-the-async-function-in-useeffect-4jne

---

## 기타

### 프론트엔드 성능 최적화 - 자원 다운로드 우선순위 설정

`prefetch`, `preload`, `preconnect` 등의 속성을 지정하여 자원 다운로드의 우선순위를 앞당기거나, 미리 외부 도메인과의 연결을 생성할 수 있다.

이미지나 웹 폰트를 미리, 병렬적으로 다운로드하여 사용자 경험을 개선할 수 있다.

**Ref** https://codingmoondoll.tistory.com/entry/프론트엔드-성능-최적화-6-자원-다운로드-우선순위-설정

### 웹 서비스 캐시 똑똑하게 다루기

`Cache-Control` 헤더를 통해 캐시의 생명 주기를 관리할 수 있다. `Cache-Control`의 구체적인 값으로는 `max-age`, `Expires` 등을 설정한다.

리소스의 유효 기간이 지나기 전이라면, 서버에 요청을 보내지 않고 메모리 캐시에서 자원을 가져오며 이는 네트워크 탭의 ‘from memory cache’ 항목을 통해 확인할 수 있다.

캐시의 유효 기간이 지났다면 서버에 재검증 요청을 보내는데, 이때 `If-None-Match`, `If-Modified-Since` 요청 헤더를 사용한다. 브라우저 캐시가 유효하다면 서버는 HTTP 본문을 포함하지 않는 ‘304 Not Modified’ 응답을 내려준다.

`no-cache` 값은 캐시는 저장하지만 사용할 때마다 서버에 재검증 요청을 보내는 것을, `no-store` 값은 절대로 캐시를 저장하지 않음을 의미한다.

캐시를 없애는 방법으로는 CDN invalidation을 사용할 수 있는데, CDN 캐시를 삭제한다고 해서 브라우저 캐시가 삭제되지는 않는다. CDN과 같은 주간 서버가 특정 리소스를 캐시할 수 있는지 여부는 `Cache-Control` 헤더 값의 `public`과 `private`로 구분한다. 이때 중간 서버에서만 적용되는 `max-age` 값은 `s-maxage` 값으료 표기한다.

**Ref** https://toss.tech/article/smart-web-service-cache

### GIF 사용을 멈춰주세요!

gif는 각 프레임의 모든 픽셀에 대한 정보를 무손실 압축 데이터로 담고 있다. 또한 gif는 GPU에서 디코딩하지 못하기 때문에 CPU 사용량이 증가한다.

비디오 포맷들은 기본적으로 손실 압축을 사용하며, 다양한 최적화 기술들이 들어가 있다. H.264와 같은 비디오 포맷들은 대부분의 플랫폼에서 호환이 잘 된다.

→ gif 대신 mp4 등의 비디오 확장자를 사용하자!

> **WebP/WebM**을 사용할 수도 있지만, 낮은 보급률과 플랫폼 지원, 하드웨어 가속 디코딩에 대한 지원 부족 등의 문제가 있다.

**Ref** https://medium.com/vingle-tech-blog/stop-using-gif-as-animation-3c6d223fd35a

### 실전 UI/UX - 무인양품앱 UI/UX 컨설팅

**Ref** https://brunch.co.kr/@fbrudtjr1/16

### New Suspense SSR Architecture in React 18

**Ref** https://github.com/reactwg/react-18/discussions/37

### 웹 접근성 이해 (부스트코스)

**Ref** https://www.boostcourse.org/web201

### 자바스크립트 함수 파헤치기

**Ref**
https://meetup.toast.com/posts/118
https://meetup.toast.com/posts/123
https://meetup.toast.com/posts/129

### TypeScript, any 쓸거면 버려라

- class와 interface의 찰떡 조합
- 무엇이 TS를 TS답게 하는가
- infer 매직: 중복 정의 없이 파생된 값에 추적성 부여하기

**Ref** https://github.com/NAVER-FEPlatform/FEDevtalk/blob/master/18_fedevtalk.md

### 웹 성능 핵심개념 - Critical Rendering Path

크루 하루의 정리글.

레이아웃을 다시 그리는 비용을 줄이기 위해 레이아웃의 ‘스코프’를 제한할 수 있다. CSS로 레이아웃 바운더리를 만들어 전체 문서를 reflow시키는 대신 특정 스코프만 reflow시킨다.

**Ref** https://365kim.tistory.com/152

---

## 마무리

T사의 신입 채용 때문에 우테코 전반이 시끌시끌하다. 최종까지 간 크루도, 중간에 떨어진 크루들도 모두 이런저런 생각이 들 것 같다. 다같이 싱숭생숭해질 수도 있는 이 시기에, 모두 축하할 크루들은 축하해주고 남은 크루들은 실패했다는 생각보다는 다시 끈끈하게 서로를 붙잡고 목표를 향해 정진해야 할 때인 듯하다.

팀 프로젝트와 개인 공부의 밸런스도 잘 잡아야 할텐데, 둘 다 자꾸 욕심은 생기고 부담감은 가중되는 게 사실이다. 아직도 어른스럽지 못한 순간들이나 지레 긴장하여 당황하는 모습을 보이곤 하는데, 그럴 때마다 이야기 들어주고 차분하게 도와주는 페어 미키에게 많이 고맙다. 곤이, 크리스에게도! 감동크루 사연은 왜 매주 받지 않는 걸까? 아무튼, 내 기분이 주변을 힘들게 하지 않도록 더욱 단단해지자. 여태까지 놀았던 것도 아니고, 앞으로도 후회없이 공부하자!

거의 두 달 만에 번개(?)로 놀토 팀원들을 오프라인에서 만났다. 2명씩 찢어져서 서로 가벼운 인사 정도밖에 하지 못했지만, 모니터 속 가상의 인물들만 보다가 오랜만에 서로 잘 살아있음을 확인하니 기분이 색달랐다. 미키랑 밥도 먹으면서 이런저런 사는 이야기…

마지막은 모두 지쳐도 오늘 하루는 다시 빠이팅해보자는 우리 팀원들의 귀여운 그림 실력

<img src="06.png" width="400px" />
