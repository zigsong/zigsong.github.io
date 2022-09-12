---
title: 로그인에 refreshToken 적용하기
date: 2021-10-16 18:21:01
tags: frontend
---

SSR | refreshToken

<!-- more -->

<img src="/images/thumbnails/frontend-thumbnail.jpeg" />

기존 놀토 프로젝트에서의 로그인은, 로그인 요청을 보내면 서버에서 보내주는 accessToken을 localStorage에 저장하는 방식으로 이루어졌다. `localStorage`에 accessToken이 있다면 userInfo를 생성하여 현재 로그인 중인 유저의 정보를 만들어냈다.

하지만 이 방식은 XSS 공격에 너무나 취약하다! 해커가 악성 스크립트를 삽입한다면 사용자의 토큰을 탈취하여 해당 사용자의 계정을 마음대로 이용할 수 있게 된다.

이 문제를 해결하기 위해 등장한 방식 중 하나가 **refreshToken**이다. 사실 refreshToken은 [이전에도 잠깐 언급](https://zigsong.github.io/2021/09/18/wtc-week-32/#프론트에서-안전하게-로그인-처리하기)하고 지나갔었는데, 이번 기회에 본격적으로 도입해보게 되었다.

간단하게 정리하자면 아래와 같다.

> - accessToken, refreshToken 모두 JWT를 사용한다.
> - refreshToken은 클라이언트의 쿠키로 저장하며, 유효기간을 길게 설정한다.
> - accessToken은 앱 내 변수로 관리한다.
> - 클라이언트에서 서버 데이터 요청 시 accessToken으로 인증된 사용자의 여부를 판단한다.

팀원들과 논의하여 refreshToken을 세션(브라우저의 session storage가 아닌, 클라이언트-서버를 연결하는 세션)에 담는 방법과 쿠키에 담는 방법 두 가지를 생각해봤다. 결론적으로 선택한 것은 쿠키였지만, 그전에 세션에 담는 방법을 간단하게 살펴보고 넘어가자.

---

## 🌐 세션에 refreshToken 담기

1. 클라이언트가 백엔드 서버에 로그인을 요청한다.
2. 서버는 JSON 형태의 `accessToken`과 `refreshToken`을 반환한다.
3. 클라이언트는 `accessToken`을 앱 내 변수에 저장하고, 서버에 `accessToken`을 보내 `userInfo`를 응답 받는다.
4. `accessToken`, `refreshToken`, `userInfo`를 SSR 서버로 전달한다.
5. SSR 서버는 `accessToken`, `refreshToken`, `userInfo`를 담은 세션을 생성한다. 이때 세션의 유효기간은 `refreshToken`의 유효기간과 같다.
6. 이렇게 생성한 세션ID를 nginx 웹서버로 전달한다.
7. nginx 웹서버는 세션ID를 클라이언트의 쿠키로 전송한다.

### 😈 문제점

**1) 쿠키에 담겨 있는 세션ID가 탈취당할 수 있다?**
쿠키에 세션ID를 저장하든, `refreshToken`을 곧바로 저장하든 XSS 공격은 막을 수 있겠지만 CSRF 공격에는 취약하다.
CSRF 공격을 받았을 경우를 생각해 보자. 이때도 해커는 `refreshToken`으로 `accessToken`에 대한 재발급 요청만 가능할 뿐, 여전히 `accessToken`에 직접 접근할 수는 없다. 유저 정보를 이용하여 서버의 데이터를 가져오거나 변경하는 것은 `refreshToken`이 아닌 `accessToken`이 있어야 가능한 일이다. 즉, CSRF 공격을 통해 전달받은 결과로 서버의 데이터에 영향을 미치는 행동을 할 수는 없다. 해커가 `accessToken`을 재발급하는 요청을 강제로 실행시킨다한들 해당 `accessToken` 이용하여 어떤 동작을 수행할 수는 없는 것이다.

**2) SSR 서버의 세션 부하가 너무 많이 발생한다!**
로그인 요청이 들어오는 모든 사용자마다 세션을 생성하여 관리해줘야 한다. 클라이언트의 렌더링에 직접 영향을 미치는 우리의 소중한 SSR 서버가 너무 많은 일을 맡는 것은 좋지 않아 보인다.

---

## 🍪 쿠키에 refreshToken 담기

