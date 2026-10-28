
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 30
const DEMO_OTP = '123456'

export default function OTPVerification() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || 'r•••••@example.com'
  const demoMode = location.state?.demoMode !== false

  const [otp, setOtp] = useState('')
  const [secondsRemaining, setSecondsRemaining] = useState(RESEND_COOLDOWN)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (secondsRemaining <= 0) return undefined

    const timer = setTimeout(() => {
      setSecondsRemaining((seconds) => seconds - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [secondsRemaining])

  function handleOtpChange(event) {
    const value = event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH)

    setOtp(value)
    setError('')
    setMessage('')
  }

  function handleVerify(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit OTP.`)
      return
    }

    if (otp !== DEMO_OTP) {
      setError('Invalid OTP. Please try again.')
      return
    }

    // Demo-only session marker. Replace with a server-issued authenticated session in production.
    sessionStorage.setItem('adminDemoAuthenticated', 'true')
    navigate('/dashboard')
  }

  function handleResend() {
    if (secondsRemaining > 0) return

    setOtp('')
    setError('')
    setMessage('OTP resend service integration is pending.')
    setSecondsRemaining(RESEND_COOLDOWN)
  }

  function handleBackToLogin() {
    navigate('/login')
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="otp-title">
        <div className="login-brand">
          <div className="login-logo" aria-hidden="true">
            A
          </div>
          <p>ADMIN PORTAL</p>
        </div>

        <h1 id="otp-title">Verify your identity</h1>
        {demoMode && <p className="module-note">Demo mode: use OTP 123456. This is not real authentication.</p>}

        <p className="login-subtitle">
          Enter the one-time password sent to your registered email address
          or phone number. For phone login, the masked destination below is a demo fallback.
        </p>

        
<div className="login-field">
    <label htmlFor="verification-email">
      Verification email
    </label>
    <input
      id="verification-email"
      type="text"
      value={email}
      readOnly
      aria-readonly="true"
    />
</div>

        <form onSubmit={handleVerify} noValidate>
          <div className="login-field">
            <label htmlFor="otp">One-time password (OTP)</label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={OTP_LENGTH}
              placeholder={`Enter ${OTP_LENGTH}-digit OTP`}
              value={otp}
              onChange={handleOtpChange}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'otp-error' : undefined}
              required
            />

            {error && (
              <p className="field-error" id="otp-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <button type="submit" className="login-button">
            Verify
          </button>

          <p className="login-subtitle otp-resend">
            Didn't receive a code?{' '}
            {secondsRemaining > 0 ? (
              <span>Resend available in {secondsRemaining}s</span>
            ) : (
              <button
                type="button"
                className="inline-link"
                onClick={handleResend}
              >
                Resend OTP
              </button>
            )}
          </p>

          <button
            type="button"
            className="reset-button"
            onClick={handleBackToLogin}
          >
            Back to login
          </button>

          {message && (
            <p className="login-message" role="status">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  )
}
