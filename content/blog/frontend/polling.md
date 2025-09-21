---
title: 폴링 사용하기
date: 2025-09-20 18:21:01
tags: ["frontend"]
description: 폴링~ 이대로 폴~링 포유~ 
---

폴링은 클라이언트가 서버에게 주기적으로 "새로운 데이터가 있나요?"라고 물어보는 통신 방식이다. 

전통적인 HTTP 통신은 기본적으로 **요청-응답** 방식으로, 서버가 먼저 클라이언트에게 데이터를 보낼 수 없다. 클라이언트가 요청해야만 서버가 응답을 할 수 있다.

다음과 같은 실시간성이 필요한 상황들에선 HTTP의 사용이 제한적일 수밖에 없으며, 폴링을 사용하는 것이 권장된다.

- 채팅 메시지 확인
- 주식 가격 업데이트
- 배송 상태 추적
- 온라인 게임 상태
- 소셜미디어 알림

### 폴링의 작동 방식

폴링의 작동 방식은 다음과 같다. 

1. **설정된 간격**마다 클라이언트가 서버에 요청
2. 서버는 **현재 상태**를 응답으로 전송
3. 클라이언트는 응답을 받아 **UI 업데이트** -> **반복**

### 폴링의 장단점 

폴링의 장단점은 다음과 같다.

- 장점
	- **간단한 구현**: 기존 HTTP API 그대로 활용
	- **호환성**: 모든 브라우저에서 동작
	- **쉬운 디버깅**: 일반적인 HTTP 요청이므로 추적 용이
	- **연결 관리 불필요**: 각 요청이 독립적
- 단점
	- **네트워크 낭비**: 변경사항이 없어도 계속 요청
	- **서버 부하**: 많은 클라이언트가 동시에 폴링하면 부하 증가
	- **배터리 소모**: 모바일에서 지속적인 네트워크 사용
	- **지연 시간**: 실제 변경과 감지 사이에 최대 폴링 간격만큼 지연

폴링 사용 시에는, 네트워크 낭비와 서버 부하를 줄이기 위해 폴링 간격 설정에 유의해야 한다. 

- 너무 짧은 간격 (1초 미만)
	- 장점: 거의 실시간
	- 단점: 서버 부하 심각, 배터리 소모 많음
	- 적용: 주식 거래, 온라인 게임

- 적당한 간격 (3-10초)
	- 장점: 부하와 실시간성의 균형
	- 단점: 약간의 지연 존재
	- 적용: 채팅, 알림, 상태 모니터링

- 긴 간격 (30초-5분)
	- 장점: 서버 부하 최소, 배터리 절약
	- 단점: 실시간성 떨어짐
	- 적용: 이메일 확인, 뉴스 업데이트

### 폴링 최적화 전략

폴링의 단점들을 극복하기 위한 최적화 전략들도 고려해볼 수 있다. 

**1. 적응형 폴링 (Adaptive Polling)**
- 활동 중일 때: 3초 간격
- 비활성 상태: 30초 간격
- 백그라운드: 폴링 중지

**2. 조건부 폴링**
- 특정 상태일 때만 폴링
	- 주문 상태가 "배송 중"일 때만
	- 채팅방에 있을 때만
	- 중요한 작업 진행 중일 때만

**3. 백오프 전략 (Backoff)**
- 성공: 정상 간격 유지
- 실패: 점진적으로 간격 증가 (1초 → 2초 → 4초 → ...)
- 복구: 다시 정상 간격으로

### 폴링의 대안들

폴링은 완벽한 해결책은 아니지만, 많은 상황에서 **간단하고 신뢰할 수 있는** 실시간 업데이트 방법이다. 중요한 것은 적절한 간격을 설정하고, 필요에 따라 다른 기술과 조합해서 사용하는 것이다.

때로는 폴링 대신 다른 통신 방식을 사용하는 것이 더 바람직한 경우도 있다. 

1. **웹소켓 (WebSocket)**
	- 장점: 진짜 실시간, 양방향 통신
	- 단점: 복잡함, 연결 관리 필요
	- 용도: 채팅, 협업 도구, 게임

2. **Server-Sent Events (SSE)**
	- 장점: 서버→클라이언트 실시간 푸시
	- 단점: 단방향, IE 지원 안됨
	- 용도: 알림, 라이브 스코어

3. **푸시 알림**
	- 장점: 앱이 꺼져있어도 동작
	- 단점: 모바일 전용, 설정 복잡
	- 용도: 뉴스, 메시지 알림

### React에서 폴링 구현법

이제 본격적으로 프론트엔드, 구체적으로는 React에서 폴링을 구현하는 방법을 살펴보자. 