1. 클라이언트가 백엔드 서버에 로그인을 요청한다.
2. 서버는 JSON 형태의 `accessToken`과 `refreshToken`을 반환한다.
3. 클라이언트는 `accessToken`을 앱 내 변수에 저장하고, 서버에 `accessToken`을 보내 `userInfo`를 응답 받는다.
4. 클라이언트는 SSR 서버에 (내부적으로) 로그인 요청을 보낸다. 이때 `refreshToken`을 요청 바디에 담아 보낸다.
5. `refreshToken`을 받은 SSR 서버는 응답으로 클라이언트의 쿠키에 `refreshToken`을 저장한다. 이때 쿠키의 유효기간은 `refreshToken`의 유효기간과 같다.
6. 클라이언트는 앱 내 변수로 `accessToken`을, 쿠키에 `refreshToken`을 갖게 되었다. 이제 클라이언트는 유저 정보가 필요한 요청에는 `accessToken`을 담아 전송한다.
7. 클라이언트에서 페이지 새로고침 발생 시 앱 내 변수인 `accessToken`은 지워진다. 이때 클라이언트는 쿠키에 보관하고 있는 `refreshToken`을 SSR 서버에 전송하고, SSR 서버는 클라이언트의 ip를 확인하여 백엔드 서버에 토큰 재발급 요청을 전송한다.
8. 토큰 재발급 요청에 대한 응답으로 SSR 서버는 새로운 `accessToken`과 `refreshToken`을 갖게 되었다.
9. SSR 서버는 새로운 토큰을 이용해서 유저 정보를 prefetch하여 로그인된/로그아웃된 상태의 html을 클라이언트에 보내주고, (nginx 웹서버를 거친다.) script에 새로운 `accessToken`을 심어보낸다.
10. (추가) 유저가 로그인되어 있는 상태에서 `accessToken`의 유효기간이 지난다면, 다시 서버로 토큰 재발급 요청을 보낸다.

그림으로 살펴보자.

<img src="/refresh-token/01.png" />

> **😮 왜 백엔드 서버에서 `refreshToken`을 직접 쿠키에 담지 않았나?**

백엔드에서 쿠키를 설정하는 상황을 가정해보자.

1. `SameSite` 속성값을 `Lax` 또는 `Strict`로 설정해주고, `Domain` 속성에는 SSR 서버의 도메인을 설정해 준다. 이렇게하면 refreshToken 요청은 SSR 서버만 사용할 수 있게 될 것이다. 문제는 개발 환경인데, 개발 중에는 localhost에서 SSR 서버를 돌리는 프론트엔드의 입장에서 쿠키의 동작을 확인하기가 어려워진다.

2. `SameSite=None` 설정
   그렇다고 `SameSite` 속성값을 `None`으로 설정하면, 크로스 사이트 요청의 경우에도 항상 전송된다. 모든 서드파티 쿠키를 허용하는 것으로, 보안적으로 가장 취약하며 `Secure` 옵션을 반드시 함께 붙여줘야 한다. 보안 설정이 따로 필요하다.

즉 쿠키의 보안 옵션을 설정하는 과정에서의 번거로움(특히, 개발 단계에서 localhost를 사용하는 경우) 때문에 JSON으로 내려주게 되었다.

페이지 리로드 시 `accessToken`은 만료되기 때문에 `refreshToken`과 `accessToken`을 재발급받아야 한다. 이때 SSR 서버를 거쳐 토큰 재발급을 요청하게 되는데, 요청을 보내는 클라이언트의 IP가 가장 처음 로그인 시 요청을 보냈던 클라이언트의 IP와 다르다면 백엔드 서버는 `401 Unauthorized` 에러를 반환한다.

그렇게 해서 아래와 같은 코드가 탄생하게 되었다.

---

## 🤸‍♀️ 대망의 코드

> **📜 api 설명**
>
> - `/login/oauth/${type}/token?code=${code}`: 클라이언트에서 백엔드 서버로 보내는 로그인 요청. 응답으로 `refreshToken`과 `accessToken`을 받는다.
> - `/auth/login`: 클라이언트에서 SSR 서버로 보내는 로그인 요청. SSR 서버는 refreshToken을 쿠키에 담아 응답을 전송한다.
> - `/auth/logout`: 클라이언트에서 SSR 서버로 보내는 로그아웃 요청. SSR 서버는 쿠키에서 refreshToken을 삭제한다.
> - `/login/oauth/refreshToken`: SSR 서버에서 백엔드 서버로 보내는 토큰 재발급 요청. 클라이언트에서 페이지 리로드 시 accessToken이 사라지므로 매번 재발급을 해준다. 요청이 유효하다면 새로운 refreshToken과 accessToken을 응답으로 보내준다.

클라이언트 측 코드부터 살펴보자. 클라이언트에서 백엔드 서버에 로그인을 보내는 요청 코드는 다음과 같다.

