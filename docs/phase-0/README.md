# Phase 0 · 样板课与迁移表

> 状态：D-006（分层内容）已确认，开始 Phase 0。
> 本目录是「从框架进入内容生产」的第一批实物：十一节完整样课 + 471 条旧大纲迁移表 + 第一年 backlog。
>
> 目标：先验证「一节课到底怎么写、怎么交互、怎么测」，再批量复制。

---

## 1. 本批交付

| 文件 | 内容 | 用途 |
| --- | --- | --- |
| [`lessons/F00-click-to-pixel.md`](lessons/F00-click-to-pixel.md) | F00「从点击到像素」 | 全景课样板；校准抽象分层、点击链路、故障排查 |
| [`lessons/F00-history.md`](lessons/F00-history.md) | F00「从算盘到芯片」 | 历史课样板；校准计算跃迁、存储程序、摩尔定律 |
| [`lessons/F00-program.md`](lessons/F00-program.md) | F00「程序是什么」 | 原理课样板；校准源码/字节码/机器码、指令周期 |
| [`lessons/F01-loops.md`](lessons/F01-loops.md) | F01「循环」完整样课 | 零基础概念课样板；校准 10 块结构、图、实验、题 |
| [`lessons/F01-functions.md`](lessons/F01-functions.md) | F01「函数」完整样课 | 概念课样板；校准 print/return、作用域、调用栈 |
| [`lessons/F01-collections.md`](lessons/F01-collections.md) | F01「列表与字典」完整样课 | 数据组织样板；校准 list/dict/set、复杂度、别名 |
| [`lessons/F01-files.md`](lessons/F01-files.md) | F01「文件与异常」完整样课 | 持久化/异常样板；校准 CSV/JSON、with、错误处理 |
| [`lessons/F01-project.md`](lessons/F01-project.md) | F01「小项目：命令行记账本」 | 项目课样板；校准需求拆解、分层、里程碑 |
| [`lessons/F01-debug.md`](lessons/F01-debug.md) | F01「调试与好习惯」 | 调试课样板；校准 traceback、断点、最小复现 |
| [`lessons/S03-tcp-handshake.md`](lessons/S03-tcp-handshake.md) | S03「TCP 三次握手」完整样课 | 网络旗舰样板；校准抓包、状态机、失败案例 |
| [`lessons/S01-cache.md`](lessons/S01-cache.md) | S01「缓存为什么快」完整样课 | 系统机制课样板；校准 AMAT、缓存模拟、C 实验 |
| [`migration-summary.md`](migration-summary.md) | 471 条旧大纲的分诊分析与使用说明 | 决定保留/改写/拆分/项目/归档 |
| [`migration-map.csv`](migration-map.csv) | 471 行课时级映射 | 逐条评审、排期、建新课时 ID |
| [`module-map.csv`](module-map.csv) | 75 行模块级映射 | 先看模块去向，再看课时 |
| [`archive-list.md`](archive-list.md) / [`archive-list.csv`](archive-list.csv) | 53 条不迁移清单 | 选修/竞赛/前端/运行时的去向 |
| [`year-1-backlog.md`](year-1-backlog.md) | 第一年 130 课时生产队列 | 自动推进的下一节清单 |
| [`../design/design-system-v0.md`](../design/design-system-v0.md) | 设计系统 v0 | 颜色/字体/图/交互/无障碍/组件契约 |
| [`migration-summary.json`](migration-summary.json) | 机器可读统计 | 后续导入 CMS/脚本 |
| [`../../scripts/build-migration-map.mjs`](../../scripts/build-migration-map.mjs) | 生成脚本 | 改规则后一键重跑 |

---

## 2. 十一节样课怎么用

### 2.1 先读，不要先做

建议按这个顺序读：

1. `F00-click-to-pixel.md` 的「点击 → 中断 → OS → 浏览器 → 渲染 → 像素」；
2. `F00-history.md` 的「算盘 → 机械 → 电子 → 晶体管 → IC → CPU」；
3. `F00-program.md` 的「源码 → 字节码/汇编 → 机器码 → 指令周期」；
4. `F01-loops.md` 的「本课问题 → 先猜 → 直观模型 → 实验 → 失败案例」；
5. `F01-functions.md` 的「print vs return → 函数机器 → 作用域 → 调用栈」；
6. `F01-collections.md` 的「通讯录 → list/dict/set → 别名 → 词频统计」；
7. `F01-files.md` 的「文件不存在 → 模式/编码 → CSV/JSON → try/except」；
8. `F01-project.md` 的「需求 → 数据模型 → 分层 → 五个里程碑」；
9. `F01-debug.md` 的「traceback → 最小复现 → 断点 → 测试」；
10. `S03-tcp-handshake.md` 的「先猜 → 状态机 → 抓包实验 → SYN Flood」；
11. `S01-cache.md` 的「先猜 → 存储金字塔 → AMAT → C 实验」。

