---
title: 우테코 3주차 기록
date: 2021-02-20 10:14:29
tags: woowacourse
---

우테코 3주차 기록

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 페어 프로그래밍

- 새로운 페어가 매칭되었다. 데일리 미팅 다른 조 크루다.
- ‘티케’인데, 자꾸 닉네임을 ‘피케’라고 부르게 되어서 (도대체 왤까 😞) 처음에 미안했다.
- 새로운 것을 시도하기 망설이거나 코드를 적당히 알고만 넘어가는 나와 달리, 페어는 명쾌하게 답을 알 때까지 공부하고, 함께 토론하고, 탐구하는 것을 좋아한다.
- 처음엔 조금 어색했지만 분명히 배워야 할 자세다. 헤어지기 전까지 페어의 좋은 습관을 내 학습 방법에도 잘 묻혀 놔야겠다.
- 페어는 자신이 제안하면서도 정확하게는 몰랐던 점을 밤 늦게까지 공부해서 나에게 설명해 준다. 정말 신뢰 가는 동료라고 생각한다.
- 페어 따라서 코치들을 조금 더 괴롭혀야겠다…고 생각은 드는데, 아직까지 어색하다! 지난 1년 간 많이 소심이가 된 것 같다.
- 매일매일 (주말에도) 짬짬이 같이 코딩하고, 회고한다. 매일 회고는 사실 쪼금 귀찮았는데, 다음날만 되어도 전날 한 작업과 새롭게 배운 내용을 금방 까먹는 것을 보니 회고가 필요하겠다. 이끌어준 페어에게 감사하다 😊
- 코치가 말했던 구조도도 페어가 열심히 그려줬다. 아직은 낯설고 어렵지만 차차 발전해 나가겠지?

---

## 로수타

잡담(?)이 많았는데, 기억 나는 내용 하나. 우테코 10개월 동안 꼭 배웠으면 좋겠는 것은, 누군가 javascript를 물어봤을 때, 쉬지 않고 계속해서 떠들 내용이 있을 만큼 그 언어에 애정이 있었으면 좋겠다고 하셨다.

사실 vanilla js를 잘 알기도 전에 react.js를 시작하여 그냥 대충대충 페이지를 찍어내는 데 급급했었는데, 훌륭한 개발자까진 아니더라도 좋은 개발자가 되기 위해서, 그리고 자신 있게 ‘javascript 개발자’라고 말하기 위해서는 누구한테나 정말 필요한 자세인 것 같다. 늘 염두에 두어야겠다.

---

## 테코톡

DOM & BOM 주제의 첫주차 테코톡을 진행헀다. 첫 주자라 긴장되고 떨렸을 텐데, 생각지 못했던 내용들까지 세심하고 꼼꼼하게 준비하여 테코톡 발표를 진행하셨다.

새롭게 알게 되거나, 헷갈렸던 내용 정리!

- DOM에서 `document` 객체는 html 파일마다 한 개씩 새로 생성된다.
- HTMLCollection
  - `getElementsByTagName`, `getElementsByClassName` 사용 시 리턴되는 형태다.
  - 문서 내에 순서대로 정렬된 노드의 컬렉션으로, 유사배열이다.
  - HTML 엘리먼트의 children 프로퍼티에 접근하는 것이다.
  - 배열 구조분해나 `Array.from()`으로 HTMLCollection으로부터 배열을 생성해서 배열 내장 메서드(`.map`, `.forEach` 등)를 사용할 수 있다.
  - HTMLCollection은 배열의 인덱스로 접근할 수 있고, 객체의 속성에 접근하듯이 .[속성명]의 방식으로 접근도 가능하다.
- NodeList
  - `element.childNodes` 프로퍼티나 `document.querySelectorAll` 메서드로 반환되는 노드의 모음이다.
  - `Node.childNodes`의 NodeList는 라이브 콜렉션으로, DOM의 변경사항을 실시간으로 반영한다. 반면 `document.querySelectorAll()`의 NodeList는 정적 콜렉션으로, DOM이 변경되어도 collection의 내용에는 영향을 주지 않는다.
  - HTMLCollection과 마찬가지로 유사배열이지만, `forEach`는 기본적으로 사용할 수 있다.

