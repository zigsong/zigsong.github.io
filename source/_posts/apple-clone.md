---
title: 애플 클론코딩(을 빙자한 복제)
date: 2021-09-18 19:07:22
tags: frontend
---

새로 알게된 CSS 속성들

<!-- more -->

<img src="/images/thumbnails/frontend-thumbnail.jpeg" />

우테코 Lv4 마크업 미션으로 애플 클론코딩을 진행했다. 14일 화요일에 미션이 주어졌는데, 제출일은 16일 아침까지고, 한국 시간 15일 새벽 2시에 애플 신제품 발표로 홈페이지가 리뉴얼되면서 (ㅎ) 알면서도 곤혹을 치뤘다. 또 모든 크루들이 그랬겠지만, 17일에 있었던 데모데이 준비까지 겹쳐 이틀 밤을 거의 새다시피 하고 몸이 엉망진창이…

일부 섹션을 생략한 완성작은 [여기](https://zigsong.github.io/html-apple-store/)에…

<img src="01.png" />

## HTML tags

### `<aside>`

문서의 주요 내용과 간접적으로만 연관된 부분을 나타낼 때 사용한다. 주로 사이드바 혹은 콜아웃 박스로 표현한다.

### `<article>` vs `<section>`

**article**

- 블로그 포스트, 신문 기사 등 하나하나를 가리킨다.
- 자체만으로 독립적으로 다른 페이지에 보여져도 문제가 없을 때 사용한다.
  - main과 상관 없는 독립적인 정보를 제공한다.

**section**

- 연관 있는 내용들을 하나로 묶어줄 때 사용한다.

### `<img />` vs `background-image`

많은 경우 습관적으로 `<img />` 태그를 사용하는데, 아래의 상황들에서는 `background-image`를 사용하는 것이 바람직하다.

- 문서의 내용과는 별개로, 스타일 목적으로 사용되는 경우
- 이미지가 없어도 문서를 읽는 데 지장이 없는 경우

실제로 애플 공홈에서도 각 섹션별 이미지를 `background-image` 속성으로 설정하고 있었다. (그새 홈페이지가 또 바뀌었다..)

<img src="02.png" />

**Ref**
https://developer.mozilla.org/ko/docs/Web/HTML/Element/aside
https://www.youtube.com/watch?v=T7h8O7dpJIg

---

## CSS attributes

### background-position

말 그대로 배경 이미지의 위치를 정하는 속성으로, x/y축을 통해 가로와 세로 위치를 정할 수 있다.

### float

요소가 일반적인 흐름을 벗어나 어디에 ‘뜰’ 것인지를 정하는 속성이다. 웹 개발을 배우기 시작했을 때 접했는데, 거의(사실 한 번도) 사용하지 않고 있었다. 문서 흐름의 좌측이나 우측으로 배치되며 메인 콘텐츠의 흐름을 벗어나 사용한다. 애플 홈페이지에서는 footer의 일부 텍스트에 포함되어 있었다. 의미를 고려했을 때 유용하게 사용해볼 수 있을 것 같다.

**<footer의 locale 정보만 우측으로 치우친 경우>**
<img src="03.png" />

> 👾 `clear` 속성에 대해서도 알아보자!

### margin vs padding

각각 요소의 바깥 영역, 요소를 포함하는 영역이라는 차이는 당연히 알고 있다. 그러나 애플 공홈에서 너무나 제멋대로(?) 쓰고 있는 것을 보니, 역시 단지 취향 차이일 뿐일까? 🤔

### will-change

요소에 예상되는 변화의 종류에 관한 힌트를 브라우저에 제공한다. 실제 요소가 변화되기 전에 미리 브라우저는 적절하게 최적화할 수 있어, 성능 비용이 큰 작업을 미리 실행함으로써 페이지의 반응성을 증가시킬 수 있다. will-change를 사용하면 해당 레이어는 GPU에 업로드되어 처리된다.

> 👾 will-change에 묶인 최적화는 몇몇 많은 자원을 소모할 수 있으므로, 꼭 필요한 경우에만 사용하도록 한다.

### transform: matrix

원근감(perspective)을 제외한 나머지 스타일을 일괄 적용시킬 수 있는 메소드로, 무려 6개의 값을 전달받는다.

```
matrix (scaleX, skewX, skewY, scaleY, translateX, translateY)
```

### text-shadow

글자에 그림자 효과를 주는 속성으로, `font-weight` hover 시 transition이 먹지 않아 대신 사용하게 되었다. `text-shadow`를 잘 활용하여 `font-weight`보다 편한 텍스트를 구현할 수 있을 것 같다.

### font-smoothing

```
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Webkit 기반의 Safari 및 Mac 등에서 완벽히 구현되며 이 외에는 제한적으로 사용된다고 한다. CRA의 기본 스타일로도 지정되어 있다고!

### flex-direction: row-reverse

`reverse`를 쓸 바에는 그냥 좌측에 와야 할 요소를 코드 상으로 먼저 적으면 되는 거 아닌가? 생각했었다. 그런데 아래와 같이 이미지와 텍스트가 좌우 배치되어있지만 웹 접근성을 고려했을 때 텍스트가 먼저 읽혀야 하는 경우(특히나 다른 섹션들은 텍스트가 이미지보다 좌측에 등장하여 일관성 유지가 필요하다.) `row-reverse` 값을 사용해야 한다는 것을 깨달았다.

**<이미지와 텍스트가 보여지는 순서와 의미상 순서가 일치하지 않는 경우>**
<img src="04.png" />

**Ref**
https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
https://developer.mozilla.org/ko/docs/Web/CSS/float
https://developer.mozilla.org/ko/docs/Web/CSS/will-change
https://wit.nts-corp.com/2017/06/05/4571
https://developer.mozilla.org/ko/docs/Web/CSS/transform-function/matrix()
https://rgy0409.tistory.com/2990

---

## Tips

### css variables

사용자 지정 속성을 사용하여 문서 전반에서 재활용할 수 있는 값들을 변수로 미리 등록해둘 수 있다. 두 개의 대쉬(`--`)로 시작하는 변수명으로 짓는 것이 일반적이다.

```css
element {
  --main-bg-color: brown;
}
```

`:root` psuedo class를 사용하여 HTML 문서 어디에서나 접근할 수 있는 속성을 정의할 수도 있다.

```css
:root {
  --main-bg-color: brown;
}
```

사용은 아래처럼 `var` 키워드를 사용한다!

```css
body {
  background-color: var(--main-bg-color);
}
```

### font src local

```css
@font-face {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 300;
  src: local("🍎"), url("../fonts/sf-pro-display_thin.woff2") format("woff2");
}
```

맥 환경과 관련된 웹 폰트 이슈를 해결하기 위한 우회 코드로, 폰트 이름에 포함되어 있지 않을 법한 임의의 2바이트 유니코드 문자를 넣어서 로컬 폰트를 사용하지 않고 무조건 웹 폰트를 불러오게끔 하는 기법이라고 한다. 애플 코드에서는 원래 😃이 들어가 있다! 크루 체프가 귀여운 사과🍎로 바꾸어 놓아서 알게 된 정보.

---

**Ref**
https://developer.mozilla.org/ko/docs/Web/CSS/Using_CSS_custom_properties
https://developer.mozilla.org/ko/docs/Web/CSS/var()
https://www.paulirish.com/2010/font-face-gotchas/#smiley
