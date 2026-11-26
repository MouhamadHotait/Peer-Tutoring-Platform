// Shared success / error message for API results.
// Usage: {error && <Alert type="error">{error}</Alert>}
//        {success && <Alert type="success">Session created!</Alert>}
//        <Alert type="error" onRetry={loadSessions}>{error}</Alert>   -> adds a "Try again" button
import Button from './Button'

const STYLES = {
  error: 'border-red-300 bg-red-50/90 text-red-800',
  success: 'border-green-300 bg-green-50/90 text-green-800',
}

function Alert({ type = 'error', children, onRetry }) {
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'} // screen readers announce it
      className={`flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3 ${STYLES[type]}`}
    >
      <p>{children}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export default Alert