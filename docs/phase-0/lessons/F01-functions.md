# F01 · 函数：把一段能力打包

> **课程**：F01 Python 第一行代码 · **模块**：4 函数
> **课时 ID**：`F01.functions.basics`
> **时长**：30 分钟正文 + 30 分钟实验
> **难度**：L0 / 2 星
> **先修**：变量、条件、循环
> **核心知识点**：`def`、参数、返回值、作用域、组合、纯函数/副作用

> 这是 F01 的第二节课，接在「循环」之后：
> 循环让程序重复，函数让程序**复用**。

---

## 1. 本课问题：同样的代码，为什么要写三遍？

你在写一个记账工具，需要把金额从「元」换算成「分」：

```python
price1 = 12.5
cents1 = int(price1 * 100)

price2 = 3.8
cents2 = int(price2 * 100)

price3 = 99.9
cents3 = int(price3 * 100)
```

三行代码长得几乎一样。如果哪天规则变了（比如四舍五入、加税、换币种），
你要改三个地方，漏一个就出错。

程序员把这种「重复的逻辑」打包成一个**函数**：

```python
def yuan_to_cents(yuan):
    return int(yuan * 100)

cents1 = yuan_to_cents(12.5)
cents2 = yuan_to_cents(3.8)
cents3 = yuan_to_cents(99.9)
```

这一课只解决一个问题：

> **怎样把一段逻辑打包成「可以反复调用、输入不同、输出不同」的能力？**

学完这一课，你应该能：

- 定义函数、传参数、拿返回值；
- 分清 `print` 和 `return`；
- 解释局部变量、作用域和调用栈；
- 把一段重复代码重构成函数，并写测试。

---

## 2. 先猜一猜

下面这个函数被调用后，`result` 是什么？

```python
def add(a, b):
    print(a + b)

result = add(2, 3)
print(result)
```

- A. `5`
- B. `None`
- C. 报错
- D. `2 3`

先选一个，再往下看。

<details>
<summary>答案与为什么</summary>

**B. `None`。**

`add` 里只有 `print(a + b)`，没有 `return`。
Python 的函数如果没有 `return`，默认返回 `None`。

屏幕上会先看到 `5`（函数里的 print），再看到 `None`（外面的 print）。
这就是「打印」和「返回」的区别：

- `print` 是**给别人看**；
- `return` 是**给程序用**。
</details>

---

## 3. 直观模型：一台「函数机器」

把函数想成一台机器：

```
输入（参数） →  ┌─────────────┐  → 输出（返回值）
                 │  函数体      │
                 │  return ... │
                 └─────────────┘
```

- **参数**：机器入口，告诉它这次处理什么；
- **函数体**：机器内部，怎么做；
- **返回值**：机器出口，把结果交给调用者；
- **副作用**：机器除了返回结果，还改了外部世界（打印、写文件、改全局变量）。

### 3.1 调用栈：函数可以调用函数

```python
def a():
    b()

def b():
    c()

def c():
    print("到了")
```

调用 `a()` 时，Python 会维护一个「调用栈」：

```
a() → b() → c()
```

`c` 先返回，`b` 再返回，`a` 最后返回。
如果 `c` 里出错，你会看到一条「调用栈」——它告诉你「谁调用了谁」。

### 读图任务

看「函数机器」图，回答：

- 参数和返回值分别在机器的哪一侧？
- 如果机器只打印、不返回，调用者能拿到什么？
- 如果 `b()` 里又调用 `a()`，会发生什么？

---

## 4. 拆解机制

### 4.1 定义与调用

```python
def greet(name):
    return f"你好，{name}！"

message = greet("小明")
print(message)   # 你好，小明！
```

- `def` 定义函数；
- `name` 是参数；
- `return` 把结果交出去；
- `greet("小明")` 是调用。

### 4.2 参数：位置、关键字、默认值

```python
def introduce(name, age, city="北京"):
    return f"{name}，{age} 岁，来自{city}"

introduce("小明", 18)                  # 位置参数
introduce(age=18, name="小明")          # 关键字参数
introduce("小明", 18, city="上海")      # 覆盖默认值
```

默认值适合「大多数情况都一样」的参数。
但默认值只在函数定义时计算一次，**不要用可变对象做默认值**（见失败案例）。

### 4.3 返回值：可以返回任何东西

```python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5])
print(low, high)   # 1 5
```

Python 的 `return a, b` 实际返回一个元组 `(a, b)`，可以用解包接收。

### 4.4 作用域：函数内部的变量，外面看不见

```python
def f():
    x = 1
    return x

print(f())   # 1
print(x)     # NameError: name 'x' is not defined
```

- `x` 是局部变量，只在函数内部存在；
- 函数内部可以读外部变量，但**修改**外部变量需要 `global`/`nonlocal`（不推荐滥用）；
- 参数也是局部变量。

### 4.5 组合：小函数拼成大能力

```python
def yuan_to_cents(yuan):
    return int(round(yuan * 100))

def apply_tax(cents, rate=0.06):
    return int(round(cents * (1 + rate)))

total_cents = apply_tax(yuan_to_cents(99.9))
print(total_cents)
```

每个函数只做一件事，组合起来就能表达复杂逻辑。
这比写一个大函数更容易测试、复用和修改。

### 4.6 纯函数与副作用

| 类型 | 特点 | 例子 |
| --- | --- | --- |
| 纯函数 | 同样输入 → 同样输出；不改外部状态 | `yuan_to_cents` |
| 有副作用 | 打印、写文件、改全局、发网络请求 | `print`、`save_file` |

纯函数更容易测试；副作用不可避免，但要**集中管理**，不要散落在到处。

---

## 5. 形式化：签名、组合与复杂度

函数签名：

```
函数名(参数1, 参数2, ...) -> 返回值类型
```

例子：

```
yuan_to_cents(yuan: float) -> int
```

**组合**：

```
h(x) = f(g(x))
```

先算 `g(x)`，把结果传给 `f`。这就是「小函数拼大能力」。

**复杂度**：函数本身不决定复杂度，函数体里的算法才决定。
`yuan_to_cents` 是 `O(1)`；`sum_list` 是 `O(n)`；`factorial(n)` 是 `O(n)`（递归版）。

**递归**（预告）：

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
```

递归就是「函数调用自己」，必须有基线条件，否则会栈溢出。下一课会展开。

---

## 6. 动手实验

### 环境

浏览器 Python 沙箱优先；本地 Python 3.11+ 也可以。

### 实验 1：温度转换

```python
def celsius_to_fahrenheit(c):
    return c * 9 / 5 + 32

print(celsius_to_fahrenheit(0))     # 32.0
print(celsius_to_fahrenheit(100))   # 212.0
print(celsius_to_fahrenheit(-40))   # -40.0
```

### 实验 2：BMI 计算器

```python
def bmi(weight_kg, height_m):
    if height_m <= 0:
        raise ValueError("身高必须大于 0")
    return weight_kg / (height_m ** 2)

print(round(bmi(70, 1.75), 1))   # 22.9
```

**改一改**：加一个 `category(bmi_value)` 函数，返回「偏瘦/正常/超重/肥胖」。

### 实验 3：把重复代码重构成函数

先写三遍：

```python
price1 = 12.5
cents1 = int(price1 * 100)
price2 = 3.8
cents2 = int(price2 * 100)
price3 = 99.9
cents3 = int(price3 * 100)
```

再重构成：

```python
def yuan_to_cents(yuan):
    return int(round(yuan * 100))

prices = [12.5, 3.8, 99.9]
cents = [yuan_to_cents(p) for p in prices]
print(cents)
```

**思考**：重构后，如果规则改成「四舍五入」，要改几个地方？

### 实验 4：组合函数

```python
def yuan_to_cents(yuan):
    return int(round(yuan * 100))

