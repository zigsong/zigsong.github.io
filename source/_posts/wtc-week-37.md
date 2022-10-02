---
title: 우테코 37주차 기록
date: 2021-10-27 16:54:48
tags: woowacourse
thumbnailImage: https://i.imgur.com/bHl7fHd.jpg
---

마지막 QA | 마지막 데모데이

<!-- more -->

---

## 놀토 프로젝트

놀토 프로젝트가 드디어 막을 내렸다. 며칠 동안 자잘한 (대부분은 UI) 버그들도 고치고, cookie도 수정하고, 구조 도식화도 하고, 거의 팀원들과 떠들기만 하고, 배포를 시도할 때마다 꼬여버리는 github도 겨우 해결했다. 아! 갈수록 난장판이 되어갔던 노션도 정리했다.

게더타운으로 진행된 데모데이는 생각보다도 훨씬 재밌고 바빴고 알찼다. 데모데이 전날 밤 우리 팀 부스를 화려하게 꾸미다가 혼나고 (…) 다같이 캐릭터 모자를 맞춰쓰고 열심히 뽈뽈 돌아다녔다. 초반 호객행위를 해서인지 많은 분들이 우리 부스에 와주셨고, 리뷰어님들도 많이 놀러와주셨다. 모두 아낌없는 칭찬과 조언을 해주셔서 더욱 자신감과 힘을 얻을 수 있었다.

마지막으로 온라인 회식을 했다. 직접 만나고 싶었으나 한 팀원의 격리 때문에 😂

줌이 너무나도 익숙해져서인지 오디오가 쉴틈없이 이야기를 주고 받았다. 거의 술도 안먹었으면서. 정말 주제없는 이야기들을 주고받으며 많이 웃고, 또 팀원들의 숨겨진 스토리들을 들으며 서로 더 친밀해진 기분이다. 온라인으로 무려 4시간이나 떠들었다.

그동안 함께 해온 미키, 조엘, 아마찌, 포모, 찰리 그리고 항상 든든한 지원군이었던 코치 구구 정말 고마웠어요 ❤️ 우테코 3기중에 제일 귀여웠던 놀토 팀은 영원할거야

<img src="01.png" />

---

## 프론트엔드 공부

### 자바스크립트 반응형

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/31/js-reactivity/)

### 자바스크립트 Proxy

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/31/proxy-and-reflect/)

### npm은 어떻게 동작할까

