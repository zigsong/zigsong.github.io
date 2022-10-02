---
title: 자바스크립트 Proxy & Reflect
date: 2021-10-31 16:49:41
tags: javascript
thumbnailImage: https://i.imgur.com/ucikqnG.jpg
---

Object.defineProperty와 뭐가 다를까?

<!-- more -->

---

### Proxy

자바스크립트의 Proxy는 특정 객체를 감싸 프로퍼티 읽기, 쓰기와 같은 객체에 가해지는 동작들을 중간에서 가로채는 객체다. Proxy 객체를 통해 객체 프로퍼티를 조작하는 명령들을 중간에서 커스텀할 수 있다.

Proxy는 기본적으로 아래와 같이 작성한다.

```jsx
let proxy = new Proxy(target, handler);
```

`new` 키워드를 붙여 `Proxy` 생성자 함수로 Proxy 객체를 생성하며, 첫 번째 인자로는 Proxy를 사용할 객체(`target`), 두 번째로는 가로챌 동작에 대한 핸들러(`handler`)를 전달해준다.

Proxy를 사용하여 접근자 메서드인 `[[Get]]`, `[[Set]]`의 호출을 대신하는 트랩을 만들 수 있다. `get`부터 살펴보자.

```jsx
let numbers = [0, 1, 2];

numbers = new Proxy(numbers, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 0; // 기본값
    }
  },
});

console.log(numbers[1]); // 1
console.log(numbers[123]); // 0
```

`numbers` 배열에서 존재하는 `prop`의 값을 읽으면 해당 `target[prop]`에 해당하는 값을 리턴하고, 존재하지 않는다면 0을 리턴한다.

그런데 이건 `Object.defineProperty`로도 할 수 있는 작업이 아닌가?

…라고 생각했는데, `Object.defineProperty`는 객체의 특정 프로퍼티 하나하나에 대해서 적용하는 값이었다.

```jsx
const obj = {};

Object.defineProperty(obj, "name", {
  value: "zig",
  writable: false,
});
```

Proxy는 `get()` 메서드의 첫 번째 인자로 동작을 전달할 객체인 `target`, 그리고 두 번째 인자로 프로퍼티 이름에 해당하는 `prop`을 넣어 호출하기 때문에(세 번째 인자인 `receiver`는 뒤에서 설명한다), 객체의 특정 프로퍼티가 아닌 객체 전반에 접근할 때 동작을 가로챌 작업을 작성해줄 때 유용하다.

Proxy의 `set()` 트랩은 아래와 같이 작성한다.

```jsx
let numbers = [];

numbers = new Proxy(numbers, {
  set(target, prop, val) {
    if (typeof val == "number") {
      target[prop] = val;
      return true;
    } else {
      return false;
    }
  },
});

numbers.push(1); // true
numbers.push(2); // true
console.log(numbers.length); // 2

numbers.push("test"); // Error: 'set' on proxy
```

Proxy의 `set()` 메서드는 첫 번째 인자로 동작을 전달할 객체인 `target`, 그리고 두 번째 인자로 프로퍼티 이름에 해당하는 `prop`, 세 번째 인자로 프로퍼티 값에 해당하는 `value`를 넣어 호출한다. (네 번째 인자인 `receiver`는 뒤에서 설명한다.)

이때 `push`나 `unshift` 같이 배열에 값을 추가해주는 메서드들은 내부에서 `[[Set]]`을 사용하고 있기 때문에 메서드를 오버라이드하지 않아도 프락시가 동작을 가로채고 값을 검증해준다.

> 🚨 set 트랩을 사용할 땐 값을 쓰는 게 성공했을 때 반드시 true를 반환해줘야 한다. true를 반환하지 않았거나 falsy한 값을 반환하게 되면 TypeError가 발생한다.

이밖에도 Proxy가 가로챌 수 있는 동작들의 목록은 [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)에서 확인할 수 있다.

### Proxy와 Reflect

`Reflect`는 `Proxy`와 같이 JavaScript 명령을 가로챌 수 있는 메서드를 제공하는 내장 객체이다. `Object`를 대신하는 namespace로 사용되며, `Proxy`의 모든 트랩을 `Reflect`의 내장 메서드가 동일한 인터페이스로 지원한다.

🤔 그렇다면, `Reflect` 객체는 굳이 왜 필요할까?

`Reflect.get`은 아래와 같이 작성한다.

```jsx
Reflect.get(target, prop [, receiver])
```

`Reflect.get`은 기본적으로 `target[prop]` 값을 반환한다. 이때 `target`이 객체가 아닌 경우 `TypeError`가 발생한다. `Reflect`를 통해 에러를 명확하게 확인할 수 있다.

```jsx
const obj = { prop: 1 };
Reflect.get(obj, "prop"); // 1

"a"["prop"]; // undefined
Reflect.get("a", "prop"); // Uncaught TypeError: Reflect.get called on non-object
```

`Reflect.set`은 아래와 같이 작성한다.

```jsx
Reflect.set(target, prop, value [, receiver])
```

`target` 객체의 `prop`에 할당할 `value`를 세 번째 인자로 넘겨준다. 이때도 `target`을 찾을 수 없는 경우 명백한 `TypeError`를 발생시킨다.

```jsx
const obj = { prop: 1 };
Reflect.set(obj, "prop", 2); // true
obj.prop === 2; // true

"a"["prop"] = 1; // 1
Reflect.set("a", "prop", 1); // Uncaught TypeError: Reflect.set called on non-object
```

> 🤔 그래서, Proxy와 무슨 상관?

