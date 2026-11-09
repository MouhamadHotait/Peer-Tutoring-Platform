// Pill showing whether a session is online or in person.
// Usage: <ModePill mode={session.mode} />
function ModePill({ mode, className = '' }) {
  const isOnline = mode === 'online'

  return (
    <span className={`aero-badge ${isOnline ? 'aero-badge-online' : 'aero-badge-inperson'} ${className}`}>
      {isOnline ? 'Online' : 'In person'}
    </span>
  )
}

export default ModePill