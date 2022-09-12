---
title: Web Server와 WAS 간단 정리
date: 2021-09-12 20:24:09
tags:
---

Web Server와 WAS 간단 정리

<!-- more -->

<img src="/images/thumbnails/frontend-thumbnail.jpeg" />

---

## Static Pages vs Dynamic Pages

### Static Pages

Web Server는 파일 경로 이름을 받아 경로와 일치하는 파일 컨텐츠를 반환한다. 이때 항상 동일한 페이지를 반환하게 된다.
ex) image, html, css, javascript 파일과 같이 컴퓨터에 저장되어 있는 파일들

### Dynamic Pages

Web Server에 의해서 실행되는 프로그램을 통해서 만들어진 결과물로, 인자의 내용에 맞게 동적인 컨텐츠를 반환한다.

---

## Web Server vs WAS

### Web Server

웹 서버는 소프트웨어와 하드웨어로 구분된다.

- **하드웨어** - Web 서버가 설치되어 있는 컴퓨터
- **소프트웨어** - 웹 브라우저 클라이언트로부터 HTTP 요청을 받아 정적인 컨텐츠(.html .jpeg .css 등)를 제공하는 컴퓨터 프로그램

또한 웹 서버는 HTTP 프로토콜을 기반으로 클라이언트(웹 브라우저 또는 웹 크롤러)의 요청을 서비스하는 기능을 담당한다. 요청에 따라 아래의 두 가지 기능 중 적절하게 선택하여 수행한다.

- **기능 1) 정적인 컨텐츠 제공** - WAS를 거치지 않고 바로 자원을 제공한다.
- **기능 2) 동적인 컨텐츠 제공을 위한 요청 전달** - 클라이언트의 요청(Request)을 WAS에 보내고, WAS가 처리한 결과를 클라이언트에게 전달(응답, Response)한다. 이때 클라이언트는 일반적으로 웹 브라우저를 의미한다.

→ 웹 서버는 일반적으로 클라이언트에 **정적 컨텐츠(HTML, CSS, JS)** 를 제공한다.

### WAS

> WAS = Web Server + Web Container

WAS는 DB 조회나 다양한 로직 처리를 요구하는 **동적인 컨텐츠를 제공**하기 위해 만들어진 애플리케이션 서버로, HTTP를 통해 컴퓨터나 장치에 애플리케이션을 수행해주는 미들웨어(소프트웨어 엔진)이다. WAS는 “웹 컨테이너(Web Container)” 혹은 “서블릿 컨테이너(Servlet Container)”라고도 불리는데, 여기서 Container란 JSP, Servlet을 실행시킬 수 있는 소프트웨어를 말한다. 즉, WAS는 JSP, Servlet 구동 환경을 제공한다.

> **🤔 (Java) Servlet?**
> 자바를 사용하여 웹페이지를 동적으로 생성하는 서버측 프로그램 혹은 그 사양을 말하며, 흔히 “서블릿”이라 불린다. 자바 서블릿은 웹 서버의 성능을 향상하기 위해 사용되는 자바 클래스의 일종이다.

WAS는 주로 DB 서버와 같이 수행되며, 클라이언트로부터 웹 서버가 요청을 받으면 애플리케이션에 대한 로직을 실행하여 웹 서버로 다시 반환해준다.
(현재는 WAS가 가지고 있는 Web Server도 정적인 컨텐츠를 처리하는 데 있어서 성능상 큰 차이는 없다.)

- WAS의 주요 기능
  - 프로그램 실행 환경과 DB 접속 기능 제공
  - 여러 개의 트랜잭션(논리적인 작업 단위) 관리 기능
  - 업무를 처리하는 비즈니스 로직 수행
- WAS의 예
  ex) Tomcat, JBoss, Jeus, Web Sphere 등

(👾 현재 프로젝트에서는 Tomcat이 nginx(Web Server)와 Spring server를 연결해주고 있다.)

---

## 왜 Web Server와 WAS를 분리할까?

Web Server에서는 정적 컨텐츠만 처리하도록 기능을 분배하여 서버의 부담을 줄일 수 있다. 그리고 WAS를 통해 요청에 맞는 데이터를 DB에서 가져와서 비즈니스 로직에 맞게 그때 그때 결과를 만들어서 제공함으로써 자원을 효율적으로 사용할 수 있다.

WAS는 Web Server 기능들을 구조적으로 분리하여 처리하고자하는 목적으로 제시되었으며, 분산 트랜잭션/ 보안/ 메시징/ 쓰레드 처리 등의 기능을 처리하는 분산 환경에서 사용된다.

Web Server와 WAS를 분리하여 얻을 수 있는 구체적인 이점들은 다음과 같다.

- 기능을 분리하여 서버 부하 방지
  - WAS는 DB 조회나 다양한 로직을 처리하느라 바쁘기 때문에 단순한 정적 컨텐츠는 Web Server에서 빠르게 클라이언트에 제공하는 것이 좋다.
  - WAS는 기본적으로 동적 컨텐츠를 제공하기 위해 존재하는 서버이다. 만약 정적 컨텐츠 요청까지 WAS가 처리한다면 정적 데이터 처리로 인해 부하가 커지게 되고, 동적 컨텐츠의 처리가 지연됨에 따라 수행 속도가 느려진다. 즉, 이로 인해 페이지 노출 시간이 늘어나게 될 것이다.
- 물리적으로 분리하여 보안 강화
  - SSL에 대한 암복호화 처리에 Web Server를 사용한다.
  - 사용자들에게 WAS는 공개될 필요가 없으며, DB 서버를 관리하는 WAS의 경우 외부에 노출되어서는 안 된다.
- 여러 대의 WAS를 연결 가능
  - Load Balancing을 위해서 Web Server를 사용한다.
  - fail over(장애 극복), fail back 처리에 유리하다.
  - 특히 대용량 웹 어플리케이션의 경우(여러 개의 서버 사용) Web Server와 WAS를 분리하여 무중단 운영을 위한 장애 극복에 쉽게 대응할 수 있다.
  - 예를 들어, 앞 단의 Web Server에서 오류가 발생한 WAS를 이용하지 못하도록 한 후 WAS를 재시작함으로써 사용자는 오류를 느끼지 못하고 이용할 수 있다.
- 여러 웹 어플리케이션 서비스 가능
  - 예를 들어, 하나의 서버에서 PHP Application과 Java Application을 함께 사용하는 경우
- 기타
  - 접근 허용 IP 관리, 2대 이상의 서버에서의 세션 관리 등도 Web Server에서 처리하면 효율적이다.

**→ 자원 이용의 효율성 및 장애를 극복하고, 배포 및 유지보수의 편의성을 극대화시킨다**

---

## Web Service Architecture

일반적으로 아래의 구조로 데이터를 주고 받는다.

```
Client → Web Server → WAS → DB
```

---

**Ref**

- https://gmlwjd9405.github.io/2018/10/27/webserver-vs-was.html
- https://goldsony.tistory.com/37
- https://ko.wikipedia.org/wiki/자바_서블릿
