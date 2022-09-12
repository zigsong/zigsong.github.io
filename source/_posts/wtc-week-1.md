---
title: 우테코 1주차 기록
date: 2021-02-06 10:30:22
tags: woowacourse
---

우테코 1주차 기록

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 우테코 OT

- 정신 없이 어떻게 흘러가는지도 몰랐던 첫 주!
- 백 52명, 프론트 26명이 선발됐다. 경쟁률은… 아무튼 깃헙 블로그도 공개 공간이니 공개하면 안될 것 같다. 엄청 쎘다. 그저 감개무량

---

## 데일리 미팅

- 게더타운 꿀귀다! 조금 버벅이는 게 없잖아 있지만, 짧게짧게 쓸만 한 것 같다.

<img src="01.png" />

월요일 오전 잠시 들어와 본 나밖에 없는 미팅룸...

- 둘째 날 게더타운으로 이동할 때, 코치인 포코가 늦어 일찍 모인 크루들에게 포코의 휴식 공간으로 이동하자고 제안했다. 모두 호응하며 따라와줘 기뻤다 🙃 ㅋㅋㅋ 나중에 들어온 포코 당황잼

---

## cypress

- jest, enzyme 등 기존에 조금씩 사용해보던 테스트 툴들과 비슷하다. 그런데 훨씬 더 편리한 느낌?! 예제도 잘 제공되어 있다.
- mocha, chai 등 여러 라이브러리에서 기능을 가져왔다고 한다. 예제도 많이 제공해 주고, 문서도 잘 되어 있어서 편리하다.
- 빨간 불이 사라지고 하나씩 초록 불이 뜰 때의 쾌감 😯 기능이 원하는 대로 구현되는 것만큼이나 기쁘다.
- 간단한 계산기 미션을 하는 데도 상당한 테스트가 떨궈졌다. 생각지도 못했던 경우들이 나타났다. 여태까지 테스트 없이 진행한 프로젝트들에서의 코드가 얼마나 허술했는지 깨달았다.
- 첫 주부터 TDD를 강조 또 강조했던 것만큼, 앞으로의 개발에서는 정말 테스트를 많이 적용해봐야겠다!

---

## 페어프로그래밍

- 사소하지만 몰랐던 문법, 기능들을 페어를 통해 배울 수 있었다.
- 공동으로 브랜치를 파서 하는 만큼 나 혼자가 아닌 상대방과 함께 하는 책임감을 가지게 된다.
- 학교 수업 등에서 팀플을 하면 친구들끼리 얼레벌레 코드 공유하게 되는데, 협업할 수 있는 live share라는 좋은 툴을 알게 되었다. 재밌고 편리한 툴인 것 같다!
- 혼자 코딩하면 침묵 속에 (가끔 욕 정도 하면서..) 작성하는데, 페어와 말하면서 하다보니 코로나로 인해 사람 만나지 못하는 동안 얼마나 대화 실력이 떨어졌는지 새삼 느겼다. 😓 내가 작성한 코드를 설명하고 함께 토론하는 시간의 중요성도 느끼고, 말하면서 실수하는 부분을 스스로 캐치하거나 페어가 짚어주면서 빠르게 깨닫게 되는 경험이었다.

---

## 보이는 라디오

- 20대 중반이 되어도, 대학을 졸업해도 이런 것을 해야 한다니… 😭 정말 싫지만 또 씩씩하게 해 본다.
- 팀원들이 다들 서글서글 좋은 분이신 것 같다. 내 아이디어도 많이 반영해 주셨다. 😝
- 유튜브에 박제되는 건 아니겠지…

---

## 📚 배우기

### eval is evil

호출 방식에 따라서 동작하는 범위가 달라지고, js 인터프리터를 사용하여 계산이 무거워진다고 한다.
여태까지도 뭔가 옳은 방식의 코드는 아닌 것 같아 쓰지 않았는데, 이번 기회에 간단하게 eval을 사용하면 안 되는 이유를 알고 더욱 주의해야겠다 😮

**Ref** https://velog.io/@modolee/javascript-eval-is-evil/@modolee/javascript-eval-is-evil

### javascript destructing

es6에 새로 등장한 문법이다. 우리말로는 ‘구조 해체 할당’이라고 한다.

