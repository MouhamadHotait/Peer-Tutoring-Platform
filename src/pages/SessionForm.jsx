import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSessions } from '../context/SessionsContext'
import { useAuth } from '../context/AuthContext'
import { daysFromToday } from '../utils/format'
import Input from '../components/Input'
import Button from '../components/Button'
import MessageWindow from '../components/MessageWindow'

const EMPTY_FORM = {
  title: '', courseId: '', type: 'tutoring', mode: 'online', location: '',
  date: '', time: '', capacity: '10', description: '',
}

function toForm(session) {
  return {
    title: session.title, courseId: String(session.courseId), type: session.type,
    mode: session.mode, location: session.location, date: session.date,
    time: session.time, capacity: String(session.capacity), description: session.description,
  }
}

function validate(values, existing) {
  const errors = {}
  const title = values.title.trim()
  if (!title) errors.title = 'Title is required.'
  else if (title.length < 5 || title.length > 80) errors.title = 'Title must be between 5 and 80 characters.'
  if (!values.courseId) errors.courseId = 'Choose a course.'
  if (!values.date) errors.date = 'Choose a date.'
  else if (daysFromToday(values.date) < 0) errors.date = 'The date cannot be in the past.'
  if (!values.time) errors.time = 'Choose a start time.'
  const capacity = Number(values.capacity)
  if (!values.capacity || !Number.isInteger(capacity) || capacity < 2 || capacity > 50) {
    errors.capacity = 'Capacity must be a whole number between 2 and 50.'
  } else if (existing && capacity < existing.attendeeIds.length) {
    const count = existing.attendeeIds.length
    errors.capacity = `${count} students already joined, so capacity cannot be lower than ${count}.`
  }
  if (!values.location.trim()) {
    errors.location = values.mode === 'online' ? 'Add the meeting link.' : 'Add where the session takes place.'
  } else if (values.mode === 'online' && !values.location.trim().startsWith('https://')) {
    errors.location = 'The link must start with https://.'
  }
  if (!values.description.trim()) errors.description = 'Description is required.'
  else if (values.description.trim().length < 20) errors.description = 'Description must be at least 20 characters.'
  return errors
}

// A changing key clears the form when moving between create and edit routes.
function SessionForm() {
  const { id } = useParams()
  return <SessionFormContent key={id ?? 'new'} id={id} />
}

function SessionFormContent({ id }) {
  const { courses, getSessionById, addSession, updateSession } = useSessions()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const isEdit = id !== undefined
  const existing = isEdit ? getSessionById(id) : null
  const [form, setForm] = useState(() => existing ? toForm(existing) : { ...EMPTY_FORM })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  function handleChange(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // A meeting link doesn't fit "In person" (and the reverse), so clear it
      if (field === 'mode') next.location = ''
      return next
    })
    setErrors((prev) => ({ ...prev, [field]: '', ...(field === 'mode' && { location: '' }) }))
    setFormError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate(form, existing)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      setFormError('Please fix the highlighted fields.')
      return
    }
    setFormError('')
    const data = {
      title: form.title.trim(), courseId: Number(form.courseId), type: form.type,
      mode: form.mode, location: form.location.trim(), date: form.date,
      time: form.time, capacity: Number(form.capacity), description: form.description.trim(),
    }
    if (isEdit) {
      updateSession(existing.id, data)
      navigate(`/sessions/${existing.id}`)
    } else {
      const newId = addSession({ ...data, hostId: currentUser.id })
      navigate(`/sessions/${newId}`)
    }
  }

  // Guard access before showing the form.
  if (!currentUser) {
    return <MessageWindow title="Log in to host a session">
      <p>You need an account to create or edit sessions.</p>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Link to="/login" className="aero-btn aero-btn-primary w-full sm:w-auto">Log in</Link>
        <Link to="/register" className="aero-btn aero-btn-secondary w-full sm:w-auto">Register</Link>
      </div>
    </MessageWindow>
  }
  if (isEdit && !existing) {
    return <MessageWindow title="Session not found">
      <p>This session doesn't exist or was cancelled.</p>
      <Link to="/sessions" className="aero-btn aero-btn-primary w-full sm:w-auto">Browse sessions</Link>
    </MessageWindow>
  }
  if (isEdit && existing.hostId !== currentUser.id) {
    return <MessageWindow title="Only the host can edit this session">
      <p>You can only edit sessions you host.</p>
      <Link to={`/sessions/${existing.id}`} className="aero-btn aero-btn-primary w-full sm:w-auto">Back to session</Link>
    </MessageWindow>
  }

  const sortedCourses = [...courses].sort((a, b) => a.code.localeCompare(b.code))
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-4 md:py-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="aero-glass-text text-2xl font-semibold md:text-3xl">{isEdit ? 'Edit session' : 'Host a session'}</h1>
        <p className="aero-glass-text">{isEdit ? `Update the details of ${existing.title}.` : 'Offer tutoring or open a study group for a course.'}</p>
      </div>
      <section aria-labelledby="session-details-title" className="aero-glass rounded-lg px-2 pb-2">
        <h2 id="session-details-title" className="aero-glass-text px-1 py-2 text-sm font-semibold">Session details</h2>
        <form noValidate onSubmit={handleSubmit} className="aero-pane flex flex-col gap-4 p-4">
          {formError && <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">{formError}</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input id="title" label="Title" placeholder="Calculus III Midterm Review" value={form.title} onChange={(e) => handleChange('title', e.target.value)} error={errors.title} />
            </div>
            <Input as="select" id="courseId" label="Course" value={form.courseId} onChange={(e) => handleChange('courseId', e.target.value)} error={errors.courseId}>
              <option value="">Choose a course</option>
              {sortedCourses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}
            </Input>
            <Input as="select" id="type" label="Type" value={form.type} onChange={(e) => handleChange('type', e.target.value)} error={errors.type}>
              <option value="tutoring">Tutoring</option><option value="study-group">Study group</option>
            </Input>
            <Input id="date" label="Date" type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} error={errors.date} />
            <Input id="time" label="Start time" type="time" value={form.time} onChange={(e) => handleChange('time', e.target.value)} error={errors.time} />
            <Input as="select" id="mode" label="Format" value={form.mode} onChange={(e) => handleChange('mode', e.target.value)} error={errors.mode}>
              <option value="online">Online</option><option value="in-person">In person</option>
            </Input>
            <Input id="capacity" label="Capacity" type="number" min="2" max="50" inputMode="numeric" value={form.capacity} onChange={(e) => handleChange('capacity', e.target.value)} error={errors.capacity} />
            <div className="md:col-span-2">
              <Input id="location" label={form.mode === 'online' ? 'Meeting link' : 'Place on campus'} type={form.mode === 'online' ? 'url' : 'text'} placeholder={form.mode === 'online' ? 'https://meet.google.com/...' : 'Library, Room 204'} value={form.location} onChange={(e) => handleChange('location', e.target.value)} error={errors.location} />
            </div>
            <div className="md:col-span-2">
              <Input as="textarea" id="description" label="Description" placeholder="What will you cover? What should people bring?" rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} error={errors.description} />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => navigate(-1)} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto">{isEdit ? 'Save changes' : 'Create session'}</Button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SessionForm
