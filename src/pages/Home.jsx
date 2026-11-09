import { Link } from 'react-router-dom'
import { useSessions } from '../context/SessionsContext'
import { useAuth } from '../context/AuthContext'
import { formatLongDate, formatTime } from '../utils/format'
import DateBadge from '../components/DateBadge'
import ModePill from '../components/ModePill'

const TYPE_LABELS = {
  tutoring: 'Tutoring',
  'study-group': 'Study group',
}

function Home() {
  const { sessions, getCourseById } = useSessions()
  const { getUserById } = useAuth()

  // The 3 sessions coming up first, sorted by date, then time.
  // [...sessions] copies the array first, because sort() changes the array it's called on.
  const upcoming = [...sessions]
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 3)

  // The first one is featured, the rest go in the short list
  const [next, ...others] = upcoming

  return (
    <div className="flex flex-col gap-10 py-4 md:py-8">
      {/* Welcome section, directly on the sky */}
      <section className="flex flex-col gap-4 md:max-w-3xl">
        <h1 className="aero-glass-text text-3xl font-semibold text-balance md:text-5xl">
          Learn together, one session at a time
        </h1>
        <p className="aero-glass-text max-w-2xl text-lg text-balance">
          Join tutoring sessions and study groups for your LAU courses,{' '}
          <br className="hidden md:inline" />
          or host your own and help other students.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/sessions" className="aero-btn aero-btn-primary w-full sm:w-auto">
            Browse sessions
          </Link>
          <Link to="/sessions/new" className="aero-btn aero-btn-secondary w-full sm:w-auto">
            Host a session
          </Link>
        </div>
      </section>

      {/* Upcoming sessions window */}
      <section aria-labelledby="upcoming-title" className="aero-glass rounded-lg px-2 pb-2">
        <h2 id="upcoming-title" className="aero-glass-text px-1 py-2 text-sm font-semibold">
          Upcoming sessions
        </h2>

        <div className="aero-pane flex flex-col gap-5 p-4 md:p-5">
          {!next ? (
            <p>No sessions yet. Be the first to host one!</p>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Featured: the very next session */}
              <article className="flex min-w-0 flex-col gap-3.5 lg:flex-[1.6]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-brand-700 uppercase dark:text-brand-300">
                    Next up
                  </span>
                  <span className="aero-badge">{TYPE_LABELS[next.type]}</span>
                  <ModePill mode={next.mode} />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl leading-tight font-semibold md:text-3xl">{next.title}</h3>
                  <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                    {getCourseById(next.courseId)?.code} · {getCourseById(next.courseId)?.name}
                    {getUserById(next.hostId) && ` · hosted by ${getUserById(next.hostId).name}`}
                  </p>
                </div>

                <p className="leading-relaxed text-slate-700 dark:text-slate-300">{next.description}</p>

                <ul className="flex flex-wrap gap-2.5 text-sm">
                  <li className="rounded-sm border border-brand-100 bg-brand-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                    {formatLongDate(next.date)}
                  </li>
                  <li className="rounded-sm border border-brand-100 bg-brand-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                    {formatTime(next.time)}
                  </li>
                  <li className="rounded-sm border border-brand-100 bg-brand-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                    {next.capacity - next.attendeeIds.length > 0 ? (
                      <>
                        <strong>
                          {next.capacity - next.attendeeIds.length} of {next.capacity}
                        </strong>{' '}
                        spots left
                      </>
                    ) : (
                      <strong className="text-red-700 dark:text-red-300">Full</strong>
                    )}
                  </li>
                </ul>

                <Link
                  to={`/sessions/${next.id}`}
                  className="aero-btn aero-btn-primary w-full sm:w-auto sm:self-start"
                >
                  View session
                </Link>
              </article>

              {/* Short list: the next ones */}
              {others.length > 0 && (
                <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-6 lg:flex-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 dark:border-slate-700">
                  <h3 className="text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                    Also coming up
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {others.map((session) => (
                      <li key={session.id}>
                        <Link to={`/sessions/${session.id}`} className="aero-row flex items-center gap-3 p-2.5">
                          {/* Calendar tile: decoration only, the date is also in the hidden text */}
                          <DateBadge date={session.date} />

                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="font-semibold">{session.title}</span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              <span className="sr-only">{formatLongDate(session.date)}, </span>
                              {getCourseById(session.courseId)?.code} · {formatTime(session.time)}
                            </span>
                          </span>

                          <ModePill mode={session.mode} className="shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <Link
            to="/sessions"
            className="self-end font-semibold text-brand-700 underline underline-offset-4 hover:no-underline dark:text-brand-300"
          >
            See all sessions →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home