读的时候只问三个问题：

- 一个零基础高中生，能不能在第一屏被吸引？
- 图/交互有没有承担解释任务，还是装饰？
- 学完能不能做出实验、答对迁移题？

### 2.2 试学可以后置

当前先按计划生产，不阻塞在「5 人试学」上。
但每完成 3–5 节，至少找 2–3 名目标用户快速试读一次，记录：

| 观察点 | 记录方式 |
| --- | --- |
| 第一屏是否继续 | 是否在 30 秒内滚动/点击 |
| 卡在哪一段 | 时间戳 + 原话 |
| 哪个图没看懂 | 让用户指图复述 |
| 实验是否跑通 | 成功率、报错 |
| 题目错在哪 | 选项 + 理由 |

> 试学不是「讲给用户听」，而是**闭嘴看用户做**。
> 用户卡住的地方，就是内容要改的地方。

---

## 3. 迁移表怎么用

### 3.1 先看 75 行模块表

打开 [`module-map.csv`](module-map.csv)，按 `priority` 排序：

- **P0（78 条课时）**：第一年 / Wave 1，先处理；
- **P1（97 条）**：Core v1，第二批；
- **P2（128 条）**：Core v2 / 项目线，第三批；
- **P3（168 条）**：方向/选修，先冻结。

### 3.2 再逐条处理 471 行课时表

打开 [`migration-map.csv`](migration-map.csv)：

```
filter priority = P0
  → 确认 new_course / new_module_hint
  → 合并重复课时
  → 标记 keep / rewrite / split / archive
  → 人工分配新课时 ID
```

**重要**：`new_course` 是目标课程，不是最终课时 ID。
最终 ID 需要在新课程大纲确定后分配，例如：

```
旧：lang-computing-03 流程控制与程序结构
新：F01.control.loops（本课）
```

### 3.3 处置含义

| 处置 | 含义 | 下一步 |
| --- | --- | --- |
| `keep` | 主题/层级基本对齐 | 作为种子，补正文/图/实验/题 |
| `rewrite` | 主题属于新体系，但需重写 | 按新 10 块标准重写 |
| `split` | 一个旧模块对应多门新课程 | 拆分到多个课时 |
| `project` | 应进入 P0–P5 项目线 | 不占核心课时，补 Rubric |
| `archive` | 选修/过细/重复 | 建「不迁移清单」，保留 URL 301 |

### 3.4 重新生成

修改 `scripts/build-migration-map.mjs` 里的 `MODULE_MAP` 或课时覆盖规则后：

```bash
node scripts/build-migration-map.mjs
```

会重新生成：

- `migration-map.csv`（471 行）
- `module-map.csv`（75 行）
- `migration-summary.json`

> 脚本会校验：解析到的课时数必须是 471，75 个模块必须有映射，否则报错退出。

---

## 4. 本批的已知不足

1. 十一节样课还没有做真实视觉/交互，只有 Spec；
2. 迁移表是**启发式分诊**，不是最终学术判断；
3. P0 的 78 条只是「候选」，不是「最终第一年 100–130 条」；
4. 旧课时没有知识点 ID，无法自动去重；
5. 选修课程 `X01–X05` 尚未纳入 86 门课程库；
6. 没有做系统试学，还没有真实学习数据。

---

## 5. 下一步（按顺序）

- [x] 十一节完整样课：F00 从点击到像素/从算盘到芯片/程序是什么、F01 循环/函数/列表与字典/文件与异常/小项目/调试、S03 TCP 握手、S01 缓存；
- [x] 471 条迁移分诊 + 53 条不迁移清单；
- [x] 设计系统 v0（文档）；
- [x] 第一年 130 课时 backlog；
- [ ] 下一节：F00「互联网是什么」完整样课；
- [ ] 3 个组件原型：LoopStepper、CacheSimulator、TcpHandshake；
- [ ] 技术验证：浏览器 Python/C 沙箱、pcap 回放、SQL 沙箱；
- [ ] 评审 P0 的 78 条迁移，确认目标课程；
- [ ] 每 3–5 节做一次 2–3 人快速试读。

> 这一批不是「完成课程」，而是「证明课程标准可行」。
> 接下来按 [year-1-backlog](year-1-backlog.md) 自动推进：下一节 F00 互联网是什么。
