---
title: swr vs react-query
date: 2024-10-11 18:14:08
tags: ["react", "main"]
description: swr과 react-query 내가 궁금한 것만 비교 분석하기
---

## 리액트에서 서버 상태 관리 

---

전설적으로 리액트에서 서버 상태 관리는 어렵다.

당연하다. 프론트엔드 라이브러리에서 어떻게 서버 상태 관리까지 하란 말이냐? 

하지만 서버 데이터 없는 프론트엔드는 그냥 팥 없는 붕어빵... 

어쩔 수 없이 프론트엔드 개발자가 고생해서 서버 데이터를 잘 받아와서 관리해야 한다.


## SWR 인트로

--- 

Stale-While-Revalidate라는 뜻으로, 서치가 조금 까다롭다;; 

역시 책이든 아이돌 이름이든 라이브러리든 뭐든 이름으로 어그로를 끌어야 하는데.

발음도 안 감기고 그닥인 것 같다.

Next.js에서 만들었다. 

swr은 **먼저 캐시에서 데이터를 반환한 다음, 서버에 데이터를 가져오는 요청을 보내고, 마지막으로 최신 데이터를 제공하는 전략**을 사용한다. 

그리고, 데이터를 전역 상태로 관리한다는 특징이 있다. 


## react-query 인트로

--- 

나 취준할 때까지만 해도 그냥 `react-query`였는데... tanstack 아저씨가 유명해지고 싶었나. 언젠가부터 `@tanstack/react-query`로 이름이 바뀜.

당연히 별로다. 이름이 좀 간지났으면 몰라도. 그런데 어쩌겠냐. 

유명해져라! 그러면 똥을 싸도 박수를 쳐줄 것이다...

react-query는 **서버 상태를 가져오고, 캐싱하고, 동기화하고, 업데이트**하는 순서대로 서버 상태를 관리한다. 

swr과는 달리 애플리케이션 루트에서 `Provider`로 감싸 조금 더 디테일한, 커스텀한 캐싱 전략을 제공한다. 

> → React Query는 보다 전반적인 서버 상태 관리에 중점을 두고 있고, SWR은 사용자 경험을 위해 빠르고 최신 상태의 데이터를 제공하는 데 중점을 둔다.

이제... ~~(내가 궁금했던 것들 위주로)~~ 구체적으로 알아보자. 

## 캐시를 관리하는 방법

--- 

swr은 전역 캐시를 자동으로 관리하며, 별도의 `Provider` 없이도 캐시를 전역적으로 사용할 수 있도록 설계되다. swr의 캐시는 **전역적인 컨텍스트**에 저장되며, 사용자가 별도로 설정할 필요가 없다. swr 훅을 사용하는 컴포넌트들끼리는 내부적으로 동일한 키를 공유하는 경우 동일한 데이터를 캐시에서 자동으로 가져온다.
    
반면에 react-query는 더 복잡한 캐시 관리 기능을 제공한다. react-query에서는 캐시의 범위나 캐시 제공자 등을 더 세밀하게 제어할 수 있게 하기 위해 `QueryClient`와 같은 설정을 `Provider`로 전달할 수 있는 구조를 사용한다. 다양한 상황에서 전역 상태를 제어하거나, 서로 다른 `QueryClient`를 사용해야 하는 경우 유용하다.

> ⚠️ 그러나 실제로 여러 개의 서로 다른 `QueryClient`를 사용하는 방식은 권장되지 않는다. ^^ 

두 라이브러리는 서버 데이터를 바라보는 시각이 조금 다른데, 

react-query는 상태를 서버 상태와 클라이언트 상태로 구분한다. 반면 swr은 서버에서 데이터를 받아와 데이터를 클라이언트에서 전역 상태로 업데이트하는 것으로 본다. 

## 데이터 로딩 상태 

react-query와 swr이 상태를 바라보는 시각이 조금 다르듯, 상태를 관리하는 법도 조금씩 다르다.

react-query는 `isLoading`, `isFetching`을 통해 데이터의 상태를 보여준다. 

두 가지는 비슷해 보이는데, `isLoading`은 __캐시된 데이터조차 없이, 처음 실행된 쿼리__ 일 때 데이터 로딩 여부를 보여준다는 점이 `isFetching`과 다르다.

swr에도 `isLoading`과 비슷한 듯 다른 `isValidating` 값을 제공한다. 

swr의 `isLoading`은 데이터가 로드되지 않은 상태에서 현재 진행중인 요청이 있는지를 나타내는, 반면 `isValidating`은 데이터의 로드 여부 상관없이 현재 진행중인 요청이 있는지를 나타낸다. 

개인적으로 `isValidating`이라는 이름에서 드러나듯, swr은 __stale한 데이터의 갱신__ 여부에 조금 더 초점이 맞춰져 있는 것 같다.


## mutation

---

흔히들 react-query에서 mutation은 서버 데이터를 업데이트하는 요청으로 알고 있다.

예를 들면 `POST`나 `DELETE` 같은 요청들... 