위에서 Proxy를 설명하면서 계속 트랩의 마지막 인자로 전달할 수 있는 `receiver` 인자를 그냥 넘겨왔었다. 이제 `Reflect`를 통해 `receiver` 인자의 역할을 알아보자.

receiver는 프로토타입 체이닝 속에서, 최초로 작업 요청을 받은 객체가 무엇인지 알 수 있게 해준다. `Reflect`의 get/set 트랩에서는 receiver 매개변수를 통해 속성 접근 요청을 받은 객체를 컨트롤할 수 있게 된다. `Reflect.get`과 `Reflect.set`의 `receiver`는 `target[prop]`이 getter나 setter일 때 `this`의 컨텍스트로 동작한다. 즉 `receiver`를 통해 `this` 바인딩을 조절할 수 있다.

아래 예제를 살펴보자.

```jsx
const obj = {
  a: 1,
  b: 2,
  get sum() {
    return this.a + this.b;
  },
};

const receiverObj = { a: 2, b: 3 };

Reflect.get(obj, "sum", obj); // 3
Reflect.get(obj, "sum", receiverObj); // 5
```

마치 `Function.prototype.call`이나 `Function.prototype.apply`처럼 마지막 인자에 `this`에 바인딩할 객체를 넣어, 호출할 메서드 내부에서 `this`가 가리키는 객체를 조절할 수 있다.

자바스크립트는 getter/setter일 때 프로토타입 체이닝을 하더라도 최초 속성 접근 요청을 받은 객체를 `receiver`에 담아 유지하고 있는데, `Reflect`의 `get`/`set` 트랩에서는 `receiver` 매개변수를 통해 이를 컨트롤할 수 있게 된 것이다.

이제 `Proxy`에서 `Reflect`를 사용하게 된 이유도 슬슬 감이 잡힌다.

`Proxy`를 사용하여 자바스크립트를 반응형으로 흉내낼 수 있는데, 이때 `Reflect`를 사용하지 않고 일반적인 `Proxy`의 트랩을 작성한다면 현재 일어나는 탐색의 주체를 알 수 없어 사이드 이펙트가 발생할 수 있다.

```jsx
function reactive(target) {
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      const res = target[key]; // 변경
      // do something...

      return res;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];

      target[key] = value; // 변경

      if (oldValue !== value) {
        // do something...
      }

      return value;
    },
  });

  return proxy;
}
```

`Proxy` 인스턴스를 반환하는 위 `reactive` 함수를 아래와 같이 사용해 보자.

```jsx
const child = {
  birthYear: 2019,
};

const parent = {
  birthYear: 1981,
  get age() {
    return new Date().getFullYear() - this.birthYear;
  },
};

const reactivityParent = reactive(parent);
child.__proto__ = reactivityParent;
```

`child` 객체의 프로퍼티를 읽거나 새 값을 할당한 결과는 다음과 같다.

```jsx
child.age; // (2021년 기준) 40

child.job = "unemployed";
child.hasOwnProperty("job"); // false
child.job; // 'unemployed'

reactivityParent.hasOwnProperty("job"); // true
reactivityParent.job; // 'unemployed'
```

**✔️ `get` 트랩**

1. `child`에서 `age`를 조회하면 프로토타입 체인을 통해 프록시 객체로 탐색을 이어간다.
2. parent의 `[[Get]]`이 호출되면, `Proxy`의 `get` 트랩이 트리거 되고, 트랩 내 `target`은 `parent`이기 때문에 `target[key]`를 조회하게 되면, 단순히 `parent.age`의 평가와 똑같아지므로 `this`는 `parent`가 된다.

**✔️ `set` 트랩**

1. `child`에서 `job`이란 속성에 ‘unemployed’를 할당하면, 프로토타입 체인을 통해 프록시 객체로 탐색을 이어간다.
2. `parent`의 `[[Set]]`이 호출되면, `Proxy`의 `set` 트랩이 트리거되고, `target[key]`는 결국 `parent['job']`이기 때문에 `parent`에 `job` 속성이 추가되고 값이 할당된다.

이제 `Proxy`의 `get`/`set` 트랩 내 `Reflect`를 사용하고 `receiver`를 전달하여 실제 작업 요청받은 객체를 `this` 컨텍스트로 사용하여 사이드 이펙트를 없애보자.

```jsx
function reactive(target) {
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver); // ✅
      // do something...

      return res;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const res = Reflect.set(target, key, value, receiver); // ✅

      if (oldValue !== res) {
        // do something...
      }
      return res;
    },
  });

  return proxy;
}

const child = {
  birthYear: 2019,
};

const parent = {
  birthYear: 1981,
  get age() {
    return new Date().getFullYear() - this.birthYear;
  },
};

const reactivityParent = reactive(parent);
child.__proto__ = reactivityParent;
```

`child` 객체에 프로퍼티 값 읽기/쓰기가 올바르게 동작하는지 확인해보자.

```jsx
child.age; // (2021년 기준) 2

child.job = "unemployed";
child.hasOwnProperty("job"); // true
reactivityParent.hasOwnProperty("job"); // false

child.job; // 'unemployed'
reactivityParent.job; // undefined
```

`Reflect`와 `receiver`를 이용하여 `Proxy`의 트랩에 동작이 트리거될 객체를 명확하게 전달할 수 있다!

---

**Ref**
https://ko.javascript.info/proxy
https://ui.toast.com/weekly-pick/ko_20210413
https://www.vuemastery.com/courses/advanced-components/evan-you-on-proxies/
