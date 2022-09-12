---
title: 우테코 4주차 기록
date: 2021-02-27 10:10:19
tags: woowacourse
---

우테코 4주차 기록

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 페어 프로그래밍

- 1단계를 마무리하고 2단계를 진행했다. View를 더욱 세부적으로 나누고 `CustomEvent`를 적용하여 view와 controller의 역할을 구분하였다. view에서 event가 발생하면 `dispatchEvent`를 통해 controller에서 기능을 수행하도록 했다. 페어의 리드를 따라 처음 시도해 본 패턴인데, 쓰다보니 익숙해지며 괜찮은 방식이라고 느꼈다.
- 다만 코치님들의 말씀대로, 설계를 하기 전에 해당 패턴을 왜 사용했는지, 장점은 무엇인지, 만드는 과제에 적합한 패턴인지, 내가 잘 알고 있는지 등에 대해 진지하게 생각해보지 못한 것 같다. 좋아 보여서 시도해보는 것은 좋지만, 왜 쓰는지를 알고 보다 꼼꼼한 검토 후에 설계를 시작하는 것이 좋을 것 같다.
- 웹 접근성에 대한 고민을 많이 했다. 페어가 `aria` 태그를 알려주었고, `section`과 `h1` 제목 태그 등을 적절한 상황에서 올바르게 작성하는 semantic html 작성에 대한 고민을 시작하게 되었다. 페어가 알려준 WAVE라는 크롬 익스텐션도 꽤나 유용하다! 혼자라면 절대 생각하지 못했을 부분들을 많이 고민하고 알려줘서 고마운 마음이다.
- cypress가 조금씩 익숙해져가는 것 같다. 필요할 때 사용되는 메소드를 찾는 것이 재미있다.
- `reduce`나 `addEventListener`의 콜백 함수 처리 등, javascript의 기본적인 메서드 사용 방식을 계속해서 헷갈리고 있다는 점을 느꼈다. 오래 작업하다보니 지친 탓일 수도 있지만, 전반적으로 언어에 대한 기본기가 탄탄하지 않은 것 같다. 시간 내서 반드시 차근차근 살펴봐야겠다.
- 페어와 같이 하다보니 메소드를 controller에 넣을지, utils에 넣을지 고민하는 등 혼자 했으면 그냥 기계적으로 했을 작업들을 시작하기 전에 한 번 더 생각해볼 수 있어서 좋다. 나는 손가락은 빠르지만 사실 머리는 비어 있다! 코딩하는 기계. 품질은 보장 못함 😬
- vscode가 우리 파일 dirty하다고 했다 😂
- 페어는 중간중간에 나를 많이 칭찬해준다! 나는 항상 페어와 다른 크루들 보면서 대단하다고 느끼는데, 부끄럽지 않게 나도 많이 배우고 성장해야겠다.
- 같이 밤늦게까지 작업하며 헛소리도 가끔 하고 점점 정신을 잃어가는 동료애를 학교 팀플 이후에 처음 느끼고 있는 것 같아 재미있다(?)
- 내가 아무래도 혼자 코딩하던 습관이 짙게 배어 있어서 페어를 배려하지 못한 부분들이 있었던 것 같다. 어디선가 해답이나 소스를 찾으면 무조건 일단 돌려보고 생각하는 습관 때문에 페어에게 생각할 시간을 충분히 주지 못한 것 같다. 페어와 함께 하는 프로그래밍에서 상대방과 맞춰가려는 연습을 더 해야겠다.
- 그래도 페어가 조금 굳어있던 자신 때문에 불편했을까봐 먼저 이야기 꺼내주어서 고마웠다! 서로 오해한 채로 있는 것보다 바로바로 자기 생각을 공유하는 게 훨씬 좋은 것 같다.

---

## 포수타

- 알고리즘 공부에 대한 질문이 있었다. 나는 알고리즘 스터디를 오래 진행했음에도 불구 상당히… 약하다 😭 알고리즘이 프로그래밍계의 토익이 되고 있다는 말씀을 해주셨다.
  알고리즘을 빠삭하게 마스터하지 못하더라도, 다른 프로그래밍 역량들로 자신을 채워나가는 것도 좋은 방법이다. 들어가고자 하는 회사에 나를 뽐낼 수 있도록! 😎

- 등교와 관련한 간단한 이야기들을 전달하고, 백엔드 강의 때 있었던 캡틴의 훈화 말씀(?)을 공유했다.

