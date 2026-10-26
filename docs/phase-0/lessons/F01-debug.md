# F01 · 调试与好习惯：让 bug 无处可藏

> **课程**：F01 Python 第一行代码 · **模块**：8 调试与好习惯
> **课时 ID**：`F01.debug.workflow`
> **时长**：30 分钟正文 + 30 分钟实验
> **难度**：L0 / 2 星
> **先修**：变量、循环、函数、容器、文件与异常
> **核心知识点**：读 traceback、最小复现、断点、日志、二分定位、断言/测试

> 这是 F01 的最后一节：代码写完了，怎么系统地找 bug，而不是「改一行试试」。

---

## 1. 本课问题：为什么你改了十次，bug 还在？

你写了一个程序，有时对、有时错。

你开始「猜」：

- 改一下缩进，跑一次；
- 加一个 `print`，跑一次；
- 把 `range(1, 101)` 改成 `range(1, 100)`，跑一次；
- 把函数拆了又合，跑一次……

半小时过去，bug 还在，你却更困惑了。

调试不是「运气 + 手速」，而是一套可以重复的流程：

> **观察 → 复现 → 缩小范围 → 提出假设 → 验证 → 修复 → 回归**

这一课只解决一个问题：

> **怎样用最小的代价，稳定地定位并修好一个 bug？**

学完这一课，你应该能：

- 读懂 Python traceback，找到「第一个出错的位置」；
- 用最小复现隔离变量；
- 用 `print`/`logging`/`breakpoint()` 观察程序状态；
- 用二分法缩小 bug 范围；
- 用 `assert`/测试防止 bug 回来；
- 避免「裸 except」「随机改代码」等坏习惯。

---

## 2. 先猜一猜

看这段 traceback，错误最可能出在哪一行？

```text
Traceback (most recent call last):
  File "app.py", line 12, in <module>
    main()
  File "app.py", line 8, in main
    print(records["小美"])
KeyError: '小美'
```

- A. 第 1 行
- B. 第 8 行
- C. 第 12 行
- D. 整个文件都有问题

<details>
<summary>答案与为什么</summary>

**B. 第 8 行。**

Traceback 要**从下往上读**：

- 最后一行 `KeyError: '小美'` 是「什么错」；
- 上面最近的 `File "app.py", line 8, in main` 是「直接出错的位置」；
- 再往上是「谁调用了它」（第 12 行 `main()`）。

所以先看最后一行 + 最下面的业务代码行，而不是从第一行开始读。
</details>

---

## 3. 直观模型：调试是一个闭环

```
观察现象
   ↓
稳定复现  ←──────┐
   ↓             │
缩小范围          │
   ↓             │
提出假设          │
   ↓             │
验证假设 ──失败──┘
   ↓ 成功
修复 + 回归测试
```

每一步都要留下「证据」：

- 现象：错误信息/错误结果/复现步骤；
- 复现：固定输入、固定随机种子、固定环境；
- 缩小：删掉无关代码，bug 还在；
- 假设：「我猜是 `records` 里没有这个 key」；
- 验证：打印/断点/断言；
- 修复：改最小必要代码；
- 回归：加一个测试，防止再犯。

### 读图任务

- 如果没有「稳定复现」，能验证修复吗？
- 如果一次改 10 行，怎么知道哪行有效？
- 为什么修复后要加测试？

---

## 4. 拆解机制

### 4.1 读 traceback：从下往上

```python
def main():
    records = {"小明": "138"}
    print(records["小美"])

main()
```

输出（简化）：

```text
Traceback (most recent call last):
  File "app.py", line 5, in <module>
    main()
  File "app.py", line 3, in main
    print(records["小美"])
KeyError: '小美'
```

读法：

1. 最后一行：`KeyError: '小美'` → 字典里没有 `小美`；
2. 最近一行：`line 3, in main` → 出错语句；
3. 再往上：`line 5` → 调用者。

