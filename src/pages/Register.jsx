import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSessions } from '../context/SessionsContext'
import { isValidEmail } from '../utils/validation'
import Input from '../components/Input'
import Button from '../components/Button'

// All fields empty at the start
const EMPTY_FORM = { name: '', email: '', major: '', bio: '', password: '', confirmPassword: '' }

// Returns an object with one message per invalid field (empty object = all good)
function validate(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'Full name is required.'
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'

  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email, like name@lau.edu.'

  if (!values.major) errors.major = 'Choose your major.'

  // The short bio is optional, so it has no rule

  if (!values.password) errors.password = 'Password is required.'
  else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.'

  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.'

  return errors
}

function Register() {
  const { register, currentUser } = useAuth()
  const { courses } = useSessions()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  // Major options, built from the course subjects (same as SessionList's Subject filter)
  const majors = [...new Set(courses.map((course) => course.subject))].sort()

  // Update one field, and clear its error (and the top alert) while the user types
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setFormError('')
  }

  function handleSubmit(e) {
    e.preventDefault() // stop the page from reloading

    const newErrors = validate(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return // stop: show the errors

    setFormError('')

    // Only send what a user object needs (no confirmPassword), cleaned up
    const result = register({
      name: form.name.trim(),
      email: form.email.trim(),
      major: form.major,
      bio: form.bio.trim(),
      password: form.password,
    })

    if (!result.ok) {
      // An already-used email is shown under the Email field, so the user knows what to fix
      if (result.error.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: result.error }))
      } else {
        setFormError(result.error) // any other problem goes in the top alert
      }
      return
    }
    navigate('/dashboard') // the new user is already logged in
  }

  // C. Already logged in (all hooks are above, so this early return is safe)
  if (currentUser) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-4 md:py-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="aero-glass-text text-2xl font-semibold md:text-3xl">Create your account</h1>
          <p className="aero-glass-text">You already have an account on this site.</p>
        </div>

        <section aria-labelledby="already-title" className="aero-glass rounded-lg px-2 pb-2">
          <h2 id="already-title" className="aero-glass-text px-1 py-2 text-sm font-semibold">
            You're already logged in
          </h2>
          <div className="aero-pane flex flex-col gap-4 p-4">
            <p>You're logged in as {currentUser.name}.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Link to="/dashboard" className="aero-btn aero-btn-primary w-full sm:w-auto">
                Go to My Sessions
              </Link>
              <Link to="/sessions" className="aero-btn aero-btn-secondary w-full sm:w-auto">
                Browse sessions
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    // A. Page wrapper: wider centered column than Login because of the two-column form
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-4 md:py-8">
      {/* Title on the sky */}
      <div className="flex flex-col gap-1.5">
        <h1 className="aero-glass-text text-2xl font-semibold md:text-3xl">Create your account</h1>
        <p className="aero-glass-text">Join sessions, or host your own to help other students.</p>
      </div>

      {/* B. "Your details" window; the form is the pane */}
      <section aria-labelledby="register-title" className="aero-glass rounded-lg px-2 pb-2">
        <h2 id="register-title" className="aero-glass-text px-1 py-2 text-sm font-semibold">
          Your details
        </h2>

        <form noValidate onSubmit={handleSubmit} className="aero-pane flex flex-col gap-4 p-4">
          {/* B1. Form-level alert (only for unexpected problems) */}
          {formError && (
            <p
              role="alert"
              className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
            >
              {formError}
            </p>
          )}

          {/* B2 + B3. Field grid: one column on phones, two from tablet */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="name"
              label="Full name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
            />

            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@lau.edu"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            {/* Major dropdown, built from the course subjects */}
            <Input
              as="select"
              id="major"
              label="Major"
              value={form.major}
              onChange={(e) => handleChange('major', e.target.value)}
              error={errors.major}
            >
              <option value="">Choose your major</option>
              {majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </Input>

            {/* Short bio spans the full width (it is shown on the Tutor Profile page) */}
            <div className="md:col-span-2">
              <Input
                as="textarea"
                id="bio"
                label="Short bio (optional)"
                placeholder="What do you study? What can you help with?"
                value={form.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                error={errors.bio}
              />
            </div>

            <Input
              id="password"
              label="Password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
            />

            <Input
              id="confirmPassword"
              label="Confirm password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
            />
          </div>

          {/* B4. Show / hide both password fields */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            Show passwords
          </label>

          {/* B5. Button row: secondary first, primary last (primary ends up on top on phones) */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link to="/login" className="aero-btn aero-btn-secondary w-full sm:w-auto">
              I already have an account
            </Link>
            <Button type="submit" className="w-full sm:w-auto">
              Create account
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Register
