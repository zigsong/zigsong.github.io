---
title: legacy-peer-deps 너 뭐 돼?
date: 2022-07-10 21:33:53
tags:
---

npm 트러블슈팅 연대기

<!-- more -->

---

<img src="/images/thumbnails/troubleshooting-thumbnail.jpeg" />

프로젝트에서 패키지를 하나 업데이트하려고 시도했던 일이 시발점이 되어 무려 주말 포함 일주일을 나를 괴롭혔던 문제… 돌아버리는 줄 알았다.

새로 업데이트한 패키지가 잘 동작하지 않아 `node_modules`를 삭제하고 `npm i`를 했더니 처음 보는 오만가지 에러가 발생했다.

가장 먼저 발생한 문제는 `node-sass`가 설치되지 않는 것이었다. (이제는 재현할 수 없다…) [node-sass 문서](https://www.npmjs.com/package/node-sass)에는 `node-sass`가 deprecated되었으며, 이제는 `sass`를 사용하라고 한다. 여태까지 잘 써왔고, 다른 팀원 분들한테는 발생하지 않는 문제인데 😭 뭐 어쩔 수 없으니 `node-sass`를 지우고 `sass`를 설치해서 올려줬다.

그런데 변경된 코드 내역을 보니, package-lock.json 파일의 오만가지 패키지들에 `"dev": true` 옵션이 붙어있었다. (`devOptional`이 `dev`로 바뀐 경우도 있었다.)

해당 옵션에 대한 설명은 다음과 같다.

- `dev`: `devDependencies`에 포함된 패키지의 경우
- `devOptional`: `optionalDependencies`에 포함된 패키지의 경우

즉 `npm install` 시 devDependencies에 있는 패키지들에 `"dev": true`가 붙는 것으로, 크게 문제될 일이 아니라 생각했다.

그런데 해당 MR을 다른 팀원 분들이 받아서 다시 `npm i`를 하는 순간, `"dev": true`가 다시 다 사라진다! 😇… 결국 내 문제.

`node-sass`는 어떻게 해결됐는지 모르겠지만 더 이상 에러가 뜨지 않았고, 어느 순간 python이 없다는 식의 에러메시지가 떴다.

```
env: python: No such file or directory
```

python을 깐 적은 없지만, Mac에는 기본적으로 설치되어 있는 것이 아닌가? 그런데… OS 12.3 이상에서는 python이 없다는 얘기가 있었다.([출처](https://stackoverflow.com/questions/71468590/env-python-no-such-file-or-directory-when-building-app-with-xcode)). 내 경우 실제로 python이 없었고, python3 버전을 깔아주었다. (삽질 결과 python 2 버전도 상관없었다.)

python 때문이었는지는 모르겠지만, 어떻게 `node-sass` 문제를 해결했다. 그러고 `npm i`를 했더니, 다시 package-lock.json의 오만가지 dependencies에 `"dev": true`가 붙어있었다. 악!!! 🤯

package-lock.json을 건드리지 않기 위해, `npm ci`나 `npm install --no-save` 옵션으로 패키지를 설치해주는 방법도 있었다. 실제로 그렇게 하면 잘 돌아갔다. [npm 팀에서도 그렇게 쓰라고 했다는 사람도 있었다.](https://github.com/renovatebot/renovate/issues/2294#issuecomment-410517173) (무능한 npm…)

package-lock.json 기반으로 프로젝트의 패키지들을 설치하는 것이 아니라, 그러나 나의 경우처럼 새로운 패키지를 설치해야 하는 경우, 여전히 `npm i`를 사용해야 하고, 그러면 package-lock.json 파일이 바뀐다. 개똥!! 💩🚽

중간중간에 node도 npm도 지웠다 다시 깔아보고, `npm cache clean`도 해보고, 프로젝트도 몇 번이나 새로 clone 받고… 난리를 쳤지만 해결되지 않았다. OS 문제인가 싶기도 하고, 망할 npm 대신 yarn을 쓰자고 해보고도 싶고. 그러나 우리 팀에서는 yarn으로 바꿔보자 주장할 수 있었지만, 더 큰 문제가 있었지롱

디자인시스템을 개발하는 프로젝트에서도 (거의) 비슷한 문제가 발생한다는 것이었다. 😩 인생은 결코 호락호락하지 않구나… 그곳에서는 root에 있는 package.json의 `peerDependencies`에 기재된 리스트들이 깔리지 않아서 문제가 발생했다. 거기서 시작된 문제는 일파만파 커져서 typescript까지도 말썽을 일으키는 정말 촉법소년같은, 정신나간 에러가 됐다.

결국 주말인데도 불구하고 팀장님께 읍소하듯 ㅠㅠ 메시지를 보내놓고 애써 잊어보자고 (전남친도 아니고…) 다른 일 하자 하면서도 계속 붙잡고… 미련덩어리… 그러다가 내가 일주일 째 일을 못하는 상황을 “꿀빠네”라고 조롱했던 동기에게 도움을 요청했다.

그런데 다행히(!!!) 그 동기만 나와 똑같은 에러들이 발생하는 것이 아니겠는가. 눈물날 만큼 반갑고 기뻤다. 같은 에러가 터져서 기분 좋다는 날 보며 동기는 혀를 찼다…

자기는 `node-sass` 에러부터 난다며, 근데 에러 메시지에서 `npm i` 뒤에 `legacy-peer-deps`를 붙여보라고 한단다. 그랬더니 `node-sass`는 해결됐는데, package-lock.json에 `"dev": true`들이 붙는다고 한다.

‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️

그러면 내 PC에서 `legacy-peer-deps`가 npm 기본 옵션으로 설정되어 있는 게 아닌지 확인해보란다.

‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️‼️⁉️

그랬었다… `npm config`에 그런 옵션이 `true`로 설정되어 있었다. 💩

우선 `node-sass`는 해결됐으니, 해당 옵션을 다시 `false`로 돌려주면 해결되지 않을까? 했고, 정말 해결이… 되었다…

흥분을 가라앉히고, `legacy-peer-deps`는 이런 것이라고 한다.

> npm 4-6 버전에서는 peerDependencies가 충돌하는 경우 경고만 뜨고 설치는 되었다. npm 7 버전에서는 peerDependencies를 자동으로 설치하고, 충돌이 있는 경우 에러를 던진다.
>
> - `--legacy-peer-deps` 는 peerDependencies를 무시하는 방식 (npm 4-6에서 사용하던 방식)
> - cf) `--force`: package-lock.json에 몇 가지 다른 의존 버전들을 추가한다. 즉 충돌하는 peerDependencies를 루트에 설치한다. (충돌을 우회한다.)

팀에서 npm은 버전 8을 사용하고 있었다. 그러니 `legacy-peer-deps`가 기본값 즉 `false`였을 때는, `node-sass`와 관련된 peerDependencies에서 충돌이 발생하여 에러를 던졌을 것이다. `legacy-peer-deps`를 `true`로 해준 것은 `node-sass`의 충돌 문제를 잠시 덮어두었던 것이었고, 실제 문제는 어떻게 python으로 해결했다. 그러나 중간에 설정해주었던 `legacy-peer-deps=true`는 여전히 남아있었고, 이 때문에 package-lock.json에 `"dev": true`들이 생겨났을 것으로 추측한다.

또, `legacy-peer-deps`는 디자인시스템 레포에서, 여러 하위 패키지에서 동시에 사용하는 패키지의 버전을 맞춰주기 위해 root package.json에 작성했던 `peerDependencies`들에 있는 패키지들 역시 `legacy-peer-deps=true` 때문에 올바르게 설치가 되지 않았던 것이다.

이 일주일 간의 여정을 정리하자면 아래와 같다.

1. `node-sass`가 계속 충돌하는 중에, `legacy-peer-deps=true` 를 붙여줬다.
2. `node-sass` 문제가 해결됐다. (이유는 모르겠지만, python을 설치해서 해결된 것 같기도 하다.)
3. 1에서 추가했던 `legacy-peer-deps=true` 때문에 락파일에 `"dev": true` 들이 생겨났다.
4. `legacy-peer-deps=true` 를 지워주니 모두 해결됐다.

물론 중간중간에는 위에 기재하지 않은 99개의 더 많은 과정과 삽질들이 생략되었다. 😇
그래도 기쁘다.

너무 고마워서 배라 깊티 보내주니 헛소리를 하는 동기… 이름을 가리지 않아주면 더욱 좋아할 것 같다.

<img src="01.png" width="320px" />

[나와 비슷한 문제를 겪고 있는 분](https://github.com/npm/cli/issues/5128)에게 답글도 달아주었다 ㅎㅎ

<img src="02.png" />

처음으로 생태계에 기여한 것 같아 기쁘다. 저 분도 해결되실진 모르겠지만…

대충 영어로 적어보고 파파고 돌려보니 얼추 맞는 소리인 것 같다.

<img src="03.png" />

~~아직 영어 실력 다 안 죽었네~~

중간중간에 우리 팀원들과 팀장님, 그리고 수많은 크루들, 또 [node-sass와 노드 버전의 관계에 대한 글](https://jeonghwan-kim.github.io/dev/2020/06/27/node-sass.html)을 작성하신 저자 분께서 (같은 회사 같은 팀이라서) 며칠 간 많은 도움을 주셨다. 역시나 최종적으로 작은 문장 한 줄만 지워줘서 해결될 문제였지만, 이 수많은 사람들의 고통 나누기가 없었다면… 나는 아마 스트레스를 이기지 못하고 또 병을 얻어 입원하지 않았을까..? 싶기도 하고… 미쳐돌아가는 세상… 이제 세상이 환하다… ☀️
