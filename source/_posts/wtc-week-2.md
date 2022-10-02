---
title: 우테코 2주차 기록
date: 2021-02-13 10:28:17
tags: woowacourse
thumbnailImage: https://i.imgur.com/bHl7fHd.jpg
---

우테코 2주차 기록

<!-- more -->

---

목, 금요일을 설연휴로 보내는 덕분에(?) 이번주 우테코는 3일만!

## 보이는 라디오

- 리허설 때부터 나름 흥했다. 예상치 못하게 ‘반박시 요기요~’가 터져버려서, 많은 호응과 함께 실제 발표 포스터에도 담기게 되었다 😱
- 시간을 아주 많이 쏟고 싶진 않았고, 적당히 잘 한 것 같다. 실제 발표 날에는 더 만반의 준비를 해온 팀들도 있었다. 모두 엄청 재미있게 잘 봤다 😆
- 팀 회고까지 진행하고 드뎌 아이스브레이킹용 팀플이 끝났다! 거리두기가 완화되면 같이 밥이라도 먹고 싶다.

---

## 계산기 미션 공통 피드백

- 주석 잘 달기! [JSDoc](https://jsdoc.app/)이라는 툴을 알게 되었다.
- 👩‍🏫 typescript를 쓰면 주석의 기능을 할 수도 있다.
- 함수의 가장 이상적인파라미터 개수는 0개지만, 일반적인 경우 2개 이하가 좋다고 한다.
- 함수 파라미터에 객체를 통째로 파라미터로 넘기는 방법, `arguments` 사용하기 - javascript의 유연함을 이용한 방식
- ☠️ 함수 매개변수에는 null을 쓰지 마세요
- 테스트 코드에서의 랜덤값 고민해 보기
- README 잘 쓰기! ✅
- `parseInt()`는 몇 진수인지 밝혀줘야 한다.

**Ref**

- https://boycoding.tistory.com/21
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments

---

## 페어 프로그래밍

- 자동차 경주 미션 1단계를 진행했다.
- 페어에게 UI 로직을 따로 분리하는 방법을 배웠다.
- 페어를 통해 내가 헷갈렸던 javascript 함수들을 똑바로 익힐 수 있었고, 생각지 못했던 예외 케이스들을 고려해볼 수 있었다. 나는 우리 작업에서 사소하게 놓쳤던 부분들을 짚어주며 서로에게 도움이 되었던 것 같다. 🙃

---

## 세심한 PR 리뷰

- 배민 내부 개발자이신 리뷰어님께 좋은 피드백을 받았다. 한밤 중에도 설연휴에도 쉬지 않고 열심히 코멘트와 질문에 대한 답변을 달아주신다. 넘 감동 😭
- 아직 2단계 피드백을 기다리고 있다. 신경 쓰다보니 PR 올리기 전 코딩을 하며 클린 코드에 더욱 신경 쓰게 되는 것 같다.

---

## 📚 배우기

### 리팩토링(Refactoring)

- 반복문보다는 파이프를 사용하자

  ```jsx
  const completedTodos = [];
  for (const todo of todos) {
    if (todo.completed) {
      completedTodos.push(todo);
    }
  }

  const completedTodos = todos.filter((todo) => todo.completed);
  ```

- 함수를 리턴하는 함수를 pipe 함수라고 한다. 함수들을 인자로 받아서, 이 함수들을 연속적으로 실행해주는 함수를 리턴하는 것이다.

  ```jsx
  let pipe = () => () => {}; // 함수를 리턴하는 함수

  const p = pipe(
    (a) => a + 1,
    (a) => a * 10
  );

  console.log(p(0));
  ```

- switch 대신 object literal을 사용하자.

  ```jsx
  function wannaEat(food) {
    switch (food) {
      case "pizza":
        console.log("피자 먹고 싶다");
        break;
      case "chicken":
        console.log("치킨 먹고 싶다");
        break;
      case "ramen":
        console.log("라면 먹고 싶다");
        break;
    }
  }

  function wannaEat(food) {
    const foodList = {
      pizza: "피자 먹고 싶다",
      chicken: "치킨 먹고 싶다",
      ramen: "라면 먹고 싶다",
    };
    console.log(foodList[food]);
  }
  ```

  사실 object도 많이 사용했던 방식이긴 한데, 내부에서 간단한 기능을 수행하는 switch~case 문을 이렇게 바꾸는 건 생각하지 못했다.

- 배열이나 객체는 `forEach`보다는 `map`을 이용해 불변 객체처럼 다루기

### Debugging with Browser - 크롬 개발자 도구

**Source 탭**

- Event Listener Breakpoints 활용하기
- snippet → lodash 등을 사용 가능

**Network 탭**

- 페이지 새로고침 → 해당 페이지 로드에 어떤 데이터와 파일들이 로드되는지 확인 가능
- 톱니바퀴 옵션 → Capture Screenshots 체크 후 새로 고침 → 해당 페이지에 접속하고 난 후 화면이 렌더링되는 순서를 보여 줌

**Performance 탭**

- javascript 동작이 느리거나, 성능을 비교하고 싶을 때 사용
  (테스트: https://googlechrome.github.io/devtools-samples/jank/)
- Screenshots, Memory
- cmd + shift + P → show performance monitor - 실시간으로 사용되는 CPU 분석 결과

**Memory 탭**

- 메모리 사용에 대한 자세한 분석
- Allocation Sampling → Start - 메모리 사용에 대한 기록
- Stop → 메모리를 많이 잡아먹는 순서대로 정렬 가능

**Application 탭**

- 쿠키, 스토리지 등 확인

**Security 탭**

- 현재 페이지에서 이용하는 보안 이슈, 증명서 등

**Lighthouse**

- 웹 어플리케이션의 품질 보증
- PWA 관련

**모바일 아이콘**

- 실제 모바일 사이즈에서 확인

### 시간을 다루는 방법

- **호출 스케줄링(scheduling a call)** - 일정 시간이 지난 후에 원하는 함수를 예약 실행(호출)할 수 있게 하는 것
- setTimeout
- setInterval
- **requestAnimationFrame** - 화면에 repaint가 일어날 때 호출

**CSS Layout**

- 재미있음! 🐸 근데 마지막 단계 못 깼다 😬 열받는다.
- `flex-flow`, `align-self`, `align-content` 등을 새로 알아간다.
  https://flexboxfroggy.com/#ko

### 웹 어셈블리(WASM)

뭔가 하다가 코치 포코가 잠깐 언급했다. 와즘! 이라고 하셔서 처음 들어본 김에 기록기록 ✍️

웹 어셈블리는 웹 브라우저에서 실행할 수 있는 새로운 유형의 코드이다. 네이티브에 가까운 성능으로 동작하며, 컴파일 타겟으로 C/C++, Rust 등의 언어로 작성된 프로그램을 웹에서 사용할 수 있게 해준다.

웹에서 사용할 수 있는 효율적인 저수준 바이트 코드로서, 자바스크립트 이외의 언어(예: C, C++, Rust 등)를 사용하여 프로그램을 작성한 다음 런타임 이전에 웹어셈블리로 컴파일할 수 있다. 결과적으로 로드 및 실행이 매우 빠른 웹 앱을 얻을 수 있게 되는 것이다! 😮

웹 어셈블리는 JavaScript와 함께 실행되도록 설계되었다. WebAssembly JavaScript API를 사용하여 WebAssembly 모듈을 JavaScript 앱에 불러와 둘 사이의 기능을 공유할 수 있다.

V8에서 자바스크립트 소스를 로드, 파싱하고 기계 코드로 변환, 트리를 만드는 과정들은 복잡하다. V8은 최적화된 컴파일을 위해 터보팬이라는 기능을 사용한다. 그러나 터보팬은 CPU를 사용함으로써 배터리 소모량을 증가시킨다.

반면 웹 어셈블리는 컴파일 단계에서 최적화를 거치고, 파싱도 필요하지 않다. 모든 최적화가 프론트엔드 컴파일러에서 처리되는 것이다.

\+ WebAssembly에서 알파벳을 따와 WASM이라고 하는 것이었다! 별 다른 뜻이 있는 게 아니었다. 🤷‍♀️
\+ 웹 어셈블리에 대한 자세한 사용법은 나중에 필요하면 공부해 보자 😅

**Ref**

- https://developer.mozilla.org/en-US/docs/WebAssembly
- https://engineering.huiseoul.com/자바스크립트는-어떻게-작동하는가-웹어셈블리와의-비교-언제-웹어셈블리를-사용하는-게-좋은가-cf48a576ca3
- https://d2.naver.com/helloworld/8257914

---

## 🤔 생각해보기

**github 레포 디렉토리 구조 보기**
https://github.com/woowacourse/javascript-calculator
요기에 ‘1s’만 붙여주면 된다고 한다.
https://github1s.com/woowacourse/javascript-calculator

<img src="01.png" />

아니면
https://chrome.google.com/webstore/detail/octotree-github-code-tree/bkhaagjahfmjljalopjnoealnfndnagc?hl=ko
요런 크롬 익스텐션도 있다.

---

## etc

- 갑자기 핫해진 클럽하우스
- 요즘은 javascript 라인의 끝에 세미콜론(;)을 붙이지 않는 세력(?)도 있다고 한다. 넘 어색하고 충격적이다…
- 아직 2주밖에 안 지났는데, (그것도 풀 2주도 아니고!) 아카이브나 우테코 도서관 등 먼저 나서서 총대를 메고 일을 시작하시는 분들이 계신다.
  20대 초반이라면 빠이팅 넘쳐서 했을텐데… 20대 중반이 지나가면서 그런 거 하는 사람 없을 거라고 생각했는데… 다들 넘 열정적이시고 대단하신 것 같다. 존경함 👍

---

## 😎 마무리

3일 뿐이었지만 설연휴까지 포함해서 미션하느라 정신없이 지나간 한 주였다.
라섹한지 2주된 내 눈은… 안녕~
하루하루 할 일이 쌓여서 설레고 기쁘다 ^^

---

## 기타 Ref

https://junhobaik.github.io/functional-go-pipe/
https://sjyoung.tistory.com/42
