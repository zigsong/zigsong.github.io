---
title: 로티로 애니메이션 만들기
date: 2022-12-08 22:36:09
tags: frontend
thumbnailImage: https://i.imgur.com/2Dqm3wS.jpg
---

다짜고짜 로티 써보기

<!-- more -->

---

회사 업무를 수행하던 중, 애니메이션을 렌더링해야하는 과제가 생겼다. mp4 파일로는 약 1MB가 넘는 크기의 영상이었고, (그리고 10개의 서로 다른 파일이 필요했다 😩) 브라우저에서 그대로 로드했을 시에는 리소스를 불러오는 데 시간이 걸려 UI상 딜레이가 많이 생겼다.

디자이너 분께서 처음 파일을 건네주셨을 때부터 '로티'라는 것을 사용하면 좋을 것 같다고 말씀주셨고, 그렇게 이름만 들어봤던 로티를 사용해보게 되었다!

(👇 얘 아님)

<img src="01.png" width="360px" />

---

## 로티(Lottie)

로티(Lottie)는 오픈소스 모바일 라이브러리로, 애니메이션을 json data 파일로 만들어주는 플랫폼이다.

애니메이션은 그냥 gif로 쓰면 될 일이 아닌가?

그러나 프론트 개발자라면 누구나 알 것이다. gif는 대부분의 경우 절대금기 사항이라는 것을...

gif를 사용하면 안 되는 이유는 다음과 같다.

- gif는 이미지컷들을 연결한 애니메이션으로 파일 크기가 아주 크다. 만약 하나의 웹페이지에서 여러 개의 gif를 하나 사용한다면, 로딩 속도가 매우 느릴 것이다.
- gif는 용량이 무거울 뿐 아니라, 고정된 크기로 렌더링 되기 때문에 해상도 대응이 어렵다.
- 렌더링되는 색상에 한계가 있기 때문에 애니메이션의 품질이 떨어진다.
- 재생 타이밍, 반복재생 여부 등을 커스텀하기가 어렵다.

그렇다면, 왜 로티를 사용해야 하는가?

- 로티는 json data파일로 제작되어 gif에 비해 파일 크기가 작다.
- vector 기반의 이미지로 생성되어 해상도에 구애받지 않는다.
- 모든 색상을 렌더링할 수 있어 자연스러운 애니메이션을 연출할 수 있다.
- 재생 타이밍, 반복재생 여부, 재생 속도 등을 손쉽게 커스텀할 수 있다.

아무튼 이 포스팅은 로티가 짱이라는 것을 보여주기 위한 글이니, gif는 잠시 버려두고 로티에 대해 더 알아보도록 하자.

---

## json으로 로티 이미지 생성하기

