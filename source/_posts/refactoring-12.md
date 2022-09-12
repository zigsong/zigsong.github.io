---
title: 리팩터링 12장
date: 2022-05-27 23:43:35
tags: refactoring
---

상속 다루기

<!-- more -->

---

<img src="/images/thumbnails/refactoring-thumbnail.jpeg" />

---

## 12.1 메서드 올리기

메서드 올리기를 적용하기 가장 쉬운 상황은 메서드들의 본문 코드가 똑같을 때다. 그러나 메서드 올리기 리팩터링을 적용하려면 선행 단계를 거쳐야 할 때가 많다.

메서드 올리기를 적용하기에 가장 이상하고 복잡한 상황은 해당 메서드의 본문에서 참조하는 필드들이 서브클래스에만 있는 경우다. 두 메서드의 전체 흐름은 비슷하지만 세부 내용이 다르다면 템플릿 메서드 만들기를 고려해보자.

### 절차

1. 똑같이 동작하는 메서드인지 면밀히 살펴본다.
2. 메서드 안에서 호출하는 다른 메서드와 참조하는 필드들을 슈퍼클래스에서도 호출하고 참조할 수 있는지 확인한다.
3. 메서드 시그니처가 다르다면 함수 선언 바꾸기로 슈퍼클래스에서 사용하고 싶은 형태로 통일한다.
4. 슈퍼클래스에 새로운 메서드를 생성하고, 대상 메서드의 코드를 복사해넣는다.
5. 정적 검사를 수행한다.
6. 서브클래스 중 하나의 메서드를 제거한다.
7. 모든 서브클래스의 메서드가 없어질 때까지 다른 서브클래스의 메서드를 하나씩 제거한다.

### 예시

```jsx
// before
// Employee 클래스(Party를 상속함)...
get annualCost() {
  return this.monthlyCost * 12;
}

// Department 클래스(Party를 상속함)...
get totalAnnualCost() {
  return this.monthlyCost * 12;
}
```

```jsx
// after
// Party 클래스...
get annualCost() {
  return this.monthlyCost * 12;
}
```

---

## 12.2 필드 올리기

서브클래스의 필드들이 비슷한 방식으로 쓰인다고 판단되면 슈퍼클래스로 끌어올리자.

이렇게 하면 데이터 중복 선언을 없앨 수 있고, 해당 필드를 사용하는 동작을 서브클래스에서 슈퍼클래스로 옮길 수 있다.

### 절차

1. 후보 필드들을 사용하는 곳 모두가 그 필드들을 똑같은 방식으로 사용하는지 면밀히 살핀다.
2. 필드들의 이름이 각기 다르다면 똑같은 이름으로 바꾼다.
3. 슈퍼클래스에 새로운 필드를 생성한다.
4. 서브클래스의 필드들을 제거한다.
5. 테스트한다.

---

## 12.3 생성자 본문 옮기기

생성자는 할 수 있는 일과 호출 순서에 제약이 있기 때문에 조금 다른 식으로 접근해야 한다.

### 절차

1. 슈퍼클래스에 생성자가 없다면 하나 정의한다. 서브클래스의 생성자들에서 이 생성자가 호출되는지 확인한다.
2. 문장 슬라이드하기로 공통 문장 모두를 `super()` 호출 직후로 옮긴다.
3. 공통 코드를 슈퍼클래스에 추가하고 서브클래스들에서는 제거한다. 생성자 매개변수 중 공통 코드에서 참조하는 값들을 모두 `super()`로 건넨다.
4. 생성자 시작 부분으로 옮길 수 없는 공통 코드에는 함수 추출하기와 메서드 올리기를 차례로 적용한다.

### 예시

```jsx
// before
class Party {}

class Employee extends Party {
  constructor(name, id, monthlyCost) {
    super();
    this._id = id;
    this._name = name;
    this._monthlyCost = monthlyCost;
  }
  // ...
}

class Department extends Party {
  constructor(name, staff) {
    super();
    this._name = name;
    this._staff = staff;
  }
  // ...
}
```

```jsx
// after
class Party {
  constructor(name) {
    this._name = name;
  }
}

class Employee extends Party {
  constructor(name, id, monthlyCost) {
    super(name);
    this._id = id;
    this._monthlyCost = monthlyCost;
  }
  // ...
}

class Department extends Party {
  constructor(name, staff) {
    super(name);
    this._staff = staff;
  }
  // ...
}
```

