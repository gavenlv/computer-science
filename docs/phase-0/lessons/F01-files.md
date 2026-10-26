# F01 · 文件与异常：让数据活过程序结束

> **课程**：F01 Python 第一行代码 · **模块**：6 文件与异常
> **课时 ID**：`F01.io.files`
> **时长**：35 分钟正文 + 35 分钟实验
> **难度**：L0 / 3 星
> **先修**：变量、循环、函数、列表与字典
> **核心知识点**：路径、打开模式、`with`、编码、CSV、JSON、`try/except`、异常类型

> 这是 F01 的第四节课，接在「列表与字典」之后：
> 数据不能只活在内存里，程序结束就没了；要存到文件，还要处理「文件不存在/格式不对」。

---

## 1. 本课问题：关掉程序，记账本就空了

你写了一个记账工具：输入几笔账，打印总和。
运行得很好。但关掉程序再打开，数据全没了。

因为变量只活在**内存**里，程序结束，内存就释放了。
要让数据「活过」程序结束，必须写到**文件**（或数据库）。

但文件不是总按你的想象工作：

- 文件可能不存在；
- 路径可能写错；
- 文件可能没有权限；
- 内容可能是乱的（JSON 格式错误、CSV 少一列）；
- 编码不对，中文会变乱码。

这一课只解决一个问题：

> **怎样安全地把数据存进文件、读回来，并在出错时给出可理解的提示？**

学完这一课，你应该能：

- 用 `with open(...)` 读写文本文件；
- 用 `csv` 读写表格，用 `json` 读写结构化数据；
- 用 `try/except` 捕获 `FileNotFoundError`、`JSONDecodeError` 等；
- 解释编码、覆盖/追加、`with` 的作用；
- 写一个「读入 → 处理 → 写出」的小数据管道。

---

## 2. 先猜一猜

下面代码运行会发生什么？

```python
with open("not-exist.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

- A. 返回空字符串
- B. 创建 `not-exist.txt`
- C. 抛出 `FileNotFoundError`
- D. 抛出 `PermissionError`

先选一个，再往下看。

<details>
<summary>答案与为什么</summary>

**C. `FileNotFoundError`。**

`"r"` 是只读模式，文件不存在就会报错。
如果希望「不存在就创建」，可以用 `"w"` 或 `"a"`，但那会覆盖/追加，要小心。

正确做法通常是先判断/捕获：

```python
from pathlib import Path

path = Path("not-exist.txt")
if path.exists():
    text = path.read_text(encoding="utf-8")
else:
    text = ""
```

或者：

```python
try:
    text = path.read_text(encoding="utf-8")
except FileNotFoundError:
    text = ""
```
</details>

---

## 3. 直观模型：文件是一块「外部存储」

```
程序内存                         磁盘文件
┌──────────────┐    write      ┌──────────────┐
│ list / dict  │ ───────────→  │ notes.txt    │
│ 变量          │               │ records.csv  │
│              │ ←───────────  │ data.json    │
└──────────────┘    read       └──────────────┘
```

- **写**：把内存里的数据序列化成字节，写到磁盘；
- **读**：从磁盘读字节，反序列化成 Python 对象；
- **路径**：文件在哪里；
- **编码**：字节怎样解释成文字（UTF-8 最常用）；
- **异常**：当磁盘/路径/格式不按预期时，程序怎样不崩。

`with open(...)` 是一层「安全网」：无论读写成功还是出错，都会帮你关闭文件。

---

## 4. 拆解机制

### 4.1 路径：先搞清楚文件在哪

```python
from pathlib import Path

p = Path("data") / "notes.txt"
print(p)            # data/notes.txt
print(p.exists())   # 是否存在
print(p.suffix)     # .txt
```

- 相对路径：相对于「当前工作目录」；
- 绝对路径：从盘符/根目录开始；
- 用 `pathlib.Path` 拼路径，比手写字符串更安全（跨平台）。

### 4.2 打开模式

| 模式 | 含义 | 文件不存在 | 会覆盖吗 |
| --- | --- | --- | --- |
| `"r"` | 只读 | 报错 | 不写 |
| `"w"` | 只写 | 创建 | **会清空** |
| `"a"` | 追加 | 创建 | 不覆盖，末尾追加 |
| `"x"` | 独占创建 | 报错 | 不覆盖 |
| `"rb"` / `"wb"` | 二进制 | 同上 | 同上 |

> 新手最常见事故：想追加，用了 `"w"`，把原文件清空了。

### 4.3 `with`：自动关闭

```python
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")
# 离开 with，文件自动关闭
```

不用 `with` 也可以，但要手动 `f.close()`；一旦中间抛异常，可能忘记关闭。
`with` 是上下文管理器，保证退出时关闭。

### 4.4 文本、CSV、JSON

**纯文本**：

```python
from pathlib import Path

