---
title: 리팩터링 8장 - 2
date: 2022-04-07 22:02:04
tags: refactoring
---

기능 이동 - 2

<!-- more -->

---

<img src="/images/thumbnails/refactoring-thumbnail.jpeg" />

---

## 8.5 인라인 코드를 함수 호출로 바꾸기

함수는 동작의 목적을 말해주기 때문에 코드를 이해하기 쉽게 해주고, 중복을 없애준다.

이미 존재하는 함수와 똑같은 일을 하는 인라인 코드를 발견하면 해당 코드를 함수 호출로 대체할 수 있다. 특히 라이브러리가 제공하는 함수로 대체할 수 있다면 훨씬 좋다.

### 절차

1. 인라인 코드를 함수 호출로 대체한다.
2. 테스트한다.

### 예시

```jsx
// before
let appliesToMass = false;
for (const s of states) {
  if (s === "MA") appliesToMass = true;
}
```

```jsx
// after
appliesToMass = states.includes("MA");
```

---

## 8.6 문장 슬라이드하기

하나의 데이터 구조를 이용하는 문장들은 한데 모여 있어야 좋다. 문장 슬라이드하기 리팩터링으로 이런 코드들을 한데 모아둘 수 있다. 관련 있는 코드들은 명확히 구분되는 함수로 추출하는 것이 좋다.

### 절차

1. 코드 조각(문장들)을 이동할 목표 위치를 찾는다. 코드 조각의 원래 위치와 목표 위치 사이의 코드들을 훑어보면서, 조각을 모으고 나면 동작이 달라지는 코드가 있는지 살핀다.
2. 코드 조각을 원래 위치에서 잘라내어 목표 위치에 붙여 넣는다.
3. 테스트한다.

### 예시

코드 조각을 슬라이드할 때는 1) 무엇을 슬라이드할지와 2) 슬라이드할 수 있는지 여부를 확인해야 한다.

```jsx
// before
const pricingPlan = retrievePricingPlan();
const order = retreiveOrder();
const baseCharge = pricingPlan.base;
let charge;
const chargePerUnit = pricingPlan.unit;
const units = order.units;
let discount;
charge = baseCharge + units * chargePerUnit;
let discountableUnits = Math.max(units - pricingPlan.discountThreshold, 0);
discount = discountableUnits * pricingPlan.discountFactor;
if (order.isRepeat) discount += 20;
charge = charge - discount;
chargeOrder(charge);
```

슬라이드가 안전한 지를 판단하려면 관련된 연산이 무엇이고 어떻게 구성되는지를 완벽히 이해해야 한다.

부수효과가 있는 코드를 슬라이드하거나 부수효과가 있는 코드를 건너뛰어야 한다면 훨씬 신중해야 한다. 또 상태 갱신에 특히나 신경 써야 하기 때문에 상태를 갱신하는 코드 자체를 최대한 제거하는 게 좋다.

슬라이드 후 테스트가 실패했을 때 가장 좋은 대처는 더 작게 슬라이드해보는 것이다.

### 더 읽을거리

**문장 교환하기**라는 이름의 거의 똑같은 리팩터링 방법은 인접한 코드 조각을 이동하지만, 문장 하나짜리 조각만 취급한다. 따라서 이동한 조각과 건너뛸 조각 모두 단일 문장으로 구성된 문장 슬라이드로 생각해도 된다.

---

## 8.7 반복문 쪼개기

종종 반복문 하나에서 두 가지 일을 수행하는 모습을 보게 된다. 하지만 이렇게 하면 반복문을 수정할 때마다 두 가지 일 모두를 잘 이해하고 진행해야 한다.

반복문을 분리하면 사용하기가 쉬워진다. 한 가지 값만 계산하는 반복문이라면 그 값만 곧바로 반환할 수 있다.

### 절차

1. 반복문을 복제해 두 개로 만든다.
2. 반복문이 중복되어 생기는 부수효과를 파악해서 제거한다.
3. 테스트한다.
4. 완료됐으면, 각 반복문을 함수로 추출할지 고민해본다.

### 예시

```jsx
// before
let youngest = people[0] ? people[0].age : Infinity;
let totalSalary = 0;
for (const p of people) {
  if (p.age < youngest) youngest = p.age;
  totalSalary += p.salary;
}

return `최연소: ${youngest}, 총 급여: ${totalSalary}`;
```

```jsx
// after
let youngest = people[0] ? people[0].age : Infinity;
let totalSalary = 0;
for (const p of people) {
  totalSalary += p.salary;
}

for (const p of people) {
  if (p.age < youngest) youngest = p.age;
}

return `최연소: ${youngest}, 총 급여: ${totalSalary}`;
```

### 더 가다듬기

각 반복문을 각각의 함수로 추출하고, 반복문을 파이프라인으로 바꿀 수 있다

```jsx
function totalSalary() {
  return people.reduce((total, p) => total + p.salary, 0);
}

function youngestAge() {
  return Math.min(...people.map((p) => p.age));
}
```

---

## 8.8 반복문을 파이프라인으로 바꾸기

컬렉션 파이프라인을 이용하면 처리 과정을 일련의 연산으로 표현할 수 있다.

### 절차

1. 반복문에서 사용하는 컬렉션을 가리키는 변수를 하나 만든다.
2. 반복문의 첫 줄부터 시작해서, 각각의 단위 행위를 적절한 컬렉션 파이프라인 연산으로 대체한다. 이때 컬렉션 파이프라인 연산은 1에서 만든 반복문 컬렉션 변수에서 시작하여, 이전 연산의 결과를 기초로 연쇄적으로 수행된다. 하나를 대체할 때마다 테스트한다.
3. 반복문의 모든 동작을 대체했다면 반복문 자체를 지운다.
