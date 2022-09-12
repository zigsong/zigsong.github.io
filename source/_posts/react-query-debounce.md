---
title: react query에서 debounce 쓰기
date: 2021-07-24 17:53:00
tags: frontend
---

react query에서 hook으로 debounce 쓰기

<!-- more -->

<img src="/images/thumbnails/frontend-thumbnail.jpeg" />

---

피드 업로드 시 기술스택을 등록할 때, 사용자가 input을 입력할 때마다 해당 문자로 시작하는 기술 스택을 가져오기 위한 auto complete 기능을 만들었다. 이때 모든 input마다 api request가 가는 것은 낭비일 뿐더러 화면이 매우 버벅이는 문제가 발생하기 때문에 debounce를 걸어 어느 정도 사용자의 입력이 끝나는 타이밍에 api를 호출해주기로 했다.

> 👾 debounce를 사용하면 특정 시간 동안 발생된 이벤트를 그룹화하여 가장 마지막 이벤트에 대해서만 동작을 실행할 수 있다.

그런데 http request에 **react-query**를 사용하고 있기 때문에 일반적인 방식의 debounce로는 api call 횟수를 조절하기가 어려웠다. 사용자 input에 따라 기술스택을 가져오는 기능의 query는 아래와 같다.

```tsx
// useTechs.ts
export default function useTechs(autoComplete: string) {
  return useQuery<Tech[]>(["techs", autoComplete], getTechs, {
    enabled: !!autoComplete,
    suspense: false,
  });
}
```

`enabled` 옵션을 걸어 사용자의 input에 해당하는 `autoComplete`이 변할 때마다 `getTechs` 함수를 다시 호출하는 dependency를 이미 사용하고 있다. 이곳에 새로 `setTimeout` 등을 이용한 debounce 조건을 붙여주기가 난감했다. 그래서 input의 value가 `useTechs`의 인자로 들어오기 전에 딜레이를 걸어주기로 했다.

우선 완성된 debounce hook 코드는 다음과 같다.

```tsx
// useQueryDebounce.ts
import { useState, useEffect } from "react";

const useQueryDebounce = (value: string, delay = 200) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
};

export default useQueryDebounce;
```

인자로 들어온 `value`, 즉 사용자의 input이 변할 때마다 hook 내부의 `useEffect`가 호출된다. 이때 지정한 `delay`가 지나야만 `debounceValue`가 바뀐다.

값을 사용하는 컴포넌트에서는 debounce로 한 차례 걸러낸 input(`debouncedSearchInput`)을 `useQuery`의 인자로 넘겨준다.

```tsx
// TechInput.tsx
const TechInput = () => {
  const debouncedSearchInput = useQueryDebounce(searchInput, 200);
  const { data: techs } = useTechs(debouncedSearchInput);

  return (
    // ...
  )
}
```

<img src="01.gif" width="560px" />

사용자가 한 글자씩 입력할 때마다 요청이 발생하는 것이 아니라, 잠시 기다린 후 요청이 발생하는 것을 확인할 수 있다. 모든 input change마다 request가 발생하지 않고 조금 delay를 두고 request를 보내기 때문에 네트워크 요청 횟수를 줄일 수 있다.

---

**Ref**
https://dev.to/arnonate/debouncing-react-query-with-hooks-2ek6
