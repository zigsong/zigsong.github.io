---
title: 리팩터링 7장
date: 2022-03-24 23:12:52
tags: refactoring
thumbnailImage: https://i.imgur.com/kAvAwok.jpg
---

캡슐화

<!-- more -->

---

모듈을 분리할 때는 각 모듈이 자신을 제외한 다른 부분에 드러내지 않아야 할 비밀을 잘 숨겨야 한다. 이때 레코드 캡슐화, 컬렉션 캡슐화, 기본형을 객체로 바꿔 캡슐화하는 방법 등이 많이 쓰인다.

클래스를 이용하면 내부 정보를 숨길 수 있을 뿐 아니라 위임 숨기기를 통해 클래스 사이의 연결 관계를 숨길 수도 있다. 알고리즘을 함수로 추출하여 구현을 캡슐화하는 방법도 있다.

---

## 7.1 레코드 캡슐화하기

가변 데이터를 저장할 때는 레코드보다 객체를 선호한다. 객체를 사용하면 어떻게 저장했는지를 숨긴 채 각각의 값을 서로 다른 메서드로 제공할 수 있다.

레코드 구조는 필드 이름을 노출하는 형태와 필드를 외부로부터 숨겨서 원하는 이름을 쓸 수 있는 형태 두 가지로 구분할 수 있다. 후자는 주로 라이브러리에서 해시(hash), 맵(map), 해시맵(hashmap), 딕셔너리(dictionary), 연관 배열(associative array) 등의 이름으로 제공한다.

### 절차

1. 레코드를 담은 변수를 캡슐화한다.
2. 레코드를 감싼 단순한 클래스로 해당 변수의 내용을 교체한다. 이 클래스에 원본 레코드를 반환하는 접근자도 정의하고, 변수를 캡슐화하는 함수들이 이 접근자를 사용하도록 수정한다.
3. 테스트한다.
4. 원본 레코드 대신 새로 정의한 클래스 타입의 객체를 반환하는 함수들을 새로 만든다.
5. 레코드를 반환하는 예전 함수를 사용하는 코드를 4에서 만든 새 함수를 사용하도록 바꾼다. 필드에 접근할 때는 객체의 접근자를 사용한다.
6. 클래스에서 원본 데이터를 반환하는 접근자와 원본 레코드를 반환하는 함수들을 제거한다.
7. 테스트한다.
8. 레코드의 필드도 데이터 구조인 중첩 구조라면 레코드 캡슐화하기와 컬렉션 캡슐화하기를 재귀적으로 적용한다.

### 예시: 간단한 레코드 캡슐화하기

```jsx
// before
const organization = { name: "에크미 구스베리", country: "GB" };

result += `<h1>${organization.name}</h1>`; // 읽기 예
organization.name = newName; // 쓰기 예
```

레코드를 캡슐화하는 목적은 변수 자체는 물론 그 내용을 조작하는 방식도 통제하기 위함이므로, 레코드를 클래스로 바꾼다.

```jsx
class Organization {
  constructor(data) {
    this._name = data.name;
    this._country = data.country;
  }

  set name(aString) {
    this._data.name = aString;
  }

  get name() {
    return this._data.name;
  }
}

const organization = new Organization({
  name: "에크미 구스베리",
  country: "GB",
});
function getOrganization() {
  return organization;
}

getOrganization().name = newName;
result += `<h1>${getOrganization().name}</h1>`;
```

### 예시: 중첩된 레코드 캡슐화하기

---

## 7.2 컬렉션 캡슐화하기

컬렉션 변수로의 접근을 캡슐화하면서 게터가 컬렉션 자체를 반환하도록 한다면, 그 컬렉션을 감싼 클래스가 눈치채지 못하는 상태에서 컬렉션의 원소들이 바뀌어버릴 수 있다. 컬렉션 게터가 원본 컬렉션을 반환하지 않게 만들어서 클라이언트가 실수로 컬렉션을 바꿀 가능성을 차단하는 것이 좋다.

내부 컬렉션을 직접 수정하지 못하게 막는 방법 중 하나로, 절대로 컬렉션 값을 반환하지 않게 할 수 있다. 컬렉션에 접근하려면 컬렉션이 소속된 클래스의 적절한 메서드를 반드시 거치게 하는 것이다.

