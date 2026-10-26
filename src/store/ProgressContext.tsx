import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { domains, lessonsOfDomain } from '../data'

const STORAGE_KEY = 'cs-learn:progress:v1'

interface ProgressValue {
  /** 已完成课时 id 集合 */
  completed: string[]
  doneCount: number
  isDone: (lessonId: string) => boolean
  toggle: (lessonId: string) => void
  reset: () => void
  /** 某个板块的完成比例（0~1） */
  ratioOf: (domainId: string) => number
}

const ProgressContext = createContext<ProgressValue | null>(null)

function readCompleted(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<string[]>(readCompleted)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
    } catch {
      /* 忽略隐私模式下的写入失败 */
    }
  }, [completed])

  const isDone = useCallback((lessonId: string) => completed.includes(lessonId), [completed])

  const toggle = useCallback((lessonId: string) => {
    setCompleted((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId],
    )
  }, [])

  const ratioOf = useCallback(
    (domainId: string) => {
      const lessons = lessonsOfDomain(domainId)
      if (!lessons.length) return 0
      const done = lessons.filter((lesson) => completed.includes(lesson.id)).length
      return done / lessons.length
    },
    [completed],
  )

  const value = useMemo<ProgressValue>(() => {
    const validCount = completed.filter((id) =>
      domains.some((domain) => domain.modules.some((m) => m.lessons.some((l) => l.id === id))),
    ).length
    return {
      completed,
      doneCount: validCount,
      isDone,
      toggle,
      reset: () => setCompleted([]),
      ratioOf,
    }
  }, [completed, isDone, toggle, ratioOf])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress 必须在 ProgressProvider 内使用')
  return ctx
}