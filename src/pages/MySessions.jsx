import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSessions } from '../context/SessionsContext'
import { useAuth } from '../context/AuthContext'
import { formatDate, formatTime, daysFromToday } from '../utils/format'
import SessionCard from '../components/SessionCard'
import Button from '../components/Button'
import MessageWindow from '../components/MessageWindow'

function MySessions() {
  const { sessions, leaveSession } = useSessions()
  const { currentUser } = useAuth()
  const [tab, setTab] = useState('hosting')

  if (!currentUser) {
    return <MessageWindow title="Log in to see your sessions">
      
      <p>Your dashboard shows the sessions you host and the ones you joined.</p>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Link to="/login" className="aero-btn aero-btn-primary w-full sm:w-auto">Log in</Link>
        <Link to="/register" className="aero-btn aero-btn-secondary w-full sm:w-auto">Register</Link>
      </div>
    </MessageWindow>
  }

  // Keep hosted and joined sessions sorted by date and time.
  const byDate = (a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  const hosting = sessions.filter((s) => s.hostId === currentUser.id).sort(byDate)
  const joined = sessions.filter((s) => s.attendeeIds.includes(currentUser.id)).sort(byDate)
    // The soonest session that hasn't happened yet (hosted or joined)
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
        <Link to={`/tutors/${currentUser.id}`} className="aero-btn aero-btn-secondary w-full sm:w-auto">View my profile</Link>
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
            <div key={session.id} className="flex flex-col gap-2">
              <SessionCard session={session} />
              {tab === 'hosting' ? (
                <Link to={`/sessions/${session.id}/edit`} className="aero-btn aero-btn-secondary" aria-label={`Edit ${session.title}`}>Edit</Link>
              ) : (
                <Button variant="secondary" onClick={() => leaveSession(session.id, currentUser.id)} aria-label={`Leave ${session.title}`}>Leave</Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MySessions