🍀 [여기서 읽기](https://zigsong.github.io/2021/10/31/how-npm-works/)

---

## 공부하기

### 구글 SEO 기본 가이드

**✅ Google이 내 콘텐츠를 찾을 수 있도록 돕기**

- sitemap을 제출한다. sitemap은 사이트에 있는 파일로서 새 페이지나 변경된 페이지가 있을 때 이를 검색엔진에 알려준다.
- robots.txt를 사용하여 원치 않는 크롤링을 차단한다.

**✅ Google 및 사용자가 내 콘텐츠를 이해할 수 있도록 돕기**

- Google이 사용자와 같은 방식으로 내 페이지를 인식하도록 한다. Googlebot이 웹사이트에서 사용하는 자바스크립트, CSS, 이미지 파일에 항상 액세스할 수 있도록 허용한다.
- `<title>` 요소를 사용하여 고유하고 정확한 페이지 제목을 만든다. `<title>`은 간단하지만 설명이 담겨 있어야 하며, 각 페이지에 고유한 `<title>` 요소 텍스트가 있는 것이 좋다.
- 메타 설명 태그를 사용하여 페이지 내용을 요약하여 제공한다. 설명 메타 태그는 Google 검색 결과에서 페이지의 스니펫으로 사용할 수 있다.

**✅ Google 검색결과에 사이트가 표시되는 방식 관리하기**

- 페이지의 구조화된 데이터를 수정하여 Google 검색결과에서 여러 특별한 기능들을 사용해보자.

**✅ 사이트 계층 구조 구성하기**

- 검색엔진의 URL 사용 방식을 이해하자. 콘텐츠별로 고유한 URL을 사용하는 것이 좋다.
- 웹사이트 탐색 기능을 사용하여 방문자가 원하는 콘텐츠를 빨리 찾을 수 있도록 할 수 있다. breadcrumb 등의 UI로 탐색경로의 목록을 사용하거나, 사용자가 사용할 간단한 탐색 페이지를 만들 수 있다.
- 단순한 URL을 사용하여 콘텐츠 정보를 전달해야 한다.

**✅ 콘텐츠 최적화하기**

- 사이트를 재미있고 유용하게 만들어 자연스러운 입소문을 타게 한다(!)
- 독자가 무엇을 원하는지 이해하고 적절한 콘텐츠를 제공한다. Google Search Console은 인기 검색어를 제공한다.
- 사용자 신뢰를 구축하는 웹사이트를 만들고, 전문성과 권위를 명확히 드러낸다. 또 주제에 관해 적절한 양의 콘텐츠를 제공하는 것이 좋다.
- 주의를 분산시키는 광고를 표시하는 것은 지양하며, 사용자와 검색엔진이 탐색하기 쉽도록 링크를 현명하게 사용한다.

**✅ 이미지 최적화하기**

- HTML 이미지를 사용한다. `<img>` 또는 `<picture>` 요소 등의 시멘틱 마크업을 사용하면 크롤러가 이미지를 찾고 처리할 수 있다. 이미지에는 `alt` 속성을 사용해야 한다.
- 이미지 사이트맵을 사용하여 검색엔진의 탐색을 도울 수 있다.
- 표준 이미지 형식을 사용한다.

**✅ 사이트를 모바일 친화적으로 만들기**

- 모바일 전략을 선택하자. 반응형 웹 디자인, 동적 게재, 별도 URL 등을 구현할 수 있다.
- 색인이 정확하게 생성될 수 있도록 모바일 사이트를 구성한다.
- 웹사이트를 홍보하자. 소셜 미디어 사이트를 이해하고, 검색 실적 및 사용자 행동을 분석한다. 또 사이트 사용자의 행동을 분석한다.

**Ref**
https://developers.google.com/search/docs/beginner/seo-starter-guide?hl=ko
https://imweb.me/faq?mode=view&category=29&category2=35&idx=15573

### git tag 달기

배포할 때마다 매번 찾아봤던 git tag 달기. 우리는 `yarn`을 사용하기 때문에 `package.json`의 버전과 맞춰서 sematic versioning을 진행했다.

일반적으로 git tag를 다는 명령어는 아래와 같지만,

```
git tag -a v3.0.1 -m "nolto version 3.0.1"
```

`yarn`을 이용해서 `package`의 버전을 업데이트할 수 있다.

```
yarn version
```

<img src="02.png" />

원하는 버전을 입력하면, `package.json`의 `version` 항목과 함께 git tag도 새롭게 반영된 것을 확인할 수 있다.

### 사파리 모바일의 video playsinline 속성

애증의 사파리 모바일 🤯

메인 페이지의 다른 페이지로 이동했다가, 다시 돌아오면 메인 페이지에 로드되는 `<video>` 태그의 mp4 확장자 파일들이 모두 자동으로 전체화면으로 실행된다. 아래처럼…

<img src="03.gif" />

이렇게 정신사나울 수가 없다. 알고 보니 사파리 모바일에서는 모든 `<video>` 태그를 기본적으로 전체화면으로 실행한다고 한다. (대체 왜?)

그래서 `<video>` 태그에 `playsinline` 속성을 넣어줘야 하고, 문제는 다행히 해결되었다.

<img src="04.gif" />

### nginx gzip 설정

프론트엔드를 SSR 서버로 운영하게 되면서 더 이상 정적 호스팅을 위한 cloudfront를 사용할 필요가 없게 되고, 그리하여 cloudfront의 기본 gzip 옵션을 사용할 수 없게 되었다. gzip을 이용하지 않으면 자바스크립트 번들 파일의 크기가 전혀 줄어들지 않은 채로 브라우저에 렌더링되기 때문에, 방법을 찾아야 했다.

현재 서버로 사용중인 express에서도 gzip을 설정할 수 있지만, express 공식 문서에서는 만약 nginx를 사용한다면 nginx에서 gzip을 설정하라고 권고하고 있다. 기본적으로 nginx 역시 cloudfront와 같은 캐시 프록시 역할을 하므로, nginx에서 파일 압축을 수행하는 것이 맞다는 생각이 들었다. 또 express 서버에 파일 압축 업무를 추가하는 건 부담이 될 수도 있으니까?

사용중인 ssh에 접속하여 nginx 설정 파일을 수정해주면 된다.

```
vim /etc/nginx/nginx.conf
```

그리고 gzip과 관련된 설정들을 추가한다. 직접 작성하려고 했는데, 주석처리가 되어있어서 필요한 부분들의 주석을 풀어줬다.

```
##
# Gzip Settings
##

gzip on;
gzip_proxied any;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

`gzip`, `gzip_proxied`, `gzip_type` 설정을 만져줬다.

- `gzip`: `on`으로 gzip 설정을 켜준다.
- `gzip_proxied`: proxy나 캐시 서버에서 요청할 경우 동작 여부를 설정한다. `any`로 지정하면 항상 압축하게 된다.
- `gzip_type`: `text/javascript`도 gzip 대상 파일로 설정한다.

**Ref**
https://expressjs.com/ko/advanced/best-practice-performance.html
http://nginx.org/en/docs/http/ngx_http_gzip_module.html#gzip_types
https://www.lesstif.com/system-admin/nginx-gzip-59343019.html

### SSL이 도대체 뭔가요?

SSL은 Secure Sockets Layer의 약자로, 인터넷으로 통신을 할 때 보안 통신을 하기 위한 전자 파일이다. SSL 인증서를 서버에 설치하여 SSL 프로토콜을 이용한 보안 통신을 할 수 있다.

최근에는 TLS라는 용어가 더 많이 사용되고 있다. TLS는 Transport Layer Security의 약자로 SSL 3.0 기반의 표준화된 인증 방식이다. 요즘은 SSL보다는 TLS 방식을 더 권장하고 있다.

VeriSign이나 Comodo, 그리고 AWS까지 유료 SSL인증서를 발급해주는 기관도 있고, Let’s Encrypt와 같이 무료 인증서를 발급해주는 곳도 있다. 유료와 무료 SSL 인증서 간에 기술적인 차이점은 없다. 다만 유료 SSL 인증서의 경우 인증서를 사용한 사이트에 인증 관련 문제가 생겼을 시 유료 인증서 발급 기관에서는 일정 부분을 배상하게 된다. 무료 인증서의 경우 이러한 배상 체계가 존재하지 않는다.

**Ref** https://devlog.jwgo.kr/2019/04/12/what-is-ssl/

### scrollIntoView

모든 페이지의 하단에 footer를 추가하니 마이페이지에 스크롤이 생겼고, 그로 인해 새로운 문제를 발견했다.

아래처럼 `scrollIntoView`를 통해 부드러운 swipe 효과를 내고 있었는데,

```jsx
selectedTab.current.scrollIntoView();
```

수평 방향의 스크롤이 발생함과 동시에 수직 방향으로는 화면의 아래쪽으로 쑥 꺼져버리는 것이었다!

<img src="05.gif" />

`scrollIntoView`의 속성을 잘 몰라서 발생한 문제였다.

`scrollIntoView`의 `block` 옵션은 요소가 스크롤 가능한 조상에서부터 수직 방향으로 어떻게 정렬될지 결정하는 옵션이다.

- `{ block: 'start' }` - 요소는 조상 요소의 최상단에 위치한다.

- `{ block: 'center' }` - 요소는 조상 요소의 중간에 위치한다.

- `{ block: 'end' }` - 요소는 조상 요소의 최하단에 위치한다.

- `{ block: 'nearest' }`

  - 요소가 조상 요소보다 아래 있다면, 요소는 조상 요소의 최상단에 위치한다.
  - 요소가 조상 요소보다 위에 있다면, 요소는 조상 요소의 최하단에 위치한다.
  - 요소가 이미 보이는 상태라면, 그 자리에 있는다.

기본값이 `start`로 설정되어 있었기 때문에, 스크롤 가능한 영역에서 수직 방향으로 최상단에 재정렬되어 화면은 아래쪽으로 밀려난 것이었다.

요소가 이미 보이는 상태기 때문에, 수직 방향으로 가만히 있게끔 `{ block: 'nearest' }`를 걸어주었다.

```jsx
selectedTab.current.scrollIntoView({ block: "nearest" });
```

<img src="06.gif" />

문제 해결!

**Ref** https://stackoverflow.com/questions/48634459/scrollintoview-block-vs-inline

### FE Conf - 컴포넌트, 다시 생각하기

당근마켓 원지혁님의 FE Conf 발표영상이다.

컴포넌트의 의존성에 기반하여 React 컴포넌트를 분리하는 하나의 관점을 설명한다.

**✅ 비슷한 관심사끼리 함께 두기**
비슷한 관심사라면 가까운 곳에 둠으로써 코드의 사용성을 높인다. 대표적으로 하나의 컴포넌트에서 사용하는 스타일(styled-components 등)과 로직(custom hooks)는 컴포넌트 파일에 내재하거나, 동일한 폴더 내에 다른 파일에서 관리할 수 있다.

**✅ 데이터를 ID 기반으로 정리하기**
특정 interface를 가지고 있는 모델 인스턴스 데이터를 다른 컴포넌트에 통째로 넘겨주는 것이 아니라, 필요한 데이터의 id만 넘겨준다. Global ID(또는 Node ID)는 도메인 내에서 유일성을 갖는 ID 체계로, API 요청 시 Global ID를 전달하여 데이터를 가져올 수 있다. 이러한 방식을 GOI(Global Objet Identification)이라고 부른다.

```tsx
interface Props {
  articleId: string;
}

const Something: React.ExoticComponent<Props> = (props) => {
  const article = useNode({ on: "Article" }, props.articleId);

  return (
    <div>
      <h1>{article.title}</h1>
    </div>
  );
};
```

`useNode`와 같은 컨셉은 GraphQL과 Relay에서 차용했다고 한다.

**✅ 이름 짓기 - 의존한다면 그대로 드러낸다.**
아래와 같은 interface보다는,

```tsx
interface Props {
  leftImageThumbnailUrl: string;
  title: string;
  title2: string;
  caption: string;
  rightDotColor: string;
  rightcaption: string;
}
```

다음 interface가 모델 간의 연결 정보를 더욱 명확하게 드러내고 있다.

```tsx
interface Props {
  user: {
    name: string;
    nickname: string;
    totalFollowerCount: number;
    lastActivityAt: Date;
    image: {
      thumbnailUrl: string;
    };
  };
}
```

그러나 이 경우 props로 데이터를 넘겨주는 상위 컴포넌트가 항상 정확하게 타이핑을 해서 데이터를 보내줘야 한다는 문제가 있다. 이때 다시 한번 전역 ID를 통해 필요한 객체의 레퍼런스만 받아와 의존성이 느슨한, 재사용 가능한 컴포넌트를 만들 수 있다.

**4. ✅ 모델 기준으로 컴포넌트 분리하기**
얼핏 보면 거의 비슷한 두 컴포넌트가 있다. 이럴 때 기존에 있던 컴포넌트를 재사용할지, 아니면 복사해서 새 컴포넌트로 분리할지 고민이 된다. (실제로 엄청 많이 마주한 문제다!)

발표에서는 다음과 같은 기준을 제시한다.

> **같은 모델**을 의존하는 컴포넌트는 **재사용**,
> **다른 모델**을 갖는 컴포넌트는 **분리**하자.

이를 위해 리모트 데이터 스키마(API 데이터)를 주의깊게 관찰해야 한다.

마지막으로 인상 깊었던 조언!

> “**질문**이 정답보다 중요하다”
> “**관점**이 기술보다 중요하다”
> 그리고, 기술 도입이 성공하기 위해서는 **유저 경험에 이르기까지** 영향을 미칠 수 있어야 한다.

프론트엔드 개발자로서 가져야 할 좋은 마인드!

**Ref** https://www.youtube.com/watch?v=HYgKBvLr49c

---

## 기타

### 자바스크립트로 오징어게임 만들기

진짜 광기..

**Ref** https://dev.to/0shuvo0/i-made-squid-game-with-javascript-10j9

### 개발자 김민준님 인터뷰

모두가 공감하는 말, 좋은 동료들이 최고의 복지다!

**Ref** https://www.youtube.com/watch?v=pf9Rj3GKhBA

### Apple system-ui를 대체할 폰트, Pretendard

데모데이날 리뷰어 발리스타님이 오셔서 추천해주고 가셨다. Apple의 system-ui 폰트들과 Noto Sans의 아쉬운 점들을 보완한, 크로스 플랫폼을 지원하는 폰트다. (윈도우에서도 사용 가능!)

**Ref** https://cactus.tistory.com/306

### development mode는 어떻게 동작하는가?

**Ref** https://overreacted.io/how-does-the-development-mode-work/

### 언어별로 부동소수점 알려주는 사이트

도메인이 진짜 광기…

**Ref** https://0.30000000000000004.com/

### A레코드 vs CNAME

도메인 네임을 다는 두 가지 대표적인 방법

- A레코드 - EC2 등을 이용한 ip 주소에 직접 걸어준다.
- CNAME - AWS cloudfront를 이용하면 `https://d2y0p6hv0hkdrd.cloudfront.net`과 같은 랜덤 네임을 자동으로 붙여주는데, 그에 CNAME으로 별칭과 같이 이름을 붙여준다.

### 면접관은 도대체 무슨 생각을 할까?

썸네일은 크게 와닿지 않는데, 최근 본 영상들 중에 가장 인상 깊었다.

**Ref** https://www.youtube.com/watch?v=7ye03TMi5SU&t=333s

### 캡틴 로이드의 ‘잘 정리된 이력서보다 중요한 것’

**✅ 지원동기가 명확한가**
“동기”를 어떻게 만들어낼지 판단하게 된다. ‘동기부여’는 누군가 주입하는 것이 아니라, 스스로 하는 것이다.

**✅ 어떻게 일하는가**
혼자서 일하는 회사는 없다. 어떤 규모에서, 어떤 사람들과 함께 일했는지를 밝히자.

**✅ 퍼포먼스를 내는가**
회사는 현재 조직에 없는 사람, 더 나은 성과를 낼 수 있는 사람을 기대한다. 같은 일을 할 때 더 큰 성과를 낼 수 있음을 증명해야 한다.

과정만큼 결과는 중요하고, 퍼포먼스를 ‘내고 싶은 것’과 ‘내왔던 것’은 다르다.

**✅ 어려움을 겪었는가**
어려움의 경험은 스스로 성찰하는가를 알게 하며, 어려움의 경험 이후로 실제로 성장했는지 알게 한다.

**✅ 본인에 대해 잘 이해하는가**
팀과 나의 지향점이 맞는지를 판단하게 한다.

그리고 최근 어디선가 들은 질문,

> 내가 시니어 개발자라면, 누굴 뽑을 것인가?

**Ref** https://minieetea.com/2021/04/archives/6193

---

## 마무리

이렇게 레벨 4가 끝났다. 모든 프로젝트, 미션이 끝났다. 그와 동시에 이제 피할 수 없는 시간이 찾아왔다. 위드코로나가 시작되는 다음주부터는 루터에 등교해도 되고, 이제 2주만 있으면 우형 면접이다. 12월까지 이어지는 면접 전형이 너무 길다고 생각했는데, 생각해보면 어쩔 수 없는 결정이었던 것 같다.

결과에 상관없이 우테코가 끝나면 필히 오열할 것이라고 했는데, 데모데이가 끝난 지금 아직 오열하진 않았다. 조금(많이) 뭉클하긴 했다. 어쩜 조와…

<img src="07.png" />