---

## 12.4 메서드 내리기

특정 서브클래스 하나(혹은 소수)와만 관련된 메서드는 슈퍼클래스에서 제거하고 해당 서브클래스(들)에 추가하는 편이 깔끔하다.

### 절차

1. 대상 메서드를 모든 서브클래스에 복사한다.
2. 슈퍼클래스에서 그 메서드를 제거한다.
3. 이 메서드를 사용하지 않는 모든 서브클래스에서 제거한다.

---

## 12.5 필드 내리기

서브클래스 하나(혹은 소수)에서만 사용하는 필드는 해당 서브클래스(들)로 옮긴다.

### 절차

1. 대상 필드를 모든 서브클래스에 정의한다.
2. 슈퍼클래스에서 그 필드를 제거한다.
3. 이 필드를 사용하지 않는 모든 서브클래스에서 제거한다.

---

## 12.6 타입 코드를 서브클래스로 바꾸기

타입 코드는 프로그래밍 언어에 따라 열거형이나 심볼, 문자열, 숫자 등으로 표현하며, 외부 서비스가 제공하는 데이터를 다루려 할 때 딸려오는 일이 흔하다.

타입 코드는 조건에 따라 다르게 동작하도록 해주는 다형성을 제공한다. 또 특정 타입에서만 의미가 있는 값을 사용하는 필드나 메서드가 있을 때 유용하다.

### 절차

1. 타입 코드 필드를 자가 캡슐화한다.
2. 타입 코드 값 하나를 선택하여 그 값에 해당하는 서브클래스를 만든다. 타입 코드 게터 메서드를 오버라이드하여 해당 타입 코드의 리터럴 값을 반환하게 한다.
3. 매개변수로 받은 타입 코드와 방금 만든 서브클래스를 매핑하는 선택 로직을 만든다.
4. 타입 코드 값 각각에 대해 서브클래스 생성과 선택 로직 추가를 반복한다.
5. 타입 코드 필드를 제거한다.
6. 타입 코드 접근자를 이용하는 메서드 모두에 메서드 내리기와 조건부 로직을 다형성으로 바꾸기를 적용한다.

### 예시: 직접 상속할 때

```jsx
// before
// Employee 클래스...
constructor(name, type) {
  this.validateType(type);
  this._name = name;
  this._type = type;
}

validateType(arg) {
  if (!["engineer", "manager", "salesperson"].includes(arg)) {
    throw new Error(`${arg}라는 직원 유형은 없습니다.`);
  }
}

toString() {
  return `${this._name} (${this._type})`;
}
```

```jsx
// after
// Employee 클래스...
constructor(name) {
  this._name = name;
}

class Engineer extends Employee {
  get type() { return "engineer"; }
}

class Salesperson extends Employee {
  get type() { return "salesperson"; }
}

class Manager extends Employee {
  get type() { return "manager"; }
}

function createEmployee(name, type) {
  switch (type) {
    case "engineer": return new Engineer(name);
    case "salesperson": return new Salesperson(name);
    case "manager": return new Manager(name);
    default: throw new Error(`${type}라는 직원 유형은 없습니다.`);
  }
  return new Employee(name, type);
}
```

---

## 12.7 서브클래스 제거하기

서브클래싱은 원래 데이터 구조와는 다른 변종을 만들거나 종류에 따라 동작이 달라지게 할 수 있는 유용한 메커니즘이다. 하지만 더 이상 쓰이지 않는 서브클래스는 제거하는 것이 좋다.

### 절차

1. 서브클래스의 생성자를 팩터리 함수로 바꾼다.
2. 서브클래스의 타입을 검사하는 코드가 있다면 그 검사 코드에 함수 추출하기와 함수 옮기기를 차례로 적용하여 슈퍼클래스로 옮긴다.
3. 서브클래스의 타입을 나타내는 필드를 슈퍼클래스에 맏는다.
4. 서브클래스를 참조하는 메서드가 방금 만든 타입 필드를 이용하도록 수정한다.
5. 서브클래스를 지운다.

### 예시

