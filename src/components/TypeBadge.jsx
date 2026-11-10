// The text shown for each session type in the data
const TYPE_LABELS = {
    tutoring: 'Tutoring',
    'study-group': 'Study group',
}

// Badge showing whether a session is tutoring or a study group.
// Usage: <TypeBadge type={session.type} />
function TypeBadge({ type, className = '' }) {
    return <span className={`aero-badge ${className}`}>{TYPE_LABELS[type]}</span>
}

export default TypeBadge