def apply_tax(cents, rate=0.06):
    return int(round(cents * (1 + rate)))

def format_cents(cents):
    return f"¥{cents / 100:.2f}"

total = format_cents(apply_tax(yuan_to_cents(99.9)))
print(total)   # ¥105.89（按四舍五入）
```

### 实验 5：调用栈

```python
def a():
    b()

def b():
    c()

def c():
    raise RuntimeError("在 c 里出错")

a()
```

**预期**：报错信息里能看到 `a → b → c` 的调用栈。
学会读调用栈，是调试函数的关键。

### 弄坏它

```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))
print(add_item("b"))
```

**预期**：第二次输出会包含 `a`，因为默认列表在函数定义时只创建一次。
正确写法：

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### 排查

| 现象 | 可能原因 |
| --- | --- |
| 调用后得到 `None` | 忘记 `return`，或 `return` 在错误分支 |
| 外面访问变量报 `NameError` | 局部变量作用域 |
| 默认参数“记住了”上次的值 | 可变默认参数 |
| 参数顺序错 | 位置参数/关键字参数混用 |
| 递归报 `RecursionError` | 缺少基线条件/递归太深 |

---

## 7. 失败案例：三个函数事故

### 事故 1：只打印，不返回

```python
def add(a, b):
    print(a + b)

result = add(2, 3) + 1   # TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'
```

**错误的心智模型**：「屏幕上看到了 5，函数就返回了 5。」
**实际**：`print` 只是输出，函数返回 `None`。

### 事故 2：可变默认参数

```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))   # ['a']
print(add_item("b"))   # ['a', 'b'] ← 不是 ['b']
```

**错误的心智模型**：「每次调用都会新建一个空列表。」
**实际**：默认值只在定义时创建一次，之后共享。

### 事故 3：作用域混淆

```python
x = 10

def f():
    x = 20
    return x

print(f())   # 20
print(x)     # 10
```

函数里的 `x = 20` 创建了一个新的局部变量，不会修改外面的 `x`。
如果确实要改，用 `global x`（但通常应该用返回值，而不是改全局）。

---

## 8. 三个常见误区

1. **以为** `print` 就是 `return`；
   **实际** `print` 输出到屏幕，`return` 把值交给调用者；
   **因为** 函数没有 `return` 时默认返回 `None`。

2. **以为** 参数名必须和外部变量名一样；
   **实际** 参数是局部名字，调用时按位置/关键字绑定；
   **因为** 函数只关心「传进来的值」，不关心外部变量叫什么。

3. **以为** 函数越长越厉害；
   **实际** 小函数更容易测试、复用、组合；
   **因为** 一个函数只做一件事，出错时更容易定位。

---

## 9. 检索练习

### Q1

```python
def f(x):
    x * 2

result = f(3)
print(result)
```

输出什么？

- A. `6`
- B. `None`
- C. `3`
- D. 报错

<details>
<summary>答案</summary>

**B. `None`。**
函数体里只有表达式 `x * 2`，没有 `return`，所以返回 `None`。
</details>

### Q2

`print` 和 `return` 的区别是什么？

<details>
<summary>答案</summary>

`print` 把内容输出到屏幕，是给「人」看的；
`return` 把值交给调用者，是给「程序」用的。
函数没有 `return` 时返回 `None`。
</details>

### Q3

下面代码第二次调用 `add_item("b")` 输出什么？为什么？

```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))
print(add_item("b"))
```

<details>
<summary>答案</summary>

输出 `['a']`，然后 `['a', 'b']`。
因为默认参数 `items=[]` 只在函数定义时创建一次，两次调用共享同一个列表。
正确写法：`items=None`，在函数体内新建列表。
</details>

### Q4

```python
x = 10

def f():
    x = 20
    return x

