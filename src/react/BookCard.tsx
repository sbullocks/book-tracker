import type { Book } from '../books'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  book: Book
  onRemove?: (id: number) => void // optional — parent may or may not pass it
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BookCard({ book, onRemove }: Props) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: '1rem', marginBottom: '0.5rem' }}>
      <strong>{book.title}</strong>
      <div style={{ fontSize: '0.85rem', color: '#666' }}>{book.author} · {book.year}</div>
      <div>{book.status === 'read' ? '✓ Read' : '○ Unread'}</div>
      {onRemove && <button onClick={() => onRemove(book.id)}>Remove</button>}
      {/* onRemove is optional — guard it before calling */}
    </div>
  )
}

// ─── TS Reference ────────────────────────────────────────────────────────────
//
// PROPS INTERFACE
//   Define a Props interface for every component — it documents what the component
//   accepts and gives TS enough information to catch misuse at the call site
//   interface Props { book: Book; onRemove?: (id: number) => void }
//   function BookCard({ book, onRemove }: Props) { ... }
//
// OPTIONAL PROPS
//   onRemove?: (id: number) => void
//   The ? means the parent can omit it entirely — TS types it as the function | undefined
//   Always guard before calling: {onRemove && <button onClick={() => onRemove(id)} />}
//
// FUNCTION TYPES
//   (id: number) => void   → a function that takes a number and returns nothing
//   This is the shape of the callback — the parent defines the actual function,
//   the child just calls it. TS checks that the shapes match at the call site.
//
// IMPORT TYPE
//   import type { Book } from '../books'
//   Use import type for types — they're stripped at build time and never appear in the JS output
//   Keeps the bundle clean and makes it explicit that Book is only used for type checking