- 페어를 기다리는 것도 연습이다. 이는 학습의 기본이며, 협업에서 필요하다. 컨디션이 좋아 코드를 거침없이 써내려나갈 때 페어를 기다려주지 못한 스스로를 반성하게 되었다.

- 사실 지금도 많이 벅차고 여유가 없지만, 알아서 여유 시간을 만들면서 번아웃이 오지 않게끔 조절하고 있다. 한번 너무 쎈 번아웃을 맞아서 엉망진창이 된 적이 있기에 주의하고 있다.
  그래도 어떻게 하면 지치지 않으면서 학습을 지속할 수 있을까?에 대한 캡틴의 이야기에 귀기울여 보았다.

- 주변에서 정보와 지식들은 물밀듯이 밀려오고, 남들이 하는 것 다 좋아보이고 다 해야될 것 같은 기분이 든다. 무언가에 쫓기고, 조급한 마음. 이에 휘둘리게 되면 번아웃의 지름길로 향하는 것이다.

  나도 또 그럴 뻔 했다. 우테코에 토이 프로젝트 2개, 스터디까지 하고 있으면서(취미로 드럼과 운동까지 😵) 크루의 스터디 모임에 또 참여해야만 할 것 같은 마음이 들었다.

  이제 당분간은 일을 벌이지 않기로 다짐했으면서 또 흔들렸다. 그래도 용감하게 포기했다. 정말 용감한 선택이었다. 마침 캡틴의 메시지가 그런 내 선택을 지지해주는 것 같았다.

  > 의식에 매여 있는 당신의 인생 일부를 반복으로 만들어진 습관에 맡긴 뒤, 그렇게 얻은 여유를 정말 중요한 일(기계처럼 반복해선 안 되는 일)에 투입해야 한다.

- 위 메시지가 엄청 와닿는다. 공부를 습관처럼 해온지 십수년도 넘었는데, 그로 인해 얻은 여유를 내가 좋아하는 드럼과 운동, 뛰어놀기에 쏟고 있다. (물론 코딩도 좋아하는 편이다 🙃)

- 주변에 휘둘리지 않는 똘끼를 가지자! 나 자신을 믿어보자!

---

## 테코톡

javascript에서 제일 헷갈리는 개념 중 하나인 `this`를 주제로 테코톡을 진행했다. 내용도 좋았지만, 발표를 너무 재밌게 잘 준비해주셔서 집중력 있게 들을 수 있었다.
발표 자료를 그렇게 센스 있게 만드는 연습을 좀 해야겠다 😵

자바스크립트 엔진은 모든 실행 가능한 코드(전역, 함수, eval 코드 등)를 평가하여 실행 문맥(렉시컬 환경 컴포넌트, 디스 바인딩 컴포넌트 등)을 만든다. 이 실행 문맥에 `this`에 대한 정보가 담긴다. 전역 실행 문맥에서 함수가 실행되면, 함수 실행 문맥으로 넘어가는 타이밍에서 `this`가 결정되는 것이다.

This Binding 규칙들은 아래와 같다.

**1. 기본 Binding**

- 함수를 단독실행하게 되면 `this`는 기본적으로 전역 객체(window)에 binding된다.
- 하지만 use strict를 사용하면 binding될 객체가 존재하지 않기 때문에 `this`는 `undefined`다.
- node 환경에서 전역 코드 상 `this`는 빈 객체가 나온다. 이는 module의 export와 같은 객체다.

**2. 암시적 Binding**

- ‘.’이 가리키는 object에 binding된다.
- 이때 `this`를 사용한 함수를 callback으로 넘기면 `this`를 잃어버린다! 😵
- callback으로 함수를 넘기면 기존 함수의 참조값만 전달하여 `this` binding을 실행하지 않기 때문이다.

**3. 명시적 Binding**

- `call`, `apply`, `bind` 등의 메서드를 통해서 명시적으로 `this` binding이 가능하다.
- `call(context, arg1, arg2...)` - 인수를 하나하나 전달
- `apply(context, args)` - 인수를 유사배열 형태로 전달
- `func.bind(context, arg1, arg2)`과 같은 형태로 주로 사용해왔다.
- hard binding - 항상 같은 객체로 binding하는 방법

**4. new 키워드로 Binding**

- 생성자 함수로서의 역할 수행