```jsx
// before
class Person {
  constructor(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
  get genderCode() {
    return "X";
  }
  // ...
}

class Male extends Person {
  get genderCode() {
    return "M";
  }
}

class Female extends Person {
  get genderCode() {
    return "F";
  }
}
```

서브클래스가 하는 일이 이게 다라면 굳이 존재할 이유가 없다.

서브클래스 만들기를 캡슐화하는 방법은 바로 생성자를 팩터리 함수로 바꾸기다.

```jsx
class Person {
  constructor(name, genderCode) {
    this._name = name;
    this._genderCode = genderCode;
  }
  get name() {
    return this._name;
  }
  get genderCode() {
    return this._genderCode;
  }
  // ...
  get isMale() {
    return "M" === this._genderCode;
  }
}

class Male extends Person {
  get genderCode() {
    return "M";
  }
}

class Female extends Person {
  get genderCode() {
    return "F";
  }
}

function createPerson(aRecord) {
  switch (aRecord.gender) {
    case "M":
      return new Male(aRecord.name, "M");
    case "F":
      return new Female(aRecord.name, "F");
    default:
      return new Person(aRecord.name, "X");
  }
}

function loadFromInput(data) {
  return data.map((aRecord) => createPerson(aRecord));
}

// 클라이언트...
const numberOfMales = people.filter((p) => p.isMale).length;
```

---

## 12.8 슈퍼클래스 추출하기

비슷한 일을 수행하는 두 클래스가 보이면 상속 메커니즘을 이용해서 비슷한 부분을 공통의 슈퍼클래스로 옮겨 담을 수 있다.

### 절차

1. 빈 슈퍼클래스를 마든다. 원래의 클래스들이 새 클래스를 사속하도록 한다.
2. 생성자 본문 올리기, 메서드 올리기, 필드 올리기를 차례로 적용하여 공통 원소를 슈퍼클래스로 옮긴다.
3. 서브클래스에 남은 메서드들을 검토한다. 공통되는 부분이 있다면 함수로 추출한 다음 메서드 올리기를 적용한다.
4. 원래 클래스들을 사용하는 코드를 검토하여 슈퍼클래스의 인터페이스를 사용하게 할지 고민해본다.

### 예시

```jsx
// before
class Employee {
  constructor(name, id, monthlyCost) {
    this._id = id;
    this._name = name;
    this._monthlyCost = monthlyCost;
  }

  get monthlyCost() {
    return this._monthlyCost;
  }
  get name() {
    return this._name;
  }
  get id() {
    return this._id;
  }

  get annualCost() {
    return this.monthlyCost * 12;
  }
}

class Department {
  constructor(name, staff) {
    this._name = name;
    this._staff = staff;
  }

  get staff() {
    return this._staff.slice();
  }
  get name() {
    return this._name;
  }

  get totalMonthlyCost() {
    return this.staff
      .map((e) => e.monthlyCost)
      .reduce((sum, cost) => sum + cost);
  }

  get headCount() {
    return this.staff.length;
  }

  get totalAnnualCost() {
    return this.totalMonthlyCost * 12;
  }
}
```

```jsx
// after
class Party {
  constructor(name, id, monthlyCost) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  get annualCost() {
    return this.monthlyCost * 12;
  }
}

class Employee extends Party {
  constructor(name, id, monthlyCost) {
    super(name);
    this._id = id;
    this._monthlyCost = monthlyCost;
  }

  get monthlyCost() {
    return this._monthlyCost;
  }
  get id() {
    return this._id;
  }
}

class Department extends Party {
  constructor(name, staff) {
    super(name);
    this._staff = staff;
  }

  get staff() {
    return this._staff.slice();
  }

  get monthlyCost() {
    return this.staff
      .map((e) => e.monthlyCost)
      .reduce((sum, cost) => sum + cost);
  }

  get headCount() {
    return this.staff.length;
  }
}
```

---

## 12.9 계층 합치기

클래스 계층구조가 진화하면서 어떤 클래스와 그 부모가 너무 비슷해져 더는 독립적으로 존재해야 할 이유가 사라진다면, 그 둘을 하나로 합쳐야 할 시점이다.

### 절차

1. 두 클래스 중 제거할 것을 고른다.
2. 필드 올리기와 메서드 올리기 혹은 필드 내리기와 메서드 내리기를 적용하여 모든 요소를 하나의 클래스로 옮긴다.
3. 제거할 클래스를 참조하던 모든 코드가 남겨질 클래스를 참조하도록 고친다.
4. 빈 클래스를 제거한다.

