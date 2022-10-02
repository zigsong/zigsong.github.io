---
title: ModalProvider 만들기
date: 2021-07-18 19:38:46
tags: react
thumbnailImage: https://i.imgur.com/stTzX5o.png
---

ModalProvider 만들기

<!-- more -->

---

context API를 사용하여 Modal Provider를 만들어보자. (사실 페어가 다 했다!)

```tsx
// ModalProvider.tsx
interface Props {
  children: ReactNode;
}

interface ModalContext {
  openModal: (modalComponent: ReactNode) => void;
  closeModal: () => void;
}

export const Modal = React.createContext<ModalContext | null>(null);
const modalRoot = document.getElementById("modal-root"); // Portal 삽입을 위한 root DOM 생성

const ModalProvider = ({ children }: Props) => {
  const [modal, setModal] = useState<ReactNode | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (modalComponent: ReactNode) => {
    setModal(modalComponent);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const modalElement: React.ReactNode = (
    <Styled.ModalContainer>
      <Styled.ModalInner>
        <Styled.CrossMarkButton onClick={closeModal}>
          <CrossMark width="16px" />
        </Styled.CrossMarkButton>
        {modal && modal}
      </Styled.ModalInner>
    </Styled.ModalContainer>
  );

  const contextValue = useMemo(() => ({ openModal, closeModal }), []);

  return (
    <Context.Provider value={contextValue}>
      {children}
      {isOpen && ReactDOM.createPortal(modalElement, modalRoot)}
    </Context.Provider>
  );
};

export default ModalProvider;
```

Context의 Provider에 `openModal`과 `closeModal` 메서드를 정의하여 Context의 API의 value로 내려주기 때문에 모달을 사용하는 곳마다 새롭게 open과 close에 대한 메서드를 정의해줄 필요가 없다.

이때 Context의의 Consumer에 해당하는 자식 컴포넌트들에서 `openModal`, `closeModal`등 Context의 value로 내려준 함수가 호출될 때마다 리렌더가 발생하기 때문에 `Provider`에서 해당 Context의 value들을 `useMemo`로 감싸 메모이제이션해준다. `openModal`의 인자로는 열고자 하는 모달 컴포넌트(ex. LoginModal 컴포넌트)를 넘겨준다.

`children`은 modal이 열릴 베이스 페이지를 가리킨다. Home이라는 페이지 컴포넌트에서 로그인 모달이 열린다면, 여기서 `children`은 Home이 되는 것이다. 현재 앱에서는 로그인 모달을 사용하고 있으며, 로그인 모달은 페이지 어디서든 열릴 수 있어야 하기 때문에 App.tsx에서 전체 앱을 `ModalProvider`로 감싸준다.

```tsx
// App.tsx
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Router>
        <Switch>
          <>
            <ModalProvider>
              {/* 여기! */}
              <main>..</main>
            </ModalProvider>
          </>
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};
```

`useModal`이라는 hook을 만들어주면 더욱 편리하게 사용할 수 있다. `useContext`로 방금 전 생성한 Context의 현재 값을 반환 받고, 그 값을 리턴하는 hook을 만들어 컴포넌트에서 사용할 수 있다. 이때 예상치 못한 상황으로 Context Provider 외부에서 해당 함수가 호출됐다면 간단하게 에러를 던져준다.

```tsx
// useModal.tsx
import { useContext } from "react";

import { Modal } from "components/@common/ModalProvider";

const useModal = () => {
  const context = useContext(Modal);

  if (!context) {
    throw new Error(
      "ModalProvider 내부에서만 useModal hook을 사용할 수 있습니다."
    );
  }

  return context;
};

export default useModal;
```

컴포넌트에서 `useModal`을 통해 `ModalProvider`의 context value들을 내려받을 수 있으며, 각 상황에 맞는 커스텀한 modal 컴포넌트를 열고 닫을 수 있다.

```tsx
// Header.tsx
const Header = () => {
  const modal = useModal();

  const openLoginModal = () => {
    modal.openModal(<LoginModal />);
  };

  return (
    // ...
    <Styled.SignInButton onClick={openLoginModal}>Sign In</Styled.SignInButton>
    // ...
  );
};
```

> 페어가 어디서 이런 아이디어를 가져왔는지는 모르겠지만, 얼마 후 [Kent C Dodds.의 글](https://kentcdodds.com/blog/how-to-use-react-context-effectively)을 보다가 같은 내용을 발견했다! 사용하는 쪽에서 편리한, 꽤나 유용한 코드 스트럭쳐라고 생각한다.

---

**Ref**
https://ko.reactjs.org/docs/hooks-reference.html#usecontext