기본 query와는 달리 서버 데이터에 변경이 있기 때문에 `useQuery`와는 조금 다른 기능들을 제공하는 `useMutation`을 통해 작성한다.

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function Profile() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    newProfile => axios.post('/api/user/update', newProfile),
    {
      onSuccess: () => {
        // 요청 성공 시 캐시 무효화
        queryClient.invalidateQueries('/api/user');
      },
    }
  );

  return (
    <div>
      <h1>Profile</h1>
      <button onClick={() => mutation.mutate({ name: 'New Name' })}>
        Update Profile
      </button>
    </div>
  );
}
```

완전 깔끔&쌈뽕... `onSuccess`, `onSettled` 등의 옵션도 제공하여 손쉽게 서버의 최신 데이터로 캐시를 업데이트까지 할 수 있다.

그러다가 swr을 보면서 알게 된 충격적인 사실. __swr은 mutation을 제공하지 않는다?__

swr은 기본적으로 `GET` 요청을 처리하는 데 최적화되어 있으며, mutation을 위한 별도의 훅이 제공되지 않(았었)다. 이 이유는 앞서 언급한 것과 같이, 데이터를 '받아오는 것'에 중점을 두고 있기 때문이기도 하다. 

따라서 데이터를 변경하는 작업(앞서 언급한 `POST`, `DELETE` 등)은 수동으로 처리해야 하며, 그 후 변경된 데이터를 다시 페칭하거나 캐시를 업데이트해야 했다.

```jsx
import useSWR from 'swr'
 
function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)
 
  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        await requestUpdateUsername(newName)
        // 👇 직접 서버 데이터 업데이트
        mutate({ ...data, name: newName })
      }}>Uppercase my name!</button>
    </div>
  )
}
```

여기서 `mutate`의 정확한 동작은, 서버 상태를 업데이트시키는 것이 아니라, __해당 key를 사용하는 `useSWR`의 캐시를 업데이트__ 시켜주는 것이다. 그래서 `mutate`로 캐시를 최신화했다 할지라도, 서버의 데이터를 최신화시키지 않았다면 여전히 캐시에는 업데이트 이전 데이터가 남아있을 수 있다. ;;

전역으로 mutator를 사용하려면 `useSWRConfig`를 사용하는 방법도 있었다. 

```jsx
import { useSWRConfig } from "swr"
 
function App() {
  const { mutate } = useSWRConfig()
  mutate(key, data, options)
}
```

그러나 이와 같은 코드 작성 방식에 수많은 개발자들의 봉기가 있었던 탓인지 `useSWRMutation`이라는 훅을 내놓긴 했다. 

```jsx
import useSWRMutation from 'swr/mutation'
 
function Profile() {
  const { data, error } = useSWR('/api/user', fetcher);
  
  // useSWRMutation 훅으로 mutation 처리
  const { trigger, isMutating } = useSWRMutation('/api/user/update', updateProfile, {
    onSuccess: () => {
      // 성공 시 데이터 갱신
      mutate('/api/user');
    },
  });

  return (
    <div>
      <h1>{data?.name}</h1>
      <button 
        onClick={() => trigger({ name: 'New Name' })} 
        disabled={isMutating}>
        {isMutating ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
}
```

`isMutating`과 같은 상태값 및 `onSuccess`등의 후속 조치를 위한 옵션이 추가된 것 같다.
암튼 열심히 react-query의 `useMutation`을 따라한 것 같아... 왠지 짜쳐.


## 성능 최적화

--- 

swr은 내장 캐싱과 중복 제거 기능을 사용하여 불필요한 네트워크 요청을 생략한다. 

동일한 swr key를 가지는 컴포넌트가 여러번 렌더링된다면 단 한 번의 네트워크 요청만 발생한다. 

또 데이터의 깊은 비교를 통해 `data`가 변경되지 않았다면 리렌더링을 하지 않는다. (`compare` 옵션으로 커스터마이징할 수도 있다.)

react-query 역시 기본적으로 swr과 같은 렌더링 최적화 방식을 내장하고 있다. 그리고 실제로 `useQuery`의 반환값이 사용되었을 때만 컴포넌트를 리렌더링한다는 점에서 조금 더 섬세한 최적화를 수행한다. 

여기에 추가적으로 react-query는 `notifyOnChangeProps`와 `'tracked'` 옵션 등을 통해 조금 더 섬세하게 데이터의 변경에 따른 리렌더링 여부를 커스텀할 수 있다. 

오랜 시간을 거쳐 진화하더니 좀... 변태스러워졌다 😨 

두 라이브러리 중 어떤 것이 월등히 성능 최적화가 더 낫다고 하긴 어렵지만,

기본적인 렌더링 최적화 등은 두 라이브러리에서 모두 지원하므로 조금 더 디테일한 렌더링 시점을 조절하고 싶다면, 커스터마이징이 더 다양한 react-query를 쓰는 것도 좋을 듯 하다.

## 그래서 뭘 써야 하는가? 

---

와 같은 질문은 나에게 너무 어려워...

모든 기술 블로거들과 챗GPT가 말하듯, 

> - 단순한 데이터 페칭 및 캐싱이 필요한 프로젝트 -> swr
> - 복잡한 비동기 상태 관리나 더 많은 최적화 기능이 필요하다면 -> react-query

가 맞는 것 같다.

하지만 또 다른 많은 기술 블로거들과 기업들에서 그러듯... 

swr을 선택하더라도 결국 시간이 지나 react-query로 넘어가게 되는 것 같다. 😇 

## Refs

---

- https://swr.vercel.app/ko 
- https://tanstack.com/query/v5/docs/framework/react/overview
- https://tkdodo.eu/blog/react-query-render-optimizations
- https://yoonhaemin.com/tag/technical-thinking/react-query-vs-swr/ 

