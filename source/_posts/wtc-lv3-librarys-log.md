---
title: 우테코 Lv3 학습로그 - 사용 라이브러리 정리
date: 2021-08-19 17:25:42
tags: woowacourse
thumbnailImage: https://i.imgur.com/frkONDC.jpg
---

사용 라이브러리 정리

<!-- more -->

## axios

브라우저와 node.js를 위한, Promise api를 활용하는 http 비동기 통신 라이브러리다. 비슷한 기능을 하는 브라우저 빌트인 도구 **fetch** api가 있지만, restful API의 기본이 되는 CRUD 요청에 **fetch**를 사용하는 건 꽤나 불편하다.

```jsx
fetch(url, {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  body: JSON.stringify(data), // body data type must match "Content-Type" header
});
```

**axios**로는 간단하게 메서드로 요청 타입을 작성해줄 수 있으며, 데이터 전송 시 `JSON.stringify`를 해주지 않아도 된다.
~~물론 인라인으로 작성해서 더 깔끔해 보인다. 이게 바로 많은 광고들의 술수?~~

```jsx
axios.post(url, { data: data });
```

이밖에도 **axios**는 여러 편리한 기능들을 가지고 있다.

| axios                                           | fetch                                                          |
| :---------------------------------------------- | :------------------------------------------------------------- |
| 요청 객체에 url이 있다                          | 요청 객체에 url이 없다                                         |
| 써드파티 라이브러리로 설치가 필요               | 현대 브라우저에 빌트인이라 설치 필요 없음                      |
| XSRF 보호를 해준다                              | 별도 보호 없음                                                 |
| data 속성을 사용                                | body 속성을 사용                                               |
| data는 object를 포함한다                        | body는 문자열화 되어있다                                       |
| status가 200이고 statusText가 ‘OK’이면 성공이다 | 응답객체가 ok 속성을 포함하면 성공이다                         |
| 자동으로 JSON데이터 형식으로 변환된다           | json()메서드를 사용해야 한다                                   |
| 요청을 취소할 수 있고 타임아웃을 걸 수 있다     | 해당 기능 존재 하지않음                                        |
| HTTP 요청을 가로챌수 있음                       | 기본적으로 제공하지 않음                                       |
| download진행에 대해 기본적인 지원을 함          | 지원하지 않음                                                  |
| 좀더 많은 브라우저에 지원됨                     | Chrome 42+, Firefox 39+, Edge 14+, and Safari 10.1+이상에 지원 |

많은 기능들 중,

> 1. 응답이 자동으로 **json 데이터 형식**으로 변환된다
> 2. `status`/`statusText`가 별개로 제공되어 **응답 상태별로** 좀 더 섬세하게 구분할 수 있다
> 3. **http 요청을 가로챌** 수 있는 `interceptor` 기능

을 활용했다.

특히 axios interceptor를 이용해 http 요청과 응답을 보내기 전 사전에 지정한 동작을 수행하게끔 만들었다.

프로젝트에서는 dev와 prod 구분을 위해 아래와 같이 `BASE_URL`을 구분했다.

```tsx
export const BASE_URL: { [key: string]: string } = {
  development: "https://nolto-dev.kro.kr",
  production: "https://nolto.kro.kr",
};
```

`interceptor`를 사용해서 요청에 유저의 토큰을 담아 보내주게끔 했다.

