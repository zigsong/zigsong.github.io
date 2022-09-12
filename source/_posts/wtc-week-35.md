---
title: 우테코 35주차 기록
date: 2021-10-16 18:33:06
tags: woowacourse
---

끝나지 않는 SSR | 로그인에 refreshToken 이용하기 | setState에 await을 붙이면?

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 놀토 프로젝트

SSR을 적용하며 발생하는 각양각색의 버그에 대응하고, 갑자기 깨져버리는 mp4 파일도 대응하고, 여러가지로 고난의 세월을 보내고 있다.

그리고 refreshToken을 이용하여 기존의 로그인 방식을 개선하고 있다. 만만치 않을 것이라고는 생각했는데, 정말 생각보다 더욱 만만치 않다. 세상 일이 이렇게 뜻대로 되는 게 드문 시기다. 🤷‍♀️ [아래](https://zigsong.github.io/2021/10/16/wtc-week-35/#로그인에-refreshToken-이용하기)에서 확인 가능하다.

---

## 프론트엔드 공부

### 로그인에 refreshToken 이용하기

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/16/refresh-token/)

### React의 setState에 await을 붙이면?

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/16/await-setstate/)

---

## 공부하기

### JavaScript의 단축 평가

`&&`, `||` 그리고 null 병합 연산자인 `??`까지. 습관적으로 사용했지만 기대값을 확실하게 알고 쓰지 못했던 JavaScript의 단축 평가에 대해 정리해 보자.

`&&`(논리곱) 연산자는 두 개의 피연산자가 모두 true로 평가될 때 true를 반환한다.

```jsx
"Cat" && "Dog"; // "Dog"
```

첫 번째 피연산자 ‘Cat’은 Truthy 값이므로 true로 평가된다. 하지만 두 번째 피연산자까지 평가해 보아야 한다. 여기서는 논리 연산의 결과를 결정하는 두 번째 피연산자, 두 번째 피연산자인 ‘Dog’을 반환한다.

`||`(논리합) 연산자는 두 개의 피연산자 중 하나만 true로 평가되어도 true를 반환한다.

```jsx
"Cat" || "Dog"; // "Cat"
```

첫 번째 피연산자 ‘Cat’은 Truthy 값이므로 true로 평가된다. 두 번째 피연산자까지 평가해 보지 않아도 위 표현식을 평가할 수 있다. 여기서는 논리 연산의 결과를 결정한 첫 번째 피연산자, 즉 문자열 ‘Cat’을 반환한다.

이처럼 표현식을 평가하는 도중에 평가 결과가 확정된 경우 나머지 평가 과정을 생략하는 것을 **단축 평가**라 한다.

| 단축 평가 표현식    | 평가 결과 |
| :------------------ | :-------- |
| true \|\| anything  | true      |
| false \|\| anything | anything  |
| true && anything    | anything  |
| false && anything   | false     |

🤔 이제, 헷갈리는 부분

객체를 가리키기를 기대하는 변수가 `null` 또는 `undefined`가 아닌지 확인하고 프로퍼티를 참조할 때

```jsx
const elem = null;
const value = elem && elem.value; // null
```

위 예제에서 elem이 `null`이나 `undefined`와 같은 falsy 값이면 elem으로 평가되고, elem이 Truthy 값이면 elem.value로 평가된다.

막상 적고 보니 그리 헷갈리는 내용도 아니었다.
그렇다면 마지막으로 null 병합 연산자인 `??`도 살펴보자. `??` 연산자는 무려 ES11에서 도입되었다고 한다. 엊그제 생긴 셈!

`??`는 좌항의 피연산자가 `null` 또는 `undefined`인 경우 우항의 피연산자를 반환하고, 그렇지 않으면 좌항의 피연산자를 반환한다.

```jsx
const foo = null ?? "default string";
console.log(foo); // "default string"
```

`??`는 변수에 기본값을 설정할 때 유용하다. 논리 연산자 `||`를 사용한 단축 평가의 경우 좌항의 피연산자가 falsy 값이면 우항의 피연산자를 반환한다. 만약 falsy 값인 `0`이나 `''`도 기본값으로서 유효하다면 예기치 않은 동작이 발생할 수 있다.

```jsx
const foo = "" || "default string";
console.log(foo); // "default string"
```

하지만 null 병합 연산자 `??`는 좌항의 피연산자가 falsy 값이라도 `null` 또는 `undefined`가 아니라면 좌항의 피연산자를 그대로 반환한다.

```jsx
const foo = "" ?? "default string";
console.log(foo); // ""
```

**Ref** 모던 자바스크립트 Deep Dive 9-4절

### 모두 알지만 모두 모르는 package.json

(뜨끔 🙄)

