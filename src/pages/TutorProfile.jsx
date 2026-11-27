import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import SessionCard from '../components/SessionCard'
import MessageWindow from '../components/MessageWindow'
import Avatar from '../components/Avatar'
import Loading from '../components/Loading'
import Alert from '../components/Alert'

function TutorProfile() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const data = await apiRequest(`/users/${id}`)
        if (!ignore) setProfile(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [id, reloadKey])

  function retry() {
    setLoading(true)
    setError('')
    setReloadKey((key) => key + 1)
  }

  if (loading) return <Loading text="Loading profile..." />

  if (error && error !== 'User not found') {
    return <Alert type="error" onRetry={retry}>{error}</Alert>
  }

  if (!profile) {
    return (
      <MessageWindow title="Tutor not found">
        <p>This tutor doesn't exist.</p>
        <Link to="/sessions" className="aero-btn aero-btn-primary w-full sm:w-auto">
          Browse sessions
        </Link>
      </MessageWindow>
    )
  }

  const tutor = profile.user
  const hostedSessions = profile.sessions

  const courses = [
    ...new Map(
      hostedSessions.map((session) => [session.course._id, session.course])
    ).values(),
  ]

  const studentsHelped = hostedSessions.reduce(
    (sum, session) => sum + session.attendees.length,
    0
  )

  const isOwnProfile = currentUser?._id === tutor._id
  const firstName = tutor.name.split(' ')[0]

  const stats = [
    { label: 'Sessions hosted', value: hostedSessions.length },
    { label: 'Courses', value: courses.length },
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

      <div className="grid gap-4 lg:grid-cols-3">
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

              {courses.length === 0 ? (
                <p>No courses yet.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {courses.map((course) => (
                    <li key={course._id} className="aero-badge">
                      {course.code}
                    </li>
                  ))}
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
                  key={session._id}
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