```tsx
const api = axios.create({
  baseURL: BASE_URL[process.env.NODE_ENV] || BASE_URL.development,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

이밖에도 `config`를 통해 axios의 응답 스키마를 커스터마이징해줄 수 있는 옵션들이 많이 있으니 잘 활용해 보자!

**Ref**

- https://github.com/axios/axios
- https://kyun2da.dev/라이브러리/axios-개념-정리/

---

## react-query

React App에서 서버와의 상태 동기화를 위해 사용한다. 서버 데이터를 가져오고, 자동으로 캐싱해주며, 동기화까지 해주는 완전 멋진 라이브러리다!

또 **react-query**를 사용하면 개발자들이 각기 다르게 사용해왔던 http 응답 상태에 대한 관리를 일관성 있게 처리해줄 수 있다.

상태관리가 메인인 **recoil**도 도입을 고려했었는데, 커뮤니티형 프로젝트 특성상 상태관리가 필요한 데이터가 많지 않다고 생각했다. 서버와의 비동기 api 통신이 잦은 만큼 서버 데이터를 주로 관리해줄 수 있는 **react-query**를 최종적으로 결정하게 되었다.

프로젝트 전체의 핵심 기능을 하는 라이브러리 선정을 위한 구체적인 고민과 논의의 과정은 아래와 같다.

> 1. **react query** 완전 fancy하고 편리하다. 사용하자 (지그)
> 2. 우리 앱은 서버와의 즉각적인 통신이 필요하지 않을 것 같으니 **recoil**로도 충분하다 (미키)
> 3. **react query** 완전 편리한 것 같다. 상태관리할 데이터도 딱히 없을 것 같다. (미키)
> 4. 포코가 상태관리 나중에 하면 힘들어질 거라고 했다. 다른 크루들도 사용할 때 **recoil**을 사용해보는 게 좋겠다. (지그)
> 5. **recoil** 너무 복잡하다. 더군다나 cache된 데이터만 가져오고, 서버에서 신규 데이터를 가져오는 과정이 복잡하다. (미키)

👾 결론: **react-query** 쓰자! 🙆‍♂️🙆‍♀️ [셀프 출처](https://zigsong.github.io/2021/07/18/woowa-week-24/#recoil-react-query)

기본적으로 `useQuery`를 사용하여 비동기 데이터를 가져온다. 각 데이터는 유니크한 queryKey값으로 관리되며, 이 key는 앱 내의 컴포넌트들 간에 공유된다. `useQuery`에 key값과 Promise를 리턴하는 콜백 함수를 인자로 작성해준다.

```tsx
import { useQuery } from "react-query";

