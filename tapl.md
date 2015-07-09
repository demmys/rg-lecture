class: title

# 型と関数型言語

Presented by demmy

---

## おしながき

.margin-left-large[
1. 本日の目的

2. 「型」という考え方
    * 型の定義

3. 関数型言語を型から見直す
    * カリー化
    * 型クラス
    * 副作用
    * モナド

4. 関数型言語の知見を命令形へ
    * 高階関数
    * 総称型

5. おまけ
]

???

1. 今回の趣旨

2. 「型」という考え方
    * 型とはなにか
    * 型の世界と値の世界

3. 関数型言語を型から見直す
    * すべてを関数として捉える
    * カリー化
    * 型の集合
    * 副作用はなぜ嫌われるか
    * 未定義値の扱い

4. 関数型言語の知見を命令形へ
    * 高階関数の活用
    * Java8: Optionalの活用
    * 総称型の活用
    * Swiftの素晴らしさ

5. おまけ
    * 型で表現できないこと
    * テストコードの重要性

---

## 本日の目的

.margin-top-large[
#### 型を通して関数型言語を理解し普段のプログラミングに活かす
]

.margin-top-large.margin-left-middle[
1. 型について今一度見直す
2. 型を知ると関数型言語が理解しやすくなる
3. 型を中心に考えると関数型言語の知見を自然に命令形へ持ち込める
]

.margin-top-large.font-small.right[
裏テーマ：Swiftのすごさを知る
]

---

class: title

# 「型」という考え方

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

???

型を持つ言語で数値型の変数を定義する方法を並べてみた

こんな感じで使う型だが、みんなは何のために使ってると思うか

1つづつ解説してからどれだと思うか聞く

1~3全部型の役割ではある

ただ、3が一番大きな役割

コンパイラのためではなく人間のために型はある

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

???

1つづつ意味を解説しながら挙手してもらう

全て型

こういう構文をあまり使わない人は型をうまく使えていない人かも

---

## 型とは

#### 式や値を分類した集合の名称

.margin-top-middle[
* 型の別名(typedef)は独自定義の型を作る最も基本的な方法
* 列挙型(enum)は独自定義の値を持つ型を作る最も基本的な方法
]

.animate[
.horizontal[
```c
bool addMember(int r, char *n);
```

```c
typedef char* Name;

enum Role {
    Faculty, Doctor, Master, Bachelor
};

bool addMember(enum Role r, Name n);
```
]

* `Name`は単なる`char *`とは異なる意味を持つことを示唆する
* `Faculty`や`Doctor`といった値は`Role`という分類上で共通の意味を持つことを示唆する
]

???

結局型は式や値を分類してできた集合の名前

さっきの例で言うとtypedefやenumが最も基本的な独自定義の型の作り方

[animate]

左のように書くよりも右のほうが多くを語ってることは歴然

---

## 関数の型

```c
int atoi(const char *str);
```

.animate[
.image-middle.center[
![写像](img/function.png)
]

#### 関数はある型からある型への写像と見ることができる
]

???

型は集合だと説明したが、ではこんな関数は集合論の考え方だとどう言えるか
(当てて聞く)

char*型をint型に変換している

[animate]

集合論の考え方だと写像だといえる

---

## 型と値の分離

```c
// 型Roleの要素を格納する変数r。値はFaculty
enum Role r = Faculty;
// 型char*の要素を型intの要素に写像する関数f。値はatoi
int (*f)(char *) = atoi;
```

.margin-top-middle[
* C言語では型と値が入り交じっている
* C言語の関数はその値の定義方法から型の表記を考えている
* 型はコンパイル時にチェックされるが、値は実行時に処理されるもの
]

.animate.margin-top-middle[
```haskell
r :: Role -- 型
r = Faculty -- 値

f :: String -> Int -- 型
f = atoi -- 値
```
]

???

型が集合、関数が写像だと考えると、C言語がいかに型を中心に考えられていないかがわかる

型と値が入り交じっているのがC言語の悪いところ

そもそも型と値は必要になるタイミングが違うので、分けて書くことは自然なはず

[animate]

そこで、こう書いてみる

関数の型も写像だということが分かりやすいように矢印で表す

これはもうHaskellの構文

---

## Haskellにおける型宣言