---

## 12.10 서브클래스를 위임으로 바꾸기

상속은 한 번만 쓸 수 있는 카드라는, 가장 명확한 단점이 있다. 무언가가 달라져야 하는 이유가 여러 개여도 상속에서는 그중 단 하나의 이유만 선택해 기준으로 삼을 수밖에 없다.

또 상속은 클래스들의 관계를 아주 긴밀하게 결합한다. 부모를 수정하면 이미 존재하는 자식들의 기능을 해치기가 쉽다.

위임은 이 두 문제를 모두 해결해준다. 위임은 객체 사이의 일반적인 관계이므로 상호작용에 필요한 인터페이스를 명확히 정의할 수 있다. 즉, 상속보다 결합도가 훨씬 약하다.

### 절차

1. 생성자를 호출하는 곳이 많다면 생성자를 팩터리 함수로 바꾼다.
2. 위임으로 활용할 빈 클래스를 만든다. 이 클래스의 생성자는 서브클래스에 특화된 데이터를 전부 받아야 하며, 보통은 슈퍼클래스를 가리키는 역참조도 필요하다.
3. 위임을 저장할 필드를 슈퍼클래스에 추가한다.
4. 서브클래스 생성 코드를 수정하여 위임 인스턴스를 생성하고 위임 필드에 대입해 초기화한다.
5. 서브클래스의 메서드 중 위임 클래스로 이동할 것을 고른다.
6. 함수 옮기기를 적용해 위임 클래스로 옮긴다. 원래 메서드에서 위임하는 코드는 지우지 않는다.
7. 서브클래스 외부에도 원래 메서드를 호출하는 코드가 있다면 서브클래스의 위임 코드를 슈퍼클래스로 옮긴다. 이때 위임이 존재하는지를 검사하는 보호 코드로 감싸야 한다. 호추하는 외부 코드가 없다면 원래 메서드는 죽은 코드가 되므로 제거한다.
8. 서브클래스의 모든 메서드가 옮겨질 때까지 5~7 과정을 반복한다.
9. 서브클래스들의 생성자를 호출하는 코드를 찾아서 슈퍼클래스의 생성자를 사용하도록 수정한다.
10. 서브클래스를 삭제한다.

### 예시

```jsx
// before
// Booking 클래스...
class Booking {
  constructor(show, date) {
    this._show = show;
    this._date = date;
  }

  get hasTalkback() {
    return this._show.hasOwnProperty("talkback") && !this.isPeakDay;
  }

  get basePrice() {
    let result = this._show.price;
    if (this.isPeakDay) result += Math.round(result * 0.15);
    return result;
  }
}

// PremiumBooking 클래스(Booking을 상속함)...
class PremiumBooking extends Booking {
  constructor(show, date, extras) {
    super(show, date);
    this._extras = extras;
  }

  get hasTalkback() {
    return this._show.hasOwnProperty("talkback");
  }

  get basePrice() {
    return Math.round(super.basePrice + this._extras.premiumFee);
  }

  get hasDinner() {
    return this._extras.hasOwnProperty("dinner") && !this.isPeakDay;
  }
}
```

위 예제에는 상속이 잘 들어맞지만, 현실은 이만큼 완벽하지만은 않다. 슈퍼클래스에는 서브클래스에 의해 완성되는, 즉 서브클래스 없이는 불완전한 어떤 구조가 존재할 수 있다.

상속은 한 번만 사용할 수 있는 도구다. 따라서 상속을 사용해야 할 다른 이유가 생긴다면, 그리고 그 이유가 프리미엄 예약 서브클래스보다 가치가 크다고 생각된다면 프리미엄 예약을 (상속이 아닌) 다른 방식으로 표현해야 할 것이다.

