---
title: 우테코 33주차 기록
date: 2021-10-02 18:59:50
tags: woowacourse
thumbnailImage: https://i.imgur.com/bHl7fHd.jpg
---

SSR | 웹 접근성 미션 | EC2 배포

<!-- more -->

---

## 놀토 프로젝트

이번주는 수업이 너무 많았어서, 수업만 듣고 SSR 하다가 다 끝났다. 다음주엔 수업이 더 많다! 😵

마지막 스프린트인 만큼 백엔드 팀원들과의 협업도 거의 없었고, 프론트 페어인 미키와 SSR, refreshToken에 대해서만 실컷 논의하다 끝났다.

---

## 프론트엔드

### SSR

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/02/ssr/)

### AWS EC2로 Next.js 서버 배포하기

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/02/ec2-next/)

### React 18 (alpha)

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/03/react-18/)

---

## 공부하기

### 웹 접근성 미션

React로 간단한 SpinButton 컴포넌트를 만들고, 웹 접근성을 최대한 높일 수 있게끔 개선하는 과제를 수행했다. lighthouse의 Accessibility 점수, WAVE 등의 툴에서 에러 없이 높은 점수를 받을 뿐 아니라 실제 스크린리더를 통해 읽었을 때 문제없는 앱을 만들기 위해 고민했다. 맥북의 VoiceOver를 사용했는데, 상세한 세팅 방법을 봐도 정말 모르겠다 😵 음성도 너무 쩌렁쩌렁하고… 눈으로 모니터를 보는 데 어려움이 있는 분들이 정말 웹서비스를 이용하기가 어렵겠다는 생각이 들었다.

`aria-` 속성은 우테코 과정을 진행하며 처음 알게 되었는데, 수 개월이 지나서 이제서야 실제로 제대로 써본다. [레진의 WAI-ARIA 가이드라인](https://github.com/lezhin/accessibility/blob/master/aria/README.md)과 [MDN WAI-ARIA Basics](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics)를 많이 참고했다.

이번 미션에서 사용하거나 참고한 `aria-` 속성들은 다음과 같다.

**✔️ aria-labelledby, aria-label, aria-describedby**
모두 현재 요소에 설명을 제공하는 속성이다. `aria-label` 속성은 값에 ‘간결한’ 설명(string)을 직접 제공한다. `aria-labelledby`는 다른 태그의 id 속성과 연결지어 함께 사용한다. (`aria-describedby`도 마찬가지다.)

**✔️ aria-hidden**
접근성 API(보조기기 접근 가능성) 차단 상태를 결정한다. 화면에 표시하지만 잠시 사용을 제한하는 콘텐츠에 적용한다.

**✔️ aria-live**
실시간으로 내용을 갱신하는 영역을 의미한다. 값으로 `polite`, `assertive`, `off(default`)를 설정할 수 있으며 갱신하는 내용의 중요도에 따라 선택한다.

`polite` 값은 중요도가 낮은 내용에 사용하여 현재 진행중인 음성 또는 타이핑을 방해하지 않고 뒤늦게 전달한다. `assertive` 값은 중요도가 높은 내용에 사용하여 현재 진행중인 보조기기 작업을 중단하고 갱신 내용을 즉시 사용자에게 전달한다.

`alert="role"`이면 `aria-live`가 암묵적으로 `assertive`가 된다.

**✔️ aria-relevant**
`aria-live` 영역에 발생한 변화를 묘사하기 위해서 사용한다.

**✔️ aria-disabled**
일반적으로 disabled된 버튼은 흐릿하게 변하지만, 시각적인 어려움을 겪는 유저의 경우 알아차리기 힘들다. 게다가 disabled 속성의 버튼은 스크린리더가 읽어주지 않기 때문에 `aria-disabled`를 사용한다.

**✔️ aria-invalid**
주로 input 요소에 선언하여 사용자가 입력한 값이 요구하는 형식과 일치하는지 여부를 나타낸다.
`aria-errormessage` 속성과 함께 사용하여 오류 설명을 제공할 수 있다.

