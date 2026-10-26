# F01 · 小项目：命令行记账本

> **课程**：F01 Python 第一行代码 · **模块**：7 小项目
> **课时 ID**：`F01.project.cli-ledger`
> **时长**：40 分钟正文 + 90 分钟项目
> **难度**：L0 / 3 星
> **先修**：变量、循环、函数、列表与字典、文件与异常
> **核心知识点**：需求拆解、数据模型、分层、持久化、输入校验、测试

> 这是 F01 的收口项目：把前四节学的东西串成一个**真能用**的工具。
> 不追求功能多，追求「能运行、能保存、能报错、能讲清」。

---

## 1. 本课问题：学了这么多，能不能做一个真东西？

你已经学了变量、条件、循环、函数、列表/字典、文件/异常。
但它们像一堆零件，散落在脑子里。

这一节把它们装成一台机器：**命令行记账本**。

需求（v1）：

```
1. 记一笔账：金额、分类、备注
2. 列出所有账目
3. 汇总：总计 + 按分类小计
4. 数据保存到文件，下次打开还在
5. 输入错误时，给出提示，不崩溃
6. 输入 quit 退出
```

看起来简单，但它包含了真实软件的五个核心问题：

- 数据怎么表示？
- 逻辑怎么分层？
- 数据怎么持久化？
- 用户输入错了怎么办？
- 怎么证明它没坏？

这一课只解决一个问题：

> **怎样从「会写语法」走到「能交付一个小工具」？**

---

## 2. 先猜一猜

开始写之前，先写哪一层？

- A. 先写 CLI 输入循环，边写边想数据怎么存
- B. 先定数据模型 + `load/save`，再写业务逻辑，最后接 CLI
- C. 先写 README，功能以后再说
- D. 先写一个 Web 页面

<details>
<summary>答案与为什么</summary>

**B。**

先定「数据长什么样、怎么存、怎么读」，再写「加一笔/汇总」，最后接「命令行输入输出」。

原因：

- 数据模型决定了后面所有函数的输入/输出；
- `load/save` 可以单独测试；
- CLI 只是「输入 → 调函数 → 输出」，最容易替换；
- 如果先写 CLI，很容易把业务逻辑塞进 `input()` 旁边，最后无法测试。

这就是「分层」：**存储 / 业务 / 界面** 分开。
</details>

---

## 3. 直观模型：三层结构

```
┌──────────────────────────────┐
│ CLI 层（input/print）         │  用户看到的部分
│  add / list / summary / quit │
└──────────────┬───────────────┘
               │ 调用
┌──────────────▼───────────────┐
│ 业务层（纯函数）              │  加一笔、汇总
│  add_record / summarize      │
└──────────────┬───────────────┘
               │ 读写
┌──────────────▼───────────────┐
│ 存储层（JSON 文件）           │  持久化
│  load_records / save_records │
└──────────────────────────────┘
```

好处：

- 业务函数不依赖 `input()`，可以单独测试；
- 存储层可以换成 CSV/数据库，不影响业务；
- CLI 可以换成 Web/API，不影响业务。

### 读图任务

- 如果要把数据从 JSON 换成 SQLite，改哪一层？
- 如果要加一个 Web 界面，改哪一层？
- 如果「汇总」算错了，应该先查哪一层？

---

## 4. 拆解机制

### 4.1 数据模型：一条记录长什么样

```json
{
  "id": 1,
  "date": "2026-10-26",
  "amount": 12.5,
  "category": "餐饮",
  "note": "午饭"
}
```

整个文件是一个列表：

```json
[
  {"id": 1, "date": "2026-10-26", "amount": 12.5, "category": "餐饮", "note": "午饭"},
  {"id": 2, "date": "2026-10-26", "amount": 3.8, "category": "交通", "note": "地铁"}
]
```

为什么用 list of dict？

- list：保持插入顺序，方便遍历；
- dict：每条记录字段清晰，方便扩展；
- JSON：人类可读，Python 原生支持。

### 4.2 存储层：load / save

```python
import json
from pathlib import Path

DATA = Path("records.json")

def load_records(path=DATA):
    try:
        text = path.read_text(encoding="utf-8")
        data = json.loads(text)
        if not isinstance(data, list):
            print("数据格式不是列表，使用空数据")
            return []
        return data
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as e:
        print("数据文件损坏：", e)
        return []

def save_records(records, path=DATA):
    text = json.dumps(records, ensure_ascii=False, indent=2)
    path.write_text(text, encoding="utf-8")
```

**关键点**：