또 다른 방법은 컬렉션을 읽기전용으로 제공할 수 있다. 프락시가 내부 컬렉션을 읽는 연산은 그대로 전달하고, 쓰기는 모두 막는 것이다.

가장 흔히 사용하는 방식은 아마도 컬렉션 게터를 제공하되 내부 컬렉션의 복제본을 반환하는 것이다. 복제본을 수정해도 캡슐화된 원본 컬렉션에는 아무런 영향을 주지 않는다.

여기서 중요한 점은 코드베이스에 일관성을 주는 것이다. 컬렉션 접근 함수의 동작 방식을 통일해야 한다.

### 절차

1. 아직 컬렉션을 캡슐화하지 않았다면 변수 캡슐화하기부터 한다.
2. 컬렉션에 원소를 추가/제거하는 함수를 추가한다.
3. 정적 검사를 수행한다.
4. 컬렉션을 참조하는 부분을 모두 찾는다. 컬렉션의 변경자를 호출하는 코드가 모두 앞에서 추가한 추가/제거 함수를 호출하도록 수정한다.
5. 컬렉션 게터를 수정해서 원본 내용을 수정할 수 없는 읽기전용 프락시나 복제본을 반환하게 한다.
6. 테스트한다.

### 예시

```jsx
// before
class Person {
  constructor(name) {
    this._name = name;
    this._courses = [];
  }

  get name() {
    return this._name;
  }
  get courses() {
    return this._courses;
  }
  set courses(aList) {
    this._courses = aList;
  }
}

class Course {
  constructor(name, isAdvanced) {
    this._name = name;
    this._isAdvanced = isAdvanced;
  }

  get name() {
    return this._name;
  }
  get isAdvanced() {
    return this._isAdvanced;
  }
}
```

모든 필드가 접근자 메서드로 보호받고 있으나, 세터를 이용해 수업 컬렉션을 통째로 설정한 클라이언트는 누구든 이 컬렉션을 마음대로 수정할 수 있다. 캡슐화가 깨지는 것이다.

```jsx
// after
class Person {
  // setter 제거

  get courses() {
    return this._courses.slice();
  }

  addCourse(aCourse) {
    this._courses.push(aCourse);
  }

  removeCourse(
    aCourse,
    fnIfAbsent = () => {
      throw new RangeError();
    }
  ) {
    const index = this._courses.indexOf(aCourse);
    if (index === -1) fnIfAbsent();
    else this._courses.splice(index, 1);
  }
}
```

---

## 7.3 기본형을 객체로 바꾸기

단순한 출력 이상의 기능이 필요해지는 순간 그 데이터를 표현하는 전용 클래스를 정의한다.

### 절차

1. 아직 변수를 캡슐화하지 않았다면 캡슐화한다.
2. 단순한 값 클래스를 만든다. 생성자는 기존 값을 인수로 받아서 저장하고, 이 값을 반환하는 게터를 추가한다.
3. 정적 검사를 수행한다.
4. 값 클래스의 인스턴스를 새로 만들어서 필드에 저장하도록 세터를 수정한다. 이미 있다면 필드의 타입을 적절히 변경한다.
5. 새로 만든 클래스의 게터를 호출한 결과를 반환하도록 게터를 수정한다.
6. 테스트한다.
7. 함수 이름을 바꾸면 원본 접근자의 동작을 더 잘 드러낼 수 있는지 검토한다.

### 예시

```jsx
// before
class Order {
  constructor(data) {
    this.priority = data.priority;
    // ...
  }
}

// 클라이언트
const highPriorityCount = orders.filter(
  (o) => "high" === o.priority || "rush" === o.priority
).length;
```

```jsx
// after
class Order {
  get priority() {
    return this._priority;
  }
  set priority(aString) {
    this._priority = new Priority(aString);
  }
  // ...
}

class Priority {
  constructor(value) {
    this._value = value;
  }
  toString() {
    return this._value;
  }
}

const highPriorityCount = orders.filter(
  (o) => "high" === o.priority.toString() || "rush" === o.priority.toString()
).length;
```

이렇게 하면 `Priority` 클래스를 새로운 동작을 담는 장소로 활용할 수 있게 된다

---

## 7.4 임시 변수를 질의 함수로 바꾸기

임시 변수를 사용하면 코드의 반복을 줄이고 값의 의미를 설명할 수도 있어 유용하다. 여기서 한 걸음 더 나아가 아예 함수로 만들어 사용하는 편이 나을 때가 많다.

