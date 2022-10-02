---
title: 리팩터링 11장 - 1
date: 2022-05-14 10:16:07
tags: refactoring
thumbnailImage: https://i.imgur.com/kAvAwok.jpg
---

API 리팩터링 - 1

<!-- more -->

---

## 11.1 질의 함수와 변경 함수 분리하기

겉보기 부수효과가 있는 함수와 없는 함수는 명확히 구분하는 것이 좋다. 질의 함수(읽기 함수)는 모두 부수효과가 없어야 한다. 이를 ‘명령-질의 분리’라고도 한다.

### 절차

1. 대상 함수를 복제하고 질의 목적에 충실한 이름을 짓는다.
2. 새 질의 함수에서 부수효과를 모두 제거한다.
3. 정적 검사를 수행한다.
4. 원래 함수(변경 함수)를 호출하는 곳을 모두 찾아낸다. 호출하는 곳에서 반환 값을 사용한다면 질의 함수를 호출하도록 바꾸고, 원래 함수를 호출하는 코드를 바로 아래 줄에 새로 추가한다. 하나 수정할 때마다 테스트한다.
5. 원래 함수에서 질의 관련 코드를 제거한다.
6. 테스트한다.

### 예시

```jsx
// before
function alertForMiscreant(people) {
  for (const p of people) {
    if (p === "조커") {
      setOffAlarms(); // 변경 함수
      return "조커"; // 질의 함수
    }
    if (p === "사루만") {
      setOffAlarms();
      return "사루만";
    }
  }
  return "";
}
```

```jsx
// after
function findMiscreant(people) {
  for (const p of people) {
    if (p === "조커") {
      return "조커";
    }
    if (p === "사루만") {
      return "사루만";
    }
  }
  return "";
}

const found = findMiscreant(people);
alertForMiscreant(people);

function alertForMiscreant(people) {
  for (const p of people) {
    if (p === "조커") {
      setOffAlarms();
      return;
    }
    if (p === "사루만") {
      setOffAlarms();
      return;
    }
  }
  return;
}
```

---

## 11.2 함수 매개변수화하기

두 함수의 로직이 아주 비슷하고 단지 리터럴 값만 다르다면, 그 다른 값만 매개변수로 받아 처리하는 함수 하나로 합쳐서 중복을 없앨 수 있다.

### 절차

1. 비슷한 함수 중 하나를 선택한다.
2. 함수 선언 바꾸기로 리터럴들을 매개변수로 추가한다.
3. 이 함수를 호출하는 곳 모두에 적절한 리터럴 값을 추가한다.
4. 테스트한다.
5. 매개변수로 받은 값을 사용하도록 함수 본문을 수정한다. 하나 수정할 때마다 테스트한다.
6. 비슷한 다른 함수를 호출하는 코드를 찾아 매개변수화된 함수를 호출하도록 하나씩 수정한다. 하나 수정할 때마다 테스트한다.

### 예시

```jsx
// before
function baseCharge(usage) {
  if (usage < 0) return usd(0);
  const amount =
    bottomBand(usage) * 0.03 + middleBand(usage) * 0.05 + topBand(usage) * 0.07;
  return usd(amount);
}

function bottomBand(usage) {
  return Math.min(usage, 100);
}

function middleBand(usage) {
  return usage > 100 ? Math.min(usage, 200) - 100 : 0;
}

function topBand(usage) {
  return usage > 200 ? usage - 200 : 0;
}
```

```jsx
// after
function withinBand(usage, bottom, top) {
  return usage > bottom ? Math.min(usage, top) - bottom : 0;
}

function baseCharge(usage) {
  if (usage < 0) return usd(0);
  const amount =
    withinBand(usage, 0, 100) * 0.03 +
    withinBand(usage, 100, 200) * 0.05 +
    withinBand(usage, 200, Infinity) * 0.07;
  return usd(amount);
}
```

---

## 11.3 플래그 인수 제거하기

플래그 인수란 호출되는 함수가 실행할 로직을 호출하는 쪽에서 선택하기 위해 전달하는 인수다.

```jsx
function bookConcert(aCustomer, isPremium) {
  if (isPremium) {
    // 프리미엄 예약용 로직
  } else {
    // 일반 예약용 로직
  }
}

bookConcert(aCustomer, true);
```

