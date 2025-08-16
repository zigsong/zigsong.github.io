---
title: 프론트엔드 동시성 제어와 최적화
date: 2025-08-16 10:33:00
tags: ["frontend"]
description: 프론트엔드의 숙명, 비동기 처리 제어
---

## 들어가며

---

프론트엔드의 숙명 중 하나, 비동기 처리 제어

UI 블로킹 방지, Promise에 대한 이해, 적절한 에러 및 로딩 상태 관리 등 프론트엔드에서 비동기 호출을 관리하면서 신경 써야 할 부분들이 많다.

하지만 그중 가장 고어한(?) 영역이라고 생각되는 것은 바로 **동시성 제어 & 최적화**가 아닐까 싶다. 특히 서버 응답 시간이 오래 걸려 TTFB(Time To First Byte)가 증가하는 경우에는, 서버에서 더 이상 최적화가 어렵다면 프론트에서라도 조치를 취해줘야 할 것이다.

~~내가 잘못한 것도 아닌데 괜히 팀의 눈치를 봐야 하는 프론트엔드 개발자다. 🥲~~ 

## 기본적인 방법들

---

자바스크립트에서는 비동기 함수의 병렬 처리를 위하여 가장 많이 사용하는 `Promise.all`을 시작으로, `Promise.allSettled`, `Promise.race` 같은 메서드들을 제공한다.

세 가지 메서드의 구체적인 차이를 비교하면 다음과 같다.

| 메서드                    | 완료 조건             | 실패 처리           | 반환 값                           | 
| ---------------------- | ----------------- | --------------- | ------------------------------ | 
| **Promise.all**        | 모든 Promise 성공해야 함 | 하나라도 실패 시 전체 실패 | 성공한 결과 배열                      | 
| **Promise.allSettled** | 모두 끝날 때까지 기다림     | 실패도 포함          | `{status, value/reason}` 객체 배열 | 
| **Promise.race**       | 가장 먼저 완료된 것만 반환   | 성공/실패 둘 다 가능    | 가장 먼저 settle 된 Promise 결과      | 

> **동시성 (Concurrency) vs 병렬 (Parallelism)**
> 
> 엄연히 말하면 이 둘은 다른 개념이다.
> - 동시성: 여러 작업을 한 번에 진행되는 것처럼 다루는 것 (구조적 개념)
> - 병렬: 실제로 물리적으로 동시에 실행되는 것 (하드웨어적 개념)
> 하지만 `Promise.all`과 같은 함수는 단순히 병렬 실행만이 아니라, "모든 작업이 끝나야 결과를 모은다", "중간에 하나라도 실패하면 전체 reject"와 같은 제어 로직까지 포함하기 때문에, 실무에서는 “동시성 제어(concurrency control)” 범주로 같이 언급하기도 한다.

## 동시성 작업 제어 라이브러리

---

하지만 `Promise.xxx` 함수로도 부족하다. 단순 자바스크립트 코드 제어가 아닌, 브라우저 자체에 대한 이해를 바탕으로 비동기 호출을 제어할 방법이 필요하다. 그리고 세상엔 역시나 이미 수많은 석학들이 연구한 솔루션들이 나와있다.

이름이 약간 사짜같아서 망설여졌지만, 다음과 같은 라이브러리들이 대표적이다.

- `p-limit`
	- 동시에 실행할 수 있는 비동기 작업의 수를 제한하여 리소스를 효율적으로 사용할 수 있다.
	- 비동기 작업의 동시 실행 수를 제한하여 리소스 사용을 최적화한다. 이로 인해 시스템이 과부하되지 않도록 하며, 안정적인 성능을 유지할 수 있다.

- `fastq`
	- 비동기 작업을 큐에 추가하고 병렬로 실행할 수 있다.
	- 비동기 작업을 큐에 추가하여 순차적으로 처리할 수 있도록 한다. 이를 통해 작업의 흐름을 제어하고, 병렬로 실행할 수 있는 작업 수를 조정하여 성능을 극대화할 수 있다.

이번 포스팅에서는 ~~조금 귀찮으니까~~ `p-limit`만 테스트해보려고 한다.