- 文件不存在 → 返回空列表，不崩；
- JSON 坏了 → 提示 + 空数据（真实项目还应备份坏文件）；
- 写文件用 UTF-8；
- 保存整个列表（v1 足够；数据大了再换数据库）。

### 4.3 业务层：加一笔、汇总

```python
from datetime import date
import math

def parse_amount(text):
    try:
        value = float(text)
    except ValueError:
        raise ValueError("金额必须是数字")
    if not math.isfinite(value) or value <= 0:
        raise ValueError("金额必须是大于 0 的有限数")
    return round(value, 2)

def add_record(records, amount, category, note=""):
    next_id = max((r["id"] for r in records), default=0) + 1
    record = {
        "id": next_id,
        "date": date.today().isoformat(),
        "amount": amount,
        "category": category or "未分类",
        "note": note,
    }
    records.append(record)
    return record

def summarize(records):
    total = sum(r["amount"] for r in records)
    by_category = {}
    for r in records:
        by_category[r["category"]] = by_category.get(r["category"], 0) + r["amount"]
    return {
        "total": round(total, 2),
        "by_category": {k: round(v, 2) for k, v in by_category.items()},
    }
```

**关键点**：

- `parse_amount` 只负责「把文本变成合法金额」，不负责打印；
- `add_record` 只负责「加一条」，不负责存文件；
- `summarize` 是纯函数：同样输入 → 同样输出，容易测试。

### 4.4 CLI 层：输入 → 调函数 → 输出

```python
def main():
    records = load_records()
    while True:
        cmd = input("命令(add/list/summary/quit): ").strip().lower()
        if cmd == "quit":
            break
        if cmd == "add":
            try:
                amount = parse_amount(input("金额: "))
            except ValueError as e:
                print("错误:", e)
                continue
            category = input("分类: ").strip() or "未分类"
            note = input("备注: ").strip()
            add_record(records, amount, category, note)
            save_records(records)
            print("已保存")
        elif cmd == "list":
            for r in records:
                print(f'{r["date"]}  {r["category"]}  {r["amount"]:.2f}  {r["note"]}')
        elif cmd == "summary":
            s = summarize(records)
            print(f'总计: {s["total"]:.2f}')
            for name, amount in s["by_category"].items():
                print(f'  {name}: {amount:.2f}')
        else:
            print("未知命令，可用：add / list / summary / quit")
```

### 4.5 入口

```python
if __name__ == "__main__":
    main()
```

`if __name__ == "__main__":` 的意思是：只有直接运行这个文件时才执行 `main()`；
被别的文件 `import` 时不执行。这样业务函数可以被测试。

---

## 5. 形式化：函数签名与流程

| 函数 | 输入 | 输出 | 副作用 |
| --- | --- | --- | --- |
| `load_records(path)` | 路径 | list | 读文件 |
| `save_records(records, path)` | list、路径 | None | 写文件 |
| `parse_amount(text)` | 字符串 | float | 无 |
| `add_record(records, ...)` | list、金额、分类 | dict | 修改 list |
| `summarize(records)` | list | dict | 无 |
| `main()` | 无 | None | 输入/输出/文件 |

主流程：

```
load → loop:
  add: parse → add → save
  list: print
  summary: summarize → print
  quit: break
```

**分层原则**：

- 业务函数不 `input()`、不 `print()`；
- 存储函数不关心业务含义；
- CLI 只做「输入/输出/调度」。

---

## 6. 动手实验：五个里程碑

不要一次写完。按里程碑做，每个都能跑。

### 里程碑 1：数据模型 + 存储（20 分钟）

写 `load_records` / `save_records`，手动放一个 `records.json`，跑：

```python
records = load_records()
print(records)
save_records(records)
```

**验收**：文件不存在不崩；空列表能保存；中文不乱码。

### 里程碑 2：加一笔 + 列出（20 分钟）

写 `parse_amount` / `add_record`，用固定数据测试：

```python
records = []
add_record(records, 12.5, "餐饮", "午饭")
add_record(records, 3.8, "交通", "地铁")
for r in records:
    print(r)
```

**验收**：id 递增；金额保留 2 位；分类为空时变「未分类」。

### 里程碑 3：汇总（15 分钟）

```python
assert summarize([])["total"] == 0
assert summarize([{"amount": 10, "category": "a"}, {"amount": 5, "category": "a"}]) == {
    "total": 15,
    "by_category": {"a": 15},
}
```

**验收**：空列表、单条、多分类都正确。

### 里程碑 4：CLI + 校验（20 分钟）

接上 `main()`，手动测试：