destructuring은 array의 값이나 object의 프로퍼티들을 프로그램 안에서 쓸 수 있는 변수로 만들어 준다. destructing은 언제 필요할까? 🤔

```jsx
const developer = {
  name: "Zig Song",
  level: "Junior",
  stacks: {
    html: 9,
    css: 8.5,
    javascript: 7,
  },
};

const displayDetail = (data) => {
  const name = data.name;
  const level = data.level;
  const htmlRating = data.stacks.html;
  const cssRating = data.stacks.css;
  const javascriptRating = data.stacks.javascript;

  console.log(name, level, htmlRating, cssRating, javascriptRating);
};

displayDetail(developer);
```

누가 봐도 `displayDetail` 함수 안에서 `data`가 쓸데없이 많이 중복되고 있는 것을 알 수 있다.

이를 아래처럼 destructing으로 바꿔쓰면 더욱 직관적이다.

```jsx
const {
  name,
  level,
  stacks: { html, css, javascript },
} = developer;
```

array destructing은 아래와 같은 방식으로 작성한다.

```jsx
const profile = ["zig song", "student", "25"];

const displayProfile = (data) => {
  const name = data[0];
  const job = data[1];
  const age = data[2];
  console.log(
    `Hello my name is ${name} and I'm ${age} years old. I'm a ${job}.`
  );
};

displayProfile(profile);
const [name, job, age] = profile;

console.log(name); // zig song
console.log(job); // student
console.log(age); // 25
```

destructing 구문 안에서 변수의 이름을 특정한 이름으로 지정해주거나,
rest operator를 사용하여 사용하지 않는 변수들을 일괄 처리하는 팁들도 있다 😉

**Ref** https://medium.com/better-programming/demystifying-modern-destructuring-in-javascript-918295756b1f

### package-lock

`package-lock`에는 프로젝트의 의존성 모듈들에 대한 버전 정보가 들어있다. 그래서 lock 즉 외부로부터 영향 받지 않기 위해 잠금 처리를 한다.

lock을 통해 여러 개발자가 코드를 올리고 내려 받는 프로젝트에서, 설치 시점에 상관없이 항상 동일한 버전의 패키지가 설치되는 것을 보장받을 수 있다.
`yarn`을 사용한다면 `yarn.lock`이라는 이름으로 생성된다.

**Ref** https://www.daleseo.com/js-package-locks/

### javascript event loop

웹 브라우저에서 javascript를 동작하게 해주는 javascript 엔진(ex. v8)은 memory allocation이 발생하는 heap과 execution contexts가 담긴 stack으로 구분된다.

<img src="02.png" />

javascript는 single call stack을 갖고 있는 single thread language다.

```jsx
function multiply9(a, b) {
  return a + b;
}

function square() {
  return multiply(n, n);
}

function printSquare(n) {
  var squared = square(n);
  console.log(squared);
}

printSquare(4);
```

위 코드에서 stack에는 `main()` → `printSquare()` → `square()` → `multiply()` 순서대로 함수가 stack에 쌓이고 LIFO(Last-In-First-Out) 방식으로 호출된다.

이때 비동기 request가 각각 호출되면, 첫 번째 호출이 완료되는 동안 다른 어떤 동작도 할 수 없다. 이를 blocking이라고 한다. 이 문제를 해결하기 위해 asynchronous callback이 사용된다.

javascript 콜 스택은 한 번에 한 가지 일밖에 할 수 없다. 그래서 `setTimeOut()` 등의 비동기 request가 호출되면 해당 함수는 stack에 쌓이고, callback으로 처리된다. 이때 web API는 해당 비동기 callback이 실행되기까지 기다리고, stack에서 해당 호출은 빠지고 다음으로 실행할 요청들을 담는다. (이때 callback 함수를 task queue에 등록하는 처리는 자바스크립트 엔진이 아니라 브라우저가 실행한다!) web API에서 callback의 호출이 마무리되면 task queue에 해당 task가 담기고, stack이 빌 때까지 기다렸다가 event loop를 통해 stack에 다시 담겨 실행된다.

즉 비동기 실행 함수는 stack → web API → task queue → stack 순으로 이동한다.

**Ref**

- https://www.youtube.com/watch?v=8aGhZQkoFbQ&feature=youtu.be
- https://developer.mozilla.org/ko/docs/Web/JavaScript/EventLoop

