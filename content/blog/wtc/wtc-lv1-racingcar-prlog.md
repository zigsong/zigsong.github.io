---
title: 우테코 Lv1 RacingCar PR로그
date: 2021-02-15 10:22:04
tags: ["woowacourse"]
thumbnailImage: https://i.imgur.com/utRJD0g.png
---

우테코 Lv1 RacingCar PR로그

<!-- more -->

---

# 1️⃣단계

## docs

- 사용자와 프로그램이 할 일을 구분해 놓는 방식도 좋은 것 같다.

1. 자동차 이름 등록

- **사용자** : 자동차의 이름을 등록한다.
- **프로그램** : 쉼표로 구분된 자동차 이름을 저장하고 화면에 보여준다.

2. 이동 횟수 입력 및 경주 시작

- **사용자** : 이동 횟수를 입력한다.
- **프로그램** : 이동 횟수 한도 내에서 랜덤으로 각 자동차를 이동시킨다.

---

## cypress

- 테스트가 커지면 파일을 기능별로 분리하는 것도 좋아보인다.

  - 상수 파일, utils 등으로 나눌 수 있다.
  - 입력(비즈니스) 테스트, 레이아웃 테스트, validation을 분리하는 방법도 있다.

- ‘게임진행 화면에 표시된 자동차 이름과 입력된 자동차 이름이 일치한다.’와 같은, 신경 쓴 테스트 코드는 잘 작성한 것 같다.

- cypress에서 DOM 선택하기

  ```jsx
  cy.document().then((doc) => {
    const $carContainers = doc.querySelectorAll(".car-container");
  });
  ```

- `CypressWrapper`를 사용한 크루도 있었다. 차근차근 알아보고 사용해보자 🙄

- input disabled를 테스트할 수 있다. `dataset`을 넣은 것도 좋아보인다.

  ```jsx
  cy.get("[data-test=car-name-input]").should("be.disabled");
  ```

- `cy.wrap()`

  - cy.wrap()은 그것이 불린 컨텍스트에서의 객체를 반환한다.
  - Promise(`setTimeout()` 등)를 test할 때도 사용된다.
  - https://docs.cypress.io/api/commands/wrap.html#Syntax

- alert를 테스트하는 다른 방법

  ```jsx
  beforeEach(() => {
    cy.window().then((win) => cy.stub(win, "alert").as("windowAlert"));
  }

  it('...', () => {
    cy.get("@windowAlert")
      .should("have.callCount", callCount)
      .its("lastCall")
      .should("be.calledWith", errorMessage);
  })
  ```

- 객체를 비교하기 위해 `deep.equal()`을 사용할 수 있다.

---

## javascript

- 각 class(컴포넌트)에 `target`과 `props`를 전달하는 방법. 복잡해 보이지만 나중에 구조가 확장되면 고려해볼 방식이다.

  ```jsx
  export default class Component {
    $target;
    props;

    constructor($target, props) {
      this.$target = $target;
      this.props = props;
      this.initEvent();
    }

    initEvent() {}

    render() {
      this.mountTemplate();
      this.mountChildComponents();
    }

    mountTemplate() {}
    mountChildComponents() {}
  }
  ```

- DOM의 display를 none으로 하는 것보다, classList에서 추가/제거하는 방법이 좋은 것 같다.

- 사용하면 안 되는 버튼에 `disabled` 를 먹이자

- `insertAdjacentHTML` 을 생각보다 모두 많이 쓰고 있었다! 나만 몰랐다 😐

- class에 `init()`을 만들어서, 이후에 class instance 생성 후 `car.init()`하는 방식도 있다.

- `START_THRESHOLD_NUMBER: 4,`에서와 같은, threshold라는 단어를 이용한 변수명이 좋아 보인다.

- App이라는 최상위 컴포넌트에서 MVC를 깔끔하게 참조하는 방법 (좋은 방법인지는 검증되지 않았지만)

  ```jsx
  class RacingCarApp {
    constructor() {
    this.model = new CarRacingModel();
    this.view = new CarRacingView();
    this.controller = new CarRacingController(this.model, this.view);
  }

  ...

  // Controller 파일
  export default class CarRacingController {
    constructor(model, view) {
      this.model = model;
      this.view = view;

      this.setEventListener();
    }
    ...
  }
  ```

- `querySelectorAll`은 같은 class의 여러 DOM 뿐 아니라, 파라미터에 여러 선택자를 넣어 한 번에 여러 DOM을 선택할 수 있다. (class 이름 하나만 받는 거였으면 `getElementsByClassName`이 있는데 왜 그 생각을 못했을까 😬)

  ```jsx
  const matches = document.querySelectorAll("div.note, div.alert");
  ```

- 객체로 구성된 array에서 max 속성값을 구하는 방법

  ```jsx
  getMaxDistance() {
    return this.cars.reduce((maxDistance, { position }) => {
      return Math.max(maxDistance, position);
    }, 0);
  }
  ```

- `throw Error`

  ```jsx
  if (!isValid) {
    throw new Error(ALERT_VALID_LENGTH);
  }
  ```

  그냥 콘솔에 (빨간) 에러로 찍힌다.

