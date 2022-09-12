---
title: 우테코 25주차 기록
date: 2021-07-25 17:48:47
tags: woowacourse
---

우아한테크코스 25주차

<!-- more -->

<img src="/images/thumbnails/wtc-thumbnail.jpeg" />

---

## 놀토 프로젝트

### 데모데이 2차 발표

데모데이 2차 발표를 무사히(?) 마쳤다. 마지막에 프론트엔드의 어뷰징 크루 덕분에 웃긴 사진이 올라가서 웃음이 터져버렸지만… 😂 다른 모든 팀들도 각양각색의 매력을 뽐냈다.

다들 OAauth부터 구현을 많이 한 것 같았고, 모바일 기반으로 프로젝트를 만든 팀이 더 많았다. 그리고 개발자들끼리 모였다고 해도 UI적인 요소를 빼고 볼 수는 없는 것 같다.

그래도 아직 2주밖에 지나지 않아서 그런지 조금씩 미완성된 느낌을 주는 팀들도 있었다. 물론 우리 팀도! 서로 좋은 피드백을 주고받고, 우리도 다른 팀들에서 사용한 좋아보이는 기술이나 팀 문화들을 조금씩 적용해보기로 했다.

### UT

UT는 Usability Test, 사용성 테스트를 의미한다. 제품을 사용자에게 테스트하여 평가하기 위해 사용자 중심 상호 작용 디자인에 사용되는 기술로, 서비스의 정식 런칭 전에 사용자들이 우리 서비스를 얼마나 잘 사용할 수 있는지 테스트해보기 위해 실행했다.

사실은 기능 구현하느라 정신없이 바쁜 와중에 UT를 해야 한다니! 부담도 크고 ‘굳이?’하는 생각도 들었지만, 가볍게 시작해보기로 했다. 한번 UT를 해본 프론트엔드 크루들이 진행하고 백엔드 크루들은 관찰기록을 해주었는데, UT 마무리 후에는 모두 아주 좋았다는 평가를 했다. 생각보다 훨씬 많은 것을 얻었기 때문이다!

구체적으로 깨달은 내용들은 다음과 같다.

- 사용자가 서비스를 잘 파악하기 위해서는 기존 더미 데이터의 양식(질)도 중요하다.
- 우리가 잘 알고 있다고 생각한 서비스의 컨셉과 용어들이 사용자에게는 낯설게 느껴질 수 있다.
- 입력 폼의 인풋 라벨만 가지고는 무엇을 작성해야 할지 알기 어렵다. 생각보다 더 친절하게 설명해줘야 한다. (툴팁 등을 활용해도 좋다.)
- UI로 콘텐츠의 영역을 명확히 구분하자.
- ‘마이페이지’가 있으면 좋겠다.

좋은 피드백들을 많이 받을 수 있었고, 이후에 서비스가 조금 더 갖춰지면 자체적으로 한번 더 UT를 진행하기로 했다.

### OAuth

구글, 깃헙 2가지 방식으로 OAuth를 구현했다.

1. OAuth를 제공하는 곳에 어플리케이션을 등록한다.
2. 사용자가 로그인을 누르면, 등록한 어플리케이션의 `client_id`와 `redirect_uri`를 담아 OAuth 요청을 보낸다.
3. `code`가 포함된 url로 이동하게 된다.
4. 해당 `code`를 params에 담아 다시 요청을 보낸다.
5. 응답에 `accessToken`이 담겨 오는데, 이를 사용하여 사용자의 로그인 정보를 저장하면 된다.

이때

1. `client_id`가 프론트 코드에 노출되어도 되는지에 대한 불안감과
2. 처음에 시도했던 깃헙은 어플리케이션 당 `redirect_uri`를 1개밖에 설정할 수 없다는 문제

로 인해 대부분의 과정은 백엔드에서 대신 처리해주기로 했다.
dev와 prod 모드로 어플리케이션 자체를 2개 등록해서, 프론트의 요청에 따라 `redirect_uri`를 놀토 프로젝트 서버에서 알아서 처리해준다. `accessToken`까지 놀토 서버에서 보내주고 있다.

