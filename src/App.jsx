import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SessionList from './pages/SessionList'
import SessionDetails from './pages/SessionDetails'
import TutorProfile from './pages/TutorProfile'
import SessionForm from './pages/SessionForm'
import MySessions from './pages/MySessions'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
function App() {
  return (
    <div className="aero-sky min-h-screen">
      <ScrollToTop />
      <Navbar />
    <main className="mx-auto max-w-6xl p-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/sessions/new" element={<SessionForm />} />
        <Route path="/sessions/:id" element={<SessionDetails />} />
        <Route path="/sessions/:id/edit" element={<SessionForm />} />
        <Route path="/tutors/:id" element={<TutorProfile />} />
        <Route path="/dashboard" element={<MySessions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    </div>
  )
}

export default App