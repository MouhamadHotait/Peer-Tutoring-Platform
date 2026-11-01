import { useEffect, useState } from 'react'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Adds or removes the "dark" class on <html> whenever isDark changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-linear-to-b from-white/40 to-white/10 text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] md:h-9 md:w-9"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle