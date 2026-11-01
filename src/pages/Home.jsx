import { useSessions } from '../context/SessionsContext'

function Home() {
  const { sessions } = useSessions()

  return <h1 className="aero-glass-text text-3xl font-semibold">Home: {sessions.length} sessions available</h1>
}

export default Home