**Ref** https://devsoyoung.github.io/posts/js-htmlcollection-nodelist

\+ 크롬 개발자 도구에서 javascript 성능을 확인하는 방법을 알았다. 😮 신기
<img src="01.png" width="400px" />

---

## 자동차 미션 공통 피드백

- 리뷰어와의 적극적인 토론 및 리액션하기. 이모지도 리액션이다 👀

- class와 instance의 의미 생각해보기. ES6에 class가 도입되어 무조건 class를 쓰기보다는, 객체를 생성할 필요가 없는 경우에는 함수를 쓰는 것도 고려해 보자.

- 단수/복수 네이밍에 유의하자.

- 인덱스를 통해 찾는 방법은, 추후에 변경될 여지가 많이 있기 때문에 지양해야 한다.

- 객체의 데이터는 직접 접근하기보다는 요청하자. getter를 활용해도 좋다.

- 빠른 실패(early return)를 사용하면 코드를 간결하고 직관적으로 작성할 수 있다.

- 하나의 함수는 한 가지 기능만 수행하도록 하자. validation에서 alert 메시지를 넣는 것은 함수가 2가지 기능을 하게 된다.

  - 특히 `isValid` 등 is가 붙은 것은 ‘flag 변수’라고 하는데, flag만 하지 않고 alert까지 하는 것은 좋지 않은 패턴이다.

- `filter`, `map` 등 javascript의 chaining methods를 활용하면 코드가 더욱 간결해지고 가독성이 높아진다.

- 구조 분해 할당을 많이 활용하자! DOM을 가져올 때도 사용할 수 있다

  ```jsx
  const [thisBtn, thatBtn, otherBtn] = document.getElementsByTagName("button");
  ```

- 일반 for문 대신 Array method(forEach 등)를 사용하자. for문에는 인덱싱의 조건 등 실수할 수 있는 여지가 들어가기 때문이다.

- no-prototype-builtins(eslint) - `Object.prototype`의 builtin으로 제공되는 메서드를 객체에서 직접 호출하지 않도록 하자.

---

## 자동차~로또 미션 공통 피드백

- 페이지에 접속하면 처음 입력해야 하는 input에 autofocus를 두는 것과 같은, 사용자를 고려한 프로그래밍을 하자.
- 리뷰어의 피드백에서 한 발자국 더 나아가, 스스로 고민해보고 코드를 작성하는 습관을 들이자.
- 도메인 로직에 포함할 것과, 포함하지 않을 것을 구분하자.
  - `getRandomNumber`와 같은 순수함수는 다른 객체에서도 쓸 수 있게 분리하거나,
  - 객체에서만 필요한 것인데, `this`를 사용할 필요가 없다면 static으로 선언하는 방법도 있다.
- 잠재우기 말고, 결과를 지연시켜 보여주는 것
  - javascript로 코드 작성 시 단순한 잠재우기를 하는 경우는 거의 없다. 단순히 지연시키는 동작은 큰 의미가 없다.
  - 강아지한테 밥 주고 “1초 기다려!”하는 명령형 코드에는 문제가 있다. 이벤트를 실행할 때마다 계속 하드코딩을 해야 하며, 강아지가 10마리까지 늘어나면 모두 기다리라고 명령해야 하는 셈이다. (즉 sleep 코드만 늘어나게 된다.)
  - 선언형 코드로 작성하자 😮
- 휴먼 에러를 줄이기
  - for문에 변수를 선언하고 돌리는 형태는 너무 많은 작업이 필요하다. → 휴먼에러가 될 수 있다
  - index만을 순회하는 for loop은 거의 사용할 일이 없다
  - `Array`의 메소드를 활용하자
