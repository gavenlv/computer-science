import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import DomainPage from './pages/DomainPage'
import Home from './pages/Home'
import LessonPage from './pages/LessonPage'
import ModulePage from './pages/ModulePage'
import RoadmapPage from './pages/RoadmapPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/domain/:domainId" element={<DomainPage />} />
        <Route path="/domain/:domainId/:moduleId" element={<ModulePage />} />
        <Route path="/domain/:domainId/:moduleId/:lessonId" element={<LessonPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}