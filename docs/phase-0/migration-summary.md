# Phase 0 · 旧大纲迁移分诊

> 目标：把现有 **5 个板块 / 75 个模块 / 471 条课时大纲** 映射到新体系，
> 给出「保留 / 改写 / 拆分 / 项目 / 归档」的处置建议，作为内容重写的起点。
>
> 生成脚本：[`scripts/build-migration-map.mjs`](../../scripts/build-migration-map.mjs)
> 明细表：[`migration-map.csv`](migration-map.csv)（471 行）
> 模块表：[`module-map.csv`](module-map.csv)（75 行）
> 机器汇总：[`migration-summary.json`](migration-summary.json)

---

## 1. 总览

| 指标 | 数值 |
| --- | ---: |
| 旧板块 | 5 |
| 旧模块 | 75 |
| 旧课时大纲 | 471 |
| 可直接复用（keep） | 99（21%） |
| 需改写（rewrite） | 168（36%） |
| 需拆分（split） | 86（18%） |
| 转项目线（project） | 65（14%） |
| 归档/选修（archive） | 53（11%） |

### 1.1 按板块

| 板块 | 模块 | 课时 | keep | rewrite | split | project | archive |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 编程语言基础 | 14 | 89 | 12 | 19 | 22 | 13 | 23 |
| 数据结构与算法 | 15 | 93 | 42 | 33 | 0 | 12 | 6 |
| 计算机基础四大件 | 16 | 101 | 27 | 50 | 12 | 12 | 0 |
| 方向进阶与项目实战 | 15 | 92 | 18 | 6 | 30 | 14 | 24 |
| AI 与新兴技术 | 15 | 96 | 0 | 60 | 22 | 14 | 0 |
| **合计** | **75** | **471** | **99** | **168** | **86** | **65** | **53** |

### 1.2 按建设优先级

| 优先级 | 含义 | 课时数 |
| --- | --- | ---: |
| **P0** | 第一年 / Wave 1：F00–F03、C01、C03、S03 等 | 78 |
| **P1** | Core v1：S01/S02/S04、M01–M03、E01、C02 | 97 |
| **P2** | Core v2 + 项目线：C04、M04、S05–S08、E02/E03 | 128 |
| **P3** | 方向/选修/专家内容：AI、数据、安全、云、前端等 | 168 |

> P3 的 168 条不是「废弃」，而是「暂不进入第一年」；
> 其中 AI 85 条、工程方向 30 条、语言选修 29 条等。

---

## 2. 关键结论

### 2.1 现有 471 条大纲，只有约 21% 能直接当种子

- **keep 99 条**：主题、层级基本对齐，可直接作为新课时种子，补正文/图/实验/题；
- **rewrite 168 条**：主题属于新体系，但表述、深度、实验方式需要重写；
- **split 86 条**：一个旧模块对应多门新课程（如 `fundamentals` 拆成 S01–S05，
  `languages` 拆成 F00/F01/C02/S06）；
- **project 65 条**：应进入 P0–P5 项目线，不占用核心课时；
- **archive 53 条**：前端/Java/C++/竞赛/专家运行时等，转为选修或暂缓。

> 结论：**不要把 471 条大纲直接搬进新站**。
> 先按分诊表决定「保留/改写/拆分/归档」，再进入内容生产，否则会把旧结构带进新体系。

### 2.2 基础四大件是最值得重写的资产

`fundamentals` 101 条中：

- keep 27 条（系统全景、组成、OS、网络、DB 的基础主题）；
- rewrite 50 条（需要补实验/源码/抓包/性能）；
- split 12 条（二进制/系统/网络拆到多门课）；
- project 12 条（mini OS / TCP / 存储引擎）。

这说明「计算机基础」不是从零写，而是**把旧大纲升级成可运行、可测量、可排障的课**。
网络和 OS 的旧模块尤其适合作为 S02/S03 的种子。

### 2.3 AI 方向几乎全部要重写

AI 96 条中：

- rewrite 60 条（需要补推导、从零实现、实验、评估）；
- split 22 条（数学拆到 M02–M04，CNN/RNN/Transformer 拆到 A02–A04）；
- project 14 条（RAG/Agent 转 P4）；
- keep 0 条。

不是旧 AI 内容「错」，而是它偏「知识介绍」，缺少「推导 + 实现 + 实验 + 论文」。
这正好符合新框架对 AI 方向的要求。

### 2.4 语言板块要「瘦身」

`languages` 89 条中：

- archive 23 条（JS/TS、Java、C++ 专属、JIT/GC 源码）；
- split 22 条（Python 工程拆 C01/E01，C/C++ 拆 C02/X03，内存/并发拆 C02/S05）；
- rewrite 19 条；
- keep 12 条。

新体系不再「并列教 5 门语言」，而是 **Python → C → 按方向选一门**。
这能显著降低零基础负担。

---

## 3. 怎么用这张表

### 3.1 第一步：先看 75 行模块表

打开 [`module-map.csv`](module-map.csv)，按 `priority` 排序：

1. **P0**：确认目标课程与拆分方式；
2. **P1**：确认是否保留/改写；
3. **P2/P3**：先冻结，不进入第一年生产。

### 3.2 第二步：逐条处理 471 行课时表

打开 [`migration-map.csv`](migration-map.csv)，建议按以下顺序：

```
filter priority = P0
  → 确认 new_course / new_module_hint
  → 合并重复课时
  → 标记 keep / rewrite / split / archive
  → 写入新课时 ID（后续人工补）
```

