---
title: surrogate pair
date: 2026-1-17 09:13:00
tags: ["javascript"]
description: 이모지가 두 개로 찢어지는 이유
---

## Surrogate Pair란 

자바스크립트는 UTF-16 인코딩을 사용하여 문자열을 처리하며. UTF-16은 16비트의 고정 길이를 가진다. 유니코드의 코드 포인트가 0x10000(65536) 이상의 문자에 해당할 때, 하나의 16비트 단위로 표현할 수 없어서 두 개의 16비트 코드로 문자를 표현한다. 이를 **Surrogate Pair**라고 한다. 

이로 인해 Surrogate Pair를 사용하는 문자는 문자열의 길이를 계산할 때 두 개의 코드 유닛으로 간주된다.

Surrogate Pair는 두 개의 16비트 코드 유닛으로 구성된다:

1. High Surrogate: 0xD800에서 0xDBFF 사이의 값으로, 상위 16비트이다.
2. Low Surrogate: 0xDC00에서 0xDFFF 사이의 값으로, 하위 16비트이다. 

이 두 개의 코드 유닛을 결합하여 하나의 유니코드 코드 포인트를 표현한다.

예를 들어, 코드 포인트 U+10000은 다음과 같이 표현된다:
- High Surrogate: 0xD800
- Low Surrogate: 0xDC00

## 이모지가 두 개로 찢어지는 이유 

어쩐지 github 코멘트에 '🙇‍♀️' 이모지를 입력하면, 매번 '🙇‍♂️♀' 이렇게 뜨더라. 

Surrogate Pair가 필요한 문자열에서는, 문자열의 길이가 실제 보이는 문자 수와 다를 수 있기 때문이다. 

Surrogate Pair가 필요한 대표적인 문자로는 이모지들이 있다. 

- Surrogate Pair가 필요한 이모지: U+10000 이상의 문자들 (대부분의 이모지)
```jsx
'😀'.length  // 2 - U+1F600
'🎉'.length  // 2 - U+1F389
'👨'.length  // 2 - U+1F468
'🚀'.length  // 2 - U+1F680
'💻'.length  // 2 - U+1F4BB
```

- Surrogate Pair가 아닌 문자: U+0000 ~ U+FFFF (BMP: Basic Multilingual Plane)
```jsx
'A'.length   // 1 - U+0041
'한'.length  // 1 - U+D55C
'♥'.length   // 1 - U+2665
'☺'.length   // 1 - U+263A
'→'.length   // 1 - U+2192
```

- 더 복잡한 경우: 결합 문자
```jsx
// 피부색이 있는 이모지
'👨🏻'.length  // 4! (남자 + 피부색 modifier)

// 국기 이모지
'🇰🇷'.length  // 4! (두 개의 regional indicator)

// 가족 이모지
'👨‍👩‍👧'.length  // 8! (남자 + ZWJ + 여자 + ZWJ + 아이)
```

- 실전 유의사항 
```jsx
// 잘못된 방법
'😀🎉'.length  // 4 (2개 이모지인데!)
'😀🎉'[0]      // '�' (깨진 문자)

// 올바른 방법
[...'😀🎉'].length  // 2 ✅
Array.from('😀🎉').length  // 2 ✅

// 문자 순회
for (const char of '😀🎉') {
  console.log(char);  // '😀', '🎉' ✅
}

// 특정 위치 접근
'😀🎉'.codePointAt(0)  // 128512 ✅
String.fromCodePoint(128512)  // '😀' ✅
```

## 기타 

Surrogate Pair는 UTF-16 인코딩을 사용하는 시스템에서만 적용된다. 따라서 모든 프로그래밍 언어나 시스템에서 공통적으로 적용되는 개념은 아니다.

어쨌든, 이모지까지 세심하게 다뤄야 하는 자바스크립트 개발자는 주의하도록 하자! 😬(128556)

**Refs** 

- https://velog.io/@hodotori/Surrogate-pair
- claude code 