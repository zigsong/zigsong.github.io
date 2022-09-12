---
title: 우테코 Lv1 Lotto PR로그
date: 2021-03-08 09:57:35
tags: woowacourse
---

우테코 Lv1 Lotto PR로그

<!-- more -->

<img src="/images/thumbnails/pr-thumbnail.png" />

---

# 1️⃣단계

- ES6이후로는 함수 Object Constructor 문법은 잘 사용하지 않는다 → function 대신 class로 작성하기

  - ES5 문법(함수)로도 충분히 구현 가능하겠지만 OOP를 쉽게 구현하기 위해 나온 ES6의 class를 사용하자
  - 상속과 캡슐화 등등을 표현하기 좋고 this 관리도 편하다.

- Controller가 Model과 View를 멤버로 가지는 동시에, 역할도 알맞게 위임하기

- 직접 css style을 건드리는 대신, class 이용하기

  - Ref https://ko.javascript.info/styles-and-classes
  - style보다 CSS 클래스를 수정하는 것을 더 우선시해야 한다. style은 클래스를 ‘다룰 수 없을 때’만 사용해야 한다.

- DOM이 load됐을 때 App 실행하기

  ```jsx
  const App = () => {
    init();
  };

  window.addEventListener("DOMContentLoaded", App);
  ```

- 습관적인 (필요 없는) 리턴 주의하기

  ```jsx
  // Bad
  export const hideElement = (element) => {
    return element.classList.add("d-none");
  };
  ```

- App에서 controller, view를 연결하는 새로운 방법

  ```jsx
  export default class App {
    constructor() {
      this.$target = $("#app");
      this.setup();
    }

    execute() {
      this.mountComponent();
    }

    setup() {
      this.gameManager = new GameManager([]);
    }

    mountComponent() {
      this.gameInput = new GameInput({
        gameManager: this.gameManager,
      });

      this.gameDisplay = new gameDisplay({ gameManager: this.gameManager });
    }
  }
  ```

- class에서 dom과 event 메소드들 묶기

  ```jsx
  class GameClass {
    constructor(props) {
      this.props = props;

      this.selectDOM();
      this.bindEvent();
    }
  }
  ```

- 🤔 `id` vs `data-*`?

  - 페이지의 유일한 엘리먼트라면 `id`, 비슷한 성격의 것들이라면 `data-*`
  - class는 스타일을 위한 것이므로 class로 여러 개를 가져와서 조작하는것은 깨지기 쉽다.

- html에 간략한 섹션 설명 달기

  ```html
  <!-- purchase amount input form -->
  <form class="mt-5" id="purchase-amount-form" novalidate></form>
  ```

- `novalidate`

  - `form` 태그의 `novalidate` 속성은 폼 데이터(form data)를 서버로 제출할 때 해당 데이터의 유효성을 검사하지 않음을 명시한다.
  - 타입은 bool

- 쉴드패턴: 값의 유효성 검사 후 값이 유효하지 않다면 함수의 진행을 중단시켜서(즉시 return) 유효하지 않은 데이터로 로직이 도는것을 막는 코딩 패턴

  - 사용자가 입력한 input값을 검증하는것은 단지 유효성을 검사할 뿐이고 만약 그 값이 유효하지 않다고 한들 그것이 예외가 발생한것은 아니다.
  - ‘예외’는 외부 시스템에 연결해서 응답을 받아야 하는데 외부 시스템이 꺼져있다든지, 파일에 데이터를 쓰려고(write) 하는데 파일이 없는 등 더 이상 처리할 수 없는 ‘에러’가 발생한 상태이거나 `throw`로 에러를 낸 상태를 가리킨다. 이 때 이 에러를 잡아서(catch) 시스템이 죽지 않도록 처리 하는 것이 익셉션 핸들러의 역할이다.)

