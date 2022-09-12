---
title: 리팩터링 1장 - 2
date: 2022-02-03 22:43:36
tags: refactoring
---

리팩터링: 첫 번째 예시

<!-- more -->

<img src="/images/thumbnails/refactoring-thumbnail.jpeg" />

---

## 1.6 계산 단계와 포맷팅 단계 분리하기

앞서 작성한 코드를 두 단계로 나눌 것이다.

1. `statement()`에 필요한 데이터를 처리하기
2. 앞서 처리한 결과를 텍스트나 HTML로 표현하기

그 다음 함수를 추출한다. 이때 계산 관련 코드는 전부 `statement()` 함수로 모으고 `renderPlainText()`는 `data` 매개변수로 전달된 데이터만 처리하게 만든다.

```jsx
function statement(invoice, plays) {
  const statementData = {};
  // 고객 데이터, 공연 정보를 중간 데이터로 옮김
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances;

  // 필요 없어진 인수 삭제
  return renderPlainText(statementData, plays);
}

function renderPlainText(data, plays) {
  // ...
  function totalAmount() { ... }
  function totalVolumeCredits() { ... }
  function usd(aNumber) { ... }
  function volumeCreditsFor(aPerformance) { ... }
  function playFor(aPerformance) { ... }
  function amountFor(aPerformance) { ... }
}
```

연극 제목도 중간 데이터 구조에서 가져온다.

```jsx
function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformances);

  return renderPlainText(statementData, plays);

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    return result;
  }
}
```

이제 `playFor()` 함수와 `amountFor()` 함수를 `statement()`로 옮겨준다.

```jsx
function statement(invoice, plays) {
  // ...

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    // 중간 데이터에 연극 정보를 저장
    result.play = playFor(result);
    result.amount = amountFor(result);

    return result;
  }

  // renderPlainText()의 중첩 함수였던 playFor()를 statement()로 옮김
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) { ... }
}
```

`renderPlainText()` 안에서 `playFor()`와 `amountFor()`를 호출하던 부분을 중간 데이터를 사용하도록 바꿔주고, 같은 방식으로 다른 중첩 함수들도 옮겨주었다.

다음으로는 반복문을 파이프라인으로 바꾼다.

```jsx
function totalAmount(data) {
  // for 반복문을 파이프라인으로 바꿈
  return data.performances.reduce((total, p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
  // for 반복문을 파이프라인으로 바꿈
  return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}
```

이제 `statement()`에 필요한 데이터 처리에 해당하는 코드를 모두 별도 함수로 빼낸다.

```jsx
function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

// 중간 데이터 생성을 전담
function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);

  return result;

  function enrichPerformance(aPerformance) { ... }
  function playFor(aPerformance) { ... }
  function amountFor(aPerformance) { ... }
  function volumeCreditsFor(aPerformance) { ... }
  function totalAmount() { ... }
  function totalVolumeCredits() { ... }
}
```

마지막으로, 단계별로 분리한 코드를 별도 파일에 저장한 후 HTML 버전을 작성해준다.

---

## 1.7 중간 점검: 두 파일(과 두 단계)로 분리됨

- statement.js

  ```jsx
  import createStatementData from "./createStatementData.js";

  function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
  }

  function renderPlainText(data, plays) {
    // ...
  }

  function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
  }

  function renderHtml(data) {
    // ...
  }

  function usd(aNumber) {
    // ...
  }
  ```

- createStatementData.js

  ```jsx
  export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);

    return result;

    function enrichPerformance(aPerformance) { ... }
    function playFor(aPerformance) { ... }
    function amountFor(aPerformance) { ... }
    function volumeCreditsFor(aPerformance) { ... }
    function totalAmount() { ... }
    function totalVolumeCredits() { ... }
  }
  ```

함수를 추출하면서 코드량은 많이 늘었지만, 모듈화를 통해 전체 로직을 구성하는 요소 각각이 더 뚜렷해지고 계산하는 부분과 출력 형식을 다루는 부분이 분리됐다.

---

## 1.8 다형성을 활용해 계산 코드 재구성하기

