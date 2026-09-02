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
const pageSize = 3

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
  const [touched, setTouched] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [pageIndex, setPageIndex] = useState(0)

  const errors = useMemo(() => validate(form), [form])
  const hasErrors = Object.keys(errors).length > 0

  const filteredItems = useMemo(
    () =>
      categoryFilter === 'All'
        ? items
        : items.filter((item) => item.category === categoryFilter),
    [categoryFilter, items],
  )

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const currentPage = Math.min(pageIndex, pageCount - 1)
  const visibleItems = filteredItems.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  )
  const activeItem = items.find((item) => item.id === selectedId) ?? null

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setTouched((current) => ({ ...current, [name]: true }))
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
    setSelectedId(item.id)
    setPageIndex(Math.max(0, Math.ceil((filteredItems.length + 1) / pageSize) - 1))
    setForm(initialForm)
    setTouched({})
    setSubmitted(false)
  }

  function fieldError(name) {
    return (submitted || touched[name]) && errors[name] ? (
      <span className="field-error">{errors[name]}</span>
    ) : null
  }

  function changeFilter(event) {
    setCategoryFilter(event.target.value)
    setPageIndex(0)
  }

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Device Registry</p>
          <h1>Tech Gadget Inventory Hub</h1>
        </div>
        <div className="summary-strip" aria-label="Inventory summary">
          <span>{items.length} saved</span>
          <span>{filteredItems.length} showing</span>
          <span>{activeItem ? activeItem.category : 'No selection'}</span>
        </div>
      </section>

      <section className="workspace">
        <form className="registry-form" onSubmit={handleSubmit} noValidate>
          <div className="form-heading">
            <div>
              <p className="eyebrow">New Entry</p>
              <h2>Gadget Registration</h2>
            </div>
            <span className="entry-count">{items.length}</span>
          </div>

          <label>
            <span>Item Name</span>
            <input
              name="gadgetName"
              value={form.gadgetName}
              onChange={updateField}
              placeholder="Pixel Fold"
              aria-invalid={Boolean((submitted || touched.gadgetName) && errors.gadgetName)}
            />
            {fieldError('gadgetName')}
          </label>

          <label>
            <span>Category</span>
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              aria-invalid={Boolean((submitted || touched.category) && errors.category)}
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
              aria-invalid={Boolean(
                (submitted || touched.manufacturer) && errors.manufacturer,
              )}
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
              aria-invalid={Boolean(
                (submitted || touched.healthRating) && errors.healthRating,
              )}
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
              aria-invalid={Boolean((submitted || touched.techBrand) && errors.techBrand)}
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

        <section className="registry-panel">
          <div className="panel-toolbar">
            <div>
              <p className="eyebrow">Records</p>
              <h2>Registry Table</h2>
            </div>
            <label className="filter-control">
              <span>Category Filter</span>
              <select value={categoryFilter} onChange={changeFilter}>
                <option value="All">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Gadget</th>
                  <th>Category</th>
                  <th>Manufacturer</th>
                  <th>Health</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr
                    key={item.id}
                    className={item.id === selectedId ? 'selected' : ''}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <td>{item.gadgetName}</td>
                    <td>{item.category}</td>
                    <td>{item.manufacturer}</td>
                    <td>{item.healthRating}/100</td>
                    <td>{item.userRole}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!visibleItems.length ? (
            <div className="empty-state">
              <h3>{items.length ? 'No matching gadgets' : 'No gadgets yet'}</h3>
              <p>
                {items.length
                  ? 'Choose another category to bring records back into the table.'
                  : 'Submit a valid gadget to open the paginated registry.'}
              </p>
            </div>
          ) : null}

          <div className="pagination-bar">
            <button
              type="button"
              onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() =>
                setPageIndex((current) => Math.min(pageCount - 1, current + 1))
              }
              disabled={currentPage >= pageCount - 1}
            >
              Next
            </button>
          </div>

          <article className="detail-card">
            <div className="detail-heading">
              <div>
                <p className="eyebrow">Active Profile</p>
                <h2>{activeItem ? activeItem.gadgetName : 'Select a row'}</h2>
              </div>
              {activeItem ? <span className="role-badge">{activeItem.userRole}</span> : null}
            </div>

            {activeItem ? (
              <dl>
                <div>
                  <dt>Category</dt>
                  <dd>{activeItem.category}</dd>
                </div>
                <div>
                  <dt>Manufacturer</dt>
                  <dd>{activeItem.manufacturer}</dd>
                </div>
                <div>
                  <dt>Health Rating</dt>
                  <dd>{activeItem.healthRating}/100</dd>
                </div>
                <div>
                  <dt>Tech Brand</dt>
                  <dd>{activeItem.techBrand}</dd>
                </div>
                <div>
                  <dt>Registered</dt>
                  <dd>{activeItem.createdAt}</dd>
                </div>
              </dl>
            ) : (
              <p className="muted-text">
                Click a table row to sync the selected gadget into this profile card.
              </p>
            )}
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