변수 대신 함수로 만들어두면 비슷한 계산을 수행하는 다른 함수에서도 사용할 수 있어 코드 중복이 줄어든다. 특히 추출할 메서드들에 공유 컨텍스트를 제공하는 클래스 안에서 적용할 때 효과가 가장 크다.

### 절차

1. 변수가 사용되기 전에 값이 확실히 결정되는지, 변수를 사용할 때마다 계산 로직이 매번 다른 결과를 내지는 않는지 확인한다.
2. 읽기전용으로 만들 수 있는 변수는 읽기전용으로 만든다.
3. 테스트한다.
4. 변수 대입문을 함수로 추출한다.
5. 테스트한다.
6. 변수 인라인하기로 임시 변수를 제거한다.

### 예시

```jsx
// before
class Order {
  constructor(quantity, item) {
    this._quantity = quantity;
    this._item = item;
  }

  get price() {
    var basePrice = this._quantity * this._item.price;
    var discountFactor = 0.98;

    if (basePrice > 1000) discountFactor -= 0.03;
    return basePrice * discountFactor;
}
```

```jsx
// after
class Order {
  constructor(quantity, item) {
    this._quantity = quantity;
    this._item = item;
  }

  get price() {
    return this.basePrice * this.discountFactor;
  }

  get basePrice() {
    return this._quantity * this._item.price;
  }

  get discountFactor() {
    var discountFactor = 0.98;

    if (basePrice > 1000) discountFactor -= 0.03;
    return discountFactor;
  }
```

---

## 7.5 클래스 추출하기

메서드와 데이터가 너무 많은 클래스는 이해하기가 쉽지 않으니 잘 살펴보고 적절히 분리하는 것이 좋다. 함께 변경되는 일이 많거나 서로 의존하는 테이블들도 분리한다.

### 절차

1. 클래스의 역할을 분리할 방법을 정한다.
2. 분리될 역할을 담당할 클래스를 새로 만든다.
3. 원래 클래스의 생성자에서 새로운 클래스의 인스턴스를 생성하여 필드에 저장해둔다.
4. 분리될 역할에 필요한 필드들을 새 클래스로 옮긴다.
5. 메서드들도 새 클래스로 옮긴다. 이때 저수준 메서드, 즉 다른 메서드를 호출하기보다는 호출을 당하는 일이 많은 메서드부터 옮긴다.
6. 양쪽 클래스의 인터페이스를 살펴보면서 불필요한 메서드를 제거하고, 이름도 새로운 환경에 맞게 바꾼다.
7. 새 클래스를 외부로 노출할지 정한다. 노출하려거든 새 클래스에 참조를 값으로 바꾸기를 적용할지 고민해본다.

### 예시

```jsx
// before
class Person {
  get name() {
    return this._name;
  }
  set name(arg) {
    this._name = arg;
  }
  get telephoneNumber() {
    return `(${this.officeAreaCode}) ${this.officeNumber}`;
  }
  get officeAreaCode() {
    return this._officeAreaCode;
  }
  set officeAreaCode(arg) {
    this._officeAreaCode = arg;
  }
  get officeNumber() {
    return this._officeNumber;
  }
  set officeNumber(arg) {
    this._officeNumber = arg;
  }
}
```

```jsx
// after
class Person {
  constructor() {
    this._telephoneNumber = new TelephoneNumber();
  }

  get name() {
    return this._name;
  }
  set name(arg) {
    this._name = arg;
  }
  get telephoneNumber() {
    return this._telephoneNumber.toString();
  }
  get areaCode() {
    return this._telephoneNumber.areaCode;
  }
  set areaCode(arg) {
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
  toString() {
    return `(${this.areaCode}) ${this.number}`;
  }
}
```

---

## 7.6 클래스 인라인하기

클래스 인라인하기는 클래스 추출하기를 거꾸로 돌리는 리팩터링이다.

더 이상 제 역할을 못 해서 그대로 두면 안 되는 클래스는 인라인한다. 두 클래스의 기능을 지금과 다르게 배분하고 싶을 때도 클래스를 인라인한다.

### 절차

