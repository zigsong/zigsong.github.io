---
title: 우테코 29주차 기록
date: 2021-08-28 17:12:12
tags: woowacourse
---

우아한테크코스 29주차

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 모의면접

오랜만에 보는 크루들과 함께 했던 순한 맛 모의면접

### 피드백

- 차분하게 잘 얘기한 것 같아서 좋았다.
- 기술 질문에 대해서는 술술 얘기했는데, 그에 비해 소프트 스킬에 대한 부분은 조금씩 막힘이 있는 것 같아서 보완해보면 좋지 않을까!
- 소프트 스킬 물어볼 때는 기술 질문 답할때에 비교해서 조금 논리가 덜하고 중복된 말이 많은 느낌
- 시선이 정면 유지를 잘 해서 좋았다.
- 문장이 긴 거 같긴 한데, 이해는 잘 되서 특별히 나쁘게 느끼진 않았다.
- 잘 정리된 문장으로 얘기해줘서 이해하기 좋았다.
- 몸을 계속 움직이는데 조금 줄이면 좋을 것 같다.
- 두괄식으로 답변을 잘 해준 것 같다.
- 평소 텐션과 다르게(!) 차분하게 잘해준 것 같다.
- 제스처를 적절하게 사용한다.
- 사용자 경험을 중요하게 생각한다는 부분을 경험(UT)을 곁들여서 얘기해줘서 진정성 있어 보였다.

### 질문 리스트

- react-query를 사용한 이유?
- swr에 대해 들어봤는지? swr대신 리액트 쿼리를 사용한 이유?
- 성능 분석을 어떤 식으로 진행했는가?
- 성능 개선은 어떤 식으로 진행했는가?
- lazy loading을 어떻게 구현할 수 있을까?
- 이미지가 화면에 실제 보였을 때를 어떻게 알 수 있을까?
- react hook form을 사용한 이유?
- react hook form을 사용하면서 어려웠던 점?
- css in css대신 css in js를 선택한 이유?
- 하나의 프로덕트를 완성하는데 가장 중요하다고 생각되는 부분이 무엇인가?
- 최근에 진행한 프로젝트에서 협의점을 찾아가는 경험?
- 좋은 프론트엔드 개발자란 무엇이라고 생각하는지?
- 10년 후의 나의 모습
  → 다른 사람들이 필요로 하는 개발자! 지식적인 부분이든, 팀 내 분위기를 띄워주는 역할으로든 😆

모두에게 주어졌던 피드백 중 하나는, 화상 면접에 대비한 시선처리 문제였다. 생각하느라고 잠시 옆이나 아래를 보게 되면 마치 어딘가를 보고 컨닝하는 것 같다.

그리고 커뮤니케이션 등 소프트 스킬에 대한 답변도 잘 준비가 되어있어야겠다. 기술 면접보다도 어려울 수 있다는 걸 처음 느꼈다.

---

## 프론트엔드 공부

### babel과 polyfill

🍀 [여기서 읽기](https://zigsong.github.io/2021/09/05/fe-babel-almost/)

### Web Server와 WAS

🍀 [여기서 읽기](https://zigsong.github.io/2021/09/12/fe-web-server-was/)

---

## 성능 최적화 미션

Lv4의 서문을 여는 성능 베이스캠프 미션! 파도 파도 끝이 없지만 많은 내용들을 알차게 배울 수 있었다.

🍀 [여기서 읽기](https://zigsong.github.io/2021/08/28/fe-performance-basecamp/)

---

## 공부하기

### Github Actions

Github Actions란 Github 저장소를 기반으로 소프트웨어 개발 workflow를 자동화할 수 있는 도구이다.

성능 미션을 진행하며, github에 push 이벤트가 발생했을 때 빌드 파일들을 s3 버킷에 자동으로 업로드해주기 위해 사용했다. 사실 우테코 S3 버킷에 직접 접근할 수 있는 권한이 없어서, AWS의 ACL(Access-Control-List) 기능을 사용해 우회해서 들어가주었다. 이 부분은 크루 [곤이의 글](https://yung-developer.tistory.com/111)에서 확인할 수 있다. cloudfront distribution도 invalidate 해주는 커맨드를 추가하고자 했으나, 잘 되지 않아 우선 보류 😬

간단한 workflow는 아래와 같다.

1. Checkout
2. node 설정
3. npm 및 yarn 설치
4. dependency 설치
5. 프로젝트 빌드 - 이때 환경변수에 필요한 `API_KEY`값을 넣어주었다.
6. aws s3 파일 동기화 - 환경변수에 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`이 필요하다.

완성된 최종 코드는 다음과 같다. `main` 브랜치에 push 이벤트가 발생하면 Github이 아래 과정들을 순차적으로 실행시켜준다.

```yaml
name: push_builder

on:
  push:
    branches: main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout source code
      uses: actions/checkout@v2

    - name: Setup node
      uses: actions/setup-node@v1
      with:
        node-version: '14'

    - run: npm install

    - name: Setup yarn
      run: npm install -g yarn

    - name: Install Dependencies
      run: yarn

    - name: Build
      run: yarn build
      env:
        GIPHY_API_KEY: ${{ secrets.GIPHY_API_KEY }}

    - name: S3 Deploy
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        AWS_DEFAULT_REGION: ${{ secrets.AWS_DEFAULT_REGION }}
      run: aws s3 sync ./dist s3://[s3-bucket-name]/ --acl bucket-owner-full-control
```

**Ref**
- https://yung-developer.tistory.com/111
- https://zzsza.github.io/development/2020/06/06/github-action/

### React App S3 & Cloudfront로 배포하기

리액트로 만든 앱을 S3와 Cloudfront를 이용해 배포해보자!

🍀 [여기서 읽기](https://zigsong.github.io/2021/08/28/fe-s3-cloudfront/)

---

## etc

### 얼렁뚱땅 도메인 붙이기 대작전

백엔드 크루 웨지의 도메인 붙이기 대장정. 생각보다 설정해줘야 할 것들이 많다!

**Ref** https://www.notion.so/2adc105ad25748d49d0e18f34d1150c8#76819d7a5c08402f875454bb45a3acad

### JavaScript 번들러로 본 조선시대 붕당의 이해

JavaScript 모듈 시스템의 등장 배경부터 CommonJS → AMD → UMD → ES6 Module로 이어지는 역사까지 재미있게 다루고 있다. 그 외에도 태스크 러너와 이제는 없어서는 안 될 webpack 등의 모듈 번들러까지 설명하고 있다.

**Ref** https://wormwlrm.github.io/2020/08/12/History-of-JavaScript-Modules-and-Bundlers.html

### react-icons

### babel + TypeScript

하나의 앱에서 두 컴파일러(트랜스파일러)를 함께 쓴다면?

**Ref** https://ui.toast.com/weekly-pick/ko_20181220

### 우아한형제들 채용 전문가 인터뷰

**Ref** https://www.youtube.com/watch?v=XJBIz-Z-Xds

### 독개’s 프론트엔드 성능 최적화의 모든 것

정말 대단한 크루 크리스 👍👍

**Ref** https://songwon2019.notion.site/Quick-Start-04fd057643ee4fb5b1439b5758e7814a

---

## 마무리

바쁘고 자존감 떨어지고 개발자 해도되나 생각까지 들었던 일주일이다. 아침에 눈 뜨는 게 무섭기까지 할 정도로 겁을 먹었다. 벌써 Lv4라 더욱 그런 듯하다.