- selector로 접근하는 메소드를 분리한 것도 좋아 보인다

  ```jsx
  export const $ = (selector) => {
    return document.querySelector(selector);
  };

  export const $$ = (selector) => {
    return document.querySelectorAll(selector);
  };

  // 실사용
  const $input = $(".car-name-input");
  const $carElements = $$(".car-wrapper");
  ```

- `DOMParser`로 파싱하기

  ```jsx
  export const parseHTML = (html) => {
    const parser = new DOMParser();

    return parser.parseFromString(html, "text/html").body.firstElementChild;
  };

  // syntax
  let doc = domparser.parseFromString(string, mimeType);

  // 실사용
  return parseHTML(`<div class="forward-icon mt-2">⬇️️</div>`);
  ```

- 배열의 `map`은 동일한 length의 새 배열을 반환하는데 사용된다. 어떤 동작을 반복하여 실행만 하고 싶을 경우는 `forEach`를 사용한다.

- `addEventListener`들을 묶는 함수의 이름으로 `bindEvents`가 좋아보인다.

- class의 `init()`과 `constructor()`의 역할을 각각 생각해보자.

- `isXXX()` 메서드는 bool 값만을 리턴하게끔 하자.

- node의 innerText를 가져오는 신선한 방법

  ```jsx
  const [{ innerText: winnerCandidate }] = $carName;

  console.log(winnerCandidate);
  ```

- constructor 내부에서 객체를 직접 생성하여 할당하는 것과 외부에서 생성하여 객체를 생성하여 constructor 에 주입하여 내부에 할당하는것은 그 결과는 똑같지만 일반적으로 후자가 더 유연한 코드를 작성 할 수 있다. constructor 내부에서 직접 `new` 키워드를 통해 객체를 생성하게 되면 만약 추후에 해당 객체를 생성하는 방법이 바뀌었을 때 현재 객체도 바꿔줘야 하기 때문이다.

- MVC가 서로 참조하는 일이 없도록 주의하자 (circular reference 이슈)

---

# 2️⃣단계

## cypress

- alert를 확인하는 또 다른 방식

  ```jsx
  export const checkAlert = (alertMessage) =>
    cy.on("window:alert", (message) =>
      expect(message).to.contains(alertMessage)
    );
  ```

- 객체의 비교

  ```jsx
  expect(winners).to.deep.equal(matched);
  ```

---

## javascript

- 100번 랜덤 실행하기 (HoF)

  ```jsx
  const randomNumbers = [...Array(100)]
    .map(() => getRandomNumber(GAME.MIN_SCORE, GAME.MAX_SCORE))
    .filter((num) => GAME.MIN_SCORE <= num && num <= GAME.MAX_SCORE);
  ```

- HoF - 함수를 리턴하는 함수, 여기서는 javascript의 내장 메소드를 체이닝해서 사용한 것을 가리킨다.

- 함수의 bad case 정의하여 early return하기

- `dataset` 이용하기

- `setAttribute` 파일을 따로 빼는 방법

  ```jsx
  export const hideElement = (element) => {
    return element.setAttribute("hidden", true);
  };
  ```

- winners를 구하는 간결한 방법

  ```jsx
  getWinners() {
    const maxPosition = Math.max(...this.cars.map((car) => car.position));

    return this.cars
      .filter((car) => car.position === maxPosition)
      .map((car) => car.name);
  }
  ```

- `Promise`를 활용한 `delay` 메서드 만들기
  (특정한 값을 리턴하는 것이 아니라, 그냥 주어진 시간만큼 기다리게 됨)

  ```jsx
  export const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms * 1000));
  ```

- `setTimeout` 대신 `Promise`를 쓰는 이유
  `setTimeout`은 명시한 시간이 지난 후에 곧바로 실행되는 것이 아닌, 호출 스택이 모두 비워진 후에 사용되기 때문에 예기치 못한 순간에 실행될 수도 있다.
  `Promise`를 리턴하여 일정 시간을 기다린 후 원하는 동작을 실행하는 것이 좋다.
  😮 일부러 호출 스택을 비운 후 실행하기 위해 `setTimeout`을 사용할 수도 있다.

- `classList.toggle()` 활용하기

- `element.toggleAttribute()`

- 추상 클래스처럼 작성하는 방법

  ```jsx
  export default class Component {
    $target;
    props;

    constructor($target, props) {
      this.$target = $target;
      this.props = props;
      this.initStates();
      this.render();
      this.initEvent();
    }

    render() {
      this.mountTemplate();
      this.mountChildComponents();
    }

    initStates() {}

    initEvent() {}

    mountTemplate() {}

    mountChildComponents() {}
  }
  ```

- State를 모듈화하여 Component에서 활용하기

  ```jsx
  export default class State {
    #value;

    constructor(initialValue) {
      this.#value = initialValue;
    }

    get = () => {
      return this.#value;
    };

    set = (newValue) => {
      this.#value = newValue;
    };
  }

  // 사용
  class App extends Component {
    initStates() {
      this.cars = new State([]);
      this.raceTimes = new State(0);
      this.winners = "";
    }
  }
  ```

