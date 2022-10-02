---
title: 자바스크립트 함수형 프로그래밍과 파이프
date: 2021-12-03 14:40:20
tags: javascript
thumbnailImage: https://i.imgur.com/ucikqnG.jpg
---

배열에서의 함수형 프로그래밍 | reduce | pipe

<!-- more -->

---

SBA 인사이트 스쿨에서 진행했던 마플 유인동님의 ‘모던 자바스크립트 라이브코딩’ 강의를 가벼운 마음으로 듣다가, 굉장히 매력적이면서 탐구정신이 묻어나오는 코딩 스타일에 깊은 감명을 받아 정리해보았다. 저녁 먹느라 강의의 중반부를 놓쳤는데, 아쉽게도 해당 강의는 다시 제공하지 않아서 2년 전 녹화하신 비슷한 강의와 기타 여러 자료들을 참고했다.

개인적으로 매력을 느꼈던 Kent C Dodds. 선생님의 [Inversion of Control](https://kentcdodds.com/blog/inversion-of-control)과도 연계해서 생각해볼 수 있을 것 같다. 해당 글에 대한 ~~내맘대로~~ 이해한 글은 [여기](https://zigsong.github.io/2021/10/23/fe-ioc/)에 정리해두었다.

---

### 명령형으로 작성하기

숫자값들로 구성된 어떤 배열(`list`)의 원소 중 ‘홀수’만을 찾아서 그 값들의 ‘제곱’을 모두 더한 값을 구하려고 한다. 이때 배열의 모든 원소를 순회하지 않고, 특정 길이(`length`)만큼 돌며 반환하고자 한다.

위 요구사항을 직관적으로는 아래와 같이 작성하게 될 것이다.

```jsx
function f(list, length) {
  let i = 0;
  let acc = 0;
  for (const a of list) {
    if (a % 2) {
      acc = acc + a * a;
      if (++i === length) break;
    }
  }
  console.log(acc);
}
```

실행시켜보면, 기대한 값을 출력한다.

```jsx
function main() {
  f([1, 2, 3, 4, 5], 1); // 1 (1)
  f([1, 2, 3, 4, 5], 2); // 10 (1 + 3 * 3)
  f([1, 2, 3, 4, 5], 3); // 35 (1 + 3 * 3 + 5 * 5)
}

main();
```

위 코드에서 아쉬운 점은, **명령형**으로 작성된 부분이 많다는 것이다.

- `i`라는 임의의 변수의 값을 0으로 초기화한 후, 강제로 1씩 늘려주고 있다.

  ```jsx
  let i = 0;
  // ...
  if (++i === length) break;
  ```

- for문을 돌며 홀수 필터링을 직접 수식으로 작성해주고 있다.

  ```jsx
  if (a % 2) {
    acc = acc + a * a;
    if (++i === length) break;
  }
  ```

JavaScript의 제너레이터를 이용하여 코드를 조금씩 고쳐보자.

### 제너레이터로 작성하기

> **🤔 제너레이터(generator)란?**
> ES6에서 도입된 문법으로, 코드 블록의 실행을 일시 중지했다가 필요한 시점에 재개할 수 있는 특수한 함수.
> 제너레이터 함수는 제너레이터 객체를 반환하여, `next` 메서드 호출을 통해 그 시점의 값을 반환한다.
> 제너레이터 함수는 `function*` 키워드로 선언하며, 하나 이상의 `yield` 표현식을 포함한다.

```jsx
function* filter(f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
}

function* map(f, iter) {
  for (const a of iter) {
    yield f(a);
  }
}
```

홀수만 걸러내기 위한 목적의 `filter` 함수를 분리하고, 이터러블을 돌며 각 원소를 특정한 방식으로 연산한 값들을 하나씩 반환해줄 `map` 함수를 작성하였다. 각각은 asterisk(`*`)을 붙인 제너레이터 함수로 작성하였으며, 이에 따라 값을 `yield`로 반환하게 된다.

> **🤔 이터러블(iterable)이란?** > `Symbol.iterator`를 프로퍼티로 갖고 있는 객체로, 순회 가능한 데이터 컬렉션(자료구조)을 의미한다.
> `for...of`문 또는 배열 디스트럭쳐링 할당의 대상으로 사용할 수 있다.

이터러블에서 특정 길이만큼만 순회하게끔 도와주는 `take` 함수는 제너레이터가 아닌 일반 함수로 작성한다. 명령형으로 작성한 모든 세부 구현 코드는 이곳에 집어넣는 것이다.

```jsx
function take(length, iter) {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length === length) return res;
  }
}
```

위와 같이 분리한 추상화된 함수들을 이용하여 기존 함수를 다시 작성할 수 있다. `filter`와 `map`은 각각 첫 번째 인수로 연산 또는 필터링 조건을 명시한 콜백 함수를 받는다.

```jsx
function f(list, length) {
  let acc = 0;
  for (const a of take(
    length,
    map(
      (a) => a * a,
      filter((a) => a % 2, list)
    )
  )) {
    acc = acc + a;
  }
  return acc;
}
```

`console.log`와 같은 사이드 이펙트를 만드는 함수도 `main` 함수로 옮겨준다.

```jsx
function main() {
  console.log([1, 2, 3, 4, 5], 1); // 1
  console.log([1, 2, 3, 4, 5], 2); // 10
  console.log([1, 2, 3, 4, 5], 3); // 35
}
```

결과는 동일하지만, 기존의 명령형 코드들을 조금 더 선언적으로 작성할 수 있게 되었다.

`어떻게` 할 것인지를 세부적으로 모두 작성하는 **명령형**이 아니라,
`무엇을` 할 것인지만 작성해주고 실제 처리는 추상화된 별도의 함수가 처리하는 프로그래밍 방식을 **선언형 프로그래밍**이라고 한다. 함수가 하는 일들을 각각 분리했다는 점에서 **함수형 프로그래밍**과도 같은 맥락으로 이해할 수 있다.

### reduce 함수 직접 만들어보기

그런데 여전히 for문 안에서 `acc = acc + a`를 직접 실행해주고 있는 것이 아쉽다. 초기값이 있고, 이 초기값을 가지고 이후에 나올 값들을 덧붙여 연산을 수행할 수 있게끔 JavaScript에서는 `reduce` 메서드를 제공한다.

직접 `reduce`를 만들어 축약해보자.

```jsx
function reduce(f, acc, iter) {
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
}

const add = (a, b) => a + b;

const f = (list, length) =>
  reduce(
    add,
    0,
    take(
      length,
      map(
        (a) => a * a,
        filter((a) => a % 2, list)
      )
    )
  );
```

함수(`f`)와 초기값(`acc`), 그리고 순회할 대상인 `iter`를 인자로 받는 `reduce` 함수를 정의하고, 인자로 받은 두 값을 더한 값을 반환하는 `add` 함수를 정의했다.

그리고 `add` 함수를 `reduce` 함수에서 수행할 콜백으로, 기존에 작성한 `take`, `map`, `filter`가 반환한 배열을 `reduce` 함수의 세 번째 인자로 넣어주었다.

읽는 흐름은 오른쪽부터 시작하면 된다.

1. 주어진 `list`로 홀수만 `filter`한 배열의 각 원소값들에 대해,
2. `map`을 이용하여 제곱 연산을 수행하고,
3. `take`를 통해 `length`만큼 반환한 값들을,
4. `reduce` 함수의 `add` 함수를 이용해 하나씩 더해준다. (이때 초기값은 0)

함수를 다른 함수의 인자로 넘길 수 있는, JavaScript 함수의 일급 객체의 특성을 이용하여 원하는 시점에 원하는 함수를 넘겨주는 것이다. 이는 코드를 값처럼 다루는 **메타 프로그래밍**이라고도 한다.

`main` 함수를 수행하면 결과는 역시 똑같다.

```jsx
function main() {
  console.log(f([1, 2, 3, 4, 5], 1)); // 1
  console.log(f([1, 2, 3, 4, 5], 2)); // 10
  console.log(f([1, 2, 3, 4, 5], 3)); // 35
}
```

### reduce를 유연하게 만들기

지금 `reduce` 함수는 고정된 세 개의 인자(`f`, `acc`, `iter`)를 받고 있다. 하지만 초기값인 `acc` 값을 넘겨주고 싶지 않을 수도 있다. 실제로 JavaScript 배열 내장 메서드인 `reduce` 역시 초기값은 optional이다.

```jsx
arr.reduce(callback[, initialValue])
```

인자로 `acc` 값이 들어오지 않았을 경우를 대비하여 코드를 수정해 보자.

```jsx
function reduce(f, acc, iter) {
  if (arguments.length === 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
}
```

함수의 `arguments` 길이가 2, 즉 `acc` 값이 없다면 함수 바디에서는 세 번째 인수로 들어온 `iter` 값을 `acc`라고 생각하게 될 것이다. 이때 `acc`에 `Symbol.iterator`를 구현하여 `iter`를 순회 가능하도록 만들고, `iter`의 첫 번째 값(`iter.next().value`)을 초기값(`acc`)으로 지정해준다.

`acc` 값을 지정해주지 않는다면 0부터 연산한 값을, `acc` 값을 지정한다면 `acc`부터 연산한 값을 반환하게 된다.

```jsx
reduce(add, [1, 2, 3]); // 6
reduce(add, 10, [1, 2, 3]); // 16
```

이렇게 탄탄해진(?) `reduce` 함수를 가지고 기존 함수를 또 만져보자.

`reduce` 함수에 정해지지 않은 개수의 인자를 넘겨줄 수 있는 `pipe` 함수를 정의한다.

```jsx
const pipe = (...args) => reduce((res, f) => f(res), args);
```

`pipe` 함수를 이용하여 우리의 `f` 함수를 새롭게 작성할 수 있다.

```jsx
const f = (list, length) =>
  pipe(
    list,
    (list) => filter((a) => a % 2, list),
    (list) => map((a) => a * a, list),
    (list) => take(length, list),
    (list) => reduce(add, 0, list)
  );
```

원본 배열인 `list`부터 시작하여 순서대로 다음 콜백함수(`filter`, `map`…)들을 수행해준다. 이때 `pipe` 함수에서 호출하는 `reduce`는 함수는 `acc`가 가리키는 원본 배열에 연산을 수행한 값을 다시 돌려주기 때문에, 전체 그림에서는 현재 콜백함수의 반환값이 되는 배열을 다음 콜백함수의 인자로 계속해서 넘겨주게 된다.

> 이와 같은 코딩 방식을 **LISP(리스프)** 라고 부르기도 한다. LISP는 “List Processing”(리스트 프로세싱)의 줄임말로, 코드 그 자체로 하나의 리스트를 의미한다.

### currying 활용하기

아직도 끝나지 않았다!

일급 객체인 JavaScript 함수의 특성을 사용하여, currying으로 함수를 구현해보자.

currying은 함수를 리턴하는 함수의 특징을 살려서 구현한 개념으로, 필요한 시점에 인자를 순차적으로 전달하여 호출할 수 있는 방식을 의미한다.

여기서는 인자의 개수를 정해놓지 않고, rest parameter를 사용하여 원하는 만큼 인자를 받을 수 있는 currying 함수를 구현할 것이다.

아래 예제를 살펴보자. currying 함수가 반환하는 함수의 인자에서 `rest.length`가 0보다 크다면(존재한다면) `f`를 다시 한번 호출하고, 그렇지 않다면 `rest`를 인자로 하는 `f` 함수를 리턴한다.

```jsx
const curry =
  (f) =>
  (a, ...rest) =>
    rest.length ? f(a, ...rest) : (...rest) => f(a, ...rest);

const add = curry((a, b) => a + b);
add(10)(5); // 15
```

이제 위에서 사용한 `filter`, `map` 등의 함수들을 모두 `curry`로 감싸보자.

```jsx
const filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});

const map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

const take = curry(function (length, iter) {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length === length) return res;
  }
});

const reduce = curry(function (f, acc, iter) {
  if (arguments.length === 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});
```

이제 `f` 함수를 훨씬 더 간단하게 작성할 수 있다. `list`를 각 함수의 두 번째 인자로 넘겨주는 것이 아니라, currying 함수가 리턴하는 함수의 인자로 넘겨주는 방식이다.

```jsx
const f = (list, length) =>
  pipe(
    list,
    (list) => filter((a) => a % 2)(list),
    (list) => map((a) => a * a)(list),
    (list) => take(length)(list),
    (list) => reduce(add)(list)
  );
```

`list => filter(a => a % 2)(list)`는 `list`를 받아서, `filter`가 반환하는 함수에 `list`를 그대로 전달한다. 이 말은 곧 각 콜백함수를 아래와 같이 작성할 수도 있다는 뜻이다. 각 콜백함수에 `list` 인자를 명시적으로 넘기는 대신, 콜백함수를 호출하여 전달해주면 `curry`에 의해 새로운 함수를 리턴하게 되므로 같은 방식으로 동작한다.

```jsx
const f = (list, length) =>
  pipe(
    list,
    filter((a) => a % 2),
    map((a) => a * a),
    take(length),
    reduce(add)
  );
```

위 코드의 특징은, **지연 평가**된다는 것이다.

`pipe` 함수의 첫 번째 인자인 `list` 배열의 모든 원소에 대해 `filter`, `map`, `take`, `reduce`가 각각 실행되는 것이 아니다. 즉 첫 번째 콜백함수인 `filter`에서 걸러진 값은 `map`으로 넘어가지 않고, 이때는 `list`의 다음 원소에 대하여 다시 처음부터 `filter`를 실행하게 된다.

이는 `next`를 호출할 때까지는 평가되지 않는 제너레이터 함수의 특징 덕분이다. 따라서 위 코드는 가장 처음의 명령형 코드와 시간복잡도가 일치한다.

### 2차원 배열 순회하기

그런데 지금까지 우리 곁에 있어준 `main` 함수에 `[1, 2, 3, 4, 5]`와 같은 쏘 심플한 배열 말고, 2차원 배열을 넘겨주면 어떨까?

```jsx
const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10],
];
```

우선은 `arr`를 펼쳐보자.

```jsx
const flat = function* (iter) {
  for (const a of iter) {
    if (a && a[Symbol.iterator]) {
      for (const b of a) {
        yield b;
      }
    } else {
      yield a;
    }
  }
};
```

여기서 중첩 for문을 조금 더 스타일리쉬하게(!) 바꿀 수도 있다.

```jsx
const flat = function* (iter) {
  for (const a of iter) {
    if (a && a[Symbol.iterator]) {
      yield* a; // 여기를 바꿨다.
    } else {
      yield a;
    }
  }
};
```

잘 풀어지는지 확인해보자.

```jsx
[...flat(arr)]; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

if문으로 중첩된 배열을 풀어주고 있기 때문에, 어떤 모양의 배열이든지 풀어줄 수 있다.

```jsx
const arr = [[1, 2], 3, 4, 5, [6, 7, 8], 9, 10];
[...flat(arr)]; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

굳! 이제 이 함수를 아까 만들어두었던 `pipe` 함수로 다시 호출해보자. 이때 `flat`은 인자로 `iter`만 받으면 되기 때문에, 인자를 연속적으로 넣어주기 위해 작성했던 `curry`는 필요없다.

그리고 한번에 실행결과를 확인하기 위해 마지막 인자에는 `console.log`도 넣어줬다.

```jsx
pipe(
  arr,
  flat,
  filter((a) => a % 2),
  map((a) => a * a),
  take(3),
  reduce(add),
  console.log
); // 35 (1 + 9 + 25)
```

원하는 값이 잘 나오는 것을 확인할 수 있다! 😎

### 파이프라인 프로그래밍

지금까지 사용한 `pipe`, 즉 파이프 함수는 실제 현실에서의 파이프(배관)에서 아이디어를 가져왔다.
[Whatis](https://whatis.techtarget.com/definition/pipe)에서는 pipe를 다음과 같이 정의하고 있다.

> 🔗 파이프는 단방향 통신을 위한 용도로 사용된다. 하나의 파이프는 그 이전 파이프에서 전달된 결과를 파라미터로 삼아 또 다른 결과를 내놓는다.

파이프를 이해하기 위해서는 순수 함수를 이해해야 한다. 순수 함수는 다음을 준수해야 한다.

- 같은 입력 값에선 같은 반환 값을 보장한다.
- 함수 외부 스코프의 그 어떠한 변수의 값도 바꾸지 않는다.

한 파이프가 반환하는 값은 그 다음 파이프의 입력 값으로 전달되기 때문에, 각 상황에서 같은 값을 반환해야 하는 것이다.

지금까지 JavaScript Array prototype의 `reduce` 함수를 직접 구현하여 하나의 배열 input에 대해 여러 개의 함수를 순차적으로 실행하도록 했다.

위에서 작성한 `reduce` 함수와 `pipe` 함수를 다시 살펴보자.

```jsx
function reduce(f, acc, iter) {
  if (arguments.length === 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
}
const pipe = (...args) => reduce((res, f) => f(res), args);
```

그리고 사용부에서는 아래와 같이 호출해주고 있다.

```jsx
pipe(
  arr,
  flat,
  filter((a) => a % 2),
  map((a) => a * a),
  take(3),
  reduce(add),
  console.log
); // 35 (1 + 9 + 25)
```

하지만 첫 번째 인자로 연산을 수행할 `list`를, 나머지 인자들에는 콜백 함수들을 넣어주는 방식은 뭔가 부족하다.

클로저를 이용하여 `list`를 다른 방식으로 받아보도록 바꿔보자. 초기값(`list`)과 함수를 명시적으로 분리하기 위해 `args`라고 선언해줬던 변수는 조금 더 확실하게 `funcs`로 네이밍을 바꿔주었다.

> 😮 주의할 점! 여기서는 위에서 직접 만들었던 `reduce` 대신, JavaScript `Array.prototype`의 내장 메서드인 `reduce`를 사용했다. 우리가 만들었던 `reduce`는 초기값이 없어도 되는데, 여기서는 **초기값을 특정한 방식으로 반드시 넣어주는 경우**를 고려했기 때문이다.

```jsx
const pipe =
  (...funcs) =>
  (v) =>
    funcs.reduce((res, func) => func(res), v);
```

이제 파이프는 `v`라는 값을 받는 또 다른 함수를 반환하는 형태로 바뀌었다. 새롭게 반환된 함수가 `v`를 받을 때까지 파이프는 `reduce`를 실행하지 않는다. **지연 평가**가 이루어지고 있는 것이다.

새로운 `pipe` 코드를 실행해보자. `arr`를 `pipe`의 첫 번째 인자로 넣는 대신, 클로저를 활용하여 `pipe`가 반환한 함수의 인자로 넣어주었다.

```jsx
const arr = [[1, 2], 3, 4, 5, [6, 7, 8], 9, 10];

pipe(
  flat,
  filter((a) => a % 2),
  map((a) => a * a),
  take(3),
  reduce(add),
  console.log
)(arr); // 35
```

원하는 값이 잘 나오는 것을 확인할 수 있다!

---

## 생각

작년에 잠시 인턴을 하면서 사용했던 RxJS에서 처음 접했던 Functional Programming, 그리고 그 API에 있었던 `pipe`가 와닿지 않았었는데 하나하나 단계를 밟아가보니 이제 조금 이해가 된다. (~~물론 처음부터 혼자 다시 하라 그러면 어려울 것이다.~~)

제너레이터와 이터러블, 그리고 클로저까지 JavaScript만으로 할 수 있는 기능들을 조합하여 사용하는 사람이 편리한 코드, 선언적으로 작성할 수 있는 코드가 탄생했다. 항상 만드는 사람이 고생스럽더라도, 사용하는 사람이 직관적으로 편리하게 쓸 수 있는 코드를 고민했었는데 이렇게 또 한 걸음 앞으로 나간 것 같다.

FxTS도 공부해봐야겠다.. 허허 🙃

---

**Ref**
https://www.youtube.com/watch?v=4sO0aWTd3yc
https://medium.com/오늘의-프로그래밍/함수형-프로그래밍-pipe-c80dc7b389de
https://ko.wikipedia.org/wiki/리스프