- 함수에 이벤트 행위를 굳이 적을 필요는 없다.
  - `click` 이벤트에 대한 콜백함수의 네이밍은, `handleRestartButtonClick()`보다는 `handleRestartButton()`과 같은 형태로 쓰는 것이 좋다.
  - 다만 `on`, `handle` 등의 prefix가 붙는 것은 좋다.
  - 나중에 click을 할 수도, enter를 칠 수도, 모바일은 touch를 할 수도 있다는 점을 고려하자.

---

## 📚 배우기

### javascript의 Object

- 객체는 자신만의 속성을 갖고 있으며, 다른 것과 식별이 가능해야 한다.
- 원시값 역시 객체처럼 취급할 수 있다. 일부에서는 자바스크립트는 모든 것이 객체라고도 한다.
- 원시값은 call by value이지만, 객체는 call by reference다. 즉 객체는 참조값으로 전달되며, 서로 동일한 참조값을 갖고 있을 때 같은 객체라고 볼 수 있다.
- 객체의 속성을 참조할 때 해당 객체에 속성이 참조되어 있지 않다면 생성자 함수의 prototype 속성에서 찾는다.
- 모든 객체는 `Object()`를 상속 받기 때문에, 프로토타입 체이닝을 통해 거슬러 올라간 `Object()`의 prototype에서도 속성을 찾을수 없다면 `undefined`를 반환한다.
- 함수는 스코프 체인을 통해 변수를 찾는다. 스코프 체인은 코드가 작성된 위치에 따라 생성된다.
- 객체의 어떤 속성에 접근하려할 때 그 객체 자체 속성 뿐만 아니라 객체의 프로토타입, 그 프로토타입의 프로토타입 등 프로토타입 체인의 종단에 이를 때까지 그 속성을 탐색하며, 그 종점은 null이다.
- 함수 안에서 사용하는 `this` 키워드는 함수를 포함한 객체를 참조한다. 이때 `this`의 값은 함수가 호출되는 컨텍스트에 따라 결정된다.
- `this`는 객체 멤버의 컨텍스트가 바뀌는 경우에도 언제나 정확한 값을 사용하게 해준다.
- 한 번 작성된 함수는 다른 컨텍스트에서 실행되어도 원래의 스코프에 접근할 수 있으며, 이를 이용하여 클로저를 작성할 수 있다.

👉 javascript는 클래스 기반이 아닌, 프로토타입을 가진 객체 기반의 언어
👉 프로토타입 - 객체지향 언어가 아닌 javascript가 객체지향과 비슷한 특징들을 가질 수 있게 해준다.

DOM object를 가져오기 위해 사용했던 `document.querySelector('div')`와 같은 코드도, `Document` 객체의 인스턴스가 가진 메소드를 활용한 것이다.
웹페이지가 로딩될 때 `Document` 인스턴스가 만들어지고, 전체 웹 페이지 구조와 컨텐츠 그리고 URL같은 기능들을 제공하는 `document`가 호출되는 것이다.
그동안 사용해왔던 다른 내장 객체/API(`Array`, `Math` 등등)들도 마찬가지! 😮

### Prototype & Mixin

- ES2015부터 class 키워드를 지원하기 시작했으나, syntactic sugar일 뿐이며 javascript는 여전히 프로토타입 기반의 언어다.
- javascript에 “메소드”라는건 없다. 하지만 javascript는 객체의 속성으로 함수를 지정할 수 있고 속성 값을 사용하듯 쓸 수 있다.
- javascript에서 함수는 속성을 가질 수 있다. 모든 함수에는 prototype이라는 특수한 속성이 있다.

```jsx
function doSomething() {}
doSomething.prototype.foo = "bar"; // add a property onto the prototype
var doSomeInstancing = new doSomething();
console.log(doSomeInstancing);
```

<img src="02.png" width="400px" />

```jsx
doSomeInstancing.prop = "some value"; // add a property onto the object
console.log(doSomeInstancing);
```

<img src="03.png" width="400px" />

```jsx
console.log(doSomeInstancing.foo); // bar
console.log(doSomeInstancing.prop); // some value
console.log(doSomething.foo); // undefined
console.log(doSomething.prototype.foo); // bar
console.log(doSomething.prop); // undefined
```

