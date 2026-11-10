// Sizes for different places: attendee lists, host card, profile page.
// "frame" is the glass border around the tile, "text" is the initials size.
const SIZES = {
  small: { box: 'h-9 w-9', frame: 'p-[3px]', text: 'text-xs' },
  medium: { box: 'h-12 w-12', frame: 'p-[3px]', text: 'text-base' },
  large: { box: 'h-20 w-20', frame: 'p-1', text: 'text-2xl' },
}

// display picture: a glossy blue tile with the person's initials,
// inside a frosted glass frame, e.g. "Maya Khoury" -> "MK".
// In dark mode the frame turns to dark smoky glass so it doesn't glow on dark panes.
// Usage: <Avatar name={user.name} size="large" />
// Decoration only (aria-hidden), so always show the name as text next to it.
function Avatar({ name = '', size = 'medium', className = '' }) {
  const s = SIZES[size]

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    // Glass frame: light gradient with a sharp split in the middle, thin dark outline and soft shadow.
    // dark: smoky blue-gray glass with a faint light outline instead.
    <span
      aria-hidden="true"
      className={`flex shrink-0 rounded-[10px] bg-[linear-gradient(#ffffff,#d6ecfb_50%,#b4d8f3_51%,#e3f2fd)] shadow-[0_0_0_1px_rgba(0,60,120,0.45),0_3px_10px_rgba(0,40,90,0.4),inset_0_1px_0_#fff] dark:bg-[linear-gradient(#5d7a99,#2c4560_50%,#1d324a_51%,#3a5878)] dark:shadow-[0_0_0_1px_rgba(150,200,255,0.35),0_3px_10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] ${s.box} ${s.frame} ${className}`}
    >
      {/* Glossy tile: rich blue top half, darker bottom half, like Aero buttons. Slightly deeper blue in dark mode. */}
      <span
        className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-[linear-gradient(#6db8f0_0%,#3088d8_49%,#1764b8_50%,#3d95e3_100%)] font-bold text-white shadow-[inset_0_0_0_1px_rgba(0,50,110,0.5)] [text-shadow:0_1px_2px_rgba(0,30,70,0.6)] dark:bg-[linear-gradient(#6fb8ef_0%,#2a78c4_49%,#0f4f96_50%,#2a7acb_100%)] dark:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.5)] ${s.text}`}
      >
        {/* Shine: a soft white glass reflection over the top half */}
        <span className="absolute inset-x-[5%] top-[2%] h-[46%] rounded-t-sm rounded-b-[40%] bg-linear-to-b from-white/45 to-white/0 dark:from-white/50 dark:to-white/5" />

        {/* relative keeps the letters above the shine */}
        <span className="relative">{initials}</span>
      </span>
    </span>
  )
}

export default Avatar