**1. 기본 폴링 패턴 - setInterval**
        
```jsx
import { useState, useEffect } from 'react';

function BasicPolling() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdate, setLastUpdate] = useState(null);

	// API 호출 함수
	const fetchData = async () => {
		try {
			setError(null);
			// 실제로는 여러분의 API 엔드포인트를 사용하세요
			const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
			const result = await response.json();
			
			setData(result);
			setLastUpdate(new Date());
			setLoading(false);
		} catch (err) {
			setError(err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		// 컴포넌트 마운트 시 즉시 데이터 가져오기
		fetchData();
		
		// 5초마다 폴링
		const intervalId = setInterval(() => {
			fetchData();
		}, 5000);
	
		// 컴포넌트 언마운트 시 인터벌 정리 (중요!)
		return () => {
			clearInterval(intervalId);
		};
	}, []); // 빈 의존성 배열 = 컴포넌트 마운트 시에만 실행

	return (
		// ... 
	)
}

export default BasicPolling;
```
        
**2. Promise와 setTimeout**
        
`setInterval` 대신 `Promise`와 `setTimeout`을 조합하면 더 유연하고 제어 가능한 폴링을 구현할 수 있다. 이 방식의 주요 장점은 **이전 요청이 완료된 후에 다음 요청을 시작**한다는 점이다.

Promise + setTimeout 방식은 여러 가지 방식으로 유연하게 사용할 수 있다. 

첫 번째로, **Sequential Polling (순차 폴링)** 이다. 이전 요청이 끝날 때까지 기다렸다가, 요청이 완료되면 다음 요청을 스케줄한다. 

```jsx
const poll = async () => {
	try {
		await fetchData(); // 완료까지 대기
	} catch (error) {
		console.error(error);
	}
	
	// 완료 후 다음 폴링 스케줄
	setTimeout(poll, delay);
};
```

두 번째로, **Dynamic Delay (동적 지연)** 이다. 첫 번째 요청 이후, 응답 시간에 따라 다음 요청을 동적으로 조절할 수 있다. 

```jsx
const poll = async () => {
	const startTime = Date.now();
	await fetchData();
	const responseTime = Date.now() - startTime;
	
	// 응답 시간에 따라 동적 조절
	const delay = responseTime > 2000 ? 10000 : 5000;
	setTimeout(poll, delay);
};
```

세 번째로, **Conditional Polling (조건부 폴링)** 이다. 특정 조건을 만족하면 폴링을 중지시키거나, 조건에 따라 폴링의 간격을 조절할 수 있다.

```jsx
const poll = async () => {
	const result = await fetchData();
	
	// 특정 조건에서 폴링 중지
	if (result.status === 'completed') {
		return; // 폴링 종료
	}
	
	// 조건에 따라 다른 간격
	const delay = result.status === 'processing' ? 2000 : 5000;
	setTimeout(poll, delay);
};
```
        
**3. while과 delay**

while과 delay를 사용하여 보다 전통적인(?) 방식으로 폴링을 구현할 수도 있다. 
        
```jsx
const result = await requestLocalAuthentication({
	funnelId: 28,
	alwaysAuthenticate: true,
});

if (result === true) {
	pollingStatus.current = 'POLLING';
	const intervalData: { retried: number; registered: boolean | null } = { retried: 0, registered: null };

	while (intervalData.retried < 5 && intervalData.registered !== true) {
		try {
			const result = await fetchCreditAgreementStatus();

			intervalData.registered = result.registered;
		} catch {
			intervalData.retried += 1;
		}

		await delay(500);
	}

	if (intervalData.registered === true) {
		pollingStatus.current = 'FINISHED';
		onSuccess();
	}
} else {
	openAlert({ title: t`오류가 발생했어요. \n잠시 후 다시 시도해주세요.` });
}
```

직관적이긴 하지만 개인적으로 조금 올드한 것 같다. 🙄

**4. react query의 refetchInterval 사용**

마지막으로, 가장 fancy하지만 프레임워크의 제약을 받는 react query 사용 방식.
        
```jsx
const { data } = useQuery({
	queryKey: ['data'],
	queryFn: fetchData,
	refetchInterval: 5000, // 5초마다 폴링
});
```

코드도 초 씸플하다! 

## 마무리

실무에서 데이터를 받아올 때, 폴링을 사용할 일이 생겨 간단하게 폴링의 목적과 사용 방식, 실제 코드 레벨의 구현까지 살펴보았다. 

생각했던 것보다도 훨씬 더 다양한 방식으로 구현할 수 있는 만큼, 사용 목적과 전략에 따라 적절한 방식을 선택하면 좋을 것 같다 🙂 