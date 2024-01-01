---
title: 객체지향의 사실과 오해 - 7장
date: 2022-03-20 23:18:10
tags: ["oop-true-and-false"]

---

7장: 함께 모으기

<!-- more -->

---

마틴 파울러는 객체지향 설계 안에 존재하는 세 가지 상호 연관된 관점에 대해 설명한다.

- **개념 관점(Conceptual Perspective)** - 설계는 도메인 안에 존재하는 개념과 개념들 사이의 관계를 표현한다. 도메인이란 사용자들이 관심을 가지고 있는 특정 분야나 주제를 말하며 소프트웨어는 도메인에 존재하는 문제를 해결하기 위해 개발된다.
- **명세 관점(Specification Perspective)** - 도메인이 아닌 실제로 소프트웨어 안에서 살아 숨쉬는 객체들의 책임 즉 객체의 인터페이스를 바라본다. 프로그래머는 객체가 협력을 위해 ‘무엇’을 할 수 있는가에 초점을 맞춘다.
- **구현 관점(Implementation Perspective)** - 객체들이 책임을 수행하는 데 필요한 동작하는 코드를 작성하는 것이다. 객체의 책임을 ‘어떻게’ 수행할 것인가에 초점을 맞춘다.

클래스는 세 가지 관점을 통해 설계와 관련된 다양한 측면을 드러낸다. 클래스는 세 가지 관점을 모두 수용할 수 있도록 개념, 인터페이스, 구현을 함께 드러내야 한다.

---

## 커피 전문점 도메인

### 커피 주문

커피 전문점은 아주 간단한 도메인이다. 우리는 객체를 이용해서 손님이 커피를 주문하는 사건을 컴퓨터 안에 재구성해야 한다.

### 커피 전문점이라는 세상

객체지향의 관점에서 메뉴판은 하나의 객체이며, 메뉴판을 구성하는 메뉴 항목들 역시 객체다.

손님 역시 객체로, 메뉴 항목 객체 하나를 선택해 바리스타 객체에게 전달한다. 바리스타는 자율적으로 커피를 제조하는 객체이며, 바리스타가 제조하는 커피 역시 객체다.

손님은 메뉴판을 알아야 하며, 이는 두 객체 사이에 관계가 존재함을 암시한다. 손님은 바리스타와도 관계를 맺으며, 바리스타는 자신이 만든 커피와 관계를 맺는다.

상태와 무관하게 동일하게 행동할 수 있는 객체들은 동일한 타입의 인스턴스로 분류할 수 있다. 손님, 바리스타, 커피 객체 각각은 모두 ‘손님 타입’, ‘바리스타 타입’, ‘커피 타입’의 인스턴스다.

메뉴판 타입과 메뉴 항목 타입은 **포함(containment)** 또는 **합성(composition)** 관계다. 손님 타입과 메뉴판 타입은 포함 관계는 아니지만 서로 알고 있는 **연관(association)** 관계에 있다.

커피 전문점 도메인을 구성하는 타입들의 종류와 관계를 표현할 수 있다. 소프트웨어가 대상으로 하는 영역인 도메인을 단순화해서 표현한 모델을 **도메인 모델**이라고 한다.

---

## 설계하고 구현하기

### 커피를 주문하기 위한 협력 찾기

협력을 설계할 때는 메시지가 객체를 선택하게 해야 한다.

첫 번째 메시지는 ‘커피를 주문하라’이다. 도메인 모델 안에 이 책임을 수행하기에 적절한 타입은 손님 타입으로, 이 메시지를 처리할 객체는 손님 타입의 인스턴스다.

이때 손님은 메뉴 항목에 대해서는 알지 못하며, ‘메뉴 항목을 찾아라’라는 새로운 메시지가 등장한다. 이때 메시지에 ‘메뉴 이름’이라는 인자를 포함해 함께 전송한다. 메뉴 항목을 찾을 책임은 메뉴 항목 객체를 포함하고 있는 메뉴판 객체에게 할당한다.

손님은 자신이 주문한 커피에 대한 메뉴 항목을 얻었으니 이제 ‘커피를 제조하라’라는 메시지를 만든다. 인자로는 메뉴 항목을 전달하고 반환값으로는 제조된 커피를 받아야 한다. 이 메시지는 바리스타 객체가 수신한다.

아메리카노를 만드는 데 필요한 지식은 바리스타의 상태로, 기술은 바리스타의 행동으로 간주할 수 있다. 이런 관점에서 바리스타는 스스로의 판단과 지식에 따라 행동하는 자율적인 존재다.

### 인터페이스 정리하기

객체가 수신한 메시지가 객체의 인터페이스를 결정한다. 메시지가 객체를 선택했고, 선택된 객체는 메시지를 자신의 인터페이스로 받아들인다. 객체가 어떤 메시지를 수신할 수 있다는 것은 그 객체의 인터페이스 안에 메시지에 해당하는 오퍼레이션이 존재한다는 것을 의미한다.

| 객체     | 오퍼레이션         |
| :------- | :----------------- |
| 손님     | 커피를 주문하라    |
| 메뉴판   | 메뉴 항목을 찾아라 |
| 바리스타 | 커피를 제조하라    |
| 커피     | 생성하라           |

클래스를 이용하여 협력을 통해 식별된 타입의 오퍼레이션을 외부에서 접근 가능한 공용 인터페이스로 만들자.

