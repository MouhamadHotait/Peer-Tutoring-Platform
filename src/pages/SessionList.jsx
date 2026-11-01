import { useState } from 'react'
import { useSessions } from '../context/SessionsContext'
import SessionCard from '../components/SessionCard'
import Input from '../components/Input'
import Button from '../components/Button'
import { daysFromToday } from '../utils/format'

// How many days ahead each "When" option covers
const WHEN_DAYS = { week: 7, month: 30 }

// All filters empty = no filtering
const NO_FILTERS = { search: '', subject: '', courseId: '', when: '', mode: '' }

function SessionList() {
  const { sessions, courses, getCourseById } = useSessions()

  // draft = what's being set in the panel; applied = what the results use
  const [draft, setDraft] = useState(NO_FILTERS)
  const [applied, setApplied] = useState(NO_FILTERS)

  // Filter panel open or closed (only matters on phones; always open from md: up)
  const [showFilters, setShowFilters] = useState(false)

  // Change one field of the draft, keep the others
  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  // A new subject also resets the course, since the old course may not belong to it
  function changeSubject(value) {
    setDraft((prev) => ({ ...prev, subject: value, courseId: '' }))
  }

  // The "Show X sessions" button: apply everything and close the panel on phones
  function handleSubmit(e) {
    e.preventDefault() // stop the browser from reloading the page
    setApplied(draft)
    setShowFilters(false)
  }

  function clearFilters() {
    setDraft(NO_FILTERS)
    setApplied(NO_FILTERS)
  }

  // Returns the sessions that pass a given set of filters, sorted by date and time
  function filterSessions(filters) {
    const text = filters.search.trim().toLowerCase()
    return sessions
      .filter((session) => {
        const course = getCourseById(session.courseId)
        const matchesSearch =
          text === '' ||
          session.title.toLowerCase().includes(text) ||
          session.description.toLowerCase().includes(text)
        const matchesSubject = filters.subject === '' || course?.subject === filters.subject
        const matchesCourse = filters.courseId === '' || session.courseId === Number(filters.courseId)
        const days = daysFromToday(session.date)
        const matchesWhen = filters.when === '' || (days >= 0 && days <= WHEN_DAYS[filters.when])
        const matchesMode = filters.mode === '' || session.mode === filters.mode
        return matchesSearch && matchesSubject && matchesCourse && matchesWhen && matchesMode
      })
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
  }

  const results = filterSessions(applied) // what's shown
  const previewCount = filterSessions(draft).length // what the button promises

  // Is anything set, in the draft or in the applied filters?
  const hasFilters =
    Object.values(draft).some((value) => value !== '') ||
    Object.values(applied).some((value) => value !== '')

  // How many dropdowns are set, shown on the phone "Filters" button
  const activeDropdowns = ['subject', 'courseId', 'when', 'mode'].filter((key) => draft[key] !== '').length

  // Dropdown contents, built from the data
  const subjects = [...new Set(courses.map((course) => course.subject))].sort()
  const courseOptions = courses
    .filter((course) => draft.subject === '' || course.subject === draft.subject)
    .sort((a, b) => a.code.localeCompare(b.code))

  return (
    <div className="flex flex-col gap-6 py-4 md:py-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="aero-glass-text text-2xl font-semibold md:text-3xl">Browse sessions</h1>
        <p className="aero-glass-text">
          Find tutoring and study groups for your courses, online or on campus.
        </p>
      </div>

      {/* Search and filter window: the whole panel is one form */}
      <section aria-labelledby="filter-title" className="aero-glass rounded-lg px-2 pb-2">
        <h2 id="filter-title" className="aero-glass-text px-1 py-2 text-sm font-semibold">
          Search and filter
        </h2>
        <form role="search" onSubmit={handleSubmit} className="aero-pane flex flex-col gap-4 p-4">
          {/* Search box, plus the Filters toggle on phones */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                id="search"
                label="Search"
                type="search"
                placeholder='Topic, like "midterm" or "react"'
                value={draft.search}
                onChange={(e) => updateDraft('search', e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              Filters{activeDropdowns > 0 && ` (${activeDropdowns})`}
            </Button>
          </div>

          {/* Dropdowns: hidden on phones unless opened, always visible from md: up */}
          <div
            id="filter-panel"
            className={`${showFilters ? 'grid' : 'hidden'} grid-cols-1 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4`}
          >
            <Input as="select" id="subject" label="Subject" value={draft.subject} onChange={(e) => changeSubject(e.target.value)}>
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Input>

            <Input as="select" id="course" label="Course" value={draft.courseId} onChange={(e) => updateDraft('courseId', e.target.value)}>
              <option value="">All courses</option>
              {courseOptions.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} · {course.name}
                </option>
              ))}
            </Input>

            <Input as="select" id="when" label="When" value={draft.when} onChange={(e) => updateDraft('when', e.target.value)}>
              <option value="">Any time</option>
              <option value="week">Next 7 days</option>
              <option value="month">Next 30 days</option>
            </Input>

            <Input as="select" id="mode" label="Format" value={draft.mode} onChange={(e) => updateDraft('mode', e.target.value)}>
              <option value="">All formats</option>
              <option value="online">Online</option>
              <option value="in-person">In person</option>
            </Input>
          </div>

          {/* Applied count + actions */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p role="status">
              <strong>{results.length}</strong> {results.length === 1 ? 'session' : 'sessions'} found
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="secondary" onClick={clearFilters} disabled={!hasFilters}>
                Clear filters
              </Button>
              <Button type="submit">
                Show {previewCount} {previewCount === 1 ? 'session' : 'sessions'}
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <section className="aero-glass rounded-lg px-2 pb-2">
          <h2 className="aero-glass-text px-1 py-2 text-sm font-semibold">No results</h2>
          <div className="aero-pane flex flex-col items-start gap-3 p-4">
            <p>No sessions match your filters.</p>
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

export default SessionList