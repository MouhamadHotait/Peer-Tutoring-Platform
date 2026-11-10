# Null & Void – Peer Tutoring & Study Groups

CSC443 – Web Programming, Fall 2026 – Project Phase 1 (Frontend)

**Live site:** https://peer-tutoring-platform-five.vercel.app/

**Repository:** https://github.com/MouhamadHotait/Peer-Tutoring-Platform

## Team

- Mouhamad K. Hotait (team leader)
- Talal A. Jaafar
- Mohamad A. Moubarak
- Jad A. Yazbek

## Topic and Entities

Students offer tutoring or open study sessions for specific courses, and other students join them.

- **Sessions:** tutoring or study-group sessions for a course
- **Courses:** university courses the sessions are about
- **Tutors / Users:** students who host or join sessions (a tutor is a user who hosts sessions)

## Tech Stack

React (Vite), React Router, Tailwind CSS, Git & GitHub, deployed on Vercel.

## Run Locally

Requirements: Node.js and Git.

```bash
git clone https://github.com/MouhamadHotait/Peer-Tutoring-Platform.git
cd Peer-Tutoring-Platform
npm install
npm run dev
```

Then open http://localhost:5173

Demo account: `demo@lau.edu` / `demo1234`

## Pages and Contributions

| Member | Pages | Branch |
|---|---|---|
| Hotait | Homepage, Session List | `feature/home-session-list` |
| Jaafar | Session Details, Tutor Profile | `feature/details-tutor-profile` |
| Moubarak | Create/Edit Session, My Sessions | `feature/session-form-dashboard` |
| Yazbek | Login, Register | `feature/login-register` |

Hotait also built the project setup, routing, navbar, theme toggle, mock data, data contexts, shared components, the Aero design system, and deployment.

## How Mock Data Works

There is no backend in Phase 1. All data starts in `src/data/mockData.js` (courses, users, sessions). Two React contexts load this data into state and share it with every page:

- `SessionsContext`: create, edit, delete, join, and leave sessions
- `AuthContext`: login, register, logout, and the current user

Changes appear immediately across the app but reset when the page is refreshed. In Phase 2, these context functions will call the backend instead.

## Team Rules

- Never push to `main`. Work on your branch and open a pull request; the leader reviews and merges.
- Only edit your own page files and components you create. Ask the leader before changing shared files (`App.jsx`, `Navbar`, `context/`, `data/`, `index.css`).
- Pages never import `mockData.js` directly: use `useSessions()` and `useAuth()`.
- Use the shared `Button` and `Input` components, the Aero classes from `index.css` (`aero-glass`, `aero-pane`, `aero-glass-text`, `aero-badge`...), and the palette colors (`brand-...`, `accent-...`). Never hard-code colors.
- Mobile-first: phone styles first, then `md:` and `lg:`. Add `dark:` classes. Test on phone, iPad, and laptop sizes before a pull request.
- Every input has a label, every image has alt text.
- Small commits with clear messages.

## Screenshots

### Homepage
![Homepage](screenshots/home.png)

### Session List with filters
![Session list filtered to online sessions](screenshots/session-list.png)

### Session Details
![Session details page](screenshots/session-details.png)

### Tutor Profile
![Tutor profile page](screenshots/tutor-profile.png)

### Form validation
![Host a session form showing validation errors](screenshots/form-validation.png)

### My Sessions dashboard
![My Sessions dashboard](screenshots/my-sessions.png)

### Dark mode
![Homepage in dark mode](screenshots/dark-mode.png)

### Mobile
![Mobile view in dark mode](screenshots/mobile-dark.png)
![Mobile view with the menu open](screenshots/mobile-menu.png)
