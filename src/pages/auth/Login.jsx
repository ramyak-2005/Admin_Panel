
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/
function validateIdentifier(value) {
  const identifier = value.trim()
  const phone = identifier.replace(/[\s()-]/g, '')

  if (!identifier) {
    return 'Enter your email address or phone number.'
  }

  if (!EMAIL_PATTERN.test(identifier) && !PHONE_PATTERN.test(phone)) {
    return 'Enter a valid email address or phone number.'
  }

  return ''
}

export default function Login() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  
  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}
    const identifierError = validateIdentifier(identifier)

    if (identifierError) nextErrors.identifier = identifierError
    if (!password) nextErrors.password = 'Enter your password.'

    setErrors(nextErrors)
    setMessage('')

    if (Object.keys(nextErrors).length) return

  
navigate('/verify-otp', {
      state: {
        identifier: identifier.trim(),
        // Demo fallback only. The real authentication API must return the approved OTP destination.
        email: EMAIL_PATTERN.test(identifier.trim())
          ? identifier.trim()
          : 'r•••••@example.com',
        demoMode: true,
      },
    })

  }

  function handleReset() {
    setIdentifier('')
    setPassword('')
    setShowPassword(false)
    setErrors({})
    setMessage('')
  }

  function handleChange(field, value) {
    if (field === 'identifier') setIdentifier(value)
    else setPassword(value)

    setErrors((current) => ({ ...current, [field]: '' }))
    setMessage('')
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <div className="login-logo" aria-hidden="true">A</div>
          <p>ADMIN PORTAL</p>
        </div>

        <h1 id="login-title">Welcome back</h1>
        <p className="module-note">Demo mode: credentials are validated in the browser only.</p>
        <p className="login-subtitle">
          Sign in to access your administrator account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="identifier">Email address or phone number</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              placeholder="Enter email or phone number"
              value={identifier}
              onChange={(event) => handleChange('identifier', event.target.value)}
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={errors.identifier ? 'identifier-error' : undefined}
            />
            {errors.identifier && (
              <p className="field-error" id="identifier-error">
                {errors.identifier}
              </p>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => handleChange('password', event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="field-error" id="password-error">
                {errors.password}
              </p>
            )}
          </div>

         <button type="submit" className="login-button">
  Sign in
</button>

    <button
  type="button"
  className="reset-button"
  onClick={handleReset}
>
  Reset
</button>

          {message && (
            <p className="login-message" role="alert">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  )
}
