import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  // Log out, close the menu, and go back to the homepage
  function handleLogout() {
    logout()
    closeMenu()
    navigate('/')
  }

  // Shared look for every menu item: tall on phones (easy to tap), compact from md: up
  const itemBase =
    'aero-glass-text flex min-h-11 items-center rounded border border-transparent px-3.5 md:min-h-9'

  // The current page gets the glowing glass pill
  const linkClass = ({ isActive }) => (isActive ? `${itemBase} aero-nav-active` : itemBase)

  return (
    <header className="aero-glass sticky top-0 z-20 rounded-none border-x-0 border-t-0">
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-2"
        aria-label="Main navigation"
      >
        <Link to="/" onClick={closeMenu} className="aero-glass-text text-xl font-bold">
          Null & Void
        </Link>

        {/* Theme toggle + menu button (on desktop, moved after the links) */}
        <div className="flex items-center gap-2 md:order-last">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="aero-glass-text flex h-11 w-11 items-center justify-center rounded border border-white/50 bg-linear-to-b from-white/40 to-white/10 text-2xl md:hidden"
            aria-expanded={isOpen}
            aria-controls="main-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <ul
          id="main-menu"
          className={`${isOpen ? 'flex' : 'hidden'} w-full flex-col gap-1 pt-3 pb-1 md:flex md:w-auto md:flex-row md:gap-1 md:p-0`}
        >
          <li><NavLink to="/" end onClick={closeMenu} className={linkClass}>Home</NavLink></li>
          <li><NavLink to="/sessions" onClick={closeMenu} className={linkClass}>Sessions</NavLink></li>

          {/* Links change depending on whether someone is logged in */}
          {currentUser ? (
            <>
              <li><NavLink to="/sessions/new" onClick={closeMenu} className={linkClass}>Host a Session</NavLink></li>
              <li><NavLink to="/dashboard" onClick={closeMenu} className={linkClass}>My Sessions</NavLink></li>
              <li>
                <button type="button" onClick={handleLogout} className={`${itemBase} w-full`}>
                  Logout ({currentUser.name.split(' ')[0]})
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" onClick={closeMenu} className={linkClass}>Login</NavLink></li>
              <li><NavLink to="/register" onClick={closeMenu} className={linkClass}>Register</NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar