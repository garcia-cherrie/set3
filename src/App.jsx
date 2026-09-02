import { useMemo, useState } from 'react'
import './App.css'

const initialForm = {
  gadgetName: '',
  category: '',
  manufacturer: '',
  healthRating: '',
  techBrand: '',
  userRole: 'Engineer',
}

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Audio']

function validate(values) {
  const errors = {}
  const rating = Number(values.healthRating)

  if (values.gadgetName.trim().length < 3) {
    errors.gadgetName = 'Item name must be at least 3 characters.'
  }

  if (!values.category) {
    errors.category = 'Choose a gadget category.'
  }

  if (!values.manufacturer.trim()) {
    errors.manufacturer = 'Manufacturer is required.'
  }

  if (!values.techBrand.trim()) {
    errors.techBrand = 'Tech brand or company name is required.'
  }

  if (!values.healthRating || Number.isNaN(rating) || rating < 1 || rating > 100) {
    errors.healthRating = 'Health rating must be between 1 and 100.'
  }

  return errors
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => validate(form), [form])
  const hasErrors = Object.keys(errors).length > 0

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    if (hasErrors) {
      return
    }

    const item = {
      id: crypto.randomUUID(),
      ...form,
      healthRating: Number(form.healthRating),
      createdAt: new Date().toLocaleDateString(),
    }

    setItems((current) => [...current, item])
    setForm(initialForm)
    setSubmitted(false)
  }

  function fieldError(name) {
    return submitted && errors[name] ? (
      <span className="field-error">{errors[name]}</span>
    ) : null
  }

  return (
    <main className="app-shell">
      <section className="app-header">
        <p className="eyebrow">Set 3 Practical Exam</p>
        <h1>Tech Gadget Inventory Hub</h1>
        <p>
          Register gadgets with clean validation, organized data, and a polished
          pink interface.
        </p>
      </section>

      <section className="workspace">
        <form className="registry-form" onSubmit={handleSubmit} noValidate>
          <div className="form-heading">
            <div>
              <p className="eyebrow">Phase 1</p>
              <h2>Gadget Registration</h2>
            </div>
            <span className="entry-count">{items.length} saved</span>
          </div>

          <label>
            <span>Item Name</span>
            <input
              name="gadgetName"
              value={form.gadgetName}
              onChange={updateField}
              placeholder="Pixel Fold"
              aria-invalid={Boolean(submitted && errors.gadgetName)}
            />
            {fieldError('gadgetName')}
          </label>

          <label>
            <span>Category</span>
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              aria-invalid={Boolean(submitted && errors.category)}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {fieldError('category')}
          </label>

          <label>
            <span>Manufacturer</span>
            <input
              name="manufacturer"
              value={form.manufacturer}
              onChange={updateField}
              placeholder="Google"
              aria-invalid={Boolean(submitted && errors.manufacturer)}
            />
            {fieldError('manufacturer')}
          </label>

          <label>
            <span>Health Rating</span>
            <input
              name="healthRating"
              type="number"
              min="1"
              max="100"
              value={form.healthRating}
              onChange={updateField}
              placeholder="92"
              aria-invalid={Boolean(submitted && errors.healthRating)}
            />
            {fieldError('healthRating')}
          </label>

          <label>
            <span>Tech Brand Name</span>
            <input
              name="techBrand"
              value={form.techBrand}
              onChange={updateField}
              placeholder="Made by Google"
              aria-invalid={Boolean(submitted && errors.techBrand)}
            />
            {fieldError('techBrand')}
          </label>

          <fieldset>
            <legend>User Role</legend>
            <div className="role-options">
              {['Engineer', 'Tester'].map((role) => (
                <label className="radio-option" key={role}>
                  <input
                    type="radio"
                    name="userRole"
                    value={role}
                    checked={form.userRole === role}
                    onChange={updateField}
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className="primary-action" type="submit">
            Save Gadget
          </button>
        </form>

        <section className="empty-panel">
          <p className="eyebrow">Registry Preview</p>
          <h2>{items.length ? `${items.length} gadget saved` : 'No gadgets yet'}</h2>
          <p>
            Submit the form to start building the inventory table required for
            the next phase.
          </p>
        </section>
      </section>
    </main>
  )
}

export default App
