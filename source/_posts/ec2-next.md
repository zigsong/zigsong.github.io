---
title: EC2로 Next.js 앱 배포하기
date: 2021-10-02 18:45:33
tags: [aws, next]
thumbnailImage: https://i.imgur.com/vxZVNXR.png
---

EC2 | Next.js | Node.js | pm2 | nginx

<!-- more -->

SSR을 사용하는 next.js 앱을 EC2에 배포하려다가 이것도 하고 저것도 하고… 결국 주말 하루를 꼬박 날리고야 만 대장정을 시작해보려고 한다.

---

## 1. AWS 인스턴스 생성

aws 계정에 로그인한 후, EC2 대시보드에 들어가 우측 상단의 [인스턴스 시작] 버튼을 누른다.

<img src="01.png" />

### ✅ 단계 1: AMI 선택

AMI가 뭘까? (~~아미?~~ 🔫)

AMI는 Amazon Machine Image의 약자로, 인스턴스를 시작하는 데 필요한 정보를 제공한다. EC2 인스턴스와 같은 가상 서버들을 생성하는 데 필요한 마스터 이미지, 즉 운영체제에 필요한 템플릿을 캡쳐해 놓은 스냅샷 이미지와 같다.

호스팅 컴퓨터로 Ubuntu 18.04 버전의 SSD Volume type을 선택한다.

<img src="02.png" />

> 👾 **SSD란?**
> Solid State Disk의 약자로, 보조기억장치를 가리킨다.
> (그냥 궁금해서)

### ✅ 단계 2: 인스턴스 유형 선택

~~현재 테크코스의 계정으로 내 돈은 아니지만~~, 아무튼 간에 t2.micro 또는 t2.medium을 선택한다. 프리티어 이용 시 t2.micro만 사용 가능하다.

<img src="03.png" />

### ✅ 단계 3: 인스턴스 세부 정보 구성

VPC와 서브넷을 선택하고, 퍼블릭 IP를 활성화해준다. (노출되어도 상관없는 정보라고 믿어본다…)

<img src="04.png" />

**VPC**란 Virtual Private Cloud의 약자로, 사용자의 AWS 계정 전용 가상 네트워크다. VPC가 없다면 수많은 EC2 인스턴스들이 서로 거미줄처럼 연결되고 인터넷과 연결되어 복잡도를 증가시킬 것이다.
VPC를 적용하여 VPC별로 네트워크를 구성하고, 독립적으로 네트워크 설정을 줄 수 있다. 또, VPC를 사용하면 리소스 배치, 연결 및 보안을 포함하여 가상 네트워킹 환경을 제어할 수 있다

**서브넷**은 VPC의 IP 주소 범위를 가리킨다. VPC 내부의, VPC보다 더 작은 단위를 가리킨다. 더 많은 네트워크망을 만들기 위해 서브넷을 사용한다.

VPC와 서브넷은 아래와 같은 구조로 이루어져 있다.

<img src="05.png" />

> 👾 **EC2? VPC?**
>
> EC2는 computing service, VPC는 Virtual Private Cloud
> EC2는 VPC의 일부이며 EC2 인스턴스에 접근을 위해서는 VPC가 필요하다.

> 👾 **public IP vs private IP**
>
> **퍼블릭 IP 주소**는 인터넷을 통해 연결할 수 있는 IPv4 주소이다. 퍼블릭 주소는 인스턴스와 인터넷의 상호 통신을 위해 사용된다. 또한, 퍼블릭 IP 주소가 할당된 각 인스턴스에는 외부 DNS 호스트이름이 할당된다.
>
> **프라이빗 IP 주소**는 인터넷을 통해 연결할 수 없는 IP 주소이다. 프라이빗 IPv4 주소는 동일 VPC에서 인스턴스 간의 통신을 위해 사용될 수 있다. 즉 우리끼리, 내부 네트워크 내에서 위치를 찾아갈 때 사용한다. 이때 각각의 VPC는 완전히 독립적이기 때문에 VPC간 통신을 위한다면 VPC 피어링 서비스를 고려해볼 수 있다.

### ✅ 단계 4: 스토리지 추가

