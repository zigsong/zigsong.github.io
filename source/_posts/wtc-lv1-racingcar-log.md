---
title: 우테코 Lv1 racingcar 학습로그
date: 2021-02-16 10:20:29
tags: woowacourse
thumbnailImage: https://i.imgur.com/frkONDC.jpg
---

우테코 Lv1 racingcar 학습로그

<!-- more -->

---

[PR-Step1,2](https://github.com/woowacourse/javascript-racingcar/pull/36#issuecomment-821930827)

---

## 함수의 네이밍

- 행동을 먼저 말하고, 뒤에 서사를 풀어쓰는 것이 많은 경우의 코딩 컨벤션이다.
  ex) `typeCarAndClick`보다는 `clickAfterTypeCar`
- `getXXX`의 의미를 명확히 알고 사용하자. class를 객체로 생성하여 사용하는 곳에서 가져올 때, 또는 DOM 객체를 접근할 때 주로 사용한다.
  ex) `Car` 인스턴스 생성 시 `getCars()`보다는 `createCars()`
  ex) `getTryCount` 대신 `mountTryCount`

---

## class의 getter와 setter

### getter로 class 멤버 변수에 접근

class property는 외부에서 바로 접근하지 못하도록 하는 것이 좋다. `getter`를 사용하여 한번 함수로 래핑한 후 가져오자.

```jsx
class Car {
  constructor(name, position) {
    this._name = name;
    this.position = position;
  }

  get name() {
    return this._name;
  }

  get position() {
    return this._position;
  }
}
```

### setter 사용은 지양

```jsx

class Car {
  constructor(name, position) {
    // ...
    this.position = position;
  }

  // bad
  set position() {
    this._position += 1;
  }

  // good
  move() {
    this._position += 1;
  }
}
```

setter를 사용하는 것은, 멤버변수를 private하게 만든 수고를 무효화한다.

---

## setInterval과 requestAnimationFrame

### setInterval

브라우저 API로, 브라우저 내부의 카운트를 진행해 콜백을 진행한다.
`setInterval`의 콜백 함수는 Macrotask queue에 담겨 가장 나중에 실행된다.

👾 **실행 순서**: Microtask queue ➡️ Animation Frames ➡️ (Macro)task queue

```jsx
const moveEverySecond = (interval) => {
  if (this.tryCount === 0) {
    interval && clearInterval(interval);
    this.getWinners();
    return;
  }
  this.tryCount--;
  this.cars.forEach((car) => {
    // ...
  });
};

moveEverySecond();
const moveInterval = setInterval(
  () => moveEverySecond(moveInterval),
  DELAY.TURN_TIME
);
```

### requestAnimationFrame

- animation을 JavaScript로 제어하기 위해 사용한다.
- repaint가 되기 전에 호출된 함수를 실행하고, 그 후에 repaint를 진행한다. (requestAnimationFrame queue)
- 애니메이션을 가장 부드럽게 보이게 하기 위해 사용한다. 디스플레이의 주사율(초당 깜빡이는 횟수)과 가장 비슷한 시점에 호출된다.

### 링크

- [이벤트 루프](https://velog.io/@thms200/Event-Loop-이벤트-루프)
- [JavaScript의 비동기 처리 과정](https://velog.io/@hoo00nn/JavaScript의-비동기-처리-과정)

---

## 기타

### 테스트코드 분리

레이아웃 관점과 비즈니스 로직으로 테스트 코드를 분리하면 보다 직관적인 테스트가 가능하다.

### mounting 시점에서의 이벤트 핸들링

많은 라이브러리 또는 프레임워크는 render 단계에서 DOM 객체를 생성, mount 단계에서 이벤트를 바인딩한다. 따라서 vanillaJS로 개발 시 하나의 component에서 모든 addEventListener들을 한 곳에서 처리해주는 것은 자연스러운 패턴이다.

### DOM 접근 예외처리

`document.querySelector(className)`에서 해당 객체가 존재하지 않을 때를 대비한 예외처리를 하자.

### for loop 대신 Array 내장 객체 사용하기

```jsx
// bad
for (let i = 0; i < DEFAULT_TRY_COUNT; i++) { ... }

// good
Array.from({ length: DEFAULT_TRY_COUNT }, () => { ... })
```
