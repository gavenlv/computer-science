# F01 · 列表与字典：把一堆数据组织起来

> **课程**：F01 Python 第一行代码 · **模块**：5 列表与字典
> **课时 ID**：`F01.data.collections`
> **时长**：35 分钟正文 + 35 分钟实验
> **难度**：L0 / 2 星
> **先修**：变量、循环、函数
> **核心知识点**：list、tuple、dict、set、索引/切片、遍历、查找、别名与拷贝

> 这是 F01 的第三节课，接在「函数」之后：
> 函数处理数据，但真实世界的数据通常不是单个数字，而是一堆数据。

---

## 1. 本课问题：3 个联系人可以，100 个怎么办？

你要做一个通讯录。开始只有 3 个人：

```python
name1 = "小明"
phone1 = "13800000001"

name2 = "小红"
phone2 = "13900000002"

name3 = "小刚"
phone3 = "13700000003"
```

3 个人还能忍。100 个人呢？1000 个呢？
更麻烦的是：用户输入「小红」，你要**按名字查电话**。

如果你用 100 个变量，代码会变成一场灾难。
你需要一个**容器**：把一堆数据装在一起，并且能按位置或按名字取出来。

这一课只解决一个问题：

> **什么时候用列表，什么时候用字典？怎样组织数据，才能让「查得快、改得动」？**

学完这一课，你应该能：

- 用 list 保存有序数据，用索引/切片/遍历操作；
- 用 dict 保存「名字 → 电话」这种映射，做 O(1) 查找；
- 用 set 去重/判断存在；
- 解释「赋值是别名」「浅拷贝/深拷贝」；
- 根据任务选择 list / dict / set，而不是全都用 list。

---

## 2. 先猜一猜

下面这段代码输出什么？

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
```

- A. `[1, 2, 3]`
- B. `[1, 2, 3, 4]`
- C. 报错
- D. `[4]`

先选一个，再往下看。

<details>
<summary>答案与为什么</summary>

**B. `[1, 2, 3, 4]`。**

`b = a` 不是复制列表，而是让 `b` 和 `a` **指向同一个列表对象**。
所以通过 `b` 修改，`a` 也会看到。

如果想复制一份，应该用：

```python
b = a.copy()      # 浅拷贝
# 或
b = a[:]
```

这是 Python 新手最常踩的坑之一。
</details>

---

## 3. 直观模型：三种「容器」

### 3.1 列表（list）：一排带编号的格子

```
索引:   0     1     2     3
      ┌─────┬─────┬─────┬─────┐
      │ 小明 │ 小红 │ 小刚 │ 小美 │
      └─────┴─────┴─────┴─────┘
```

- 有序：有先后；
- 可变：可以追加、删除、修改；
- 按位置访问：`names[0]`、`names[-1]`；
- 适合：一堆同类数据、需要顺序、需要遍历。

### 3.2 字典（dict）：一张「键 → 值」的查表

```
键        值
"小明" → "13800000001"
"小红" → "13900000002"
"小刚" → "13700000003"
```

- 按 key 查找，不按位置；
- key 必须唯一、可哈希（字符串/数字/元组可以，list 不行）；
- 适合：映射关系、按名字/ID 查数据；
- 平均查找 `O(1)`。

### 3.3 集合（set）：只关心「有没有」

```
{"同学", "篮球", "吉他"}
```

- 无序；
- 自动去重；
- 判断 `x in s` 很快；
- 适合：去重、标签、集合运算（并/交/差）。

### 读图任务

看三种容器的图，回答：

- 想按「第 3 个人」取数据，用哪种？
- 想按「名字」查电话，用哪种？
- 想统计「有哪些不同的标签」，用哪种？

---

## 4. 拆解机制

### 4.1 列表：索引、切片、增删改

```python
names = ["小明", "小红", "小刚"]

print(names[0])     # 小明
print(names[-1])    # 小刚
print(names[0:2])   # ['小明', '小红']

names.append("小美")       # 末尾追加
names.insert(1, "小强")    # 插入到索引 1
names.remove("小刚")       # 按值删除
last = names.pop()         # 弹出末尾
names[0] = "明明"          # 修改
names.sort()               # 原地排序
```

> 索引从 0 开始；`-1` 是最后一个；切片 `[start:stop]` 左闭右开。

### 4.2 遍历：对每个元素做一件事

```python
for name in names:
    print(name)

for i, name in enumerate(names):
    print(i, name)
