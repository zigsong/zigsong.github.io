---
title: 리팩터링 4-5장
date: 2022-02-24 19:13:18
tags: refactoring
thumbnailImage: https://i.imgur.com/kAvAwok.jpg
---

테스트 구축하기 | 리팩토링 카탈로그 보는 법

<!-- more -->

---

리팩터링을 제대로 하기 위해서는 실수를 잡아주는 견고한 테스트가 뒷받침돼야 한다.

## 4.1 자가 테스트 코드의 가치

> 모든 테스트를 완전히 자동화하고 그 결과까지 스스로 검사하게 만들자

컴파일할 때마다 테스트도 함께 하면 생산성을 높일 수 있다. 자가 테스트 코드 자체뿐 아니라 테스트를 자주 수행하는 습관도 버그를 찾는 강력한 도구가 된다.

> 테스트 스위트는 강력한 버그 검출 도구로, 버그를 찾는 데 걸리는 시간을 대폭 줄여준다

테스트를 작성하기 가장 좋은 시점은 프로그래밍을 시작하기 전이다. 기능을 추가해야 할 때 테스트부터 작성한다. 이로부터 켄트 벡의 ‘테스트 주도 개발(TDD)’ 기법이 탄생했다. TDD에서는 테스트를 작성하고, 이 테스트를 통과하게끔 코드를 작성하고, 결과 코드를 최대한 깔끔하게 리팩터링하는 과정을 짧은 주기로 반복한다.

---

## 4.2 테스트할 샘플 코드

비즈니스 로직 코드를 UI와 분리하여 코드를 파악하고 테스트하기 편하게 만들어줄 수 있다.

---

## 4.3 첫 번째 테스트

테스트를 두 단계로 진행한다.

```jsx
describe("province", function () {
  it("shortfall", function () {
    const asia = new Province(sampleProvinceData()); // 1. 픽스처 설정
    assert.equal(asia.shortfall, 5); // 2. 검증
  });
});
```

1. 테스트에 필요한 데이터와 객체를 뜻하는 픽스처를 설정한다
2. 이 픽스처의 속성들을 검증한다.

> 실패해야 할 상황에서는 반드시 실패하게 만들자

일시적으로 코드에 오류를 주입하여 각 테스트가 실패하는 모습을 한 번씩 보는 것도 좋은 방법이다.

> 자주 테스트하라. 작성 중인 코드는 최소한 몇 분 간격으로 테스트하고, 적어도 하루에 한 번은 전체 테스트를 돌려보자

차이(chai) 라이브러리의 `assert`문 또는 `expect`문을 이용해 코드를 검증할 수 있다.

```
describe('province', function() {
  it('shortfall', function() {
  const asia = new Province(sampleProvinceData());
  assert.equal(asia.shortfall, 5);
});
describe('province', function() {
  it('shortfall', function() {
  const asia = new Province(sampleProvinceData());
  expect(asia.shortfall).equal(5);
});
```

실패한 테스트가 하나라도 있으면 리팩터링하면 안 된다!

---

## 4.4 테스트 추가하기

테스트는 위험 요인을 중심으로 작성해야 한다. 테스트의 목적은 어디까지나 현재 혹은 향후에 발생하는 버그를 찾는 데 있다. 따라서 단순히 필드를 읽고 쓰기만 하는 접근자는 테스트할 필요가 없다.

> 완벽하게 만드느라 테스트를 수행하지 못하느니, 불완전한 테스트라도 작성해 실행하는 게 낫다

아래처럼 똑같은 픽스처가 중복되는 부분이 있다면, 픽스처를 여러 테스트문에서 접근할 수 있는 장소로 옮겨 중복을 제거할 수 있지만,

```jsx
describe("province", function () {
  const asia = new Province(sampleProvinceData());
  it("shortfall", function () {
    expect(asia.shortfall).equal(5);
  });
  it("profit", function () {
    expect(asia.profit).equal(230);
  });
});
```

‘테스트끼리 상호작용하게 하는 공유 픽스처’를 생성하는 원인이 되어 테스트를 실행하는 순서에 따라 결과가 달라질 수 있기 때문에 문제가 된다.

이때는 `beforeEach` 를 사용할 수 있다.

```jsx
describe("province", function () {
  let asia;
  beforeEach(function () {
    asia = new Province(sampleProvinceData());
  });
  it("shortfall", function () {
    expect(asia.shortfall).equal(5);
  });
  it("profit", function () {
    expect(asia.profit).equal(230);
  });
});
```

개별 테스트를 실행할 때마다 픽스처를 새로 만들면 모든 테스트를 독립적으로 구성할 수 있다.

---

## 4.5 픽스처 수정하기

```jsx
describe("province", function () {
  // ...
  it("change production", function () {
    asia.producers[0].production = 20;
    expect(asia.shortfall).equal(-6);
    expect(asia.profit).equal(292);
  });
});
```

위 예제에서는 `beforeEach`에서 ‘설정’한 표준 픽스처를 취해서, 테스트를 ‘수행’하고, 이 픽스처가 일을 기대한 대로 처리했는지를 ‘검증’한다.

이 테스트는 `it` 구문 하나에서 두 가지 속성을 검증하고 있지만, 일반적으로 `it` 구문 하나당 검증도 하나씩만 하는 게 좋다.

---

## 4.6 경계 조건 검사하기

의도나 예측 범위를 벗어나는 경계 지점에서 문제가 생길 경우 확인하는 테스트도 함께 작성하면 좋다.

컬렉션 타입의 값이 비었을 때나, 숫자형이 0 또는 음수인 경우를 검사해본다.

> 문제가 생길 가능성이 있는 경계 조건을 생각해보고 그 부분을 집중적으로 테스트하자

테스트가 모든 버그를 걸러주지는 못할지라도, 안심하고 리팩터링할 수 있는 보호막은 되어준다. 그리고 리팩터링을 하면서 프로그램을 더욱 깊이 이해하게 되어 더 많은 버그를 찾게 된다.

---

## 4.7 끝나지 않은 여정

테스트는 반복적으로 진행해야 한다. 기능을 새로 추가할 때마다 테스트도 추가하는 것은 물론, 기존 테스트도 다시 살펴본다.

> 버그 리포트를 받으면 가장 먼저 그 버그를 드러내는 단위 테스트부터 작성하자