```c
typedef char* Name;

enum Role {
    Faculty, Doctor, Master, Bachelor
};
```

.margin-top-middle[
* 列挙型は本質的には整数型であり、新しい型の宣言としての性質が弱い
]

.animate.margin-top-middle[
```haskell
type Name = String

data Role = Faculty | Doctor | Master | Bachelor
```
]

???

先にtypedefとenumが基本的な型宣言の方法だと話した

しかし、違和感を持った人も多いはず

その原因はC言語が型を中心に考えられていないから

[animate]

Haskellでは明確にtypedefおよびenumに対応する構文が用意されている

---

class: title

# 関数型言語を型から見直す

???

こんな風に型を中心に考えると、Haskellの構文の自然さがわかってくる

Haskellは関数型言語なので、結局Haskellの構文を知ることは関数型言語の考え方の基本を知ることに繋がる

---

## 全てを関数として捉える

```haskell
main = print (increment base) -- 11

base :: Int
base = 10

increment :: Int -> Int
increment x = x + 1
```

* 定数は引数を取らない関数と捉えられる
.right.font-small[
[code result](http://codepad.org/RCXASdss)
]

.animate[
```haskell
main = print (toString padZero) -- "010"

padZero :: String -> String
padZero num = "0" ++ num

toString :: (String -> String) -> String
toString fix = fix (show base)
```

* 定数が関数なのだから、当然関数を引数として取れる
.right.font-small[
[code result](http://codepad.org/DAKZYBGb)
]
]

???

面白いところに入る前に、Haskellでの関数の書き方を見ていく

型と値を分離したHaskellの書き方だと、値と関数の定義の仕方に大差がないことが分かる

定数は引数を持たない関数と見れる

[animate]

定数が関数なのだから、勿論関数を引数に渡せる

---

## 複数の引数を取る関数

```haskell
range :: (Int, Int) -> [Int]
range (a, b) = [a] ++ if a < b then range ((a + 1), b) else []
```
* C言語などでお馴染みの表記は値の組(タプル)を渡していると捉えられる
.right.font-small[
[code result](http://codepad.org/1sv5KbKr)
]

```haskell
range :: Int -> (Int -> [Int])
range a = range'
    where
        range' :: Int -> [Int]
        range' b = [a] ++ if a < b then range (a + 1) b else []
```

* 関数を返す関数として実装しても同じことができる
.right.font-small[
[code result](http://codepad.org/XsOt2Iqf)
]

.animate[
```haskell
range :: Int -> Int -> [Int]
range a b = [a] ++ if a < b then range (a + 1) b else []
```
* Haskellの型は右結合
* タプルではなく1つづつ引数を渡す形にすることを「カリー化する」という
.right.font-small[
[code result](http://codepad.org/14zkf1fu)
]
]

???

複数の引数を取る関数の書き方は2つ考えられる

まずはおなじみの書き方

次に、こういう考え方もできそう

[animate]

実際には2つ目を使う

これがカリー化

---

## 型のグループに対して定義された関数

```haskell
1 + 1 -- 2
3.14 + 2.72 -- 5.86
```

.animate[
```haskell
(+) :: Num a => a -> a -> a
```
]

.animate[
#### `Num`のような型のグループは「型クラス」と呼ばれる

.horizontal[
```haskell
class Num a where
  (+) :: a -> a -> a
  (-) :: a -> a -> a
  (*) :: a -> a -> a
  negate :: a -> a
  abs :: a -> a
  signum :: a -> a
  fromInteger :: Integer -> a
```

```java
interface Number {
    Number add(Number n);
    Number sub(Number n);
    Number mul(Number n);
    Number negate();
    Number abs();
    Number signum();
    static Number fromInteger(int i);
}
```
]
]
.right.font-small[
[code result](http://codepad.org/xPp7IKqS)
]

???

(+)は色々な型に対して使える

[animate]

型を見るとこうなってる

こういうふうに、型をグループ化して特定の関数の実装を要求することができる

[animate]

これが型クラス

ここは後々重要になるので、手を動かして実際にShowクラスのインスタンスを作ってみる

具体的なインスタンスの作り方は実際に書いてみせる

---

## 値を持つ型

```c
struct Member {
    int id;
    char *name;
};
```

```haskell
data Member = Member Int String

main = print (memberName (Member 1 "John Lennon")) -- "John Lennon"

memberName :: Member -> String
memberName (Member id name) = name
```
.right.font-small[
[code result](http://codepad.org/fy5m795W)
]

* 独自定義の値には任意の値を結び付けられる
* 結び付けられる値はパターンマッチで取り出せる

```haskell
data List a = Nil | Cons a List
```

* 任意の型を取る型変数を使うこともできる

???

Cの構造体やJavaのクラスのように値を持てる構文を説明していなかった

実は、型の値はそれぞれが関連付けられた値(フィールド)を持てる

あとで詳しく話すが、型変数は総称型と同じだと思ってもらっていい

---

## 未定義値の取り扱い

.horizontal[
```c
char *a = NULL;
```

```java
String a = null;
```
]

* NULLやnullは型ではないため、値レベルでしか未定義値を取り扱えない

```haskell
data Maybe a = Nothing | Just a

maybe :: b -> (a -> b) -> Maybe a -> b
--       ^ Nothingの場合の値
--            ^ Justの場合に適用する関数
--                        ^ 検査する対象
```

* Maybeでくるまれた値は存在しないという可能性を型レベルで明示

```haskell
x = Just 10

main = maybe (print "未定義") print x
```
.right.font-small[
[code result](http://codepad.org/zW37OYNf)
]

???

このフィールドを持った型を使うと未定義値を取り扱える

nullポインタは全ての参照型に代入できてしまうので危険

型レベルでも参照がない可能性のあることを表すべき

---

## Maybeモナド

#### 「あるかどうかわからない値」は「あるかどうかわからないまま」<br>処理する

```haskell
fmap (+ 1) (Just 10) -- Just 11
fmap (+ 1) Nothing   -- Nothing
```

```haskell
data Member = Member Int String

main = mapM_ print (fmap memberName (findMember beatles 3))

beatles = [Member 0 "John Lennon", Member 1 "Paul McCartney", Member 2 "George Harrison", Member 3 "Ringo Starr" ]

memberId (Member id _) = id
memberName (Member _ name) = name

findMember :: [Member] -> Int -> Maybe Member
findMember [] _ = Nothing
findMember (m:ms) id = if memberId m == id then Just m else findMember ms id
```

???

さっきのだけではわざわざ値をくるんでも扱いを複雑化するだけに見える

fmapなどの関数を使うとMaybeから出さずに値を加工できる

下の具体的な例については時間があれば説明する程度で

---

## モナド

.horizontal[
```haskell
class Applicative m => Monad (m :: * -> *) where
    (>>=) :: m a -> (a -> m b) -> m b
    (>>) :: m a -> m b -> m b
    return :: a -> m a
    fail :: String -> m a
```

```haskell
instance Monad Maybe where  
    return x = Just x  
    Nothing >>= f = Nothing  
    Just x >>= f  = f x  
    fail _ = Nothing  
```
]

* `m`がフィールドを持つ型として定義されている
* `(>>=)`や`(>>)`で計算を連鎖する
* `return`および`fail`で値を包み込む

#### モナドはMaybeのように値をラップしたまま計算を進める方法を<br>一般化したもの

---

.animate[
## 副作用
]

```c
bool addMember(Role r, Name n);
```

```haskell
addMember :: Role -> Name -> Bool
```

.center[
上記2つの宣言の決定的な違いはなにか？
]

.animate[
#### 純粋でない言語では型情報に含まれない副作用が存在しうる

.center.image-small[
![副作用](img/side_effect.png)
]
]

---

## IOモナド

```haskell
print :: Show a => a -> IO ()

getLine :: IO String

(>>=) :: IO a -> (a -> IO b) -> IO b

main = getLine >>= print
```

#### 副作用処理をモナドにラップすることで分離

```c
void getLine(void (*print)(const char *str)) {
    char *line = /* 文字列取得処理 */;
}

void main() {
    getLine(puts);
}
```

* bindは副作用の結果を受け取るコールバックを渡すようなもの

---

class: title

# 関数型言語の知見を命令形へ

---

## 高階関数の活用

---

## Java8のOptional

---

## 総称型の活用

---

## Swiftの素晴らしさ

```swift
enum Member {
    func print() {
    }
}
```

---

class: title

# おまけ

---

## 型で表現できないこと

---

## テストコードの重要性
