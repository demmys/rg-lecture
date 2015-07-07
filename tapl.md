class: title

# 型とプログラミング言語

Presented by demmy

---

## おしながき

1. プログラムの意味
    * 型はコンパイラのためにつける余計な情報などでは断じて無い
    * 型は人間のためにつけるもの
    * プログラムの意味をコンパイラに伝える手法としての型
    * 型とは(定理)
2. 型と式評価
    * 関数の型
    * 型は式の評価とは別に進行するもう1つの世界
    * 言語の安全性に関する議論
3. 基本的な型の使い方
    * C言語・Java言語における型の使い方とその違い
    * ポインタ・配列・構造体・共用体・列挙型・クラス・型の別名
    * 実際のプログラミング言語における安全性の議論
4. 型から見る関数型言語
    * 関数型を引数に取る関数(高階関数)
    * 変数に代入可能な関数(無名関数)
    * すべてを関数で表すことの自然さ(ラムダ計算)
5. 他の型の使い方
    * 総称型
    * 型クラス
6. 学んだことを活かそう
    * Cで関数ポインタを使おう
    * C++, Java8でラムダ式を使おう
    * JavaScript, Ruby, Python, PHP, Perlで高階関数を使おう
7. 型の限界
    * テストコードの重要性
    * 型で表現できないこと

. 型で表現できないこと

???

型のある言語を使ったことのない人?
(使ったことのない人が多いならこの後丁寧に話す)

CとJavaScript、どちらの方がより理解しやすいコードを書ける言語だと思うか?
(「書ける」というところがミソ)
(JavaScriptに手を挙げる人が多ければそのまま、Cに手を挙げる人が多ければ理由を聞く)

---

## 型の意義

```c
int a = 10; // CやC++, Objective-C, Java
```
```swift
let a: Int = 10 // Swift
```
```scala
val a: Int = 10 // Scala
```
```haskell
-- Haskell
a :: Int
a = 10
```

.margin-top-middle[
### 型を使う一番の理由はどれでしょう？
]

1. プログラマがある箇所でどんな構造の値を使うべきか知るため
2. コンパイラがより強力な最適化を行い実行速度やメモリ使用量を改善するため
3. コンパイラがある箇所で正しい値が使われていることを検証できるようにするため

---

## これは型?

.horizontal[
```c
struct Node {
    int data;
    struct Node *next;
};
```

```c
union NumericLiteral {
    long integralValue;
    double floatingPointValue;
};
```
]

.horizontal[
```c
enum AccessType {
    Public, Internal, Private
};
```

```c
typedef unsigned char byte;
```
]

.horizontal[
```java
class Mailer extends Thread {
    private Mail mail;
    public Mailer(Mail mail) {
        this.mail = mail
    }
    @Override
    public void run() {
        mail.send()
    }
}
```

```java
interface JsonSerializable {
    String toJson();
    void fromJson(String json);
}
```
]

---

## 型とは

#### 式や値を分類した集合の名称

.margin-top-middle[
型の別名(typedef)は独自定義の型を作る最も基本的な方法
]


.margin-top-middle[
列挙型(enum)は独自定義の値を持つ型を作る最も基本的な方法
]

```c
typedef char* Name;

enum Role {
    Faculty, Doctor, Master, Bachelar
};

bool addMember(Role r, Name n);
```

* コンパイラにNameは単なる`char *`とは異なる意味を持つことを示唆する
* コンパイラに`Faculty`や`Doctor`といった値は`Role`という分類上で共通の意味を持つことを示唆する

---

## 関数の型

```c
bool (*addMember)(Role r, Name n) 
```

---

## なにを意図したコードでしょう (3)

???

型付けのある言語でのコード例(java)
変数名は略称でなくちゃんと付ける
コンパイラにも分かることを示す
(実はコードには人為的なミスが有り、型をつけるとコンパイルエラーになる)

---

### コンパイラの内部

1. プログラムの構文を解析し抽象構文木(AST)を生成
2. **ASTでプログラムの意味を検証**
3. ASTから中間言語を生成
4. プログラムの最適化
5. 中間言語から機械語を生成

### プログラム意味論

コンピュータの実行結果を形式的(記号的)に表現する理論

---

## 型付のいろいろ
