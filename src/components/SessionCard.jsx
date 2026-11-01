import { Link } from 'react-router-dom'
import { useSessions } from '../context/SessionsContext'
import { formatDate, formatTime } from '../utils/format'

// The text shown on the type badge for each type value in the data
const TYPE_LABELS = {
  tutoring: 'Tutoring',
  'study-group': 'Study group',
}

// A small Aero window showing one session. Usage: <SessionCard session={session} />
// The whole card is a link to the session's details page.
function SessionCard({ session }) {
  const { getCourseById } = useSessions()
  const course = getCourseById(session.courseId)

  const spotsLeft = session.capacity - session.attendeeIds.length
  const isOnline = session.mode === 'online'

  return (
    <Link
      to={`/sessions/${session.id}`}
      className="group aero-glass flex flex-col rounded-lg px-1.5 pb-1.5 transition hover:brightness-110 active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {/* Glass title bar with the badges */}
      <div className="flex flex-wrap gap-1.5 px-1 py-2">
        <span className="aero-badge">{TYPE_LABELS[session.type]}</span>
        <span className={`aero-badge ${isOnline ? 'aero-badge-online' : 'aero-badge-inperson'}`}>
          {isOnline ? 'Online' : 'In person'}
        </span>
      </div>

      {/* White content area */}
      <div className="aero-pane flex grow flex-col gap-2 p-3.5">
        <h3 className="text-lg leading-snug font-semibold group-hover:underline">{session.title}</h3>
        <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
          {course ? `${course.code} · ${course.name}` : 'Unknown course'}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {formatDate(session.date)} · {formatTime(session.time)}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-200 pt-2.5 dark:border-slate-700">
          <span className="text-sm">
            {spotsLeft > 0 ? (
              <>
                <strong className="text-brand-800 dark:text-brand-200">
                  {spotsLeft} of {session.capacity}
                </strong>{' '}
                spots left
              </>
            ) : (
              <strong className="text-red-700 dark:text-red-300">Full</strong>
            )}
          </span>

          {/* Arrow: shows the card opens something. Decoration only, so hidden from screen readers. */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-brand-600 transition group-hover:translate-x-0.5 dark:text-brand-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default SessionCard