/** 站点内容模型：板块（Domain）→ 模块（Module，含成长阶段）→ 课时（Lesson） */

/** 每个板块都必须走完的六个成长阶段，顺序即学习顺序 */
export const STAGES = ['零基础', '基础', '进阶', '高级', '项目实战', '专家级'] as const

export type Stage = (typeof STAGES)[number]

/** 课时难度 */
export type Level = '入门' | '基础' | '进阶' | '高级' | '专家'

export interface Lesson {
  id: string
  title: string
  level: Level
  /** 预计学习时长（分钟） */
  minutes: number
  /** 课时知识大纲，正文各章节的来源 */
  points: string[]
}

export interface Module {
  id: string
  title: string
  /** 所属成长阶段 */
  stage: Stage
  summary: string
  lessons: Lesson[]
}

export interface Domain {
  id: string
  title: string
  /** 用于徽标的两字缩写 */
  abbr: string
  tagline: string
  description: string
  /** 板块主题色 */
  accent: string
  /** 学完该板块能达到的水平 */
  outcome: string
  modules: Module[]
}

/** 课时构造器，让大纲数据保持紧凑可读 */
export const lesson = (
  id: string,
  title: string,
  level: Level,
  minutes: number,
  points: string[],
): Lesson => ({ id, title, level, minutes, points })

/** 模块构造器 */
export const mod = (
  id: string,
  title: string,
  stage: Stage,
  summary: string,
  lessons: Lesson[],
): Module => ({ id, title, stage, summary, lessons })