```

`enumerate` 同时给你「下标 + 值」，比手动维护 `i` 更清晰。

### 4.3 列表推导式：从旧列表生成新列表

```python
numbers = [1, 2, 3, 4, 5]
squares = [n * n for n in numbers]
evens = [n for n in numbers if n % 2 == 0]
```

列表推导式适合「一行能说清」的转换；太复杂就退回普通循环。

### 4.4 字典：增、查、改、删

```python
contacts = {}

contacts["小明"] = "13800000001"   # 增/改
contacts["小红"] = "13900000002"

print(contacts["小明"])             # 查；key 不存在会 KeyError
print(contacts.get("小刚"))         # 查；不存在返回 None
print(contacts.get("小刚", "未知")) # 自定义默认值

contacts["小明"] = "13800000009"   # 改
del contacts["小红"]                # 删

for name, phone in contacts.items():
    print(name, phone)
```

**规则**：

- `contacts[key]`：key 不存在 → `KeyError`；
- `contacts.get(key, default)`：key 不存在 → 返回默认值，不报错；
- `key in contacts`：判断 key 是否存在；
- `contacts.keys()` / `.values()` / `.items()`：遍历键/值/键值对。

### 4.5 用字典做「词频统计」

```python
text = "the quick brown fox jumps over the lazy dog the fox"
counts = {}

for word in text.split():
    counts[word] = counts.get(word, 0) + 1

print(counts)
# {'the': 3, 'quick': 1, 'brown': 1, 'fox': 2, ...}
```

`counts.get(word, 0)` 的意思是：如果 word 已经在字典里，取它的值；否则用 0。
这是「计数」的常用写法。

### 4.6 嵌套：列表里放字典，字典里放列表

通讯录常见结构：

```python
contacts = [
    {"name": "小明", "phone": "13800000001", "tags": {"同学", "篮球"}},
    {"name": "小红", "phone": "13900000002", "tags": {"同事"}},
]
```

按名字查找：

```python
def find_by_name(contacts, name):
    return [c for c in contacts if c["name"] == name]
```

如果经常按名字查，可以再建一个索引：

```python
by_name = {c["name"]: c for c in contacts}
print(by_name["小明"]["phone"])
```

**取舍**：

- list：保持顺序，插入/遍历方便；按名字查要遍历，`O(n)`；
- dict：按名字查 `O(1)`，但会多占内存，且 key 要唯一；
- 真实系统常常「两者都要」：list 存全量，dict 做索引。

### 4.7 别名与拷贝

```python
a = [1, 2, 3]
b = a          # 别名：同一个对象
b.append(4)
print(a)       # [1, 2, 3, 4]

c = a.copy()   # 浅拷贝：新列表，元素还是原来的引用
c.append(5)
print(a)       # [1, 2, 3, 4]
```

嵌套对象要注意「浅拷贝」：

```python
import copy

a = [{"name": "小明"}]
b = a.copy()
b[0]["name"] = "小红"
print(a[0]["name"])   # 小红（内层字典还是同一个）

c = copy.deepcopy(a)  # 深拷贝
c[0]["name"] = "小刚"
print(a[0]["name"])   # 小红
```

### 4.8 集合：去重与存在性

```python
tags = {"同学", "篮球", "同学"}   # 自动去重
print(tags)                       # {'同学', '篮球'}

print("同学" in tags)             # True，平均 O(1)

a = {"同学", "篮球"}
b = {"同事", "篮球"}
print(a & b)   # 交集 {'篮球'}
print(a | b)   # 并集 {'同学', '篮球', '同事'}
```

---

## 5. 形式化：选择容器的依据

| 需求 | 首选 | 平均复杂度 | 注意 |
| --- | --- | --- | --- |
| 保持顺序、按位置访问 | list | 索引 `O(1)`，查找 `O(n)` | 插入/删除中间元素 `O(n)` |
| 按 key 查找/更新 | dict | 查找/插入平均 `O(1)` | key 必须可哈希且唯一 |
| 去重/存在性 | set | 存在性平均 `O(1)` | 无序 |
| 不可变序列 | tuple | 索引 `O(1)` | 不能修改 |

**经验法则**：

- 需要顺序 → list；
- 需要「名字 → 值」→ dict；
- 需要「有没有」→ set；
- 需要「不能改」→ tuple。

**复杂度不是绝对的**：dict/set 的 `O(1)` 是平均情况，极端哈希冲突下会退化。
但在日常数据规模下，dict/set 通常远快于 list 的线性查找。

---

## 6. 动手实验

### 环境

浏览器 Python 沙箱优先；本地 Python 3.11+ 也可以。

### 实验 1：通讯录（dict）

```python
contacts = {
    "小明": "13800000001",
    "小红": "13900000002",
}

