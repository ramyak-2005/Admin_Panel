
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { accounts } from '../../data/accounts'
import PageSkeleton, { usePageSkeleton } from '../../components/common/PageSkeleton'

const FIELDS = [
  { name: 'organisationName', label: 'Organisation Name', required: true },
  { name: 'website', label: 'Website', type: 'url' },
  { name: 'registeredEmail', label: 'Registered Email', type: 'email', required: true },
  { name: 'accountId', label: 'Account ID', readOnly: true },
  { name: 'creationDate', label: 'Creation Date', readOnly: true },
  { name: 'country', label: 'Country' },
  { name: 'timezone', label: 'Timezone' },
  { name: 'addressLine1', label: 'Address Line 1' },
  { name: 'addressLine2', label: 'Address Line 2' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'pin', label: 'PIN' },
  { name: 'industry', label: 'Industry' },
  { name: 'vertical', label: 'Vertical' },
  { name: 'walletCurrency', label: 'Wallet Currency' },
  { name: 'defaultMailClass', label: 'Default Mail Class' },
]

const ORG_OPTIONS = {
  country: ['India', 'United States', 'United Kingdom', 'Singapore'],
  timezone: [
    'Asia/Kolkata',
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Singapore',
  ],
  industry: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail'],
  vertical: {
    Technology: ['Software', 'IT Services', 'Telecommunications'],
    Healthcare: ['Medical', 'Pharmaceuticals'],
    Finance: ['Banking', 'Insurance'],
    Education: ['Schools', 'Higher Education'],
    Retail: ['E-commerce', 'Wholesale'],
  },
  walletCurrency: ['INR', 'USD', 'EUR', 'GBP', 'SGD'],
  defaultMailClass: ['Transactional', 'Marketing', 'Promotional'],
}


const MODULES = [
  'Marketing Cloud',
  'API/SMTP',
  'Email Intelligence',
  'Email Verification',
]

const MODULE_ICONS = {
  'Marketing Cloud': '✉',
  'API/SMTP': '⌘',
  'Email Intelligence': '◉',
  'Email Verification': '✓',
}

const INITIAL_VALUES = {
  ...Object.fromEntries(FIELDS.map(({ name }) => [name, ''])),
  emailSpeedEnabled: false,
  emailSpeedLimit: '',
}


function validate(values) {
  const errors = {}

  if (!values.organisationName.trim()) {
    errors.organisationName = 'Organisation Name is required.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.registeredEmail.trim())) {
    errors.registeredEmail = 'Enter a valid email address.'
  }

  if (values.website.trim()) {
    try {
      if (!['http:', 'https:'].includes(new URL(values.website).protocol)) {
        errors.website = 'Enter a valid website URL.'
      }
    } catch {
      errors.website = 'Enter a valid website URL.'
    }
  }

  const pinPatterns = {
    India: /^\d{6}$/,
    'United States': /^\d{5}(-\d{4})?$/,
    Singapore: /^\d{6}$/,
    'United Kingdom': /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
  }

  const pin = values.pin.trim()
  const pattern = pinPatterns[values.country]

  if (pin && pattern && !pattern.test(pin)) {
    errors.pin = `Enter a valid PIN or postal code for ${values.country}.`
  }

  if (
    values.emailSpeedEnabled &&
    !/^\d+$/.test(String(values.emailSpeedLimit).trim())
  ) {
    errors.emailSpeedLimit = 'Enter a non-negative whole number.'
  }

  return errors
}


