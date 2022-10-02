---
title: 하프 스터디 9주차 - 브라우저 렌더링
date: 2021-05-30 22:39:37
tags: havruta
thumbnailImage: https://i.imgur.com/ljZQrHo.jpg
---

with 하루

<!-- more -->

---

## Q1. 브라우저의 Reflow, Repaint 과정을 줄일 수 있는 방법은 무엇이 있을까요?

1. 사용하지 않는 노드에는 `visibilty: invisible` 보다 `display: none`을 사용하기
2. Reflow, Repaint 가 발생하는 속성 사용 피하기
3. 영향을 주는 노드 줄이기

- position: `absolute` 또는 `fixed`를 사용하면 reflow 연산 과정에 포함되지 않는다.

4. 프레임 줄이기

**Ref**

- https://boxfoxs.tistory.com/408
- https://csstriggers.com/

---

## Q2. 브라우저 렌더 트리의 구성 요소 중 화면에 표현되지 않는 요소는 무엇이 있을까요?

- `display: none` 속성이 설정된 노드는 화면에 어떠한 공간도 차지하지 않기 때문에 Render Tree를 만드는 과정에서 제외된다.

- `visibility: invisible` 은 `display: none`과 비슷하게 동작하지만, 공간은 차지하고 요소가 보이지 않게만 하기 때문에 Render Tree에 포함된다.

- DOM과 CSSOM을 합쳐서 실제로 화면에 표현되는 것들로만 구성한 것이 Render Tree이다.

  - opacity, visibility 등의 속성은 Render Tree에 포함되어 있어도 보이지 않지만, 화면에 차지되고 있기 때문에 다른 요소들에 영향을 받는다.
  - 렌더 트리의 모든 것은 화면에 표현된다

- DOM, CSSOM에 있는데 render tree에 안 들어가는 것들

  - `script`, `meta` 태그 등
  - `display: none`인 요소들
    ➡️ html 문서에 있어도, 렌더 트리에는 들어가지 않는다!

---

## Q3. 최신 브라우저의 합성(compositing)이란 무엇일까요?

합성은 웹 페이지의 각 부분을 레이어로 분리해 별도로 래스터화하고 컴포지터 스레드(compositor thread)라고 하는 별도의 스레드에서 웹 페이지로 합성하는 기술이다.

합성의 이점은 메인 스레드와 별개로 작동할 수 있다는 점이다. 컴포지터 스레드는 JavaScript 실행이나 스타일 계산을 기다리지 않아도 된다. 이것이 합성만 하는 애니메이션이 성능상 가장 부드럽다고 보는 이유이다.

크롬 개발자도구의 **Layers** 탭에 들어가보면 홈페이지가 어떠한 계층으로 이루어져 있는지 알 수 있다.
<img src="01.png" />

Layout 과정을 거쳐 화면에 UI를 화면에 표현하기 위한 계산이 끝나면 Paint 과정을 거친다. Layout 과정에서 Render Layer가 2개 이상 생성되면 각각의 Layer를 Painting 한 뒤 하나의 이미지로 Composite하는 과정을 추가로 거쳐 브라우저에 표현한다.

페이지의 여러 부분이 잠재적으로 여러 레이어로 그려졌기 때문에 페이지가 정확히 렌더링되려면 정확한 순서로 화면에 그려야 한다. 실수로 한 요소가 다른 요소 위에 잘못 나타날 수 있기 때문에 이는 다른 요소와 겹치는 요소가 있는 경우에 특히 중요하다. (브라우저가 요소 순서 그대로만 화면을 그려내면 `z-index`가 적용되지 않는 문제)

- JS/CSS → 스타일 → 페인트 → 합성

**Ref**

- https://d2.naver.com/helloworld/5237120
- https://cresumerjang.github.io/2019/06/24/critical-rendering-path/

---

## Q4. 브라우저 렌더링 중 레이아웃(layout, reflow) 과정이 모두 일어나는 경우는 어떤 경우가 있을까요? 이 과정은 왜 주의해야 할까요?

