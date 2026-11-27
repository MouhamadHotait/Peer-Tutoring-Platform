import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatDate, formatTime, daysFromToday } from '../utils/format'
import SessionCard from '../components/SessionCard'
import Button from '../components/Button'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import MessageWindow from '../components/MessageWindow'

function MySessions() {
  const { currentUser } = useAuth()
  return <MySessionsContent key={currentUser?._id ?? 'guest'} currentUser={currentUser} />
}

function MySessionsContent({ currentUser }) {
  const [tab, setTab] = useState('hosting')
  const [hosting, setHosting] = useState([])
  const [joined, setJoined] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [leaveError, setLeaveError] = useState('')
  const [leavingId, setLeavingId] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    let active = true

    async function loadSessions() {
      try {
        const data = await apiRequest('/sessions/mine')
        if (!active) return
        setHosting(data.hosting)
        setJoined(data.joined)
      } catch (error) {
        if (active) setLoadError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSessions()
    return () => { active = false }
  }, [currentUser])

  async function leaveSession(sessionId) {
    if (leavingId) return
    setLeavingId(sessionId)
    setLeaveError('')
    try {
      await apiRequest(`/sessions/${sessionId}/leave`, { method: 'POST' })
      setJoined((previous) => previous.filter((session) => session._id !== sessionId))
    } catch (error) {
      setLeaveError(error.message)
    } finally {
      setLeavingId(null)
    }
  }

  if (!currentUser) {
    return <MessageWindow title="Log in to see your sessions">
      
      <p>Your dashboard shows the sessions you host and the ones you joined.</p>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Link to="/login" className="aero-btn aero-btn-primary w-full sm:w-auto">Log in</Link>
        <Link to="/register" className="aero-btn aero-btn-secondary w-full sm:w-auto">Register</Link>
      </div>
    </MessageWindow>
  }

  if (loading) return <Loading />
  if (loadError) return <Alert>{loadError}</Alert>

  // Find the next session across both lists returned by the API.
  const byDate = (a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  const next = [...hosting, ...joined]
    .filter((s) => daysFromToday(s.date) >= 0)
    .sort(byDate)[0]
  const shown = tab === 'hosting' ? hosting : joined
  const firstName = currentUser.name.split(' ')[0]

  return (
    <div className="flex flex-col gap-6 py-4 md:py-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="aero-glass-text text-2xl font-semibold md:text-3xl">My Sessions</h1>
        <p className="aero-glass-text">Welcome back, {firstName}. Here are the sessions you host and the ones you joined.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/sessions/new" className="aero-btn aero-btn-primary w-full sm:w-auto">Host a session</Link>
        <Link to={`/tutors/${currentUser._id}`} className="aero-btn aero-btn-secondary w-full sm:w-auto">View my profile</Link>
      </div>
      <section aria-labelledby="overview-title" className="aero-glass rounded-lg px-2 pb-2">
        <h2 id="overview-title" className="aero-glass-text px-1 py-2 text-sm font-semibold">Overview</h2>
        <div className="aero-pane p-4">
          <ul className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-3">
            <li className="rounded-sm border border-brand-100 bg-brand-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">Hosting: <strong>{hosting.length}</strong> sessions</li>
            <li className="rounded-sm border border-brand-100 bg-brand-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">Joined: <strong>{joined.length}</strong> sessions</li>
            <li className="rounded-sm border border-brand-100 bg-brand-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">Next session: <strong>{next ? `${formatDate(next.date)} · ${formatTime(next.time)}` : 'Nothing planned'}</strong></li>
          </ul>
        </div>
      </section>
      <div role="group" aria-label="Choose which sessions to show" className="flex gap-2">
        <Button variant={tab === 'hosting' ? 'primary' : 'secondary'} aria-pressed={tab === 'hosting'} onClick={() => setTab('hosting')} className="flex-1 sm:flex-none">Hosting ({hosting.length})</Button>
        <Button variant={tab === 'joined' ? 'primary' : 'secondary'} aria-pressed={tab === 'joined'} onClick={() => setTab('joined')} className="flex-1 sm:flex-none">Joined ({joined.length})</Button>
      </div>
      {leaveError && <Alert>{leaveError}</Alert>}
      {shown.length === 0 ? (
        <section aria-labelledby="empty-title" className="aero-glass rounded-lg px-2 pb-2">
          <h2 id="empty-title" className="aero-glass-text px-1 py-2 text-sm font-semibold">{tab === 'hosting' ? 'No hosted sessions' : 'No joined sessions'}</h2>
          <div className="aero-pane flex flex-col items-start gap-3 p-4">
            <p>{tab === 'hosting' ? "You aren't hosting any sessions yet." : "You haven't joined any sessions yet."}</p>
            <Link to={tab === 'hosting' ? '/sessions/new' : '/sessions'} className="aero-btn aero-btn-primary w-full sm:w-auto">{tab === 'hosting' ? 'Host a session' : 'Browse sessions'}</Link>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((session) => (
            <div key={session._id} className="flex flex-col gap-2">
              <SessionCard session={session} />
              {tab === 'hosting' ? (
                <Link to={`/sessions/${session._id}/edit`} className="aero-btn aero-btn-secondary" aria-label={`Edit ${session.title}`}>Edit</Link>
              ) : (
                <Button variant="secondary" disabled={leavingId !== null} onClick={() => leaveSession(session._id)}
                  aria-label={`${leavingId === session._id ? 'Leaving' : 'Leave'} ${session.title}`}>
                  {leavingId === session._id ? 'Leaving...' : 'Leave'}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MySessions