javascript 함수는 `prototype` 프로퍼티를 가지고 있다.
new 연산자를 통해 생성한 인스턴스는 `__proto__`라는 프로퍼티를 갖고 있으며, 이는 constructor의 `prototype`을 참조한다. 이때`__proto__`는 생략이 가능하도록 구현되어 있다.

이때 `prototype`은 객체 인스턴스가 갖고 있는 것이 아니라, `Object` 즉 객체 그 자체가 갖고 있는 속성이다.
즉 `doSomething.prototype`은 가능하지만, `doSomeInstancing.prototype`은 불가능하다.
여기서 `doSomeInstancing`은 `__proto__`를 타고 올라가 `doSomething`의 `foo` 속성에 접근할 수 있다.
인스턴스의 `__proto__`는 생략할 수 있기 때문에, `doSomeInstancing`을 통해 `doSomething`의 prototype 속성에 접근하려면, 단순하게 그 속성값을 작성해주면 된다. (여기서는 `foo`)
프로토타입 체이닝을 통해 자동으로 거슬러 올라가 찾아주기 때문이다.

😯 이때 prototype에 정의한 모든 것은 모든 인스턴스가 효과적으로 공유한다는 뜻이며, 심지어 프로토타입의 일부를 나중에 변경하다고 해도 이미 생성되어 있는 인스턴스는 필요한 경우 그 변경 사항에 접근할 수 있다.

또한 `doSomething`의 인스턴스인 `doSomeInstancing`에서 생성한 속성 `prop`은 `doSomething`에서는 찾을 수 없다.

```jsx
function Graph() {
  this.vertexes = [];
  this.edges = [];
}

Graph.prototype = {
  addVertex: function (v) {
    this.vertexes.push(v);
  },
};
```

`console.log(g)`의 실행 결과는 다음과 같다.
<img src="04.png" width="400px" />

g는 `vertexes` 와 `edges`를 속성으로 가지는 객체이며, `g.addVertex()`를 실행하면, 프로토타입 체이닝을 통해 `Graph`의 `addVertex()`를 호출할 수 있다.

ES5에는 `Object.create()`라는 방식도 도입되었다고 하지만, 여기선 패스!
대신 ES6에서 등장한 `class`를 통해 객체를 생성할 수 있다.

Mixin은 javascript에는 없는 클래스 복사 기능을 흉내 낸 것이다. Mixin은 특정 행동을 실행해주는 메서드를 제공하는데 단독으로 쓰이지 않고, 다른 객체에 행동을 더해주는 용도로 사용된다.

```jsx
// mixin
let someMixin = {
  greets() {
    alert(`Hello ${this.name}`);
  },
  study() {
    alert(`${this.name} is now studying`);
  }
  play() {
    alert(`${this.name} is playing drum`);
  }
};

// create object
class Person {
  constructor(name) {
    this.name = name;
  }
}

// copy method
Object.assign(Person.prototype, someMixin);

new Person("Zig").play(); // Zig is playing drum
```

**Ref**

- https://developer.mdozilla.org/ko/docs/Learn/JavaScript/Objects/Basics
- https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/Object-oriented_JS
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
- https://ko.javascript.info/mixins

### DOM 조작과 reflow

`DocumentFragment`를 사용하여 DOM 조각을 새롭게 생성하는 것이, 기존의 `createElement`보다 성능이 좋다. append를 하더라도 reflow가 발생하지 않기 때문이다.
`DocumentFragment`는 DOM tree에 영향을 미치지 않는다. (따라서 reflow가 발생할 때에도 document에 영향을 미치지 않는다!)

위 내용을 공부하며 `innerText`와 `innerHTML`에 더해 `textContent`라는 것도 알게 되었다.
`innerText`는 사람이 읽을 수 있는 요소만 가리키며, `innerHTML`은 말 그대로 html을 가져온다.