로티 애니메이션을 재생해보려면 당연히 애니메이션 파일이 필요하다. 하지만 나는 디자이너가 아니기 때문에 뭘 만들 수는 없다. 하지만 또 다른 내가 이미지를 창작했다고 치고, [LottieFiles](https://lottiefiles.com/animation/images)에 들어가서 맘에 드는 이미지를 하나 다운로드해본다.

아, 다운로드하려면 계정 만들어야 한다. 귀찮으니까 구글로 로그인한다.

12월이기도 하고, 크리스마스 광인답게 크리스마스 관련 이미지를 검색했다.

이렇게 우측 상단에 다운로드 버튼을 클릭하면, 어떤 파일 형식으로 받을 것인지 물어본다.

<img src="02.png" width="480px" />

당연히 'Lottie JSON'으로 받는다. 그런데 생각보다 gif나 mp4의 용량도 크진 않다. (짧아서 그런가?) 'Optimized Lottie JSON'도 있는데, 돈 내야 한다. 자본주의는 무서워 💸

아무튼 .json 확장자 파일로 다운 받아서 열어보니, 다음과 같은 어마무시한 json 덩어리가 나타났다.

```json
{"v":"5.7.5","fr":60,"ip":0,"op":60,"w":1080,"h":1080,"nm":"Pre-comp 1","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Shape Layer 7","parent":27,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11}, // ...(생략)
```

json prettifier로 🎀예쁘게🎀 만들어봤다.

```json
{
  "v": "5.7.5",
  "fr": 60,
  "ip": 0,
  "op": 60,
  "w": 1080,
  "h": 1080,
  "nm": "Pre-comp 1",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Shape Layer 7",
      "parent": 27,
      "sr": 1,
      "ks": {
        "o": {
          "a": 0,
          "k": 100,
          "ix": 11
        },
        // ... (생략)
```

예뻐진 것 같긴 한데, 뭘 나타내는진 알 수 없다. 사실 알 필요는 없는 것 같다. 뭔가 `layers`도 있고 한 걸 보니 여러 레이어의 좌표를 겹친 이미지를 만들 거라는 건 뻔하다. 으이구 뻔해 🤦‍♀️

파일을 받았으면 이제 렌더링해보자. 근데 json을 어떻게 화면에 렌더링함?

---

## 로티 라이브러리 비교

로티 애니메이션을 그냥 HTML에서 렌더링하는 일은 (거의) 없을 것이다. 시대를 이끄는 우리 프론트 개발자들은 그런거 잊은지 오래다. 바로 리액트 렌더링하는 거다. (원래 그러면 안 된다.)

뭘 갖다 쓰려면 참으로 손길이 많이 가는 리액트에서 로티를 그냥 렌더링해줄 리 없다. 라이브러리를 설치해야 한다.

라이브러리 이름도 다 헷갈린다. 역시 일부 도구들은 개발자를 더 혼란스럽게 만든 후 헷갈리지 않고 살아남는 자만 건지려는 시험 전략을 쓰는 것이 틀림없다.

react-lottie, lottie-web, lottie-react 세 가지 라이브러리를 비교해볼 것이다. 선정 이유는... 그냥 세 개가 제일 먼저 띄었다. 눈에 띄지 않는 애들은 이미 도태된 것이다. ~~우리 역시 도태되지 않게 노력해야 할 것이다. 그냥 도태되고 편하게 살고 싶다면 어쩔 수 없지만...~~

### 🍀 npm-trends

[npm trends](https://npmtrends.com/lottie-react-vs-lottie-web-vs-react-lottie)에 세 개의 라이브러리를 비교해보면, `lottie-react`는 한 물 간듯 하고(star 수도 348 뿐이다.), `lottie-web`의 사용률이 압도적으로 높다. `lottie-web`이 유난히 높은 이유는, 뒤에서도 설명하겠지만, react 전용 라이브러리가 아니기 때문인 것 같다.

<br />
<img src="03.png" width="600px" />

### 🍀 번들 크기

minified 기준으로 보면,

- react-lottie (ver 1.2.3) - 68.4kB
- lottie-web (ver 5.10.0) - 71.5kB
- lottie-react (ver 2.3.1) - 70.9kB

로 거의 차이는 없다. ~~세상 많이 좋아졌다.~~

### 🍀 관리 현황 (버전)

- react-lottie - ver 1.2.3으로, 마지막 release가 2018년이다. 처음으로 생겼으나 버려진 게 틀림없다... ~~원래 첫째들은 대충 키워 무관심 속에 방치되기 마련이다. 내가 첫째라 그런 건 아니다.~~
- lottie-web - ver 5.10.0으로, 최근까지도 계속 업데이트되고 있다. star 수와 issue도 가장 많다.
- lottie-react - ver 2.3.1로, 마지막 release는 6개월 전이다. 핫하진 않지만, 꾸준히 사용되고 있는 듯하다. 이게 바로 스테디셀러?

이제 또 뭘 비교해야 할까. 그냥 바로 사용 방법으로 넘어가보자.

---

## 리액트에서 로티 로드하기

### 1. react-lottie

[LottiFiles 블로그](https://lottiefiles.com/kr/blog/about-lottie/kr-working-with-lottie-how-to-use-lottie-in-react-app)에서 공식적으로 지원하는 방법은 `react-lottie`를 사용하는 것이다.

```jsx
import Lottie from "react-lottie";
import animationData from "./lotties/merry-christmas.json";

const App = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default App;
```

이렇게 작성하라는데, `DependencyNotFoundError`가 난다. ㅡㅡ 하라는 대로 했는데.

`react-lottie`를 쓰려면 `prop-types`도 깔란다. 그냥 좀 해주지

아무튼 `prop-types`도 디펜던시에 추가한다. 그러면 잘 렌더링이 되는 것을 볼 수 있다.

<br />
<iframe src="https://codesandbox.io/embed/practical-smoke-z7g4xv?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="practical-smoke-z7g4xv"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

위 코드의 `defaultOptions`에 들어있는 항목들은 이름만 보면 대충 감이 온다.

- `loop`: 반복 재생 여부. `true`일 때는 무한 반복하며, 숫자를 입력하면 해당 횟수만큼 반복한다.
- `autoplay`: 자동 재생 여부
- `animationData`: 재생할 lottie json 파일
- `rendererSettings`: 이미지의 비율이나 className 등을 추가할 수 있다.

위 네 가지는 필수로 설정해줘야 하는 항목이다. 이밖에도 `react-lottie`에는 `onComplete`, `onDestroy` 등의 prop을 추가할 수 있으며, `play()`, `stop()` 등의 메서드를 사용할 수 있다.

### 2. lottie-web

`lottie-web`은 에어비앤비에서 만든 라이브러리로, 안드로이드, iOS, React Native, 그리고 윈도우에서 사용할 수 있다.

이렇게 범용적이라는 사실은... React JSX 렌더링이나 hook에 특화되어 있지 않다는 뜻이다! 😱 ~~원래 이것저것 여러가지 메뉴 파는 집은 맛이 없다. 한 두 가지 메뉴만 전문적으로 파는 식당이 진짜 맛집~~

렌더링하는 컴포넌트에 직접 `stop()`, `play()` 등의 메서드를 prop으로 전달하는 대신, 라이브러리에서 제공하는 `lottie` 객체의 `loadAnimation()`을 통해 로드한 애니메이션을 직접 제어하는 방식으로 코드를 작성한다.

```jsx
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "./lotties/merry-christmas.json";

const App = () => {
  const [isStopped, setIsStopped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const animationRef = useRef();

  useEffect(() => {
    animationRef.current = lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });
  });

  return <div ref={animationRef} />;
};

export default App;
```

react에서는 `useRef`을 사용하여 로티 애니메이션을 재생할 dom 요소를 지정하고, `ref.current.play()`와 같은 방식으로 애니메이션을 직접 제어한다.

<br />
<iframe src="https://codesandbox.io/embed/adoring-villani-5h5hkq?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="adoring-villani-5h5hkq"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

width, height를 지정해주지 않았더니 무지 부담스럽게 커졌다. ㅋㅋ ~~뭐든지 멀리서 보아야 아름답다. 로티도 그렇다.~~ ('자세히 보아야 아름답다'가 맞는 시 구절이다.) 아무튼 성공적으로 로드했다.

### 3. lottie-react

1번과 이름이 비슷하지만, `react-lottie`와 다른 `lottie-react`다.

라이브러리 내부에서 react hook을 사용하기 때문에 react v16.8.0 이상을 사용할 것을 권장한다. 역시 fancy한 것은 특정 세대에만 국한되어 있다. ~~요즈음의 MZ세대를 겨냥한 것이랄까...~~

`lottie-react`를 일반 컴포넌트처럼 사용한다면 아래처럼 작성한다.

```jsx
import React from "react";
import Lottie from "lottie-react";
import animationData from "./lotties/merry-christmas.json";

const App = () => <Lottie animationData={animationData} loop={true} />;

export default App;
```

요즘 애들 쓰는 방식대로 핫하게 살고 싶다면, `lottie-react`에서 제공하는 hook을 사용하여 아래처럼 작성한다.

```jsx
import React from "react";
import { useLottie } from "lottie-react";
import animationData from "./lotties/merry-christmas.json";

const App = () => {
  const options = {
    animationData,
    loop: true,
  };

  const { View } = useLottie(options);

  return <>{View}</>;
};

export default App;
```

`useLottie` hook을 사용하여 애니메이션을 렌더링한 예제는 아래와 같다.

<br />
<iframe src="https://codesandbox.io/embed/adoring-villani-5h5hkq?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="adoring-villani-5h5hkq"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

`useLottie` hook은 다음과 같이 `View` 컴포넌트에 여러 가지 옵션들을 prop으로 넣어 렌더링하는 형태로 되어있다.

```jsx
const useLottie = (
  props: LottieOptions,
  style?: CSSProperties
): { View: ReactElement } & LottieRefCurrentProps => {
  const {
    animationData,
    loop,
    autoplay,
    initialSegment,
    // ...
    lottieRef,
    renderer,
    name,
    assetsPath,
    rendererSettings,
    ...rest
  } = props;

  const [animationLoaded, setAnimationLoaded] = useState(false);
  const animationInstanceRef = useRef<AnimationItem>();
  const animationContainer = useRef<HTMLDivElement>(null);
  // ...

  const play = (): void => {
    animationInstanceRef.current?.play();
  };

  const stop = (): void => {
    animationInstanceRef.current?.stop();
  };

  const View = <div style={style} ref={animationContainer} {...rest} />;

  return {
    View,
    play,
    stop,
    pause,
    // ...
    animationContainerRef: animationContainer,
    animationLoaded,
    animationItem: animationInstanceRef.current,
  };
};
```

어디서 많이 본듯한? 🫢

2번의 `lottie-web`을 한번 wrapping한 형태의 라이브러리기 때문이다. hook을 제공하여 보다 편리하게 사용할 수 있도록 해준다.

> 자세한 코드는 [lottie-react github](https://github.com/Gamote/lottie-react/blob/main/src/hooks/useLottie.tsx)에서 알아보자.

**🤨 그래서, 어떤 라이브러리?**

나름대로 결론을 내보았다.

- 많은 커스텀 설정은 필요없고, 그냥 한번 로티 애니메이션을 띄워보고 싶다면 👉 react-lottie
- 리액트 뿐 아니라 웹을 사용하는 곳에서 범용적으로 로티 애니메이션을 로드하고자 한다면 👉 lottie-web
- hook을 사용하고 싶고, 라이브러리에서 정해준 대로 편하게 살고 싶다면 👉 lottie-react

(프로젝트에서는 lottie-web을 사용하기로 했다. 위 이유들과는 상관없을지 모르지만... 추후 여러 커스텀 설정들을 추가해볼 수 있으니까!)

(그리고 lottie-web이 레퍼런스도 가장 많다.)

---

## 마무리

로티 파일이 어떻게 웹에서 로드되는지 살펴보았다. json으로 애니메이션 로드라니. 뭔가 대단히 낯설고 신기한 방법같아 보였는데 엄청난걸 알아내진 못했다. 그냥 라이브러리 비교나 한 것 같다.

~~그리고 주말엔 롯데월드에 다녀왔다. 로티의 크리스마스 퍼레이드를 보았다.~~

사실 로티는 개발자가 아니라 디자이너들한테 더 핫한 라이브러리인 것 같다. 이러나 저러나 애니메이션 렌더링에 큰 도움을 주었으니 훌륭한 도구인 것으로... 😎

---

**Ref**

- https://lottiefiles.com/blog/tips-and-tutorials/lottie-vs-gif
- https://creattie.com/blog/gif-vs-lottie
- https://congjang.medium.com/f-번외편-lottie로-animation-만들기-93135f18e450
- https://lottiefiles.com/kr/blog/about-lottie/kr-working-with-lottie-how-to-use-lottie-in-react-app
- https://lottiereact.com/components/Lottie