- **name**과 **version**은 필수적으로 명시해준다.
- **description**과 **keywords**를 작성하여 `npm search`로 검색된 리스트에 표시되게끔 해준다.
- **people fields**는 **author**와 **contributors**로 구분된다.
- **files**는 프로젝트에 포함된 파일의 배열, **directories**는 패키지 구성을 나타낸다.
- **bin**을 사용하여 실행할 수 있는 패키지를 구성할 수 있다.
- **scripts** 항목은 패키지의 생명주기 중 다양한 타이밍에서 실행되는 script 명령어들을 포함하고 있는 사전이다.
- **dependencies** 의존성 규정을 패키지의 이름과 해당 패키지의 버전 범위를 지정한 객체를 통해 이루어진다. `semver`를 참고하여 버전 범위를 지정하자.
- **devDependencies**는 운영이 아닌 개발 단계에서만 필요한 의존성 모듈들을 가리킨다.
- **peerDependencies**는 어떤 패키지가 다른 (호스트) 패키지와 호환성을 가지고 있음을 표현한다. 즉 다른 모듈과 함께 동작할 수 있다는 호환성을 표시하는 것이다. 이를 일반적으로 플러그인이라고 한다.
- npm 2.0.0부터 로컬 경로(local paths)를 패키지에 포함시킬 수 있다.
- **engines**로 동작 가능한 node의 버전을, **os**로 모듈이 어떤 운영체제에서 작동하는지 지정할 수 있다. **cpu**는 특정한 CPU 아키텍쳐에서만 동작한다는 것을 명시한다.
- **publishConfig**는 publish할 때 사용되는 설정으로, tag와 registry, access를 다룰 수 있다.

**Ref** https://programmingsummaries.tistory.com/385

### array.filter(Boolean)

webpack config를 뜯어보다가 신기한 문법을 발견했다.

```jsx
plugins: [process.env.NODE_ENV === "production" ? new Plugin() : false].filter(
  Boolean
);
```

배열에서 filter를 돌릴 때 조건을 `Boolean`으로 제공하면, 배열의 요소 중 falsy 값을 제거한 깔끔한 배열을 만들 수 있다.

즉 아래와 같이 `false`, `0`과 같은 falsy 값들을 제외해준다.

```jsx
let array = [false, 0, -0, 0n, "", null, undefined, NaN, { hello: "world" }];
console.log(array.filter(Boolean)); // [{ hello: "world" }]
```

**Ref** https://velog.io/@yongbum/filter-boolean

### JavaScript 엔진은 어떻게 내 코드를 실행하는 걸까?

- **Ignition**
  직역하면 ‘점화’라는 뜻이다. V8 엔진이 소스코드에서 뽑아낸 AST(추상 구문)를 바이트코드로 변환하는 인터프리터다. 자바스크립트 코드를 곧바로 기계어로 컴파일하는 것보다 바이트 코드를 컴파일하는 것이 더 효율적이기 때문에, 한 차례 인터프리터를 거친다. Ignition은 코드 한줄 한줄을 바이트 코드로 바꿔주는 친구다.

  > **👾 바이트 코드?**
  > 직접 CPU 내의 레지스터와 누산기를 어떤 식으로 사용할지 명령하는 명령문이다. 사람이 이해하긴 어렵지만 컴퓨터 입장에서는 이해하기 좋은 방식이다.

- **TurboFan**
  V8 엔진은 런타임 중에 `Profiler`라는 친구에게 함수나 변수의 호출 빈도와 같은 데이터를 모으라고 시킨다. 이렇게 모인 데이터를 가지고 자주 사용되는 코드는 TurboFan에서 최적화된 코드로 다시 컴파일한다. 최적화 기법으로는 히든 클래스(Hidden Class)나 인라인 캐싱(Inline Caching) 등의 기법을 사용한다.

아직까지는 정확히 모르겠지만, JavaScript 엔진이 굉장히 분주하게 소스코드 최적화를 위해 움직이는 것을 알 수 있었다. Ignition과 TurboFan을 이용하여 바이트코드와 최적화된 코드 사이를 왔다갔다 하는 모습이 귀엽게 느껴진다. 😗

**Ref** https://evan-moon.github.io/2019/06/28/v8-analysis/

---

## 기타

### FEConf 2021

**Ref** https://2021.feconf.kr/

### state of css survey

**Ref** https://stateofcss.com/

---

## 마무리

백신 2차를 맞았다. 아팠다. 그렇지만 타이레놀 갓갓. 1차 때도 사흘을 아팠던 나인데, 타이레놀 두 알 먹고 하루 반나절 아프고 나았다. 얕고 길게 아팠던 1차 때와 달리, 크고 짧게 아프고 나았다.

사이트도 만들었다. 영상도 만들었다. 또 코딩 외적으로 시간을 대거 투자했다. 회사 가면 이런 일은 없겠지? 그럼에도 글도 쓰고, 또 면접 보고, 미션도 어떻게 마무리하긴 했다. 알차게 놀기까지! 정말 가득가득 채운 삶