> 不要从第一行开始读；先看「最后一行 + 最下面的业务代码」。

### 4.2 最小复现：把问题关进笼子

把代码删到「刚好还能复现」：

```python
records = {"小明": "138"}
print(records["小美"])
```

如果这样还能复现，问题就在这两行；如果不能，逐步加回代码，直到找到触发条件。

**最小复现**的价值：

- 排除无关变量（环境、数据、其他函数）；
- 让别人能一键复现；
- 让修复可验证。

### 4.3 print / logging：观察，而不是猜

**print** 适合临时观察：

```python
print("records =", records)
print("key =", name, "exists =", name in records)
```

**logging** 更适合长期/分级：

```python
import logging

logging.basicConfig(level=logging.INFO)

logging.debug("调试细节")
logging.info("正常信息")
logging.warning("可疑情况")
logging.error("出错了")
```

区别：

- `print` 是临时、无级别、难关闭；
- `logging` 有级别、可配置、可写文件。

### 4.4 breakpoint：让程序停下来

```python
def main():
    records = {"小明": "138"}
    breakpoint()          # 程序在这里暂停
    print(records["小美"])

main()
```

进入 `pdb` 后常用命令：

| 命令 | 作用 |
| --- | --- |
| `n` | 下一行（不进入函数） |
| `s` | 进入函数 |
| `c` | 继续运行 |
| `p x` | 打印变量 x |
| `l` | 看附近代码 |
| `q` | 退出调试 |

> 断点比 print 更强：你能看到调用栈、局部变量，并单步执行。

### 4.5 二分定位：一次排除一半

如果 bug 出现在 1000 行代码里：

1. 在中间加日志/断点，判断 bug 在「前半」还是「后半」；
2. 对有问题的一半继续二分；
3. 直到缩小到几行。

版本控制里也可以用 `git bisect` 找到「哪次提交引入 bug」。

### 4.6 assert 与测试：让 bug 不再回来

```python
def yuan_to_cents(yuan):
    return int(round(yuan * 100))

assert yuan_to_cents(12.5) == 1250
assert yuan_to_cents(0.01) == 1
```

`assert` 适合快速检查「不可能发生」的条件；
正式项目用 `pytest` 写测试：

```python
def test_yuan_to_cents():
    assert yuan_to_cents(12.5) == 1250
    assert yuan_to_cents(0.01) == 1
```

> 修复 bug 后，第一件事是加一个能复现它的测试。
> 这样下次改代码，测试会帮你抓住它。

### 4.7 小黄鸭调试法

把问题讲给一只橡皮鸭（或一个不懂代码的人）听：

1. 我期望它做什么？
2. 它实际做了什么？
3. 我认为哪一行应该负责？
4. 我验证过这个假设吗？

很多时候，讲到一半就发现「等等，这里不对」。

---

## 5. 形式化：bug 的类型与调试流程

### 5.1 三类 bug

| 类型 | 例子 | 发现时机 |
| --- | --- | --- |
| 语法错误 | 少冒号、括号不匹配 | 运行前/导入时 |
| 运行时错误 | `KeyError`、`IndexError`、`ZeroDivisionError` | 运行到那行 |
| 逻辑错误 | 结果不对但不报错 | 测试/对答案 |

语法/运行时错误有 traceback；逻辑错误最难，只能靠「期望 vs 实际」。

### 5.2 调试流程（可复用）

```
1. 记录现象：错误信息、输入、期望、实际
2. 稳定复现：固定输入/环境/随机种子
3. 缩小范围：删代码/二分/最小样例
4. 提出假设：具体到「哪一行/哪个变量」
5. 验证：print/log/breakpoint/assert
6. 修复：最小改动
7. 回归：加测试/重跑
```

### 5.3 不要做的事

- 一次改很多行；
- 随机加/删代码；
- 用 `except: pass` 把错误藏起来；
- 不复现就「修好了」；
- 修复后不加测试。

---

