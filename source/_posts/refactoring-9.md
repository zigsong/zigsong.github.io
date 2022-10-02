---
title: 리팩터링 9장
date: 2022-04-14 21:49:26
tags: refactoring
thumbnailImage: https://i.imgur.com/kAvAwok.jpg
---

데이터 조직화

<!-- more -->

---

## 9.1 변수 쪼개기

역할이 둘 이상인 변수가 있다면 쪼개야 한다. 역할 하나당 변수 하나다.

### 절차

1. 변수를 선언한 곳과 값을 처음 대입하는 곳에서 변수 이름을 바꾼다.
2. 가능하면 이때 불변으로 선언한다.
3. 이 변수에 두 번째로 값을 대입하는 곳 앞까지의 모든 참조(이 변수가 쓰인 곳)를 새로운 변수 이름으로 바꾼다
4. 두 번째 대입 시 변수를 원래 이름으로 다시 선언한다.
5. 테스트한다.
6. 반복한다. 매 반복에서 변수를 새로운 이름으로 선언하고 다음번 대입 때까지의 모든 참조를 새 변수명으로 바꾼다. 이 과정을 마지막 대입까지 반복한다.

### 예시

```jsx
function distanceTravelled(scenario, time) {
  let result;
  let acc = scenario.primaryForce / scenario.mass; // ⬅️
  let primaryTime = Math.min(time, scenario.delay);
  result = 0.5 * acc * primaryTime * primaryTime;
  let secondaryTime = time - scenario.delay;
  if (secondaryTime > 0) {
    let primaryVelocity = acc * scenario.delay;
    acc = (scenario.primaryForce + scenario.secondaryForce) / scenario.mass; // ⬅️
    result +=
      primaryVelocity * secondaryTime +
      0.5 * acc * secondaryTime * secondaryTime;
  }
  return result;
}
```

`acc` 변수에 값이 두 번 대입되는 부분을 쪼개보자

```jsx
function distanceTravelled(scenario, time) {
  let result;
  const primaryAcceleration = scenario.primaryForce / scenario.mass; // ✅
  let primaryTime = Math.min(time, scenario.delay);
  result = 0.5 * primaryAcceleration * primaryTime * primaryTime; // ✅
  let secondaryTime = time - scenario.delay;
  if (secondaryTime > 0) {
    let primaryVelocity = primaryAcceleration * scenario.delay; // ✅
    const secondaryAcceleration =
      (scenario.primaryForce + scenario.secondaryForce) / scenario.mass; // ✅
    result +=
      primaryVelocity * secondaryTime +
      0.5 * secondaryAcceleration * secondaryTime * secondaryTime; // ✅
  }
  return result;
}
```

---

## 9.2 필드 이름 바꾸기

데이터 구조는 프로그램을 이해하는 데 큰 역할을 한다. 클래스에서 게터와 세터 메서드의 이름은 레코드 구조체의 필드 이름만큼 중요하다.

### 절차

1. 레코드의 유효 범위가 제한적이라면 필드에 접근하는 모든 코드를 수정한 후 테스트한다. 이후 단계는 필요 없다.
2. 레코드가 캡슐화되지 않았다면 우선 레코드를 캡슐화한다.
3. 캡슐화된 객체 안의 private 필드명을 변경하고, 그에 맞게 내부 메서드들을 수정한다.
4. 테스트한다.
5. 생성자의 매개변수 중 필드와 이름이 겹치는 게 있다면 함수 선언 바꾸기로 변경한다.
6. 접근자들의 이름도 바꿔준다.

### 예시

```jsx
const organiztaion = { name: "애크미 구스베리", country: "GB" };
```

`name`을 `title`로 바꿔보자. `organization` 레코드를 클래스로 캡슐화한 뒤, 입력 데이터 구조를 내부 데이터 구조와 분리하자.

```jsx
class Organization {
  constructor(data) {
    this._title = data.title;
    this._country = data.country;
  }

  get title() {
    return this._title;
  }

  set title(aString) {
    this._title = aString;
  }

  get country() {
    return this._country;
  }

  set country(aCountryCode) {
    this._country = aCountryCode;
  }
}

const organization = new Organization({
  title: "애크미 구스베리",
  country: "GB",
});
```

---

## 9.3 파생 변수를 질의 함수로 바꾸기

가변 데이터의 유효 범위는 가능한 한 좁혀야 한다.

그 방법 중 하나로, 값을 쉽게 계산해낼 수 있는 변수들을 모두 제거한다. 다만 예외가 있는데, 새로운 데이터 구조를 생성하는 변형 연산이라면 그대로 두는 것도 좋다.

1. 데이터 구조를 감싸며 그 데이터에 기초하여 계산한 결과를 속성으로 제공하는 객체
2. 데이터 구조를 받아 다른 데이터 구조로 변환해 반환하는 함수

### 절차

1. 변수 값이 갱신되는 지점을 모두 찾는다. 필요하면 변수 쪼개기를 활용해 각 갱신 지점에서 변수를 분리한다.
2. 해당 변수의 값을 계산해주는 함수를 만든다.
3. 해당 변수가 사용되는 모든 곳에 어서션을 추가하여 함수의 계산 결과가 변수의 값과 같은지 확인한다.
4. 테스트한다.
5. 변수를 읽는 코드를 모두 함수 호출로 대체한다.
6. 테스트한다.
7. 변수를 선언하고 갱신하는 코드를 죽은 코드 제거하기로 없앤다.

### 예시

```jsx
class ProductionPlan {
  // ...
  get production() {
    return this._production;
  }

  applyAdjustment(anAdjustment) {
    this._adjustments.push(anAdjustment);
    this._production += anAdjustment.amount;
  }
}
```

조정 값 `adjustment`를 적용하는 과정에서 직접 관련이 없는 누적 값 `production`까지 갱신하고 있다. (데이터 중복) 누적 값을 매번 갱신하지 않고 계산해보자.

```jsx
class ProductionPlan {
  // ...
  get production() {
    return this._adjustments.reduce((sum, a) => sum + a.amount, 0);
  }

  applyAdjustment(anAdjustment) {
    this._adjustments.push(anAdjustment);
  }
}
```

---

## 9.4 참조를 값으로 바꾸기

객체(데이터 구조)를 다른 객체(데이터 구조)에 중첩하면 내부 객체를 참조 혹은 값으로 취급할 수 있다. 참조로 다루는 경우에는 내부 객체는 그대로 둔 채 그 객체의 속성만 갱신하며, 값으로 다루는 경우에는 새로운 속성을 담은 객체로 기존 내부 객체를 통째로 대체한다.

필드를 값으로 다룬다면 내부 객체의 클래스를 수정하여 값 객체(Value Object)로 만들 수 있다. 값 객체는 불변이기 때문에 대체로 자유롭게 활용하기 좋다.

하지만 특정 객체를 여러 객체에서 공유하고자 한다면, 그래서 공유 객체의 값을 변경했을 때 이를 관련 객체 모두에 알려줘야 한다면 공유 객체를 참조로 다뤄야 한다.

### 절차

1. 후보 클래스가 불변인지, 혹은 불변이 될 수 있는지 확인한다.
2. 각각의 세터를 하나씩 제거한다.
3. 이 값 객체의 필드들을 사용하는 동치성 비교 메서드를 만든다.

### 예시

생성 시점에는 전화번호가 올바로 설정되지 못한 사람(`Person`) 객체가 있다.

```jsx
class Person {
  constructor() {
    this._telephoneNumber = new TelephoneNumber();
  }

  get officeAreaCode() {
    return this._telephoneNumber.areaCode;
  }

  set officeAreaCode(arg) {
    this._telephoneNumber.areaCode = arg;
  }

  get officeNumber() {
    return this._telephoneNumber.number;
  }

  set officeNumber(arg) {
    this._telephoneNumber.number = arg;
  }
}

class TelephoneNumber {
  get areaCode() {
    return this._areaCode;
  }

  set areaCode(arg) {
    this._areaCode = arg;
  }

  get number() {
    return this._number;
  }

  set number(arg) {
    this._number = arg;
  }
}
```

1. 전화번호를 불변으로 만들고,
2. 필드들의 세터만 제거한다.
3. 전화번호를 ‘값’ 객체로 인정받기 위해 동치성 메서드를 만든다.

