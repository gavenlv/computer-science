import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { adjacentLessons, findLesson, getDomain, getLesson, getModule, stageGroups } from '../data'
import { useProgress } from '../store/ProgressContext'

export default function LessonPage() {
  const { domainId, moduleId, lessonId } = useParams()
  const domain = getDomain(domainId)
  const module = getModule(domain, moduleId)
  const lesson = getLesson(module, lessonId ?? '')
  const { isDone, toggle } = useProgress()

  if (!domain || !module || !lesson) {
    return (
      <div className="placeholder">
        没有找到该课时。
        <Link to="/"> 返回首页</Link>
      </div>
    )
  }

  const { prev, next } = adjacentLessons(lesson.id)
  const done = isDone(lesson.id)

  return (
    <div style={{ '--accent': domain.accent } as CSSProperties}>
      <div className="lesson-layout">
        <div>
          <header className="lesson-head">
            <span className="badge badge--accent">{module.title}</span>
            <h1>{lesson.title}</h1>
            <div className="lesson-head__meta">
              <span className="badge badge--accent">{module.stage}</span>
              <span className="badge">{lesson.level}</span>
              <span className="badge">{lesson.minutes} 分钟</span>
              <span className="badge">{domain.title}</span>
              <button
                type="button"
                className={done ? 'btn btn--ghost btn--sm' : 'btn btn--sm'}
                onClick={() => toggle(lesson.id)}
              >
                {done ? '取消完成标记' : '标记为已完成'}
              </button>
            </div>
          </header>

          <section className="card lesson-body">
            <h2>本课知识大纲</h2>
            <ol className="outline-list">
              {lesson.points.map((point, index) => (
                <li key={point}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {point}
                </li>
              ))}
            </ol>
            <div className="placeholder">
              正文内容待补充。后续可为该课时接入 Markdown / MDX 正文、代码示例与练习题，
              当前骨架已预留内容区，数据结构中的 <code>points</code> 即正文的章节标题来源。
            </div>
          </section>

          <nav className="pager">
            {prev ? (
              <Link className="pager__link" to={`/domain/${prev.domain.id}/${prev.module.id}/${prev.lesson.id}`}>
                <small>
                  上一课 · {prev.module.title}
                </small>
                <strong>{prev.lesson.title}</strong>
              </Link>
            ) : (
              <span className="pager__link pager__link--disabled" />
            )}
            {next ? (
              <Link
                className="pager__link pager__link--next"
                to={`/domain/${next.domain.id}/${next.module.id}/${next.lesson.id}`}
              >
                <small>
                  下一课 · {next.module.title}
                </small>
                <strong>{next.lesson.title}</strong>
              </Link>
            ) : (
              <span className="pager__link pager__link--disabled" />
            )}
          </nav>
        </div>

        <aside className="card side-panel">
          <h4>本模块课时</h4>
          <div className="side-panel__list">
            {module.lessons.map((item) => (
              <Link
                key={item.id}
                to={`/domain/${domain.id}/${module.id}/${item.id}`}
                className={`side-panel__item${item.id === lesson.id ? ' is-active' : ''}`}
              >
                <span className={`dot-state${isDone(item.id) ? ' is-done' : ''}`} />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
          <h4 style={{ marginTop: 18 }}>本板块成长路径</h4>
          <div className="side-panel__stages">
            {stageGroups(domain).map((group) => (
              <div key={group.stage}>
                <p className="side-panel__stage">{group.stage}</p>
                <div className="side-panel__list">
                  {group.modules.map((item) => (
                    <Link
                      key={item.id}
                      to={`/domain/${domain.id}/${item.id}`}
                      className={`side-panel__item${item.id === module.id ? ' is-active' : ''}`}
                    >
                      <span className="nav__dot" style={{ background: domain.accent }} />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <LessonFooter lessonId={lesson.id} />
    </div>
  )
}

/** 占位：展示当前课时在全站的定位，便于后续接入「相关课时 / 推荐练习」 */
function LessonFooter({ lessonId }: { lessonId: string }) {
  const ref = findLesson(lessonId)
  if (!ref) return null
  return (
    <p className="muted" style={{ marginTop: 18, fontSize: 12 }}>
      {ref.domain.title} / {ref.module.title} · 板块内第 {ref.order + 1} 课
    </p>
  )
}