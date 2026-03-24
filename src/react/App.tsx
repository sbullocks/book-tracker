import { useState, useRef } from 'react'
import { getBooks, addBook, filterBooks, sortBooks } from '../books'
import BookCard from './BookCard'
import type { FilterStatus, SortKey, Book } from '../books'

// ─── Module 8 Task ───────────────────────────────────────────────────────────
//
// Acceptance criteria:
//   [x] Type the props interface for BookCard (see BookCard.tsx)
//   [x] Type the useState hooks — explicit where TS can't infer the union
//   [x] Type the event handlers — onChange and onSubmit
//   [x] Type the useRef hook

export default function App() {
  const [filter, setFilter] = useState<FilterStatus>('all') // needs explicit — 'all' alone infers string
  const [sort, setSort] = useState<SortKey>('title') // needs explicit — 'title' alone infers string
  const [books, setBooks] = useState<Book[]>(getBooks()) // explicit is fine; getBooks() return type covers it

  const titleRef = useRef<HTMLInputElement>(null) // HTMLInputElement | null

  const visible = sortBooks(filterBooks(filter), sort)

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value as FilterStatus) // select values return string — cast to FilterStatus
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const title = titleRef.current?.value
    if (!title) return
    addBook(title, 'Unknown', 2024)
    setBooks(getBooks())
    // titleRef.current.value = ''
    if (titleRef.current) titleRef.current.value = ''
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
