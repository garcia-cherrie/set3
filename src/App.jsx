import { useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
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
  const [view, setView] = useState('form')
  const [selectedId, setSelectedId] = useState(null)
  const [activeItem, setActiveItem] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')

  const filteredItems = useMemo(
    () =>
      categoryFilter === 'All'
        ? items
        : items.filter((item) => item.category === categoryFilter),
    [categoryFilter, items],
  )

  const columns = useMemo(
    () => [
      {
        header: 'Gadget',
        accessorKey: 'gadgetName',
      },
      {
        header: 'Category',
        accessorKey: 'category',
      },
      {
        header: 'Manufacturer',
        accessorKey: 'manufacturer',
      },
      {
        header: 'Health',
        accessorKey: 'healthRating',
        cell: ({ getValue }) => `${getValue()}/100`,
      },
      {
        header: 'Role',
        accessorKey: 'userRole',
      },
    ],
    [],
  )

  const errors = useMemo(() => validate(form), [form])
  const hasErrors = Object.keys(errors).length > 0
  const table = useReactTable({
    data: filteredItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 3,
      },
    },
  })

  useEffect(() => {
    const nextActiveItem = items.find((item) => item.id === selectedId) ?? null
    setActiveItem(nextActiveItem)
  }, [items, selectedId])

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
    setSelectedId(item.id)
    setView('table')
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

        <section className="registry-panel">
          <div className="panel-toolbar">
            <div>
              <p className="eyebrow">Phase 2</p>
              <h2>Registry Table</h2>
            </div>
            <div className="view-switch" aria-label="View controls">
              <button
                type="button"
                className={view === 'form' ? 'active' : ''}
                onClick={() => setView('form')}
              >
                Form
              </button>
              <button
                type="button"
                className={view === 'table' ? 'active' : ''}
                onClick={() => setView('table')}
                disabled={!items.length}
              >
                Table
              </button>
            </div>
          </div>

          <div className="filter-bar">
            <label>
              <span>Category Filter</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="All">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <span className="filter-result">
              {filteredItems.length} matching record
              {filteredItems.length === 1 ? '' : 's'}
            </span>
          </div>

          {items.length && view === 'table' ? (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className={[
                          row.original.id === selectedId ? 'selected' : '',
                          row.original.category === categoryFilter ? 'filtered' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => setSelectedId(row.original.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {cell.column.columnDef.cell
                              ? flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )
                              : cell.getValue()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!filteredItems.length ? (
                <div className="empty-state compact">
                  <h3>No matching gadgets</h3>
                  <p>Change the filter to bring records back into the table.</p>
                </div>
              ) : null}

              <div className="pagination-bar">
                <button
                  type="button"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </button>
                <span>
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </span>
                <button
                  type="button"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </button>
              </div>

              <article className="detail-card">
                <div>
                  <p className="eyebrow">Phase 3 Active Profile</p>
                  <h2>{activeItem ? activeItem.gadgetName : 'Select a row'}</h2>
                </div>

                {activeItem ? (
                  <>
                    <span className="role-badge">{activeItem.userRole}</span>
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
                  </>
                ) : (
                  <p className="muted-text">
                    Click a table row to sync the selected gadget into this
                    profile card.
                  </p>
                )}
              </article>
            </>
          ) : (
            <div className="empty-state">
              <h3>{items.length ? 'Table ready' : 'No gadgets yet'}</h3>
              <p>
                Submit a valid gadget to open the paginated TanStack registry.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
