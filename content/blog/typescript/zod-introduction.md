---
title: 생각보다 깔끔하고 매력적인 zod 
date: 2025-05-17 23:41:16
tags: ["typescript"]
---

TypeScript는 컴파일 타임에만 타입을 검사하지만, 런타임에서는 타입 정보가 사라진다.

그래서 런타임 타입 및 유효성 검사 라이브러리로 [zod](https://zod.dev/)가 많이 사용된다. 

---

zod는 가장 기본적으로는 원하는 타입을 강제하거나, 작성한 값의 타입을 추론해준다.

타입을 지정할 때는 스키마를 사용한다. `z.string()` 등 기본 타입부터 `z.object()`로 선언한 커스텀 스키마까지 선언할 수 있다. 

```tsx
import { z } from "zod";

// creating a schema for strings
const mySchema = z.string();

// parsing
mySchema.parse("tuna"); // => "tuna"
mySchema.parse(12); // => throws ZodError

// "safe" parsing (doesn't throw error if validation fails)
mySchema.safeParse("tuna"); // => { success: true; data: "tuna" }
mySchema.safeParse(12); // => { success: false; error: ZodError }
```

여기서 `parse`와 `safeParse` 두 가지 모두 제공하여 유연하게 에러처리를 할 수 있게 한 점도 로맨틱하다.

타입 추론 및 유효성 검증은 `parse()`와 `interface()` 키워드를 통해 할 수 있다. 

```tsx
import { z } from "zod";

const User = z.object({
    username: z.string(),
});

User.parse({ username: "Ludwig" });

// extract the inferred type
type User = z.infer<typeof User>;
// { username: string }
```
        
커스텀한 타입으로 값을 지정했을 때, `infer` 키워드를 유용하게 쓸 수 있을 듯 하다.

추가로 잘 알려지지 않은(?), 내가 발견한 zod의 꿀팁!

## 1. branded type (nominal type)

```tsx
const Cat = z.object({ name: z.string() }).brand<"Cat">();
type Cat = z.infer<typeof Cat>;

const petCat = (cat: Cat) => {};

// 동작 🙆‍♀️
const simba = Cat.parse({ name: "simba" });
petCat(simba);

// 동작 🙅‍♀️
petCat({ name: "fido" });
```

타입스크립트의 본질적 문제(?)였던 구조적 타이핑...

으로부터 시작된 공변 반변 어쩌구 😫 

zod의 nominal typing과 함께라면 이제 속이 뻥!

## 2. description

```tsx
const documentedString = z
    .string()
    .describe("A useful bit of text, if you know what to do with it.");
documentedString.description; // A useful bit of text…
```

사실 `description`이 있다고 이걸 어디서 찍어볼 것 같진 않지만 ㅋㅋㅋ 

그냥 별걸 다 넣어줘서 신기하다.

## 3. `transform()`을 이용한 데이터 형변환

```tsx
const stringToNumber = z.string().transform((val) => val.length);

stringToNumber.parse("string"); // => 6
```

form의 값을 가져와서 사용할 때 유용할듯! 

모든 프론트 개발자들에게 악마와 같은 😈 form... 

체이닝도 가능하다.

```tsx
const emailToDomain = z
  .string()
  .email()
  .transform((val) => val.split("@")[1]);

emailToDomain.parse("colinhacks@example.com"); // => example.com
```

### 4. `refine()`을 사용한 오류 검증

zod로 생성한 스키마에 대해서 커스텀 유효성 검증도 간단하게 쓸 수 있다.

```tsx
const myString = z.string().refine((val) => val.length <= 255, {
  message: "String can't be more than 255 characters",
});
```

게다가 여기서도 `superRefine()`이라는 더 세심한 함수도 제공함... 

---

이밖에도 zod 공식문서의 TOC를 보면 뭔가 배워야할 것들이 많아 보이지만,

프로덕트를 개발하다 보면 '아 이런 타입 검증 기능 좀 있으면 좋겠다' 싶은 것들만 쏙쏙 골라 너무 과하지 않게 잘 만들어둔 것 같다 ㅋㅋㅋ 보다보면 갑자기 zod 소스코드에 기여하고 싶어진다. ~~언젠가~~ 

yup, superstruct 등 타입스크립트의 약점을 보완하기 위한 다양한 타입 검증 라이브러리들이 있지만, (사실 잘 모른다 ㅎ)

zod, 생각보다도 더 유용하게 프로덕트에 적용해볼 수 있을 것 같다! 언젠가의 나 화이팅!