**注意**：`new_course` 是「目标课程」，不是「最终课时 ID」。
最终课时 ID 需要在新课程大纲确定后人工分配。

### 3.3 第三步：建立「不迁移清单」

把 archive 的 53 条单独列出，写明：

- 为什么归档（选修/过细/重复/质量不足）；
- 未来是否以选修/文章/视频形式保留；
- 旧 URL 是否保留 301。

明细见 [`archive-list.md`](archive-list.md) / [`archive-list.csv`](archive-list.csv)。

### 3.4 第四步：映射旧 URL 与进度

旧路由：

```
/domain/:domainId/:moduleId/:lessonId
```

新路由：

```
/lessons/:lessonId
```

迁移规则：

- 旧课时 ID → 新课时 ID，写入 `aliases`；
- 找不到新 ID 的，跳到对应课程页，并提示「该课时已重组」；
- `localStorage` 进度 key 从 `cs-learn:progress:v1` 迁移到 `cs:progress:v2`；
- 无法映射的旧进度保留为「旧版已完成」，不删除。

---

## 4. 分诊规则（可复现）

脚本按以下规则生成：

1. **模块级映射**：75 个旧模块 → 新课程（`MODULE_MAP`）；
2. **课时级覆盖**：
   - AI 数学按标题拆到 M02/M03/M04；
   - AI 入门中的 Python/NumPy/Pandas 前移到 F01/C01；
   - 二进制中的内存/指针/可执行文件拆到 C02；
   - C++ 专属内容转 X03 选修；
   - 标题含「项目」的课时转项目线。
3. **默认处置**：模块级 `keep/rewrite/split/archive/project`；
4. **优先级**：P0（第一年）、P1（Core v1）、P2（Core v2/项目）、P3（方向/选修）。

> 这是**启发式分诊**，不是最终学术判断。
> 每条 P0/P1 都需要学科审校确认；P2/P3 可以稍后再审。

---

## 5. 已知局限

1. 模块级映射粒度较粗，部分课时需要逐条调整；
2. 旧课时没有知识点 ID，无法自动判断「是否重复/是否过时」；
3. 项目课时被统一转到 P2/P4，具体对应哪个项目需要人工指定；
4. 选修课程 `X01–X05` 尚未纳入 86 门课程库，暂标记「待建/选修」；
5. 旧大纲的「专家级」内容不一定达到硕士级，需要按新标准重写或降级。

---

## 6. 已生产样课与旧大纲的对应

当前已产出 11 节完整样课，可作为迁移表的「重写样例」：

| 新课时 | 旧大纲候选 | 处置 | 说明 |
| --- | --- | --- | --- |
| `F00.overview.click-to-pixel` 从点击到像素 | `fund-intro` 计算机系统全景；`lang-computing-01` 计算机如何执行程序 | rewrite | 旧内容偏概念介绍，重写为「点击链路 + 分层 + 排障」 |
| `F00.history.timeline` 从算盘到芯片 | `lang-computing-01` 计算机如何执行程序；`fund-intro` 系统全景 | rewrite | 补历史跃迁/存储程序/摩尔定律 |
| `F00.program.source-to-instruction` 程序是什么 | `lang-computing-01` 计算机如何执行程序；`fund-binary` 可执行文件/进程映像 | rewrite | 补源码/字节码/机器码/指令周期 |
| `F01.control.loops` 循环 | `lang-computing-03` 流程控制与程序结构 | rewrite | 主题对应，按新 10 块重写 |
| `F01.functions.basics` 函数 | `lang-computing-04` 函数与问题分解 | rewrite | 主题对应，补 print/return/作用域/调用栈 |
| `F01.data.collections` 列表与字典 | `lang-computing-05` 数据结构初识；`lang-python-syntax` 容器部分 | split/rewrite | 旧内容偏语法，重写为「按任务选容器」 |
| `F01.io.files` 文件与异常 | `lang-python-engineering` 标准库/工程实践 | rewrite | 抽取出文件/JSON/异常处理 |
| `F01.project.cli-ledger` 命令行记账本 | `lang-project-app` 命令行工具与 Web 服务 | project | 旧项目题升级为分层 + 持久化项目 |
| `F01.debug.workflow` 调试 | `lang-computing-06` 调试与错误定位 | rewrite | 从「会用断点」升级为调试闭环 |
| `S03.transport.tcp-handshake` TCP 握手 | `fund-net2` TCP/IP 协议栈与 HTTP/TLS | rewrite | 抽取出握手/抓包，补状态机与 SYN Flood |
| `S01.memory.cache` 缓存 | `fund-co2` 流水线、缓存一致性与性能 | rewrite | 抽取出缓存/AMAT，补可测量实验 |

> 这些对应关系是「主题级」的，不是逐条合并。
> 真正迁移时，仍需把旧课时的知识点逐条拆到新课时，并补实验/题目。

---

## 7. 下一步

- [x] 为 archive 的 53 条建立「不迁移清单」；
- [x] 产出 11 节完整样课，作为重写样例；
- [ ] 人工评审 P0 的 78 条，确认目标课程与拆分；
- [ ] 评审 P1 的 97 条，标记 keep/rewrite；
- [ ] 把 P0 中可复用的课时合并成第一批 20–30 个新课时；
- [ ] 设计旧 URL/进度的 301 迁移方案。

> 迁移表不是目的，目的是**不让旧结构拖累新课程**。
> 保留有价值的主题，重写表达与实验，归档过细/过时的内容。
