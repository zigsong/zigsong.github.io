---
title: 리팩터링 11장 - 2
date: 2022-05-19 09:55:10
tags:
---

API 리팩터링 - 2

<!-- more -->

<img src="/images/thumbnails/refactoring-thumbnail.jpeg" />

---

## 11.7 세터 제거하기

세터 메서드가 있다는 것은 필드가 수정될 수 있다는 뜻이다. 객체 생성 후에는 수정되지 않길 원하는 필드라면 세터를 제공하지 않았을 것이다.

세터 제거하기 리팩터링이 필요한 상황은 주로 두 가지다. 첫째, 사람들이 무조건 접근자 메서드를 통해서만 필드를 다루려 할 때다. 두 번째는 클라이언트에서 생성 스크립트를 사용해 객체를 생성할 때다.

### 절차

1. 설정해야 할 값을 생성자에서 받지 않는다면 그 값을 받을 매개변수를 생성자에 추가한다. 그런 다음 생성자 안에서 적절한 세터를 호출한다.
2. 생성자 밖에서 세터를 호출하는 곳을 찾아 제거하고, 대신 새로운 생성자를 사용하도록 한다.
3. 세터 메서드를 인라인한다. 가능하다면 해당 필드를 불변으로 만든다.

### 예시

```jsx
// before
class Person {
  // ...
  get name() {
    return this._name;
  }
  set name(arg) {
    this._name = arg;
  }
  get id() {
    return this._id;
  }
  set id(arg) {
    this._id = arg;
  }
}

const martin = new Person();
martin.name = "마틴";
margin.id = "1234";
```

`id` 필드는 객체를 생성한 뒤에 변경되면 안 된다. 생성자를 통해 `id` 를 설정하게끔 수정한다.

```jsx
// after
class Person {
  constructor(id) {
    this.id = id;
  }
  // ...
}

const martin = new Person("1234");
martin.name = "마틴";
```

---

## 11.8 생성자를 팩터리 함수로 바꾸기

생성자에는 이상한 제약이 따라붙기도 한다. 자바 생성자는 반드시 생성자를 정의한 클래스의 인스턴스를 반환해야 한다. 생성자의 이름도 고정되며, 생성자를 호출하려면 특별한 연산자(`new`)를 사용해야 한다.

팩터리 함수에는 이런 제약이 없다.

### 절차

1. 팩터리 함수를 만든다. 팩터리 함수의 본문에서는 원래의 생성자를 호출한다.
2. 생성자를 호출하던 코드를 팩터리 함수 호출로 바꾼다.
3. 하나씩 수정할 때마다 테스트한다.
4. 생성자의 가시 범위가 최소가 되도록 제한한다.

### 예시

```jsx
// before
class Employee {
  constructor(name, typeCode) {
    this._name = name;
    this._typeCode = typeCode;
  }

  get name() {
    return this._name;
  }
  get type() {
    return Employee.legalTypeCodes[this._typeCode];
  }
  static get legalTypeCodes() {
    return { E: "Engineer", M: "Manager", S: "Salesperson" };
  }
}

const leedEngineer = new Employee(document.leadEngineer, "E");
```

```jsx
// after
function createEmployee(name) {
  return new Employee(name, "E");
}

const leedEngineer = createEmployee(document.leadEngineer);
```

---

## 11.9 함수를 명령으로 바꾸기

함수를 그 함수만을 위한 객체 안으로 캡슐화하면 더 유용해지는 상황이 있다. 이런 객체를 가리켜 ‘명령 객체’ 혹은 단순히 ‘명령’이라 한다. 명령 객체 대부분은 메서드 하나로 구성되며, 이 메서드를 요청해 실행하는 것이 이 객체의 목적이다.

명령은 평범한 함수 메커니즘보다 훨씬 유연하게 함수를 제어하고 표현할 수 있다. 그러나 명령을 사용해 유연성을 얻더라도 복잡성이 커질 수 있다. 명령보다 더 간단한 방식으로는 얻을 수 없는 기능이 필요할 때만 명령을 선택한다.

### 절차

1. 대상 함수의 기능을 옮길 빈 클래스를 만든다. 클래스 이름은 함수 이름에 기초해 짓는다.
2. 방금 생성한 빈 클래스로 함수를 옮긴다.
3. 함수의 인수들 각각은 명령의 필드로 만들어 생성자를 통해 설정할지 고민해본다.

