---
title: React App s3 & Cloudfront로 배포하기
date: 2021-08-28 20:46:00
tags: [aws, frontend]
thumbnailImage: https://i.imgur.com/vxZVNXR.png
---

React App s3 & Cloudfront로 배포하기

<!-- more -->

리액트로 만든 앱을 s3와 Cloudfront를 이용해 배포해 보자!

### 1. s3 bucket 생성

s3 bucket을 생성하고, 모든 퍼블릭 액세스를 차단해준다. 이후 생성할 cloudfront에서만 해당 버킷으로 접근이 가능하도록 설정해줄 것이다.

<img src="01.png" />

### (필요 시) 2. 정적 웹 사이트 호스팅 활성화

s3 버킷의 [속성]에서 정적 웹 사이트 호스팅을 활성화 해준다. 사실 cloudfront를 이용하여 정적 웹 사이트를 호스팅할 경우 필요하지 않은 부분이다. cloudfront를 이용하지 않고 s3 버킷의 도메인을 이용해서 정적 웹 사이트 호스팅을 해준다면 정적 웹 사이트 호스팅을 활성화해준다. 이때 도메인 접속을 위해 퍼블릭 액세스 차단을 모두 해제하거나 버킷 정책을 따로 만들어 설정해줘야 한다.

<img src="02.png" />

### 3. 빌드 후 번들 파일 업로드

`yarn build` 후 생성된 `dist` 폴더 안의 파일들을 업로드해준다.

<img src="03.png" />

### 4. Cloudfront distribution 생성

cloudfront를 통해 방금 만든 s3 버킷에 접근해보자. 우측 [배포 생성] 버튼을 누른다.

<img src="04.png" />

원본 오리진으로 앞서 만든 s3 버킷을 선택해주고, 새 OAI를 생성한다.

OAI는 Origin Access Identity의 약자로, CloudFront에서 OAI를 사용하여 버킷의 파일을 액세스해 사용자에게 제공할 수 있도록 S3 버킷 권한을 구성할 수 있다.

<img src="05.png" width="560px" />

그러면 현재 cloudfront에 연결된 s3 버킷에 자동으로 버킷 정책이 추가된다.

<img src="06.png" />

자동 객체 압축은 Yes로, 뷰어 프로토콜 정책은 Redirect HTTP to HTTPS로 설정해 준다. (cloudfront에서 제공하는 기본 보안 정책이다.)

<img src="07.png" width="560px" />

### 5. 캐시 정책 설정

cloudfront는 aws에서 제공하는 CDN으로, 오리진 서버까지 가지 않고 리소스를 가져오는 캐시 기능을 사용할 수 있다. 기본으로 제공되는 CachingOptimized를 선택해주었다.

<img src="08.png" />

이렇게 하면 cloudfront 기본 설정은 끝난다. [확인] 버튼을 눌러준다.

### 6. 기본 객체 루트 및 오류 페이지 응답 편집

cloudfront 대시보드의 일반 → 설정 → 편집에서 기본값 루트 객체를 리액트 앱의 진입점인 `index.html`로 설정해 준다.

<img src="09.png" />
<img src="09-1.png" />

마지막으로 cloudfront 대시보드의 [오류 페이지] 탭에서 오류 시 돌아갈 응답 페이지를 입력해준다. (react로 SPA 개발 시 router를 사용한다면 체크해줘야 할 부분이다.)

<img src="10.png" />

### 7. 확인!

이제 cloudfront 도메인을 통해 사이트를 확인할 수 있다 👾