## 실습

---

투머치 과도한 비동기 API 요청을 실행하는 코드로 직접 테스트를 진행해보자.

```tsx
import pLimit from "p-limit";

const urls = Array.from(
  { length: 100 },
  (_, i) => `https://jsonplaceholder.typicode.com/todos/${i + 1}`
);

const output = document.getElementById("output");
const log = (msg) => {
  console.log(msg);
  output.textContent += msg + "\n";
};

async function runTest() {
  output.textContent = "";
  log("테스트 시작...\n");

  // 방법 1: 무제한 Promise.all
  console.time("unlimited");
  await Promise.all(urls.map((url) => fetch(url)));
  console.timeEnd("unlimited");
  log("방법1: 무제한 Promise.all 완료\n");

  // 방법 2: p-limit으로 제한 동시 실행
  console.time("limited");
  const limit = pLimit(6); // 동시 최대 6개
  await Promise.all(urls.map((url) => limit(() => fetch(url))));
  console.timeEnd("limited");
  log("방법2: p-limit 제한 실행 완료\n");

  log("모든 테스트 완료!");
}

document.getElementById("run").addEventListener("click", runTest);
```

실행 결과는 다음과 같다.

```
테스트 시작...

unlimited: 772.262939453125 ms
방법1: 무제한 Promise.all 완료

limited: 468.774169921875 ms
방법2: p-limit 제한 실행 완료

모든 테스트 완료!
```

`p-limit`을 사용한, limited 버전이 **약 40% 정도** 더 빠르다. (실행할 때마다 차이는 있다.)

네트워크 창을 보면, `Promise.all` 버전은 한 번에 100개의 요청을 다 보내고 기다리고 있다.

<img src="../../assets/async-parallel-procesing/01.png" />
<br />

반면, `p-limit` 버전은 정확히 브라우저 최대 요청 개수인 6개씩 요청을 끊어서 보내고 있다.

<img src="../../assets/async-parallel-procesing/02.png" />
<br />

마치 웨이팅 많은 핫플 또는 콘서트장에서 사람들이 안내요원의 지시대로 n명씩 줄 서서 입장하는 것이 훨씬 더 효율적이라는 바를 시사하는 것 같다.

> **⏱️ 프론트엔드 실행 시간 측정하기**
> - `console.time()`~`console.timeEnd()`로 실행 시간을 측정할 수 있다.
> - 이름을 라벨링하여 측정한 시간의 내용을 구분할 수도 있다

## 동시성 처리가 중요한 이유

---
    
위 테스트 결과에도 불구하고, 귀찮게 줄 서는 대신에 그냥 꾸역꾸역 밀고 들어가는 게 더 빠르다고 생각하는 사람들도 있다. ~~내가 딱 싫어하는 스타일~~ 

과연 `p-limit`이나 `fastq`와 같은 라이브러리를 사용하면서까지 동시 실행의 개수를 제한해야 하는 것일까? 동시 실행은 많으면 많을 수록 좋은 것이 아닌가?

→ 답은 당연히 🙅‍♀️. 직관적으로는 동시 실행을 제한하면 느려질 것 같지만, 실제로는 **적절한 제한이 오히려 성능을 향상**시키는 경우가 많다.

왜 너무 많은 동시 요청이 문제가 될까?

1. **브라우저 연결 제한**

브라우저는 **도메인당 보통 6-8개의 동시 연결**만 허용한다. 100개를 동시에 요청해도 실제로는 6개만 실행되고 나머지는 대기하게 된다.

```tsx
// ❌ 100개 요청을 동시에 보내면?
const promises = urls.map(url => fetch(url)); // 대부분이 대기 상태

// ✅ 6개씩 제한하면 더 빠를 수 있음
const limit = pLimit(6);
const promises = urls.map(url => limit(() => fetch(url)));
```

2. **서버 부하와 응답 지연**

이눔의 서버는 참 약하기 그지없다.

서버가 과부하되면 모든 요청이 느려진다.

1000개 동시 요청을 하는 경우 → 각각 5초 대기해야 할 수도 있지만,

10개씩 순차 처리하는 경우 → 각각 0.5초만에 처리할 수 있다.

몸이 약한 서버 대신 강인한 프론트엔드 개발자가 힘써야 한다. 💪 

3. **메모리 사용량**

이 무더운 한여름에 맥북이 불타는 것을 방지하기 위해, 메모리 사용량도 고려하지 않을 수 없다.

```tsx
// ❌ 메모리 급증
const heavyTasks = bigDataArray.map(data => 
	processHeavyData(data) // 1000개 동시 실행
);

