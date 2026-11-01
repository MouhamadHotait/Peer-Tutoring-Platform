// Shared formatting helpers. Use these everywhere so dates and times look the same on every page.

// '2026-11-12' -> 'Thu, Nov 12'
export function formatDate(dateText) {
  return toDate(dateText).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// '2026-11-12' -> 'Thursday, November 12' (for detail pages)
export function formatLongDate(dateText) {
  return toDate(dateText).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

// '17:00' -> '5:00 PM'
export function formatTime(timeText) {
  const [hours, minutes] = timeText.split(':').map(Number)
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
// '2026-11-14' -> { month: 'NOV', day: 14 } (for calendar tiles)
export function getMonthAndDay(dateText) {
  const date = toDate(dateText)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate(),
  }
}
// How many days from today until this date: 0 = today, 1 = tomorrow, negative = past
export function daysFromToday(dateText) {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // start of today, so the time of day doesn't matter
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((toDate(dateText) - today) / msPerDay)
}
// Turns '2026-11-12' into a Date in the user's own time zone
function toDate(dateText) {
  const [year, month, day] = dateText.split('-').map(Number)
  return new Date(year, month - 1, day)
}