- 실제 내부 로직은 다음과 같다.

  ```jsx
  {
    obj = {};
    this = obj;
    this.name = 'zig' // obj: { name: 'zig' };

    return this;
  }
  ```

**new binding > 명시적 binding > 암시적 binding > 기본 binding** 순서로 binding이 이루어진다.

ES6부터 등장한 arrow function을 사용하면 이 어지러운 `this` binding을 피할 수 있다.
arrow function은, 상위 실행 문맥을 유지할 수 있다. 선언될 당시의 상위 스코프에서 이루어진 this binding을 참조하기 때문에 `this`를 잃어버리지 않을 수 있다!

언제 봐도 헷갈리는 `this`, 아마 수 개월은 더 싸워봐야 헷갈리지 않고 쓸 수 있을 것 같다.
react를 개발하는 동안에는 그냥 arrow function만 썼는데, `this`에 대한 개념을 명확히 알고 필요에 따라 자신 있게 쓸 수 있는 개발자가 되어야겠다.

## 👨‍🏫 강의

### 서로의 성장을 위한 피드백

- 기록하고 공유하자
- 미션을 회고하고, 설계에 대한 토론을 나누어보자

### 함께 자라기

**고독한 전문가👤 ?**

- 신뢰가 깨진 상황에서는 어떤 행동이라도 악의적으로 느낄 수 있다
- 아무리 뛰어난 기술적 실천법을 갖고 있다 하더라도, 사회적 자본과 사회적 기술, 신뢰감 없이는 적용하기 어렵다.
- 노벨과학상의 산실 벨 연구소의 뛰어난 연구자에 대한 연구에 따르면 뛰어난 연구자는 타인의 도움을 받으며, 타인과 인터랙션에 시간을 더 쏟는다
- 인간은 컴퓨터가 아니기 때문에, 논리적인 질문을 한다고 해서 논리적인 답변을 하지는 않는다
  질문 받은 사람은 논리적인 답변을 해야 한다는 압박감 때문에, 가짜 답변을 하는 경우가 많다. 그러면 실수를 점점 더 감추게 되고, 나중에 실수가 커져서 더 좋은 아웃풋이 나올 수 없다
  페어 프로그래밍 전후로 회고 시간을 가지고, 서로의 감정을 이야기하는 것이 필요하다. 이때 너무 논리에만 빠지지 않게 주의하자
- 심리적 안정감 - 내 생각이나 의견, 질문, 걱정, 혹은 실수가 드러났을 때 처벌받거나 놀림받지 않을 것이라는 믿음
- 페어의 발목을 잡고, 때로는 페어를 기다려라. 그것이 함께 성장하기 위한 길! 😎

---

### 깜짝 퀴즈

틀렸거나 헷갈렸던 문제들 위주로 정리
**Q. 다음 중 자바스크립트 Array의 내장 메서드가 아닌 것은?**

```
reverse/ fill/ reduceRight/ has
```

`reverse`와 `fill`은 알고 있었고, `has`는 `Set`에 있는 것이기 때문에 아닐 것이라고 생각했다.
정답이었던 `reduceRight`은 사실 처음 들어봤다. 😵
말 그대로 `reduce`에 대한 누적을 오른쪽부터 실행한다.

**Ref** https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight

**Q. 아래 코드 실행 시 console에는 무엇이 찍힐까요?**

```jsx
function Pokemon(name) {
  this.name = name;
}

const pikachu = Pokemon("pikachu");
console.log(pikachu.name);
```

뭐라 답했는지 기억도 안 난다 😑 암튼 에러가 뜬다.

```jsx
Uncaught TypeError: Cannot read property 'name' of undefined
```

`new` 키워드 없이 실행했기 때문에, pikachu는 undefined가 된다.

**Q. 아래 코드 실행시 출력되는 값은?**

```jsx
(function (name) {
  console.log(`I am ${name}`);
})("pikachu");
```

“I am pikachu”가 출력된다.

**Q. 아래의 코드를 실행하면 어떻게 출력될까요**

```jsx
const pokemon = {
  name: "피카츄",
  owner: {
    zig: {
      ownername: "zig",
      play() {
        console.log(`${this.ownername}: ${this.name} 네 차례야`);
      },
    },
  },
};

pokemon.owner.zig.play();
```

“zig: undefined 네 차례야”가 출력된다.

“zig: 피카츄 네 차례야”를 출력하고 싶다면,

```jsx
const pokemon = {
  name: "피카츄",
  getName() {
    return this.name;
  },
  owner: {
    zig: {
      ownername: "zig",
      play() {
        console.log(`${this.ownername}: ${pokemon.getName()} 네 차례야`);
      },
    },
  },
};

pokemon.owner.zig.play();
```

---

## 로또 미션 공통 피드백 - 1

- 다른 크루들의 PR 리뷰에도 참여해보자

- DOM 조작 최적화에 대해 끊임없이 고민과 실험을 해보자

- JSDOC을 활용하자

- tag에 id 대신 `data` 속성을 사용해보자

  - class는 스타일을 위한 것이므로 class로 여러 개를 가져와서 조작할 경우 추후 깨지기 쉽다
  - id는 document에 정말 딱 한 개만! 필요할 때 사용한다

- 불필요하거나 의미를 알기 어려운 `return`은 지양하자

- 객체에의 접근은 일관성 있게

- `NodeList`는 array는 아니지만 기본적으로 `forEach`를 사용할 수 있다

- `EOL`을 지키자

---

## 로또 미션 공통 피드백 - 2

- 웹 표준을 지켜 html을 수정해보자
  cf) 많은 사이트들의 제목은 `h1` 태그를 사용한다. 검색 노출을 늘리기 위한 SEO를 고려한 방식이라고 한다.

- javascript가 기본적으로 제공하는 API를 잘 활용해보자

- validator를 계속 쌓아가면 효율적이다

- 함수의 네이밍을 명확히 하자

- 지옥의 분기😵를 피하자

  ```jsx
  // 😵
  if (count === 6) {
    rankCount[0]++;
  } else if (count === 5 && numbers.has(bonusNumber)) {
    rankCount[1]++;
  } else if (count === 5) {
    rankCount[2]++;
  } else if (count === 4) {
    rankCount[3]++;
  } else if (count === 3) {
    rankCount[4]++;
  }
  ```

  Object literal로 작성하는 것도 좋은 방법이다. 이때 key에 undefined 값이 들어올 수도 있으므로 필요에 따라 적절한 디폴트 값을 부여해야 한다.

- 실수는 예방하는 것이 아니라 관리하는 것이다. 자신이 자주 하게 되는 실수들은 체크리스트를 만들어 잘 관리하자

**Ref**

- https://github.com/validatorjs/validator.js
- https://github.com/ansman/validate.js

---

## 📚 배우기

### Execution Context & Scope & Closure

**Execution Context**
자바스크립트는 함수를 실행할 때, 실행 컨텍스트(execution context)를 생성한다.

**Scope**
스코프란 현재 접근할 수 있는 변수들의 범위를 의미한다.
ES5까지는 오직 함수에 의해서만 스코프가 생성되었으나, ES6에서부터는 블록에 의해서도 스코프 경계가 발생하게 함으로써 구분이 명확해졌다.

**🤔 Scope Chain**
Scope Chain을 따라 스코프를 형성하면서 현재 호출된 함수가 **선언될 당시**의 Lexical Environment를 참조한다.
선언한다는 행위는, 콜 택 상에서 어떤 실행 컨텍스트가 활성화된 상태를 가리킨다. 모든 코드는 실행 컨텍스트가 활성화 상태일 때 실행되기 때문이다.

**Closure**
클로저는 함수와 함수가 선언된 어휘적 환경의 조합이다.
자바스크립트 엔진은 함수를 어디서 호출했는지가 아니라 함수를 어디에 정의했는지에 따라 상위 스코프를 결정하는데, 이를 Lexical Scope(정적 스코프)라고 한다.

```jsx
function init() {
  const name = "zig";
  function displayName() {
    // inner function인 displayName은 클로저이다.
    console.log(name); // outer function인 init 함수에 선언된 name을 기억한다.
  }
  displayName();
}
init();
```

아래 코드는 위와 동일하게 작동한다.

```jsx
function makeFunc() {
  const name = "zig";
  function displayName() {
    console.log(name);
  }
  return displayName;
}

var myFunc = makeFunc();
myFunc();
```

자바스크립트는 함수를 리턴하고, 리턴하는 함수가 클로저를 형성하기 때문에 `makeFunc` 내부에서 `displayName`이 리턴될 때 `name` 변수를 가지고 있다.
`name`은 클로저가 생성된 시점의 유효 범위 내에 있는 지역 변수이며,`displayName`의 인스턴스는 변수 `name`이 있는 어휘적 환경에 대한 참조를 유지하기 때문이다.

클로저를 활용하여 프라이빗 메소드를 흉내낼 수도 있다. 이렇게 클로저를 사용하는 것을 **모듈 패턴**이라고 하는데 ES6부터는 본격적으로 모듈을 지원함으로써 더욱 사용이 간편해졌다.
아래는 ES5 환경에서 모듈 패턴을 사용하는 코드이다.

```jsx
const $ = (function ($element) {
  const element = $element; // show, hide가 공유하는 private property

  function controlDisplay(attr) {
    // show hide가 공유하는 private method
    element.style.display = attr;
  }

  return {
    show: function () {
      controlDisplay(block);
    },
    hide: function () {
      controlDisplay(none);
    },
  };
})();
```

그러나 함수 내에서 함수를 불필요하게 작성하는 것은 때로는 코드를 더럽힐 수 있다. 특히 생성자가 호출될 때마다 메서드가 다시 할당되기 때문에, 성능적인 문제도 발생한다.
자바스크립트의 prototype을 사용하여 클로저를 다른 방식으로 작성할 수 있다.

```jsx
function Person(name, greet) {
  this.name = name;
  this.greet = greet;
}
Person.prototype.getName = function () {
  return this.name;
};
Person.prototype.greets = function () {
  return this.greet;
};
```

이처럼 클로저는 상태가 의도치 않게 변경되지 않도록 상태를 안전하게 은닉(information hiding)하여 상태를 안전하게 변경하고 유지하기 위해 사용할 수 있다.

\+ 클로저는 메모리를 계속 차지하므로 더는 사용하지 않게 된 클로저에 대해서는 메모리를 차지하지 않도록 관리해줄 필요가 있다.

**Ref**

- https://developer.mozilla.org/ko/docs/Glossary/Scope
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures

### Module & State Management

모듈은 특정 기능을 하는 하나의 코드 묶음 단위이다. 모듈이 모여 하나의 큰 프로그램이 되며, 모듈은 또 다른 모듈의 일부로서 기능할 수 있다.
🤓 자바스크립트 파일들 간에 `export`, `import`를 할 수 있는 것은 모듈 덕분!

모듈은 ES6에서부터 지원하기 시작했다.

- 모듈은 파일 단위의 구성을 기본으로 한다. 하지만 간단한 메서드 형태인 모듈들인 경우 한 개의 파일에서 관리하기도 한다.

- 모듈의 변수, 함수, 클래스 등은 `export` 키워드로 노출하고 `import`로 다른 모듈, 페이지에서 가져와서 사용한다.

- 모듈은 순환 참조를 할 수 없다. 모듈 시스템은 항상 트리 구조로 맨 위에 처음 실행되는 루트 페이지/모듈이 있으며 한 방향으로만 참조할 수 있다.

- 모듈의 이름은 중복될 수 없다. 따라서 가져오는(import) 시점에 이름을 재정의해 충돌을 피할 수 있다.

  ```jsx
  import { View as WonderfulView } from "/wonderfulView.js";
  ```

상태는 어플리케이션의 데이터를 가리키며, 앱의 흐름에서 이 상태를 잘 관리해줘야 한다. 상태 값의 변화를 예측 가능한 범위에서 통제하기 위해서는 일관되게 READ하는 로직과, 최소한의 Write를 하는 로직을 고민해서 설계해야 한다.

**Ref**

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules
- https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/

### 나만의 라이브러리

javascript prototype을 이용, 함수를 확장하여 나만의 라이브러리로 사용할 수 있다. 아래는 한 크루의 코드를 참고하여 직접 간단하게 만들어 본 코드

```jsx
const $ = (() => {
  const constructor = function (selector) {
    this.$element = document.querySelector(selector);
  };

  constructor.prototype.method = function () {};

  constructor.prototype.init = function () {
    console.log(this.$element);

    return this;
  };

  constructor.prototype.show = function () {
    this.$element.style.display = "block";

    return this;
  };

  constructor.prototype.hide = function () {
    this.$element.style.display = "none";

    return this;
  };

  const instantiate = function (selector) {
    return new constructor(selector);
  };

  return instantiate;
})();
```

