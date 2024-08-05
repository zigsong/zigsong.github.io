---
title: React 리렌더링 삐그덕 삐그덕
date: 2024-8-4 18:14:08
tags: ["react"]
description: React state를 같은 값으로 업데이트했을 때
---

## 다음 퀴즈의 답은?

---

다음 코드에서 `console.log()`이 찍히는 순서를 적어보자 

```tsx

import * as React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { screen, fireEvent } from "@testing-library/dom";

function A() {
  console.log('render A')
  return null
}

function App() {
  const [_state, setState] = useState(false)
  console.log('render App')
  return <div>
    <button onClick={() => {
      console.log('click')
      setState(true)
    }}>click me</button>
    <A />
  </div>
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

(async function () {
  const action = await screen.findByText("click me");
  fireEvent.click(action);
  await wait(100);
  fireEvent.click(action);
  await wait(100);
  fireEvent.click(action);
})();

function wait(duration = 100) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
```

본인은 일단 다음과 같이 제출해보았다.

```tsx
"render App"
"render A"
"click"
"render App"
"render A"
"click"
"click"
```

왜 클릭을 3번씩이나 하는진 모르겠지만, 

첫 번째 클릭 시 `App` 컴포넌트의 state가 바뀌므로 리렌더링이 발생하고,

두 번째 클릭 시 `App` 컴포넌트의 state는 이전 값과 같으므로 리렌더링이 발생하지 않고,

세 번째 클릭 시에도 마찬가지일 거라 생각했기 때문이다.

(그래서 클릭을 왜 세 번씩이나 하는지 몰랐다.)

결과는 가볍게 fail~ 

정답은? 

```tsx
"render App"
"render A"
"click"
"render App"
"render A"
"click"
"render App"
"click"
```

<br />
<img src="../../assets/same-setstate/01.jpg" />

React Quiz에서 처음으로 강적수를 만났다.

무더운 여름 간만에 집중해서 원인을 알아내고 말리라

## React의 상태 업데이트

---

React 컴포넌트는 흔히 두 종류로 나뉜다. 하나는 클래스 컴포넌트, 다른 하나는 함수 컴포넌트이다.

각 컴포넌트는 사용 방법이 거의 유사하지만, 그 내부 동작 원리를 들여다보면 미묘하게 다른 점들이 있다. 그 다른 점들 중 하나는 상태 업데이트와 리렌더링에 관한 것이다.

클래스 컴포넌트에서는 클래스의 프로퍼티로 함수를 생성하고, `this.setState()` 함수 호출을 통해 상태 업데이트를 수행한다.

```tsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Clock />);
```

반면 함수 컴포넌트에서는 `useState` hook으로 상태와 업데이터를 선언하고, 업데이터를 통해 상태를 업데이트한다.

```tsx
import { useState } from 'react';

function MyComponent() {
	const [name, setName] = useState('Edward');

	function handleClick() {
	  setName('Taylor');
	  setAge(a => a + 1);
	  // ...
  }
}
```

이 두 가지 상태 업데이트 방법은 일반적으로 동일하게 동작하며, React 개발자라면 이 두 가지 상태 업데이트 방법에 모두 익숙할 것이다. 

하지만 특수한 경우, 각 방식은 컴포넌트의 리렌더링에 있어 서로 다른 결과를 낳는다.

