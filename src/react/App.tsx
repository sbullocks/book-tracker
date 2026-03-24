import { useState, useRef } from 'react'
import { getBooks, addBook, filterBooks, sortBooks } from '../books'
import BookCard from './BookCard'
import type { FilterStatus, SortKey, Book } from '../books'

// ─── Component ───────────────────────────────────────────────────────────────

export default function App() {
  // useState needs explicit generics when the initial value would infer too broadly
  // 'all' alone infers as string — useState<FilterStatus> locks it to the union
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [sort, setSort] = useState<SortKey>('title')
  const [books, setBooks] = useState<Book[]>(getBooks())

  // useRef for DOM elements — always initialise with null, always pass the element type
  // titleRef.current is HTMLInputElement | null until the component mounts
  const titleRef = useRef<HTMLInputElement>(null)

  const visible = sortBooks(filterBooks(filter), sort)

  // React.ChangeEvent<HTMLSelectElement> — a change event fired by a <select> element
  // e.target.value is always string — cast to FilterStatus because we control the options
  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value as FilterStatus)
  }

  // React.FormEvent<HTMLFormElement> — a submit event fired by a <form> element
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const title = titleRef.current?.value // ?. because current is null before mount
    if (!title) return
    addBook(title, 'Unknown', 2024)
    setBooks(getBooks())
    if (titleRef.current) titleRef.current.value = '' // narrowing before writing to .value
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>📚 Book Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input ref={titleRef} placeholder="Book title" />
        <button type="submit">Add</button>
      </form>

      <select value={filter} onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="read">Read</option>
        <option value="unread">Unread</option>
      </select>

      <div>
        {visible.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

// ─── TS Reference ────────────────────────────────────────────────────────────
//
// useState
//   useState(0)                    → inferred fine for obvious primitives
//   useState<FilterStatus>('all')  → explicit needed — 'all' alone infers as string
//   useState<Book[]>(getBooks())   → explicit needed for arrays and complex types
//   Rule: if the initial value would infer too broadly, add the generic
//
// useRef (DOM refs)
//   useRef<HTMLInputElement>(null)
//   Always pass null as the initial value for DOM refs — the element doesn't exist yet
//   current is HTMLInputElement | null — use ?. or a narrowing check before accessing it
//   Common element types: HTMLInputElement, HTMLSelectElement, HTMLButtonElement, HTMLDivElement
//
// EVENT HANDLERS
//   Pattern: React.EventType<HTMLElementType>
//   onChange on <select>:  React.ChangeEvent<HTMLSelectElement>
//   onSubmit on <form>:    React.FormEvent<HTMLFormElement>
//   onClick on <button>:   React.MouseEvent<HTMLButtonElement>
//
// CASTING WITH `as`
//   e.target.value returns string — TS can't know it will always match FilterStatus
//   Use `as FilterStatus` when you have knowledge TS doesn't: the select only has 3 options
//   Don't overuse as — it overrides TS's checks. Only use it at controlled boundaries.