- 输入 `abc` 作为金额 → 提示错误，不崩；
- 输入 `-5` → 提示错误；
- 输入 `add` 后直接回车分类 → 「未分类」；
- 输入未知命令 → 提示可用命令。

### 里程碑 5：收口（15 分钟）

- 写 `README.md`：怎么运行、支持哪些命令、数据存哪里；
- 加 3 个测试（`assert` 或 `pytest`）；
- 手动跑一遍完整流程：add → list → summary → quit → 重开 → list（数据还在）。

### 完整代码（约 110 行）

```python
#!/usr/bin/env python3
import json
import math
from datetime import date
from pathlib import Path

DATA = Path("records.json")


def load_records(path=DATA):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            print("数据格式不是列表，使用空数据")
            return []
        return data
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as e:
        print("数据文件损坏：", e)
        return []


def save_records(records, path=DATA):
    path.write_text(
        json.dumps(records, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def parse_amount(text):
    try:
        value = float(text)
    except ValueError:
        raise ValueError("金额必须是数字")
    if not math.isfinite(value) or value <= 0:
        raise ValueError("金额必须是大于 0 的有限数")
    return round(value, 2)


def add_record(records, amount, category, note=""):
    next_id = max((r["id"] for r in records), default=0) + 1
    record = {
        "id": next_id,
        "date": date.today().isoformat(),
        "amount": amount,
        "category": category or "未分类",
        "note": note,
    }
    records.append(record)
    return record


def summarize(records):
    total = sum(r["amount"] for r in records)
    by_category = {}
    for r in records:
        by_category[r["category"]] = by_category.get(r["category"], 0) + r["amount"]
    return {
        "total": round(total, 2),
        "by_category": {k: round(v, 2) for k, v in by_category.items()},
    }


def main():
    records = load_records()
    while True:
        cmd = input("命令(add/list/summary/quit): ").strip().lower()
        if cmd == "quit":
            break
        if cmd == "add":
            try:
                amount = parse_amount(input("金额: "))
            except ValueError as e:
                print("错误:", e)
                continue
            category = input("分类: ").strip() or "未分类"
            note = input("备注: ").strip()
            add_record(records, amount, category, note)
            save_records(records)
            print("已保存")
        elif cmd == "list":
            if not records:
                print("还没有记录")
            for r in records:
                print(f'{r["date"]}  {r["category"]}  {r["amount"]:.2f}  {r["note"]}')
        elif cmd == "summary":
            s = summarize(records)
            print(f'总计: {s["total"]:.2f}')
            for name, amount in s["by_category"].items():
                print(f'  {name}: {amount:.2f}')
        else:
            print("未知命令，可用：add / list / summary / quit")


if __name__ == "__main__":
    main()
```

---

## 7. 失败案例：项目最容易坏在哪

### 事故 1：每次 add 都覆盖整个文件，写到一半崩了

`save_records` 直接覆盖 `records.json`。如果写到一半断电/崩溃，文件可能损坏。

**改进**（进阶）：

```python
def save_records(records, path=DATA):
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)
```

先写临时文件，再原子替换。v1 可以先不做，但要知道风险。

### 事故 2：金额用 float，0.1 + 0.2 不等于 0.3

```python
print(0.1 + 0.2)   # 0.30000000000000004
```

记账场景建议用「分」为单位的整数，或 `decimal.Decimal`。
v1 用 `round(..., 2)` 是演示；真实记账要更严谨。

### 事故 3：数据文件格式变了，旧代码 KeyError

如果旧记录没有 `id` /`category`，`r["id"]` 会 KeyError。

**改进**：读取时做迁移/默认值：

```python
def normalize(record, index):
    return {
        "id": record.get("id", index + 1),
        "date": record.get("date", ""),
        "amount": float(record.get("amount", 0)),
        "category": record.get("category", "未分类"),
        "note": record.get("note", ""),
    }
```

---

## 8. 三个常见误区

1. **以为** 项目要大才叫项目；
   **实际** 一个 100 行、能保存、能报错、能测试的工具，就是合格的项目；
   **因为** 项目考的是「完整闭环」，不是代码量。

2. **以为** 先写界面更直观；
   **实际** 先定数据/业务，界面最后接；
   **因为** 界面会变，数据模型和业务逻辑更稳定。

3. **以为** 能跑一次就算完成；
   **实际** 要能重复运行、异常不崩、数据不丢；
   **因为** 真实用户会输入奇怪的东西，真实机器会崩。

---

## 9. 项目检查点

### Q1

为什么把 `load_records` / `save_records` 和 `main()` 分开？