**✔️ aria-atomic=”true”**
영역의 일부만 변경되었더라도 스크린리더가 전체를 읽을 수 있게끔 설정한다.

**✔️ aria-current**
현재 맥락과 일치하는 항목을 의미한다. token 값으로 `page|step|location|date|time|true|false(default)` 중 하나를 사용할 수 있다.

**✔️ aria-valuemin/ aria-valuemax**
`role`이 `slider`, `spinbutton`, `progressbar`일 때 사용하는 속성이다. 스크린리더가 읽어주지는 않는다.

`role`을 붙여 콘텐츠의 역할을 명시해줄 수도 있다.
ex) `role=status`는 성공(또는 결과) 상태 메시지를 사용자에게 전달한다. 사용자의 현재 작업을 방해하지 않고(초점을 옮기지 않고) 보조기기 사용자에게 메시지를 전달하는 것을 의도로 한다.

[MDN](https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA/ARIA_Techniques)에서 기타 다양한 role 속성들을 확인할 수 있다.

React에서 [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) 플러그인을 설치하여 JSX 구문에 대하여 a11y(Accessibility) 검사를 수행할 수 있다. CRA가 기본으로 제공하는 a11y 검사 기능도 있지만, 더 많은 부분을 체크하기 위해 사용한다.

### CDN 알아보자

**✅ 리소스 전달(Resource delivery)**
CDN을 사용하는 것은 오리진 서버에서 리소스를 가져오는 것보다 빠르다. 하지만 CDN이 오리진 서버와 connection을 유지하는 비용도 발생한다. CDN과 오리진 서버 사이의 connection은 대역폭을 더 넓게 사용하거나, CDN과 오리진 서버 사이에 여러 개의 CDN을 배치하는 방식을 사용한다.

**✅ 캐싱(Caching)**
CDN에 리소스를 캐싱하는 경우 클라이언트 요청 시 오리진 서버에서 매번 리소스를 받아올 필요가 없다. 이는 리소스 전달 속도를 높이고 오리진 서버의 부하를 줄여준다.

가장 일반적인 CDN 캐시 사용 방식은 CDN이 필요 시 리소스를 받아오는 것이다. 첫 번째 요청이 발생하면 CDN은 오리진 서버로부터 리소스를 받아와 응답을 캐시한다.

캐시의 스토리지 용량은 제한적이기 때문에, 최근에 요청되지 않은 데이터의 캐시를 지워 용량을 확보한다. 또는 리소스의 변경 시 purging을 통해 캐시를 강제로 지워줄 수도 있다. purging을 사용할 때는 태그를 사용해서 캐시된 리소스를 구분할 수 있다.

**✅ CDN 선택하기(Choosing a CDN)**
CDN 선택에 있어서 일반적으로 ‘성능’이 가장 중요한 고려사항이지만, CDN이 제공하는 보안 또는 분석과 같은 다른 기능들도 살펴볼 필요가 있다.

CDN의 성능은 지연을 최소화하는 것과 캐시 히트 비율(cache hit ratio)를 최대화하는 것에 달려있다. 또 CDN의 성능은 지역에 따라 달라지기도 한다.

이에 더해 CDN은 로드밸런싱/이미지 최적화/비디오 스트리밍/엣지 컴퓨팅/보안 등의 기능을 제공한다.

**✅ CDN 설정**
CDN의 CHR(Cache Hit Ratio)를 높이기 위해서는 로직상으로 동일한 서버 응답이 따로따로 캐시되지 않도록 해야 한다. 서버 응답은 query params(순서), cookies, 리퀘스트 헤더에 따라 서로 다른 것으로 해석될 수 있다.

TTL(Time To Live) 값을 높여 불필요한 오리진 서버로의 접근을 줄여주는 것도 CHR 개선에 도움이 된다.