위와 같이 [즉시실행함수(IIFE)](https://developer.mozilla.org/ko/docs/Glossary/IIFE)로 정의하면, 사용 시 `new` 키워드를 붙이지 않고 사용할 수 있다.
또 각 메서드마다 `this`를 리턴하여 메서드 체이닝이 가능하게끔 만들었다.

```jsx
// someView.js
const priceInput = $("#price-input");
const winningsModal = $("#winnings-modal");

priceInput.show().init();
winningsModal.hide();
```

다른 크루의 pr에 달린 리뷰도 같은 접근법을 사용한다.

```jsx
function $(selector) {
  const element = document.querySelector(selector);
  return {
    show() {
      element.style.display = "block";
    },
    hide() {},
    get innerHTML() {},
    set innerHTML(v) {},
    addEventListener(eventName, cb) {},
  };
}
```

조금 더 노력하면(?) 현재 어플리케이션에서 필요한 validator도 커스텀 라이브러리로 만들어볼 수 있다.

**Ref**

- https://velog.io/@mkitigy/DOM-custom-DOM-library-만들기
- https://github.com/woowacourse/javascript-racingcar/pull/48#discussion_r577554316
- https://github.com/ansman/validate.js

## 기타

**`<input type="reset" />`**

- 모든 폼(form) 요소의 값을 초깃값으로 되돌리는 리셋 버튼 기능을 수행한다. 😮 (몰랐다!)

**removeEventListener**
`addEventListener`가 있듯이 특정 시점에 event를 지워주는 `removeEventListener`도 있다.
특정 dom에 이벤트가 처음 딱 한 번만 실행되도록 하기 위해서 넣어봤다가, 이번에는 적절한 방식이 아닌 듯하여 사용하진 않았다.

**css로 라이언 그리기**
https://zinee-world.tistory.com/425
https://zinee-world.tistory.com/426

**git cherry-pick**
다른 브랜치의 커밋들을 가져올 수 있다. 알고는 있었는데 직접 써본 것은 처음!
[한 크루의 블로그](https://365kim.tistory.com/78#이전-단계-커밋이-줄줄이-땅콩으로-따라온다면)를 참고하였다.
커밋을 하나씩 가져오는 것도 가능하지만, 특정 범위의 커밋을 모조리 가져오는 것도 가능하다. 커밋 a부터 커밋 b까지 가져오고 싶다면 아래와 같이 입력한다.

```shell
git cherry-pick a^..b
```

**git rebase vs pull**
`rebase`를 했더니 지난 커밋들이 모두 그대로 산 채로 딸려와 PR에 같이 올라갔다 😑.

원상태로 돌아가 upstream을 `pull`해서 이전 단계의 머지 커밋만 딱 가져오고, 그 이후에 새로운 커밋들만 차곡차곡 쌓아나가 보자

**javascript에서는 null도 object**
콘솔을 찍으면 아래와 같이 나온다! 😮

```jsx
console.log(typeof null); // "object"
```

MDN에 따르면 하위호환 유지를 위해 `null`의 타입이 `null`이 아니라고 하는데, 무슨 말일까? 🤔

우선 `undefined`는 데이터 타입이자 값을 나타낸다.
`const name`와 같이 변수를 선언하면 변수에 `undefined`라는 ‘값’을 할당한다.

`null`은 명시적으로 값이 없음을 나타내기 위해 사용한다.
`Number` 타입의 초기값이 0이고, `String` 타입의 초기값이 “”이듯 `null`은 어떤 `Object` 타입의 값을 할당받을 변수를 초기화해주는 값이다.

🙄 그런데 이게 [자바스크립트의 초기 버그라는 의견](https://curryyou.tistory.com/183)도 있다. 알 수 없는 자스의 세계

**Ref** https://webclub.tistory.com/1

**javascript는 1급 객체? 🤔**
프로그래밍 언어에서 type을 전달, 반환 및 할당할 수 있는 경우 해당 type을 1급 객체로 간주한다고 한다. 1급 객체가 되기 위해서는 다음 조건을 충족해야 한다.

- 변수나 데이터 구조에 담을 수 있다.
- 파라미터로 전달할 수 있다.
- 리턴값으로 사용할 수 있다.

javascript에서는 `const` 키워드로 함수를 할당할 수 있으며,

```jsx
const funcA = function () {
  // ...
};
```

method 방식을 이용할 수도 있다.

```jsx
const student = {
  name: "zig",
  grade: 4,
  print: function () {
    console.log(this.name + ": " + this.grade);
  },
};
```

함수를 전달할 수도 있으며,

```jsx
function printStudent() {
  console.log("student working");
}
$("form").on("submit", printStudent);
$("button").on("click", printStudent);
```

마지막으로 함수를 반환할 수도 있다. 이건 위의 클로저를 참조!

이 모든 것은 javascript의 function은 prototype을 통해 object를 상속 받고 있기 때문이다. 즉, javascript의 function 또한 object라는 점을 이용하여 함수를 각양각색으로 활용할 수 있다.
고차함수(HoF, Higher order Function)을 만들 수 있는 것도 장점이다!

**Ref**

- https://soeunlee.medium.com/javascript에서-왜-함수가-1급-객체일까요-cc6bd2a9ecac
- http://junil-hwang.com/blog/javascript-1급함수/

**Array.push 대신 Array.map 사용하기**

- javascript Array 내장 메서드를 잘 활용하자 👍

**aria-role**

- ARIA(Accessible Rich Internet Applications)는, 웹 접근성을 높이기 위한 W3C 명세이다. HTML 요소에 `role` 또는 `aria-*` 속성을 추가하여 콘텐츠의 ‘역할(roles), 상태(states), 속성(properties)’ 정보를 보조기기에 제공한다.

**Ref** https://github.com/lezhin/accessibility/tree/master/aria

---

## 🤔 생각해보기

**HOW형 인간**

- 학습심리테스트 검사 결과 HOW/ WHY/ WHAT/ IF 4가지 유형 중 프론트엔드 최고의 지독한 HOW형이 나왔다. 극단적인 파이 모양… 사실 너무나 잘 알고 있었다. 😬
  지난 한 달 간 나를 거쳐간 두 명의 페어 모두 WHY형이라 왠지 더 미안하다 😭 효율갑에 무조건 빨리빨리, 상처 잘 받지도 않아서 내가 너무 딱딱하게 말하진 않나 늘 생각하고 반성하긴 했는데
  아무튼 참 오래토록 변하지도 않고 선명한 성격이다. 성격이 스스로 그렇게 맘에 안 들진 않지만, 의식적으로라도 부드러워지도록 노력해야겠다.

**익스텐션 구경하기**

- auto rename tag
- better Comment
- bracket pair colorizer
- code spell checker
- color highlight(컬러코드를 미리보기)
- git indicators
- htmltagwrap
- indent-rainbow
- markdown preview Enhanced
- output colorizer
- polacode(코드를 이쁘게 캡쳐)
- Todo Tree
- version lens
- wakaTime(코드 짜는 시간을 분석, 메일이 옴)
- GIPHY(익스텐션x 화면 녹화해주는 프로그램, 움짤로 만들어줌)

**Bool 변수 이름짓기**

- is 용법/ 조동사 용법/ has 용법/ 동사원형 용법으로 나눌 수 있다.
- 동사원형 용법은 3인칭 단수로 쓰는 점에 유의하자. 주어 역할을 하는 인스턴스가 3인칭 단수이기 때문이기도 하며, [스위프트 API 디자인 가이드](https://swift.org/documentation/api-design-guidelines/#strive-for-fluent-usage)와의 일관성을 지키기 위해서도 필요하다.

Ref https://soojin.ro/blog/naming-boolean-variables

**POJO**
Ref https://masteringjs.io/tutorials/fundamentals/pojo

**flexbox 가지고 놀기**
Ref https://d2.naver.com/helloworld/8540176

**웹 접근성 진단 도구 NULI**
Ref https://nuli.navercorp.com/education/tools

**좋은 코드란?**
Ref https://jbee.io/etc/what-is-good-code/

**wanted events**

- 저명한(!) 프론트엔드 개발자 분들과 어깨를 나란히 하는 우리 코치님도 강연하시는!
- Ref https://www.wanted.co.kr/events/livetalk20
- 또 코테 😣
- Ref https://www.wanted.co.kr/events/scofe2021

---

## 😎 마무리

우테코를 시작한지 벌써 한 달이나 지났다. 다음주부터는 백/프론트 격일 등교를 시작한다. 정신이 없는 건지 어쩐지도 모르겠다.

페어와 더욱 솔직한 이야기들을 할 수 있어서 좋다. 홍수같이 쏟아드는 정보들 정신 차리고 따라잡자! 😵