```jsx
class Customer {
  public void order(String menuName) {}
}

class MenuItem {
}

class Menu {
  public MenuItem choose(String name) {}
}

class Barista {
  public Coffee makeCoffee(MenuItem menuItem) {}
}

class Coffee {
  public Coffee(MenuItem menuItem) {}
}
```

### 구현하기

클래스의 인터페이스를 식별했으므로 이제 오퍼레이션을 수행하는 방법을 메서드로 구현하자.

객체가 다른 객체에게 메시지를 전송하기 위해서는 먼저 객체에 대한 참조를 얻어야 한다.

```jsx
class Customer {
  public void order(String menuName, Menu menu, Barista barista) {
    MenuItem menuItem = menu.choose(menuName);
    Coffee coffee = barista.makeCoffee(menuItem);
  }
}
class Menu {
  private List<MenuItem> items;

  public Menu(List<MenuItem> items) {
    this.items = items;
  }

  public MenuItem choose(String name) {
    for (menuItem each : items) {
      if (each.getName().equals(name)) {
        return each;
      }
    }
    return null;
  }
}
```

> 💡 객체의 속성은 객체의 내부 구현에 속하기 때문에 캡슐화돼야 한다.
> 따라서 MenuItem의 목록을 Menu의 속성으로 포함시킨다.

```jsx
class Barista {
  public Coffee makeCoffee(MenuItem menuItem) {
    Coffee coffee = new Coffee(menuItem);
    return coffee;
  }
}
class Coffee {
  private String name;
  private int price;

  public Coffee(MenuItem menuItem) {
    this.name = menuItem.getName();
    this.price = menuItem.cost();
  }
}

public class MenuItem {
  private String name;
  private int price;

  public MenuItem(String name, int price) {
    this.name = name;
    this.price = price;
  }

  public int cost() {
    return price;
  }

  public String getName() {
    return name;
  }
}
```

> 인터페이스를 통해 실제로 상호작용을 해보지 않은 채 인터페이스의 모습을 정확하게 예측하는 것은 불가능에 가깝다.
> 설계를 간단히 끝내고 최대한 빨리 구현에 돌입하라. 설계가 제대로 그려지지 않는다면 고민하지 말고 실제로 코드를 작성해가면서 협력의 전체적인 밑그림을 그려보라.

---

## 코드와 세 가지 관점

### 코드는 세 가지 관점을 모두 제공해야 한다

개념 관점에서 코드를 바라보면 `Customer`, `Menu`, `MenuItem`, `Barista`, `Coffee` 클래스가 있다. 이 클래스들은 커피 전문점 도메인을 구성하는 중요한 개념과 관계를 반영한다. 소프트웨어 클래스가 도메인 개념의 특성을 최대한 수용하면 변경을 관리하기 쉽고 유지보수성을 향상시킬 수 있다.

명세 관점은 클래스의 인터페이스를 바라본다. 클래스의 `public` 메서드는 다른 클래스가 협력할 수 있는 공용 인터페이스로, 외부 객체가 접근할 수 있는 유일한 부분이다. 최대한 변화에 안정적인 인터페이스를 만들기 위해 인터페이스 구현과 관련된 세부 사항이 드러나지 않게 해야 한다.

구현 관점은 클래스의 내부 구현을 바라본다. 클래스의 메서드와 속성이 구현에 속하며, 메서드의 구현과 속성의 변경은 원칙적으로 외부의 객체에 영향을 미쳐서는 안 된다. 메서드와 속성은 철저하게 클래스 내부로 캡슐화돼야 한다.

하나의 클래스 안에는 개념 관점, 명세 관점, 구현 관점을 모두 포함해야 한다.

### 도메인 개념을 참조하는 이유

도메인 개념 안에서 적절한 객체를 선택하는 것은 도메인에 대한 지식을 기반으로 코드의 구조와 의미를 쉽게 유추할 수 있게 한다. 소프트웨어 클래스가 도메인 개념을 따르면 변화에 쉽게 대응할 수 있다.

### 인터페이스와 구현을 분리하라.

명세 관점과 구현 관점을 분리해야 한다. 명세 관점은 클래스의 안정적인 측면을 드러내고, 구현 관점은 클래스의 불안정한 측면을 드러내야 한다.

---

## 🎠 Discussion

- 행동이 아닌, 상태가 변경되었을 때 값을 변경시키고 싶은 경우에는 어떻게 할까?
  - getter/setter를 사용한다
- MVC에서 Model, View, Controller는 객체인가?
  - 객체는 협력 관점에서 중요하다.
  - 객체의 협력을 위한 객체도 있지만, Model-View-Controller와 같은 객체도 존재한다.
  - 사실 M-V-C들은 ‘레이어’에 가깝다

---

## 숙제

1. **객체 vs 개체?**

2. **객체의 범위**

3. 인터페이스 정리하기 - 인터페이스와 클래스 두 개가 함께 쓰이면 좋은 경우/ 어떤 경우에 어떤 문법을 사용해야 하는가

   ```tsx
   interface Customer {
     public void order(String menuName) {}
   }

   interface MenuItem {
   }

   interface Menu {
     public MenuItem choose(String name) {}
   }

   interface Barista {
     public Coffee makeCoffee(MenuItem menuItem) {}
   }

   interface Coffee {
     public Coffee(MenuItem menuItem) {}
   }
   ```

4. **본문에서 “왜 객체의 타입을 일반적으로 구현하는게 class다” 라고 말하고 있는가?**
