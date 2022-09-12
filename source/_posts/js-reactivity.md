---
title: 자바스크립트 반응형
date: 2021-10-31 16:42:35
tags: javascript
---

자바스크립트 반응형

<!-- more -->

<img src="/images/thumbnails/js-thumbnail.png" />

---

아래와 같은 코드가 있다.

```jsx
let price = 5;
let quantity = 2;
let total = price * quantity;
price = 20;
console.log(total); // 10
```

`price`의 값을 20으로 바꿨으므로 `price`에 의존하는 `total` 값이 40으로 바뀔 것이라고 기대한다. 하지만 `total`을 찍어보면 여전히 10이 나온다.

자바스크립트는 반응형이 아닌 절차적(procedural) 언어이기 때문이다.

사실 `total`을 변수가 아닌 함수로 만든다면, 런타임에 값이 결정되기 때문에 반응형처럼 동작하게 만들 수도 있다.

```jsx
const total = () => price * quantity;
price = 20;
console.log(total()); // 40
```

하지만… 너무 노간지인걸…

위 코드를 옵저버 패턴을 구현하는 의존 클래스로 캡슐화해보자.

```jsx
class Dep {
  constructor() {
    this.subscribers = [];
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }

  notify() {
    this.subscribers.forEach((sub) => sub());
  }
}
```

써놓고 보니 lv1에서 순수 자바스크립트로 구현했던 코드와 매우 유사하다…!
[lv1 코드는 어땠길래](https://github.com/zigsong/javascript-youtube-classroom/blob/zig-step3/src/js/models/Store.js)

`subscribers`에 익명 함수를 저장하여, 상태들을 모아놓는 storage처럼 활용한다. `depend` 함수는 함수 실행에 앞서 바뀐 값을 저장하는 역할, `notify`는 값이 바뀌었을 때 실행되어야 할 동작이다.

사용은 아래처럼!

```jsx
const dep = new Dep();

let price = 5;
let quantity = 2;
let total = 0;

watcher(() => {
  total = price * quantity;
});

console.log(total); // 10
price = 20;
dep.notify();
console.log(total); // 20
```

중간의 `watcher` 함수는 무슨 역할을 할까? `watcher`는 업데이트를 감지하는 익명 함수를 캡슐화한 것이다.

```jsx
function watcher(myFunc) {
  target = myFunc;
  dep.depend();
  target();
  target = null;
}
```

`watcher`는 `myFunc`를 인자로 전달받고, 전역 변수인 `target`에 `myFunc`를 할당한다. 그리고 `dep.depend()`를 호출하여 `target`을 `subscriber`에 추가하고, `target`을 호출한 후 초기화한다.

그러나 우리는 `price`와 `quantity` 각각의 값을 `Dep` 클래스로 가지고 싶다. 우선 `price`와 `quantity`를 하나의 객체에 담는다.

```jsx
let data = { price: 5, quantity: 2 };
```

이제 `watcher`의 실행부는 아래와 같이 바뀐다.

```jsx
watcher(() => {
  total = data.price * data.quantity;
});
```

`price`와 `quantity` 각각의 `subscriber`에 연결된 `dep.notify()`의 호출시점을 지정하기 위해, `Object.defineProperty`로 getter와 setter를 조작해보자. `price`와 `quantity`의 접근자 프로퍼티에 원하는 동작을 hook의 형태로 걸어두는 것이다.

```jsx
let data = { price: 5, quantity: 2 };

Object.keys(data).forEach(key => {
  let internalValue = data[key];

  const dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      dep.depend();
      return internalValue;
    },
    set(newVal) {
      internalValue = newVal;
      dep.notify();
    }
  })
})

total = data.price \* data.quantity; // get()을 호출
data.price = 20; // set()을 호출

```

1️⃣ `data` 객체를 돌며 각 속성(`price`, `quantity`)별로 `Dep` 클래스를 연결해줄 것이다.
2️⃣ `internalValue`에 초기 데이터 값을 저장하고, 각 속성별로 `Dep` 클래스의 인스턴스를 생성한다.
3️⃣ `Object.defineProperty`를 통해 각 속성의 getter와 setter를 새로 덮어씌운다.
4️⃣ `get()`에서는 getter가 호출된 시점의 `target`을 기억할 수 있도록 `dep.depend()`를 호출하고, `internalValue`를 반환한다.
5️⃣ `set()`에서는 `internalValue`의 값을 변경하고, 값이 바뀌었음을 알려주는 `dep.notify()`를 실행한다.

이제 `watcher` 함수에서 더 이상 `dep.depend()`를 호출할 필요가 없다. `watcher` 함수에 전달한 익명 함수는 `price` 또는 `quantity` 값이 변경될 때마다 재실행될 것이다.

```jsx
function watcher(myFunc) {
  target = myFunc;
  // dep.depend(); // 삭제
  target();
  target = null;
}
```

중간 과정에서의 코드는 많이 생략되어 있다. 전체 코드는 출처⬇️를 참고하면서 다시 공부해 보자! 참고로, 위 코드는 유명한 [Evan You on Proxies](https://www.vuemastery.com/courses/advanced-components/evan-you-on-proxies/) 영상을 참조했다고 한다.

---

**Ref**
https://blog.rhostem.com/posts/2018-09-12-javascript-reactivity
https://www.vuemastery.com/courses/advanced-components/evan-you-on-proxies/