```jsx
// after
// Booking 클래스...
class Booking {
  constructor(show, date) {
    this._show = show;
    this._date = date;
  }

  get hasTalkback() {
    return (this._premiumDelegate)
    	? this._premiumDelegete.hasTalkback
    	: this._show.hasOwnProperty('talkback') && !this.isPeakDay;
  }

  get basePrice() {
    let result = this._show.price;
    if (this.isPeakDay) result += Math.round(result * 0.15);
    return (this._premiumDelegate)
    	? this._premiumDelegate.extendBasePrice(result);
    	: result;
  }

  get hasDinner() {
    return (this._premiumDelegate)
    	? this._premiumDelegate.hasDinner
    	: undefined;
  }

  _bePremium(extras) {
    this._premiumDelegate = new PremiumBookingDelegate(this, extras);
  }
}

function createBooking(show, date) {
  return new Booking(show, date);
}

function createPremiumBooking(show, date, extras) {
  const result = new Booking(show, date, extras);
  result._bePremium(extras);
  return result;
}

// 클라이언트(일반 예약)...
aBooking = createBooking(show, date);

// 클라이언트(프리미엄 예약)...
aBooking = createPremiumBooking(show, date, extras);

class PremiumBookingDelegate {
  constructor(hostBooking, extras) {
    this._host = hostBooking;
    this._extras = extras;
  }

  get hasTalkback() {
    return this._host._show.hasOwnProperty('talkback');
  }

  get basePrice() {
    return Math.round(this._host._privateBasePrice + this._extras.premiumFee);
  }

  extendBasePrice(base) {
    return Math.round(base + this._extras.premiumFee);
  }

  get hasDinner() {
    return this._extras.hasOwnProperty('dinner') && !this.isPeakDay;
  }
}
```

---

## 12.11 슈퍼클래스를 위임으로 바꾸기

제대로 된 상속이라면 서브클래스가 슈퍼클래스의 모든 기능을 사용함은 물론, 서브클래스의 인스턴스를 슈퍼클래스의 인스턴스로도 취급할 수 있어야 한다. 즉 슈퍼클래스가 사용되는 모든 곳에서 서브클래스의 인스턴스를 대신 사용해도 이상없이 동작해야 한다.

서브클래스 방식 모델링이 합리적일 때라도 슈퍼클래스를 위임으로 바꾸기도 한다. 슈퍼/서브클래스는 강하게 결합된 관계라서 슈퍼클래스를 수정하면 서브클래스가 망가지기 쉽기 때문이다.

### 절차

1. 슈퍼클래스 객체를 참조하는 필드를 서브클래스에 만든다. 위임 참조를 새로운 슈퍼클래스 인스턴스로 초기화한다.
2. 슈퍼클래스의 동작 각각에 대응하는 전달 함수를 서브클래스에 만든다. 서로 관련된 함수끼리 그룹으로 묶어 진행한다.
3. 슈퍼클래스의 동작 모두가 전달 함수로 오버라이드되었다면 상속 관계를 끊는다.

### 예시

```jsx
// before
class CatalogItem {
  constructor(id, title, tags) {
    this._id = id;
    this._title = title;
    this._tags = tags;
  }

  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  hasTag(arg) {
    return this._tags.includes(arg);
  }
}

class Scroll extends CatalogItem {
  constructor(id, title, tags, dateLastCleaned) {
    super(id, title, tags);
    this._lastCleaned = dateLastCleaned;
  }

  needsCleaning(targetDate) {
    const threshold = this.hasTag("revered") ? 700 : 1500;
    return this.daysSinceLastCleaning(targetDate) > threshold;
  }

  daysSinceLastCleaning(targetDate) {
    return this._lastCleaned.until(targetDate, ChronoUnit.DAYS);
  }
}
```

```jsx
// after
class CatalogItem {
  constructor(id, title, tags) {
    this._id = id;
    this._title = title;
    this._tags = tags;
  }

  get id() {
    return this._catalogItem._id;
  }
  get title() {
    return this._catalogItem._title;
  }
  hasTag(aString) {
    return this._catalogItem.hasTag(aString);
  }
}

class Scroll {
  constructor(id, title, tags, dateLastCleaned) {
    this._catalogItem = new CatalogItem(id, title, tags);
    this._lastCleaned = dateLastCleaned;
  }

  needsCleaning(targetDate) {
    const threshold = this.hasTag("revered") ? 700 : 1500;
    return this.daysSinceLastCleaning(targetDate) > threshold;
  }

  daysSinceLastCleaning(targetDate) {
    return this._lastCleaned.until(targetDate, ChronoUnit.DAYS);
  }
}
```
