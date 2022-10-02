---
title: 프론트엔드 성능 베이스캠프
date: 2021-08-28 20:51:16
tags: frontend
thumbnailImage: https://i.imgur.com/2Dqm3wS.jpg
---

프론트엔드 성능 베이스캠프

<!-- more -->

---

본격적인 프론트엔드 성능 개선을 시작하기 전에, 성능 개선 프로세스에 대해서 생각해보자.

성능 개선 프로세스는 **측정 → 분석 → 최적화**를 계속해서 반복해 나가는 과정이다. 현재 서비스의 성능 수준을 측정하고, 어떤 영역에서 성능 개선 작업이 필요한지 문제를 정의한다. 그리고 정의한 문제를 해결하기 위해 여러 방법들을 시도한다. 언제까지? 목표에 도달할 때까지! 지금 당장 완벽한 성능 수준에 도달하기보다는, 언제든 새로운 도전을 해볼 수 있도록 학습해 나가는 중이다.

프론트엔드의 성능은 **1. 로딩 성능**과 **2. 렌더링 성능**으로 나눌 수 있을 것이다.

- 로딩 성능 - 페이지가 얼마나 빠르게 로드되는가
- 렌더링 성능 - 사용자 인터랙션에 얼마나 빠르게/효율적으로 반응하는가

이에 기반해서 **1. 요청 크기 줄이기**, **2. 필요한 것만 요청하기**, **3. 같은 건 매번 새로 요청하지 않기**, **4. 최소한의 변경만 일으키기** 네 가지 단계로 성능을 개선해보았다.