Node 인터페이스에서 사용되는 `textContent`는 노드의 모든 자식을 주어진 문자열로 이루어진 하나의 텍스트 노드로 대치한다.

**Ref**

- https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
- https://developer.mozilla.org/ko/docs/Web/API/Node/textContent
- https://gist.github.com/paulirish/5d52fb081b3570c81e3a
- https://csstriggers.com/
- https://developers.google.com/speed/docs/insights/browser-reflow?csw=1
- https://johnresig.com/blog/dom-documentfragments/
- https://medium.com/@maddydeep28/dom-creation-and-manipulation-tips-and-tricks-df4707ede27c

### isNaN vs Number.isNaN

`isNaN`은 값이 `Number` 타입이 아니거나 `Number` 타입으로 변환될 수 없을 때 `true`를 리턴한다. (값을 먼저 `Number`로 형변환한다)

```jsx
isNaN = function (value) {
  Number.isNaN(Number(value));
};
```

`Number.isNaN`은 값이 `NaN` 타입인지 확인한다. 기존부터 존재한 `isNaN`의 조금 더 엄격한 버전이다.
😯 `NaN` 값은 산술 연산이 정의되지 않은 결과 또는 표현할 수 없는 결과를 도출하면 생성된다.

```jsx
isNaN("zigsong"); // true
isNaN(NaN); // true
isNaN(undefined); // true
isNaN("zig" / "song"); // true

Number.isNaN("zigsong"); // false
Number.isNaN(NaN); // true
Number.isNaN(undefined); // false
Number.isNaN("zig" / "song"); // true
```

따라서 `Number.isNaN`의 인자에 `Number.parseInt` 등으로 감싼 `NaN` 타입을 넣어주면, true를 리턴하게 된다.

```jsx
Number.isNaN(Number.parseInt("zigsong")); // true
```

**Ref**

- https://stackoverflow.com/questions/33164725/confusion-between-isnan-and-number-isnan-in-javascript
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN

---

## 기타

### CustomEvent

- 새로운 CustomEvent를 생성하고, dispatch를 할 수 있다.
- model과 view, controller의 역할을 명확히 구분할 수 있는 방법이다.

**Ref** https://developer.mozilla.org/ko/docs/Web/API/CustomEvent/CustomEvent

### checked

- type checkbox인 input의 checked T/F값은 `$element.checked`로 가져올 수 있다.

### getter, setter

- class 내부에서 getter를 설정하여 프로퍼티를 가져오는 코드를 명시할 수 있다.

### #private

- 2019년에 나온 ES7부터, javascript class에 `#`(해시) prefix를 붙여 private 메소드 또는 프로퍼티를 선언할 수 있다.

### form event 처리

- html form에서의 click과 enter 모두 `submit`이라는 이벤트 하나로 묶을 수 있다. 그동안 eventListener에 아무 생각 없이 `click`만 주구장창 써왔던 나 자신 반성하자😬

### html attribute

- input 태그에 `required`, `min`, `max` 값 등을 넣어 자체적으로 제공되는 validation을 활용할 수 있다.
- `$element.toggleAttribute`라는 내장 메소드를 활용하여 해당 DOM 객체의 속성을 넣었다 뺐다할 수 있다. 😮

### semantic html

- `div`를 남발하지 말고, `section` 등의 태그가 필요하진 않은지 생각하자.

---

## 🤔 생각해보기

### YAGNI

- 발음은 마치 ‘야근이’…같지만 신선한 개념이다.
- ‘You aren’t gonna need it’이란 뜻으로, 프로그래머가 필요하다고 간주할 때까지 기능을 추가하지 않는 것이 좋다는 익스트림 프로그래밍(XP)의 원칙이다.

**Ref** https://ko.wikipedia.org/wiki/YAGNI

### 디자인 패턴을 사용하는 이유