플래그 인수를 사용하면, 호출할 수 있는 함수들이 무엇이고 어떻게 호출해야 하는지를 이해하기 어려워진다. 플래그 인수가 있으면 함수들의 기능 차이가 잘 드러나지 않는다.

플래그 인수를 제거하면 코드가 깔끔해짐은 물론 프로그래밍 도구에도 도움을 준다. 코드 분석 도구는 프리미엄 로직 호출과 일반 로직 호출의 차이를 더 쉽게 파악할 수 있게 된다.

### 절차

1. 매개변수로 주어질 수 있는 값 각각에 대응하는 명시적 함수들을 생성한다.
2. 원래 함수를 호출하는 코드들을 모두 찾아서 각 리터럴 값에 대응되는 명시적 함수를 호출하도록 수정한다.

### 예시

```jsx
// before
aShipment.deliveryDate = deliveryDate(anOrder, true);
aShipment.deliveryDate = deliveryDate(anOrder, false);

function deliveryDate(anOrder, isRush) {
  if (isRush) {
    // rush일 때 호출할 로직
  } else {
    // rush가 아닐 때 호출할 로직
  }
}
```

```jsx
// after
function rushDeliveryDate(anOrder) {
  // rush일 때 호출할 로직
}

function regularDeliveryRate(anOrder) {
  // rush가 아닐 때 호출할 로직
}

aShipment.deliveryDate = rushDeliveryDate(anOrder);
aShipment.deliveryDate = regularDeliveryRate(anOrder);
```

---

## 11.4 객체 통째로 넘기기

레코드를 통째로 넘기면 변화에 대응하기 쉽다. 함수가 더 다양한 데이터를 사용하도록 바뀌어도 매개변수 목록은 수정할 필요가 없다. 그리고 매개변수 목록이 짧아져서 일반적으로는 함수 사용법을 이해하기 쉬워진다.

하지만 함수가 레코드 자체에 의존하기를 원치 않을 때, 특히 레코드와 함수가 서로 다른 모듈에 속한 상황이라면 이 리팩터링을 수행하지 않는다.

한편, 한 객체가 제공하는 기능 중 항상 똑같은 일부만을 사용하는 코드가 많다면, 그 기능만 따로 묶어서 클래스로 추출할 수도 있다.

### 절차

1. 매개변수들을 원하는 형태로 받는 빈 함수를 만든다.
2. 새 함수의 본문에서는 원래 함수를 호출하도록 하며, 새 매개변수와 원래 함수의 매개변수를 매핑한다.
3. 정적 검사를 수행한다.
4. 모든 호출자가 새 함수를 사용하게 수정한다. 하나씩 수정하며 테스트하자.
5. 호출자를 모두 수정했다면 원래 함수를 인라인한다.
6. 새 함수의 이름을 적절히 수정하고 모든 호출자에 반영한다.

### 예시

일일 최저/최고 기온이 난방 계획에서 정한 범위를 벗어나는지 확인하는 실내온도 모니터링 시스템을 생각해보자.

```jsx
const low = aRoom.daysTempRange.low;
const high = aRoom.daysTempRange.high;
if (!aPlan.withinRange(low, high)) {
  alerts.push("방 온도가 지정 범위를 벗어났습니다.");
}

// HeatingPlan 클래스
withinRange(bottom, top) {
  return (bottom >= this._temperatureRange.low)
        && (top <= this._temperatureRange.high);
}
```

최저/최고 기온을 뽑아내어 인수로 건내는 대신 범위 객체를 통째로 건넬 수도 있다.

```jsx
// HeatingPlan 클래스
withinRange(aNumberRange) {
  return (aNumberRange.low >= this._temperatureRange.low) &&
         (aNumberRange.high <= this._temperatureRange.high);
}

if (!aPlan.withinRange(aRoom.daysTempRange)) {
  alerts.push("방 온도가 지정 범위를 벗어났습니다.");
}
```

---

## 11.5 매개변수를 질의 함수로 바꾸기

매개변수 목록은 함수의 동작에 변화를 줄 수 있는 일차적인 수단이다. 매개변수 목록은 중복은 피하는 게 좋으며 짧을수록 이해하기 쉽다.

피호출 함수가 스스로 ‘쉽게’ 결정할 수 있는 값을 매개변수로 건네는 것도 일종의 중복이다. 호출하는 쪽은 간소하게 만드는 것이 좋다. 즉, 책임 소재를 피호출 함수로 옮긴다.