성능 개선 전의 사이트는 [이곳](http://frontend-performance-basecamp.s3-website.ap-northeast-2.amazonaws.com/)에서, 성능 개선 후의 사이트는 [이곳](https://d3sydo67idcl5c.cloudfront.net/)에서 확인할 수 있다.

### 성능 개선 이전

**<lighthouse 성능 지표>**
<img src="01.png" width="520px" />

**<WepPageTest, Paris Fast 3G 성능 지표>**
<img src="02.png" width="560px" />

### 1. 요청 크기 줄이기

**✅ 소스코드 크기 줄이기**
react로 만든 웹 서비스의 경우 서비스에서 불러오는 JavaScript 번들 파일의 소스코드 크기를 줄일 수 있다. 소스코드 크기 측정을 위해 **webpack-bundle-analyzer**를 이용했다. 로컬 서버를 통해 번들을 구성하고 있는 요소들의 크기를 확인할 수 있다.

```jsx
// webpack.config.js
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  // ...
  plugins: [
    // ...
    new BundleAnalyzerPlugin(),
  ],
};
```

<img src="03.png" />

> 👾 (추후 다룰 parsing과 gzip을 사용하면) 3가지 버전으로 각 구성요소의 크기를 확인할 수 있다.
>
> - stat size - 압축(compression) 또는 최소화(minimization) 이전 크기
> - parsed size - 결과물의 크기(최소화가 적용되어 있는 듯 하다.)
> - gzipped size - 압축 이후 크기

우선 `gzip`을 사용해서 CDN에서 가져오는 소스코드의 크기를 줄였다. aws cloudfront에서 gzip 압축에 관한 내용은 [여기](https://zigsong.github.io/2021/08/14/fe-performance-measurement/#✅-bundle-js-압축하기)서 확인할 수 있다.

**<gzip 적용 이전>**
<img src="04.png" />

**<gzip 적용 이후>**
<img src="05.png" />

CSS 최적화도 진행했다. 우선 **MiniCssExtractPlugin**을 이용하여 CSS 파일을 별도 파일로 추출했다. CSS 코드가 포함된 JS 파일 별로 CSS 파일을 생성하기 때문에 CSS가 헤더에 주입되는 것이 아니라 별도의 파일로 분리된다. 그래서 DOM에 `<style>` 태그로 CSS를 넣어주는 **style-loader**와 함께 사용할 수 없다. webpack config에 **style-loader** 대신 넣어준다.

```jsx
// webpack.config.js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ...
  plugins: [
    // ...
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
};
```

> **mini-css-extract-plugin** 플러그인은 JavaScript 파일 안에서 호출되는 스타일 코드를 청크(Chunk)에서 파일로 추출하므로 개발 중에는 플러그인을 사용하지 않는 것이 좋다. 즉, 개발이 끝난 후 배포 할 때 사용하면 좋다.
>
> 개발 모드에서는 CSS를 여러 번 수정하고 DOM에 `<style>`요소의 코드로 주입하는 것이 훨씬 빨리 작동하므로 **style-loader**를 사용하고, 배포 모드에서는 **MiniCssExtractPlugin.loader**를 사용하는 것이 좋다.

그리고 **CssMinimizerWebpackPlugin**을 이용하여 CSS 파일을 최적화하고 축소해주었다. 번들 결과 dist 폴더 내의 css 파일이 아래와 같이 압축된 것을 확인할 수 있다. 번들 파일의 크기는 798kB에서 757kB로 줄었다.

<img src="06.png" />

> 🤔 **MiniCssExtractPlugin**을 이용하여 CSS 파일을 별도로 추출하는 방식이 항상 성능상으로 좋은 방식인지는 의문이다. 현재는 우선 소스코드의 크기가 줄어서 개선이 이루어졌지만, 더 공부해봐야 할 부분이다.

마지막으로(순서가 CSS 최적화보다 먼저 왔어야 할 것 같지만!) JavaScript 소스코드를 난독화하여 크기를 줄일 수 있었다. **UglifyJS**와 **Terser**가 소스코드 난독화를 해주는 대표적인 라이브러리인데, 각각 사용했을 때 압축률은 거의 동일하다. 그러나 **Terser**가 파싱 속도가 조금 더 빠르다고 한다. [npm-trends](https://www.npmtrends.com/terser-vs-terser-webpack-plugin-vs-uglify-js-vs-uglifyjs-webpack-plugin)에서도 **Terser**가 뜨고 있다.

<img src="07.png" />

(추가) webpack v5 이상부터는 **Terser**가 기본으로 설정되어 있다. 세부 옵션을 지정해주고 싶다면 **terser-webpack-plugin**을 설치하여 커스터마이징해주면 되지만, 따로 설정할 것이 없다고 판단하여 사용하지 않았다.

파싱 이후 **webpack-bundle-analyzer**로 분석한 코드는 다음과 같다. 아래에 나올 코드 스플리팅을 적용한 후 측정했기 때문에 결과물이 청크 파일들로 분리되어 있는데, **Terser** 등으로 난독화(최소화)되어 있는 전체 번들의 크기가 757kB에서 231kB로 크게 줄어든 것을 확인할 수 있다.

**<Stat 크기>**
<img src="08.png" width="480px" />

**<Parsed 크기>**
<img src="09.png" width="480px" />

**✅ 이미지 크기 줄이기**
너무나도 큰 hero 이미지의 크기 때문에 LCP(Largest Content Paint) 수치가 꽝이었다. 빌드를 하면 친절하게 warning까지 띄워준다.

<img src="10.png" />

게다가 현재 gif들도 많이 사용되고 있어서 성능이 처참하다. gif를 지양하고 있다는 것은 처음 알았는데, 구체적인 이유는 [이곳](https://medium.com/vingle-tech-blog/stop-using-gif-as-animation-3c6d223fd35a)에서 확인해볼 수 있다.

`png` 확장자의 이미지는 `webp`로, `gif`는 비디오 포맷인 `mp4`로 변환하여 이미지 콘텐츠의 크기를 줄였다.

> 🧐 **webp?**
> 구글에서 만든 이미지 파일 포맷. 손실 압축(JPEG)과 비손실 압축(PNG, GIF)를 모두 지원하며, 손실/비손실 모두 약 30% 정도 용량을 줄여 보다 빠른 웹 사이트 로딩이 가능하다.

**<이미지 변환 이전>**
<img src="11.png" />

**<이미지 변환 이후>**
<img src="12.png" />

참고로 `mp4`를 사용하기 위해서는 `<video>`와 `<source>` 태그를 활용한다.

```jsx
const GifItem = ({ videoUrl = "", title = "" }) => {
  // ...
  return (
    <video className={styles.gifImage} autoPlay muted loop>
      <source src={videoUrl} type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
};
```

**Ref**
https://www.npmjs.com/package/webpack-bundle-analyzer
https://webpack.js.org/plugins/css-minimizer-webpack-plugin/
https://webpack.js.org/plugins/mini-css-extract-plugin/
https://yamoo9.gitbook.io/webpack/webpack/webpack-plugins/extract-css-files
https://medium.com/vingle-tech-blog/stop-using-gif-as-animation-3c6d223fd35a

### 2. 필요한 것만 요청하기

**✅ 페이지별 리소스 분리**
webpack 등의 모듈러로 번들링한 파일은 유용하지만, 앱이 커지면 번들의 크기도 커진다. 그리고 SPA의 특성상 이 번들을 페이지 최초 로드 시 모두 불러오게 되며, 이는 초기 로딩 속도를 늦추는 원인이 된다. 이 문제를 해결하기 위해 번들을 나누는 방법이 등장했다. 코드 스플리팅을 통해 런타임에 번들을 동적으로 만들어 필요할 때 불러오게끔 할 수 있다.

React에서는 코드 스플리팅을 위해 `lazy`라는 기능을 제공한다. 아래와 같이 작성하며, 동적 로딩이 될 동안 화면을 대신할 `Suspense`와 함께 사용한다.

```jsx
const Search = React.lazy(() => import("./Search"));

const Home = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Search />
      </Suspense>
    </div>
  );
};
```

그러나 아무래도 페이지가 전환되는 사이에 새로운 청크 파일을 불러오는 동안 로딩 화면이 깜박하는 것은 UX 상으로 뭔가 부족하다. `@loadable/component`를 사용하여 다르게 구현해보았다.

```jsx
// SearchLoadable.jsx
import React from "react";
import loadable from "@loadable/component";

const SearchLoadable = loadable(() => import("../Search/Search"), {
  fallback: <div>Loading...</div>,
});

export { SearchLoadable };
```

`lazy`와 유사한 방식으로 작성해주고, 역시나 fallback 옵션으로 로딩 중일 때 보여줄 컴포넌트를 넣어줄 수 있다. loadable의 특징은, preload를 지원한다는 점이다.

```jsx
// Home.jsx
const Home = () => {
  return (
    <Link to="/search" onMouseOver={() => SearchLoadable.preload()}>
      <button className={styles.cta}>start search</button>
    </Link>
  );
};
```

해당 페이지로 링크되는 DOM 요소에 마우스 호버 시, 사용자의 동작을 예측하고 미리 청크 파일을 불러온다. 이렇게 마우스를 해당하는 DOM 요소에 올리면 크롬 개발자 도구의 Network 탭에서 새로운 청크 파일을 불러오는 것을 볼 수 있다!

<img src="13.gif" width="560px" />

그밖에도 loadable은 SSR, Library Splitting 등의 기능을 지원하고 있다고 하니, 유용하게 활용해보자.

**Ref**
https://ko.reactjs.org/docs/code-splitting.html#reactlazy
https://loadable-components.com/docs/prefetching/

### 3. 같은 건 매번 새로 요청하지 않기

**✅ CloudFront 캐시 설정**
cloudfront의 cache를 CachingOptimized로 선택하고, 기본으로 설정된 TTL(Time-To-Live) 설정을 해주었다.

<img src="14.png" width="560px" />
<img src="15.png" />

✔️ **Minimum TTL**
**객체가 업데이트되었는지 여부를 확인**하기 위해 CloudFront에서 오리진으로 다른 요청을 전송하기 전에 객체를 CloudFront 캐시에 유지할 최소 시간(초)을 지정한다.

✔️ **Maximum TTL**
객체가 업데이트되었는지 여부를 확인하도록 CloudFront에서 오리진에 쿼리하기 전에 CloudFront 캐시에서 객체를 머무르게 하려는 최대 시간을 초 단위로 지정한다. 최대 TTL에 지정하는 값은 오리진이 객체에 `Cache-Control: max-age`, `Cache-Control: s-maxage` 또는 `Expires` 등의 **HTTP 헤더를 추가할 경우**에만 적용된다.

✔️ **기본 TTL**
객체가 업데이트되었는지 여부를 결정하도록 CloudFront가 오리진에 다른 요청을 전달하기 전에 객체를 CloudFront 캐시에 유지하려는 기본 시간을 초 단위로 지정한다. 기본 TTL에 지정하는 값은 오리진이 객체에 `Cache-Control: max-age`, `Cache-Control: s-maxage` 또는 `Expires` 등의 **HTTP 헤더를 추가하지 않을 경우**에만 적용된다.

과제에서는 정적 파일들이 전부 제대로 캐싱이 되고 있지 않아서 성능 측정 시 해당 부분의 점수가 낮았다. 그래서 바뀔 일이 거의 없는 정적 파일들, 예를 들면 메인 페이지에서 사용되는 이미지 파일들의 경우 header에 `Cache-Control: max-age`를 넣어주었다. 많은 경우 정적 파일들에 대해서 `max-age`를 1년으로 설정해 주고 있기 때문에 그대로 적용해 보았다.

<img src="16.png" width="560px" />

`max-age`를 설정해 준 파일들의 경우 두 번째 이후 로드 시 memory cache에서 불러오는 것을 확인할 수 있다!

<img src="17.png" width="560px" />

긴 캐시 지속 기간의 문제는, 새로 바뀐 코드가 푸쉬되어도 cloudfront에서 새로 업데이트되지 않는다는 것이다. webpack은 앱을 빌드할 때마다 결과물 파일들에 유니크한 해쉬 이름을 붙여주어서 새로운 파일이 업데이트되었음을 알릴 수 있게끔 해준다.

```jsx
// webpack.config.js
module.exports = {
  // ...
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, '/dist'),
    clean: true,
  },
```

**✅ GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.**

Map과 closure를 이용하여 JavaScript로 cache를 구현했다.

```jsx
export const fetchTrendingGifs = (() => {
  const cache = { current: null };

  return async () => {
    try {
      if (!cache.current) {
        const response = await fetch(TRENDING_GIF_API);
        const gifs = await response.json();
        const data = formatResponse(gifs.data ?? []);

        cache.current = data;
      }

      return cache.current ?? [];
    } catch (error) {
      return [];
    }
  };
})();
```

**Ref**
https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesMinTTL
https://web.dev/http-cache/
https://web.dev/uses-long-cache-ttl/
https://joshua1988.github.io/web-development/webpack/caching-strategy/

### 4. 최소한의 변경만 일으키기

**✅ 검색 결과 > 추가 로드시 추가된 목록만 렌더되어야 한다.**
동일한 props로 반복적으로 렌더되는 자식 컴포넌트들을 `React.memo`로 감싸주었다.

**<memoize 이전>** 모든 GifItem이 리렌더링
<img src="18.gif"  />

**<memoize 이후>** 기존의 GifItem은 리렌더링이 되지 않음
<img src="19.gif"  />

**✅ LayoutShift 없이 hover 애니메이션이 일어나야 한다.**
CSS에서 layout shift가 발생하는 `top` 속성 대신 `transform: translate`을 사용했다.

**Ref** https://csstriggers.com/

### 성능 개선 이후

이렇게 여러 단계로 성능 개선을 마친 이후 재측정한 결과!

**<lighthouse 성능 지표>**
<img src="20.png"  />

**<WepPageTest, Paris Fast 3G 성능 지표>**
<img src="21.png"  />

이밖에도 웹폰트 다운로드 개선, 이미지 preload 등 성능을 개선할 수 있는 영역은 끝이 없다. 일단 이 정도로 정리하고 앞으로 우리 서비스에서 개선해나갈 수 있는 부분들을 계속해서 찾아 나가고자 한다.