1. 소스 클래스의 각 public 메서드에 대응하는 메서드들을 타깃 클래스에 생성한다.
2. 소스 클래스의 메서드를 사용하는 코드를 모두 타깃 클래스의 위임 메서드를 사용하도록 바꾼다.
3. 소스 클래스의 메서드와 필드를 모두 타깃 클래스로 옮긴다.
4. 소스 클래스를 삭제하고 조의를 표한다.

### 예시

```jsx
// before
class TrackingInformation {
  // ...
  get shippingCompany() {
    return this._shippingCompany;
  }
  set shippingCompany(arg) {
    this._shippingCompany = arg;
  }
  get trackingNumber() {
    return this._trackingNumber;
  }
  set trackingNumber(arg) {
    this._trackingNumber = arg;
  }
  get display() {
    return `${this.shippingCompany}: ${this.trackingNumber}`;
  }
}

class Shipment {
  // ...
  get trackingInfo() {
    return this._trackingInformation.display;
  }
  get trackingInformation() {
    return this._trackingInformation;
  }
  set trackingInformation(aTrackingInformation) {
    this._trackingInformation = aTrackingInformation;
  }
}
```

`TrackingInformation`이 현재는 제 역할을 못 하고 있으니 `Shipment` 클래스로 인라인한다.

```jsx
class Shipment {
  get trackingInfo() {
    return `${this.shippingCompany}: ${this.trackingNumber}`;
  }
  get shippingCompany() {
    return this._shippingCompany;
  }
  set shippingCompany(arg) {
    this._shippingCompany = arg;
  }
  get trackingNumber() {
    return this._trackingNumber;
  }
  set trackingNumber(arg) {
    this._trackingNumber = arg;
  }
}
```

`TrackingInformation` 클래스는 삭제한다.

---

## 7.7 위임 숨기기

모듈화 설계를 제대로 하는 핵심은 캡슐화다. 캡슐화는 모듈들이 시스템의 다른 부분에 대해 알아야 할 내용을 줄여준다.

### 절차

1. 위임 객체의 각 메서드에 해당하는 위임 메서드를 서버에 생성한다.
2. 클라이언트가 위임 객체 대신 서버를 호출하도록 수정한다.
3. 모두 수정했다면, 서버로부터 위임 객체를 얻는 접근자를 제거한다.
4. 테스트한다.

### 예시

```jsx
// before
class Person {
  constructor(name) {
    this._name = name;
  }
  get name() { return this._name; }
  get department() { return this._department; }
  set department() { this._department = arg; }
}

class Department {
  get chargeCode() { return this._chargeCode; }
  set chargeCode() { this._chargeCode = arg; }
  get manager() { return this._manager; }
  set manager() { this._manager = arg; }
}

// 클라이언트
const manager = aPerson.department.manager;
```

클라이언트가 `Department` 클래스를 몰라도 되도록, `Person` 클래스에 간단한 위임 메서드를 만들어 의존성을 줄일 수 있다.

```jsx
// after
class Person {
  // ...
  get manager() {
    return this._department.manager;
  }
}

// 클라이언트
const manager = aPerson.manager;
```

---

## 7.8 중개자 제거하기

위임 메서드를 매번 추가하다 보면 서버 클래스는 그저 중개자 역할로 전락하여, 차라리 클라이언트가 위임 객체를 직접 호출하는 게 나을 수 있다.

### 절차

1. 위임 객체를 얻는 게터를 만든다.
2. 위임 메서드를 호출하는 클라이언트가 모두 이 게터를 거치도록 수정한다.
3. 모두 수정했다면 위임 메서드를 삭제한다.

### 예시

```jsx
// before
const manager = aPerson.manager;

class Person {
  // ...
  get manager() {
    return this._department.manager;
  }
}

class Department {
  // ...
  get manager() {
    return this._manager;
  }
}
```

```jsx
// after
class Person {
  // ...
  get department() {
    return this._department;
  }
  // 삭제
  // get manager() { return this._department.manager; }
}

// 클라이언트
const manager = aPerson.department.manager;
```

---

## 7.9 알고리즘 교체하기

메서드를 잘게 나누어 알고리즘을 간소화하자.

### 절차

1. 교체할 코드를 함수 하나에 모은다.
2. 이 함수만을 이용해 동작을 검증하는 테스트를 마련한다.
3. 대체할 알고리즘을 준비한다.
4. 정적 검사를 수행한다.
5. 기존 알고리즘과 새 알고리즘의 결과를 비교하는 테스트를 수행한다.
