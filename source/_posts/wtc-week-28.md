---
title: 우테코 28주차 기록
date: 2021-08-14 17:35:17
tags: woowacourse
---

우테코 28주차 기록

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 놀토 프로젝트

### 2번째 UT

자체적으로 2번째 UT를 진행했다. 코치님도 2분 모셨는데, 개발자 도구까지 열어보시더니 http request도 확인해 보시고 피드 등록에 `script` 태그를 심거나 DB를 터뜨릴 수 있는 SQL injection까지 시도해보시는 등 말을 잇지 못할 QA를 보여주셨다. 🤦‍♀️ 그래도 덕분에 문제점들을 파악하고, 조금씩 고칠 수 있었다.

사용자의 요구대로 UI을 조금 바꾸거나 추후 논의해보기로 한 기능들도 생겼지만, 현 수준에서는 보류하거나 기타 이유들로 적용을 기각한 항목들도 있었다. 시간은 오래 걸리지만 UT는 꼭 필요한 작업인 것 같다!

### 배포는 꼼꼼하게!

지난 v0.2.1 배포 후 `main` 브랜치를 `develop` 브랜치에 합치지 않아서, `develop` 브랜치에 지난 release 커밋이 들어와 있지 않아 한 차례 곤혹을 겪었다. 몇 시간의 삽질과 고민과 투표 끝에, 아쉽지만 지난 버전은 날리고 새롭게 태그를 달아 배포하기로 했다. 이제는 배포할 때마다 꼼꼼하게 브랜치 간 커밋 이력을 관리해야겠다는 큰 교훈을 남겼다.

아무튼 간에 드디어 `v1.0.1` 배포 완료!
[🧸 놀토 v1.0 구경가기](https://nolto.r-e.kr/)

### skeleton ui

이미지 파일 때문에 피드 데이터를 로드해 오는데 꽤나 시간이 걸려서, 전체 파일이 로드될 때까지 사용자에게 보여줄 skeleton ui를 만들었다. 생각보다 어려운 건 없었고, 모양과 약간의 애니메이션만 CSS로 잘 잡아준 후 http request 응답이 loading 상태일 때 띄워주면 된다. 예쁘게 동작해서 다행이다.

<img src="01.gif" />

### 반응형 ui

드디어 반응형 ui를 ‘시작’은 해 보았다! 계속해서 UI가 바뀌는 만큼 신경 써줘야 할 부분들이 은근 많았다. 모바일의 경우 어쩔 수 없이 제외시켜야 하는 항목들도 생겼는데, 단순히 컨텐츠의 크기만 바꾸는 것이 아니라 요소들 간의 배치도 다시 해줘야 하는 경우들이 발생하여 앞으로 더욱 신경 쓸 부분이 될 것 같다.

<img src="02.png" width="400px" />

---

## 프론트엔드

### 성능 분석

🍀 [여기서 읽기](https://zigsong.github.io/2021/08/14/fe-performance-measurement/)

---

## 공부하기

### 테스트 자동화

기존에 젠킨스에서 프론트엔드 테스트를 돌리는 스크립트를 넣어주던 것을 빼고, github husky를 이용하여 로컬에서 github으로 푸쉬하기 전에 테스트를 돌려주기로 했다. husky는 프론트엔드 개발 환경에서 git hook을 손쉽게 제어하도록 도와주는 매니저로, git에서 특정 이벤트(commit, push 등)가 발생할 때 hook을 걸어 특정 스크립트가 실행되도록 도와준다.

프로젝트 루트 안에 `frontend` 디렉토리가 들어가 있어서, git 관련 액션(push)이 실행될 때 타겟 디렉토리인 `frontend`로 들어가도록 스크립트를 수정해주었다.

```jsx
// package.json
"scripts": {
   // ...
  "prepare": "cd .. && husky install frontend/.husky"
},
```

그리고 `.husky` 디렉토리의 `pre-push` 폴더에 아래와 같이 작성해 준다.

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

cd frontend
yarn test
```

**Ref**

- https://github.com/typicode/husky
- https://www.huskyhoochu.com/npm-husky-the-git-hook-manager/

---

## etc

### 리액트 앱 S3, CloudFront에 배포하기

**Ref** https://react-etc.vlpt.us/08.deploy-s3.html

### Merge vs Squash and Merge vs Rebase and Merge

**Ref** https://meetup.toast.com/posts/122

---

## 마무리

드디어 마지막 데모데이가 끝났다! 랜선 회식은 또 했지만, 코로나 때문에 팀원들을 아직까지도 만나지 못하고 있는 게 정말 속상하다.

오프라인으로 나가지 못하면서 더욱 정보의 공유가 같은 팀으로 제한되어 새로운 기술들이나 정확한 정보들에 대한 공유가 힘들었다. 그러면서 더욱 불안하거나 조급해지고, 뒤처진다는 생각이 불쑥불쑥 들었던 게 사실인 것 같다. 특히 이번 주는 기술적으로 챌린징한 깨우침들을 얻었다기보다는 이것저것 버그들을 수정하거나 UI들을 고친 것에 불과했기 때문에 더더욱.

그래도 후회없이 정말 잘 했다고 생각하자! 정말 20대 이후 최고로 열심히, 밤낮없이 일했으니까. 지그 짱 👍