print(f())
print(x)
```

输出什么？

<details>
<summary>答案</summary>

`20` 和 `10`。
函数里的 `x = 20` 是局部变量，不影响外部的 `x`。
</details>

### Q5（迁移）

把下面三段重复代码重构成一个函数，并说明重构后改规则要改几处：

```python
a = int(12.5 * 100)
b = int(3.8 * 100)
c = int(99.9 * 100)
```

<details>
<summary>参考答案</summary>

```python
def yuan_to_cents(yuan):
    return int(round(yuan * 100))

a = yuan_to_cents(12.5)
b = yuan_to_cents(3.8)
c = yuan_to_cents(99.9)
```

规则只写在一处；以后改成四舍五入/加税，只改函数体。
</details>

---

## 10. 连接与延伸

### 上一课

循环：让程序重复做同一件事。

### 下一课

列表与字典：函数处理的数据，通常不是单个数字，而是一组数据。

### 真实系统

- 标准库就是一堆函数/类：`len()`、`sum()`、`json.dumps()`；
- Web 框架：每个 URL 对应一个处理函数；
- 数据处理：`clean()`、`transform()`、`aggregate()` 组合成管道；
- 测试：每个函数都可以单独测试。

### 延伸

- 读 Python 官方教程「Defining Functions」；
- 思考：为什么 `sorted(key=...)` 接收一个函数？
- 下一站：递归（函数调用自己）。

---

## 11. 图与交互 Spec（给可视化工程师）

### 主视觉：`FunctionMachine`

**布局**：

```
┌──────────────┬──────────────────────────┬──────────────┐
│ 输入/参数     │ 函数体（逐行高亮）        │ 输出/返回值   │
│ a = 2        │ def add(a, b):           │ 5            │
│ b = 3        │     return a + b          │              │
└──────────────┴──────────────────────────┴──────────────┘
```

**交互**：

- 输入参数，点击「运行」；
- 单步执行函数体，高亮当前行；
- 显示局部变量表；
- 切换「print vs return」：看输出区与返回值区的区别；
- 切换「可变默认参数」：第二次调用看到列表被复用；
- 调用栈视图：`a → b → c` 逐层展开/收起。

**教学点**：把「函数」从语法变成「输入 → 处理 → 输出」的机器，并让「print/return」「作用域」「默认参数」可见。

### 辅助图

1. 调用栈示意；
2. 纯函数 vs 副作用对比；
3. 组合 `h(x)=f(g(x))` 的数据流图。

### 无障碍

- 变量表变化有文字说明；
- 单步支持键盘；
- 颜色不唯一依赖；
- 代码可复制。

---

## 12. 生产备注

| 项 | 内容 |
| --- | --- |
| 来源 | Python 官方教程（Defining Functions）、CS61A 函数章节 |
| 组件 | `FunctionMachine`（可复用至递归、调用栈、闭包） |
| 资产 | 1 个主交互、2 张辅助图、1 个沙箱、1 个调用栈截图 |
| 工作量 | 3–4 人天 |
| 验收 | 5 名零基础用户中 ≥ 4 人能写 2 个参数函数并正确 return；≥ 3 人能解释 print/return 与作用域 |
| 常见失败 | 忘记 return；可变默认参数；局部/全局混淆 |

---

## 13. 本课检查清单

- [x] 一个核心概念：函数是「输入→处理→输出」的复用单元
- [x] 真实问题引入（重复代码）
- [x] 先猜一猜（print vs return）
- [x] 主视觉（函数机器 + 调用栈）
- [x] 分步机制（参数/返回/作用域/组合）
- [x] 可运行实验 + 改一改 + 弄坏它 + 排查
- [x] 三个失败案例
- [x] 三个误区
- [x] 5 道检索题 + 解析
- [x] 上一课/下一课/真实系统/延伸
- [x] 图/交互/无障碍/生产备注