contacts["小刚"] = "13700000003"

print(contacts["小明"])
print(contacts.get("小美", "查无此人"))

for name, phone in contacts.items():
    print(f"{name}: {phone}")
```

**改一改**：

- 增加「删除联系人」；
- 增加「按电话反查名字」（需要再建一个 dict）；
- 统计联系人数量。

### 实验 2：词频统计（dict）

```python
text = """
the quick brown fox jumps over the lazy dog
the fox runs fast and the dog sleeps
"""

counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1

for word, count in sorted(counts.items(), key=lambda x: -x[1]):
    print(word, count)
```

**预期**：`the` 出现 3 次，`fox` 2 次，`dog` 2 次。

**改一改**：

- 忽略大小写；
- 去掉标点；
- 只输出出现次数 ≥ 2 的词。

### 实验 3：列表 + 字典（通讯录 v2）

```python
contacts = [
    {"name": "小明", "phone": "13800000001", "tags": {"同学", "篮球"}},
    {"name": "小红", "phone": "13900000002", "tags": {"同事"}},
    {"name": "小刚", "phone": "13700000003", "tags": {"同学"}},
]

def find_by_tag(contacts, tag):
    return [c["name"] for c in contacts if tag in c["tags"]]

print(find_by_tag(contacts, "同学"))   # ['小明', '小刚']
```

**改一改**：建立 `by_name` 索引，比较「按名字查」在 list 和 dict 中的代码/性能差异。

### 实验 4：去重（set）

```python
tags = ["同学", "篮球", "同学", "吉他", "篮球"]
unique = set(tags)
print(unique)
print(len(unique))
```

### 弄坏它

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)

# 以为 b 是副本，结果改坏了 a
```

再试：

```python
contacts = {"小明": "138"}
print(contacts["小美"])   # KeyError
```

**结论**：

- 赋值是别名，不是复制；
- `dict[key]` 不存在会 `KeyError`，用 `.get()` 更安全。

### 排查

| 现象 | 可能原因 |
| --- | --- |
| `IndexError` | 下标越界 |
| `KeyError` | dict 里没有这个 key |
| 改 `b` 影响 `a` | 赋值是别名 |
| 改了内层对象，外面也变 | 浅拷贝 |
| `TypeError: unhashable type: 'list'` | 用 list 当 dict key/set 元素 |

---

## 7. 失败案例：三个容器事故

### 事故 1：用 list 查 10 万联系人

```python
def find(contacts, name):
    for c in contacts:
        if c["name"] == name:
            return c
```

每次查找都要遍历整个列表，`O(n)`。
10 万联系人、每天查 1 万次，就是 10 亿次比较。

**修复**：建一个 `by_name` 字典，查找变 `O(1)`。

### 事故 2：赋值当复制

```python
original = [1, 2, 3]
backup = original
backup.append(4)
print(original)   # [1, 2, 3, 4] ← 备份也变了
```

**修复**：`backup = original.copy()`；嵌套对象用 `copy.deepcopy()`。

### 事故 3：用 list 当 dict 的 key

```python
d = {}
d[[1, 2]] = "x"   # TypeError: unhashable type: 'list'
```

**修复**：用 tuple `(1, 2)`，或把 list 转成字符串/自定义不可变对象。

---

## 8. 三个常见误区

1. **以为** `b = a` 是复制；
   **实际** 是别名，两个名字指向同一个对象；
   **因为** Python 的赋值绑定对象引用，不复制内容。

2. **以为** `dict[key]` 和 `dict.get(key)` 一样；
   **实际** 前者 key 不存在会 `KeyError`，后者返回 `None`/默认值；
   **因为** `get` 是「安全查询」。

3. **以为** 所有查找都是 `O(1)`；
   **实际** list 的 `in`/查找是 `O(n)`，dict/set 平均 `O(1)`；
   **因为** 底层结构不同（线性扫描 vs 哈希表）。

---

## 9. 检索练习

### Q1

```python
nums = [10, 20, 30]
print(nums[-1])
```

输出什么？

- A. `10`
- B. `20`
- C. `30`
- D. 报错

<details>
<summary>答案</summary>

**C. `30`。**
负索引从末尾开始，`-1` 是最后一个。
</details>

### Q2

按名字在 10 万联系人里查找，list 和 dict 哪个更合适？为什么？

<details>
<summary>答案</summary>

dict。按 key 查找平均 `O(1)`；list 需要遍历，`O(n)`。
代价是 dict 多占内存，且 key 要唯一。
</details>

### Q3

