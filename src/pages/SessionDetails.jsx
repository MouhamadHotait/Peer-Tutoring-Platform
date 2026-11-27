import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatLongDate, formatTime } from '../utils/format'
import Button from '../components/Button'
import DateBadge from '../components/DateBadge'
import ModePill from '../components/ModePill'
import TypeBadge from '../components/TypeBadge'
import MessageWindow from '../components/MessageWindow'
import Avatar from '../components/Avatar'
import Loading from '../components/Loading'
import Alert from '../components/Alert'

function SessionDetails() {
  const { id } = useParams()

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [busyAction, setBusyAction] = useState('')
  const [actionError, setActionError] = useState('')

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const data = await apiRequest(`/sessions/${id}`)
        if (!ignore) setSession(data)
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

  useEffect(() => {
    if (!showCancelModal) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShowCancelModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showCancelModal])

  function retry() {
    setLoading(true)
    setError('')
    setReloadKey((key) => key + 1)
  }

  async function handleAttendance(action) {
    setBusyAction(action)
    setActionError('')
    try {
      const updated = await apiRequest(`/sessions/${id}/${action}`, { method: 'POST' })
      setSession(updated)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyAction('')
    }
  }

  async function handleCancel() {
    setCancelling(true)
    setCancelError('')
    try {
      await apiRequest(`/sessions/${session._id}`, { method: 'DELETE' })
      setShowCancelModal(false)
      navigate('/sessions')
    } catch (err) {
      setCancelError(err.message)
      setCancelling(false)
    }
  }

  if (loading) return <Loading text="Loading session..." />

  if (error && error !== 'Session not found') {
    return <Alert type="error" onRetry={retry}>{error}</Alert>
  }

  if (!session) {
    return (
      <MessageWindow title="Session not found">
        <p>This session doesn't exist or was cancelled.</p>
        <Link to="/sessions" className="aero-btn aero-btn-primary w-full sm:w-auto">
          Browse sessions
        </Link>
      </MessageWindow>
    )
  }

  const { course, host, attendees } = session
  const spotsLeft = session.capacity - attendees.length

  const isHost = Boolean(currentUser) && currentUser._id === host?._id
  const isAttendee = attendees.some((attendee) => attendee._id === currentUser?._id)

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
        <div className="flex flex-col gap-4 lg:col-span-2">
          <section className="aero-glass rounded-lg px-1.5 pb-1.5">
            <p className="aero-glass-text px-2 py-2 font-semibold">
              Session information
            </p>

            <div className="aero-pane p-4">
              <DateBadge date={session.date} size="large" className="mb-4" />

              <div className="mb-3 flex flex-wrap gap-2">
                <TypeBadge type={session.type} />
                <ModePill mode={session.mode} />
              </div>

              <h1 className="text-2xl font-bold md:text-3xl">
                {session.title}
              </h1>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {course ? `${course.code} · ${course.name}` : 'Unknown course'}
              </p>
            </div>
          </section>

          <section
            className="aero-glass rounded-lg px-1.5 pb-1.5"
            aria-labelledby="about-heading"
          >
            <h2
              id="about-heading"
              className="aero-glass-text px-2 py-2 font-semibold"
            >
              About this session
            </h2>

            <div className="aero-pane p-4">
              <p>{session.description}</p>
            </div>
          </section>

          <section
            className="aero-glass rounded-lg px-1.5 pb-1.5"
            aria-labelledby="details-heading"
          >
            <h2
              id="details-heading"
              className="aero-glass-text px-2 py-2 font-semibold"
            >
              Details
            </h2>

            <div className="aero-pane p-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-600 dark:text-slate-300">
                    Date
                  </dt>
                  <dd className="font-semibold">
                    {formatLongDate(session.date)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-600 dark:text-slate-300">
                    Time
                  </dt>
                  <dd className="font-semibold">
                    {formatTime(session.time)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-600 dark:text-slate-300">
                    Format
                  </dt>
                  <dd className="font-semibold">
                    {session.mode === 'online' ? 'Online' : 'In person'}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-600 dark:text-slate-300">
                    Location
                  </dt>
                  <dd className="font-semibold">
                    {session.mode === 'online' ? (
                      isHost || isAttendee ? (
                        <a
                          href={session.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-700 underline dark:text-brand-300"
                        >
                          Open meeting link
                        </a>
                      ) : (
                        'Join the session to see the link'
                      )
                    ) : (
                      session.location
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-600 dark:text-slate-300">
                    Capacity
                  </dt>
                  <dd className="font-semibold">
                    {attendees.length} / {session.capacity} joined
                    {spotsLeft <= 0 && (
                      <span className="ml-2 text-red-700 dark:text-red-300">
                        Full
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section
            className="aero-glass rounded-lg px-1.5 pb-1.5"
            aria-labelledby="attendees-heading"
          >
            <h2
              id="attendees-heading"
              className="aero-glass-text px-2 py-2 font-semibold"
            >
              Attendees ({attendees.length})
            </h2>

            <div className="aero-pane p-4">
              {attendees.length === 0 ? (
                <p>No attendees yet.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {attendees.map((attendee) => (
                    <li
                      key={attendee._id}
                      className="flex items-center gap-3"
                    >
                      <Avatar name={attendee.name} size="small" />
                      <span>{attendee.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section
            className="aero-glass rounded-lg px-1.5 pb-1.5"
            aria-labelledby="host-heading"
          >
            <h2
              id="host-heading"
              className="aero-glass-text px-2 py-2 font-semibold"
            >
              Hosted by
            </h2>

            <div className="aero-pane p-4">
              {host ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={host.name} />

                    <div>
                      <p className="font-semibold">{host.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {host.major}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/tutors/${host._id}`}
                    className="aero-btn aero-btn-primary text-center"
                  >
                    View tutor profile
                  </Link>
                </div>
              ) : (
                <p>Host information unavailable.</p>
              )}
            </div>
          </section>

          <section
            className="aero-glass rounded-lg px-1.5 pb-1.5"
            aria-labelledby="actions-heading"
          >
            <h2
              id="actions-heading"
              className="aero-glass-text px-2 py-2 font-semibold"
            >
              Session actions
            </h2>

            <div className="aero-pane flex flex-col gap-3 p-4">
              {isHost ? (
                <div className="flex flex-col gap-3">
                  <p>You are hosting this session.</p>

                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/sessions/${session._id}/edit`)}
                  >
                    Edit session
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel session
                  </Button>
                </div>
              ) : isAttendee ? (
                <div className="flex flex-col gap-3">
                  <p>You have joined this session.</p>

                  <Button
                    variant="secondary"
                    disabled={busyAction !== ''}
                    onClick={() => handleAttendance('leave')}
                  >
                    {busyAction === 'leave' ? 'Leaving...' : 'Leave session'}
                  </Button>
                </div>
              ) : spotsLeft > 0 ? (
                <div className="flex flex-col gap-3">
                  <p>{spotsLeft} spots available.</p>

                  {currentUser ? (
                    <Button
                      disabled={busyAction !== ''}
                      onClick={() => handleAttendance('join')}
                    >
                      {busyAction === 'join' ? 'Joining...' : 'Join session'}
                    </Button>
                  ) : (
                    <Button onClick={() => navigate('/login')}>
                      Log in to join
                    </Button>
                  )}
                </div>
              ) : (
                <p>This session is full.</p>
              )}

              {actionError && <Alert type="error">{actionError}</Alert>}
            </div>
          </section>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            aria-describedby="cancel-text"
            className="aero-glass w-full max-w-md rounded-lg p-5"
          >
            <h2 id="cancel-title" className="mb-3 text-xl font-bold">
              Cancel session?
            </h2>

            <p id="cancel-text" className="mb-5">
              Are you sure you want to cancel this session? This action cannot be undone.
            </p>

            {cancelError && (
              <div className="mb-5">
                <Alert type="error">{cancelError}</Alert>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                autoFocus
                onClick={() => setShowCancelModal(false)}
              >
                Keep session
              </Button>

              <Button
                variant="danger"
                disabled={cancelling}
                onClick={handleCancel}
              >
                {cancelling ? 'Cancelling...' : 'Yes, cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SessionDetails