### 예시

```jsx
// before
function score(candidate, medicalExam, scoringGuide) {
  let result = 0;
  let healthLevel = 0;
  let highMedicalRiskFlag = false;

  if (medicalExam.isSmoker) {
    healthLevel += 10;
    highMedicalRiskFlag = true;
  }

  let certificationGrade = "regular";
  if (scoringGuide.stateWithLowCertification(candidate.originState)) {
    certificationGrade = "low";
    result -= 5;
  }
  // ...
  result -= Math.max(healthLevel - 5, 0);
  return result;
}
```

```jsx
// after
function score(candidate, medicalExam, scoringGuide) {
  return new Scorer(candidate, medicalExam, scoringGuide).execute();
}

class Scorer {
  constructor(candidate, medicalExam, scoringGuide) {
    this._candidate = candidate;
    this._medicalExam = medicalExam;
    this._scoringGuide = scoringGuide;
  }

  execute(medicalExam, scoringGuide) {
    this._result = 0;
    this._healthLevel = 0;
    this._highMedicalRiskFlag = false;

    this.scoreSmoking();
    this._certificationGrade = "regular";

    if (
      this._scoringGuide.stateWithLowCertification(this._candidate.originState)
    ) {
      this._certificationGrade = "low";
      this._result -= 5;
    }
    // ...
    result -= Math.max(this._healthLevel - 5, 0);
    return result;
  }

  scoreSmoking() {
    if (this._medicalExam.isSmoker) {
      this._healthLevel += 10;
      this._highMedicalRiskFlag = true;
    }
  }
}
```

---

## 11.10 명령을 함수로 바꾸기

명령 객체는 복잡한 연산을 다룰 수 있는 강력한 메커니즘을 제공하지만, 로직이 크게 복잡하지 않다면 명령 객체는 평범한 함수로 바꿔주는 게 낫다.

### 절차

1. 명령을 생성하는 코드와 명령의 실행 메서드를 호출하는 코드를 함께 함수로 추출한다.
2. 명령의 실행 함수가 호출하는 보조 메서드 각각을 인라인한다.
3. 함수 선언 바꾸기를 적용하여 생성자의 매개변수 모두를 명령의 실행 메서드로 옮긴다.
4. 명령의 실행 메서드에서 참조하는 필드들 대신 대응하는 매개변수를 사용하게끔 바꾼다.
5. 생성자 호출과 명령의 실행 메서드 호출을 호출자(대체 함수) 안으로 인라인한다.
6. 죽은 코드 제거하기로 명령 클래스를 없앤다.

### 예시

```jsx
// before
class ChargeCalculator {
  constructor(customer, usgae, provider) {
    this._customer = customer;
    this._usage = usage;
    this._provider = provide;
  }

  get baseCharge() {
    return this._customer.baseRate * this._usage;
  }

  get charge() {
    return this.baseCharge + this._provider.connectionCharge;
  }
}

const monthCharge = new ChargeCalculator(customer, usage, provider).charge;
```

```jsx
// after
function charge(customer, usage, provider) {
  const baseCharge = customer.baseRate * usgae;
  return baseCharge + provider.connectionCharge;
}

const monthCharge = charge(customer, usage, provider);
```

---

## 11.11 수정된 값 반환하기

데이터가 수정된다면 그 사실을 명확히 알려주어서, 어느 함수가 무슨 일을 하는지 쉽게 알 수 있게 하는 일이 대단히 중요하다.

데이터가 수정됨을 알려주는 방법 중 하나는, 변수를 갱신하는 함수라면 수정된 값을 반환하여 호출자가 그 값을 변수에 담아두도록 하는 것이다.

### 절차

1. 함수가 수정된 값을 반환하게 하여 호출자가 그 값을 자신의 변수에 저장하게 한다.
2. 피호출 함수 안에 반환할 값을 가리키는 새로운 변수를 선언한다.
3. 계산이 선언과 동시에 이뤄지도록 통합한다. (즉, 선언 시점에 계산 로직을 바로 실행해 대입한다.)
4. 피호출 함수의 변수 이름을 새 역할에 어울리도록 바꿔준다.

```jsx
// before
let totalAscent = 0;
calculateAscent();

function calculateAscent() {
  for (let i = 1; i < points.length; i++) {
    const verticalChagne = points[i].elevation - points[i - 1].elevation;
    totalAscent += verticalChange > 0 ? verticalChange : 0;
  }
}
```

