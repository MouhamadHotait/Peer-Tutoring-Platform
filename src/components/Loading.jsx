// Shared loading indicator, shown while waiting for the backend.
// Usage: if (loading) return <Loading />
//        <Loading text="Saving session..." />
function Loading({ text = 'Loading...' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-10">
      {/* Spinning ring: Tailwind's animate-spin rotates it forever */}
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-4 border-white/40 border-t-[var(--color-brand-600)]"
      />
      <span className="aero-glass-text">{text}</span>
    </div>
  )
}

export default Loading