- 패턴만을 생각하고 있으면 패턴에 종속되어 버리는 경우가 있다. 이는 패턴을 위해서, 끼워 맞추기 형태로 문제를 해결하는 것이다.
- 프레임워크나 디자인 패턴보다는, 주어진 문제를 해결하는 것이 중요하다.
- EX (Extreme Programming)
- 아무도 유지보수하지 않는 패턴을 작성하는 것을 지양하자.
- 설레발 주도 개발(Hype Driven Development - HDD)은 당신의 프로젝트에 다양한 방법으로 영향을 끼친다.
- 레거시를 위한 레거시에 종속되는 경우룰 방지하자.

## Why you should not modify a JavaScript object prototype

- built-in Objects prototypes을 변경하지 말자

  ```jsx
  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
  };
  ```

- 라이브러리가 제공하는 자체 메소드와 충돌이 날 위험이 있고, 추후에 위와 같이 customize한 메소드의 동작을 변경해야 할 때 유지보수가 힘들어진다.

- 필요한 함수는 따로 분리하여, import해서 사용하자

**Ref** https://flaviocopes.com/javascript-why-not-modify-object-prototype/

### 2021 우아한 형제들 경력 개발자 인터뷰

**Ref** https://woowabros.github.io/interview/2021/02/16/2021-interview.html

---

## etc

- 뭔가 html, css를 많이 다룬 한 주였다. 그런 것까지 프론트엔드 개발자가 하나하나 다 뜯어봐야 하나 😞 했었는데, css도 잘하는 백엔드 개발자가 있다면?! 생각이 바뀌었다.
- FE library가 어느 정도 정비되고 있다. 준비해주신 분들, 관리자를 하겠다고 나선 분들 모두 대단하다. 좋은 정보들을 주고 받기 위해 나도 신경써서 다음 관리자로 지원해봐야겠다. 😄
- 학습 로그를 작성하는 방법을 배웠다. 또 할 일이 늘어난 것 같아 쪼금 벅차지만 지속적인 공부와 스스로의 발전을 위해서, ~~(그리고 추후의 포트폴리오를 위해서)~~ 필요한 일인 것 같다.
  지금 진행하고 있는 미션의 모든 단계가 끝나면 작성해 봐야겠다.
- 지식 산업, 특히 프로그래밍에 끝은 없다. 정해진 기간 내에 결과를 낼 수 있어야 한다. 질이 나쁜 코드라도, 일단은 동작하도록 만드는 것이 중요하다. 리팩토링과 클린 코드는 그 이후에 진행하자.
  처음에 100% 만족하지 않더라도 일단 동작하는 코드로 데드라인까지 보내고, 그 후에 차차 개선해 나가면 된다.
- 회고는 감정적인 소통과, 학습(반성)을 통한 개선이 모두 이루어지는 것이 좋다. 또 페어에게 좋은 말만 해주기보다는 좋았던 점, 잘못된 부분이 적절히 섞인다면 서로의 성장에 더욱 도움이 될 것이다.
- 코치 준이 알려준 4mat 학습선호도 설문을 해봤다. what/why/how/if인가? 4가지로 나뉜다고 하는데, 생각보다 극단적으로 답을 잘 고를 수 있었다 😬 뭐든 극단적인 사람… 내 결과가 궁금하다!
- 주말에 한 크루가 같이 놀자고 연락을 줬다. 친구 졸업식(..은 아니고 사진 촬영)에 갔다가 노느라고 아쉽게 참여하지 못했지만 😢 담에 약속 잡고 또 놀았으면 좋겠다!

---

## 😎 마무리

사실 너무너무 정신없고 바쁘게 지나갔던 한 주다. 어째 매주 이럴 것 같지만! 쉴 틈 없이 작업하는 와중에도 토이 프로젝트와 스터디, 친구들을 모두 포기하지 못하는 사람… 😑
또 머리하면서 코딩했다. 근데 잠 좀 일찍 자자. 아무튼 유튜브는 전보다 덜 보는 것 같은데, 매일 늦게 자니 얼굴하고 몸이 구려졌다 😬 하루에 당충전도 너무 많이 하고…
오래, 멀리 가기 위해서 몸 정신 다 신경 써서 챙겨야 할 듯하다.
