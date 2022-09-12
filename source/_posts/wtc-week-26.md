---
title: 우테코 26주차 기록
date: 2021-08-01 17:43:25
tags: woowacourse
---

우테코 26주차 기록

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 놀토 프로젝트

### AWS 이전

고마운 배겐 팀원들 덕에 무사히(!) 프론트 서버 AWS 이전에 성공했다. 젠킨스도 연동하고. 아직 알 수 없는 내용 투성이지만 어느 정도 개념은 잡혀간다. [더보기](https://zigsong.github.io/2021/08/01/woowa-week-26/#AWS-EC2로-배포하기)

### 시멘틱 버저닝

3차 데모데이 이전 v2.0.1 배포 완료! [더보기](https://zigsong.github.io/2021/08/01/woowa-week-26/#시멘틱-버저닝과-github-tag)

### 테스트

미키와 열띤 논의 끝에 작은 단위에서부터 bottom-up 방식으로 유닛 테스트를 진행하기로 했다. react-query hook을 테스트해줄 [react-hooks-testing-library](https://react-hooks-testing-library.com/)와 지난 지하철 미션 나를 그토록 괴롭혔던 [msw](https://mswjs.io/)도 사용하게 되었다. [더보기](https://zigsong.github.io/2021/08/01/woowa-week-26/#react-hook-test)

아직 컴포넌트 단위의 테스트는 시작하지 못했는데, 걱정이 조금 되기도 한다. 😩

---

## 프론트엔드 공부

### TypeScript type guard

🍀 [여기서 읽기](https://zigsong.github.io/2021/08/01/fe-ts-type-guard/)

### react hook test

🍀 [여기서 읽기](https://zigsong.github.io/2021/08/01/fe-hook-test/)

---

## 공부하기

### flex-basis

flex-basis는 flex 아이템의 기본 크기를 설정한다. flex-basis에는 width, height에 들어갈 수 있는 단위들을 입력하거나 컨텐츠의 크기에 맞게 조절되는 값을 넣어줄 수 있다.

```css
.item {
  flex-basis: 10em;
  flex-basis: 3px;
  flex-basis: auto;

  /* 원본 크기 키워드 */
  flex-basis: fill;
  flex-basis: max-content;
  flex-basis: min-content;
  flex-basis: fit-content;
}
```

`flex-grow`는 아이템이 `flex-basis`의 값보다 커질 수 있는지를 결정하는 속성이다. `flex-grow`의 값이 0보다 크다면 해당 아이템은 원래의 크기보다 커져 flex container의 나머지 빈 공간을 채우게 된다. (`flex-basis`가 0일 때, `flex-grow`는 flex 값과 같다.)

flexbox 내 아이템의 width와 `flex-grow` 속성을 통해 flexbox에 꽉 차는 화면을 구성할 수 있다.

<img src="01.png" />

`flex-shrink`는 아이템이 `flex-basis`의 값보다 작아질 수 있는지를 결정한다. `flex-shrink`의 값이 0보다 크다면 해당 아이템은 `flex-basis`보다 작아진다. `flex-shrink`의 값을 0으로 설정하면 아이템의 크기가 `flex-basis`보다 작아지지 않기 때문에 고정폭의 컬럼을 쉽게 만들 수 있다. (고정 크기는 width로 설정한다.)

flexbox 내 아이템의 `flex-shrink` 속성을 통해 아이템의 컨텐츠를 변경하지 않고서도 고정된 너비를 유지할 수 있다.

<img src="02.png" />

**Ref**

- https://developer.mozilla.org/ko/docs/Web/CSS/flex-basis
- https://studiomeal.com/archives/197

### 시멘틱 버저닝과 github tag

시멘틱 버저닝은 소프트웨어의 버전 변경 규칙에 대한 제안으로, 줄여서 **SemVer**라고도 부른다.

- **Major**: 하위 버전과 호환성이 깨질 수 있는 API 변경사항. breaking change가 발생했을 때를 가리키기도 한다.
- **Minor**: 하위 호환성은 지키면서 새로운 기능이 추가된 상황
- **Patch**: 기능 범위 내에서 버그가 수정된 상황

github의 tag 기능을 이용하여 서비스의 버전을 명시할 수 있으며, 원하는 tag에서 release를 작성할 수 있다.
[facebook의 react팀 release 노트](https://github.com/facebook/react/releases)를 참고해서 작성해 보았다.

<img src="03.png" />

아직 정식 배포를 하지 않은 초기 개발 단계기 때문에 `v0.1.0`으로 시작했고, 기능 추가와 버그 수정을 거쳐 `v0.2.1`을 배포했다.

**Ref**

- https://semver.org/lang/ko/
- https://github.com/facebook/react/releases

### AWS EC2로 배포하기

🧩 **EC2**
EC2(Elastic Compute Cloud)는 AWS에서 제공하는 클라우드 컴퓨팅 서비스로, 원격으로 가상의 컴퓨터를 사용할 수 있는 기능이다.각각의 컴퓨터는 ‘인스턴스’라고 부르며, 지역(region)을 선택할 수 있다.

온디맨드 방식으로 용량을 자유자재로 늘리거나 줄일 수 있으며, 사용한 만큼만 비용을 지불한다. 사용자가 인스턴스를 완전히 제어할 수 있으며, 보안 및 네트워크 구성, 스토리지 관리에 효과적이다.

EC2 인스턴스를 생성하고 운영체제, CPU, 메모리, 스토리지, 네트워킹 용량 등을 선택한다. 이후 보안을 위해 키 페어(public key + private key)를 선택하고, 생성된 `.pem` 파일을 다운로드 받는다.

> 👾 이 키 페어를 잃어버리면 다시는 인스턴스에 접근할 수 없다!

EC2 인스턴스를 원격으로 제어할 수 있는 shell을 웹을 통해서도 열 수 있지만, 로컬에서 제어하기 위해 SSH 클라이언트를 이용할 수도 있다. 로컬의 `.pem` 키가 저장된 곳에서 ssh 명령어로 인스턴스에 연결한다.

```
ssh -i [프라이빗 키(.pem)경로] [AMI의 사용자 이름]@[인스턴스의 퍼블릭 DNS]
```

`sudo apt update`를 통해 리눅스를 최신 버전으로 업데이트하고, apache 등의 웹서버를 설치한다. 이제 EC2 인스턴스의 웹 서버를 통해 접속할 수 있다. IPv4 또는 이에 해당하는 DNS를 통해 접속할 수 있다.

이때 방화벽 문제로 접속할 수가 없다면? 인바운드/아웃바운드 규칙을 설정한다.

- 인바운드 - 외부에서 EC2 인스턴스로 접속하는 것. 보안 상 최소한으로 설정되어야 한다.
- 아웃바운드 - EC2 인스턴스에서 외부로 접속하는 것. 모두 열려있어야 한다.
  - 22번 포트는 SSH 통신을 위한 방식으로, 기본적으로 열려 있다.
  - 웹을 사용하기 위해서는 80번 포트도 열어야 한다.

> 👾 인스턴스 중지 후 재시작 시 IP 주소가 바뀜에 주의

🧩 **S3**
AWS S3(Simple Storage Service)는 인터넷 스토리리지 서비스로, 웹 규모의 컴퓨팅 작업을 보다 쉽게 할 수 있도록 설계되었다.

데이터 스토리지를 위한 기본 컨테이너인 S3 버킷을 만들고, 데이터를 저장하거나 다운로드한다. 이때 데이터를 업로드/다운로드하려는 사용자에게 권한을 부여하거나 제한할 수 있다. 사용한 스토리지만큼 요금이 청구된다는 장점이 있다.

단독 스토리지로도 사용할 수 있으며, EC2, EBS, Glacier와 같은 다른 AWS 서비스와도 함께 사용할 수 있어 클라우드 어플리케이션, 컨텐츠 배포, 백업 및 아카이빙 등의 사례에 알맞다.

🧩 **CloudFront**
Amazon CloudFront는 빠른 전송 속도로 데이터, 동영상, 애플리케이션 및 API를 사용자에게 안전하게 전송하는 CDN(Contents Delivery Network) 서비스다. `html`, `css`, `js` 및 이미지 파일과 같은 정적 및 동적 웹 콘텐츠를 사용자에게 더 빨리 배포하도록 지원한다.

CloudFront는 AWS 백본 네트워크를 통해 콘텐츠를 가장 효과적으로 서비스할 수 있는 엣지로 각 사용자 요청을 라우팅하여 콘텐츠 배포 속도를 높인다. 또한 파일(객체)의 사본이 전 세계 여러 엣지 로케이션에 유지(또는 캐시)되므로 안정성과 가용성이 향상된다.

Amazon S3 버킷 또는 고유 HTTP 서버와 같은 오리진 서버를 지정하고, CloudFront는 이로부터 파일을 가져온 다음 전 세계 CloudFront 엣지 로케이션에 배포한다.

> 👾 **캐싱 전략**
> CloudFront를 사용하면 기본적으로 캐시 시간(TTL)이 24시간으로 설정된다. 따라서 사용자가 배포된 기준으로 항상 최신 버전을 보게끔 해야 한다면, CloudFront의 캐싱 전략을 적절히 선택해야 한다.

> 🧩 **정리**
> React로 개발하여 번들링한 프론트엔드 빌드 결과물인 `index.html`과 `bundle.js`를 S3 버킷에 저장 후, CloudFront를 이용하여 사용자에게 보여준다!

**Ref**

- https://www.youtube.com/watch?v=Pv2yDJ2NKQA
- https://seoyeonhwng.medium.com/aws-ec2란-무엇인가-acf6b7041908
- https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/concepts.html
- https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/Welcome.html
- https://usefultoknow.tistory.com/entry/Amazon-S3란-무엇일까
- https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/Introduction.html
- https://aws.amazon.com/ko/premiumsupport/knowledge-center/cloudfront-serving-outdated-content-s3/

### 젠킨스 연동하기

젠킨스는 지속적 통합(CI; Continuous Integration)과 지속적 제공(CD; Continuous Delivery/Development) 통합 서비스를 제공하는 툴이다. git과 같은 버전관리 시스템과 연동하여 소스의 커밋을 감지하면 자동으로 테스트를 포함한 빌드가 실행되도록 설정할 수 있다.

젠킨스가 제공하는 대시보드를 통해 여러가지 배포 작업의 상황을 모니터링할 수 있다. AWS EC2에 젠킨스 서버를 띄워 사용할 수 있으며, 여러 젠킨스 플러그인을 설치할 수 있다.

github의 webhook을 통해 자동으로 젠킨스 Job을 실행할 수 있다. (merge를 포함한) push 이벤특 발생하면, 자동으로 젠킨스 Job이 실행되도록 한다.

**쉘 용어 정리**

- `TTL`: Time To Live의 약자로, 캐시가 살아 있는 시간을 의미한다.
- `sync`: aws s3와 싱크를 맞춘다.
- `--delete`: 로컬에서 삭제된 파일이 있는 경우, s3에서도 삭제한다.

최종적인 AWS + 젠킨스 실행 플로우는 아래와 같다.

<img src="04.png" />

**Ref**

- https://www.jenkins.io/doc/
- https://ict-nroo.tistory.com/31
- https://taetaetae.github.io/2018/02/08/github-web-hook-jenkins-job-excute/

### PrivateRoute

로그인하지 않은 상태에서 진입하면, 바로 튕기게끔 해주기 위해 Private Route를 구현했다.

로그인이 된 상태(`isLogin`)라면 `children`으로 넘긴 컴포넌트를 바로 렌더하고, 그렇지 않다면 로그인을 위한 창을 띄운 후 디폴트 페이지로 리다이렉트 해준다.

```tsx
interface Props extends RouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children, ...props }: Props) => {
  const { isLogin } = useMember();
  const modal = useModal();
  const notification = useNotification();

  const openLoginModal = () => {
    notification.confirm("로그인이 필요한 서비스입니다.", () =>
      modal.openModal(<LoginModal />)
    );
  };

  return (
    <Route
      {...props}
      render={({ location }) => {
        if (isLogin) {
          return children;
        } else {
          openLoginModal();

          return (
            <Redirect
              to={{
                pathname: ROUTE.HOME,
                state: {
                  from: location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
```

전체 route를 관리하는 최상단 컴포넌트에서 간단하게 사용할 수 있다.

```tsx
const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={ROUTE.HOME}>
          <Home />
        </Route>
        <Route exact path={ROUTE.ABOUT}>
          <About />
        </Route>
        <PrivateRoute path={ROUTE.UPLOAD}>
          <Upload />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};
```

아래와 같이 동작한다.
<img src="05.gif" />

**Ref** https://www.youtube.com/watch?v=Y0-qdp-XBJg

---

## etc

### github의 새로운 보안 정책

작업하던 중간에 github 연결이 한번 끊겼다! 정말 갑자기 remote 저장소에 푸쉬가 되지 않았다.

github 작업을 위해 패스워드를 사용해왔었는데, 8월부터는 패스워드 인증 방식 대신 토큰 기반 인증을 사용한다고 한다. 기존에 토큰 또는 SSH 기반의 인증을 사용했던 사용자의 경우 문제가 없었지만, 패스워드를 사용했던 본인의 경우에는 갑자기 Brownouts이 발생했던 것이다.

처음 마주하는 에러에 한 시간 동안 아무 작업도 하지 못한 채 울상이었는데, 아래 링크 글을 참조하여 다시 연결에 성공했다! 귀찮긴 하지만 보안 측면에서 필요한 작업인 것 같다.

**Ref** https://velog.io/@cookncoding/GitHub-암호-토큰-방식GitHub-Deprecation-Notice-메일-해결

### npm 모듈 크기 확인하기

성능 최적화를 고민하는 프론트엔드 개발자라면 사용하는 NPM 패키지들이 트리셰이킹을 지원하는지, ESM으로 되어있는지, 타입 정의가 있는지, 고민해볼 필요가 있다. [이곳](https://bundlephobia.com/)에서 사용 중인 라이브러리를 검사할 수 있다!

> 👾 **ESM**
> ES Modules로, JavaScript에서 [스탠다드 모듈 시스템](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)을 지원하는지 여부를 알려준다.

ESM을 통해 아래와 같은 import 방식을 사용할 수 있다.

```jsx
import React from "react";
```

ESM은 트리셰이킹을 지원하며, 번들러를 통해 불필요한 코드를 제거해준다.

**Ref**

- https://bundlephobia.com/
- https://irian.to/blogs/what-are-cjs-amd-umd-and-esm-in-javascript/

---

## 마무리

기능은 많이 못했지만 수많은 버그들을 잡고, CSS도 꼼꼼하게 정리했던 한 주였다. 글쓰기 과제도 하고, 인터뷰 스낵 스터디도 새로 시작했다. 주말까지 집에서 꼼짝도 못하고 정신없던 시간들.
올해 정신없다는 말을 가장 많이 쓰는 것 같다. 그래도 머리를 싸매던 문제들이 조금씩 풀려가면서 팀원들과 안도의 웃음이 터지는 순간은 정말 뿌듯하고 알 수 없는 기쁨이 몰려온다.

페어 미키가 따끔한 조언을 해줬다. 나도 내 의견이 있었으면 좋겠다고. 지난 프로젝트에서, 회사에서, 또는 다른 크루들이 썼다고 무조건 옳은 코드는 아닌데 편하고 익숙한 방식으로 그저 가져다 쓰자고 주장했던 상황들이 종종 보였나 보다. 분명 인지하고 있었던 문제인데, 버그는 계속 터지고 요구사항은 넘쳐나는 와중에 신경쓰지 못한 것 같다. 나를 위해 솔직하게 말해준 미키에게 정말 고마웠다! 초심으로 돌아가 본질을 찾는 연습을 꾸준히 해야겠다. 너무 무리하거나 일에 쫓겨 살지 않도록 신경도 쓰고.

마지막은 내가 만든 팀원들의 미모티콘!
<img src="06.png" />
