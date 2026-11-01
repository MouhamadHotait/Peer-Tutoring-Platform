// Shared Aero button. Usage:
// <Button onClick={...}>Join session</Button>          -> glossy blue (primary)
// <Button variant="secondary">Back</Button>            -> Windows 7 silver
// <Button variant="danger">Cancel session</Button>     -> glossy red
// <Button type="submit" className="w-full md:w-auto">Save</Button>
function Button({ children, variant = 'primary', type = 'button', className = '', ...rest }) {
  return (
    <button type={type} className={`aero-btn aero-btn-${variant} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export default Button