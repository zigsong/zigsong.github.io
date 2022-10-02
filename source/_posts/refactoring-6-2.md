---
title: 리팩터링 6장 - 2
date: 2022-03-18 16:33:50
tags: refactoring
thumbnailImage: https://i.imgur.com/kAvAwok.jpg
---

기본적인 리팩터링 - 2

<!-- more -->

---

## 6.7 변수 이름 바꾸기

명확한 프로그래밍의 핵심은 이름짓기다. 간단한 변수의 경우 대체로 파악이 쉽지만, 함수 호출 한 번으로 끝나지 않고 값이 영속되는 필드라면 신중하게 이름을 지어야 한다.

### 절차

1. 폭넓게 쓰이는 변수라면 변수 캡슐화하기를 고려한다.
2. 이름을 바꿀 변수를 참조하는 곳을 모두 찾아서, 하나씩 변경한다.
3. 테스트한다.

### 예시

```jsx
// before
let tpHd = "untitled";

// 변수를 읽기만 하는 경우
result += `<h1>${tpHd}</h1>`;
// 값을 수정하는 경우
tpHd = obj["articleTitle"];
```

```jsx
// after: getter와 setter를 통해 변수 캡슐화하기
result += `<h1>${title()}</h1>`;

setTitle(obj["articleTitle"]);

let _title = "untitled";

function title() {
  return _title;
}

function setTitle(arg) {
  _title = arg;
}
```

---

## 6.8 매개변수 객체 만들기

데이터 뭉치를 데이터 구조로 묶으면 데이터 사이의 관계가 명확해진다. 나아가 함수가 이 데이터 구조를 받게 하면 매개변수 수가 줄어든다

### 절차

1. 적당한 데이터 구조가 아직 마련되어 있지 않다면 새로 만든다.
2. 테스트한다.
3. 함수 선언 바꾸기로 새 데이터 구조를 매개변수로 추가한다.
4. 테스트한다.
5. 함수 호출 시 새로운 데이터 구조 인스턴스를 넘기도록 수정한다. 하나씩 수정할 때마다 테스트한다.
6. 기존 매개변수를 사용하던 코드를 새 데이터 구조의 원소를 사용하도록 바꾼다.
7. 다 바꿨다면 기존 매개변수를 제거하고 테스트한다.

### 예시

```jsx
// before
// 데이터
const station = {
  name: "ZB1",
  readings: [
    { temp: 47, time: "2016-11-19 09:10" },
    { temp: 53, time: "2016-11-19 09:20" },
    { temp: 58, time: "2016-11-19 09:30" },
    { temp: 53, time: "2016-11-19 09:40" },
    { temp: 51, time: "2016-11-19 09:50" },
  ],
};

// 함수
function readingsOutsideRange(station, min, max) {
  return station.readings.filter((r) => r.temp < min || r.temp > max);
}

// 호출문
alerts = readingsOutsideRange(
  station,
  operatingPlan.temperatureFloor,
  operatingPlan.temperatureCeiling
);
```

```jsx
// after
class NumberRange {
  constructor(min, max) {
    this._data = { min: min, max: max };
  }
  get min() {
    return this._data.min;
  }
  get max() {
    return this._data.max;
  }
}

function readingsOutsideRange(station, range) {
  return station.readings.filter(
    (r) => r.temp < range.min || r.temp > range.max
  );
}

const range = new NumberRange(
  operatingPlan.temperatureFloor,
  operatingPlan.temperatureCeiling
);

alerts = readingsOutsideRange(station, range);
```

---

## 6.9 여러 함수를 클래스로 묶기

클래스는 데이터와 함수를 하나의 공유 환경으로 묶은 후, 다른 프로그램 요소와 어우러질 수 있도록 그중 일부를 외부에 제공한다. 공통 데이터를 중심으로 긴밀하게 엮여 작동하는 함수 무리는 클래스 하나로 묶을 수 있다. 여러 함수를 클래스로 묶으면 클라이언트가 객체의 핵심 데이터를 변경할 수 있고, 파생 객체들을 일관되게 관리할 수 있다.

### 절차

1. 함수들이 공유하는 공통 데이터 레코드를 캡슐화한다.
2. 공통 레코드를 사용하는 함수 각각을 새 클래스로 옮긴다.
3. 데이터를 조작하는 로직들은 함수로 추출해서 새 클래스로 옮긴다.

### 예시

```jsx
// before
// 클라이언트 1
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
// 클라이언트 2
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
const taxableCharge = Math.max(0, base - taxThreshold(aReading.year));
```

```jsx
// after
class Reading {
  constructor(data) {
    this._customer = data.customer;
    this._quantity = data.quantity;
    this._month = data.month;
    this._year = data.year;
  }

  get customer() {
    return this._customer;
  }
  get quantity() {
    return this._quantity;
  }
  get month() {
    return this._month;
  }
  get year() {
    return this._year;
  }

  get baseCharge() {
    return baseRate(this.month, this.year) * this.quantity;
  }

  get taxableCharge() {
    return Math.max(0, this.baseCharge - taxThreshold(this.year));
  }
}

// 클라이언트 3
const rawReading = acquireReading();
const aReading = new Reading(rawReading);
const basicChargeAmount = aReading.baseCharge;
const taxableCharge = aReading.taxableCharge;
```

