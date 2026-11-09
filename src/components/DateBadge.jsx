import { getMonthAndDay } from '../utils/format'

// Sizes: "small" for list rows, "large" for the Session Details page
const SIZES = {
  small: {
    box: 'w-12 rounded',
    month: 'py-0.5 text-[11px]',
    day: 'py-0.5 text-xl font-semibold',
  },
  large: {
    box: 'w-20 rounded-lg',
    month: 'px-2 py-1',
    day: 'py-3 text-3xl font-bold',
  },
}

// Calendar tile showing a session's month and day.
// Usage: <DateBadge date={session.date} size="large" />
// Decoration only (aria-hidden), so the page should show the date as text too.
function DateBadge({ date, size = 'small', className = '' }) {
  const { month, day } = getMonthAndDay(date)
  const s = SIZES[size]

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 flex-col overflow-hidden border border-brand-800 text-center shadow-sm ${s.box} ${className}`}
    >
      <span className={`aero-calendar-month font-bold ${s.month}`}>{month}</span>
      <span className={`bg-white text-brand-900 ${s.day}`}>{day}</span>
    </span>
  )
}

export default DateBadge