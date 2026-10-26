# 调研笔记：从「目录站」到「完整课程体系」

> 调研时间：2026-10（课程页面以当时公开信息为准）。
> 方法：对照 6 类权威来源——课程体系标准、大学培养方案、自学课程清单、单门标杆课、
> 学习科学、交互学习产品——提炼「教什么、按什么顺序、一节课怎么做」。
>
> 说明：这是一次**桌面研究**，尚未进行目标学习者访谈与课堂试验。
> Phase 0 需要补 6–8 名学习者访谈、3 个 Storyboard 试学，验证本文假设。

---

## 1. 主要发现（先看结论）

### 发现 1：CS2023 给了「知识版图」，但没给「学习顺序」

ACM/IEEE-CS/AAAI 的 CS2023 定义了 17 个知识领域（Knowledge Areas）：

- Algorithmic Foundations (AL)
- Architecture and Organization (AR)
- Artificial Intelligence (AI)
- Data Management (DM)
- Foundations of Programming Languages (FPL)
- Graphics and Interactive Techniques (GIT)
- Human-Computer Interaction (HCI)
- Mathematical and Statistical Foundations (MSF)
- Networking and Communication (NC)
- Operating Systems (OS)
- Parallel and Distributed Computing (PDC)
- Security (SEC)
- Society, Ethics, and the Profession (SEP)
- Software Development Fundamentals (SDF)
- Software Engineering (SE)
- Specialized Platform Development (SPD)
- Systems Fundamentals (SF)