function App() {
  const info = useQuery("todos", fetchTodoList);
}
```

실제 프로젝트에서는 custom hook과 결합하여 아래처럼 query 코드를 작성했다. `useQuery`가 호출하는 콜백 함수를 별도의 파일에서 관리할 수 있다는 점에서 유용하다.

```tsx
const useHotFeedsLoad = ({ ...option }: CustomQueryOption) => {
  return useQuery<Feed[], HttpError>(["hotFeeds"], loadHotFeeds, option);
};
```

POST, PUT, DELETE 요청 등 서버 데이터를 변경할 때에는 `useQuery` 대신 `useMutation`을 사용한다. 이벤트 핸들러 또는 조건부로 `useQuery`를 호출 시 [hook 규칙](https://ko.reactjs.org/docs/hooks-rules.html)에 위반되기 때문에 **react-query**는 `useMutation`을 제공한다. 데이터의 수정이나 삭제 발생 시점에 `useMutation`으로 생성한 인스턴스에서 `mutate` 메서드를 호출하여 원하는 때에 요청 로직을 수행할 수 있다.

프로젝트에서는 `useMutation` 역시 `useQuery`와 마찬가지로 custom hook으로 작성해주고 있다.

```tsx
const useFeedModify = () => {
  return useMutation<AxiosResponse<unknown>, HttpError, Args>(uploadFeed);
};
```

사용하는 컴포넌트에서는, 피드 수정 시 사용자가 입력한 데이터를 함께 보내 mutation을 실행해 준다. mutate에 성공하면 사용자에게 snackbar로 알려준다.

```tsx
const Modify = () => {
  const modifyMutation = useFeedModify();

  const modifyFeed = (formData: FormData) => {
    modifyMutation.mutate(
      { feedId, formData },
      {
        onSuccess: () => {
          snackbar.addSnackbar('success', ALERT_MSG.SUCCESS_MODIFY_FEED);
        },
      },
    );
  };

  return (
    // ...
  )
}
```

react-query의 `useMutation`을 사용하는 경우 `onSuccess` 옵션을 함께 사용하면 캐시되어 있는 query 데이터를 무효화하는 `queryClient.invalidateQueries`와 호출 query의 데이터를 업데이트하는 `queryClient.setQuerydata`를 사용하여 서버에서 업데이트된 데이터를 새로 받아올지 여부를 결정할 수 있다.

> 👾 Automatic Refetch after Mutation을 자동으로 해주지 않는다는 점은 조금 아쉽다. react-query 공식문서에서는 이를 지원한다고는 하지만, 사용자(개발자)가 별도의 코드를 작성해줘야 한다고 한다.

**react-query**가 제공하는 option들, 예를 들어 요청의 `retry` 횟수, `suspense`와 `errorBoundary` 사용 여부 등을 지정해준다면 앱의 특성에 맞게 커스터마이징할 수 있다. 브라우저에서 다른 탭으로 다시 이동했다가 현재 탭으로 다시 focus되었을 때 데이터를 refetch해오는 옵션(`refetchOnWindowFocus`) 등 상당히 fancy해 보이는 기능도 있으며 `QueryClient`가 제공하는 메서드들을 통해 서버의 캐시 데이터를 초기화하거나 fetching을 취소하는 옵션 등 다양한 기능을 활용할 수 있다.

다만 코치님께 **react-query**보다 용량이 작은 **swr**도 고려해보면 좋겠다는 조언을 받았다. ~~하지만 앱 전체를 갈아엎는 시도는 참으로 용기가 필요한 일이다.~~ 그나저나 **react-query** 공홈에서는 자신들이 **SWR**, **Apollo Client**, **RTK-Query**보다 모든 측면에서 더 낫다는 자료를 공개하고 있다. 선택은 자유지만 저 자신감 부럽다.

**SWR**이 용량 측면에서는 **react-query**보다 이점이 있지만, 12kB와 4kB의 차이가 그렇게 큰지는 모르겠다. 또 공식 devtools를 제공한다는 점은 큰 장점이라고 생각한다. 마지막으로 react-query는 렌더링 최적화를 수행한다는 점에서 매력적이다. 쿼리가 업데이트되었을 때만 컴포넌트를 리렌더링하며, batching을 사용해서 같은 쿼리를 사용하는 여러 컴포넌트를 실제 업데이트가 발생했을 때 한 번만 렌더링한다고 한다.

그리고 [npm-trends](https://www.npmtrends.com/react-query-vs-swr)에 따르면, 최근에는 **react-query**의 사용이 증가하고 있다. 용량은 **swr**이 절반 정도지만, 그렇게 유의미한 차이는 아니라고 생각한다. 또 semver로 봤을 때 아직까지 메이저 버전이 출시되지 않았다! 안정성 측면에서 **react-query**가 조금 더 매력적으로 보인다. 그나저나 **react-query**가 7년이나 된 라이브러리였다니 놀랍다.

<img src="01.png" />

**Ref**

- https://react-query.tanstack.com/overview
- https://maxkim-j.github.io/posts/react-query-preview

---

## react-hook-form

form input을 다루기 정말 번거로운 React App을 위한 라이브러리다.

사용자가 입력할 form data를 일일이 `useState`에 담아주는 것이 반복적인 코드를 무한 양성하는, 어찌 보면 무의미한 일이라는 생각이 들었다. 그리고 기존의 작성법에서 input validation을 하나하나 처리해주는 일은 너무나도 귀찮고 까다로웠다. 그런 김에 다른 fancy한 라이브러리를 도입해보자! 고민 끝에 **react-hook-form**이라는 라이브러리를 발견했다.

공통의 form 안에 있는 각각의 input에 이름을 붙여준다. 여기서는 `register`의 인자로 input의 이름을 전달하는 방법을 선택했으며, `required` 옵션과 `maxLength` 등 input 태그가 기본적으로 제공하는 validation 관련 속성들도 붙여줄 수 있다. form에서 submit 이벤트 발생 시 `handleSubmit` 메서드(일반적인 form을 submit할 때의 네이밍 컨벤션과 같지만, 여기서 `handleSubmit`은 `useForm` hook에서 리턴하는 함수의 이름이다.) 이름이 붙은 input들의 value를 formData에 모아 한번에 가져다 준다.

각 input value는 비제어 컴포넌트의 방식으로 값을 취득하지만, `watch` 옵션으로 값을 관찰하여 input 이벤트가 발생할 때마다 특정 로직을 수행해줄 수도 있다. 하지만 그로 인해 값이 바뀔 때마다 렌더링이 발생하니 주의하자. 리렌더링을 방지하기 위해서는 callback을 사용하거나 `useWatch`를 사용할 수 있다.

```tsx
export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="test" {...register("example")} />

      <input {...register("exampleRequired", { required: true })} />
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}
```

form 관련 React 라이브러리에서 아직까지는 **Formik**이 앞서고 있지만, **react-hook-form**의 깃헙 스타 수도 꾸준히 증가중으로 곧 **Formik**을 따라잡을 듯 하다. **Formik** 대신 **react-hook-form**을 쓰게 된 결정적인 이유는, **Formik**에서는 input validation 코드가 너무 복잡했다. **yup**이라는 라이브러리를 추가적으로 쓰지 않는 한, 하나의 input에 걸린 모든 validation을 `if~else`절로 일일이 분기쳐줘야 한다. 프로젝트에서 제일 골칫거리였던 문제를 해결할 수 없었다!

**react-hook-form**에서는 꽤나 간단하다. 프로젝트에서는 아래와 같이 적용했다. `useForm`에서 리턴되는 `formState`의 `errors`를 통해 form에 포함된 input들에 걸려 있는 validation에서 발생한 error를 가져올 수 있다. 해당 error를 ErrorMessage 컴포넌트에 넘겨줘 에러를 표시하게끔 했다.

```tsx
const FeedUploadForm = ({ onFeedSubmit, initialFormValue }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ shouldUnregister: true, defaultValues: initialFormValue });

  return (
    <Form onSubmit={handleSubmit(submitFeed)}>
      <Styled.VerticalWrapper>
        <Label text="제목" htmlFor="title" required={true} />
        <FormInput
          id="title"
          {...register('title', {
            required: UPLOAD_VALIDATION_MSG.TITLE_REQUIRED,
          })}
        />
        <ErrorMessage targetError={errors.title} />
      </Styled.VerticalWrapper>
      // ...
```

아래처럼 귀엽게 표시했다.

<img src="02.png" width="440px" />

**Ref** https://react-hook-form.com/

---

## styled-components

~~너무나 익숙해서 썼다…!~~는 말도 안될 일이고, 아무튼 간에 CSS-in-JS가 편리한 건 어쩔 수 없다. React로 개발을 하며 JavaScript 기반으로 CSS 코드를 작성할 수 있다는 점은 개발자 입장에서 무척 매력적이다. 또 컴포넌트별로 확실하게 스코프가 분리된 스타일 시트를 만들거나 props를 이용하여 스타일링에 변화를 주는 방식도 편리한 **styled-components**를 사용하게 되었다.

CSS-in-JS 방식은 일반적으로 아래와 같은 많은 장점들을 제공한다.

- Global namespace - class명이 build time에 유니크한 해시값으로 변경되기 때문에 별도의 명명 규칙이 필요하지 않다.
- Dependencies - CSS가 컴포넌트 단위로 추상화되기 때문에 CSS 파일(모듈)간에 의존성을 신경 쓰지 않아도 된다.
- Dead Code Elimination - 컴포넌트와 CSS가 동일한 구조로 관리되므로 수정 및 삭제가 용이하다.
- Minification - 네임스페이스 충돌을 막기위해 BEM 같은 방법론을 사용하면 class 명이 길어질 수 있지만, CSS-in-JS는 짧은 길이의 유니크한 클래스를 자동으로 생성한다.
- Sharing Constants - CSS 코드를 JS에 작성하므로 컴포넌트의 상태에 따른 동적 코딩이 가능하다.
- Non-deterministic Resolution - CSS가 컴포넌트 스코프에서만 적용되기 때문에 우선순위에 따른 문제가 발생하지 않는다.
- Isolation - CSS가 JS와 결합해 있기 때문에 상속에 관한 문제를 신경 쓰지 않아도 된다.

> **👾 물론, 최종 번들링 크기에 따른 성능상의 문제는 유의미한 차이가 생길 수 있다.**

CSS-in-JS를 사용하기 위해서는 **styled-components**와 같은 별도의 라이브러리를 설치해줘야 한다. 라이브러리 추가는 곧 번들 사이즈 크기가 커진다는 말과 같다.

게다가 CSS-in-JS는 JavaScript가 모두 로드된 후에 JavaScript 코드를 생성하기 때문에 더욱 느려질 수밖에 없다. CSS-in-JS는 js 파일에 CSS 코드를 포함하기 때문에, 페이지 전환 또는 컴포넌트 업데이트 시 JavaScript에서 CSS를 추출해야 한다.

반면에, 빌드타임에 CSS 파일이 추출되는 CSS Modules 방식은 JavaScript 평가 과정이 따로 없기 때문에 훨씬 빠르게 페이지가 전환된다. 또 CSS가 먼저 제공되어 렌더링 시 형태가 잡혀있는 CSS Modules 방식과 달리 CSS-in-JS 방식은 컴포넌트가 렌더링되며 형태가 잡혀나가기 때문에 원형의 못생긴(!) 모습이 잠깐 노출되는 문제가 있다.

위와 같은 일부 단점들이 있지만, 개발자의 입장에서 개발의 편리성과 디버깅의 용이성을 놓칠 수 없어서 **styled-components**를 택하게 되었다. 사용자 인터랙션 측면에서도 아직까지 큰 성능상의 이슈나 병목점을 발견하진 못했기 때문에 우선적으로는 계속 **styled-components**를 사용할 계획이다.

(2021.11.6 추가)
어차피 지금은 SSR을 중이고, 프론트엔드 서버에서 **styled-components**의 `ServerStyleSheet`을 미리 내려주기 때문에 웹페이지 초기 진입 시 못생긴 원형의 컴포넌트가 노출될 일은 없다고 생각한다.

**emotion** 라이브러리도 **styled-components**와 같은 기능들을 제공하며 라이브러리의 크기도 작아 많이 사용되는 방식이다. 그러나 주요 작성 관점이 다른 듯하다. **emotion**의 경우 css 코드를 객체 형태로 제공한다는 점이 특징적이다.

```tsx
import { css, cx } from "@emotion/css";

render(
  <div
    className={css`
      padding: 32px;
      background-color: hotpink;
      font-size: 24px;
      border-radius: 4px;
      &:hover {
        color: ${color};
      }
    `}
  >
    Hover to change color.
  </div>
);
```

그러나 이런 `css`객체 형태는 **styled-components**에서도 사용할 수 있는 방식이며, 개인적으로는 각각의 `css` 객체에 이름을 붙여주는 것보다 DOM 태그 자체에 이름을 붙여주는 방식이 더 편했다. 그리고 **emotion**을 사용했을 때에도, 결국 `styled`를 import해서 쓰게 되는 건 똑같더라.

추가적으로 **styled-components**는 다른 스타일 컴포넌트 뿐 아니라 리액트 컴포넌트도 확장해서 작성할 수 있다는 점이 편리해서, 프로젝트에서 유용하게 사용하고 있다. (아래 예시)

```tsx
export const Stack = styled(TechChip)`
  font-size: 12px;
  color: ${PALETTE.PRIMARY_VIOLET_TEXT};
`;
```

**Ref**

- https://blueshw.github.io/2020/09/27/css-in-js-vs-css-modules/
- https://ideveloper2.dev/blog/2019-05-05--thinking-about-emotion-js-vs-styled-component/

---

## devDependencies

### webpack 관련

✅ **webpack**
여러 개의 파일을 하나로 합쳐주는 모듈 번들러

✅ **webpack-cli**
webpack의 커맨드 라인 인터페이스다. 즉 터미널에서 webpack 커맨드를 실행할 수 있게 해준다.

✅ **webpack-dev-server**
webpack에서 기본으로 제공하는 개발용 서버. 라이브 리로딩을 지원한다. (dev mode에서만 사용해야 한다!)

✅ **html-webpack-plugin**
번들링한 결과의 css와 js파일을 각각 html 파일에 심어주는 과정을 자동화해준다.

✅ **@svgr/webpack**
리액트 앱에서 svgr을 쓸 수 있게 해준다. svgr 로더만 설치 시 리액트 컴포넌트처럼 사용이 가능하다. 사용을 위해서 webpack config에 추가해준다.

```tsx
// webpack.config.js
module: {
  rules: [
    // ...,
    {
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    },
  ];
}
```

✅ **copy-webpack-plugin**
특정 폴더 또는 파일들을 빌드 폴더로 복사해준다. netlify의 redirect 옵션을 위한 `_redirects` 파일을 빌드 폴더에도 포함시켜주기 위해 사용했다.

✅ **file-loader**
`import`나 `require`로 불러온 파일을 읽어 url로 변환하고 해당 파일을 빌드 폴더로 넣어준다. 파일을 모듈로 사용할 수 있게끔 해주는 것이다. webpack config 설정을 통해 test에 포함되는 이미지 확장자 파일을 발견하면 **file-loader**로 처리한다.

```tsx
// webpack.config.js
module: {
  rules: [
    // ...,
    {
      test: /\.(png|jpe?g|gif)$/i,
      use: [
        {
          loader: "file-loader",
        },
      ],
    },
  ];
}
```

실제 빌드 폴더에 알 수 없는 해시값의 이름으로 된 파일들이 담긴다.

<img src="03.png" />

> 👾 babel v5 이상부터는 deprecated되었으며, [**asset modules**](https://webpack.js.org/guides/asset-modules/)를 사용하면 된다고 한다.

**Ref** https://velog.io/@hwang-eunji/svg-파일-react-next에서-사용하기

### babel 관련

✅ **@babel/core**
ES6 문법을 ES5 문법으로 바꿔준다.

✅ **@babel/preset-env**
타겟 환경에 필요한 구문 변환(syntax transform), 브라우저 폴리필(browser polyfill)을 제공한다.

✅ **@babel/preset-react**
JSX 코드를 `React.CreateElement` 호출 코드로 변환한다. 즉 JSX 문법을 JavaScript로 변환한다.

✅ **@babel/preset-typescript**
TypeScript 사용 시 *권장*되는 preset이다. **@babel/plugin-transform-typescript**를 포함하고 있다.

> **👾 잠깐! TypeScript도 컴파일러(트랜스파일러)가 아닌가?**

그렇다. 두 개의 컴파일러(TypeScript와 babel)을 함께 사용하면 컴파일의 흐름은 다음과 같다.

> TS → TS Compiler → JS → Babel → JS (again)

webpack의 TypeScript 로더로 **ts-loader**를 사용할 수 있지만, 일반적으로 사용하는 **babel-loader**에 비해 빌드 속도가 느리다. 또한 HMR(Hot Module Replacement)를 지원하지 않는다.

따라서 **babel-loader**를 사용하되, babel이 TypeScript 문법을 올바르게 해석하고 JavaScript로 트랜스파일링해주기 위해 추가적인 작업이 필요하다. 여기서 필요한 것이 **@babel/preset-typescript**이다. 이때 TypeScript는 타입 체킹만을 위해 사용된다.

✅ **@babel/runtime** & **@babel/plugin-transform-runtime**
위 두 모듈은,

> ReferenceError: regeneratorRuntime is not defined

에러를 해결하기 위해 사용했다. regenerator-runtime은 페이스북에서 내부적으로 만든 generator funtion polyfill로, react에서 ES8 문법인 `async-await`을 사용할 때 관련된 regenerator를 제공하지 않아서 위와 같은 에러가 발생한다. 원래는 이를 해결하기 위해 **@babel/polyfill**을 사용했으나, 불필요한 polyfill들도 몽땅 추가되어 번들 파일의 크기가 커지는 이슈와 이로 인한 전역변수 오염 등의 문제로 현재 deprecated되었다.

**@babel/plugin-transform-runtime**은 내부적으로 **babel-runtime**을 dependency로 갖는다. **@babel/plugin-transform-runtime**은 트랜스파일링 과정에서 헬퍼들을 **babel-runtime** 모듈이 참조하도록 변경해주는 역할을 한다. 이렇게 하는 이유는, 컴파일된 결과물에서 헬퍼들의 중복을 피하기 위함이다. 함수들을 모듈화해주는 것이다.

그렇게 **babel-runtime**은 실제 실행 환경에서 헬퍼함수들이 참조할 수 있는 polyfill을 내장한 모듈로서 동작한다. 그리고 regenerator-runtime의 버전을 포함하고 있다.

> 👾 인스턴스 메서드 문제로 인해 **core-js@3**의 사용을 권장하기도 했으나, babel 7.4.0 이후 버전부터 **transform-runtime**이 **core-js@3**을 지원한다고 한다.

✅ **babel-jest**
babel에서 jest를 사용할 수 있게 해주는 플러그인

✅ **babel-loader**
자바스크립트 파일을 babel/preset/plugin과 webpack을 이용하여 ES5로 컴파일해준다.

✅ **babel-plugin-styled-components**
styled-components 사용 시 *권장*되는 플러그인이다. 스타일 컴포넌트의 이름을 className의 해시값 앞에 접두사로 붙여서 넣어주어 디버깅을 편리하게 해준다.

✔️ **Ref**

- https://babeljs.io/docs/en/babel-runtime
- https://babeljs.io/docs/en/babel-plugin-transform-runtime
- https://tech.kakao.com/2020/12/01/frontend-growth-02/
- https://programmingsummaries.tistory.com/401
- https://velog.io/@pop8682/번역-React-webpack-설정-처음부터-해보기
- https://ui.toast.com/weekly-pick/ko_20181220
- https://jeonghwan-kim.github.io/dev/2021/03/08/babel-typescript.html

### eslint 관련

✅ **eslint**
✅ **eslint-config-prettier**
✅ **eslint-plugin-prettier**
✅ **eslint-plugin-react**
✅ **prettier**

### 테스트

✅ **testing-library**
✅ **storybook**
✅ **jest**
✅ **msw**
mock service worker를 가리킨다. **react-testing-library**를 사용할 때, 실제 api를 호출을 가로채어 마치 http 통신을 수행하는 것처럼 mocking할 수 있다.

✅ **react-test-renderer**
DOM에 의존하지 않고 리액트 컴포넌트를 순수한 자바스크립트 객체들로 바꿔주는 렌더링 라이브러리다. 즉 브라우저나 jsdom을 사용하지 않고 리액트 DOM에 의해 렌더된 DOM 트리의 스냅샷을 찍어준다. 실험적인 단계라고 한다.

**Ref** https://www.npmjs.com/package/react-test-renderer

### 기타

✅ **ts-jest**
TypeScript로 jest를 작성할 수 있게 해주는 라이브러리

✅ **tsconfig-paths**
TypeScript에서 절대경로를 쓸 수 있게 해 준다. tsconfig 설정을 추가해줘야 한다.

```tsx
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "baseUrl": "src",
  },
  "includes": ["src", "custom.d.ts"]
}
```

✅ **husky**
git hook을 쉽게 사용할 수 있도록 도와주는 툴이다. 루트 디렉토리의 `.husky` 폴더 안에 필요한 명령어 모음을 파일로 저장해둔다.
