import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSessions } from '../context/SessionsContext'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import SessionCard from '../components/SessionCard'
import MessageWindow from '../components/MessageWindow'
import Avatar from '../components/Avatar'

// Tutor Profile page: who the tutor is, some stats, and the sessions they host.
function TutorProfile() {
  // The tutor id comes from the URL, e.g. /tutors/2 -> "2"
  const { id } = useParams()
  const { sessions, getCourseById } = useSessions()
  const { currentUser, getUserById } = useAuth()
  const navigate = useNavigate()

  const tutor = getUserById(id)

  // Wrong id in the URL
  if (!tutor) {
    return (
      <MessageWindow title="Tutor not found">
        <p>This tutor doesn't exist.</p>
        <Link to="/sessions" className="aero-btn aero-btn-primary w-full sm:w-auto">
          Browse sessions
        </Link>
      </MessageWindow>
    )
  }

  // This tutor's sessions, sorted by date, then time
  const hostedSessions = sessions
    .filter((session) => session.hostId === tutor.id)
    .sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    )

  // Each course only once, even if the tutor hosts several sessions for it
  const courseIds = [
    ...new Set(hostedSessions.map((session) => session.courseId)),
  ]

  // Total attendees across all of this tutor's sessions
  const studentsHelped = hostedSessions.reduce(
    (sum, session) => sum + session.attendeeIds.length,
    0
  )

  const isOwnProfile = currentUser?.id === tutor.id
  const firstName = tutor.name.split(' ')[0]

  // The three numbers shown in the stats row
  const stats = [
    { label: 'Sessions hosted', value: hostedSessions.length },
    { label: 'Courses', value: courseIds.length },
    { label: 'Students joined', value: studentsHelped },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        className="self-start"
      >
        Back
      </Button>

      {/* Two columns on large screens: profile card (1/3) and sessions (2/3) */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Profile card. Its title bar is a <p> so the tutor's name stays the page's first heading (h1). */}
        <section className="aero-glass self-start rounded-lg px-1.5 pb-1.5">
          <p className="aero-glass-text px-2 py-2 font-semibold">
            Tutor profile
          </p>

          <div className="aero-pane flex flex-col gap-4 p-4">
            <div className="flex items-center gap-4">
              <Avatar name={tutor.name} size="large" />

              <div className="min-w-0">
                <h1 className="text-2xl font-bold">
                  {tutor.name}
                </h1>

                <p className="font-semibold text-brand-700 dark:text-brand-300">
                  {tutor.major}
                </p>
              </div>
            </div>

            {isOwnProfile && (
              <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                This is your profile.
              </p>
            )}

            {tutor.bio ? (
              <p>{tutor.bio}</p>
            ) : (
              <p className="text-slate-600 dark:text-slate-300">
                This student hasn't written a bio yet.
              </p>
            )}

            {/* Stats. flex-col-reverse shows the number above its label,
                while the HTML keeps the label (<dt>) first for screen readers. */}
            <dl className="grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse rounded border border-brand-200 bg-brand-50 p-2 text-center dark:border-brand-800 dark:bg-brand-900/40"
                >
                  <dt className="text-xs text-slate-600 dark:text-slate-300">
                    {stat.label}
                  </dt>

                  <dd className="text-2xl font-bold text-brand-800 dark:text-brand-200">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div>
              <h2 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Courses tutored
              </h2>

              {courseIds.length === 0 ? (
                <p>No courses yet.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {courseIds.map((courseId) => {
                    const course = getCourseById(courseId)

                    return (
                      <li key={courseId} className="aero-badge">
                        {course?.code || 'Unknown course'}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section
          className="flex flex-col gap-3 lg:col-span-2"
          aria-labelledby="hosted-heading"
        >
          <h2
            id="hosted-heading"
            className="aero-glass-text text-xl font-semibold"
          >
            Sessions by {firstName}
          </h2>

          {hostedSessions.length === 0 ? (
            <div className="aero-glass rounded-lg p-1.5">
              <div className="aero-pane p-4">
                <p className="mb-4">
                  {firstName} isn't hosting any sessions right now.
                </p>

                <Link
                  to="/sessions"
                  className="aero-btn aero-btn-primary"
                >
                  Browse sessions
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {hostedSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TutorProfile