// books.js — data layer: Book shape, store, and all operations

interface Book {
  id: number
  title: string
  author: string
  year: number
  status: BookStatus
  rating: number | null
}

type BookStatus = 'read' | 'unread'
type FilterStatus = 'all' | BookStatus

let nextId = 1 // NOTE: does not need to be rewritten as let nextId: number = 1.. If the type is obvious from the value on the right, let TS infer it. Annotate explicitly when the type isn't obvious, or when you're declaring without initializing.
// NOTE: if the value was not defined, adding a type would make sense as its not obvious what the value may be.

/**
 * Book shape:
 * {
 *   id:     number,
 *   title:  string,
 *   author: string,
 *   year:   number,
 *   status: 'read' | 'unread',
 *   rating: number | null   (1–5, optional)
 * }
 */

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

export function getBooks(): Book[] {
  return [...books]
}

export function addBook(title: string, author: string, year: number) {
  const book: Book = {
    id: nextId++,
    title,
    author,
    year, // because the param is defined with type numbr above, can refactor this to just read as year: .. year: Number(year) is now considered redundant and misleading.
    status: 'unread',
    rating: null,
  }
  books.push(book)
  return book
}

export function removeBook(id: number) {
  books = books.filter((b) => b.id !== id)
}

export function updateStatus(id: number, status: BookStatus) {
  const book = books.find((b) => b.id === id)
  if (book) book.status = status
}

export function rateBook(id: number, rating: number | null) {
  const book = books.find((b) => b.id === id)
  if (book) book.rating = rating
}

export function filterBooks(status: FilterStatus) {
  if (status === 'all') return [...books]
  return books.filter((b) => b.status === status)
}

export function sortBooks(bookList: Book[], by: string) {
  return [...bookList].sort((a, b) => {
    if (by === 'title') return a.title.localeCompare(b.title)
    if (by === 'author') return a.author.localeCompare(b.author)
    if (by === 'year') return a.year - b.year
    return 0
  })
}

//  **   TypeScript is JavaScript with a type layer on top. At build time, the types are checked and then stripped — what runs in the browser is still plain JS. The types exist purely to catch mistakes early. **

// Javascript: let name = "Stephen" - no type info
// TypeScript: let name: string = "Stephen" - explicitally tpyed
// TypeScript: let name = "Stephen" - also valid as TS infers string

// Primitive Types:
// string: "Hello"
// number: 42, 10.5
// boolean: true/false
// null: null
// undefined: undefined

// Union Types:
// ** for this app, the Union Types are "All" | "Read" | "Unread"
// NOTE:  You can only filter by those three values — so those are the only valid inputs. If someone passes 'deleted', TypeScript catches it at compile time before it ever runs. You reasoned about it correctly: the union reflects the real-world constraints of the data.

// TS is smart — it reads the right-hand side and infers the type. You don't always need to write the type explicitly. ** explicit — useful when the type isn't obvious from the value.
// - annotate function parameters and return types always. Let TS infer everything else.

// ** Avoid any as it turns off the typeScript protection. If dont know the type, use unknown for now.

// ** you don't always need to annotate return types. TS infers them from what the function actually returns.

// step 1: renamed file from books.js to books.ts
// step 2: in main.js, update the impre to ^ books.ts
// -- app still works at this point because Vite handles .ts natively
// step 3: refactor the params for addBook, filterBooks, sortBooks to include Types
// NOTE: no need to update the returns as TS infers them from what the fruntion actaully returns.
