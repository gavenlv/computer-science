import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { domains, getDomain, getLesson, getModule, totalStats } from '../data'
import { useProgress } from '../store/ProgressContext'

interface SearchEntry {
  lessonId: string
  title: string
  domainTitle: string
  moduleTitle: string
  to: string
}

/** 全站课时索引，用于顶栏搜索 */
const entries: SearchEntry[] = domains.flatMap((domain) =>
  domain.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      lessonId: lesson.id,
      title: lesson.title,
      domainTitle: domain.title,
      moduleTitle: module.title,
      to: `/domain/${domain.id}/${module.id}/${lesson.id}`,
    })),
  ),
)

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const { doneCount, reset } = useProgress()
  const totals = useMemo(() => totalStats(), [])

  // 路由变化时收起移动端抽屉与搜索结果
  useEffect(() => {
    setMenuOpen(false)
    setKeyword('')
  }, [location.pathname])

  const crumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    if (segments[0] !== 'domain') {
      return segments[0] === 'roadmap' ? [{ label: '学习路线', to: undefined }] : []
    }
    const domain = getDomain(segments[1])
    const module = getModule(domain, segments[2])
    const lesson = getLesson(module, segments[3])
    const items: { label: string; to?: string }[] = []
    if (domain) {
      items.push({ label: domain.title, to: `/domain/${domain.id}` })
      if (module) {
        items.push({ label: module.title, to: `/domain/${domain.id}/${module.id}` })
        if (lesson) items.push({ label: lesson.title })
      }
    }
    return items
  }, [location.pathname])

  const results = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (!q) return []
    return entries
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.moduleTitle.toLowerCase().includes(q) ||
          entry.domainTitle.toLowerCase().includes(q),
      )
      .slice(0, 8)
  }, [keyword])

  const goSearch = (entry: SearchEntry) => {
    navigate(entry.to)
    setKeyword('')
  }

  return (
    <div className="app">
      <aside className={`sidebar${menuOpen ? ' sidebar--open' : ''}`}>
        <Link to="/" className="brand">
          <span className="brand__mark">CS</span>
          <span className="brand__text">
            <strong>计科学习</strong>
            <small>计算机与编程学习路线</small>
          </span>
        </Link>

        <nav className="nav">
          <p className="nav__group">开始</p>
          <NavLink to="/" end className={({ isActive }) => `nav__item${isActive ? ' is-active' : ''}`}>
            <span className="nav__dot" />
            首页
          </NavLink>
          <NavLink to="/roadmap" className={({ isActive }) => `nav__item${isActive ? ' is-active' : ''}`}>
            <span className="nav__dot" />
            学习路线
          </NavLink>

          <p className="nav__group">学习板块</p>
          {domains.map((domain) => (
            <NavLink
              key={domain.id}
              to={`/domain/${domain.id}`}
              className={({ isActive }) => `nav__item${isActive ? ' is-active' : ''}`}
            >
              <span className="nav__dot" style={{ background: domain.accent }} />
              {domain.title}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__foot">
          <div className="sidebar__progress">
            <span>学习进度</span>
            <strong>
              {doneCount} / {totals.lessonCount}
            </strong>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={reset} disabled={!doneCount}>
            清空进度
          </button>
        </div>
      </aside>

      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden />}

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn topbar__menu"
            aria-label="切换导航"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className="crumbs" aria-label="面包屑">
            <Link to="/">首页</Link>
            {crumbs.map((crumb) => (
              <span key={crumb.label} className="crumbs__item">
                <i>/</i>
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <b>{crumb.label}</b>}
              </span>
            ))}
          </nav>

          <div className="search">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setKeyword('')
                if (event.key === 'Enter' && results[0]) goSearch(results[0])
              }}
              placeholder="搜索课时 / 模块"
              aria-label="搜索课时"
            />
            {keyword.trim() && (
              <ul className="search__results">
                {results.length === 0 && <li className="search__empty">没有匹配的课时</li>}
                {results.map((entry) => (
                  <li key={entry.lessonId}>
                    <button type="button" onClick={() => goSearch(entry)}>
                      <span className="search__title">{entry.title}</span>
                      <span className="search__meta">
                        {entry.domainTitle} · {entry.moduleTitle}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}