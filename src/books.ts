// books.ts — data layer: Book shape, store, and all operations

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Book {
  id: number
  title: string
  author: string
  year: number
  status: BookStatus
  rating: number | null // always present; null means unrated
}

export type BookStatus = 'read' | 'unread'
export type FilterStatus = 'all' | BookStatus
export type SortKey = 'title' | 'author' | 'year'
export type BookSummary = Pick<Book, 'id' | 'title' | 'author'>

// ─── Store ───────────────────────────────────────────────────────────────────

let nextId = 1 // TS infers number from the value — no annotation needed
let books: Book[] = [
  { id: nextId++, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', year: 1999, status: 'read', rating: 5 },
  { id: nextId++, title: 'Clean Code', author: 'Robert C. Martin', year: 2008, status: 'read', rating: 4 },
  { id: nextId++, title: "You Don't Know JS", author: 'Kyle Simpson', year: 2015, status: 'unread', rating: null },
  { id: nextId++, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', year: 2017, status: 'unread', rating: null },
]

// ─── Operations ──────────────────────────────────────────────────────────────

export function getBooks(): Book[] {
  return [...books] // spread creates a shallow copy so callers can't mutate the store directly
}

export function addBook(
  title: string,
  author: string,
  year: number,
  rating?: number, // optional — caller can omit it; arrives as undefined if not passed
): Book {
  const book: Book = {
    // explicit type prevents string widening: without it, status infers as string not BookStatus
    id: nextId++,
    title,
    author,
    year,
    status: 'unread',
    rating: rating ?? null, // ?? converts undefined (omitted param) to null to satisfy Book interface
  }
  books.push(book)
  return book
}

export function updateBook(id: number, update: Partial<Book>): void {
  const book = books.find((b) => b.id === id)
  if (book) Object.assign(book, update) // Object.assign(target, source) — copies source fields onto target
}

export function removeBook(id: number): void {
  books = books.filter((b) => b.id !== id)
}

export function updateStatus(id: number, status: BookStatus): void {
  const book = books.find((b) => b.id === id) // .find() returns Book | undefined
  if (book) book.status = status // truthiness narrowing — the if guard proves book is not undefined
}

export function rateBook(id: number, rating: number | null): void {
  const book = books.find((b) => b.id === id)
  if (book) book.rating = rating
}

export function filterBooks(status: FilterStatus): Book[] {
  if (status === 'all') return [...books]
  return books.filter((b) => b.status === status)
}

export function sortBooks(bookList: Book[], by: SortKey): Book[] {
  return [...bookList].sort((a, b) => {
    if (by === 'title') return a.title.localeCompare(b.title)
    if (by === 'author') return a.author.localeCompare(b.author)
    if (by === 'year') return a.year - b.year
    return 0
  })
}

export function summariseBooks(): BookSummary[] {
  return books.map((b) => ({ id: b.id, title: b.title, author: b.author }))
  // ({ }) syntax — arrow function returning an object literal must be wrapped in parens
  // so JS doesn't mistake { for a function body
}

// ─── TS Reference ────────────────────────────────────────────────────────────
//
// INFERENCE VS ANNOTATION
//   TS reads the right-hand side and infers the type automatically.
//   let x = 1              → inferred as number, no annotation needed
//   let x: number          → explicit, use when there's no initial value
//   Rule: annotate params and return types; let TS infer everything else
//
// PRIMITIVES
//   string · number · boolean · null · undefined
//
// INTERFACE (object shapes)
//   interface Book { id: number; title: string }
//   Best for objects and classes — can be extended with `interface B extends A`
//
// TYPE ALIAS (unions, primitives, computed types)
//   type BookStatus = 'read' | 'unread'
//   type FilterStatus = 'all' | BookStatus  ← extends another type via union
//   Use type for unions, intersections, and utility types
//
// OPTIONAL vs NULLABLE
//   rating?: number        → field may not exist at all (undefined)
//   rating: number | null  → field always exists, but may be null
//   For stored data, prefer number | null — every book has a rating slot, it's just empty (null)
//   Use ? on function params when the caller can choose to omit the argument
//
// STRING WIDENING GOTCHA
//   const obj = { status: 'unread' }       → TS infers status as string (too broad)
//   const obj: Book = { status: 'unread' } → TS checks 'unread' against BookStatus ✅
//   Explicit annotation on the variable prevents widening
//
// VOID
//   Use when a function exists for side effects and returns nothing
//   function removeBook(id: number): void { ... }
//
// NULLISH COALESCING (??)
//   value ?? fallback  → uses fallback only if value is null or undefined
//   rating: rating ?? null  → if rating param was omitted (undefined), store null instead
//   Unlike ||, it won't trigger on 0 or '' — only on null/undefined
//
// UNION TYPES
//   type SortKey = 'title' | 'author' | 'year'
//   Only those exact values are allowed — TS catches invalid values at compile time
//
// TYPE NARROWING
//   Proving to TS which specific type a value is before using it
//   truthiness:  if (book) { book.status = status }  ← proves book is not undefined
//   typeof:      if (typeof value === 'string') { value.toUpperCase() }
//   in operator: if ('data' in result) { result.data }
//
// UTILITY TYPES
//   Partial<T>      → all fields become optional — useful for update payloads
//   Pick<T, Keys>   → keep only listed fields — useful for projections/summaries
//   Omit<T, Keys>   → remove listed fields (mirror of Pick)
//   Record<K, V>    → object with keys of type K and values of type V
//
// AVOID `any`
//   any disables all TS checks. Use unknown if the type is truly unknown.