## 🤔 생각해보기

**질문 잘 하는 법**
[질문 잘 하는 법](https://www.youtube.com/watch?v=L2p1mdpxD5w)

- 쓸데 없는 질문은 없다. 내가 궁금해 하는 건 분명 다른 사람도 궁금해 한다.
- 올려 놓은 질문 잊지 말기! 답변이 달렸는지 계속 확인하고 토론을 이어가자.

[질문을 잘 하는 개발자](https://jbee.io/essay/good_questionor/)

- 질문을 받는 사람과 Context 맞추기
- 질문을 올리고 반드시 tracking

**페어 프로그래밍**
[짝 프로그래밍이란](https://gmlwjd9405.github.io/2018/07/02/agile-pair-programming.html)

- 단축되는 개발 시간
- 두렵거나 지겹거나 한 일을 페어로! 😬
- 생각하는 과정, 나의 전문성 기르기

**패키지 매니저 관련**
[VS코드에서 패키지 매니저 확인하는 기준](https://code.visualstudio.com/updates/v1_52#_npm)
[젯브레인에서 패키지 매니저 확인하는 기준](https://www.jetbrains.com/help/webstorm/installing-and-removing-external-software-using-node-package-manager.html)
[VS 코드 개발팀이 실제로 패키지 매니저를 자동으로 감지하고자 추가했던 코드](https://github.com/microsoft/vscode/commit/bea76730f10663abc91d840600c679f5b6fe60ac)

**TDD, BDD**
[TDD 묻고 BDD로 가!](https://tv.kakao.com/channel/3693125/cliplink/414004682)

- 코드 작성 전 테스트 코드 먼저!
- BDD: Given(주어진 환경) - When(행위) - Then(기대결과)
- TDD: add(1, 1)이 2인지 확인 vs BDD: 사용자가 “=”를 눌렀을 때, 1+1의 값 2가 화면에 표시되는지 확인
- BDD로 시나리오 검증, 해당 시나리오에서 사용되는 각 모듈들은 TDD test case로 검증

**개발자 커뮤니티**
[슬기로운 개발자 생활 - OKKY](https://www.youtube.com/watch?v=FMjBwL-QozE&feature=youtu.be)

- 빨리 가려면 혼자 가고, 멀리 가려면 같이 가라!

**javascript 코딩 스타일**
[클린 코드 자바스크립트](https://github.com/qkraudghgh/clean-code-javascript-ko)

- `standard`라는 npm 패키지를 사용한다.

[네이밍 치트시트](https://github.com/kettanaito/naming-cheatsheet)

- Actions 부분을 읽어보면 좋을 것 같다.

👻 아래는 읽어보기!
[자바스크립트 스탠다드 스타일](https://standardjs.com/readme-kokr.html)
[Airbnb JavaScript 스타일 가이드](https://github.com/tipjs/javascript-style-guide)
[클린 코드 타입스크립트](https://github.com/738/clean-code-typescript)

**네이버 fe news**
[naver fe-news](https://github.com/naver/fe-news/blob/master/issues/2021-02.md)

**cypress cheat sheet**
[cypress cheat sheet](https://cheatography.com/aiqbal/cheat-sheets/cypress-io/)

---

## etc

- 백엔드에서 한 명 탈주했다. 😢 다른 문제가 있는 건 아니고, 본인이 진정으로 하고 싶은 개발을 찾아 떠나시는 것 같았다. 모두 꿈을 찾아 성공하길!
- 누군가의 말대로, 일주일의 루틴이 생기는 건 아주 피곤하지만 즐거운 일이다. 밤에 잠이 잘 오는 것은 덤 🛌
- 슬랙에 정말 많은 자료가 올라온다. MVC 패턴에 대한 노래라든지, 헝가리 댄스로 알아보는 bubble sort라든지.. 정말 충격적인 것들이 많았음 😑 찐들의 향기를 많이 묻혀가야겠다.

---

## 😎 마무리

- 하루빨리 대면으로 만나서 많은 사람들과 친해지고 싶다. 우울한 삶에 조금이나마 활력이 생겨서 좋다
- 배민 1만원 쿠폰을 받았다! 치킨 시켜먹었다. 개이득
