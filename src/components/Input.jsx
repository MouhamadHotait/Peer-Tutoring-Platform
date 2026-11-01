// Shared Aero form field with a label and an error message.
// Works for text inputs, dropdowns, and text areas:
//
// <Input id="email" label="Email" type="email" value={email}
//        onChange={(e) => setEmail(e.target.value)} error={errors.email} />
//
// <Input as="select" id="course" label="Course" value={courseId} onChange={...}>
//   <option value="">Choose a course</option>
//   <option value="1">CSC443 · Web Programming</option>
// </Input>
//
// <Input as="textarea" id="description" label="Description" value={...} onChange={...} />
function Input({ id, label, error, as: Tag = 'input', children, className = '', ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <Tag
        id={id}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`aero-field ${className}`}
        {...rest}
      >
        {children}
      </Tag>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input