```tsx
// src/hooks/useOAuthLogin.ts
const useOAuthLogin = (type: "google" | "github") => {
  const history = useHistory();
  const { login } = useMember();

  // 백엔드 서버로 OAuth 로그인 요청을 보낸다.
  const getAccessToken = async (code: string) => {
    const { data } = await api.get<AuthData>(
      `/login/oauth/${type}/token?code=${code}`
    );

    login(data);
    history.push(ROUTE.HOME);
  };

  useEffect(() => {
    // ...
  }, []);
};
```

위에서 사용하는 `useMember` hook의 `login` 함수는 아래 Context Provider 코드에서 확인할 수 있다.

```tsx
// src/contexts/member/MemberProvider.tsx
const MemberProvider = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const modal = useModal();
  const dialog = useDialog();

  const [accessToken, setAccessToken] = useAccessToken();

  // userInfo를 가져오는 요청을 보낸다.
  const { data: userInfo, refetch: refetchMember } = useMyInfo({
    accessToken,
    errorHandler: // ...,
    // ...
  });

  const login = async (authData: AuthData) => {
    setAccessToken(authData.accessToken);

    // 로그인 응답으로 받은 data를 SSR 서버에 전송한다.
    frontendApi.post('/auth/login', authData);
  };

  const logout = () => {
    // member query에 캐시되어있는 값을 제거해준다.
    queryClient.removeQueries(QUERY_KEYS.MEMBER);
    setAccessToken('');
    backendApi.defaults.headers.common['Authorization'] = '';

    frontendApi.post('/auth/logout');
  };

  const contextValue: ContextValue = useMemo(
    // ...
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
```

`accessToken`을 전반적으로 관리하는 hook인 `useAccessToken`을 작성했다.

```tsx
const EXPIRED_IN = 71400000;

const useAccessToken = () => {
  // 서버에서 script 태그로 받은 accessToken을 앱 내 변수로 담는다.
  const [accessToken, setAccessToken] = useState(
    hasWindow ? window.__accessToken__ : ""
  );

  // 사용자가 로그인된 상태에서 accessToken이 만료된다면, 서버에 다시 토큰 재발급 요청을 보낸다.
  useEffect(() => {
    const timerId = setTimeout(async () => {
      const {
        data: { accessToken },
      } = await frontendApi.post<{ accessToken: string }>("/auth/renewToken");

      setAccessToken(accessToken);

      backendApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    }, EXPIRED_IN);

    return () => clearTimeout(timerId);
  }, [accessToken]);

  return [accessToken, setAccessToken] as const;
};
```

SSR 서버의 코드는 다음과 같다. `/auth`로 시작하는 요청에 대한 엔드포인트는 모두 한 곳에서 처리해주도록 express router를 사용했다.

```tsx
// server/index.tsx
app.use("/auth", authRoute);
```

auth와 관련된 요청들을 살펴보자.

```tsx
// server/auth.ts
const router = express.Router();

router.post("/login", (req, res) => {
  const { body } = req;
  const isAuthRequest =
    body?.accessToken && body?.refreshToken && body?.expiredIn;

  if (!isAuthRequest) {
    res.status(400).send("올바른 요청 양식이 아닙니다.");

    return;
  }

  res
    .cookie("refreshToken", body.refreshToken, {
      httpOnly: true,
      maxAge: body.expiredIn,
    })
    .status(200)
    .send("true");
});

// 로그아웃 요청 시 쿠키의 refreshToken을 제거해준다.
router.post("/logout", (_, res) => {
  res.clearCookie("refreshToken").status(200).send("true");
});

router.post("/renewToken", async (req, res) => {
  const { accessToken, refreshToken, expiredIn } = await getNewAuthToken(req);

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: expiredIn,
    })
    .status(200)
    .json({ accessToken });
});

export default router;
```

> 일반적으로 `axios` 등의 메서드를 이용하여 서로 다른 도메인 간에 쿠키를 주고받을 때는 CORS 문제에 걸려 쿠키를 정상적으로 받을 수 없다. 이를 해결하기 위해 클라이언트에서 요청을 보낼 때 `{ withCredentials: true }` 옵션을 설정하고, 서버에서는 응답 시 `{ credentials: true }` 옵션을 설정해줘야 한다. 하지만 현재 앱 구조 상 SSR 서버에서 클라이언트 페이지까지 띄우고 있는 구조(isomorphic, 즉 서버와 클라이언트가 같은 도메인을 사용)이므로 해당 설정을 해줄 필요가 없다.

클라이언트에서 토큰을 재발급 받는 요청에는 아래 함수가 호출된다.