원하는 볼륨 크기를 설정한다. EC2의 하드디스크 용량을 설정하는 것이다. (30GiB 이상을 권장한다. 하지만 그냥 기본값으로 하고 넘어갔다. 내 돈이 아니니까…💸)

<img src="06.png" />

### ✅ 단계 5: 태그 추가

다른 사람의 서버와 구분할 수 있도록 `Name` 태그를 붙여준다.

<img src="07.png" />

### ✅ 단계 6: 보안 그룹 구성

보안 그룹 설정을 통해 EC2 인스턴스로 들어오고 나가는 트래픽을 세부적으로 제어할 수 있다.
ex) SSH 접속 포트는 22번, 서비스 기본 포트는 80번

현재 본인 소유의 계정이 아니므로, 새로 만들지 않고 기존의 보안 그룹을 선택해주었다.

- 인바운드 - 외부에서 인스턴스로 들어오는 요청
- 아웃바운드 - 인스턴스에서 외부로 나가는 트래픽

<img src="08.png" />

### ✅ 단계 7: 인스턴스 시작 검토

앞의 모든 단계 설정을 마무리했다면, 우측 하단의 [검토 및 시작]을 눌러 이전 단계의 설정들을 확인한 후, 키페어를 생성한다.

이 키페어는 SSH로 접속 시 필요한 키로, 한번 발급 받은 후 분실하면 다시 찾을 수 없으니 잘 보관해두자! 🔑
(`.pem` 파일 형식으로 생성된다)

<img src="09.png" width="560px" />

기본적으로 RSA 방식으로 암호화된 공개키-비밀키 형식의 키페어를 제공하지만, 올해 8월부터 제공하는 ED25519 방식의 키페어를 발급 받으면 더욱 높은 수준의 보안 시스템을 이용할 수 있다고 한다.

클라이언트의 SSH에서 AWS EC2 인스턴스에 접속할 때 키페어는 다음과 같은 과정을 통해 교환된다.

<img src="10.png" />

이렇게 EC2 인스턴스가 생성되었다! ~~고작~~ 첫 번째 단계가 끝났다 😑

<img src="11.png" />

---

## 2. SSH 접속

방금 만든 인스턴스를 클릭하고, [연결] 버튼을 눌러준다.

<img src="12.png" />

그러면 다음과 같이 친절하게 SSH 연결을 위한 커맨드를 알려준다.

<img src="13.png" />

로컬에서 발급받은 pem(키페어) 파일이 있는 위치로 이동하여, 시키는 대로 입력한다.

1. `chmod`(change mode)로 나(첫 번째)에게만 4(read) 즉 ‘읽기’ 권한을 제공하고, (그룹/전체에는 권한이 없다.)
2. public IP로 EC2 인스턴스에 접속한다.

```
$ chmod 400 KEY-zigsong-deploy-guidebook.pem
$ ssh -i "KEY-zigsong-deploy-guidebook.pem" ubuntu@ec2-13-125-205-164.ap-northeast-2.compute.amazonaws.com
```

이때, 첫 접속 시 다음과 같은 에러가 발생할 수 있다. 원격지의 호스트를 로컬에 연결할 때 첫 번째로 자격을 증명하기 위한 과정이다. ‘yes’를 선택하여 쭉 넘어간다.

<img src="14.png" />

정상적으로 실행되면 다음과 같이 원격지 호스트 컴퓨터인 EC2 인스턴스에 접속된다!

<img src="15.png" />

---

## 3. 프로젝트 세팅

Next.js로 (정말로) 간단하게 만든 페이지를 github에 올려두었다. SSH로 EC2에 접속한 상태에서, 해당 repository를 clone한다.

(내 레포를 클론해도 되겠지만, 간단한 라우팅 외에 아무것도 없으므로 아주 허탈할 것이다.)

```
$ git clone https://github.com/zigsong/a11y-airline.git
```

우선 node를 설치해준다. [다음 링크](https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)를 참조하여 설치를 진행했다.

```
$ sudo apt-get update # 기본적인 업데이트 진행
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
$ . ~/.nvm/nvm.sh
$ nvm install node
```