Path("notes.txt").write_text("你好\n", encoding="utf-8")
text = Path("notes.txt").read_text(encoding="utf-8")
print(text)
```

**CSV**：

```python
import csv

rows = [
    {"date": "2026-10-01", "amount": 12.5},
    {"date": "2026-10-02", "amount": 3.8},
]

with open("records.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["date", "amount"])
    writer.writeheader()
    writer.writerows(rows)

with open("records.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["date"], row["amount"])
```

**JSON**：

```python
import json
from pathlib import Path

data = {"records": rows, "total": 16.3}
Path("records.json").write_text(
    json.dumps(data, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

loaded = json.loads(Path("records.json").read_text(encoding="utf-8"))
print(loaded["total"])
```

`ensure_ascii=False` 让中文不被转成 `\uXXXX`；`indent=2` 让 JSON 可读。

### 4.5 异常：给「出错」一个出口

```python
try:
    text = Path("missing.txt").read_text(encoding="utf-8")
except FileNotFoundError:
    print("文件不存在，先创建")
except PermissionError:
    print("没有权限")
except UnicodeDecodeError:
    print("编码不对")
```

- `try`：可能出错的代码；
- `except`：捕获特定异常；
- `else`：没出错时执行；
- `finally`：无论成败都执行（清理资源）。

**不要**：

```python
try:
    do_something()
except:
    pass
```

裸 `except` 会吞掉所有错误（包括键盘中断/编程错误），让你不知道发生了什么。
至少捕获具体异常，并记录/提示。

### 4.6 抛出异常：让错误早暴露

```python
def parse_amount(text):
    try:
        value = float(text)
    except ValueError as e:
        raise ValueError(f"金额格式不对: {text}") from e
    if value < 0:
        raise ValueError("金额不能为负")
    return value
```

- `raise` 主动抛出；
- `from e` 保留原始异常链；
- 早失败比「悄悄用错数据」好。

---

## 5. 形式化：文件操作的生命周期

```
open → read/write → close
```

`with` 等价于：

```python
f = open(...)
try:
    # read/write
finally:
    f.close()
```

异常层次（常见）：

```
BaseException
├── KeyboardInterrupt
├── SystemExit
└── Exception
    ├── OSError
    │   ├── FileNotFoundError
    │   ├── PermissionError
    │   └── ...
    ├── ValueError
    ├── UnicodeDecodeError
    └── json.JSONDecodeError（ValueError 子类）
```

捕获顺序：先具体，后宽泛；不要把 `Exception` 放在最前面。

---

## 6. 动手实验

### 环境

浏览器 Python 沙箱（支持文件系统模拟）优先；本地 Python 3.11+ 也可以。

### 实验 1：写/读文本

```python
from pathlib import Path

p = Path("notes.txt")
p.write_text("第一行\n第二行\n", encoding="utf-8")

print(p.read_text(encoding="utf-8"))
```

### 实验 2：追加，而不是覆盖

```python
from pathlib import Path

p = Path("log.txt")
p.write_text("start\n", encoding="utf-8")

with open(p, "a", encoding="utf-8") as f:
    f.write("event 1\n")
    f.write("event 2\n")

print(p.read_text(encoding="utf-8"))
```

**预期**：`start` 还在，后面追加了两行。
把 `"a"` 改成 `"w"` 再跑，观察 `start` 是否消失。

### 实验 3：CSV 读写

```python
import csv

rows = [
    {"date": "2026-10-01", "amount": 12.5},
    {"date": "2026-10-02", "amount": 3.8},
]

with open("records.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["date", "amount"])
    writer.writeheader()
    writer.writerows(rows)

total = 0.0
with open("records.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        total += float(row["amount"])

print(f"total={total:.2f}")
```

### 实验 4：JSON 读写

```python
import json
from pathlib import Path

data = {"records": rows, "total": total}
Path("records.json").write_text(
    json.dumps(data, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

loaded = json.loads(Path("records.json").read_text(encoding="utf-8"))
print(loaded["total"])
```

### 实验 5：处理错误

```python
from pathlib import Path
import json

try:
    text = Path("missing.json").read_text(encoding="utf-8")
    data = json.loads(text)
except FileNotFoundError:
    print("文件不存在，使用默认数据")
    data = {"records": [], "total": 0}
except json.JSONDecodeError as e:
    print("JSON 格式错误：", e)
    data = {"records": [], "total": 0}
```

### 改一改

1. 给记账本加「保存/加载」；
2. CSV 少一列时，捕获 `KeyError` 并提示；
3. 把 JSON 文件改成「一行一条记录」的 JSONL；
4. 写一个 `safe_read(path)` 函数，统一处理不存在/编码错误。

### 弄坏它

```python
from pathlib import Path
Path("bad.json").write_text("{not json", encoding="utf-8")
```

然后读它，观察 `JSONDecodeError`。
再试：

```python
Path("gbk.txt").write_bytes("中文".encode("gbk"))
Path("gbk.txt").read_text(encoding="utf-8")   # UnicodeDecodeError
```

### 排查

| 现象 | 可能原因 |
| --- | --- |
| `FileNotFoundError` | 路径/工作目录不对 |
| 中文乱码 | 写入/读取编码不一致 |
| 文件被清空 | 用了 `"w"` 而不是 `"a"` |
| `JSONDecodeError` | 内容不是合法 JSON |
| `KeyError` | CSV 缺列/字段名不对 |
| 权限错误 | 文件只读/在受保护目录 |

---

## 7. 失败案例：三个文件事故

### 事故 1：用 `"w"` 追加，清空了日志

```python
with open("app.log", "w", encoding="utf-8") as f:
    f.write("new event\n")
```

**错误的心智模型**：「打开文件就是接着写。」
**实际**：`"w"` 会清空文件。追加用 `"a"`。

### 事故 2：编码不一致，中文变乱码

```python
Path("a.txt").write_text("中文", encoding="gbk")
print(Path("a.txt").read_text(encoding="utf-8"))   # 乱码/报错
```

**错误的心智模型**：「文字就是文字，编码无所谓。」
**实际**：文件存的是字节；编码决定字节怎样解释成文字。
统一用 UTF-8，并在读写时显式写 `encoding="utf-8"`。

### 事故 3：裸 `except` 吞掉所有错误

```python
try:
    total = sum(load_amounts())
except:
    pass
```

**错误的心智模型**：「不报错就是没问题。」
**实际**：可能把数据错误、权限错误、编程 bug 全吞了，最后得到一个错误结果。
至少捕获具体异常，并记录日志/提示。

---

## 8. 三个常见误区

1. **以为** `"w"` 和 `"a"` 都是「写」；
   **实际** `"w"` 清空，`"a"` 追加；
   **因为** 打开模式决定了文件指针和截断行为。

2. **以为** 文件读写不需要管编码；
   **实际** 编码不一致会乱码/报错；
   **因为** 文件是字节，文字需要编码表解释。

3. **以为** 捕获所有异常更安全；
   **实际** 会隐藏真正的 bug；
   **因为** `except:` 连编程错误/键盘中断都吞掉。

---

## 9. 检索练习

### Q1

`with open(...) as f` 的主要好处是什么？

<details>
<summary>答案</summary>

离开 `with` 块时自动关闭文件，即使中间抛异常也会关闭。
避免忘记 `close()` 导致的资源泄漏/数据未刷盘。
</details>

### Q2

想在一个已有日志文件末尾追加内容，应该用哪个模式？

- A. `"r"`
- B. `"w"`
- C. `"a"`
- D. `"x"`

<details>
<summary>答案</summary>

**C. `"a"`。**
`"w"` 会清空；`"x"` 要求文件不存在；`"r"` 只读。
</details>

### Q3

读取一个不存在的文件，可能抛出什么异常？

<details>
<summary>答案</summary>

`FileNotFoundError`（`OSError` 的子类）。
可以用 `try/except FileNotFoundError` 捕获，或先 `Path.exists()` 判断。
</details>

### Q4

写入时用 UTF-8，读取时用 GBK，会发生什么？

<details>
<summary>答案</summary>

可能乱码，或抛 `UnicodeDecodeError`。
读写必须使用一致的编码；推荐统一 UTF-8。
</details>

### Q5（迁移）

写一个 `load_records(path)` 函数：

- 文件不存在 → 返回 `[]`；
- JSON 格式错误 → 返回 `[]` 并打印提示；
- 正常 → 返回列表。

<details>
<summary>参考答案</summary>

```python
import json
from pathlib import Path

def load_records(path):
    try:
        text = Path(path).read_text(encoding="utf-8")
        data = json.loads(text)
        if not isinstance(data, list):
            print("格式不是列表")
            return []
        return data
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as e:
        print("JSON 格式错误：", e)
        return []
```
</details>

---

## 10. 连接与延伸

### 上一课

列表与字典：把数据组织起来。

### 下一课

小项目：把变量、循环、函数、容器、文件串成一个 100–150 行的工具。

### 真实系统

- 配置文件：JSON/YAML/TOML；
- 日志：追加写 + 轮转；
- 数据管道：CSV/Parquet → 处理 → 数据库；
- Web：上传文件、读取请求体、写临时文件；
- 数据库：本质也是「持久化 + 查询 + 事务」。

### 延伸

- 读 Python 官方教程「Reading and Writing Files」；
- 了解 `pathlib`、`csv`、`json` 的更多用法；
- 思考：为什么配置文件常用 JSON/YAML，而不是 `.py`？

---

## 11. 图与交互 Spec（给可视化工程师）

### 主视觉：`FileSandbox`

**布局**：

```
┌──────────────┬──────────────────────────┬──────────────────────┐
│ 文件树        │ 代码 / 内容编辑器         │ 运行结果 / 异常       │
│ data/        │ with open(...) as f:     │ 成功：total=16.30     │
│  records.csv │     ...                  │ 失败：FileNotFound... │
│  records.json│                          │ 文件状态：已关闭       │
└──────────────┴──────────────────────────┴──────────────────────┘
```

**交互**：

- 新建/删除文件；
- 切换模式 `r/w/a`，观察文件内容变化；
- 切换编码 UTF-8/GBK，观察乱码；
- 制造 `FileNotFoundError`/`JSONDecodeError`，看异常路径；
- 单步显示 `open → read/write → close`；
- 显示「文件是否关闭」状态。

**教学点**：让「文件是外部存储」「with 会关闭」「异常是出口」可见。

### 辅助图

1. 内存 ↔ 文件的数据流；
2. `"w"` vs `"a"` 的文件指针/内容对比；
3. 异常层次图；
4. 编码错误示意。

### 无障碍

- 错误提示可读，不只有颜色；
- 文件树可键盘操作；
- 代码可复制；
- 表格可滚动。

---

## 12. 生产备注

| 项 | 内容 |
| --- | --- |
| 来源 | Python 官方教程（File I/O、Errors and Exceptions）、`csv`/`json` 文档 |
| 组件 | `FileSandbox`（可复用至日志、配置、数据管道） |
| 资产 | 1 个主交互、3 张辅助图、1 个沙箱、1 个 CSV/JSON 示例 |
| 工作量 | 4–5 人天 |
| 验收 | 5 名零基础用户中 ≥ 4 人能读写文本/JSON；≥ 3 人能解释 `"w"`/`"a"`、编码、异常捕获 |
| 常见失败 | 覆盖文件；编码不一致；裸 except；路径不对 |

---

## 13. 本课检查清单

- [x] 一个核心概念：持久化 + 错误处理
- [x] 真实问题引入（程序关了数据没了）
- [x] 先猜一猜（文件不存在）
- [x] 主视觉（FileSandbox）
- [x] 分步机制（路径/模式/with/CSV/JSON/异常）
- [x] 可运行实验 + 改一改 + 弄坏它 + 排查
- [x] 三个失败案例
- [x] 三个误区
- [x] 5 道检索题 + 解析
- [x] 上一课/下一课/真实系统/延伸
- [x] 图/交互/无障碍/生产备注