- Array 내장 메소드 안에서 객체의 property를 사용하여 메서드 체이닝하기

  ```jsx
  return this.cars
    .get()
    .filter(({ position }) => position === maxPosition)
    .map(({ name }) => name);
  ```

- RacingGame 모델을 만들어서, controller의 멤버변수로 init 시켜주는 방법

  ```jsx
  export default class RacingGame {
    constructor() {
      this.cars = [];
      this.isEnd = false;
    }

    setCars(names) {
      this.cars = names.map(name => new RacingCar(name));
    }

    runRace(count) {
      ...
    }
    ...
  }

  // RacingController.js
  class RacingController {
    initGame() {
      this.game = new RacingGame();
    }
  }
  ```

- 전역변수의 문제? 🤔 - 모듈 시스템에서 각 모듈은 독립적인 스코프를 갖고 있기 때문에, 모듈 내 전역변수가 많아진다고 해도 나중에 관리가 복잡해지는 문제는 발생하지 않는다.

- object pool

  - 객체를 필요로 할때 풀에 요청을 하고, 반환하는 일련의 작업을 수행하는 패턴이다.
  - 메모리 관리를 플랫폼이 담당하므로 가비지 컬렉션의 발생 타이밍을 직접 컨트롤할 수 없는 언어는 예상치 못한 퍼포먼스 저하가 발생 할 수 있다.
  - 이런 상황을 방지하기 위해 생성 가능한 인스턴스 갯수만큼의 메모리를 미리 할당해 풀에 넣어두고 필요할 때 꺼내고 사용이 끝나면 풀에 다시 반납해 나중에 재사용 할 수 있게 해주는 방식을 object pool이라고 한다.
  - `new` 생성자의 남용(?)에 관한 고민에서 시작된 문제였는데, 아직까지는 조금 어려운 개념인 듯하다. 😬

- `element.outerText`도 있지만, `innerText` 또는 `textContent`가 더 빠르다.

- 명령형(imperative) vs 선언형 프로그래밍(declarative)

  - 명령형 프로그래밍 - 컴퓨터가 수행할 명령들을 순서대로 정의한다. 전체 flow를 파악하기 어렵다.
    ex) 1. 게임이 끝났다. 2. 화면을 로딩으로 바꾼다. 3. 결과를 계산한다. 4. 화면에 결과를 보여준다.
  - 선언형 프로그래밍 - 프로그램의 상태를 바꾸는 명령을 통해 프로그램이 의도대로 흘러가게끔 만든다. 직접적으로 명령하지 않는다.
    ex) 1. 게임이 끝났다. 2. 결과를 계산한다. 이때 로딩 상태를 true로 바꾼다. 3. 계산이 끝나면 로딩 상태를 false로 바꾼다.
  - React는 선언형 프로그래밍 방식을 채택하고 있다.
  - 되도록 선언형 프로그래밍으로 작성해보자. 이때 flag 변수를 사용하는 것도 좋은 방법이다.

- javascript의 class는 결국 `prototype`을 이용한 syntactic sugar🍯로, 다른 언어에도 있는 class를 javascript 내부적으로 구현한 것이다.
  클래스와 함수 중 어떤 것이 옳다고 할 수는 없다. 클래스로 작성한 코드는 대부분 객체와 함수만으로도 똑같이 구현 가능하다.

- 추상화하고, 함수를 분리하고, 중복을 제거하는 작업은 항상 미래의 유지보수성에 도움이 되지만, 가독성을 해칠 수도 있다. 중복이 생긴다고 섣부르게, 또는 과도하게 추상화를 하면
  이후 요구사항이 수정되었을 때 더 보기 힘든 코드가 될 수도 있다는 점을 염두에 두자.

- dom selector 함수 내부에 유용한 메소들을 정의하고, 각각에서 `return this`를 활용하여 외부에서 사용 시 메서드 체이닝을 할 수 있다. 나아가 prototype이나 class의 factory pattern도 공부해보면 좋다.

- `HTMLCollection` 선택하여 한 번에 변수명 부여하기

  ```jsx
  const [carNamesBtn, tryNumBtn, resetBtn] =
    document.getElementsByTagName("button");
  ```

- 영문&숫자 검증하기

  ```jsx
  const isAlphanumeric = (input) => /^[a-zA-Z0-9]+$/.test(input);
  ```

- EOL - 개행을 넣어야 하는 이유는 POSIX 명세에서 정의되어 있기 때문이다. 많은 시스템들이 이 표준에 따라 구현되어 있고, 규칙이 지켜지지 않을 경우 오류가 발생할 수 있다.

**Ref**

- https://dev-momo.tistory.com/entry/HigherOrder-Function-이란-무엇인가
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise
- https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7e2f171e-ff0c-4f26-955d-8d5f8ea2a4f9/Untitled.png
- https://codeburst.io/declarative-vs-imperative-programming-a8a7c93d9ad2
- https://blog.coderifleman.com/2015/04/04/text-files-end-with-a-newline/
- https://velog.io/@godori/factory-method-pattern
- https://www.digitalocean.com/community/tutorials/js-factory-pattern
