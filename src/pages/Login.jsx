import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isValidEmail } from '../utils/validation'
import Input from '../components/Input'
import Button from '../components/Button'

// Returns an object with one message per invalid field (empty object = all good)
function validate(values) {
  const errors = {}
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email, like name@lau.edu.'
  if (!values.password) errors.password = 'Password is required.'
  return errors
}

function Login() {
  const { login, currentUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({}) // one message per field
  const [formError, setFormError] = useState('') // message coming from login()
  const [showPassword, setShowPassword] = useState(false)

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

    // Our own checks passed: ask the auth context to check the mock users
    setFormError('')
    const result = login(form.email.trim(), form.password)
    if (!result.ok) {
      setFormError(result.error) // 'Incorrect email or password.'
      return
    }
    navigate('/dashboard') // My Sessions page
  }

  // C. Already logged in (all hooks are above, so this early return is safe)
  if (currentUser) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-4 md:py-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="aero-glass-text text-2xl font-semibold md:text-3xl">Log in</h1>
          <p className="aero-glass-text">No need to log in again.</p>
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
    // A. Page wrapper: narrow centered column on laptops
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-4 md:py-8">
      {/* Title on the sky */}
      <div className="flex flex-col gap-1.5">
        <h1 className="aero-glass-text text-2xl font-semibold md:text-3xl">Log in</h1>
        <p className="aero-glass-text">Welcome back. Log in to join or host sessions.</p>
      </div>

      {/* B. "Your account" window; the form is the pane */}
      <section aria-labelledby="login-title" className="aero-glass rounded-lg px-2 pb-2">
        <h2 id="login-title" className="aero-glass-text px-1 py-2 text-sm font-semibold">
          Your account
        </h2>

        <form noValidate onSubmit={handleSubmit} className="aero-pane flex flex-col gap-4 p-4">
          {/* B1. Form-level alert (wrong email or password) */}
          {formError && (
            <p
              role="alert"
              className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
            >
              {formError}
            </p>
          )}

          {/* B2. Email */}
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />

          {/* B3. Password (type switches with the checkbox below) */}
          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
          />

          {/* B4. Show / hide password */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            Show password
          </label>

          {/* B5. Demo account hint */}
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Demo account: demo@lau.edu / demo1234
          </p>

          {/* B6. Button row: secondary first, primary last (primary ends up on top on phones) */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link to="/register" className="aero-btn aero-btn-secondary w-full sm:w-auto">
              Create an account
            </Link>
            <Button type="submit" className="w-full sm:w-auto">
              Log in
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Login