---

## 6.10 여러 함수를 변환 함수로 묶기

데이터를 입력받아서 여러 가지 정보를 도출하는 작업들을 한데로 모아두면 검색과 갱신을 일관된 장소에서 할 수 있고 로직 중복도 막을 수 있다. 변환 함수를 사용하면 원본 데이터를 입력받아서 필요한 정보를 모두 도출한 뒤, 각각을 출력 데이터의 필드에 넣어 반환한다.

> 💡 원본 데이터가 코드 안에서 갱신될 때는 클래스로 묶는 것이 좋다.

### 절차

1. 변환할 레코드를 입력받아서 값을 그대로 반환하는 변환 함수를 만든다.
2. 묶을 함수 중 함수 하나를 골라서 본문 코드를 변환 함수로 옮기고, 처리 결과를 레코드에 새 필드로 기록한다. 그런 다음 클라이언트 코드가 이 필드를 사용하도록 수정한다.
3. 테스트한다.
4. 나머지 관련 함수도 위 과정에 따라 처리한다.

### 예시

```jsx
// before
// 클라이언트 1
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
// 클라이언트 2
const aReading = acquireReading();
const base = baseRate(aReading.month, aReading.year) * aReading.quantity;
const taxableCharge = Math.max(0, base - taxThreshold(aReading.year));
// 클라이언트 3
const aReading = acquireReading();
const basicChargeAmount = calculateBaseCharge(aReading);

function calculateBaseCharge(aReading) {
  return baseRate(aReading.month, aReading.year) * aReading.quantity;
}
```

```jsx
// after
// 클라이언트 1, 3
const rawReading = acquireReading(); // 미가공 측정값
const aReading = enrichReading(rawReading);
const basicChargeAmount = aReading.baseCharge;
// 클라이언트 2
const rawReading = acquireReading(); // 미가공 측정값
const aReading = enrichReading(rawReading);
const taxableCharge = aReading.taxableCharge;

function enrichReading(original) {
  const result = _.cloneDeep(original);
  result.baseCharge = calculateBaseCharge(aReading);
  result.taxableCharge = Math.max(
    0,
    result.baseCharge - taxThreshold(result.year)
  );

  return result;
}
```

**👩‍🏫 주의할 점**
`enrichReading()` 처럼 정보를 추가해 반환할 때 원본 측정값 레코드는 변경하지 않아야 한다.

---

## 6.11 단계 쪼개기

서로 다른 두 대상을 한꺼번에 다루는 코드를 발견하면 각각을 별개 모듈로 나눌 수 있다. 이렇게 분리하는 가장 간편한 방법 하나는 동작을 연이은 두 단계로 쪼개는 것이다.

가장 대표적인 예는 컴파일러다. 컴파일 작업은 여러 단계가 순차적으로 연결된 형태로 분리되어 있다. 각 단계는 자신만의 문제에 집중하기 때문에 나머지 단계에 관해서는 자세히 몰라도 이해할 수 있다.

### 절차

1. 두 번째 단계에 해당하는 코드를 독립 함수로 추출한다.
2. 테스트한다.
3. 중간 데이터 구조를 만들어서 앞에서 추출한 함수의 인수로 추가한다.
4. 테스트한다.
5. 추출한 두 번째 단계 함수의 매개변수를 하나씩 검토한다. 그중 첫 번째 단계에서 사용되는 것은 중간 데이터 구조로 옮긴다. 하나씩 옮길 때마다 테스트한다.
6. 첫 번째 단계 코드를 함수로 추출하면서 중간 데이터 구조를 반환하도록 만든다.

### 예시

```jsx
// before
function priceOrder(product, quantity, shippingMethod) {
  const basePrice = product.basePrice * quantity;
  const discount =
    Math.max(quantity - product.discountThreshold, 0) *
    product.basePrice *
    product.discountRate;
  const shippingPerCase =
    basePrice > shippingMethod.discountThreshold
      ? shippingMethod.discountedFee
      : shippingMethod.feePerCase;
  const shippingCost = quantity * shippingPerCase;
  const price = basePrice - discount + shippingCost;

  return price;
}
```

```jsx
// after
function priceOrder(product, quantity, shippingMethod) {
  const priceData = calculatePricingData(product, quantity);
  return applyShipping(priceData, shippingMethod);
}

function calculatePricingData(product, quantity) {
  const basePrice = product.basePrice * quantity;
  const discount =
    Math.max(quantity - product.discountThreshold, 0) *
    product.basePrice *
    product.discountRate;
  return { basePrice, quantity, discount };
}

function applyShipping(priceData, shippingMethod) {
  const shippingPerCase =
    priceData.basePrice > shippingMethod.discountThreshold
      ? shippingMethod.discountedFee
      : shippingMethod.feePerCase;
  const shippingCost = priceData.quantity * shippingPerCase;
  return priceData.basePrice - priceData.discount + shippingCost;
}
```

**👩‍🏫 험블 객체 패턴(Humble Object Pattern)**
명령줄 호출과 표준 출력에 쓰는 느리고 불편한 작업과 자주 테스트해야 할 복잡한 동작을 분리함으로써 테스트를 더 쉽게 수행하게 만든다