CDN 캐싱 기능을 사용하기 위해서는 아래 헤더 중 하나를 사용해야 한다.

```
Cache-Control: max-age
Cache-Control: s-maxage
Expires
```

여기에 더해 `Cache-Control: immutable`를 추가하여 캐시된 리소스가 신선한(freshness) 동안에는 업데이트되지 않음을 명시해줄 수 있다. 브라우저는 브라우저 캐시로부터 가져온 리소스를 재검증(revalidate)하지 않아 불필요한 서버 요청을 보내지 않는다. (Firefox와 Safari에서만 지원한다 - Chrome은 지원하지 않는다고 한다 😈)

이밖에도 파일 튜닝, `Vary` 헤더, `Set-Cookie` 등이 CDN의 캐싱 기능에 영향을 줄 수 있으니 주의하자!

**✅ CDN 성능 개선**

- CDN의 리소스는 `gzip`이나 `brotli` 등을 통해 압축할 수 있다. 성능을 가장 최적화하는 방식은 오리진 서버와 CDN에서 모두 `brotli` 방식의 압축을 하는 것이다.
- TLS 1.3 (Transport Layer Security)을 사용하여 TLS 1.2에 비해 더 나은 보안과 성능을 제공할 수 있다. TLS 1.3은 기존의 핸드셰이크 과정을 줄여준다.
- HTTP/2을 사용하면 멀티플렉싱, 스트림 우선순위 결정, 서버 푸쉬, 헤더 압축 등의 기능을 사용할 수 있다.
- 2020년부터 모든 메이저 브라우저에서 실험적으로 지원하고 있는 HTTP/3을 사용하면 head-of-line blocking을 제거하여 connection 셋업 시간을 단축시킬 수 있다. TCP 대신 UDP를 사용하여, 단일한 패킷 블록은 하나의 스트림만 블로킹하게끔 구현되었다.
- CDN은 exif 데이터를 제거하거나, webp등의 파일 확장자를 사용하는 방식으로 이미지 최적화를 진행한다. 또 HTML, CSS, JavaScript 파일에서 불필요한 코드를 제거하여 파일 크기를 최소화한다.

> 👾 가능한 모든 방식을 사용하여 콘텐츠를 최대한으로 캐시하자!

**Ref** https://web.dev/content-delivery-networks/

---

## 기타

### Github이 사용하는 Web Component

github은 vanilla JS를 사용한다고 한다! vanilla JS에서 제공하는 Web Component에서도 충분히 React.js같은 재사용 가능한 컴포넌트를 만들거나 lifecycle을 흉내낼 수 있다. 물론 React.js를 완전히 대체하는 것은 아니며, 서로 별개의 개념이다 😉

**Ref** https://www.youtube.com/watch?v=RtvSgptpfnY

### 크롬 개발자도구 디버깅 꿀팁 모음

Elements를 뜯어볼 때 유용한 팁들을 많이 소개하고 있다.

**Ref** https://blog.bitsrc.io/9-element-tab-features-in-chrome-devtools-for-effective-debugging-1b02aa8f000a

### devJang도 참여하는 Next Conf

**Ref** https://nextjs.org/conf/tickets/oct21/devJang?s=1

### 레진 WAI-ARIA 가이드라인

친절한 설명과 예시들까지 👍

**Ref** https://github.com/lezhin/accessibility/blob/master/aria/README.md

---

## 마무리

오징어게임을 결국 다 보고… “나 무서워~~~!”라는 유행어와 함께 총을 든 지그🔫가 되어버렸다.

요즘은 감정도 사라지고, 갈수록 해탈해 가는 느낌인 것 같다. 분명 피곤한 건 아닌데, 엄청 힘이 없다. 빨리 철분제를 사다 먹어야겠다. 머리가 텅 비어가는 느낌…! 감정이 줄어든 건 오히려 나은 점이 많은 것 같기도 한데, 장기적으로 좋은 건진 모르겠다 🤔
