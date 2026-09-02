import { useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import './App.css'

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Audio']

const defaultForm = {
  gadgetName: '',
  category: '',
  manufacturer: '',
  healthRating: '',
  techBrand: '',
  userRole: 'Engineer',
}

function checkForm(data) {
  const error = {}
  const rating = Number(data.healthRating)

  if (data.gadgetName.trim().length < 3) {
    error.gadgetName = 'Item name must be at least 3 characters.'
  }

  if (!data.category) {
    error.category = 'Choose a gadget category.'
  }

  if (!data.manufacturer.trim()) {
    error.manufacturer = 'Manufacturer is required.'
  }

  if (!data.techBrand.trim()) {
    error.techBrand = 'Tech brand or company name is required.'
  }

  if (!data.healthRating || Number.isNaN(rating) || rating < 1 || rating > 100) {
    error.healthRating = 'Health rating must be between 1 and 100.'
  }

  return error
}

function App() {
  const [form, setForm] = useState(defaultForm)
  const [gadgets, setGadgets] = useState([])
  const [showError, setShowError] = useState(false)
  const [touched, setTouched] = useState({})
  const [view, setView] = useState('form')
  const [selectedId, setSelectedId] = useState('')
  const [selectedGadget, setSelectedGadget] = useState(null)
  const [filter, setFilter] = useState('All')

  const errors = useMemo(() => checkForm(form), [form])

  const filteredGadgets = useMemo(() => {
    if (filter === 'All') {
      return gadgets
    }

    return gadgets.filter((gadget) => gadget.category === filter)
  }, [filter, gadgets])

  const columns = useMemo(
    () => [
      { header: 'Gadget', accessorKey: 'gadgetName' },
      { header: 'Category', accessorKey: 'category' },
      { header: 'Manufacturer', accessorKey: 'manufacturer' },
      {
        header: 'Health',
        accessorKey: 'healthRating',
        cell: (info) => `${info.getValue()}/100`,
      },
      { header: 'Role', accessorKey: 'userRole' },
    ],
    [],
  )

  const table = useReactTable({
    data: filteredGadgets,
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
    const gadget = gadgets.find((item) => item.id === selectedId)
    setSelectedGadget(gadget || null)
  }, [gadgets, selectedId])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }))

    setTouched((oldTouched) => ({
      ...oldTouched,
      [name]: true,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setShowError(true)

    if (Object.keys(errors).length > 0) {
      return
    }

    const newGadget = {
      ...form,
      id: crypto.randomUUID(),
      healthRating: Number(form.healthRating),
      createdAt: new Date().toLocaleDateString(),
    }

    setGadgets((oldGadgets) => [...oldGadgets, newGadget])
    setSelectedId(newGadget.id)
    setView('table')
    setForm(defaultForm)
    setTouched({})
    setShowError(false)
  }

  function errorMessage(field) {
    if ((showError || touched[field]) && errors[field]) {
      return <span className="field-error">{errors[field]}</span>
    }

    return null
  }

  function hasError(field) {
    return Boolean((showError || touched[field]) && errors[field])
  }

  return (
    <main className="app-shell">
      <section className="app-header">
        <h1>Tech Gadget Inventory Hub</h1>
      </section>

      <section className="workspace">
        <form className="registry-form" onSubmit={handleSubmit} noValidate>
          <div className="form-heading">
            <h2>Gadget Registration</h2>
            <span className="entry-count">{gadgets.length} saved</span>
          </div>

          <label>
            <span>Item Name</span>
            <input
              name="gadgetName"
              value={form.gadgetName}
              onChange={handleChange}
              placeholder="Pixel Fold"
              aria-invalid={hasError('gadgetName')}
            />
            {errorMessage('gadgetName')}
          </label>

          <label>
            <span>Category</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              aria-invalid={hasError('category')}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errorMessage('category')}
          </label>

          <label>
            <span>Manufacturer</span>
            <input
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              placeholder="Google"
              aria-invalid={hasError('manufacturer')}
            />
            {errorMessage('manufacturer')}
          </label>

          <label>
            <span>Health Rating</span>
            <input
              name="healthRating"
              type="number"
              min="1"
              max="100"
              value={form.healthRating}
              onChange={handleChange}
              placeholder="92"
              aria-invalid={hasError('healthRating')}
            />
            {errorMessage('healthRating')}
          </label>

          <label>
            <span>Tech Brand Name</span>
            <input
              name="techBrand"
              value={form.techBrand}
              onChange={handleChange}
              placeholder="Made by Google"
              aria-invalid={hasError('techBrand')}
            />
            {errorMessage('techBrand')}
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
                    onChange={handleChange}
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
            <h2>Registry Table</h2>

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
                disabled={gadgets.length === 0}
              >
                Table
              </button>
            </div>
          </div>

          <div className="filter-bar">
            <label>
              <span>Category Filter</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="All">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <span className="filter-result">
              {filteredGadgets.length} matching record
              {filteredGadgets.length === 1 ? '' : 's'}
            </span>
          </div>

          {gadgets.length > 0 && view === 'table' ? (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    {table.getHeaderGroups().map((group) => (
                      <tr key={group.id}>
                        {group.headers.map((header) => (
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
                        className={row.original.id === selectedId ? 'selected' : ''}
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

              {filteredGadgets.length === 0 && (
                <div className="empty-state compact">
                  <h3>No matching gadgets</h3>
                  <p>Change the filter to bring records back into the table.</p>
                </div>
              )}

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
                  <p className="eyebrow">Active Profile</p>
                  <h2>
                    {selectedGadget ? selectedGadget.gadgetName : 'Select a row'}
                  </h2>
                </div>

                {selectedGadget ? (
                  <>
                    <span className="role-badge">{selectedGadget.userRole}</span>

                    <dl>
                      <div>
                        <dt>Category</dt>
                        <dd>{selectedGadget.category}</dd>
                      </div>

                      <div>
                        <dt>Manufacturer</dt>
                        <dd>{selectedGadget.manufacturer}</dd>
                      </div>

                      <div>
                        <dt>Health Rating</dt>
                        <dd>{selectedGadget.healthRating}/100</dd>
                      </div>

                      <div>
                        <dt>Tech Brand</dt>
                        <dd>{selectedGadget.techBrand}</dd>
                      </div>

                      <div>
                        <dt>Registered</dt>
                        <dd>{selectedGadget.createdAt}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <p className="muted-text">
                    Click a table row to sync the selected gadget into this profile
                    card.
                  </p>
                )}
              </article>
            </>
          ) : (
            <div className="empty-state">
              <h3>{gadgets.length ? 'Table ready' : 'No gadgets yet'}</h3>
              <p>Submit a valid gadget to open the paginated TanStack registry.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
