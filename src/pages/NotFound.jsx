import { Link } from 'react-router-dom'
import MessageWindow from '../components/MessageWindow'

// Shown when the URL doesn't match any route
function NotFound() {
  return (
    <MessageWindow title="Page not found">
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="aero-btn aero-btn-primary w-full sm:w-auto">
        Go to homepage
      </Link>
    </MessageWindow>
  )
}

export default NotFound