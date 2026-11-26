// Base URL of our backend, e.g. http://localhost:5000/api (from the root .env file)
const BASE_URL = import.meta.env.VITE_API_URL

// One function for ALL backend calls.
//   apiRequest('/sessions')                                   -> GET
//   apiRequest('/sessions', { method: 'POST', body: data })   -> POST with JSON
// Returns the JSON data, or throws an Error with the backend's message.
export async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  // If someone is logged in, attach their token so protected routes accept the request
  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // fetch itself failed: server off, no internet, wrong URL...
    throw new Error('Cannot reach the server. Please try again.')
  }

  // Some responses (like a successful DELETE) may have no body
  const data = await response.json().catch(() => null)

  // Status 400, 401, 403, 404, 500... -> throw the message our error handler sent
  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong.')
  }

  return data
}