다만 `code`를 포함한 url 페이지로 진입 시 `code`를 얻고 다시 프로젝트 페이지로 돌아가야 하는 상황이라, OAuth를 위한 페이지 컴포넌트를 따로 만들어준 점은 조금 아쉽다. 그래도 기존의 그냥 흰 화면이 아닌, 커스텀한 로딩 화면을 띄울 수 있다는 점은 좋을지도?

문제가 많았던 깃헙을 한번 겪고 나니, 구글은 바로 뚝딱 진행되었다!

---

## 프론트엔드 공부

### react query에서 debounce 사용하기

🍀 [여기서 읽기](https://zigsong.github.io/2021/07/24/fe-debounce-query/)

### Error Boundary와 Suspense

🍀 [여기서 읽기](https://zigsong.github.io/2021/07/24/fe-error-suspense/)

---

## 공부하기

### `<p>` 대신 `<pre>` 태그

<p> 태그를 사용하여 피드의 본문을 보여주니 입력한 문자열의 개행을 구분하지 않고 보여준다는 버그가 있었다.

이때 `<pre>` 태그를 사용하여 여러 줄의 문자열 개행을 구분할 수 있다.
‘preformatted text’라는 뜻으로, 입력한 문자를 그대로 보여준다.

### copy-webpack-plugin

특정 폴더에 있는 (혹은 그 폴더 자체를) 다른 폴더로 복사해준다.
netlify 배포 시 redirect 설정을 위해 `public` 폴더 내에 `_redirect` 파일을 작성해주었는데, 번들링 결과물인 `dist` 폴더에는 적용되지 않는다는 문제가 있었다. 이때 redirect 해줄 파일을 public 폴더에서 dist 폴더로 그대로 복사해서 넣기 위해 `copy-webpack-plugin`을 사용했다.

```tsx
// webpack.config.js
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    // ...
    new CopyPlugin({
      patterns: [path.resolve(__dirname, "public", "_redirects")],
    }),
  ],
};
```

원래는 아래와 같이 작성해주어야 하지만,

```tsx
patterns: [
  { from: "source", to: "dest" },
  { from: "other", to: "public" },
],
```

따로 path를 지정해주지 않는 경우 webpack의 output으로 지정한 (여기서는 `dist`) 곳으로 알아서 옮겨준다.

**Ref** https://webpack.js.org/plugins/copy-webpack-plugin/

### `Array`의 신기한 점

```tsx
Array(3); // [<3 empty items>]
[...Array(3)]; // [undefined, undefined, undefined]
```

### setState에 callback을 저장할 때 왜 호출이 될까?

함수 컴포넌트의 `useState`에 콜백함수를 저장해주고 싶었는데, `setState`로 콜백함수 등록 시 해당 콜백함수가 저장되는 것이 아닌 바로 호출되어 버리는 문제가 있었다.

이는 `setState`의 인자로 함수를 넘기는 것으로 인지하기 때문이었다! 무슨 의미냐 하면,

`setState`는 상태를 업데이트할 수 있는 방법이 2가지 있다.

```tsx
setState(nextState);
setState((prevState) => { ...prevState, nextState });
```

이런 상황에서 `() => console.log('callback!')`과 같은 함수를 `callback`이라는 변수에 담아 새로운 state로 등록하면,

```tsx
setState(callback); // 이렇게 작성하면
setState(() => console.log("callback!")); // 이렇게 인지하여 바로 실행한다!
```

그렇기 때문에

```tsx
setState(() => callback);
```

위와 같이 작성해주어야 올바르게 상태로 저장이 가능하다.

깨닫기까지 상당히 오랜 시간이 걸렸다 😵

**Ref**
https://dev.to/sarioglu/how-to-store-a-function-using-react-usestate-4ffh

### useMemo로 Context Api Provider 최적화

프로젝트에서 modal, snackbar, alert 등을 사용하기 위해 여기저기서 context api를 사용하고 있다.
🍀 [참고 - ModalProvider 만들기](https://zigsong.github.io/2021/07/18/fe-Modal-Provider/)

각 provider가 생성하는 `openModal` 등의 메서드를 현재 컴포넌트가 리턴하는 jsx에 인라인으로 넣어주고 있어서 호출할 때마다 새로운 객체를 만들고 있다. context provider value의 참조값이 바뀌어 자식 컴포넌트들에서 매번 리렌더링되고 있었던 것이다! 😱

이때 provider 내부에서 메서드들을 `useMemo`로 감싸주어, 자식 컴포넌트에서 사용하는 provider 메서드를 매번 새로 만드는 것을 방지할 수 있다. (편안…)

```tsx
const ModalProvider = ({ children }: Props) => {
  const [modal, setModal] = useState<ReactNode | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (modalComponent: ReactNode) => {
    // ...
  };

  const closeModal = () => {
    // ...
  };

  const modalElement: React.ReactNode = (
    <Styled.ModalContainer onMouseDown={handleClickDimmed}>
      {/* ... */}
    </Styled.ModalContainer>
  );

  // useMemo로 최적화
  const contextValue = useMemo(() => ({ openModal, closeModal }), []);

  return (
    <Context.Provider value={contextValue}>
      {children}
      {isOpen && ReactDOM.createPortal(modalElement, modalRoot)}
    </Context.Provider>
  );
};
```

---

## etc

### vscode에서 api 테스트하기

**Ref** https://www.thunderclient.io/

### github lab

**Ref** https://lab.github.com/

### webpack에서 path 리다이렉트가 안 된다면?

path의 depth가 깊어질 때 (예: `some/many/:id`) 리다이렉트가 잘 안되는 문제가 있다면, `HtmlWebpackPlugin`에서 base를 설정하면 된다.

### PR 리뷰 시 checkout하기 귀찮다면?

Github 공식 CLI를 사용하자! 이런저런 기능들이 많다.

**Ref** https://blog.outsider.ne.kr/1498

---

## 마무리

팀원들은 예상했던 것보다 훨씬 꿈이 큰 걸지도 모른다는 생각이 들었다. 기존 서비스들에서 좋아보이는 여러 기능들을 벤치마킹해서 우리 프로젝트에 적용하고 싶어한다. 물론 다 좋지만, 시간 내에 구현하기는 절대 어려워 보인다. (특히 2명밖에 없는 프론트엔드에서는 더욱…) 내가 너무 현실적인 S형 사람이라 그런가? 보수적인 입장으로 아이디어를 많이 보류하자고 의견을 냈는데, 다들 어떻게 생각할지 궁금하다.

Lv3 내에 어느 정도 완성된 기능을 보여주자는 생각을 하는 사람도 있을 것이고, Lv4까지 가져가더라도 하고싶은 것 다 해보는 게 우선이라고 생각하는 사람도 있을 것이다. 다 맞는 의견이다. 같은 프로젝트를 하더라도 같은 시간 안에서 목표를 어떻게 잡는지에 따라 상상하는 우리 프로젝트의 모습이 달라질 것이다.

그렇게 이번주는 회의가 많았고, 마지막 평일 밤 놀토 팀 (랜선) 회식을 했다! 소소한 이야기들도 하고, 꿀잼이었던 라이어 게임도 했다. 거리두기 4단계 2주 연장이라니… 언제쯤 팀원들을 볼 수 있을까? 같이 오프라인으로 만나서 이야기하며 더욱 가까워지고 싶은 마음이다. 그러면 더 코딩이 재밌어질 텐데!

코딩이 재미 없다는 건 아니다. 하루하루 이게 사람 사는 건가 싶을 정도로, 말 그대로 눈 뜨자마자 노트북 앞에 앉아서 잠들기 직전까지 코딩하고 있지만 아주 괜찮은 편이다. 내일은 또 어떤 기능을 구현할지, 어떤 새로운 챌린징한 이슈가 기다리고 있을지 설레기까지(!) 한다. 코다(코딩 다이어트)를 하고 있는 건지 살이 계속 빠지고 있지만, 운동도 꾸준히 하면서 체력을 유지해나가고 있다. 잠만 조금 더 일찍 자면 좋을 것 같다 🛌