레이아웃이 발생하면 전체 픽셀을 다시 계산해야 하므로 부하가 크다.
반면 리페인트는 이미 계산된 픽셀값을 이용해 화면을 그리기 때문에 레이아웃에 비해 부하가 작다.

- 요소에 기하학적인 영향을 주는 CSS 속성값 변경
  - CSS 속성값 : height, width, left, top, font-size, line-height 등
- 요소에 기하적인 영향을 주지 않는 CSS 속성값 변경
  - CSS 속성값 : background-color, color, visibility, text-decoration 등
  - 🤔 `border-bottom`: style, color, width가 합쳐진 것
  - 💙 border를 미리 `1px solid transparent`로 해 놓는 방안 고려!

---

## Q5. 우리가 만든 앱에서 초기 렌더링 속도를 줄이기 위해서는 어떤 점을 고려해볼 수 있을까요?

- https://ui.toast.com/fe-guide/ko_PERFORMANCE
- https://github.com/365kim/web_study/blob/6be90b8a44de24207c7d9354d81098c89dc27554/1_self_study_frontend/tutorial__css.md#3-1-이미지

---

## Q6. 렌더링에 대해 공부하며 다음 용어를 처음 접했는데요. 이런 지표를 관리하는 것도 프론트엔드 엔지니어로서의 역할일까요? 그리고 관리가 정말 필요하다면 어떻게 관리하면 좋을까요?

**TTFB: Time to First Byte (첫 번째 바이트까지의 시간)**

- 링크를 클릭한 후 처음으로 들어오는 콘텐츠 비트 사이의 시간
- HTTP 요청에 걸리는 시간 + 서버의 요청 처리 시간 + 서버에서 클라이언트까지의 응답 시간
- TTFB 속도는 서버의 프로세스와 연관되어 있습니다.
- 최적화 방법
  1. 호스팅 업체 변경
  2. CDN 사용
  3. 서버 코드 경량화

**FP: First Paint**

- 픽셀이 처음으로 사용자에게 표시되는 시점
- 흰 화면에서 화면에 무언가가 처음으로 그려지기 시작하는 순간

**FCP: First Contentful Paint**

- 요청 콘텐츠(기사 본문 등)가 표시되는 시점
- 텍스트나 이미지가 출력되기 시작하는 순간
- 이 시점은 사용자가 이 웹 사이트가 실제로 동작한다고 인식하도록 해주기 때문에 중요. (사용자 이탈률)
- 최적화 방법
  1. 데이터 압축
  2. HTTP/2 사용
  3. 리로드 할 필요 없는 콘텐츠를 캐싱
  4. 코드 경량화와 코드 스플릿팅(splitting)
  5. 라이브러리 정리
  6. 렌더링을 block 하는 리소스 제거
  7. CSS minify
  8. 사용하지 않는 CSS 제거

**FMP: First Meaningful Paint**

- 사용자에게 의미 있는 콘텐츠가 그려지기 시작하는 첫 순간이다. 콘텐츠를 노출하는데 필요한 CSS, 자바스크립트 로드가 시작되고 스타일이 적용되어 주요 콘텐츠를 읽을 수 있다.
- 로딩이 끝날 때까지 흰 화면 대신 의미 있는 먼저 보여주어 사용자에게 긍정적인 인상을 줄 수 있다. 사용자 기준에서 성능을 좋게 하기 위해서 FMP를 앞당겨야 하고, 위에서 설명한 주요 렌더링 경로를 최적화하여 해결할 수 있다.
- 사용자는 이 시점에서 페이지가 완전히 로드가 되었다고 인식
- 최적화 방법
  1. 이미지 최적화
  2. 사진이 많은 웹 페이지일 때는 LazyLoading (예: Twitter, Instagram 등 스크롤을 내리면 추가 페이지 로딩)

**TTI: Time To Interactive**

- 페이지가 상호작용 가능하게 될 때까지의 시간 (이벤트 발생 등).
- 자바스크립트의 초기 실행이 완료되어서 사용자가 직접 행동을 취할 수 있는 순간이다.
- 최적화 방법
  1. FCP와 FMP를 최적화
  2. JS minify

**Ref** https://front-end.me/web/web-site-optimization/