## 6. 动手实验：修 5 个 bug

### Bug 1：差一错误

```python
def sum_1_to_100():
    total = 0
    for i in range(1, 100):
        total += i
    return total

print(sum_1_to_100())   # 期望 5050，实际 4950
```

**任务**：用最小复现 + 打印边界，找出问题。

<details>
<summary>参考修复</summary>

`range(1, 101)`。`range` 左闭右开。
</details>

### Bug 2：KeyError

```python
records = {"小明": "138"}
print(records["小美"])
```

**任务**：让程序不崩，并给出「查无此人」。

<details>
<summary>参考修复</summary>

```python
print(records.get("小美", "查无此人"))
```
</details>

### Bug 3：别名

```python
a = [1, 2]
b = a
b.append(3)
print(a)   # 期望 [1, 2]，实际 [1, 2, 3]
```

**任务**：解释并修复。

<details>
<summary>参考修复</summary>

`b = a.copy()`。`b = a` 是别名。
</details>

### Bug 4：文件路径/编码

```python
text = open("data.txt").read()
print(text)
```

**任务**：让它能处理「文件不存在」和「中文编码」。

<details>
<summary>参考修复</summary>

```python
from pathlib import Path

try:
    text = Path("data.txt").read_text(encoding="utf-8")
except FileNotFoundError:
    text = ""
```
</details>

### Bug 5：裸 except 吞错

```python
try:
    total = sum(load_amounts())
except:
    pass
print(total)
```

**任务**：指出问题，并改成具体异常 + 日志。

<details>
<summary>参考修复</summary>

```python
import logging

try:
    total = sum(load_amounts())
except (FileNotFoundError, ValueError) as e:
    logging.exception("加载金额失败")
    total = 0
```
</details>

### 改一改

1. 给 Bug 1 加一个 `assert` 测试；
2. 给 Bug 2 加日志；
3. 用 `breakpoint()` 单步走一遍 Bug 3；
4. 用 `git bisect`（如果有仓库）找一次「引入 bug 的提交」。

### 排查

| 现象 | 可能原因 |
| --- | --- |
| 看不到 traceback | 被 `except` 吞了 |
| 断点不生效 | 没运行到/被优化/环境不对 |
| 日志不输出 | 级别设置太高/没配置 |
| 修完又坏 | 没加回归测试 |
| 本地对、线上错 | 环境/数据/版本不同 |

---

## 7. 失败案例：三种「越调越乱」

### 事故 1：一次改十行

改完运行，bug 没了——但你不知道是哪一行修好的；下次又出现，你也不知道为什么。

**正确**：一次只改一个变量/一行，跑一次，记录结果。

### 事故 2：用 `except: pass` 让错误消失

```python
try:
    result = risky()
except:
    pass
```

错误不再打印，但数据可能已经错了。

**正确**：捕获具体异常，记录日志，给出可理解的提示。

### 事故 3：不复现就「修好了」

「我重启了一下，好了。」——下次还会出现。

**正确**：找到稳定复现步骤，验证修复前后行为，加回归测试。

---

## 8. 三个常见误区

1. **以为** 调试就是加 `print`；
   **实际** 调试是「复现 → 缩小 → 假设 → 验证」的闭环；
   **因为** 没有假设的打印只是噪音。

2. **以为** traceback 要从第一行读；
   **实际** 先看最后一行（什么错）+ 最下面的业务代码行（哪里错）；
   **因为** 上面的行是调用链，不是根因。

3. **以为** 修复就是改到不报错；
   **实际** 修复要「行为正确 + 不引入新问题 + 有测试」；
   **因为** 不报错不等于结果对。

---

## 9. 检索练习

### Q1

traceback 应该怎么读？

<details>
<summary>答案</summary>

从下往上：最后一行是异常类型/信息，最近一行业务代码是直接出错位置，再往上是调用链。
</details>

### Q2

`print` 和 `logging` 的区别？