매개변수 제거 시 피호출 함수에 원치 않는 의존성이 생긴다면 매개변수를 질의 함수로 바꾸지 말아야 한다. 제거하려는 매개변수의 값을 다른 매개변수에 질의해서 얻을 수 있다면 안심하고 질의 함수로 바꿀 수 있다.

이때 대상 함수가 참조 투명해야 한다. 즉, 함수에 똑같은 값을 건네 호출하면 항상 똑같이 동작해야 한다.

### 절차

1. 필요하다면 대상 매개변수의 값을 계산하는 코드를 별도 함수로 추출해놓는다.
2. 함수 본문에서 대상 매개변수로의 참조를 모두 찾아서 그 매개변수의 값을 만들어주는 표현식을 참조하도록 바꾼다. 하나 수정할 때마다 테스트한다.
3. 함수 선언 바꾸기로 대상 매개변수를 없앤다.

### 예시

```jsx
// before
class Order {
  get finalPrice() {
    const basePrice = this.quantity * this.itemPrice;
    let discountLevel;
    if (this.quantity > 100) discountLevel = 2;
    else discountLevel = 1;
    return this.discountedPrice(basePrice, discountLevel);
  }

  discountedPrice(basePrice, discountLevel) {
    switch (discountLevel) {
      case 1:
        return basePrice * 0.95;
      case 2:
        return basePrice * 0.9;
    }
  }
}
```

```jsx
// after
class Order {
  get finalPrice() {
    const basePrice = this.quantity * this.itemPrice;
    return this.discountedPrice(basePrice);
  }

  get discountLevel() {
    return this.quantity > 100 ? 2 : 1;
  }

  discountedPrice(basePrice) {
    switch (this.discountLevel) {
      case 1:
        return basePrice * 0.95;
      case 2:
        return basePrice * 0.9;
    }
  }
}
```

---

## 11.6 질의 함수를 매개변수로 바꾸기

함수 안에서 전역 변수를 참조한다거나, 제거하길 원하는 원소를 참조하는 경우가 있다. 이때는 해당 참조를 매개변수로 바꿔 해결할 수 있다. 참조를 풀어내는 책임을 호출자로 옮기는 것이다.

이런 상황 대부분은 코드의 의존 관계를 바꾸려 할 때, 예컨대 대상 함수가 더 이상 (매개변수화하려는) 특정 원소에 의존하길 원치 않을 때 일어난다.

이 리팩터링의 단점은, 호출자가 복잡해진다는 것이다. 이 문제는 결국 책임 소재를 프로그램의 어디에 배정하느냐의 문제로 귀결되는 것으로, 항상 정답이 있는 것은 아니다.

### 절차

1. 변수 추출하기로 질의 코드를 함수 본문의 나머지 코드와 분리한다.
2. 함수 본문 중 해당 질의를 호출하지 않는 코드들을 별도 함수로 추출한다.
3. 방금 만든 변수를 인라인하여 제거한다.
4. 원래 함수도 인라인한다.
5. 새 함수의 이름을 원래 함수의 이름으로 고쳐준다.

### 예시

```jsx
// HeatingPlan 클래스
get targetTemperature() {
  if (thermostat.selectedTemperature > this._max) return this._max;
  else if (thermostat.selectedTemperature < this._min) return this._min;
  else return thermostat.selectedTemperature;
}

// 호출자
if (thePlan.targetTemperature > thermostat.currentTemperature) setToHeat();
else if (thePlan.targetTemperature < thermostat.currentTemperature) setToCool();
else setOff();
```

`targetTemperature()` 메서드와 전역 객체인 `thermostat`사이의 의존성을 끊어보자.

```jsx
// HeatingPlan 클래스
targetTemperature(selectedTemperature) {
  if (selectedTemperature > this._max) return this._max;
  else if (selectedTemperature < this._min) return this._min;
  else return selectedTemperature;
}

// 호출자
if (thePlan.targetTemperature(thermostat.selectedTemperature) > thermostat.currentTemperature) setToHeat();
else if (thePlan.targetTemperature(thermostat.selectedTemperature) < thermostat.currentTemperature) setToCool();
else setOff();
```

`targetTemperature()` 메서드와 전역 객체인 `thermostat`사이의 결합을 제거했을 뿐 아니라, `HeatingPlan` 클래스를 불변으로 만들었다. 모든 필드가 생성자에서 설정되며, 필드를 변경할 수 있는 메서드는 없다.