<details>
<summary>答案</summary>

为了分层：存储/业务/界面解耦。
`load/save` 可以单独测试；业务函数不依赖 `input()`；以后换 CLI/Web 不影响核心逻辑。
</details>

### Q2

`parse_amount("abc")` 应该怎么处理？

<details>
<summary>答案</summary>

捕获 `ValueError`，抛出带可读提示的 `ValueError`（或返回错误），让 CLI 层决定怎么显示。
不能让程序直接崩。
</details>

### Q3

为什么 `if __name__ == "__main__":` 有用？

<details>
<summary>答案</summary>

让文件既能直接运行，又能被 `import` 测试。
直接运行时执行 `main()`；被导入时不执行。
</details>

### Q4

数据文件损坏时，v1 应该怎么办？v2 呢？

<details>
<summary>答案</summary>

v1：提示 + 使用空数据，不崩。
v2：备份坏文件（如 `records.bad.json`），尝试从备份恢复，或提供修复工具。
</details>

### Q5（验收）

一个合格的 v1 项目，至少要满足哪 5 条？

<details>
<summary>参考答案</summary>

1. 能添加/列出/汇总；
2. 数据能保存并在重启后读回；
3. 非法输入不崩，有提示；
4. 有 README（怎么运行、命令、数据位置）；
5. 有 3 个以上测试/手动验收步骤。
</details>

---

## 10. 连接与延伸

### 上一课

文件与异常：把数据存到文件，处理错误。

### 下一课

调试与好习惯：项目写完了，怎么系统地找 bug、加日志、做代码审查。

### 真实系统

- CLI 工具：`git`、`curl`、`rg` 都是「输入 → 处理 → 输出」；
- 分层架构：Controller / Service / Repository；
- 数据迁移：旧格式 → 新格式（本项目的 `normalize`）；
- 原子写：临时文件 + rename，防止半写坏文件。

### 延伸

- 加 `delete` / `edit` 命令；
- 导出 CSV；
- 用 `argparse` 做子命令；
- 用 `pytest` 写测试；
- 用 `decimal.Decimal` 处理金额；
- 把 JSON 换成 SQLite。

---

## 11. 图与交互 Spec（给可视化工程师）

### 主视觉：`ProjectBuilder`

**布局**：

```
┌──────────────┬──────────────────────────┬──────────────────────┐
│ 文件树        │ 代码 / 终端               │ 数据 / 结果           │
│ records.json │ > add                    │ [{"id":1,...}]       │
│ README.md    │ 金额: 12.5               │ 总计: 16.30           │
│              │ 分类: 餐饮               │ 餐饮: 12.50           │
└──────────────┴──────────────────────────┴──────────────────────┘
```

**交互**：

- 里程碑切换（1–5），每步只显示需要的代码；
- 运行 CLI，输入命令，观察 `records.json` 变化；
- 制造坏 JSON/非法金额，看异常路径；
- 切换「分层视图」：CLI/业务/存储三栏高亮调用链；
- 显示测试通过/失败。

**教学点**：让「分层」和「数据流」可见，而不是只给一份完整代码。

### 辅助图

1. 三层架构图；
2. `records.json` 结构；
3. CLI 流程图；
4. 原子写 vs 直接覆盖。

### 无障碍

- 终端输出可复制；
- 里程碑可键盘切换；
- 错误提示可读；
- 代码块可复制。

---

## 12. 生产备注

| 项 | 内容 |
| --- | --- |
| 来源 | Python 官方教程、CS61A 项目课、常见 CLI 设计 |
| 组件 | `ProjectBuilder`（可复用至后续项目课） |
| 资产 | 1 个主交互、3 张辅助图、1 个沙箱、1 份完整代码 |
| 工作量 | 5–6 人天 |
| 验收 | 5 名零基础用户中 ≥ 3 人能独立完成 v1；≥ 4 人能解释分层与数据流 |
| 常见失败 | 先写 CLI 导致逻辑纠缠；覆盖文件；非法输入崩溃；无 README |

---

## 13. 本课检查清单

- [x] 一个核心概念：从语法到可交付工具
- [x] 真实需求（记账本 v1）
- [x] 先猜一猜（先写哪层）
- [x] 主视觉（ProjectBuilder）
- [x] 分步机制（数据/存储/业务/CLI）
- [x] 五个里程碑 + 完整代码
- [x] 三个失败案例
- [x] 三个误区
- [x] 5 个项目检查点
- [x] 上一课/下一课/真实系统/延伸
- [x] 图/交互/无障碍/生产备注
