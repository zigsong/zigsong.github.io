---
title: file input 다루는 법
date: 2021-07-18 19:44:09
tags: ["frontend"]

---

`<input type="file" />` 다루는 법

<!-- more -->

---

리액트 앱에서 다루기 어려운 것 중 하나가 바로 form이다. form 안의 input 값의 상태를 일일히 관리해주어야 하고, 각각 validation까지 해준다면 더욱 복잡해진다.

그래서 **react-hook-form**이라는 라이브러리를 사용했다. 한번에 form 안의 모든 input들의 값을 가져올 수 있었지만, file 타입의 input을 가져오는 일은 만만치 않았다. 또 디자인을 커스터마이징한 파일 선택 input에서 파일이 선택되었을 때 바로 옆에 선택된 파일의 이름이 뜨게끔 만들어야 했다.

> 파일 타입의 인풋은 애플리케이션 계층에서 관리가 되어야 합니다. 파일 선택을 취소할 수도 있고 `FileList` 객체도 있기 때문입니다. ([출처: react-hook-form 공식 문서](https://react-hook-form.com/kr/api/))

위와 같은 이유로 **react-hook-form**을 사용한 다른 input들과 같은 방식으로 file input을 작성할 수 없었다. 그리고 아래 이유로 `value`와 `onChange` 등을 이용하여 file input에 들어온 값을 바로 가져오기도 힘들었다.

> React에서 `<input type="file" />`은 프로그래밍적으로 값을 설정 할 수 없고 사용자만이 값을 설정할 수 있기 때문에 항상 비제어 컴포넌트입니다. ([출처 - react 공식 문서](https://ko.reactjs.org/docs/uncontrolled-components.html))

실제로 React 공식문서에서 file input은 아래와 같이 `ref`를 걸어 비제어 컴포넌트로 사용하고 있다.

```tsx
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleSubmit(event) {
    event.preventDefault();
    alert(`Selected file - ${this.fileInput.current.files[0].name}`);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

정말 비제어 컴포넌트밖에 답이 없을까? 🤔

고민하던 중 **react-hook-form**의 `watch`라는 메서드를 발견했다.
`watch`는 말 그대로 ‘지켜보고’ 있는 것과 같다. 인자로 원하는 input 이름을 넣어주면, 해당 input의 값을 관찰하여 값이 바뀔 때 업데이트된 값을 즉시 알아챌 수 있다.

```tsx
// Upload.tsx

const Upload = () => {
  const { register, handleSubmit, setValue, watch } = useForm<FeedToUpload>();
  const watchThumbnailImage = watch("thumbnailImage");

  return (
    // ...
    <FileInput
      fileName={watchThumbnailImage?.name}
      onChange={(event) =>
        setValue("thumbnailImage", event.currentTarget.files[0])
      }
    />
    // ...
  );
};
// FileInput.tsx
const FileInput = ({ fileName, ...options }: Props) => {
  return (
    <Styled.Root>
      <Styled.Label>
        <input type="file" {...options} />
        <span>파일 선택</span>
      </Styled.Label>
      <Styled.FileNameText>
        {fileName || "파일을 선택해주세요."}
      </Styled.FileNameText>
    </Styled.Root>
  );
};
```