```python
a = [1, 2]
b = a
b.append(3)
print(a)
```

输出什么？如何避免？

<details>
<summary>答案</summary>

输出 `[1, 2, 3]`。
`b = a` 是别名。要复制用 `b = a.copy()` 或 `b = a[:]`。
</details>

### Q4

用 dict 统计词频，下面哪种写法正确？

- A. `counts[word] += 1`
- B. `counts[word] = counts.get(word, 0) + 1`
- C. `counts[word] = 1`
- D. `counts.append(word)`

<details>
<summary>答案</summary>

**B。**
`get(word, 0)` 在 key 不存在时返回 0，避免 `KeyError`。
A 在第一次遇到词时会报错；C 只记 1；D 是 list 的写法。
</details>

### Q5（迁移）

你要做一个「标签系统」：每个联系人可以有多个标签，需要支持：

- 给联系人加标签；
- 判断某个标签是否存在；
- 列出所有不同的标签；
- 按标签查联系人。

你会用哪些容器？为什么？

<details>
<summary>参考答案</summary>

- 每个联系人的标签：`set`（去重、存在性 `O(1)`）；
- 全部联系人：`list`（保持顺序）或 `dict`（按名字查）；
- 按标签查：`dict[tag] -> set(contacts)`（倒排索引）；
- 所有不同标签：`set` 的并集。

没有唯一答案，关键是能说出「为什么选它、代价是什么」。
</details>

---

## 10. 连接与延伸

### 上一课

函数：把一段能力打包，输入参数、返回结果。

### 下一课

文件与异常：把数据存到文件里，并处理「文件不存在/格式不对」。

### 真实系统

- 数据库表 ≈ list of dict / dict of dict；
- JSON ≈ dict + list 的嵌套；
- 缓存 ≈ dict（key → value）；
- 去重/标签 ≈ set；
- 全文索引 ≈ 倒排 dict。

### 延伸

- 读 Python 官方教程「Data Structures」；
- 思考：为什么 dict 的 key 必须可哈希？
- 下一站：用 `json` 把通讯录存成文件。

---

## 11. 图与交互 Spec（给可视化工程师）

### 主视觉：`DataStructureLab`

**布局**：

```
┌──────────────────────┬──────────────────────────────┬──────────────────────┐
│ 容器选择              │ 数据视图                      │ 操作 / 结果           │
│ [list] [dict] [set]  │ list: 一排格子                │ append / lookup       │
│                      │ dict: key → value 表          │ 命中/未命中           │
│                      │ set: 去重气泡                 │ 复杂度提示            │
└──────────────────────┴──────────────────────────────┴──────────────────────┘
```

**交互**：

- 选择任务：「按位置取」「按名字查」「去重」；
- 切换容器，观察操作步骤与复杂度；
- list 查找：逐格高亮，显示比较次数；
- dict 查找：显示哈希 → 桶 → 命中；
- set 去重：重复元素合并；
- 别名/拷贝演示：`b = a` vs `a.copy()`，修改 b 观察 a。

**教学点**：让「选容器」变成「看操作代价」，而不是背 API。

### 辅助图

1. list / dict / set 三种结构对比；
2. dict 哈希查找示意；
3. 浅拷贝 vs 深拷贝的内存图。

### 无障碍

- 命中/未命中配文字；
- 表格可横向滚动；
- 操作可键盘；
- 代码可复制。

---

## 12. 生产备注

| 项 | 内容 |
| --- | --- |
| 来源 | Python 官方教程（Data Structures）、CS61A 容器章节 |
| 组件 | `DataStructureLab`（可复用至数据库索引、缓存、倒排索引） |
| 资产 | 1 个主交互、3 张辅助图、1 个沙箱、1 个词频示例 |
| 工作量 | 4–5 人天 |
| 验收 | 5 名零基础用户中 ≥ 4 人能写 dict 通讯录；≥ 3 人能解释 list/dict 查找差异与别名 |
| 常见失败 | 下标越界；KeyError；赋值当复制；list 当 key |

---

## 13. 本课检查清单

- [x] 一个核心概念：按任务选择容器
- [x] 真实问题引入（100 个联系人）
- [x] 先猜一猜（别名）
- [x] 主视觉（DataStructureLab）
- [x] 分步机制（list/dict/set/嵌套/拷贝）
- [x] 可运行实验 + 改一改 + 弄坏它 + 排查
- [x] 三个失败案例
- [x] 三个误区
- [x] 5 道检索题 + 解析
- [x] 上一课/下一课/真实系统/延伸
- [x] 图/交互/无障碍/生产备注