<details>
<summary>答案</summary>

`print` 临时、无级别、难关闭；`logging` 有级别、可配置、可写文件，适合长期/生产。
</details>

### Q3

`breakpoint()` 进入调试后，`n` / `s` / `c` 分别是什么？

<details>
<summary>答案</summary>

- `n`：下一行（不进入函数）；
- `s`：进入函数；
- `c`：继续运行到下一个断点/结束。
</details>

### Q4

什么是「最小复现」？为什么有用？

<details>
<summary>答案</summary>

把代码/数据删到「刚好还能复现 bug」的最小样例。
它能排除无关变量、让别人一键复现、让修复可验证。
</details>

### Q5

为什么修复 bug 后要加测试？

<details>
<summary>答案</summary>

防止 bug 回来（回归）；把「这次修复」变成可重复验证的证据；以后重构时更有安全感。
</details>

---

## 10. 连接与延伸

### 上一课

小项目：把变量、循环、函数、容器、文件串成 CLI 记账本。

### 下一课

F00「计算机如何思考」：从代码回到整台机器，建立系统全景。

### 真实系统

- 日志/追踪/指标：生产环境的「调试」；
- 断点调试：VS Code/PyCharm/gdb；
- 单元测试/CI：防止回归；
- `git bisect`：定位引入 bug 的提交；
- 事故复盘：从「修 bug」到「修流程」。

### 延伸

- 读 Python 官方文档「Errors and Exceptions」「pdb」；
- 学 `pytest`；
- 学 `logging` 配置；
- 练习：拿一个开源项目，读它的 issue + 复现步骤。

---

## 11. 图与交互 Spec（给可视化工程师）

### 主视觉：`DebuggerStepper`

**布局**：

```
┌──────────────────────┬──────────────────────────┬──────────────────────┐
│ 代码 + 断点           │ 调用栈 / 当前行           │ 变量 / 输出           │
│ 1 def main():        │ main()                   │ records = {...}      │
│ 2   ...              │  └─ line 8               │ name = "小美"         │
│ 3   ...              │                          │ KeyError: '小美'      │
└──────────────────────┴──────────────────────────┴──────────────────────┘
```

**交互**：

- 点击行号设断点；
- 单步（n/s/c）；
- 变量表实时更新；
- 调用栈可展开；
- 切换「print 调试」vs「断点调试」；
- 内置 5 个 bug，让学习者修。

**教学点**：让「程序状态」可见，让「复现 → 缩小 → 验证」变成可操作流程。

### 辅助图

1. 调试闭环；
2. traceback 从下往上读；
3. 二分定位；
4. 最小复现的前后对比。

### 无障碍

- 断点/当前行有文字标记；
- 键盘单步；
- 变量可复制；
- 错误信息可读。

---

## 12. 生产备注

| 项 | 内容 |
| --- | --- |
| 来源 | Python 官方文档（Errors/Exceptions、pdb）、CS61A 调试课 |
| 组件 | `DebuggerStepper`（可复用至所有编程课） |
| 资产 | 1 个主交互、3 张辅助图、1 个沙箱、5 个 bug 样例 |
| 工作量 | 4–5 人天 |
| 验收 | 5 名零基础用户中 ≥ 4 人能读懂 traceback；≥ 3 人能用断点/最小复现定位一个 bug |
| 常见失败 | 一次改多行；裸 except；不复现；不加测试 |

---

## 13. 本课检查清单

- [x] 一个核心概念：调试闭环
- [x] 真实问题引入（越改越乱）
- [x] 先猜一猜（读 traceback）
- [x] 主视觉（DebuggerStepper）
- [x] 分步机制（traceback/最小复现/print/断点/二分/测试）
- [x] 5 个 bug 修复实验
- [x] 三个失败案例
- [x] 三个误区
- [x] 5 道检索题 + 解析
- [x] 上一课/下一课/真实系统/延伸
- [x] 图/交互/无障碍/生产备注