```jsx
class Person {
  constructor() {
    this._telephoneNumber = new TelephoneNumber();
  }

  get officeAreaCode() {
    return this._telephoneNumber.areaCode;
  }

  set officeAreaCode(arg) {
    this._telephoneNumber = new TelephoneNumber(arg, this.officeNumber);
  }

  get officeNumber() {
    return this._telephoneNumber.number;
  }

  set officeNumber(arg) {
    this._telephoneNumber = new TelephoneNumber(this.officeAreaCode, arg);
  }
}

class TelephoneNumber {
  constructor(areaCode, number) {
    this._areaCode = areaCode;
    this._number = number;
  }

  // getter와 setter들...

  equals(other) {
    if (!(other instanceof TelephoneNumber)) return false;
    return this.areaCode === other.areaCode && this.number === other.number;
  }
}
```

---

## 9.5 값을 참조로 바꾸기

하나의 데이터 구조 안에 논리적으로 똑같은 제3의 데이터 구조를 참조하는 레코드가 여러 개 있을 때가 있다. 논리적으로 같은 데이터를 물리적으로 복제해 사용할 때 가장 크게 문제되는 상황은 그 데이터를 갱신해야 할 때다. 이런 상황이라면 복제된 데이터들을 모두 참조로 바꿔주는 게 좋다.

값을 참조로 바꾸면 엔티티 하나당 객체도 단 하나만 존재하게 되는데, 그러면 보통 이런 객체들을 한데 모아놓고 클라이언트들의 접근을 관리해주는 일종의 저장소가 필요하다.

### 절차

1. 같은 부류에 속하는 객체들을 보관할 저장소를 만든다.
2. 생성자에서 이 부류의 객체들 중 특정 객체를 정확히 찾아내는 방법이 있는지 확인한다.
3. 호스트 객체의 생성자들을 수정하여 필요한 객체를 이 저장소에서 찾도록 한다. 하나 수정할 때마다 테스트한다.

### 예시

```jsx
class Order {
  constructor(data) {
    this._number = data.number;
    this._customer = new Customer(data.customer);
  }

  get customer() {
    return this._customer;
  }
}

class Customer {
  constructor(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}
```

이런 방식으로 생성한 고객 객체는 값이기 때문에, 고객 ID가 123인 주문을 다섯 개 생성한다면 독립된 고객 객체가 다섯 개 만들어진다. 이 중 하나를 수정하더라도 나머지 네 개에는 반영되지 않는다.

저장소 객체를 만들고, 고객 객체를 값으로 변경해보자.

```jsx
let _repositoryData;

export function initialize() {
  _repositoryData = {};
  _repositoryData.customers = new Map();
}

export function registerCustomer(id) {
  if (!_repositoryData.customers.has(id)) {
    _repositoryData.customers.set(id, new Customer(id))''
  }
  return findCustomer(id);
}

export function findCustomer(id) {
  return _repositoryData.customers.get(id);
}

class Order {
  constructor(data) {
    this._number = data.number;
    this._customer = registerCustomer(data.customer);
  }

  get customer() {
    return this._customer;
  }
}
```

이 예에서는 특정 고객 객체를 참조하는 첫 번째 주문에서 해당 고객 객체를 생성했다. 또 다른 방법으로, 고객 목록을 미리 다 만들어서 저장소에 저장해놓고 주문 정보를 읽을 때 연결해줄 수도 있다.

---

## 9.6 매직 리터럴 바꾸기

매직 리터럴(magic literal)이란 소스 코드에 (보통은 여러 곳에) 등장하는 일반적인 리터럴 값을 말한다. 매직 리터럴보다는, 코드 자체가 뜻을 분명하게 드러내는 게 좋다. 상수를 정의하고 숫자 대신 상수를 사용하면 된다.

상수가 특별한 비교 로직에 주로 쓰이는 경우에는 상수값 그대로를 사용하기보다는 함수 호출로 바꿀 수도 있다.

### 방법

1. 상수를 선언하고 매직 리터럴을 대입한다.
2. 해당 리터럴이 사용되는 곳을 모두 찾는다.
3. 찾은 곳 각각에서 리터럴이 새 상수와 똑같은 의미로 쓰였는지 확인하여, 같은 의미라면 상수로 대체한 후 테스트한다.
