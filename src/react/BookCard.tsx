import type { Book } from '../books'

// ─── Module 8 Task ───────────────────────────────────────────────────────────
//
// Acceptance criteria:
//   [x] Define a Props interface for BookCard
//   [x] Apply it to the component function signature

interface Props {
  book: Book
  onRemove?: (id: number) => void  // optional — parent may or may not pass it
}

export default function BookCard({ book, onRemove }: Props) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: '1rem', marginBottom: '0.5rem' }}>
      <strong>{book.title}</strong>
      <div style={{ fontSize: '0.85rem', color: '#666' }}>{book.author} · {book.year}</div>
      <div>{book.status === 'read' ? '✓ Read' : '○ Unread'}</div>
      {onRemove && <button onClick={() => onRemove(book.id)}>Remove</button>}
    </div>
  )
}

// ─── TS Reference ────────────────────────────────────────────────────────────
//
// REACT PROPS
//   interface Props { book: Book; onRemove?: (id: number) => void }
//   function Component({ book, onRemove }: Props) { ... }
//   Optional prop with ? — parent can omit it; check before calling
//
// useState
//   useState<FilterStatus>('all')  → explicit when initial value would infer too broadly
//   useState<Book[]>(getBooks())   → explicit for arrays and complex types
//   useState(0)                    → inferred is fine for obvious primitives
//
// useRef
//   useRef<HTMLInputElement>(null) → always pass null as initial value for DOM refs
//   Access safely: titleRef.current?.value  (current can be null until mounted)
//
// EVENT HANDLERS
//   onChange:  React.ChangeEvent<HTMLSelectElement>
//   onSubmit:  React.FormEvent<HTMLFormElement>
//   onClick:   React.MouseEvent<HTMLButtonElement>
//   e.target.value returns string — cast with `as FilterStatus` when needed
//
// import type
//   Use `import type { Book }` for types — stripped at build time, cleaner output