来源：[CS2023 Knowledge Areas](https://csed.acm.org/knowledge-areas/)

**启示**：用 17 个 KA 做「覆盖检查表」，但不能按 KA 顺序开课。
学习顺序要按先修、认知负荷、动机重新设计（见 02 课程地图）。

### 发现 2：顶尖 CS 本科的核心是「数学 + 系统 + 理论 + 项目」，不是「多学框架」

MIT 6-3（Computer Science and Engineering）的必修结构包括：

- 编程：6.100A/6.100L、6.1010、6.1020；
- 数学：6.1200（Mathematics for Computer Science）、6.1210（Algorithms）、
  概率/线代（6.3700/6.3800/18.05/18.06）；
- 理论：6.1400（Computability and Complexity）或 6.1220（Design and Analysis of Algorithms）；
- 系统：6.1800（Computer Systems Engineering）、6.1903（Low-level Programming）、
  6.1910（Computation Structures）；
- 方向选修 + 独立探究。

来源：[MIT 6-3 Degree Chart](https://catalog.mit.edu/archive/2024-2025/degree-charts/computer-science-engineering-course-6-3/)

**启示**：核心课必须包含离散数学、算法、计算理论、计算机组成、系统编程。
「零基础直接学 AI/云」会缺底层能力，后期会卡住。

### 发现 3：自学课程清单的共识是「核心 + 高级 + 最终项目」

OSSU 把课程分为：

- Intro CS；
- Core CS：编程、数学、工具、系统、理论、安全、应用、伦理；
- Advanced CS：高级编程、系统、理论、信息安全、数学；
- Final Project。

来源：[OSSU Computer Science](https://github.com/ossu/computer-science)

OSSU 还强调：核心课尽量按顺序；高级课按方向选；最后用项目验证。

**启示**：
- 需要「核心必修 + 方向选修 + 最终项目」三层；
- 「项目」不是一门课，而是贯穿的验证；
- 伦理/社会（SEP）不能完全缺席，可作为案例/短课嵌入。

### 发现 4：真正学懂一门系统课，必须「实现一个最小版本」

- **CS144**（Stanford 计算机网络）：实验是从零实现 TCP 的字节流、receiver、sender、
  重传、流量控制、拥塞控制；课程口号是「reliability from unreliability」。
  来源：[CS144](https://cs144.github.io/)
- **MIT 6.824/6.5840**（分布式系统）：读 MapReduce/GFS/Paxos/Raft/Spanner 论文，
  做 MapReduce、KV server、Raft、sharded KV 实验，最后做研究项目。
  来源：[6.824 Schedule](https://pdos.csail.mit.edu/6.824/schedule.html)
- **CMU 15-445**（数据库）：存储、缓冲池、B+ 树、查询执行/优化、并发控制、恢复、分布式，
  配套实现 buffer pool、B+ 树、查询执行、并发控制。
  来源：[15-445 Schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html)
- **Nand2Tetris**：从 NAND 门搭到 CPU、汇编器、VM、编译器、OS。
  来源：[Nand2Tetris](https://www.nand2tetris.org/)
- **OSTEP**：用「虚拟化/并发/持久化」三部分讲 OS，配 xv6 实验。
  来源：[OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)

**启示**：核心课必须有「手写最小实现」的 Lab，而不是只讲概念。
这正是现有 471 条大纲最缺的部分，也是新框架 P2 项目线的依据。

### 发现 5：研究生级方向课 = 论文 + 实现 + 研究项目

TeachYourselfCS 建议 9 个核心主题，每个 100–200 小时，并明确：

- 分布式系统「绝对要求读论文」；
- 数据库在 CS186 之后读 Red Book 论文；
- 编译/OS/网络都要做项目；
- 进阶方向（AI/图形）用 Berkeley/Stanford 课程 + 项目。

来源：[Teach Yourself Computer Science](https://teachyourselfcs.com/)

**启示**：方向的 L4/L5 不能只有「高级课」，必须有论文精读、复现、研究项目。
这也是「硕士等效」与「看完网课」的分界线。

### 发现 6：学习科学支持「短块 + 图 + 检索 + 间隔 + 掌握」

相关研究与实践：

- **Mayer 多媒体学习原则**：多媒体、邻近、分段、预训练、一致性、信号、冗余、
  空间/时间邻近、 modality、个性化。核心是「减少无关认知负荷，促进生成性加工」。
  （Mayer, *Multimedia Learning*, 2nd ed., 2009）
- **检索练习**：测试比重复阅读更能促进长期记忆（Roediger & Karpicke, 2006,
  *Test-Enhanced Learning*, Psychological Science）。
- **间隔练习**：分散练习优于集中练习（Cepeda et al., 2006, Psychological Bulletin）。
- **掌握学习**：达到掌握标准再进入下一单元（Bloom, 1968）。
- **认知负荷理论**：工作记忆有限，需分段、示例、减少 extraneous load（Sweller, 1988）。

**启示**：
- 课时 25–40 分钟，8–12 个块，每块 2–6 分钟；
- 每 6–8 分钟一个检查点；
- 每课 3–5 道检索题，1/3/7/21 天复习；
- 模块测验 ≥ 80 才解锁；
- 图要减少负荷，不是增加装饰。

### 发现 7：交互可视化有效，但「有引导」才有效

- **VisuAlgo** 用动画展示数据结构/算法，支持单步、速度、输入自定义；
  来源：[VisuAlgo](https://visualgo.net/)
- **Explorable Explanations** 社区用可操作模拟解释复杂概念；
  来源：[Explorable Explanations](https://explorabl.es/)

**启示**：
- 交互要服务于「预测/操纵/单步/构造」四种认知动作；
- 必须有引导、目标、解释与重置；
- 纯「点着玩」的交互是玩具，不是教学。

### 发现 8：方向课程可以对标研究生课，但要「降维」到可自学

可参考的研究生级课程/材料：

- AI：Stanford CS229（ML）、CS231n（CV）、CS224n（NLP）、CS285（RL）、CS336（LLM from scratch）；
- 系统：MIT 6.824（分布式）、CMU 15-445（数据库）、Stanford CS144（网络）；
- 安全：Berkeley CS161、MIT 6.858、CMU 18-330/18-730、pwn.college；
- 云：CNCF 培训与 Kubernetes 文档、Google SRE Book；
- 数据：Berkeley CS186、Red Book、Spark/Flink/湖仓论文；
- 图形：Berkeley CS184/284、*Real-Time Rendering*、SIGGRAPH 论文；
- 理论：MIT 6.045/6.046、Berkeley CS172；
- 编译：Stanford CS143、Cornell CS4120。

**启示**：方向课程要「对标研究生内容 + 降低数学/工具门槛 + 保留论文与项目」。
不能直接照搬研究生课表，否则零基础学习者会掉队。

---

## 2. 对标矩阵

| 来源 | 它最强的地方 | 我们采用 | 我们不采用 |
| --- | --- | --- | --- |
| CS2023 | 17 KA 的完整知识版图 | 做覆盖检查表；核心课覆盖 AL/AR/OS/NC/DM/SEC/SE/PDC/MSF 等 | 不按 KA 顺序开课；不追求每个 KA 等权重 |
| MIT 6-3 | 数学+系统+理论的 rigor | 核心课结构、6.1910/6.1800 式系统课、计算理论 | 不复制其学分/通识要求 |
| OSSU | 核心/高级/最终项目的分层 | 三层结构；最终项目 | 不照搬其课程清单（部分资源过时） |
| TeachYourselfCS | 9 个主题的深度与论文 | 每方向 100–200h 量级；论文阅读 | 不假设学习者已有工程经验 |
| CS144 | 从零实现 TCP | N01 的 Lab 设计 | 不要求一上来就写完整 TCP |
| 6.824 | 论文 + Raft/分片 KV | S05/N 方向的论文+Lab | 不要求 Go/分布式基础先行 |
| 15-445 | 数据库内核实现 | S04 的 buffer/B+树/事务 Lab | 不要求 C++ 大型项目经验 |
| Nand2Tetris/OSTEP | 从第一性原理构建 | P2 的 mini OS/CPU Lab | 不要求硬件专业深度 |
| Mayer/学习科学 | 多媒体/检索/间隔/掌握 | 课时模板、复习、测验 | 不做「长视频+PPT」 |
| VisuAlgo/Explorable | 交互可视化 | 可视化/交互组件库 | 不做无引导的玩具 |

---

## 3. 关键设计推论

| 调研发现 | 设计推论 | 落在哪份文档 |
| --- | --- | --- |
| 17 KA 覆盖广 | 核心 23 门 + 10 方向 63 门 | 02 |
| 顶尖 CS 重数学/系统/理论 | 数学 4 门、系统 6 门、理论 2 门 | 02/03 |
| 系统课要手写 | P2 四个 Lab（OS/TCP/DB/编译器） | 03/05 |
| 研究生 = 论文 + 实现 | 每方向 3–5 篇论文 + 复现 + 答辩 | 04 |
| 多媒体/认知负荷 | 一节课一个主角、8–12 块、图承担解释 | 05 |
| 检索/间隔/掌握 | 检查点、3–5 题、1/3/7/21 复习、80 分掌握 | 05/06 |
| 交互要引导 | 预测/操纵/单步/构造四类交互 | 05 |
| 自学者需要路径 | 诊断 + 知识图谱 + 4 条路径 | 02/06 |
| 内容生产是瓶颈 | 黄金路径 + 垂直切片 + 分阶段 | 08 |

---

## 4. 关键数字的依据

| 数字 | 依据 | 说明 |
| --- | --- | --- |
| 单门核心课 40–60h | MIT/OSSU 课程通常 10–14 周 × 5–10h/周 | 含实验/项目会更高 |
| 方向 600–800h | TeachYourselfCS 每主题 100–200h × 4–6 主题 | 含论文/项目 |
| 单路径 1,500–1,800h | 核心 ~1,000h + 方向 ~400h + 项目/研究 ~300h | 全职 1.5–2 年，在职 3–4 年 |
| 每课时 1–1.5h | 25–40 min 正文 + 30–60 min 练习 | 不含复习 |
| 3,000 课时 | 86 门 × 平均 35 课时 | 全站课程库，不是单人路径 |

> 这些是「量级估计」，不是精确预算。Phase 0 用真实学习者数据校准。

---

## 5. 参考来源清单

### 5.1 课程体系与培养方案

- ACM/IEEE-CS/AAAI, **Computer Science Curricula 2023 (CS2023)**：
  [Knowledge Areas](https://csed.acm.org/knowledge-areas/) ·
  [CS2023 官网](https://csed.acm.org/)
- MIT, **Computer Science and Engineering (Course 6-3)**：
  [Degree Chart](https://catalog.mit.edu/archive/2024-2025/degree-charts/computer-science-engineering-course-6-3/)
- OSSU, **Open Source Society University – Computer Science**：
  [GitHub](https://github.com/ossu/computer-science)
- **Teach Yourself Computer Science**：
  [teachyourselfcs.com](https://teachyourselfcs.com/)
- MIT, **The Missing Semester of Your CS Education**：
  [missing.csail.mit.edu](https://missing.csail.mit.edu/)

### 5.2 标杆课程

- Stanford, **CS144: Introduction to Computer Networking**：
  [cs144.github.io](https://cs144.github.io/)
- MIT, **6.824/6.5840: Distributed Systems**：
  [Schedule](https://pdos.csail.mit.edu/6.824/schedule.html)
- CMU, **15-445/645: Intro to Database Systems**：
  [Schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html)
- CMU, **15-213: Introduction to Computer Systems**：
  [cs.cmu.edu/~213](https://www.cs.cmu.edu/~213/)
- **Nand2Tetris**：
  [nand2tetris.org](https://www.nand2tetris.org/)
- **Operating Systems: Three Easy Pieces (OSTEP)**：
  [pages.cs.wisc.edu/~remzi/OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- Stanford, **CS336: Language Modeling from Scratch**：
  [cs336.stanford.edu](https://cs336.stanford.edu/)
- Stanford, **CS229: Machine Learning**：
  [cs229.stanford.edu](https://cs229.stanford.edu/)
- Stanford, **CS231n: Deep Learning for Computer Vision**：
  [cs231n.stanford.edu](https://cs231n.stanford.edu/)
- Stanford, **CS224n: NLP with Deep Learning**：
  [web.stanford.edu/class/cs224n](https://web.stanford.edu/class/cs224n/)
- Berkeley, **CS186: Introduction to Database Systems**：
  [cs186berkeley.net](https://cs186berkeley.net/)
- Berkeley, **CS161: Computer Security**：
  [cs161.org](https://cs161.org/)
- MIT, **6.858: Computer Systems Security**：
  [css.csail.mit.edu/6.858](https://css.csail.mit.edu/6.858/)
- **Readings in Database Systems (Red Book)**：
  [redbook.io](http://www.redbook.io/)
- Google, **Site Reliability Engineering**：
  [sre.google/sre-book](https://sre.google/sre-book/table-of-contents/)
- **CNCF Training**：
  [cncf.io/training](https://www.cncf.io/training/)
- **OWASP Top 10**：
  [owasp.org](https://owasp.org/www-project-top-ten/)
- **CSEC2017: Cybersecurity Curricula**：
  [ACM](https://www.acm.org/binaries/content/assets/education/curricula-recommendations/csec2017.pdf)

### 5.3 学习科学与交互学习

- Mayer, R. E. (2009). *Multimedia Learning* (2nd ed.). Cambridge University Press.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning.
  *Psychological Science*, 17(3), 249–255.
  [DOI](https://doi.org/10.1111/j.1467-9280.2006.01693.x)
- Cepeda, N. J., et al. (2006). Distributed practice in verbal recall tasks.
  *Psychological Bulletin*, 132(3), 354–380.
  [DOI](https://doi.org/10.1037/0033-2909.132.3.354)
- Bloom, B. S. (1968). Learning for mastery.
- Sweller, J. (1988). Cognitive load during problem solving.
  *Cognitive Science*, 12(2), 257–285.
- **VisuAlgo**：
  [visualgo.net](https://visualgo.net/)
- **Explorable Explanations**：
  [explorabl.es](https://explorabl.es/)

---

## 6. 调研的局限

1. **没有学习者访谈**：本文的画像与痛点来自课程体系与产品经验，需要 Phase 0 验证。
2. **没有课堂试验**：单课模板、时长、题目难度需要 3 个 Storyboard 试学校准。
3. **课程页面会变**：上述课程链接以 2026-10 公开信息为准，后续需定期复审。
4. **「硕士级」难以标准化**：本文用能力证据定义，不等于真实学位；需要外部评审/导师机制。
5. **AI 辅助内容的质量**：AI 可以加速草稿，但事实/代码/教学法必须人类审校。
6. **商业/运营未调研**：定价、获客、教师/企业采购、版权合作不在本次范围。

---

## 7. 下一步研究任务（Phase 0）

- [ ] 6–8 名目标学习者访谈（高中生/大学生/转行/研究生）；
- [ ] 3 个 Storyboard 的 5 人试学（F01、S03、A02）；
- [ ] 与 2–3 位 CS 教师/工程师做课程评审；
- [ ] 校准单课时间、题目难度、项目 Rubric；
- [ ] 建立内容来源与版权清单；
- [ ] 竞品分析：CS50、Brilliant、VisuAlgo、Educative、Coursera/edX 专项；
- [ ] 技术验证：浏览器 C 沙箱、SQL 沙箱、抓包回放、图组件性能。
