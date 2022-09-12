---
title: Docker로 MySQL 띄워 NestJS + TypeORM과 연결하기
date: 2022-05-12 10:39:46
tags:
  - docker
  - mysql
  - nestjs
  - typeorm
---

이 얼마나 거창한 제목인가…

<!-- more -->

<img src="/images/thumbnails/nest-thumbnail.png" />

사내 웹프론트그룹에서 하고 있는 어떠한 비밀(?..) 프로젝트에서, 막내라는 이유로 그룹장을 하고 있당. 최종적으로 만들고 싶은 플랫폼의 프로토타이핑을 하고, 각자의 꿈을 펼쳐보기로…

<img src="01.png" />

그렇게 무모하게 Nest.js가 뭔지도 잘 모른채, 그저 fancy하다는 이유로 첫 삽을 파보았다.

---

## NestJS

> Nest (NestJS) is a framework for building efficient, scalable **[Node.js](https://nodejs.org/)** server-side applications

라고 한다. 효율적이고, 확장 가능한 Node.js 기반의 서버사이드 앱을 만들기 위한 프레임워크다. 뭐든 자기 앱이 제일 개쩌니까~! 딱히 웅장하진 않은 재미없고 딱딱한 소개를 하고 있다.

조금 trendy하다고 느낀 건, 기본으로 TypeScript를 지원한다는 사실이다. 아아… 타입스크립트 없이는 살지 못해…

이 NestJS의 구조는 크게 **Controller**, **Provider**, **Module**로 나뉜다.

✔️ **Controller**

클라이언트에서 들어오는 요청을 처리하고 응답을 반환하는 역할을 수행한다. 나는 TechStack을 만들고 싶으므로 아래와 같이 야심차게 시작해본다.

```tsx
// tech-stacks.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('tech-stacks')
export class TechStacksController {
  @Get()
  findAll(): string {
    return 'Hello, techStacks'
  }
```

컨트롤러는 엔드포인트 라우팅(routing) 메커니즘을 통해 각 컨트롤러가 받을 수 있는 요청을 분류한다. 그래서 컨트롤러를 사용 목적에 따라 잘 구분하면 구조적이고 모듈화된 소프트웨어를 작성할 수 있다고 한다.

직접 컨트롤러 파일을 만들지 않고도 아래 명령어로 fancy하게 자동으로 파일을 만들 수 있다. MZ세대 취향저격

```sh
nest g controller [name]
```

난 분명 `techStacks` 로 CLI를 돌렸는데 자동으로 `tech-stacks` 이름으로 파일이 생성됐다. 저기 컨벤션인가보다.

컨트롤러만 단독으로 만드는 대신 CRUD 보일러플레이트 코드를 한번에 생성할 수도 있다고 한다. 아아… 이 얼마나 멋진…

```sh
nest g resource [name]
```

<img src="02.png" width="400px" />

✔️ **Provider**

Nest의 핵심 개념으로, 여러 소스들로 프로바이더를 구현할 수 있다. 이를테면 service, repository, factory, helper, 등등… (하나만 해라 제발)

프로바이더는 의존성으로 주입될 수 있는 데이터 가공 함수들을 모아둔 객체다. 수없이 되뇌었던 그 이름..! IoC! 의존성을 이렇게 분리하다니. 역시 fancy한 프레임워크다. 사실 다른 프레임워크에서는 어떻게 하고 있는지 잘 모른다.

```tsx
// tech-stacks.service.ts
import { Injectable } from "@nestjs/common";
import { TechStack } from "./interfaces/techStack.interface";

@Injectable()
export class TechStacksService {
  private readonly techStacks: TechStack[] = [];

  create(techStacks: TechStack) {
    this.techStacks.push(TechStack);
  }

  findAll(): TechStack[] {
    return this.techStacks;
  }
}
```

앱이 제공하고자 하는 핵심 기능, 즉 비즈니스 로직을 수행하는 역할을 하는 것이 프로바이더이다. 컨트롤러가 이 역할을 수행할 수도 있겠지만 소프트웨어 구조상 분리해 두는 것이 단일 책임 원칙(SRP, Single Responsibility Principle)에 더 부합하기 때문이라고 한다. IoC, SRP 이런 말 써줘야 또 있어보인다.

✔️ **Module**

일반적으로 모듈이라고 하면 조그만 클래스나 함수처럼 한가지 일만 수행하는 소프트웨어 컴포넌트가 아니라, 여러 컴포넌트를 조합하여 작성한 좀 더 큰 작업을 수행하는 단위를 말한다.

Nest에서 모듈은 앱의 구조 설계를 위한 metadata를 제공한다. metadata라고만 말하고 있으니 도통 무슨 소린지 알 수가 없다. 그냥 앱의 루트 모듈이 있고, 하위에 도메인별로 모듈을 나눴다고 생각하면 될 듯하다.

```tsx
// app.module.ts
import { Module } from "@nestjs/common";
import { TechStacksController } from "./tech-stacks/tech-stacks.controller";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TechStacksService } from "./tech-stacks/tech-stacks.service";

@Module({
  imports: [],
  controllers: [AppController, TechStacksController],
  providers: [AppService, TechStacksService],
})
export class AppModule {}
```

귀차나서 Nest가 기본으로 만들어준 `app.module` 파일에 `TechStack` 도메인의 아이들도 같이 욱여넣어줬다.

`yarn` 으로 로컬 서버를 실행하고 3000번 포트로 접속하면, `Hello, techStacks` 텍스트가 썰렁하게 등장한다! (포스팅을 쓰는 지금 시점에서는 코드가 많이 바뀐 상태이므로 그냥 그랬을 것이라고 이해하자.)

그렇게 별 문제없이 아주 야심차게 시작하는 듯 했으나..!

TypeORM을 연결하려면 실제 DB가 있어야 한다..! MongoDB도 잠깐 해봤고, MySQL도 해보긴 했다. 프로토타이핑을 하는 가벼운(?) 단계에서 선택 기준은 그저 ‘소스가 얼마나 많은가’. 역시 MySQL로 ㄱㄱ

그렇게 Nest에 MySQL을 등에 업은 TypeORM 연결을 위해 검색에 나섰는데, 아마 첫 번째 검색 결과가 화근이었을까. docker로 하고 있는 게 아니겠는가..! 분명 모두가 docker를 사용하고 있는 것 같았는데, 지금 다시 검색해보니 꼭 그렇지만은 않은 것 같다.

하지만… 며칠 전의 나는 docker를 꼭 해야한다고 생각했고… 그렇게 TypeORM, MySQL을 뒤로 한 채 docker로 가보았다.

---

## Docker

도커는 컨테이너 기반의 오픈소스 가상화 플랫폼이다. 컨테이너 안에는 다양한 프로그램, 실행 환경을 ‘컨테이너’라는 개념으로 추상화하고 클라우드, PC 등 어디서든 실행할 수 있다.

자세한 설명이나 등장 배경은 이미 다른 검색 결과에 많으니 생략한다.

도커 설치부터 애를 먹었다.

도커를 자동으로 설치해주는 아래 커맨드

```sh
sudo wget -qO- https://get.docker.com/ | sh
```

를 입력하면 `wget: command not found` 에러가 뜨고, 그래서 `wget`을 설치해주려고 하면 `yum`을 사용하란다.

```sh
yum install wget
```

커맨드를 입력하면 `yum: command not found`

잠시 숨을 고르고 `yum`도 설치하라는 대로 해준다.

```sh
sudo apt-get install yum
```

결과는

```sh
apt-get: command not found
```

<img src="03.png" width="400px" />

(아마도) `homebrew`로 간신히 도커를 설치하고, mysql 실행을 위해 mysql image를 pull해준다. 아니?! 이게 대체 무슨 소리냐

- **docker hub(registry)**: 앱스토어 역할이다. 필요한 프로그램을 다운로드받을 수 있는 곳이다. (마치 npm에 여러 패키지가 등록되어 있고, 개발자가 필요한 패키지를 `npm install`로 설치하는 것과 같다.)
- **image**: docker hub의 프로그램(ex. apache, mysql)을 컴퓨터에 다운로드받은 것이다.
- **container**: 다운받은 image를 실행하는 것이다. image는 여러 개의 container를 가질 수 있다.

docker hub에서 image를 다운 받는 과정을 `pull`, `image`를 실행시키는 행위를 `run` 이라고 한다. https://hub.docker.com/ 에서 원하는 이미지를 다운로드받을 수 있다.

```sh
docker pull mysql
```

다운로드 받은 image를 확인하려면 아래 명령어를 입력한다.

```sh
docker images
```

<img src="04.png" />

mysql이 잘 받아진 것 같다 _^^_

어느 단계에서인지 까먹었으나, 아래와 같은 에러가 뜨는 경우가 있다.

> 🚨 no matching manifest for linux/arm64/v8 in the manifest list entries

회사에서 준 최고 빠른 M1 Mac은 정말 사랑스럽고 손이 많이 가는 친구다. 뭐 하나 설치하려 해도 낯선 에러가 떠서 검색해보면, M1 칩 이슈라고 한다^^…

에러 메시지를 검색해서 나온 블로그가 작년에 우테코를 같이 했던 [백엔드 크루(지만 서로 모르는…)의 글](https://unluckyjung.github.io/develop-setting/2021/03/27/M1-Docker-Mysql-Error/)이었다.

`docker-compose.yml` 파일을 만들어 다음과 같이 작성해준다.

```yml
version: "3"
services:
  local-db:
    platform: linux/x86_64 # m1 mac 이슈
    image: library/mysql:5.7
    container_name: local-db
    restart: always
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: secret
      TZ: Asia/Seoul
    volumes:
      - ./db/mysql/data:/var/lib/mysql
      - ./db/mysql/init:/docker-entrypoint-initdb.
```

그리고 `compose` 명령어를 입력해준다

```sh
docker-compose up -d
```

이제 mysql 컨테이너를 만들어준다.

```sh
docker run --name [container name] -e MYSQL_ROOT_PASSWORD=<password> -d -p 3306:3306 mysql
```

`3306:3306`은, 각각 host의 포트와 container의 포트를 가리킨다. host의 3306번 포트와 docker container의 3306번 포트를 연결하라는 의미다. 처음에 무지성으로 쓰다가, 위대하신 이고잉 선생님의 강의를 듣고 이해 완.

<img src="05.png" />

_(영광스러운 캡쳐도 떠 두었다.)_

이를 port forwarding이라고 한다. ~~포워딩 별거 없네~~

그런데 계속 아래와 같은 에러가 뜨는 게 아니겠어..

```
🚨 Ports are not available: listen tcp 0.0.0.0:3306: bind: address already in use
```

이미 mysql용 3306번 포트를 차지하고 있는 프로세스를 찾아서 `sudo kill -9 [process_number]` 를 입력해줘도 계속해서 끈질기게 포트를 차지해버리는 누군가…

거의 반나절을 고민한 끝에 찾아냈다.

<img src="06.png" />

🤯🤯🤯

후… 도커의 개념을 제대로 이해하지 못한 채로 이상한 데서 헤매고 있었다.

로컬에서 돌아가고 있던 MySQL 서버를 꺼준 후 다시 실행하면, 짜잔!

<img src="07.png" />

_(갑자기 나타난 docker desktop)_

개발자를 안심시키는 초록불과 함께 mysql-local 이름으로 지정한 mysql container가 돌아가는 것을 볼 수 있다.

`docker run` 명령어는, `docker create` + `docker start` + `docker attach` 명령을 합친 것이라고 한다. `create`와 `start` 는 알겠고, `attach`까지 알아보기엔 힘이 달렸다.

도커로 실행중인 프로세스를 보기 위해 `docker ps` 명령어를 입력한다. 아마 `process status`의 약자였던 것 같다. 진정한 별다줄의 세계는 프로그래밍 세계에서 탄생한 것이 아닐까, 생각한다.

현재 실행중인 프로세스 뿐 아니라 전체 프로세스를 확인하기 위해서는 `docker ps -a` 를 입력하면 된다. (`-a`는 누가 봐도 `all` 임을 짐작할 수 있다. 아님 말고)

<img src="08.png" />

컨테이너가 하나밖에 없어서 썰렁하다. 새 컨테이너를 만들긴 귀찮으니 잠시 `mysql-local` 컨테이너를 꺼준 후 뭐가 나오는지 봐준다.

```sh
docker stop mysql-local
```

<img src="09.png" />

아까와는 달리 `STATUS`가 `Exited`로 표기된 것을 알 수 있다. 이제 보여주기식 실행이 끝났으니 다시 실행시킨다. `docker start mysql-local`을 하면 될 것 같았으나, 안 된다. 1년차 개발자의 짬을 믿고 `docker restart mysql-local` 을 입력해준다. 성공. ✌️

이제 이상한 짓은 그만두고 도커 실행 명령어를 입력한다.

```sh
docker exec -it mysql-local bash
```

아니, 아까는 `run` 하라며 갑자기 `exec`이 웬말이냐??

`docker run`은 도커 컨테이너를 생성하고 실행까지 한번에 해주는 명령어다.

반면 `docker exec`는 실행중인 컨테이너에만 실행할 수 있는 명령어다. 일반적인 컨테이너 실행 명령어인 `run`과 달리 컨테이너 상태를 디버깅하기 위한 용도로 주로 사용한다.

`docker exec`에는 주로 뒤에 여러 commands를 붙여서 실행한다.

ex) `docker exec mysql-test pwd`

여기서는 bash에서 interactive shell을 열 목적으로 뒤에 `-it [container_name] bash` 옵션을 줄줄이 붙여줬다.

아무튼 그렇게 실행해준다.

<img src="10.png" />

- `-i` : interactive shell
- `-t`: terminal

여기서 사용한 `-it` 는 `-i`와 `-t`를 합친 것으로, 터미널 입력을 위한 옵션을 뜻한다.

이밖에도 자주 사용되는 docker CLI option들은 다음과 같다.

| 옵션  | 설명                                        |
| :---- | :------------------------------------------ |
| -d    | detached mode; 백그라운드 모드              |
| -p    | 호스트와 컨테이너의 포트를 연결(포워딩)     |
| -v    | 호스트와 컨테이너의 디렉토리를 연결(마운트) |
| -e    | 컨테이너 내에서 사용할 환경변수 설정        |
| -name | 컨테이너 이름 설정                          |
| -rm   | 프로세스 종료시 컨테이너 자동 제거          |
| -link | 컨테이너 연결 [컨테이너명:별칭]             |

docker는 아무리 찾아봐도 이해가 되지 않았는데, [이고잉 선생님의 도커 입문 수업](https://www.youtube.com/watch?v=Ps8HDIAyPD0&list=PLuHgQVnccGMDeMJsGq2O-55Ymtx0IdKWf)을 듣고 갈증이 싹 가셨다.

<img src="11.png" />

---

## MySQL

MySQL을 실행하려면 물론 MySQL을 다운받아야 한다. 그냥 [공식 홈페이지](https://www.mysql.com/downloads/)에서 직접 다운 받았다.

그리고 명령어 공부하기 귀찮아서 구이…구이(GUI)를 찾다가 [workbench](https://dev.mysql.com/downloads/workbench/)도 다운 받았다. (근데 딱히 편한 건 모르겠다^^ 이쁘지도 않다.)

`docker exec`으로 실행한 shell에 아래 명령어를 입력하여 mysql 서버를 실행한다

```sh
mysql -u root -p
```

- `-u` `root`: root user를 사용ㅎ안다.
- `-p` : `p`는 `password`의 약자다. `-p [password]` 와 같은 식으로 바로 입력해줄 수도 있다. 패스워드를 생략하고 `-p` 만 사용하면 아래와 같은 패스워드 입력창이 뜬다.

<img src="12.png" />

패스워드까지 입력하면, ta-da! 🎉

<img src="13.png" />

mysql 서버가 실행되었다.

그치만 난 쿼리를 해본지 오래됐으므로 workbench로 간다.

<img src="14.png" />

UI는 정말 못생겼지만, 맥도날드 키오스크에서 헤매고 계실 우리 어머니들의 심정을 헤아려가며 찾다보면 어떻게든 테이블과 데이터를 만들 수 있다. 우여곡절을 거친 신입 개발자는 이제 뭘 클릭하는 데 거침없다. 우당탕탕 만들었기 때문에 어떻게 만들었는지 설명하진 못한다.

적당히 `techtree` 라는 이름의 테이블을 생성하고, `name`, `desc`, `image`, `url`, `type`, `id` 라는 필드(column이라고 해야될 듯 하다.)를 만들어주었다.

<img src="15.png" />

그리고 데이터도 2개 심어주었는데, 워크벤치 껐다가 다시 켜니 이전에 심어둔 데이터를 어디서 확인하는지 도통 모르겠다 ㅡㅡ 내 데이터 내놔라 👊

그래서 이건 그냥 shell에서 확인했다.

<img src="16.png" />

`desc`는 한글로 썼다고 저렇게 표시해주냐 ㅡㅡ 성공한 사람이 되어서 한글을 전세계 제1언어가 되게 하리라. 물론 거짓말이다. 그냥 아무도 모르게 조용히 살고 싶다.

그럼 이제 TypeORM으로 가보자고

---

## TypeORM

**ORM**이란 **‘Object Relational Mapping’**의 약자로, 객체-관계 매핑을 의미한다. 풀어서 설명하면, 객체와 관계형 데이터베이스의 데이터를 자동으로 매핑(연결)해주는 것을 말한다.

객체 지향 프로그래밍은 클래스를 사용하고, 관계형 데이터베이스는 테이블을 사용하기 때문에 객체 모델과 관계형 모델 간에 불일치가 존재한다. ORM을 사용하면 객체 간의 관계를 바탕으로 SQL을 자동으로 생성하여 불일치를 해결할 수 있다.

이런 멋드러지는 소리들은 이제 그만하고, NestJS에 TypeORM을 연결해보자.

우선 `ormconfig.json` 파일을 만든다. (딴소리지만, ORM 대문자로 썼을 때는 꽤나 있어보이는데 orm 소문자로 쓰니까 정말 없어보인다.) 이 config 파일의 옵션들을 앱과 연결시키기 위해 `app.module.ts` 파일에서 아래와 같이 갖은 방법을 사용했는데,

```jsx
TypeOrmModule.forRootAsync({
  useFactory: async () =>
    Object.assign(await getConnectionOptions(), {
      autoLoadEntities: true,
    }),
});
```

뭘 해도 deprecated된 메서드(`getConnectionOptions()` 등) 라고 하며 줄이 좍좍 그어졌다 ㅡㅡ

알고 보니 루트 디렉토리에 `ormconfig.json` 파일이 있다면 `TypeOrmModule.forRoot()`에 옵션 객체를 전달하지 않아도 된다고 한다. 그니까 그냥 아래처럼 쓰면 된다.

```jsx
@Module({
  imports: [TypeOrmModule.forRoot(), TechStackModule],
  controllers: [...],
  providers: [...]
})
```

fancy하다고 칭찬했던 Nest는 어서 공식문서를 개편하지 않는다면 죽음을 면치 못하리라. 😡

엔티티를 작성해준다.

```tsx
// techstack.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "techstack" })
@Unique(["id"])
export class TechStackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 45 })
  name: string;

  @Column({ type: "varchar", length: 45 })
  desc: string;

  @Column({ type: "varchar", length: 90, nullable: true })
  image: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  url: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  type: string;
}
```

완전 성의없이 MySQL 테이블 형태 그대로 갖다 적었다. `PrimaryGeneratedColumn()` 데코레이터는, 이름에서도 알 수 있듯이 새로운 데이터가 추가될 때 해당 필드의 값을 자동으로 1씩 증가시켜 할당해준다. 정말 사랑스러운 녀석…

dto가 대체 뭔진 모르겠지만 (물론 Data Transfer Object의 약자라고 한다.) 그냥 인터페이스처럼 만들면 되나보다. 다른 소스들에서 그렇게 하라길래 대충 `CreateTechStackDto`라고 이름 지어놓고 `Create`가 아닌 곳에서도 여기저기 갖다 쓰고 있다.

```tsx
// techstack.dto.ts
export class CreateTechStackDto {
  name: string;
  desc: string;
  image?: string;
  url?: string;
  type?: string;
}
```

`id`는 위에서 `PrimaryGeneratedColumn()` 데코레이터가 알아서 지어준다길래 여기서는 뺐다. ㅎㅎ

이제 지쳤으므로 급전개가 이루어질 것이다.

Nest의 프로바이더 역할을 했던 `service` 파일에, 위에서 생성한 `TechStackEntity` 를 집어넣는다. 이때 `InjectRepository` 데코레이터를 사용한다. repository가 바로 db 역할을 하는 것이다!

그리고 메서드들도 수정해준다. 코드는 아래와 같다.

```tsx
// tech-stacks.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TechStackEntity } from "src/tech-stacks/entity/techstack.entity";
import { Repository } from "typeorm";
import { CreateTechStackDto } from "./dto/techstack.dto";

@Injectable()
export class TechStacksService {
  constructor(
    @InjectRepository(TechStackEntity)
    private techstacksRepository: Repository<TechStackEntity>
  ) {}

  findAll(): Promise<CreateTechStackDto[]> {
    return this.techstacksRepository.find();
  }

  findOne(id: number): Promise<CreateTechStackDto> {
    return this.techstacksRepository.findOne({ where: { id } });
  }

  async createTechStack(item: CreateTechStackDto): Promise<void> {
    await this.saveTechStack(item);
  }

  private async saveTechStack(item: CreateTechStackDto) {
    const techStack = new TechStackEntity();
    techStack.name = item.name;
    techStack.desc = item.desc;

    await this.techstacksRepository.save(techStack);
  }
}
```

Nest가 제공하는 `Repository` 하나로 `find()`, `findOne()`, `save()` 등의 연산을 자동으로 할 수 있다니… 정말 경이롭지 않을 수 없다.

controller 파일에 임시로 심어뒀던 메서드들도 다 갖다 치우고, 새로 단장한 service의 코드를 갖다 쓰는 방식으로 바꿔준다.

```tsx
// tech-stacks.controller.ts
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateTechStackDto } from "./dto/techstack.dto";
import { TechStacksService } from "./tech-stacks.service";

@Controller("tech-stacks")
export class TechStacksController {
  constructor(private techStackService: TechStacksService) {}

  @Get()
  async findAll(): Promise<CreateTechStackDto[]> {
    return this.techStackService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id") techId: number): Promise<CreateTechStackDto> {
    return this.techStackService.findOne(techId);
  }

  @Post()
  async create(@Body() techStack: CreateTechStackDto) {
    return this.techStackService.createTechStack(techStack);
  }
}
```

사실 꼭 `Promise` 함수로 써야 하는지는 모르겠다. `Repository`의 내장 메서드들이 `Promise`를 쓰게 되어있나? 🤔 아아 … 궁금해하지만 말고 찾아보면 될 일. `Repository.d.ts`에 기재된 타입 시그니처는 대략 다음과 같다.

```tsx
/**
 * Finds entities that match given find options.
 */
find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
```

그래, `Promise`로 쓰란다.

여담이지만, 소스코드를 공개하며 해당 파일명을 알려줄 때는 디렉토리 위치까지 알려줬음 좋겠다. 그게 모두 정답은 아니겠지만… 나도 내 멋대로 했기 때문에 파일명만 공개하기로 😇

이제 마지막으로, 위대하신 Nest가 제공한다는 기본 모듈 분리의 원칙에 따라 `tech-stacks.module.ts` 파일을 생성하고, 코드를 작성해준다.

```tsx
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TechStackEntity } from "./entity/techstack.entity";
import { TechStacksController } from "./tech-stacks.controller";
import { TechStacksService } from "./tech-stacks.service";

@Module({
  imports: [TypeOrmModule.forFeature([TechStackEntity])],
  providers: [TechStacksService],
  controllers: [TechStacksController],
})
export class TechStackModule {}
```

`TypeOrmModule.forFeature()`는 누가 봐도, `TypeOrmModule.forRoot()`의 하위 모듈들을 만들기 위한 코드같으므로 설명은 생략한다. (~~피곤해서 그런 건 아니다~~)

자 이제 `yarn start` 로 서버를 실행시켜주면…! 두둥탁 🥁

<img src="17.png" />

인생은 원래 뜻대로 되는 일이 별로 없다.

게다가 저 마지막 줄에 `TechStacksController (?)` 물음표는 정말 사람 킹받게 한다.

<img src="18.png" />

여기저기 수소문한 끝에, 앱의 root가 되는 `app.module.ts`에서 중복으로 TechStack의 물건들을 갖다 써서 그런다고 한다.

```tsx
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TechStacksController } from "./tech-stacks/tech-stacks.controller";

import { TechStackModule } from "./tech-stacks/tech-stacks.module";
import { TechStacksService } from "./tech-stacks/tech-stacks.service";

@Module({
  imports: [TypeOrmModule.forRoot(), TechStackModule], // ➕ TechStackModule 추가
  controllers: [], // ➖ TechStacksService 제거
  providers: [], // ➖ TechStacksController 제거
})
export class AppModule {}
```

<img src="19.png" />

성공 🤩

마음의 평화가 찾아왔다.

이제 브라우저에서 localhost:3000으로 접속하면 아까 mysql로 봤던 데이터를 확인할 수 있다.

<img src="20.png" />

포스트맨에서도 물론 잘 나온다규

<img src="21.png" />

아까 만든 `Repository.create()` 메서드로 데이터 추가도 할 수 있다. 후후…
<img src="22.gif" />

이제 끝!

이 아니고 프론트 만들러 가자

---

## Ref

https://wikidocs.net/book/7059
https://gmlwjd9405.github.io/2019/02/01/orm.html
https://www.youtube.com/watch?v=Ps8HDIAyPD0&list=PLuHgQVnccGMDeMJsGq2O-55Ymtx0IdKWf
https://zinirun.github.io/2020/08/15/how-to-use-docker/
https://www.lainyzine.com/ko/article/docker-exec-executing-command-to-running-container/
https://subicura.com/2017/01/19/docker-guide-for-beginners-2.html
https://www.hanumoka.net/2018/04/29/docker-20180429-docker-install-mysql/