> **👾 apt-get vs yum**
> 크게 중요한 건 아닌 것 같지만, ssh에서 사용하는 명령어를 apt-get 방식으로 사용하는 곳도 있고, yum으로 사용하는 곳도 있다. 둘의 차이는 호스트가 RedHat 계열의 CentOS라면 yum을, Debian 계열의 Ubuntu라면 apt-get 방식을 사용하는 것이라고 한다. EC2 호스트 컴퓨터로 Ubuntu를 사용했기 때문에 되도록 apt-get 명령어를 사용했다.
>
> 자세한 내용이 궁금하다면 아래 출처를 확인해 보자.
> [Ubuntu apt(apt-get)와 Redhat/CentOS yum 명령어 비교표](https://www.lesstif.com/lpt/ubuntu-apt-apt-get-redhat-centos-yum-89555903.html) > [리눅스란 무엇인가? (센토스 vs 우분투)](https://coding-factory.tistory.com/318)

아래 명령어로 node.js가 올바르게 설치되었는지 확인한다.

```
$ node -e "console.log('Running Node.js ' + process.version)"
```

yarn을 설치하고,

```
$ curl -o- -L https://yarnpkg.com/install.sh | bash
```

프로젝트의 패키지들을 설치해준다.

```
$ yarn install
```

---

## 4. next.js 앱 custom 서버 설정

`next start` 커맨드를 사용하면 vercel에서 제공하는 기본 서버를 사용할 수 있지만, 여기서는 EC2 인스턴스에서 따로 서버를 관리할 것이기 때문에 커스텀 서버를 만들어줄 것이다.
(👾 `next start`만으로도 EC2 서버를 돌릴 수 있다고 한다! [크루 신세한탄의 글](https://eminent-grill-3b7.notion.site/next-js-EC2-9e611603a8d34994a710efa40654078d) 참고)

[next.js 공식문서](https://nextjs.org/docs/advanced-features/custom-server)를 참고하여 다음과 같이 express 서버 코드를 작성해 주었다.

```jsx
// server.js
const express = require("express");
// 커스텀 서버를 next app과 연결시켜 준다.
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 8080;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.get("*", (req, res) => handle(req, res));

  server.listen(PORT, () => {
    console.log(`> Ready on port ${PORT}`);
  });
});
```

next.js 커스텀 서버에서 사용하는 포트 번호는 EC2 인스턴스의 보안 그룹에서 인바운드 규칙에 포함되어 있어야 한다. 우테코 루트 계정을 사용하는 현재 보안 그룹에 따로 손을 댈 수 없어서, 기존 보안 그룹에 있는 8080 포트를 사용했다. ‘원본’의 ‘0.0.0.0/0’은 모든 소스를 허용함을 의미한다.

<img src="16.png" />

ssh 내부에서 아까 clone 받은 프로젝트 레포지토리로 들어가서, `next build`를 통해 커스텀 서버에서 관리할 파일을 생성한다. 실행 결과는 다음과 같다.

<img src="17.png" />

이제 `next start`로 서버를 실행해 준다. (모든 커맨드는 ssh 셸 안에서 이루어진다.)

인스턴스의 퍼블릭 IP 주소 또는 퍼블릭 DNS에 포트 ‘:8000’을 붙여 접속하면 정상적으로 next.js 앱이 뜨는 것을 확인할 수 있다.

<img src="18.png" />

**<그렇게 탄생한 앱>**
<img src="19.png" />

…앱이 아주 썰렁하다. 어쩔 수 없다.

---

## 5. pm2로 프로세스 관리

이렇게 열린 서버는 ssh 셸을 나가면 그대로 죽는다. 꽤나 허탈한 기분이다. node.js의 프로세스 매니저인 **pm2**를 사용하여 말로만 듣던, 엄청나게 멋져 보이던 ‘무중단 서비스’를 운영해 보자.

node.js는 기본적으로 싱글 스레드만 지원한다. pm2는 cluster 기능을 제공하여 최대 16개의 프로세스를 동시에 실행할 수 있게 해준다. 또 shell을 꺼도 계속 프로세스가 돌아갈 수 있도록 지원하며, 프로세스를 관찰하고 있다가 프로세스가 종료되면 다시 실행해줄 수 있다.

아래 명령어로 pm2를 설치해준다. (물론 여전히 ssh 셸에서, 우리의 next.js 앱 디렉토리 안에 있다.)

```
$ npm install pm2 -g
```

다음 명령어로 pm2가 관리할 새로운 프로세스를 실행한다.

```
$ pm2 start server.js
$ pm2 start server.js --name "next" # 프로세스 이름을 따로 지정하고 싶은 경우
```

`pm2 list` 명령어로 현재 실행중인 프로세스들을 확인할 수 있다.

<img src="20.png" />

이것저것 만져보며 프로세스를 일시정지하거나, 삭제하거나, error 시 재가동해 보자.

```
$ pm2 stop [id 또는 name]
$ pm2 restart [id 또는 name]
$ pm2 delete [id 또는 name]
$ pm2 start [id 또는 name] --watch # 코드가 변경되면 프로세스를 재시작한다.
```

pm2가 프로세스를 관리하고 있기 때문에, (오류가 발생하지 않는 한) 셸을 꺼도 서버는 계속 가동 중이다! (돈도 계속 나간다! 오예!)

> 이렇게 ssh에서 pm2로 프로세스를 관리하는 것은 foreground로 프로세스를 돌리는 것에 해당한다. foreground 실행은 명령을 하나씩 실행하므로 사용자가 입력한 명령이 실행되어 결과가 출력될 때까지 기다려야 한다.
>
> pm2에서 background로 프로세스를 돌린다면 다른 작업을 수행하면서 프로세스를 계속 유지시킬 수 있다. ssh에서 background로 서버를 실행시키고 싶다면 명령어의 마지막에 `&`를 입력하면 된다. background 작업은 터미널을 종료해도 계속 유지된다. (종료를 위해서는 프로세스를 kill해야 한다.)
>
> pm2는 **데몬(Daemon)** 방식을 사용하여 프로세스를 background에서 실행한다.

---

## 6. nginx 설치

nginx 동시접속 처리에 특화된 웹 서버 프로그램이다. 이벤트 드리븐(Event-Driven)의 비동기 처리 방식을 채택하여, 여러 개의 요청을 효율적으로 처리할 수 있다.

> **👾 웹 서버?**
> 웹 서버는 HTML, CSS, JavaScript, 이미지와 같은 정보를 웹 브라우저에 전송하는 역할을 한다.
> (🍀[참고 - Web Server와 WAS](https://zigsong.github.io/2021/09/12/web-server-was/))

여기서는 nginx를 **리버스 프록시(reverse proxy)** 를 위해 사용할 것이다. 클라이언트가 가짜 서버에 요청을 보내면, 프록시 서버가 오리진 서버로부터 데이터를 가져오는 역할을 한다. 이때 nginx는 프록시 서버의 역할을 한다.

> **👾 프록시?**
> 프록시 서버는 클라이언트가 자신을 통해서 다른 네트워크 서비스에 간접적으로 접속할 수 있게 해 주는 컴퓨터 시스템이나 응용 프로그램을 가리킨다. 서버와 클라이언트 사이에서 중계 기능을 하며, 대리로 통신을 수행하는 서버이다. 프록시는 일반적으로 **포워드 프록시(forward proxy)** 와 **리버스 프록시(reverse proxy)** 로 구분된다.
>
> 포워드 프록시는 실제 서버 대신 클라이언트의 요청을 받아 결과를 클라이언트에 전달하는 역할을 한다. 사용자가 google.com에 연결하려고 하면 포워드 프록시 서버가 요청을 받아서 google.com에 연결하여 그 결과를 클라이언트에 전달해주는 것이다. 이때 포워드 프록시는 캐시를 사용하여 성능 향상에 기여한다.
>
> 리버스 프록시는 클라이언트가 데이터 요청 시 요청을 받아 내부 서버에서 데이터를 받은 후 클라이언트에 전달한다. 클라이언트는 내부 서버에 대한 정보를 알 필요 없이 리버스 프록시에만 요청을 보낸다. 리버스 프록시는 로드 밸런싱 등의 기능을 제공하기도 한다.
>
> 👩‍🏫 포워드 프록시는 ‘클라이언트’를 감추는 역할, 리버스 프록시는 ‘서버’를 감추는 역할을 한다.

앞 단계까지 정상적으로 진행해왔다면, EC2에서 제공한 IP 주소의 지정해준 포트(여기서는 8080)로만 접속이 가능하다. 그러나 매번 이렇게 특정한 포트 번호까지 붙여 접속하긴 여간 귀찮은 일이 아니다.

또 우리의 express 서버(next.js 앱의 커스텀 서버)가 어떤 포트로 열렸든 간에, 끝단의 사용자는 해당 정보를 알 필요가 없다. 웹 사이트의 기본 포트인 80포트(생략 가능)로 접속하기만 하면 될 뿐이다. nginx 웹 서버를 이용하여 8080 포트로 들어온 요청을 80포트로 전환시켜주고, 그 중간 과정은 숨겨줄 수 있다.

> 즉, 외부에서 기본 포트인 80포트로 접속해도 리벅스 프록시 역할을 해주는 nginx가 express 서버로 **proxy forwarding**을 해준다.

nginx를 설치하고, 서버를 시작한다.

```
$ sudo apt-get install nginx
$ sudo service nginx start
```

아래 명령어를 통해 nginx가 설치된 경로를 확인할 수 있다.

```
$ sudo find / -name nginx.conf
```

nginx가 정상적으로 구동되고 있는지 확인해 보자.

```
$ ps -ef | grep nginx
```

<img src="21.png" />

현재 EC2 인스턴스의 기본 포트(80, 또는 생략 가능)으로 접속하면 아래와 같은 화면이 나타난다.

<img src="22.png" />

nginx를 정상적으로 설치했다면, 기본 포트에 우리의 next.js 앱을 띄워주도록 설정을 수정해줘야 한다. nginx의 config를 설정하는 방법을 찾다가, 구글 검색 결과 최상단에 위치한 블로그를 많이 참고했다. 그런데 그 글이 우리 놀토 팀원 [아마찌의 포스트](https://velog.io/@new_wisdom/AWS-EC2에-Node.jsExpress-pm2-nginx-배포하기)였다니 😮

```
$ cd /etc/nginx/sites-available # 기본적으로 default 파일이 있다.
$ sudo rm default
$ sudo nano default
```

sites-available 디렉토리는, 가상 서버 환경들에 대한 설정 파일들이 위치하는 곳이다. nano 텍스트 에디터로 기본 default 파일을 삭제 후 새로 작성해 준다. (사실 nano 에디터 쓰는 법을 몰라서 vi 편집기로 수정했다.)

```
server {
  listen 80;
  listen [::]:80;

  access_log /var/log/nginx/reverse-access.log;
  error_log /var/log/nginx/reverse-error.log;

  location / {
    proxy_pass http://127.0.0.1:8080; # 현재 사용 중인 포트 번호
  }
}
```

> default 파일의 모든 문장의 끝에 세미콜론(;)을 붙여줘야 정상적으로 동작한다

config 파일이 정상적으로 입력이 되었는지 확인해 보자

```
$ sudo nginx -t
```

> 👾 nginx.conf를 직접 수정해주는 방식도 있지만, 어차피 nginx.conf가 nginx/sites-available의 내용을 포함하고 있기 때문에 둘 중 무엇을 수정하든 상관없다. (sites-available에 있는 파일들이 sites-enabled에 symlink로 연결되어 있고, nginx.conf는 sites-enabled에 있는 파일들을 포함한다.)

참고로 nginx 서버에서 80포트를 사용하므로, EC2 인스턴스의 인바운드 규칙 역시 80포트를 포함하고 있어야 한다.

<img src="23.png" />

이제 EC2 퍼블릭 IP의 기본 포트로 앱 접속이 가능하다!

<img src="24.png" />

---

## 7. 도메인 설정 및 https 연결

하지만 뭔가 아쉽다. 기본 포트인 80포트로의 연결은 동작하지만, 113.~ 으로 시작하는 못생긴 IP 주소를 누가 외우고 다닐까!

나만의 도메인을 등록해보자. ~~미션에까지 돈을 쓰고 싶진 않기 때문에~~ [내도메인 한국](https://xn--220b31d95hq8o.xn--3e0b707e/) 사이트에서 괜찮은 주소를 찾았다. EC2에서 제공하는 Public IP 주소만 연결해주면 된다.

<img src="25.png" />

여전히 별거없지만, 이제 나름 도메인이라고 붙인 주소로 접속할 수 있다.

<img src="26.png" />

그런데 아무래도 저 ‘주의 요함’ 문구가 마음에 들지 않는다. HTTPS를 붙여 보안 설정을 강화해보도록 하자.

크루 [체프☕️의 가이드북](https://github.com/Puterism/infra-deploy-book/blob/cheffe/deploy-next-js-with-ec2.md)의 도움을 받았다.

nginx의 site-available 파일에 다시 들어가서 HTTPS 접속을 원하는 서버의 이름을 `server_name`으로 추가해준다. (위에서 생성한 도메인을 붙이면 된다.)

<img src="27.png" />

Certbot을 설치한다.

> **👾 Certbot?**
> Let’s Encrypt 인증서를 사용하여 자동으로 HTTPS를 활성화하는 무료 오픈 소스 소프트웨어 도구이다.

```
$ sudo apt-get install python3-certbot-nginx
```

다음 명령어로 인증서 발급을 시작한다.

```
$ sudo certbot --nginx
```

이메일 작성, 약관 동의를 한 후 HTTPS 설정을 할 도메인을 입력한다. (다른 설정을 만지다가 한번 꼬여서 이 화면은 캡쳐하지 못했다 😵)

그러면 다음과 같은 2가지 선택지 중 선택하라고 나온다.

<img src="28.png" />

HTTP로 접속했을 때, HTTPS로 자동 리다이렉트되도록 설정할 것인지 묻는 옵션이다. 2번을 선택하면 Certbot에서 nginx 설정을 알아서 바꿔준다. ~~따로 설정하기 머리 아프기 때문에~~ 2번을 선택한다.

마지막으로 인증서가 만료되기 전에 알아서 갱신되도록 Crontab을 설정할 것이다. 먼저 Crontab 설정 파일을 연다. 설정 파일을 열 때 편한 편집기를 고르라는 메시지가 뜨는데, 편한 편집기로 고르면 된다.

> **👾 Crontab이란?**
> 리눅스의 작업 예약 스케줄러로, 특정 시간에 특정 작업을 할 수 있게 해주는 도구다.

```
$ sudo crontab -e
```

최하단에 다음 설정을 추가한다. 이렇게 설정하면 매월 1일 오후 6시마다 인증서를 갱신하고 nginx를 재시작하는 명령어가 실행된다.

```
$ 0 18 1 * * certbot renew --renew-hook="sudo service restart nginx"
```

그럼 진짜 설정 끝!

<img src="29.png" />

이제 HTTPS로 접속할 수 있다. ‘주의 요함’ 대신 자물쇠 아이콘이 걸려있다.

<img src="30.png" />

---

## 요약

1. AWS EC2 인스턴스 생성
2. SSH 접속
3. git clone, node, yarn 설치
4. next.js 커스텀 서버 설정
5. pm2로 프로세스 관리
6. nginx로 리버스 프록시 설정
7. 도메인 설정 및 https 연결

어마어마한 과정이었다 😵

---

**Ref**

- https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/what-is-amazon-vpc.html
- https://medium.com/harrythegreat/aws-가장쉽게-vpc-개념잡기-71eef95a7098
- https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/using-instance-addressing.html
- https://docs.aws.amazon.com/ko_kr/quicksight/latest/user/vpc-security-groups.html
- https://aws.amazon.com/ko/about-aws/whats-new/2021/08/amazon-ec2-customers-ed25519-keys-authentication/
- https://2ham-s.tistory.com/349
- https://velog.io/@hojin9622/PM2-정리
- https://twpower.github.io/50-make-nginx-virtual-servers
- https://bcp0109.tistory.com/194
- https://www.lesstif.com/system-admin/forward-proxy-reverse-proxy-21430345.html
