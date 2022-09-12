---
title: 우테코 36주차 기록
date: 2021-10-23 17:07:08
tags: woowacourse
---

할로윈 테마 | 테스트가 펑펑

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 놀토 프로젝트

지난주 마무리되었다고 생각했던 refreshToken은 만료 시 accessToken의 자동 업데이트가 되지 않았고… 😵 문제는 백엔드에서 유효기간을 잘못 내려주고 있던 것에 있었다. 여차저차 잘 해결했다.

지난 9월 중순 나름의 인기였던 추석 테마를 끝내고, 10월 마지막 주인 다음주에 진행될 마지막 데모데이를 위한 할로윈 테마를 적용했다.

<img src="01.png" />

footer도 만들었다. 나름 귀엽고 깔끔하다고 생각한다. github, email, 그리고 우테코 홍보용인 구글 사이트 링크를 첨부했다.

<img src="02.png" />

그런데! React 18로 이전하고 테스트를 한번도 제대로 돌리지 않아서 그랬을까. 모든 테스트가 우수수수 터져버렸다. 🤯 정말 못 살아…
일단 어떻게든 고치는 중인데, 참 막막하긴 하다.

---

## 프론트엔드 공부

### Inversion of Control

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/23/ioc/)

---

## 공부하기

### Flux로의 카툰 안내서

Redux를 사용하다보니, Flux 패턴이 프론트엔드 면접 단골 질문이라는 사실을 잊었다. 정말 오랜만에 Flux 패턴을 설명한 아래 링크의 카툰을 다시 살펴봤다.

Flux는 앱의 상태를 관리하기 위한 패턴 중 하나로, Facebook이 갖고 있떤 특정한 문제점들을 해결하기 위해 개발되었다.

기존에는 앱에서 사용자와의 상호작용이 View를 통해서 일어났기 때문에 사용자의 입력에 따라 View가 Model을 직접 업데이트하는 경우들이 있었다. 그리고 의존성 탓에 한 Model이 다른 Model을 업데이트해야할 때도 있었다.

아래와 같은 사태가 일어나기도 한다.
<img src="03.png" width="480px" />

이러한 복잡한 변경들 탓에 데이터 흐름의 디버깅은 결국 꼬이고 만다.

해결책으로 등장한 것이 **단방향의 데이터 흐름**이다.

<img src="04.png" width="560px" />

✔️ **액션 생성자(action creator)** 는 모든 변경사항과 사용자와의 상호작용이 거치는 액션의 생성을 담당한다. 앱의 상태를 변경시키거나 View를 업데이트하고 싶다면 액션을 생성해야 한다.
액션 생성자는 타입(type)과 페이로드(payload)를 포함한 액션을 생성한다. 액션 생성자는 액션 메시지를 생성한 이후 디스패처(dispatcher)로 넘겨준다.

✔️ **디스패쳐(dispatcher)** 는 액션을 보낼 필요가 있는 모든 스토어(store)를 가지며, 액션 생성자로부터 액션이 넘어오면 여러 스토어에 액션을 넘긴다. 이 처리는 동기적으로 실행된다. 다른 아키텍쳐들과는 달리 Flux 아키텍쳐에서 디스패쳐는 액션 타입과는 상관없이 등록된 모든 스토어로 액션을 보낸다.

✔️ **스토어(store)** 는 앱 내 모든 상태와 그와 관련된 로직을 갖고 있다. 모든 상태 변경은 스토어에서 결정된다. 스토어에 상태 변경을 요청하기 위해서는 반드시 액션 생성자-디스패쳐를 거쳐 액션을 보내야 한다.
일단 스토어에서 상태 변경이 완료되면, 변경 이벤트를 내보내 View에 상태가 변경되었다는 것을 알려준다.

✔️ **뷰(View)** 는 받은 데이터를 처리해 유저가 실제로 보는 화면을 구성한다.
(사실 구체적으로는 Controller View와 일반 View로 더 구분할 수 있지만, Controller View를 자주 사용해보지 않아서 여기서는 View 하나로만 작성했다.)

**Ref** https://bestalign.github.io/translation/cartoon-guide-to-flux/

---

## 기타

### OKR

Objective and Key Results

- Objective - 목표에 대한 정성적인 설명
- KR - 이것을 달성했다는 것을 알려주는 구체적인 수치

👎 **Bad**
구성원의 동기부여되는 목표보다 성과를 내기 위한 구체적인 수치를 먼저 정하는 실수
➡️ 동기부여가 아닌 압박이 될 수 있다. Objective는 단순하지만 영감을 주고 동기를 부여하기 위해 존재한다. Objective는 정성적인 문장으로 작성해야 한다.