[공식문서](https://legacy.reactjs.org/docs/react-component.html#setstate)에 따르면, 클래스 컴포넌트의 `setState()` 함수는 항상 리렌더링을 발생시킨다. (단, `shouldComponentUpdate()`가 false를 반환하는 경우 제외) 

하지만 또 다른 [공식문서](https://legacy.reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update)에 따르면, 함수 컴포넌트의 `useState()`로 선언한 상태를 같은 값으로 업데이트시키면, 리렌더링되지 않는다고 한다.

하지만❗️한 가지 특수한 경우 상태 업데이터가 즉각적으로 호출되어 리렌더링이 발생한다.

사실 자꾸 이 ‘특수한(occasional)’ 케이스가 뭔지 안알려줘서 열 받았다. 

그래서 내가 귀한 주말에 힘들게 직접 알아보았다.

## useState()의 내부 동작 방식

---

이런저런 링크를 타고 오니 결국 내가 무서워하던 [jser.dev 아저씨의 문서](https://jser.dev/2023-06-19-how-does-usestate-work/)를 읽지 않을 수 없게 되었다. 

이제 이 지독한 아저씨와 함께 `useState()`의 코드를 샅샅이 뜯어 살펴볼 것이다. 

### 1. 첫 번째 렌더(mount) 시

첫 번째 렌더는 꽤 직관적이다. 

```tsx
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
	// 새로운 hook이 생성된다. 
  const hook = mountWorkInProgressHook(); 

  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  // memoizedState가 실제 상태 값을 가지고 있다. 
  hook.memoizedState = hook.baseState = initialState;

	// 업데이트 queue에서 미래 상태 업데이트를 가지고 있다.
	// 상태 업데이트 시, 상태 값이 바로 업데이트되지 않는다는 점을 기억하자.
	// 상태 업데이트는 서로 다른 우선순위를 갖고 있고, 바로 처리될 필요가 없다. 
	// 그렇기에 업데이트를 보류(stash)하고 나중에 처리할 수도 있다. 
  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    pending: null,
    // lane은 우선순위를 의미한다.
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };
  // 이 queue는 hook 업데이트 queue에 해당한다. 
  hook.queue = queue;

  const dispatch: Dispatch<
    BasicStateAction<S>,
    // dispatchSetState()는 실제 상태 업데이터를 가리킨다. 
    // 현재 fiber에 바인딩되어있다. 
  > = (queue.dispatch = (dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  // useState()에서 반환되는 바로 그 값이다. 
  return [hook.memoizedState, dispatch];
}
```

### 2. `setState()`에서는 무슨 일이 발생할까?

위 코드에서, `setState()`는 실제로 내부적으로 `dispatchSetState()`에 묶여있는 것을 알 수 있었다. 

```tsx
function dispatchSetState<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
) {
	// 업데이트의 우선순위를 결정한다. 
  const lane = requestUpdateLane(fiber);

	// 보류(stash) 처리될 업데이트 객체. 
  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };

	// render하는 동안에 setState를 할 수 있다.
	// (유용한 방법이지만, 무한 렌더링을 초래할 수 있으므로 주의하자.) 
  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    const alternate = fiber.alternate;
	  // 이른 bailout을 위한 조건으로, 같은 값으로 상태 업데이트 시 아무것도 하지 말라는 의미.
	  // ⭐️ Bailout은 '서브트리의 리렌더링 방지를 위해 더 깊이 들어가는 것을 막는 것'을 의미한다.
	  // 이는 리렌더 과정 안에서 발생하며, 리렌더링 스케줄링을 막기 위해 존재한다.
	  // 하지만 이 조건문은 실제로는 hack에 가까운데, 
	  // ⭐️ React가 '최선을 다해 리렌더를 스케줄링하는 것을 막지만, 보장할 수는 없기' 때문이다.
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // 이 queue는 현재 빈 상태인데, 
      // 이는 render 단계에 진입하기 전에 다음 상태의 값을 즉시(eagerly) 계산한다는 의미다.
      // 만약 새로운 상태값이 지금 상태값과 같다면, 전체를 bailout할 수 있다. 
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        try {
          const currentState: S = (queue.lastRenderedState: any);
          const eagerState = lastRenderedReducer(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) {
            // 빠른 경로. React에 리렌더를 스케줄링하지 않고 bailout 할 수 있다.
            // 하지만 이 업데이트를 나중에 rebase할 수 있다. 
            // 만약 컴포넌트가 다른 이유로 리렌더된다면 그때 reducer는 바뀌었을 것이다.
            enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update);
            // 이 return문을 통해 업데이트가 스케줄링되는 것을 막는다. 
            return;
          }
        } catch (error) {
        } finally {
          if (__DEV__) {
            ReactCurrentDispatcher.current = prevDispatcher;
          }
        }
      }
    }

    // 업데이트들을 보류(stash) 한다.
    // 업데이트들은 실제 리렌더의 시작 단계에서 처리되고 fiber에 추가된다. 
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);

    if (root !== null) {
      const eventTime = requestEventTime();
      // 리렌더를 스케쥴링한다. 
      // 하지만 바로 리렌더가 발생하진 않으며, 실제 스케줄링은 React 스케줄러에 달려있다. 
      scheduleUpdateOnFiber(root, fiber, lane, eventTime);
      entangleTransitionUpdate(root, queue, lane);
    }
  }
}

```

별표 친 주석들은 이후에 다시 보게 될 것이다. 정체를 알고 나면 정말 치사한 주석이 아닐 수 없다. 

아무튼 업데이트 객체들이 어떻게 처리되는지 더 살펴보자.

```tsx
// 렌더가 진행되고, concurrent event에서 업데이트를 받게 되면,
// 이 업데이트를 fiber/hook queue에 추가하기 전에 현재 렌더가 끝날 때까지 기다린다. 
// 이 업데이트를 배열에 넣으면 나중에 queue, fiber, update, 그리고 기타 등등에 접근할 수 있다. 
const concurrentQueues: Array<any> = [];
let concurrentQueuesIndex = 0;

let concurrentlyUpdatedLanes: Lanes = NoLanes;
// 이 함수는 prepareFreshStack() 안에서 호출된다.
// 해당 함수는 리렌더의 초기 단계중 하나로, 
// 리렌더가 실제로 시작하기 전에, 모든 상태 업데이트들은 보류(stash)된다.
export function finishQueueingConcurrentUpdates(): void {
  const endIndex = concurrentQueuesIndex;
  concurrentQueuesIndex = 0;
  concurrentlyUpdatedLanes = NoLanes;
  let i = 0;
  while (i < endIndex) {
    // ...
    if (queue !== null && update !== null) {
	    // 이전에 언급했던 hook.queue를 떠올려보자.
	    // 여기서 보류된(stashed) 업데이트들이 마침내 이곳 fiber에 추가되어, 처리될 준비를 완료한다. 
      const pending = queue.pending;
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
      queue.pending = update;
    }
    
    if (lane !== NoLane) {
	    // 이 함수 호출은 fiber node path를 dirty로 마킹한다. 
      markUpdateLaneFromFiberToRoot(fiber, update, lane);
    }
  }
}

function enqueueUpdate(
  fiber: Fiber,
  queue: ConcurrentQueue | null,
  update: ConcurrentUpdate | null,
  lane: Lane,
) {
  // 아직 'childLanes'를 return path에 두지 않는다.
  // 만약 렌더링 중이라면, 끝날 때까지 기다린다. 
  // 업데이트들은 내부적으로 message queue처럼 리스트에 보관되며, batch로 수행된다. 
  concurrentQueues[concurrentQueuesIndex++] = fiber;
  concurrentQueues[concurrentQueuesIndex++] = queue;
  concurrentQueues[concurrentQueuesIndex++] = update;
  concurrentQueues[concurrentQueuesIndex++] = lane;

  concurrentlyUpdatedLanes = mergeLanes(concurrentlyUpdatedLanes, lane);
  
  // fiber의 'lane' 필드는 잡이 스케줄되었는지 확인하기 위해 몇몇 곳에서 사용된다.
  // 이는 즉시(eager) bailout을 위한 것으로, 업데이트가 곧바로 이루어진다.
  fiber.lanes = mergeLanes(fiber.lanes, lane);
  
  // ⭐️ 현재 fiber와 대체 fiber가 dirty로 마킹됐다.
  const alternate = fiber.alternate;
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
}

export function enqueueConcurrentHookUpdate<S, A>(
  fiber: Fiber,
  queue: HookQueue<S, A>,
  update: HookUpdate<S, A>,
  lane: Lane,
): FiberRoot | null {
  const concurrentQueue: ConcurrentQueue = (queue: any);
  const concurrentUpdate: ConcurrentUpdate = (update: any);
  enqueueUpdate(fiber, concurrentQueue, concurrentUpdate, lane);
  return getRootForUpdatedFiber(fiber);
}
```

```tsx
function markUpdateLaneFromFiberToRoot(
  sourceFiber: Fiber,
  update: ConcurrentUpdate | null,
  lane: Lane,
): void {
	// 현재 fiber의 lane을 업데이트한다. 
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
  let alternate = sourceFiber.alternate;
  // ⭐️ lane들은 현재 fiber와 대체 fiber 모두에서 업데이트된다.
  // dispatchSetState()는 현재 fiber에 바인딩되어있기 때문에
  // 상태를 업데이트하면 항상 현재 fiber tree를 업데이트하는 것은 아니다.
  // 둘 모두를 업데이트하는 것은 모든 것을 정상 동작하게 만들지만, 사이드 이펙트도 있다. 
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
	
	// 부모 경로에서 루트까지 따라가며 자식 lane을 업데이트한다. 
  let isHidden = false;
  let parent = sourceFiber.return;
  let node = sourceFiber;
  while (parent !== null) {
    parent.childLanes = mergeLanes(parent.childLanes, lane);
    alternate = parent.alternate;
    if (alternate !== null) {
      alternate.childLanes = mergeLanes(alternate.childLanes, lane);
    }
    if (parent.tag === OffscreenComponent) {
      const offscreenInstance: OffscreenInstance = parent.stateNode;
      if (offscreenInstance.isHidden) {
        isHidden = true;
      }
    }
    node = parent;
    parent = parent.return;
  }
  if (isHidden && update !== null && node.tag === HostRoot) {
    const root: FiberRoot = node.stateNode;
    markHiddenUpdate(root, update, lane);
  }
}
```

```tsx
export function scheduleUpdateOnFiber(
  root: FiberRoot,
  fiber: Fiber,
  lane: Lane,
  eventTime: number,
) {
	  // ... 
	  
	  // scheduleUpdateOnFiber()에서 주목해야 하는 코드.
	  // 대기중인 업데이트가 있을 때 리렌더가 스케줄링되는 것을 보장한다.
	  // 실제 리렌더가 아직 시작하지 않았기 때문에 업데이트들은 아직 처리되지 않는다.
	  // 실제 리렌더의 시작은 이벤트의 종류나 스케줄러의 상태 등 여러 요인에 달려 있다.
    ensureRootIsScheduled(root, eventTime);
    
    // ... 
  }
}
```

### 리렌더에서 useState()

보류(stash)된 업데이트들을 실제로 실행할 타이밍이다.

이것은 실제로는 리렌더 단계의 `useState()`에서 발생한다. 

추후에 알겠지만, 상태고 뭐고 일단 리렌더를 조져버리는 것이다! 

```tsx
function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, (initialState: any));
}
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
	// updateWorkInProgressHook에서는 이전에 생성된 hook을 반환하여, 값을 얻을 수 있다. 
  const hook = updateWorkInProgressHook();
	// 업데이트 queue는 모든 업데이트들을 가지고 있다.
	// useState()는 리렌더가 시작된 후 호출되기 때문에,
	// 보류된(stashed) 업데이트들은 fiber로 이동한다. 
  const queue = hook.queue;
  
  if (queue === null) {
    throw new Error(
      'Should have a queue. This is likely a bug in React. Please file an issue.',
    );
  }
  
  queue.lastRenderedReducer = reducer;
  
  const current: Hook = (currentHook: any);

	// 서로 다른 우선순위를 가진 다양한 업데이트들이 있기 때문에
	// 그것들을 나중에 사용하기 위해 baseQueue에 보관된다.
	// 또한 업데이트가 수행되는 와중에도, 최종 상태가 올바른지 확인하기 위해 
	// 상태가 baseQueue에 저장되면, 모든 뒤따르는 업데이트도 그곳에 있어야 한다. 
  let baseQueue = current.baseQueue;

  const pendingQueue = queue.pending;
  if (pendingQueue !== null) {
		// 아직 처리되지 않은 새로운 업데이트들이 있다.
		// 이것들을 base queue에 넣는다. 
    if (baseQueue !== null) {
			// 대기 queue와 base queue를 병합한다. 
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
	   // 대기 queue는 비워지고 baseQueue에 병합된다. 
    queue.pending = null;
  }
  if (baseQueue !== null) {
		// 처리할 queue가 있다. 
    const first = baseQueue.next;
    let newState = current.baseState;

	 	// baseQueue를 처리한 후, 새로운 baseQueue가 생성된다. 
    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;

    let update = first;
    // do...while 루프를 통해 모든 업데이트를 수행한다. 
    do {
      ...
      const shouldSkipUpdate = isHiddenUpdate
        ? !isSubsetOfLanes(getWorkInProgressRootRenderLanes(), updateLane)
        : !isSubsetOfLanes(renderLanes, updateLane);
      if (shouldSkipUpdate) {
        // 우선순위로는 불충분하다. 이 업데이트를 스킵한다. 
        // 만약 이것이 처음으로 스킵된 업데이트라면, 이전 업데이트/상태가 새로운 base 업데이트/상태가 된다.
        const clone: Update<S, A> = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: (null: any),
        };
        // 업데이트가 수행되지 않았으므로 새로운 baseQueue에 넣는다. 
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        // queue에 남아있는 우선순위를 처리한다. 
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        );
        markSkippedUpdateLanes(updateLane);
      } else {
        // 이 업데이트는 충분한 우선순위를 갖고 있지 않다. 
        if (newBaseQueueLast !== null) {
      
          const clone: Update<S, A> = {
            // baseQueue에 대해 설명했듯이,
            // 여기서 한번 newBaseQueue가 비어있지 않으면,
            // 모든 뒤따르는 업데이트들은 미래에 사용되기 위해 보류(stash)된다. 
            lane: NoLane,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: (null: any),
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        // 이 업데이트를 수행한다. 
        if (update.hasEagerState) {
          // 만약 이 업데이트가 상태 업데이트(reducer가 아닌)이고 즉시(eagerly) 수행됐다면,
          // 즉시 계산된 상태를 사용할 수있다. 
          newState = ((update.eagerState: any): S);
        } else {
          const action = update.action;
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    } while (update !== null && update !== first);
    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = (newBaseQueueFirst: any);
    }
    // 새로운 상태가 현재 상태와 다를 때에만 fiber가 잡을 수행한다.
    if (!is(newState, hook.memoizedState)) {
	    // 리렌더 동안에 상태 변화가 없다면 실제로 bailout(이른 bailout은 아니다)될 것이다. 
      markWorkInProgressReceivedUpdate();
    }
    // 마침내 새로운 상태가 할당된다. 
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    // 다음 리렌더를 위해 새로운 baseQueue가 할당된다. 
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = newState;
  }
  
  if (baseQueue === null) {
    queue.lanes = NoLanes;
  }
  
  const dispatch: Dispatch<A> = (queue.dispatch: any);
  // 이제 새로운 상태와 dispatch()를 갖게 되었다! 
  return [hook.memoizedState, dispatch];
}
```

사실 바로 위 코드블럭은 도무지 무슨 소린지 이해하지 못했다. 

하지만 역시 모든 것을 다 이해할 필요는 없는 것 같다. ㅋ

아무튼 이렇게 하루종일 애써서 번역했다. (사실 하루종일은 아니다. 한 시간 정도 걸렸다. ~~이렇게 말하는 게 더 멋있어 보이기도 한다.~~) 한 20% 정도의 주석과 코드는 생략한 것인데도 사람 미치게 한다. 날도 더워 죽겠는데 미쳐보자. 

## 그래서 뭣이 중헌디?

---

위 문서는 다시 이런 [공식 문서의 caveat](https://react.dev/reference/react/useState#setstate-returns)을 첨부한다. 그리고 그 문서에서는 이런 문장이 눈에 띈다.

> 만약 현재 상태와 같은 상태로 업데이트를 시도한다면, React는 컴포넌트와 그 자식의 리렌더를 스킵할 것이다. 다만 몇몇 경우에 React는 자식 컴포넌트의 렌더링을 스킵하기 전에 현재 컴포넌트를 다시 호출할 수도 있다.
> 

진짜 열 받는다. 그래서 그 ‘몇몇 경우’가 뭐냐고? 

핵심은, 같은 값으로 호출한 `setState()`가 여전히 리렌더를 발생시킬 수 있다는 것이다. 바로 이 포스팅의 처음에 언급한 퀴즈와 같은 케이스.

이를 이해하기 위해 다시 위에 난리를 벌여놓은 코드로 돌아가야 한다.

```tsx
function dispatchSetState<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
) {
	// 업데이트의 우선순위를 결정한다. 
  const lane = requestUpdateLane(fiber);

	// 보류(stash) 처리될 업데이트 객체. 
  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };

	// render하는 동안에 setState를 할 수 있다.
	// (유용한 방법이지만, 무한 렌더링을 초래할 수 있으므로 주의하자.) 
  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
  const alternate = fiber.alternate;
  	  // 이른 bailout을 위한 조건으로, 같은 값으로 상태 업데이트 시 아무것도 하지 말라는 의미.
	  // ⭐️ Bailout은 '서브트리의 리렌더링 방지를 위해 더 깊이 들어가는 것을 막는 것'을 의미한다.
	  // 이는 리렌더 과정 안에서 발생하며, 리렌더링 스케줄링을 막기 위해 존재한다.
	  // 하지만 이 조건문은 실제로는 hack에 가까운데, 
	  // ⭐️ React가 '최선을 다해 리렌더를 스케줄링하는 것을 막지만, 보장할 수는 없기' 때문이다.
	  // 다음 조건 하에서, 상태 값이 바뀌지 않으면 리렌더를 스케줄하는 것을 피한다. 
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
	    // ...
    }
```

> React가 '최선을 다해 리렌더를 스케줄링하는 것을 막지만, 보장할 수는 없기' 때문이다.
> 

완전 미친 거지! 

`dispatchSetState()` 함수에서는 hook을 위해 대기중인 업데이트 queue와 baseQueue가 비었는지 확인하는 것이 최선이다. 하지만 현재 구현에서 실제로 리렌더를 시작했는지는 알 수 없다.

이를 알기 위해서는, fiber에 업데이트가 발생했는지 확인하는 간단한 방법 - 업데이트가 queue에 들어가면 fiber를 dirty로 마킹하는 방법 - 이 사용된다. 

하지만 여기서 뭐가 문제냐면? 

업데이트를 queue에 넣을 때, 현재 fiber와 대체 fiber가 함께 dirty로 마킹된다. `dispatchSetState()`가 현재 fiber에 바인딩되어 있기 때문에 이 과정이 필요하다. 따라서 현재 fiber와 대체 fiber 모두를 업데이트하지 않는다면 필요한 업데이트가 수행되는지 아닌지 알 수 없다. 

그리고 lanes를 초기화하는 단계는 실제 리렌더링을 수행하는 `beginWork()`에서야 시작된다. 

```tsx
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  ...
  // 리렌더링을 시작하기 직전에 대기 업데이트 우선순위를 초기화한다. 
  workInProgress.lanes = NoLanes;
  ...
}
```

이러한 동작으로 한번 업데이트가 스케줄링되면, **dirty로 마킹된 lane들을 초기화하는 것은 최소 2번의 리렌더링이 된 이후에 발생하게 되는 것이다.**

즉 문제의 코드 실행 순서를 보면 다음과 같다.

1. 현재 fiber가 존재한다.
2. `setState(true)` 호출 시 이전 상태값과 다르므로 즉시 bailout이 발생하진 않는다.
3. 현재 fiber는 dirty로 마킹된다.
4. 현재 fiber와 대체 fiber가 dirty로 마킹되어 리렌더된다.
5. 대체 fiber가 현재 fiber가 되고, 현재 fiber는 dirty 마킹된 채로 대체 fiber가 된다. 
6. `setState(true)` 를 호출한다. 이때 두 fiber 중 하나가 clean하지 않으므로, 즉시 bailout이 발생하진 않는다.
7. 현재 fiber와 대체 fiber 모두 dirty로 마킹된다.
8. 리렌더가 시작되고, 현재 fiber는 대체 fiber로부터 lane들을 할당받는다.
9. 현재 fiber와 대체 fiber 모두 clean한 상태 
10. 현재 fiber와 대체 fiber가 다시 한 번 swap된다.
11. `setState(true)` 를 호출한다. 두 fiber가 모두 clean한 상태이므로 즉시 bailout이 발생한다! 

fiber가 어쩧고 어쩧고! 🤬

이제는 정말 쉬운 말로 간추려 정리하지 않는다면 블로그고 뭐고 아무 소용이 없어져버릴 타이밍이다.

## 코드 정답 이해하기

---

그동안 우리가 무엇을 하는지도 잊어버렸다. 

다시 처음 문제의 코드로 돌아가보자.

```tsx
import * as React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { screen, fireEvent } from "@testing-library/dom";

function A() {
  console.log('render A')
  return null
}

function App() {
  const [_state, setState] = useState(false)
  console.log('render App')
  return <div>
    <button onClick={() => {
      console.log('click')
      setState(true)
    }}>click me</button>
    <A />
  </div>
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

(async function () {
  const action = await screen.findByText("click me");
  fireEvent.click(action);
  await wait(100);
  fireEvent.click(action);
  await wait(100);
  fireEvent.click(action);
})();

function wait(duration = 100) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
```

```tsx
"render App"
"render A"
"click"
"render App"
"render A"
"click"
"render App"
"click"
```

1. 일단, 첫 번째 클릭까지는 이해된다. 즉 5번째 `console.log()`까지는 쉬운 납득
2. 두 번째 클릭 시, 이전 값과 같은 값으로 업데이트를 시도하는데, 이때 React가 멍청해서 바로 bailout을 하지 못하고 자기 자신 컴포넌트는 리렌더시킨다.
    - 정말 성가시지만 이 과정은 리액트가 서브트리로 더 깊게 들어가 자식 컴포넌트의 리렌더링을 유발하지 않기 위해 필요하다고 한다! (변명 같지만 너그러운 우리가 이해해주자!) 그래서 다행스럽게도 `A` 컴포넌트는 리렌더되지 않는다.
3. 세 번째 클릭 역시 이전 값과 같은 값으로 업데이트를 시도한다. 다만 이때는 현재 트리와 다음 트리가 이미 같은 상태이므로 React가 바로 bailout을 시키는 조건에 부합하여 리렌더가 발생하지 않는다.

사실 이 모든 난리를 정리하자면

> React는 필요하다고 생각될 때에 리렌더를 하므로, 리렌더를 피하기 위한 너희 개발자들의 성능 개선 노력이 항상 먹히진 않는다는 것을 알아두자 ^0^

이는 정말이지 대기업(Meta)의 횡포라고 생각한다.

얻어간 것도, 내가 화낸다고 달라지는 것도 크게 없는 것 같지만

실컷 영어공부한 것에 만족하기로 한다. 

## Ref

---

- https://bigfrontend.dev/react-quiz/useState 👈 문제 출처
- https://jser.dev/2023-06-19-how-does-usestate-work/
- https://react.dev/reference/react/useState#setstate-returns
- https://stackoverflow.com/questions/55373878/what-are-the-differences-when-re-rendering-after-state-was-set-with-hooks-compar
- https://legacy.reactjs.org/docs/react-component.html#setstate