조건부 로직을 다형성으로 바꿀 수 있다. 여기서는 공연료 계산기를 만들 것이다. 공연 관련 데이터를 계산하는 함수들로 구성된 클래스를 만들어 상속 계층을 정의한다.

```jsx
function enrichPerformance(aPerformance) {
  const calculator = new PerformanceCalculator(aPerformance);
  const result = Object.assign({}, aPerformance);
  result.play = playFor(result);
  // ...
}

class PerformanceCalculator {
  constructor(aPerformance) {
    this.performance = aPerformance;
  }
}
```

그리고 계산기 클래스의 생성자에 함수 선언 바꾸기를 적용하여 연극의 레코드를 계산기로 전달한다.

```jsx
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
}
```

이제 함수들을 계산기로 옮겨준다.

```jsx
function enrichPerformance(aPerformance) {
  const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
  const result = Object.assign({}, aPerformance);
  result.play = playFor(result);
  // amountFor() 대신 계산기의 함수 이용
  result.amount = calculator.amount;
  // volumeCreditsFor() 대신 계산기의 함수 이용
  result.volumeCredits = calculator.volumeCredits;
  // ...
}

class PerformanceCalculator {
  // amountFor() 함수의 코드를 계산기 클래스로 복사
  get amount() {
    let result = 0;

    switch (this.play.type) {
      case "tragedy":
      // ...

    }
    return result;
  }

  // volumeCreditsFor() 함수의 코드를 계산기 클래스로 복사
  get volumeCredits() { ... }

}
```

상속 받은 서브클래스들을 활용하여 공연료 계산기를 다형성 버전으로 만들어준다. 타입 코드를 서브클래스로 바꾸고, 생성자를 팩터리 함수로 바꾼다.

```jsx
function enrichPerformance(aPerformance) {
  // 생성자 대신 팩터리 함수 이용
  const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
  // ...
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch(aPlay.type) {
    case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
    case "comedy": return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error('...');
  }
}

class TragedyCalculator extends PerformanceCalculator { ... }

class ComedyCalculator extends PerformanceCalculator { ... }
```

그러면 조건부 로직을 다형성으로 바꿔줄 수 있다.

```jsx
class TragedyCalculator {
  get amount() {
    // ...
  }
}

class PerformanceCalculator {
  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        throw "오류 발생"; // 비극 공연료는 TragedyCalculator를 이용하도록 유도
      case "comedy":
      // ...
    }
    return result;
  }
}
```

장르를 통틀어서 공통되는 부분은 일반적인 경우를 기본으로 삼아 슈퍼클래스에 남겨두고, 장르마다 달라지는 부분은 필요할 때 오버라이드하게 만들어주었다.

---

## 1.9 상태 점검: 다형성을 활용하여 데이터 생성하기

두 개의 함수 `amountFor()`와 `volumeCreditsFor()`의 조건부 로직을 생성 함수 하나로 옮겨 같은 타입의 다형성을 기반으로 실행되는 함수를 모듈화했다.

계산기가 중간 데이터 구조를 채우게 한 지금의 코드와 달리 `createStatementData()`가 계산기 자체를 반환하게 구현해도 되지만, 여기서는 다형성 계산기를 사용한다는 사실을 숨기기보다는 중간 데이터 구조를 이용하는 방법을 보여주는 방식으로 작성했다.

---

## 1.10 마치며

이번 장에서 살펴본 리팩터링 기법들은 다음과 같다

- 함수 추출하기
- 변수 인라인하기
- 함수 옮기기
- 조건부 로직을 다형성으로 바꾸기

이번 장의 예제에서는 리팩터링을 크게 세 단계로 진행했다.

1. 원본 함수를 중첩 함수 여러 개로 나누기
2. 단계 쪼개기 - 계산 코드와 출력 코드를 분리했다.
3. 계산 로직을 다형성으로 표현했다.

> 💡 좋은 코드를 가늠하는 확실한 방법은 ‘얼마나 수정하기 쉬운가’다.

리팩터링을 효과적으로 하는 핵심은, 단계를 잘게 나눠야 더 빠르게 처리할 수 있고, 코드는 절대 깨지지 않으며, 이러한 작은 단계들이 모여서 상당히 큰 변화를 이룰 수 있다는 사실을 깨닫는 것이다.