👍 **Good**
Key Results는 구체적인 수치가 들어가면 좋다. 목표가 실현될 수 있도록 구체적으로 측정하고 피드백할 수 있어야 한다.
Key Results가 모두 달성되었을 때, Objective가 달성되었는지에 대한 점검이 반드시 필요하다. Key Results는 Objective를 달성하기 위한 구체적인 지표일 뿐 아니라 결과여야 한다.

지금 나의 OKR은?
(비밀)

**Ref**
https://brunch.co.kr/@tanagement/183
http://blog.hwahae.co.kr/all/tech/tech-tech/3737/

### `monitorEvents`

크롬 개발자 도구에서 `monitorEvents(object [, events])` API를 사용해서 특정 이벤트만 모니터링해볼 수 있다.

특정 함수를 모니터링하는 `monitor(function)`도 있다!

```jsx
function sum(x, y) {
  return x + y;
}
monitor(sum);
```

<img src="05.png" />

싱기방기

**Ref**
https://developers.google.com/web/updates/2015/05/quickly-monitor-events-from-the-console-panel
https://developer.chrome.com/docs/devtools/console/utilities/#monitor-function

### Incremental DOM과 Virtual DOM 비교

Virtual DOM은 UI 가상 표현을 메모리상에 두고 재조정(Reconciliation) 과정을 통해 실제 DOM이 업데이트된 부분만 렌더링하는 과정을 거친다.

Incremental DOM은 코드 변경 시 메모리상에 실제 DOM에 대한 Virtual DOM을 생성하지 않고, 새로운 렌더 트리와 차이를 비교하는 데 실제 DOM을 사용한다. 메모리에 따로 저장하는 데이터가 없기 때문에, 메모리를 효율적으로 사용할 수 있어 휴대전화와 같이 메모리가 작은 장치에서 사용할 때 이점이 된다.

또 Incremental DOM은 명령 묶음을 통해 모든 컴포넌트를 컴파일한다. 이 명령들은 DOM 트리를 생성하고 변경점을 찾아낸다. 컴파일 시점에 불필요한 명령들을 제거하여 트리쉐이킹이 가능해진다. (Virtual DOM은 인터프리터로 사용되기 때문에 트리쉐이킹이 불가능하다.)

Incremental DOM은 기존 Virtual DOM에서 발생하는 메모리 사용량의 문제를 줄이고, Virtual DOM끼리 비교하는 계산 과정의 오버헤드를 줄인다. 그러나 DOM 업데이트 간의 차이를 계산하는 데 Virtual DOM보다 더 많은 시간을 쓰기 때문에 대부분의 경우 Virtual DOM보다 느리다. (뭐람..🤔)

**Ref** https://ui.toast.com/weekly-pick/ko_20210819

### 네이버 FE 1년차 후기

> FE개발은 생각보다 개발에 온전히 집중하기보다 일정 안에 프로젝트를 완성하기 위해 기획안을 조절하는 데 초점이 맞춰진다

FE개발이란 무엇일까… 🤔

> 모든 이의 사랑/평화/우정 을 위해 책임감을 가지고 내 일을 제때 해내는 성실함이 중요하다

그렇다. 기획/디자인/백엔드/마크업과 모두 합이 잘 맞아야 하는 것이다…으아아 😵

> 혼자 일하다 쉬는 시간의 반복이다보니 인맥이 쌓이기보단 뱃살만 쌓이는 것이다. SNS 를 둘러보면 정말 많은 분들이 업무 외 활동을 하시는데 존경스러울 뿐이다.

🤣🤣🤣 웃픈 인생이다…

**Ref** https://velog.io/@kim-taewoo/내가-개발자가-될-상인가-네이버-FE-1년차-후기

---

## 마무리

하나 둘 취업에 성공하는 크루도 있고, 아쉽게 떨어지는 크루도 있다. 나 역시도 수 차례 떨어져봐서 그 허탈함을 잘 안다. 모두가 힘든 시기라고 한다.

사실 나는 그렇게 바쁘지도 않고, 싱숭생숭하지도 않고, 별 생각이 없다. 그보다는 무릎을 다친 탓에 운동을 못해서 힘든 게 가장 크다. (힘이 없다.) 이럴 때일수록 더욱 크루들과 이야기하고, 서로 힘이 되어주는 게 좋을 것 같다.