function OrganisationOverview({ initialValues }) {
  const [values, setValues] = useState(initialValues)
  const [draft, setDraft] = useState(initialValues)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  function startEditing() {
    setDraft({ ...values })
    setErrors({})
    setMessage('')
    setEditing(true)
  }

  function cancelEditing() {
    setDraft({ ...values })
    setErrors({})
    setMessage('')
    setEditing(false)
  }

  function updateField(name, value) {
    setDraft((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    setMessage('')

    if (Object.keys(nextErrors).length) return

    setValues({ ...draft })
    setEditing(false)
    setMessage('Changes saved in this session only. They have not been saved to a server.')
  }

  return (
    <section className="content-card detail-card">
      <div className="detail-card-header">
        <div>
          <h3>Organisation Overview</h3>
          <p className="module-note">Core organisation profile and account settings.</p>
        </div>
        {!editing && (
          <button type="button" className="secondary-button" onClick={startEditing}>
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="detail-fields">
          
{FIELDS.map(({ name, label, type = 'text', required, readOnly }) => {
  const value = editing ? draft[name] : values[name]
  const dropdowns = {
    country: ORG_OPTIONS.country,
    timezone: ORG_OPTIONS.timezone,
    industry: ORG_OPTIONS.industry,
    vertical: ORG_OPTIONS.vertical[draft.industry] || [],
    walletCurrency: ORG_OPTIONS.walletCurrency,
    defaultMailClass: ORG_OPTIONS.defaultMailClass,
  }
  const options = dropdowns[name]

  return (
    <div className="detail-field" key={name}>
      <label htmlFor={name}>
        {label}{required && ' *'}
      </label>

      {editing && !readOnly ? (
        options ? (
          <select
            id={name}
            value={value || ''}
            required={required}
            onChange={(e) => {
              updateField(name, e.target.value)
              if (name === 'industry') updateField('vertical', '')
            }}
          >
            <option value="">Select {label}</option>
            {options.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            type={type}
            value={value || ''}
            required={required}
            onChange={(e) => updateField(name, e.target.value)}
            aria-invalid={Boolean(errors[name])}
          />
        )
      ) : (
        <p className="detail-value">{value || '—'}</p>
      )}

      {errors[name] && (
        <p className="field-error">{errors[name]}</p>
      )}
    </div>
  )
})}


          <div className="detail-field">
            <label htmlFor="emailSpeedEnabled">Email Speed Enabled</label>
            {editing ? (
              <input
                id="emailSpeedEnabled"
                type="checkbox"
                checked={draft.emailSpeedEnabled}
                onChange={(event) => updateField('emailSpeedEnabled', event.target.checked)}
              />
            ) : (
              <p className="detail-value">{values.emailSpeedEnabled ? 'Enabled' : 'Disabled'}</p>
            )}
          </div>

          <div className="detail-field">
            <label htmlFor="emailSpeedLimit">Email Speed Limit / Hour</label>
            {editing ? (
              <>
                <input
                  id="emailSpeedLimit"
                  type="number"
                  min="0"
                  step="1"
                  disabled={!draft.emailSpeedEnabled}
                  value={draft.emailSpeedLimit}
                  onChange={(event) => updateField('emailSpeedLimit', event.target.value)}
                  aria-invalid={Boolean(errors.emailSpeedLimit)}
                  aria-describedby={errors.emailSpeedLimit ? 'emailSpeedLimit-error' : undefined}
                />
                {errors.emailSpeedLimit && (
                  <p className="field-error" id="emailSpeedLimit-error">{errors.emailSpeedLimit}</p>
                )}
              </>
            ) : (
              <p className="detail-value">{values.emailSpeedLimit || '—'}</p>
            )}
          </div>
        </div>

        {editing && (
          <div className="module-actions">
            <button type="button" className="secondary-button" onClick={cancelEditing}>
              Cancel
            </button>
            <button type="submit" className="primary-button">Save</button>
          </div>
        )}

        {message && <p className="login-message" role="status">{message}</p>}
      </form>
    </section>
  )
}

const SUBSCRIPTION_FIELDS = {
  'Marketing Cloud': [
    ['planType', 'Plan Type', 'select', 'Free,Paid'],
    ['status', 'Status', 'select', 'Active,Inactive,Suspended'],
    ['billingType', 'Billing Type', 'select', 'MRR,Prepaid'],
    ['startDate', 'Billing Start Date', 'date'],
    ['endDate', 'Billing End Date', 'date'],
    ['minimumCommitment', 'Monthly Minimum Commitment (Emails)', 'number'],
    ['contactType', 'Contact Type', 'select', 'Limited,Unlimited'],
    ['contactLimit', 'Contact Limit', 'number'],
    ['cost', 'Cost', 'number'],
    ['unlimitedEmail', 'Select Unlimited Email', 'select', 'Limited,Unlimited'],
    ['emailSendLimit', 'Email Send Limit', 'number'],
    ['additionalEmailLimit', 'Additional Email Limit', 'number'],
    ['creditNote', 'Credit Note', 'text'],
    ['changedReason', 'Changed Reason', 'text'],
  ],

  'API/SMTP': [
    ['accountType', 'Account Type', 'select', 'API,SMTP,Both'],
    ['status', 'Status', 'select', 'Active,Inactive,Suspended'],
    ['billingType', 'Billing Type', 'select', 'MRR,Prepaid'],
    ['startDate', 'Cycle Start Date', 'date'],
    ['endDate', 'Cycle Expiry Date', 'date'],
    ['cost', 'Cost', 'number'],
    ['sendType', 'Send Type', 'select', 'API,SMTP,Both'],
    ['emailLimit', 'Email Limit', 'number'],
    ['minimumCommitment', 'Email Minimum Commitment', 'number'],
    ['additionalEmailLimit', 'Additional Email Limit', 'number'],
    ['changedReason', 'Changed Reason', 'text'],
  ],

  'Email Intelligence': [
    ['status', 'Status', 'select', 'Active,Inactive,Suspended'],
    ['billingType', 'Billing Type', 'select', 'MRR,Prepaid'],
    ['mrr', 'MRR', 'number'],
    ['currency', 'Currency', 'select', 'INR,USD,EUR'],
    ['startDate', 'Cycle Start Date', 'date'],
    ['endDate', 'Cycle Expiry Date', 'date'],
    ['domainCount', 'Domain Count', 'number'],
    ['creditLimit', 'Credit Limit', 'number'],
    ['additionalCredits', 'Additional Credits', 'number'],
    ['cost', 'Cost', 'number'],
    ['changedReason', 'Changed Reason', 'text'],
  ],

  'Email Verification': [
    ['status', 'Status', 'select', 'Active,Inactive,Suspended'],
    ['billingType', 'Billing Type', 'select', 'MRR,Prepaid'],
    ['arr', 'ARR', 'number'],
    ['startDate', 'Cycle Start Date', 'date'],
    ['endDate', 'Cycle Expiry Date', 'date'],
    ['creditLimit', 'Credit Limit', 'number'],
    ['additionalCreditLimit', 'Additional Credit Limit', 'number'],
    ['cost', 'Cost', 'number'],
    ['changedReason', 'Changed Reason', 'text'],
  ],
}


const INITIAL_SUBSCRIPTION_VALUES = {
  'Marketing Cloud': {
    planType: 'Free', status: 'Active', billingType: 'Prepaid',
    startDate: '2026-10-01', endDate: '2027-10-01', minimumCommitment: '0',
    contactType: 'Limited', contactLimit: '100', cost: '0.00',
    unlimitedEmail: 'Limited', emailSendLimit: '50', additionalEmailLimit: '0',
    creditNote: 'Free Plan', changedReason: '',
  },
  'API/SMTP': {
    accountType: 'Both', status: 'Active', billingType: 'Prepaid',
    startDate: '2026-10-01', endDate: '2027-10-01', cost: '0.00',
    sendType: 'Both', emailLimit: '50', minimumCommitment: '0',
    additionalEmailLimit: '0', changedReason: '',
  },
  'Email Intelligence': {
    status: 'Inactive', billingType: 'Prepaid', mrr: '0.00', currency: 'INR',
    startDate: '2026-10-01', endDate: '2027-10-01', domainCount: '0',
    creditLimit: '1', additionalCredits: '0', cost: '0.00', changedReason: '',
  },
  'Email Verification': {
    status: 'Inactive', billingType: 'Prepaid', arr: '0.00',
    startDate: '2026-10-01', endDate: '2027-10-01', creditLimit: '1',
    additionalCreditLimit: '0', cost: '0.00', changedReason: '',
  },
}


function ModuleCard({ name }) {
  const initialValues = INITIAL_SUBSCRIPTION_VALUES[name]

  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState({ ...initialValues })
  const [draft, setDraft] = useState({ ...initialValues })
  const [message, setMessage] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState('')
  const [changeSummary, setChangeSummary] = useState([])

  const fields = SUBSCRIPTION_FIELDS[name]

  function cancel() {
    setDraft({ ...values })
    setEditing(false)
    setShowOtp(false)
    setOtp('')
    setMessage('')
    setChangeSummary([])
  }

  function startEditing() {
    setDraft({ ...values })
    setEditing(true)
    setShowOtp(false)
    setOtp('')
    setMessage('')
    setChangeSummary([])
  }

  function updateField(key, value) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }))
    setMessage('')
  }

  function handleSave() {
    setMessage('')

    if (!String(draft.changedReason || '').trim()) {
      setMessage(
        'Please enter a Changed Reason before saving subscription changes.'
      )
      return
    }

    for (const [key, label, type] of fields) {
      if (type !== 'number') continue

      const value = draft[key]

      if (value === '' || value === undefined) continue

      const numericValue = Number(value)

      if (!Number.isFinite(numericValue) || numericValue < 0) {
        setMessage(`${label} must be a non-negative number.`)
        return
      }

      if (
        !['cost', 'mrr', 'arr'].includes(key) &&
        !Number.isInteger(numericValue)
      ) {
        setMessage(`${label} must be a whole number.`)
        return
      }
    }

    if (
      draft.startDate &&
      draft.endDate &&
      draft.endDate < draft.startDate
    ) {
      setMessage('Expiry date cannot be earlier than the start date.')
      return
    }

    const changes = fields
      .filter(
        ([key]) =>
          String(draft[key] ?? '') !== String(values[key] ?? '')
      )
      .map(([key, label]) => ({
        label,
        before: values[key] || '—',
        after: draft[key] || '—',
      }))

    setChangeSummary(changes)
    setOtp('')
    setShowOtp(true)
  }

  function verifyOtp() {
    setMessage('')

    if (otp.length !== 6) {
      setMessage('Please enter the 6-digit demo OTP.')
      return
    }

    if (otp !== '123456') {
      setMessage('Invalid OTP. Please enter 123456 and try again.')
      return
    }

    setValues({ ...draft })
    setDraft({ ...draft })
    setEditing(false)
    setShowOtp(false)
    setOtp('')
    setChangeSummary([])

    setMessage(
      'Changes approved successfully in this demo session. No server or database was updated.'
    )
  }

  return (
    <section className="content-card subscription-card">
      <div className="detail-card-header">
        <div>
          <h3 className="module-title"><span className="module-icon" aria-hidden="true">{MODULE_ICONS[name] || '◈'}</span>{name}</h3>
          <p className="module-note">
            Status changes are logged. Plan edits and module toggles require
            OTP approval. Demo mode: changes are local only.
          </p>
        </div>

        {!editing && !showOtp && (
          <button
            type="button"
            className="secondary-button"
            onClick={startEditing}
          >
            Edit
          </button>
        )}
      </div>

      <div className="detail-fields">
        {fields.map(([key, label, type, options]) => (
          <div className="detail-field" key={key}>
            <label htmlFor={`${name}-${key}`}>
              {label}
              {key === 'changedReason' ? ' *' : ''}
            </label>

            {editing && !showOtp ? (
              type === 'select' ? (
                <select
                  id={`${name}-${key}`}
                  value={draft[key] ?? ''}
                  onChange={(event) =>
                    updateField(key, event.target.value)
                  }
                >
                  <option value="">Select</option>
                  {options?.split(',').map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`${name}-${key}`}
                  type={type}
                  min={type === 'number' ? 0 : undefined}
                  step={type === 'number' ? 'any' : undefined}
                  value={draft[key] ?? ''}
                  onChange={(event) =>
                    updateField(key, event.target.value)
                  }
                />
              )
            ) : (
              <p className="detail-value">
                {values[key] || '—'}
              </p>
            )}
          </div>
        ))}
      </div>

      {editing && !showOtp && (
        <div className="module-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={cancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}

      {showOtp && (
        <div className="content-card change-summary">
          <h4>Review changes before OTP approval</h4>

          {changeSummary.length > 0 ? (
            <ul>
              {changeSummary.map((change) => (
                <li key={change.label}>
                  <strong>{change.label}:</strong>{' '}
                  {change.before} → {change.after}
                </li>
              ))}
            </ul>
          ) : (
            <p>No subscription values were changed.</p>
          )}

          <p>
            <strong>Changed Reason:</strong>{' '}
            {draft.changedReason}
          </p>

          <p className="module-note">
            Demo OTP: <strong>123456</strong>. Enter this code
            to approve the changes.
          </p>
        </div>
      )}

      {showOtp && (
        <div className="module-actions">
          <label htmlFor={`${name}-otp`}>
            Enter 6-digit OTP
          </label>

          <input
            id={`${name}-otp`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            aria-label={`${name} approval OTP`}
            onChange={(event) => {
              setOtp(
                event.target.value.replace(/\D/g, '').slice(0, 6)
              )
              setMessage('')
            }}
          />

          <button
            type="button"
            className="primary-button"
            onClick={verifyOtp}
          >
            Verify OTP
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      )}

      {message && (
        <p className="login-message" role="status">
          {message}
        </p>
      )}
    </section>
  )
}


export default function AccountDetails() {
  const { id } = useParams()
  const loading = usePageSkeleton()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Organisation Overview')
  const account = accounts.find((item) => item.id === id)

  if (loading) return <PageSkeleton type="details" />

  if (!account) {
    return (
      <div className="account-details-page">
      <PageHeader title="Account Details" description="View and manage this organisation's profile, subscription, and settings." />
        <PageHeader title="Account Not Found" description="Organisation not found." />
        <button type="button" className="secondary-button" onClick={() => navigate('/accounts')}>
          Back to Accounts
        </button>
      </div>
    )
  }

  const initialValues = {
    ...INITIAL_VALUES,
    organisationName: account.orgName,
    accountId: account.id,
    creationDate: account.createdDate,
  }

  return (
    <div className="account-details-page">
      <PageHeader title="Account Details" description={`Organisation ID: ${id}`} />
      <div className="accounts-page-actions">
        <button type="button" className="secondary-button back-button" onClick={() => navigate('/accounts')}>
          ← Back to Accounts
        </button>
        <button type="button" className="secondary-button" onClick={() => navigate('/login')}>
          Back to Login
        </button>
      </div>

      <nav className="detail-tabs" aria-label="Account detail sections">
        {['Organisation Overview', 'Subscription', 'Settings'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
            aria-current={activeTab === tab ? 'page' : undefined}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'Organisation Overview' && (
        <OrganisationOverview key={id} initialValues={initialValues} />
      )}
      {activeTab === 'Subscription' && (
        <div className="subscription-grid">
          {MODULES.map((name) => <ModuleCard key={name} name={name} />)}
        </div>
      )}
      {activeTab === 'Settings' && (
        <section className="content-card">
          <h3>Settings</h3>
          <p className="module-note">Account settings are not configured yet.</p>
        </section>
      )}
    </div>
  )
}

