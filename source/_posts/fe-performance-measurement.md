---
title: 프론트엔드 성능 분석 & 기본 성능 개선
date: 2021-08-14 17:30:59
tags: frontend
thumbnailImage: https://i.imgur.com/2Dqm3wS.jpg
---

성능 측정 | bundle 압축 | 이미지 리사이징

<!-- more -->

---

성능 분석은 처음이라, 어디서부터 시작해야 하는지 감을 잡을 수 없었다. 다행히 페어와 많은 크루, 코치님들의 도움을 받아 작은 것부터 차근차근 성능을 측정하고 개선점을 찾아보았다.

아래 기준으로 환경을 세팅 후 측정했다.

```
🌐 Network | Fast 3G
🏃‍♀️ Performance | CPU 4x throttling
🖱 Disable Cache
🤫 Chrome Secret Mode
```

---

## ✅ Performance 측정

사용자들의 웹 경험에서 중요한 공통 집합인 **Core Web Vitals**는 아래와 같다.
<img src="01.png" />

- **Largest Contentful Paint**: 인식되는 로드 속도를 측정하는 항목으로, 페이지의 주요 콘텐츠가 로드되었을 가능성이 높은 시점에 페이지 로드 타임라인에 점을 표시한다.
- **First Input Delay**: 응답성을 측정하는 항목으로, 사용자가 페이지와 처음 상호 작용하려고 할 때 느끼는 경험을 정량화한다.
- **Cumulative Layout Shift**: 시각적 안정성을 측정하는 항목으로, 눈에 보이는 페이지 콘텐츠의 예기치 않은 레이아웃 변화량을 정량화한다.

크롬 개발자 도구의 Performance 패널에서 확인 가능한 **FCP(First ContentFul Paint)** 와 **LCP(Largest Contentful Paint)**, 추가적으로 **Onload** 이벤트가 실행되는 시점을 측정했다.

<img src="02.png" />

우리 서비스에서 hero element가 되는 중요한 요소들, 그리고 주요 기능이라고 생각하는 기능들에서의 인터랙션을 중심으로 성능을 측정했다. 이 역시 bundle 압축과 이미지 리사이징을 통해 시간을 많이 앞당길 수 있었다.

대부분의 Web Vitals는 아래와 같은 방식으로 개선이 가능하다.

1. JavaScript 최소화
2. CSS 블로킹 최소화
3. 리소스 최소화
4. network payload 최소화
5. polyfill 최소화

---

## ✅ bundle.js 압축하기

현재 프론트엔드 리소스는 CloudFront를 통해 받아오고 있다. 프론트엔드 스크립트의 번들링 결과인 `bundle.js`의 크기를 네트워크 탭을 통해 확인해 보니, 원본은 2.6MB에 달했으며 CDN을 통해 전송되는 용량도 571kB였다. 웹페이지를 로드하는 데 상당한 부분을 차지하는 만큼, 압축이 필요한 부분이다.

AWS CloudFront는 Behaviors에 들어가서, Cache Policy를 새로 설정하거나 기존 옵션을 변경하면 된다. 화면의 View Policy에 들어가서, `gzip`과 `brotli` 설정을 Enabled해준다.

<img src="03.png" />
<img src="04.png" />

그러면 네트워크 탭 Response Header의 `content-encoding` 항목에 `br`(brotli)이 표시되는 것을 알 수 있다.

> 👾 최종 사용자가 `gzip`과 `brotli` 두 형식을 모두 지원하는 경우, CloudFront는 brotli를 사용한다.

<img src="05.png" />

그렇게 해서 줄어든 `bundle.js`의 용량은?!

원본 570kB, 실제 브라우저에서 203kB가 되었다. 이후에는 Code Splitting과 tree-shaking 등을 통하여 bundle 파일을 더욱 최적화해 나갈 예정이다.

---

## ✅ 이미지 리사이징

아무래도 첫 화면부터 많은 이미지를 로드하고 있다보니, 초기 렌더링 속도가 아주아주 느렸다. 사용자가 정말 무거운 파일을 올리기라도 한다면, 로드해 오는 자원의 크기가 7MB를 넘을 정도.

<img src="06.png" />

서버 이미지 리사이징을 사용하여 이미지 용량을 줄일 수 있었다. 흔쾌히 도와준 백엔드 팀원들에게 감사하다는 말을 전한다. 🙇‍♀️ 일정 크기 이상의 이미지일 경우, 현재 최대 400px(너비, 높이 중 하나)로 이미지를 저장하여 받아온다.

---

## ✅ lighthouse 측정

측정할 때마다 결과가 다르게 나오는 lighthouse지만, 그래도 참고용으로 기록해두기로 했다.

**<bundle 압축, 이미지 리사이징 이전>**
<img src="07.png" />

**<bundle 압축, 이미지 리사이징 이후>**
<img src="08.png" />

조금이나마 점수가 개선된 것을 확인할 수 있다.

우리 프로젝트의 FE 성능 리포트는 계속해서 업데이트 중!
[📜 성능 리포트 바로가기](https://nolto.notion.site/3b32f3cbedbd4f3d9c01c53c0eafcac7)

---

**Ref**

- https://developers-kr.googleblog.com/2020/05/Introducing-Web-Vitals.html
- https://www.youtube.com/watch?v=cpE1dwJgS4c
- https://web.dev/lcp/
- https://medium.com/wantedjobs/react-profiler를-사용하여-성능-측정하기-5981dfb3d934
- https://ui.toast.com/weekly-pick/ko_202012101720
- https://medium.com/myrealtrip-product/fe-website-perf-part1-6ae5b10e3433
- https://medium.com/myrealtrip-product/fe-website-perf-part2-e0c7462ef822
