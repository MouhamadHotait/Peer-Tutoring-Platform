
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSessions } from '../context/SessionsContext'
import { useAuth } from '../context/AuthContext'
import { formatLongDate, formatTime, getMonthAndDay } from '../utils/format'
import Button from '../components/Button'

function SessionDetails() {
  const { id } = useParams()

  const {
    getSessionById,
    getCourseById,
    joinSession,
    leaveSession,
    deleteSession,
  } = useSessions()

  const { currentUser, getUserById } = useAuth()
  const navigate = useNavigate()

  const [showCancelModal, setShowCancelModal] = useState(false)

  const session = getSessionById(id)

  if (!session) {
    return (
      <section className="aero-glass rounded-lg px-1.5 pb-1.5">
        <h1 className="aero-glass-text px-2 py-2 text-2xl font-bold">
          Session not found
        </h1>

        <div className="aero-pane p-4">
          <p className="mb-4">
            This session does not exist or may have been cancelled.
          </p>

          <Link to="/sessions" className="aero-btn aero-btn-primary">
            Browse sessions
          </Link>
        </div>
      </section>
    )
  }

  const course = getCourseById(session.courseId)
  const host = getUserById(session.hostId)
  const attendees = session.attendeeIds.map(getUserById).filter(Boolean)
  const spotsLeft = session.capacity - session.attendeeIds.length
  const isHost = currentUser?.id === session.hostId
  const isAttendee = currentUser
    ? session.attendeeIds.includes(currentUser.id)
    : false

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
            <h2 className="aero-glass-text px-2 py-2 font-semibold">
              Session information
            </h2>

            <div className="aero-pane p-4">
              <div
                className="mb-4 w-20 overflow-hidden rounded-lg"
                aria-hidden="true"
              >
                <div className="aero-calendar-month px-2 py-1 text-center font-bold">
                  {getMonthAndDay(session.date).month}
                </div>
                <div className="aero-pane py-3 text-center text-3xl font-bold">
                  {getMonthAndDay(session.date).day}
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <span className="aero-badge">
                  {session.type === 'tutoring' ? 'Tutoring' : 'Study group'}
                </span>

                <span
                  className={
                    session.mode === 'online'
                      ? 'aero-badge-online'
                      : 'aero-badge-inperson'
                  }
                >
                  {session.mode === 'online' ? 'Online' : 'In person'}
                </span>
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
                      <a
                        href={session.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-700 underline dark:text-brand-300"
                      >
                        Open meeting link
                      </a>
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
                    {session.attendeeIds.length} / {session.capacity} joined
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
                      key={attendee.id}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700 dark:bg-slate-700 dark:text-white">
                        {attendee.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{attendee.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section className="aero-glass rounded-lg px-1.5 pb-1.5">
            <h2 className="aero-glass-text px-2 py-2 font-semibold">
              Hosted by
            </h2>

            <div className="aero-pane p-4">
              {host ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-700 dark:bg-slate-700 dark:text-white">
                      {host.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold">{host.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {host.major}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/tutors/${host.id}`}
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

          <section className="aero-glass rounded-lg px-1.5 pb-1.5">
            <h2 className="aero-glass-text px-2 py-2 font-semibold">
              Session actions
            </h2>

            <div className="aero-pane flex flex-col gap-3 p-4">
              {isHost ? (
                <div className="flex flex-col gap-3">
                  <p>You are hosting this session.</p>

                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/sessions/${session.id}/edit`)}
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
                    onClick={() => leaveSession(session.id, currentUser.id)}
                  >
                    Leave session
                  </Button>
                </div>
              ) : spotsLeft > 0 ? (
                <div className="flex flex-col gap-3">
                  <p>{spotsLeft} spots available.</p>

                  {currentUser ? (
                    <Button
                      onClick={() => joinSession(session.id, currentUser.id)}
                    >
                      Join session
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
            className="aero-glass w-full max-w-md rounded-lg p-5"
          >
            <h2 id="cancel-title" className="mb-3 text-xl font-bold">
              Cancel session?
            </h2>

            <p className="mb-5">
              Are you sure you want to cancel this session? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Keep session
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  deleteSession(session.id)
                  setShowCancelModal(false)
                  navigate('/sessions')
                }}
              >
                Yes, cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SessionDetails
