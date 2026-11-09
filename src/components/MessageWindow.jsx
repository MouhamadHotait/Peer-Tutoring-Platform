// Reusable window for login, missing session, and permission messages.
function MessageWindow({ title, children }) {
  return (
    <section aria-labelledby="message-title" className="aero-glass mx-auto my-4 w-full max-w-lg rounded-lg px-2 pb-2 md:my-8">
      <h1 id="message-title" className="aero-glass-text px-1 py-2 text-lg font-semibold">{title}</h1>
      <div className="aero-pane flex flex-col items-start gap-3 p-4">{children}</div>
    </section>
  )
}

export default MessageWindow
