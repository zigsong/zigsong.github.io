---
title: webpack 최적화
date: 2023-01-05 22:36:18
tags: frontend
thumbnailImage: https://i.imgur.com/2Dqm3wS.jpg
---

webpack 어디까지 파봐야겠니

<!-- more -->

---

## webpack plugin 활용하기

- [SplitChunksPlugin](https://webpack.kr/plugins/split-chunks-plugin/)

  - 기본 동작
    ```jsx
    module.exports = {
      //...
      optimization: {
        splitChunks: {
          chunks: "async",
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      },
    };
    ```
  - chunk option

    - initial / async / all

    ```jsx
    // app.js
    import "my-static-module";
    import("my-dynamic-module"); // 비동기 모듈 import

    console.log("My app is running");
    ```

    - async
      - 비동기로 import된 모듈을 분리
      - bundle(app + my-static-module) + my-dynamic-module chunk를 생성
    - all
      - 비동기/동기 import 모듈 모두 하나의 청크 파일로 분리
      - app + bundle(my-static-module + my-dynamic-module) 생성
    - initial
      - 정적 import 모듈은 무조건 별도의 청크로 생성, 남아있는 비동기 모듈들도 마찬가지로 분리
      - app + bundle(my-static-module) + my-dynamic-module chunk를 생성

  - 출처: [https://stackoverflow.com/questions/50127185/webpack-what-is-the-difference-between-all-and-initial-options-in-optimizat](https://stackoverflow.com/questions/50127185/webpack-what-is-the-difference-between-all-and-initial-options-in-optimizat)
  - (webpack 4부터 자동 지원)

- [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)
  - CSS를 포함하는 JS 파일별로 CSS 파일을 생성
  - CSS 및 SourceMaps의 온 디멘드 로딩(On Demand Loading) 기능도 지원
    - 즉 해당 문서가 요청하는 파일만 불러올 수 있으며, CSS 파일과 JS 파일을 병렬로 로드할 수 있다.
    - 전체 웹페이지의 리소스를 한 번에 로딩하는 것이 아니라, 사용자가 필요할 때까지 미뤄두다 원하는 시점(요구되는 순간)에 리소스를 로딩한다.
    - ex) 인피니티 스크롤
  - 개발 모드에서는 CSS를 여러 번 수정하고 DOM에 `<style>` 요소의 코드로 주입하는 것이 훨씬 빨리 작동하므로 `style-loader`를 사용하고, 배포 모드에서는 `MiniCssExtractPlugin` 를 사용하는 것을 권장
  - (webpack 공식 plugin이 아닌, 써드파티 라이브러리)
  - 셀프서비스에서는?
    ```jsx
    // webpack.config.prod.js
    module: {
      rules: [
        {
          test: /\.(s[ac]ss|css)$/i,
          exclude: /\.module.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' },
          ],
        },
        // ...
    ```
    - 빌드 시 다음과 같이 생성됨
      <img src="01.png" />
  - [CssMinimizerWebpackPlugin](https://webpack.js.org/plugins/css-minimizer-webpack-plugin/)과 함께 사용할 수 있다
    ```jsx
    module.exports = {
      module: {
        rules: [
          {
            test: /.s?css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
          },
        ],
      },
      optimization: {
        minimizer: [
          // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
          // `...`,
          new CssMinimizerPlugin(),
        ],
      },
      plugins: [new MiniCssExtractPlugin()],
    };
    ```
    - CSS 파일을 난독화
    - (webpack 공식 plugin이 아닌, 써드파티 라이브러리)
- [HtmlMinimizerWebpackPlugin](https://webpack.js.org/plugins/html-minimizer-webpack-plugin/)
- [ImageMinimizerWebpackPlugin](https://webpack.js.org/plugins/image-minimizer-webpack-plugin/)

---

## 기타 bundle 최적화

- [externals](https://webpack.kr/configuration/externals/)

  - 번들에 포함하지 않아도 되는 대상은 빌드 범위에서 빼는 것 (ex. axios 등 라이브러리)
    ```jsx
    module.exports = {
      externals: {
        axios: "axios",
      },
    };
    ```
  - `CopyWebpackPlugin`을 사용하여 라이브러리를 이동 후 index.html에서 직접 로딩한다

    ```jsx
    const CopyPlugin = require("copy-webpack-plugin");

    module.exports = {
      plugins: [
        new CopyPlugin([
          {
            from: "./node_modules/axios/dist/axios.min.js",
            to: "./axios.min.js", // 목적지 파일에 들어간다
          },
        ]),
      ],
    };
    ```

    ```html
    <!-- src/index.html -->
    <body>
      <script type="text/javascript" src="axios.min.js"></script>
    </body>
    ```

- babel cache
  - babel-loader도 캐시 가능
    ```jsx
    module.exports = {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              cacheCompression: false,
              cacheDirectory: true,
            },
          },
        ],
      },
    };
    ```
- lint cache
  ```jsx
  module.exports = {
    plugins: [
      new ESLintPlugin({ cache: true }),
      new StylelintPlugin({ files: "**/*.css", cache: true }),
    ],
  };
  ```
  또는 CLI에 추가 (package.json)
  ```jsx
  {
    "scripts": {
      "lint:css": "stylelint '**/*.css' --cache,
      "lint:js": "eslint . --cache,
    },
  }
  ```

---

## webpack cache option으로 개발환경 빌드 빨리하기

- 빌드 결과물이 변경되지 않았으면 계속 캐싱 상태로 남겨서, 별도의 HTTP 요청이 발생하지 않도록 한다
- cache options
  - dev에서는 기본으로 활성화(type: ‘memory’), prod에서는 비활성화
  - `cache.type`
    - ‘memory’ | ‘filesystem’ (webpack 5부터 등장)
    - filesystem 사용 시 기본적으로 `node_modules/.cache/webpack` 에 캐시됨
      - `cacheDirectory` 옵션으로 변경 가능
    - [ ] 🤔 질문: 왜 ‘memory’가 아닌 ‘filesystem’에 저장 시 캐시 성능이 더 빠를까요?
    - 🏃‍♀️ **속도 측정 결과 ([speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin) 사용)**
      cache type 변경 이전
      - 첫 번째 빌드: 23.059 secs
      - 두 번째 빌드: 23.48 secs (거의 동일)
        cache type: ‘filesystem’으로 변경 후
      - 첫 번째 빌드: 23.1 secs
      - ✨ 두 번째 빌드: 3.8 secs
      - ✨ 코드 한 줄 수정 후 재빌드: 5.002 secs
      - ✨ 코드 한 줄 수정 후 두 번째 빌드: 3.37 secs
      - 관련 MR: [https://git.baemin.in/ceo-frontend/ceo-web-selfservice-front/-/merge_requests/2198](https://git.baemin.in/ceo-frontend/ceo-web-selfservice-front/-/merge_requests/2198)
  - `cache.compression`
    - cache.type이 ‘filesystem’인 경우에만 사용 가능
    - dev 비활성화, prod 기본 ‘gzip’ 사용
  - 이밖에도 `hashAlgorithm`, `idleTimeout`, `maxAge` 등의 옵션 사용 가능…
  - `cache.memoryCacheUnaffected`
    - 변경되지 않은 모듈의 캐시를 계산하고 변경되지 않은 모듈만 참조
    - 🏃‍♀️`memoryCacheUnaffected` 적용 시 속도 측정
      - 3.25 secs로, 획기적으로 줄어들진 않은 것 같다 🤷‍♀️
  - filesystem cache는 CI 빌드 시에도 캐시를 공유할 수 있다.
    - [자세히 알아보기](https://webpack.js.org/configuration/cache/#setup-cache-in-cicd-system)

---

## Refs

- [https://betterprogramming.pub/4-ways-to-use-dynamic-remotes-in-module-federation-985e9fb69817?gi=41148ec0361f&source=read_next_recirc---two_column_layout_sidebar------3---------------------518909f2_685a_4d48_95af_5a38f0f2a908-------](https://betterprogramming.pub/4-ways-to-use-dynamic-remotes-in-module-federation-985e9fb69817?gi=41148ec0361f&source=read_next_recirc---two_column_layout_sidebar------3---------------------518909f2_685a_4d48_95af_5a38f0f2a908-------)
- [https://jeonghwan-kim.github.io/series/2020/01/02/frontend-dev-env-webpack-intermediate.html#4-최적화](https://jeonghwan-kim.github.io/series/2020/01/02/frontend-dev-env-webpack-intermediate.html#4-%EC%B5%9C%EC%A0%81%ED%99%94)