`calculateAscent()` 안에서 `totalAscent` 가 갱신된다는 사실이 드러나지 않는다.

```jsx
// after
const totalAscent = calculateAscent();

function calculateAscent() {
  let result = 0;
  for (let i = 1; i < points.length; i++) {
    const verticalChagne = points[i].elevation - points[i - 1].elevation;
    result += verticalChange > 0 ? verticalChange : 0;
  }
  return result;
}
```

---

## 11.12 오류 코드를 예외로 바꾸기

예외는 프로그래밍 언어에서 제공하는 독립적인 오류 처리 메커니즘으로, 예외가 던져지면 적절한 예외 핸들러를 찾을 때까지 콜스택을 타고 위로 전파된다.

예외는 프로그램의 정상 동작 범주에 들지 않는 오류를 나타낼 때만 쓰여야 한다. 예외를 던지는 코드를 프로그램 종료 코드로 바꿔도 프로그램은 여전히 정상 동작 해야한다. 정상 동작하지 않을 것 같다면, 예외 대신 오류를 검출하여 프로그램을 정상 흐름으로 되돌리게끔 처리해야 한다.

### 절차

1. 콜스택 상위에 해당 예외를 처리할 예외 핸들러를 작서한다.
2. 해당 오류 코드를 대체할 예외와 그 밖의 예외를 구분할 식별 방법을 찾는다.
3. 정적 검사를 수행한다.
4. catch절을 수정하여 직접 처리할 수 있는 예외는 적절히 대처하고 그렇지 않은 예외는 다시 던진다. 오류 코드를 반환하는 곳 모두에서 예외를 던지도록 수정한다.
5. 모두 수정했다면 그 오류 코드를 콜스택 위로 전달하는 코드를 모두 제거한다.

### 예시

```jsx
// before
function localShippingRules(country) {
  const data = countryData.shippingRules[country];
  if (data) return new ShippingRules(data);
  else return -23;
}
```

이 코드는 국가 정보(`country`)가 유효한지를 이 함수 호출 전에 다 검증했다고 가정한다. 이 함수에서 오류가 난다면 무언가 잘못됐음을 뜻한다.

```jsx
// before
function calculateShippingCosts(anOrder) {
  // ...
  const shippingRules = localShippingRules(anOrder.country);
  if (shippingRules < 0) return shippingRules; // 오류 전파
}

const status = calculateShippingCosts(orderData);
if (status < 0) errorList.push({ order: orderData, errorCode: status });
// after
function localShippingRules(country) {
  const data = countryData.shippingRules[country];
  if (data) return new ShippingRules(data);
  else throw new OrderProcessingError(-23);
}

function calculateShippingCosts(anOrder) {
  // ...
  const shippingRules = localShippingRules(anOrder.country);
}

try {
  calculateShippingCosts(orderData);
} catch (e) {
  if (e instanceof OrderProcessingError) {
    errorList.push({ order: orderData, errorCode: e.code });
  } else {
    throw e;
  }
}

class OrderProcessingError extends Error {
  constructor(errorCode) {
    super(`주문 처리 오류: ${errorCode}`);
    this.code = errorCode;
  }
  get name() {
    return "OrderProcessingError";
  }
}
```

---

## 11.13 예외를 사전확인으로 바꾸기

함수 수행 시 문제가 될 수 있는 조건을 함수 호출 전에 검사할 수 있다면, 예외를 던지는 대신 호출하는 곳에서 조건을 검사하도록 해야 한다.

### 절차

1. 예외를 유발하는 상황을 검사할 수 있는 조건문을 추가한다. catch 블록의 코드를 조건문의 조건절 중 하나로 옮기고, 남은 try 블록의 코드를 다른 조건절로 옮긴다.
2. catch 블록에 어서션을 추가하고 테스트한다.
3. try문과 catch 블록을 제거한다.

### 예시(자바)

```java
// ResourcePool 클래스...
public Resource get() {
  Resource result;
  try {
    result = available.pop();
    allocated.add(result);
  } catch (NoSuchElementException e) {
    result = Resource.create();
    allocated.add(result);
  }
  return result;
}

private Deque<Resource> available;
private List<Resource> allocated;
```

풀에서 자원이 고갈되는 건 예상치 못한 조건이 아니다. 사용하기 전에 `allocated` 컬렉션의 상태를 쉽게 확인할 수 있다.