- class private property 사용

  ```jsx
  export class Lotto {
    #numbers;

    constructor(numbers) {
      this.#numbers = numbers;
    }

    get numbers() {
      return [...this.#numbers];
    }
  }
  ```

  - 최신 스팩인 `#`은 물론이고 실무에서 ES6 이상의 스팩을 사용하려면 Babel을 써야 한다. 이는 `#`도 마찬가지.
  - 크로스 브라우징 생각하면 어차피 ES6는 아무것도 못 쓴다. (const, let 조차도)😂

- private vs protected

  - private field는 외부 접근시 Syntax error 를 반환하는 반면, protected field(`_` 컨벤션)는 JS 에서는 기능적인 지원은 없지만 내부 클래스 + 유기적으로 상속된 클래스 간에서는 접근이 가능하게끔 약속된 컨벤션의 성격이 강하다.
  - https://github.com/woowacourse/javascript-lotto/pull/11/files#r579574071

- private 크로스 브라우징 이슈

  - Class private field 문법의 경우, 아직 TC39 제안의 Stage 3(후보)에 올라가 있다. (https://github.com/tc39/proposal-class-fields)
    따라서 아직까지는 ECMAScript의 공식 스펙이 아니며, 크롬이 미리 구현했을 뿐이다.

- 의존성 주입

  - 의존성 주입은 constructor 내부에서 직접 객체를 생성하여 할당하는게 아니라 외부에서 객체 생성을 한 뒤에 controller를 생성할 때 인자로 주입하여 constructor의 파라미터로 받아서 할당만 하는 방식을 가리킨다.
  - https://github.com/woowacourse/javascript-lotto/pull/15#discussion_r579614957

- extra-mile UX - 거스름돈 반환하기

- boolean flag

  ```jsx
  // Boolean 타입이 아닌 truthy, falsy 조건식
  if (change) {
  }

  // Boolean 타입인 조건식
  if (!!change) {
  }
  if (change > 0) {
  }
  if (change !== 0) {
  }
  if (Boolean(change)) {
  }
  ```

  - 느낌표 두개(!!) 연산자는 확실한 논리결과를 가지기 위해 사용한다. 예를 들어 정의되지 않은 변수 undefined값을 가진 내용의 논리 연산 시에도 확실한 true/false를 가지도록 하는게 목적

- 대부분의 자바스크립트 스타일가이드와 lint에서 camelCase를 사용을 권장한다.

- `$(document.querySelector)`는 DOM tree를 탐색하는 비용이 든다. 한번만 쓰고 말 DOM reference라면 이렇게 inline으로 작성해도 상관없지만, 계속 사용할 DOM reference라면 한번 select 후 저장해두는 것이 좋다.

- react component형 App

  ```jsx
  class App extends Component {
    initStates() {
      this.lottos = new State([]);
    }

    mountTemplate() {
      this.$target.innerHTML = `
        ...
      `;
    }

    mountChildComponents() {
      new PurchaseInput($("#purchase-input-wrapper"), { lottos: this.lottos });
      new LottList($("#lotto-view-wrapper"), { lottos: this.lottos });
    }
  }
  ```

- Component를 추상 클래스로 구현하기

  ```jsx
  export default class Component {
    $target;
    props;

    constructor($target, props = {}) {
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

- 래퍼 객체

  - https://medium.com/@yms0214/원시데이터타입-primitive-type-과-래퍼객체-wrapper-object-d8cda814022d
  - **원시타입을 객체화 시켜주는 객체형데이터 타입을 래퍼객체** 라고 하며, 그 종류는 **Number, String, Boolean**이 있다.

- 테스트 코드 분리하기

  - `기능에 대한 테스트`
  - `레이아웃 상황에 대한 테스트`

- `array.fill()`에 객체가 들어갈 경우 참조 복사가 발생하여, 값의 변경에 취약하다.

  - https://github.com/woowacourse/javascript-lotto/pull/12/files#r579601082

- `label`과 `input`

  - `<label for="lotto">`은 `<input id="lotto">`과 짝을 이룬다.
  - `<input>`태그를 `<label>` 태그에 자식으로 넣으면 `id`, `for`를 사용하지 않아도 연결된다.
  - `<label>`과 `<input>`을 연결하면 `<label>`영역을 선택하여 `<input>`에 초점을 맞추거나 활성화시킬 수 있음.
  - `<label>`안에 `<a>`, `<button>` 같은 인터랙티브 요소를 배치해선 안 된다.

- `addEventListener`의 DOM

  - `addEventListener`의 익명함수 내 `this`는 이벤트를 추가한 DOM 요소를 가리킨다.
  - `addEventListener`의 화살표함수 내 `this`는 상위 스코프의 `this`를 가리킨다.

- `classList.replace`

- 메서드의 이름은 내부에 존재하는 로직을 알려주는 방식으로 짓는 것이 아닌 이 메서드를 사용 하는 측(메서드를 호출하는 측)을 위해 오히려 내부 로직을 드러내지 않는식으로 지어야 한다.

- input의 value를 destructuring으로 가져오기

  ```jsx
  const { value } = event.target.elements["purchase"];
  ```

- `new App()`을 생성하자마자 앱이 실행되는 것은 어색하다. 항상 동적할당은 메모리에 대한 객체를 갖고 있는게 안전하다. (언제 쓸 지 모르기 때문)

  ```jsx
  // 생성과 실행 분리
  const app = new App();
  app.execute();
  ```

- visibility

  - `display: none` : 영역 차지 X / 이벤트 동작 X
  - `visibility: hidden` : 영역 차지 O / 이벤트 동작 X
  - `opacity: 0` : 영역 차지 O / 이벤트 동작 O

- `DocumentFragment` 활용하기

  ```jsx
  const fragment = document.createDocumentFragment();
  const childrenFragment = document.createDocumentFragment();
  ```

- input의 `valueAsNumber`

  - Number()로 형변환하는 대신 valueAsNumber로 Number 값을 가져오는 방법

- css BEM

- 처음부터 불필요하게 구조나 디자인 패턴을 적용하지 말고, 앱의 규모에 따라서 적절한 구조를 적용해보자

- innerHTML, innerText 대신 createElement

  - innerHtml을 이용하여 변경하는 경우 XSS attack에 취약할 수 있다.

- model은 데이터만 관리하는게 아닌, 데이터를 정제하고 행동을 만들고, 실제 구현체 용도로 사용할 수 있다.

- array의 `reduce` 함수는 `map`과 `join`으로 대체하기

  - 두 가지 방식

    ```jsx
    const mapJoinHTML = array
      .map((element) => `${element.number}번 요소`)
      .join("");
    const reduceHTML = array.reduce(
      (prev, cur) => prev + `${element.number}번 요소`,
      ""
    );
    ```

- 처음에 보이면 안 되는 요소는 html에 `display: 'none'`으로 심어두기

  - 처음에 hidden하지 않고 코드에서 hidden 클래스를 추가했다면 화면에 잠깐 보였다가 사라져서 사용자 입장에서는 버그라고 보일 수 있다.

- 없는 클래스를 삭제하려고 할 때 에러가 발생하지 않는다.

  - https://developer.mozilla.org/ko/docs/Web/API/Element/classList
  - `elementClasses`는 `elementNodeReference`의 클래스 속성을 나타내는 `DOMTokenList`이다. 만약 클래스 속성이 설정되어 있지 않거나 비어있다면 `elementClasses.length`는 0을 반환한다.

- `closest`의 브라우저 지원 이슈

  - https://developer.mozilla.org/ko/docs/Web/API/Element/closest

- 새로운 것을 많이 시도한, 조금 어려운 어느 크루의 코드

  - Reflect https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Reflect
  - Weakmap https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
  - Proxy

---

# 2️⃣단계

- 자식 컴포넌트에 `props`로 변수 뿐 아니라 메서드도 넘겨줄 수 있다.

  ```jsx
  new WinningNumberForm($("#winning-number-form-wrapper"), {
    open: this.open,
    winningNumber: this.winningNumber,
    tickets: this.tickets,
  });
  new ResultModal($(".modal"), {
    open: this.open,
    result: this.result,
    reset: this.reset.bind(this),
  });
  ```

- `hasOwnProperty`로 컴포넌트의 유효성을 체크한다. (abstract 클래스의 메소드를 모두 구현했는지 여부)

  ```jsx
  if (!this.isAllMethodsImplemented()) this.throwErrorByCase();

  isAllMethodsImplemented() {
    const prototype = this.__proto__;

    return (
      Object.hasOwnProperty.call(prototype, 'initStates') &&
      Object.hasOwnProperty.call(prototype, 'subscribeStates') &&
      ...
    );
  }

  throwErrorByCase() {
    const prototype = this.__proto__;

    if (!Object.hasOwnProperty.call(prototype, 'initStates'))
      throw new Error('initStates is not implemented');
    if (!Object.hasOwnProperty.call(prototype, 'subscribeStates'))
      throw new Error('subscribeStates is not implemented');
    ...
  }
  ```

- if절 또는 switch case 대신 object literal을 사용하는 방법

  ```jsx
  const winnerIndex = {
    [SCORE.FIRST]: 0,
    [SCORE.SECOND]: ticket.includes(winningNumber.bonus) ? 1 : 2,
    [SCORE.THIRD]: 2,
    [SCORE.FOURTH]: 3,
  };
  ```

- 테스트는 “주어진 상황에서 예측가능한 상태”를 검증할때 적절한 방식이다.

  - mock data를 활용하여 예측 가능한 값으로 테스트를 해볼 수 있다.

- 사용성 - esc 키를 눌렀을 때 모달 닫기

  ```jsx
  if (key === "Escape") {
    closeModal();
    return;
  }
  ```

- `Map`

  ```jsx
  const rankCountMap = new Map([
    [VALUE.WINNING_RANK.FIRST, 0],
    [VALUE.WINNING_RANK.SECOND, 0],
    [VALUE.WINNING_RANK.THIRD, 0],
    [VALUE.WINNING_RANK.FOURTH, 0],
    [VALUE.WINNING_RANK.FIFTH, 0],
    [VALUE.WINNING_RANK.NONE, 0],
  ]);

  lotto.tickets.forEach(({ winningRank }) => {
    rankCountMap.set(winningRank, rankCountMap.get(winningRank) + 1);
  });
  ```

- 🤔 왜 `Object` 놔두고 `Map`을 쓸까?

1. Map의 순회는 삽입 순서대로 이루어진다.
2. 어떤 값이든 Key로 사용할 수 있다.
3. 바로 순회가 가능하다.

- 다만 `Object`로 쓰는 게 나은 경우도 있다!

**Ref** https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map

- UML - 구조를 다이어그램 등으로 시각화하는 방법은 여러가지 표준들이 존재한다. 각 네모나 화살표, 점선, 화살표 방향(의존) 등이 의미하는 바가 있다.

- dom selector의 단수/복수를 한번에 처리하는 방법

  ```jsx
  const $ = (selector) => {
    const selected = document.querySelectorAll(selector);

    return selected.length === 1 ? selected[0] : selected;
  };
  ```

- error 여부 판단 (하루)

  ```jsx
  const { isError, message, change } = this.validatePurchaseAmount(purchaseAmount);

  if (isError) {
    alert(message);
    clearInputValue(this.$purchaseAmountInput);
    this.$purchaseAmountInput.focus();
    return;
  }

  validatePurchaseAmount(purchaseAmount) {
    if (purchaseAmount % MONETARY_UNIT) {
      return {
        isError: true,
        message: ...,
      };
    }
  ```

- controlled, uncontrolled 컴포넌트

  - controlled 컴포넌트에서 form data는 컴포넌트에 의해 처리된다. input에서 값이 변경되면, 컴포넌트의 `state`에 값을 담아 form에서 submit해주는 형식이다. `setState`를 사용하는 것이 일반적이다. 반면, uncontrolled 컴포넌트에서 form data는 DOM 그 자체에 의해 처리된다. react에서는 `ref`를 사용하여, 지금 이순간 input에 담긴 값을 form에서 submit해준다.

**Ref**

- https://reactjs.org/docs/uncontrolled-components.html
- https://reactjs.org/docs/forms.html#controlled-components
- https://reactjs.org/docs/forms.html#controlled-components

- html 전체를 아우르는 `main` 태그 만들기

- `DOMContentLoaded`를 사용하여 초기 HTML 문서를 완전히 불러오고 분석했을 때 앱을 실행하자.

  ```jsx
  document.addEventListener("DOMContentLoaded", () => {
    const app = new App($("#app"));
    app.execute();
  });
  ```

- redux 따라하기

  - action

    ```jsx
    export const updatePayment = (value) => {
      "use strict";
      return {
        type: UPDATE_PAYMENT,
        payload: { payment: value },
      };
    };
    ```

  - reducer

    ```jsx
    export const payment = (state = 0, { type, payload = {} }) => {
      switch (type) {
        case UPDATE_PAYMENT:
          if (payload.payment) {
            return payload.payment;
          }
          return state;
        case RESTART:
          return 0;
        default:
          return state;
      }
    };
    ```

  - 리듀서는 순수함수여야 한다. 사이드 이팩트가 없고 넣은게 같다면 나오는 것도 같아야 한다. 다시 말하면 내부에서 random을 호출하는 코드가 존재 하면 안 된다. (직접 호출이 아니라고 하더라도)

- `Object.seal()`

  - Object.seal() 메서드는 객체를 밀봉한다. 객체를 밀봉하면 그 객체에는 새로운 속성을 **추가할** 수 없고(변경은 가능), 현재 존재하는 모든 속성을 설정 불가능 상태로 만들어준다. 하지만 쓰기 가능한 속성(기존에 있던 값)의 값은 밀봉 후에도 변경할 수 있다. 바로 이 점이 `Object.freeze()`와의 차이라고 할 수 있다.

- 도메인에 의존적인 상태들(payment, lottos… 등등)과 라이브러리(리덕스 역할의)가 되는 Store를 분리하는 것이 좋다. 그래야 재사용이 가능해진다.

- singleton pattern

  - 객체를 만들 때, 하나의 생성자로 여러 객체를 만들 수 있다. 하지만 싱글턴은 필요에 의해 단 하나의 객체만을 만들 때 사용한다.

- prettier의 `printWidth`는 80 → 120로 변경되는 게 대세!

- ‘식’ 대신 조건’문’ 사용하기

  ```jsx
  !numbers.includes(randomNumber) && numbers.push(randomNumber);
  ```

  개발자 각자의 취향 차이라고 볼 수도 있지만, ‘문’이 아닌 ‘식’으로만 써야하는 제약이 있는 상황이 아니라면

  ```jsx
  if (!numbers.includes(randomNumber)) {
    numbers.push(randomNumber);
  }
  ```

  이렇게 조건’문’으로 작성된 코드의 가독성이 일반적으로 더 잘 읽힌다.

- 각 validator에 이름 붙여 return하기

  ```jsx
  export const validator = {
    purchaseAmount: money => {
      if (!(money / UNIT_AMOUNT > 0 && money % UNIT_AMOUNT === 0)) {
        return MSG_INVALID_PURCHASE_AMOUNT;
      }

      return '';
    },
    lottoNumbers: numbers => {
      if (numbers.length < WINNING_NUMBER_COUNT) {
        return MSG_BLANK_INPUT;
      }
      if (!isRangeOf(MIN_LOTTO_NUMBER, MAX_LOTTO_NUMBER, numbers)) {
        return MSG_OUT_RANGED_LOTTO_NUMBERS;
      }
      ...

      return '';
    },
  };
  ```

- 원하는 form을 선택해서 reset시키기

  ```jsx
  document.querySelector("price-form").reset();
  ```

- `Object.hasOwnProperty.call`

  ```jsx
  // Object의 hasOwnProperty를 사용하고 'this'를 foo로 명시적 바인딩한 후 호출할 수 있다.
  ({}.hasOwnProperty.call(foo, "bar")); // true

  // 같은 목적으로 Object prototype의 `hasOwnProperty`를 사용할 수도 있다.
  Object.prototype.hasOwnProperty.call(foo, "bar"); // true
  ```

**Ref** https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty

- private hash(#) prefix 사용하기

  ```jsx
  export class Lotto {
    #numbers;

    constructor(numbers) {
      this.#numbers = numbers;
    }

    get numbers() {
      return this.#numbers;
    }
  }
  ```

- `memoize` 구현하여 `cache` 기능 따라해보기 😮

  ```jsx
  export function memoize(callback) {
    const cache = new Map();

    return function (arg) {
      if (!cache.get(arg)) {
        cache.set(arg, new callback(arg));
      }

      return cache.get(arg);
    };
  }
  ```

🙄 이 캐시, 어디서 썼나? 바로 아래에서 👇

- DOM을 계속해서 select하는 문제

  - 같은 DOM을 조회했을 때 querySelect를 새로 하는 문제는 캐시로 해결할 수 있다.
  - selector key값을 받아서 해당 키값으로 select된 DOM ref를 저장해두고, 다음에 같은 key값을 받았을때 다시 querySelect하는 것이 아닌 캐시에 저장해둔 값을 반환하면 된다. (단, 이러한 방법은 모든 key가 변하지않는 유니크한 DOM ref를 반환한다는 보장이 있어야 안전하다.)
  - Lodash 와 같은 유틸 라이브러리에 포함되어있는 [memoize](https://github.com/lodash/lodash/blob/master/memoize.js) 함수가 비슷한 동작을 한다.
  - ‘단순히 DOM을 조회하는 것이 비용이 클까?’ 라는 질문에는 그럴수도 있고 아닐 수도 있습니다. 비용이 큰지 작은지를 비교하기 위해서는 전제조건이 필요합니다.
  - [MDN querySelector 문서](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)를 보면 DOM tree를 `depth-first pre-order traversal`(깊이 우선 preorder 탐색) 한다고 되어 있다. 즉 querySelector의 성능은 DOM tree의 크기와 어느정도 비례한다는 것이다.
  - 전체 문서의 크기가 굉장히 커서 탐색해야할 노드가 많다면, 성능은 더 나빠진다.
  - 반대로 말하면, 전체 DOM tree가 작음을 보장할 수 있다면 매번 querySelect하더라도 성능 상의 큰 차이를 느끼지 못할 수도 있다.

- 라이브러리에서 throw error하기

  - 라이브러리 사용자가 라이브러리 제작자가 의도하지 않은 방향으로 사용할 때에는 `undefined`를 리턴하는것 보다는, 명시적으로 자바스크립트가 에러를 뱉고 동작을 정지할 수 있도록 `throw new Error`를 하는 것이 좋다.
  - `undefined`를 리턴할 경우 사용부에서 에러가 나지않으면 이 라이브러리를 잘못 사용했는데도 그 원인이 어디에 있는지 파악하기 어려울 수 있다.
  - 라이브러리는 사용자가 아닌 개발자를 위한 것!

- `this` binding이 많이 사용되는 class에서는 bind를 미리 선언하기

  ```jsx
  this.onRestart = this.onRestart.bind(this);
  this.$restartButton.addEventListener("click", this.onRestart);
  ```

- `toFixed(Int)`로 소수점 자리수 나타내기

- 단방향 데이터 플로우 (flux 패턴)

  - https://github.com/woowacourse/javascript-lotto/pull/24

- dom selector에 기능 붙이기

  ```jsx
  export function $(selector) {
    const target = document.querySelector(selector);
    const $customElement = Object.assign(target, {
      clearChildren: function () {
        while (this.hasChildNodes()) {
          this.removeChild(this.firstChild);
        }
      },
      disable: function () {
        this.disabled = true;
      },
      enable: function () {
        this.disabled = false;
      },
    });
    return $customElement;
  }
  ```

- 브라우저 서포트 검색하기

  - https://caniuse.com/
  - 다만, 브라우저 지원률을 [https://caniuse.com](https://caniuse.com/) 에서 확인하면 좋긴 하지만, 사실 현업에서 사용자들의 트러블 슈팅을 하면 IE 미지원이나 모바일 구버전 브라우저의 경우 발목을 잡는 경우들이 꽤나 있다. 그래서 조심해야할 점은 해당 페이지의 지원율과 비즈니스의 사용자가 어떤 디바이스 층으로 나뉘어져 있는지 잘 확인해보는게 중요하다.

- Object deepfreeze

  ```jsx
  export const deepFreeze = (target) => {
    if (target && typeof target === "object" && !Object.isFrozen(target)) {
      Object.freeze(target);
      Object.keys(target).forEach((key) => deepFreeze(target[key]));
    }

    return target;
  };
  ```

- `WeakMap` 사용하여 `cache` 구현하기

  ```jsx
  const cache = new WeakMap();
  ```

  - `WeakMap` 객체는 키가 약하게 참조되는 키/값 쌍의 컬렉션이다. 키는 객체여야만 하나 값은 임의 값이 될 수 있다.
  - `WeakMap` 내 키는 약하게 유지된다. 다른 강한 키 참조가 없는 경우, 모든 항목은 가비지 컬렉터에 의해 `WeakMap`에서 제거된다.

**Ref** https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap

- class나 id보다 dataset이 성능은 느리다?

  - 성능에 대해서는 O(n^2) 급의 느린게 아니라면, 사용을 해도 상관없다.

- Proxy handler 다루기

- 덕 타이핑 사용해보기

  - class로 Presentational과 Container를 만들어서, 상속을 진행한 후 덕 타이핑으로 진행하는 방법도 있다.
  - 클래스 상속이나 인터페이스 구현으로 타입을 구분하는 대신, 덕 타이핑은 객체가 어떤 타입에 걸맞은 변수와 메소드를 지니면 객체를 해당 타입에 속하는 것으로 간주한다
  - https://ko.wikipedia.org/wiki/덕_타이핑

- `CypressWrapper` 사용

  ```jsx
  class CypressWrapper {
    _getCy(selector) {
      return cy.get(selector)
    }
    type(selector, value) {
      try {
        this._getCy(selector).type(value)
      } catch (err) {
        new Error(err)
      }
      return this
    }
    click(selector, params) {
      try {
        this._getCy(selector).click(params)
      } catch (err) {
        new Error(err)
      }
      return this
    }
    ...
  }
  const cw = new CypressWrapper()
  ```

- `reduce`로 총합 구하기

  ```jsx
  profitRate() {
    const income = Object.values(this.#lottoResult).reduce((acc, cur) => {
      return acc + cur.price * cur.count
    }, 0)
    return getProfitRate(income, this.#tickets.length * 1000)
  }
  ```

- cypress `should` & `and`

  ```jsx
  cy.wrap(winningNumberInput)
    .should("have.value", "")
    .and("be.focused")
    .type(winningNumbers[index]);
  ```

- class의 메소드들

  - App Class 내부에서만 쓰이는 Method면 \_ prefix를 붙여서 구분하는 편이 좋을다.
  - class 내에서 순서를 constructor - public method - protected - private 순으로 지정하는 것이 좋다. 외부에서 app을 사용할 때 public method만을 사용하므로, 확인할 때 위에 있을 수록 더 쉽게 찾을 수 있기 때문.

- `innerHTML` vs `innerText` vs `textContent`

  - `textContent`는 노드의 모든 요소를 반환한다. 그에 비해 `innerText`는 스타일링을 고려하며, “숨겨진” 요소의 텍스트는 반환하지 않는다.
  - 또한, `innerText`의 CSS 고려로 인해, innerText 값을 읽으면 최신 계산값을 반영하기 위해 [리플로우](https://developer.mozilla.org/en-US/docs/Glossary/Reflow)가 발생한다. (리플로우 계산은 비싸므로 가능하면 피해야 한다.)
  - Internet Explorer 기준, `innerText`를 수정하면 요소의 모든 자식 노드를 제거하고, 모든 자손 텍스트 노드를 영구히 파괴한다. 이로 인해 해당 텍스트 노드를 이후에 다른 노드는 물론 같은 노드에 삽입하는 것도 불가능하다.
  - `Element.innerHTML`는 이름 그대로 HTML을 반환한다. 간혹 `innerHTML`을 사용해 요소의 텍스트를 가져오거나 쓰는 경우가 있지만, HTML로 분석할 필요가 없다는 점에서 `textContent`의 성능이 더 좋다.
  - 이에 더해, `textContent`는 [XSS 공격 (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)의 위험이 없다.
  - 가급적 `textContent`를 사용하는 것이 좋다. 성능과 보안에 강점이 있고, 결과적으로 해당 노드의 raw text를 얻게 됨으로써 이후 의도한 대로 가공할 수 있기 때문이다.
  - 이 취약점으로 해커가 사용자의 정보(쿠키, 세션 등)를 탈취하거나, 자동으로 비정상적인 기능을 수행하게 할 수 있다. 주로 다른 웹사이트와 정보를 교환하는 식으로 작동하므로 사이트 간 스크립팅이라고 한다.
  - 보통 h와 같은 (heading) 태그를 사용할 때는 이벤트 관점보다는 html상의 위상, 이 element가 heading을 해야하는지 등에 대한 처리가 필요할 때 사용하는 경우가 많다.

- convention 정의

  ```
  ## 📓 Convention
  - 클래스에서 속성명 앞에 _ 가 붙여진 것은 해당 속성이 protected 속성임을 뜻하며 인스턴스 외부에서 해당 속성을 수정해서는 안됩니다.
  - 클래스에서 속성명 앞에 # 가 붙여진 것은 해당 속성이 private 속성임을 뜻하며 상속이 수행된 클래스 내부에서도 해당 속성을 사용하려 해서는 안됩니다.
  - 어떤 인스턴스에 pascal case 표기된 속성이 있다면 해당 속성이 사실 getter 임을 뜻합니다. 이를 조작하려는 시도를 하지 않도록 유의해주십시오.
  ```

- `Node.nodeType`
  **Ref** https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType

- javascript는 타입이 느슨하여, parameter가 이상하게 들어올 수 있는 확률이 굉장히 높다. 이에 대비를 잘 해주자

- Service layer pattern

  - https://en.wikipedia.org/wiki/Service_layer_pattern

- 클래스의 메소드보다 변수를 아래로?
  비유를 하면, 자전거가 굴러가는지, 안 굴러가는지는 내부 상태를 정의한 값으로만은 알 수 없다. 상태만 정의되어있고 move라는 행동이 없다면 굴러가지 않는다. 대규모 프로그래밍을 하게되면, 사실 상태가 의미가 없는 경우가 많다. 해당 클래스를 빠르게 보면서 이 친구는 어떤 역할을 하는 친구인지, 어떤 행동을 하는지만 알면 대략적으로 어느 부분을 수정해야 하는지 확인할 수 있고, 수정해야 하는 메서드를 잘 나눠놓았다면 메서드 단위로 수정을 해주면 된다. 해당 메서드를 수정할 때에는 내부에서 사용되는 상태를 파악하면 되는 것. 결국 상태는 많이 확인을 안하게 된다. 다만 이 전제는 객체지향적으로 메소드나 함수, 클래스를 잘 짜놓았을 경우의 상황이다.

- 함수 작성 순서

  1. 먼저 어떤 행동을 하는 함수인지 정의한다.
  2. 해당 함수가 어떤 parameter가 필요한지 정의한다
  3. 해당 parameter는 어떠한 예외가 있는지 bad case를 정의하여 return 구문을 작성한다.

**Ref** https://github.com/woowacourse/javascript-racingcar/pull/25#discussion_r576201158
