import { STAGES, type Domain, type Lesson, type Module, type Stage } from '../types'
import { languages } from './languages'
import { dsa } from './dsa'
import { fundamentals } from './fundamentals'
import { engineering } from './engineering'
import { ai } from './ai'

export * from './roadmap'

/** 站点全部板块，顺序即推荐学习顺序 */
export const domains: Domain[] = [languages, dsa, fundamentals, engineering, ai]

export interface LessonRef {
  domain: Domain
  module: Module
  lesson: Lesson
  /** 该课时在所属板块内的全局序号（从 0 开始） */
  order: number
}

export const domainMap = new Map(domains.map((d) => [d.id, d]))

export function getDomain(domainId?: string): Domain | undefined {
  return domainId ? domainMap.get(domainId) : undefined
}

export function getModule(domain?: Domain, moduleId?: string): Module | undefined {
  return domain && moduleId ? domain.modules.find((m) => m.id === moduleId) : undefined
}

export function getLesson(module?: Module, lessonId?: string): Lesson | undefined {
  return module && lessonId ? module.lessons.find((l) => l.id === lessonId) : undefined
}

/** 板块内所有课时的线性序列，用于「上一课 / 下一课」 */
export function domainSequence(domain: Domain): LessonRef[] {
  const refs: LessonRef[] = []
  domain.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      refs.push({ domain, module, lesson, order: refs.length })
    })
  })
  return refs
}

export const lessonIndex = new Map<string, LessonRef>()
domains.forEach((domain) => {
  domainSequence(domain).forEach((ref) => lessonIndex.set(ref.lesson.id, ref))
})

export function findLesson(lessonId: string): LessonRef | undefined {
  return lessonIndex.get(lessonId)
}

/** 相邻课时（跨模块连续） */
export function adjacentLessons(lessonId: string): { prev?: LessonRef; next?: LessonRef } {
  const current = lessonIndex.get(lessonId)
  if (!current) return {}
  const seq = domainSequence(current.domain)
  return { prev: seq[current.order - 1], next: seq[current.order + 1] }
}

export interface StageGroup {
  stage: Stage
  modules: Module[]
}

/** 按六个成长阶段分组，只返回有内容的阶段，顺序固定 */
export function stageGroups(domain: Domain): StageGroup[] {
  return STAGES.map((stage) => ({
    stage,
    modules: domain.modules.filter((module) => module.stage === stage),
  })).filter((group) => group.modules.length > 0)
}

export function modulesOfStage(domain: Domain, stage: Stage): Module[] {
  return domain.modules.filter((module) => module.stage === stage)
}

/** 板块在某个阶段的课时数与完成进度分子 */
export function stageStats(domain: Domain, stage: Stage): { lessonCount: number; minutes: number } {
  const lessons = modulesOfStage(domain, stage).flatMap((module) => module.lessons)
  return {
    lessonCount: lessons.length,
    minutes: lessons.reduce((sum, lesson) => sum + lesson.minutes, 0),
  }
}

export interface DomainStats {
  moduleCount: number
  lessonCount: number
  minutes: number
  stageCount: number
}

export function domainStats(domain: Domain): DomainStats {
  const lessons = domain.modules.flatMap((m) => m.lessons)
  return {
    moduleCount: domain.modules.length,
    lessonCount: lessons.length,
    minutes: lessons.reduce((sum, l) => sum + l.minutes, 0),
    stageCount: stageGroups(domain).length,
  }
}

export function totalStats(): DomainStats {
  return domains.reduce<DomainStats>(
    (acc, domain) => {
      const s = domainStats(domain)
      return {
        moduleCount: acc.moduleCount + s.moduleCount,
        lessonCount: acc.lessonCount + s.lessonCount,
        minutes: acc.minutes + s.minutes,
        stageCount: STAGES.length,
      }
    },
    { moduleCount: 0, lessonCount: 0, minutes: 0, stageCount: 0 },
  )
}

export function lessonsOfDomain(domainId: string): Lesson[] {
  const domain = domainMap.get(domainId)
  return domain ? domain.modules.flatMap((m) => m.lessons) : []
}

/** 板块入门起点：第一个阶段的首个模块 */
export function entryModule(domain: Domain): Module | undefined {
  return domain.modules[0]
}

/** 把分钟数格式化成「x 小时 y 分钟」 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`
}