```tsx
// server/utils.ts
const PUBLIC_IP_API = "https://api.ipify.org/?format=text";

const getNewAuthToken = async (req: express.Request): Promise<AuthData> => {
  // 클라이언트에 refreshToken이 없다면 로그아웃 상태로, 토큰 재발급 요청을 하지 않는다.
  if (!req.cookies.refreshToken) return;

  const { refreshToken } = req.cookies;

  // nginx proxy 환경에서 client IP를 가져오는 방법
  let clientIP = req.headers["x-forwarded-for"];

  // 처음 로그인 요청을 보낸 클라이언트의 ip와 토큰 재발급 요청을 보낸 클라이언트의 ip가 다르다면 백엔드 서버에서 401 에러를 리턴한다.
  if (process.env.NODE_ENV !== "production") {
    const { data: publicIP } = await axios.get(PUBLIC_IP_API);
    clientIP = publicIP;
  }

  // 클라이언트가 전송한 stale한 refreshToken으로 새 refreshToken을 발급받는다.
  try {
    const { data: authData } = await api.post<AuthData>(
      "/login/oauth/refreshToken",
      {
        refreshToken,
        clientIP,
      }
    );

    return authData;
  } catch (error) {
    console.error(error.response);
  }
};
```

리버스 프록시 역할을 하는 nginx를 거쳐 client IP를 얻기 위해서는 request header의 `x-forwarded-for`를 이용할 수 있다. `XFF`(`x-forwarded-for`)는 표준 헤더는 아니지만, HTTP 프록시나 로드 밸런서를 통해 웹 서버에 접속하는 클라이언트의 원 IP 주소를 식별하는 사실상의 표준 헤더라고 할 수 있다.

```tsx
let clientIP = req.headers["x-forwarded-for"];
```

nginx 설정은 아래와 같이 작성해준다. [공식 문서](https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/)를 참고했으며, `$proxy_add_x_forwarded_for` 변수는 요청으로 들어오는 `x-forwarded-for` 헤더들에 자동으로 `$remote_addr`를 붙여준다고 한다.

```
// etc/nginx/sites-available/default
server {
  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_pass http://localhost:9000/;
  }
  // ...
}
```

또 development 모드에서는 클라이언트의 request ip가 127.0.0.1(localhost)로 되어 있기 때문에, public ip를 받아올 수 있는 API(`PUBLIC_IP_API`)를 사용했다.

이후 클라이언트에서 페이지 요청이 들어올 때마다 SSR 서버는 새로운 토큰을 발급받는 `getNewAuthToken`을 호출하여 분주하게 움직인다. 토큰 재발급이 완료되면 1. 새로운 `refreshToken`과 2. `accessToken`을 클라이언트에 전송하며, 3. 유저 정보도 미리 prefetch하여 html을 적절하게 구성한다.

```tsx
const newAuthData = await getNewAuthToken(req);

app.get("/", (req, res) => {
  // 1. 재발급받은 토큰이 있다면 cookie에 refreshToken을 담아주고,
  // 3. 유저 정보를 새로 prefetch하여 로그인된 상태의 html을 구성한다.
  if (newAuthData) {
    res.cookie("refreshToken", newAuthData.refreshToken, {
      httpOnly: true,
      maxAge: newAuthData.expiredIn,
    });

    await queryClient.prefetchQuery(QUERY_KEYS.MEMBER, () =>
      getMember({ accessToken: newAuthData.accessToken })
    );
  }

  // 2. 재발급받은 accessToken을 클라이언트에 script로 전송한다.
  const accessTokenScript = newAuthData
    ? `<script>window.__accessToken__ = "${newAuthData.accessToken}"</script>`
    : "";

  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      // ...
    }

    const result = data
      .replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
      .replace(
        /<head>(.+)<\/head>/s,
        `<head>$1
          ${styleTags} ${scriptTags} ${reactQueryState} ${accessTokenScript}
         </head>`
      );

    return res.send(result);
  });
});
```

~~아직도 끝나지 않은 SSR의 여정! 다음주에 계속됩니다…~~
드디어 끝났당! 후련하다 🤩 많이 삽질하고 많이 배울 수 있었다. 페어 미키가 함께 해준 덕에 가능했다. 리팩토링은 더 해야 하겠지만 큰일 없이 돌아가기를 바란다.

---

**Ref**
https://pomo0703.tistory.com/208
https://velog.io/@0307kwon/CSR-앱에서-SSR-CSR-환경으로-이주하기
https://velog.io/@yaytomato/프론트에서-안전하게-로그인-처리하기
https://seob.dev/posts/브라우저-쿠키와-SameSite-속성/
https://web.dev/samesite-cookie-recipes/
