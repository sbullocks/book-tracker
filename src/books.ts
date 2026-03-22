// books.ts — data layer: Book shape, store, and all operations

// ─── Module 1 Task ───────────────────────────────────────────────────────────
//
// Acceptance criteria:
//   [x] Rename file from books.js to books.ts
//   [x] Annotate addBook params (title, author, year)
//   [x] Annotate filterBooks status param
//   [x] Annotate sortBooks by param
//   [x] Let TS infer return types — no annotation needed yet

// ─── Module 2 Task ───────────────────────────────────────────────────────────
//
// Acceptance criteria:
//   [x] Define interface Book with all 6 fields
//   [x] Define type BookStatus = 'read' | 'unread'
//   [x] Define type FilterStatus = 'all' | BookStatus
//   [x] Apply Book[] to the books array
//   [x] Type all remaining unannotated params using Book, BookStatus, FilterStatus
//   [x] Add explicit return types to getBooks and addBook
//   [x] Fix string widening in addBook with const book: Book = { ... }

// ─── Module 3 Task ───────────────────────────────────────────────────────────
//
// Acceptance criteria:
//   [x] Add explicit Book[] return type to sortBooks

// ─── Module 4 Task ───────────────────────────────────────────────────────────
//
// Acceptance criteria:
//   [x] Add void return types to removeBook, updateStatus, rateBook
//   [x] Add optional rating? param to addBook
//   [x] Use rating ?? null inside addBook to satisfy Book interface

// ─── Types ───────────────────────────────────────────────────────────────────

interface Book {
  id: number
  title: string
  author: string
  year: number
  status: BookStatus
  rating: number | null // always present on the object; null means unrated
}

type BookStatus = 'read' | 'unread' // valid states a book can be in
type FilterStatus = 'all' | BookStatus // extends BookStatus for the filter UI

// ─── Store ───────────────────────────────────────────────────────────────────

let nextId = 1 // inferred as number — no annotation needed
let books: Book[] = [
  {
    id: nextId++,
    title: 'The Pragmatic Programmer',
    author: 'Hunt & Thomas',
    year: 1999,
    status: 'read',
    rating: 5,
  },
  {
    id: nextId++,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    status: 'read',
    rating: 4,
  },
  {
    id: nextId++,
    title: "You Don't Know JS",
    author: 'Kyle Simpson',
    year: 2015,
    status: 'unread',
    rating: null,
  },
  {
    id: nextId++,
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    year: 2017,
    status: 'unread',
    rating: null,
  },
]

// ─── Operations ──────────────────────────────────────────────────────────────

export function getBooks(): Book[] {
  return [...books]
}

export function addBook(
  title: string,
  author: string,
  year: number,
  rating?: number | null,
): Book {
  const book: Book = {
    // explicit type prevents string widening on status
    id: nextId++,
    title,
    author,
    year,
    status: 'unread',
    rating: rating ?? null,
  }
  books.push(book)
  return book
}

export function removeBook(id: number): void {
  books = books.filter((b) => b.id !== id)
}

export function updateStatus(id: number, status: BookStatus): void {
  const book = books.find((b) => b.id === id)
  if (book) book.status = status
}

export function rateBook(id: number, rating: number | null): void {
  const book = books.find((b) => b.id === id)
  if (book) book.rating = rating
}

export function filterBooks(status: FilterStatus) {
  if (status === 'all') return [...books]
  return books.filter((b) => b.status === status)
}

export function sortBooks(bookList: Book[], by: string): Book[] {
  return [...bookList].sort((a, b) => {
    if (by === 'title') return a.title.localeCompare(b.title)
    if (by === 'author') return a.author.localeCompare(b.author)
    if (by === 'year') return a.year - b.year
    return 0
  })
}

// ─── TS Reference ────────────────────────────────────────────────────────────
//
// INFERENCE VS ANNOTATION
//   let x = 1               → inferred as number, no annotation needed
//   let x: number           → explicit, use when no initial value
//   Rule: annotate params + return types; infer everything else
//
// PRIMITIVES
//   string · number · boolean · null · undefined
//
// INTERFACE (object shapes)
//   interface Book { id: number; title: string }
//   Use for objects and classes
//
// TYPE ALIAS (unions, primitives, anything non-object)
//   type BookStatus = 'read' | 'unread'
//   type FilterStatus = 'all' | BookStatus   ← can extend another type
//
// INTERFACE vs TYPE
//   interface  → can extend with `interface B extends A`, no unions
//   type       → can't merge, but supports unions and intersections (&)
//
// OPTIONAL vs NULLABLE
//   rating?: number         → may not exist at all (undefined)
//   rating: number | null   → always present, but may be null
//
// STRING WIDENING GOTCHA
//   const obj = { status: 'unread' }       → TS infers status as string
//   const obj: Book = { status: 'unread' } → checks against Book, 'unread' ✅
//
// GENERICS
//   A type variable — a placeholder filled in at usage time
//   Array<Book>     → same as Book[], useful when nesting gets complex
//   Promise<Book>   → a promise that resolves to a single Book
//   Promise<Book[]> → a promise that resolves to an array of books
//
// AVOID `any` — disables TS checks entirely. Use `unknown` if type is truly unknown.
//
// VOID
//   Use when a function exists for side effects and returns nothing
//   function removeBook(id: number): void { ... }
//   TS infers void anyway — explicit annotation is good documentation
//
// OPTIONAL PARAMS
//   rating?: number        → caller can skip it; TS treats it as number | undefined
//   Must come after required params: (a: string, b?: string) ✅
//   Use ?? to handle undefined:  rating: rating ?? null
//
// DEFAULT PARAMS
//   function greet(name: string, greeting = 'Hello') { ... }
//   Default value implies the type — no annotation needed
//   Implicitly optional — callers can skip it
//
// FUNCTION TYPES AS VALUES
//   const double: (n: number) => number = (n) => n * 2
//   function run(fn: (n: number) => number, value: number) { ... }
//   Syntax: (paramName: type) => returnType