// ✅ 메모리 안정적
const limit = pLimit(4);
const heavyTasks = bigDataArray.map(data => 
	limit(() => processHeavyData(data)) // 4개씩만 실행
);
```

일반적으로 알려진 최적의 동시성 수치는 다음과 같다.

- **외부 API**: 6-10개 (서버 정책에 따라)
- **파일 처리**: 2-4개 (I/O 병목)
- **CPU 작업**: CPU 코어 수만큼
- **메모리 집약적**: 2-3개

즉, 다음과 같이 사용할 수 있다.

```tsx
// 일반적인 가이드라인
const webApiLimit = pLimit(6);     // 웹 API 호출
const fileUploadLimit = pLimit(3); // 파일 업로드
const heavyTaskLimit = pLimit(2);  // CPU 집약적 작업
const imageProcessLimit = pLimit(4); // 이미지 처리
```

> 👩‍🏫 결론: 적절한 동시성 제한은 전체적인 처리량(throughput)을 높이고, 시스템 안정성을 보장하며, 사용자 경험을 개선합니다. 무제한 동시 실행은 오히려 병목을 만들어 성능을 저하시키는 경우가 많습니다.

## 예외 케이스

---

하지만 동시성 처리로 이득을 보기 어려운 예외적인 경우도 있다.

```tsx
// 내부 캐시된 데이터나 매우 빠른 작업은 제한 불필요
const cachedData = ids.map(id => getCachedData(id)); // 제한 없이 해도 OK

// 하지만 외부 의존성이 있으면 제한 필요
const apiData = ids.map(id => 
    limit(() => fetchFromExternalAPI(id)) // 제한 필요
);
```

사실 위 실험에서도 첫 번째 실행은 `p-limit`으로 실행 제한을 둔 버전이 `Promise.all` 실행보다 빨랐지만,

두 번째 이후부터는 `Promise.all` 버전이 더 빨라졌다. 심지어 횟수를 거듭하면 10배나 빨라지는 경우도 있었다.

실험이 망했다고 생각하여 이 공들인 포스팅을 날릴까 했지만, 마음을 가다듬고 이유를 찾아보았다.

원인은 단순히 `Promise.all`과 `p-limit`의 차이가 아니라 **캐싱, TCP 연결, 브라우저 최적화** 때문이다.

- 동일 URL은 브라우저가 HTTP 캐시를 활용하여 거의 즉시 반환하기 때문에 두 번째 요청부터는 `Promise.all`이 더 빠를 수 있다.
- 또 두 번째 요청부터는 HTTP Keep-Alive 기능으로 이미 열린 TCP 커넥션을 사용하여 요청이 더 빨라진다.

이런 이유로 실무에서는 다음과 같이 사용한다고 한다.

- 실제 API 호출 부담이 크거나 서버 제한이 있다면 → `p-limit`을 사용
- 테스트용, 캐시가 많은 경우 → `Promise.all`이 더 빠름

## 마치며

---

프론트에서 이렇게 100개씩 비동기 호출을 할 일은 없다고 생각했는데,

특수 도메인에서 요청 하나 당 많은 시간이 소요되는 API를 10개 이상 병렬적으로 처리하다 보니 해결하고 싶었던 문제.

AI는 이렇게 발전하고 있는데 왜 아직도 HTTP 동시 연결 개수는 그렇게 작게 제한되어 있는지 참으로 개탄스러운 일이지만.

이런 열악한 환경 속에서도 프론트엔드 개발자는 어떻게든 답을 찾아낸다... 👊 

## References

---

- https://npm-compare.com/ko-KR/fastq,p-limit
- https://developer.mozilla.org/en-US/docs/Web/API/console/time_static