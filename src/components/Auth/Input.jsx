import "./usable.css"
export default function Input({
  label,
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  errorStatus,
  icon,          
  onIconClick,
  ...rest
      
}) {

  
  return (
    <div className="auth-ip-container">
      {label && <h1 className="auth-ip-label">{label[0].toUpperCase() + label.slice(1)}</h1>}

      <div className={`auth-ip-wrapper ${icon ? "has-icon" : ""}`}>
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="auth-input-field"
          {...rest}
        />

        {icon && (
          <button
            type="button"
            className="auth-ip-icon-btn"
            onClick={onIconClick}
          >
            {icon}
          </button>
        )}
      </div>

      {errorStatus !== null && (
      <div className="auth-ip-error-box">
        {errorStatus && (
          <span className="auth-ip-error-text">{errorStatus}</span>
        )}
      </div> )}
    </div>
  );
}
