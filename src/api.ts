// api.ts — simulated async calls (mirrors a real fetch pattern)

// ─── Module 3 Task ───────────────────────────────────────────────────────────
//
// Acceptance criteria:
//   [x] Define a BookDetails interface (pages: number, description: string)
//   [x] Annotate slugify — param: string, return: string
//   [x] Annotate fetchBookDetails — param: string, return: Promise<BookDetails>
//   [x] Add Book[] return type to sortBooks in books.ts

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookDetails {
  pages: number
  description: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const fakeDatabase = {
  'pragmatic-programmer': { pages: 352, description: 'A classic guide to pragmatic software craftsmanship.' },
  'clean-code':           { pages: 431, description: 'Principles and best practices for writing readable code.' },
  'you-dont-know-js':     { pages: 278, description: 'A deep dive into the core mechanisms of JavaScript.' },
  'designing-data':       { pages: 616, description: 'A thorough guide to scalable, reliable data systems.' },
}

// ─── Functions ───────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function fetchBookDetails(title: string): Promise<BookDetails> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const key = slugify(title)
      const match = Object.entries(fakeDatabase).find(
        ([k]) => key.includes(k) || k.includes(key.slice(0, 8)),
      )
      if (match) {
        resolve(match[1])
      } else {
        reject(new Error(`No details found for "${title}"`))
      }
    }, 800)
  })
}

// ─── TS Reference ────────────────────────────────────────────────────────────
//
// GENERICS
//   A type variable — a placeholder filled in at usage time
//   Array<Book>     → same as Book[], useful when nesting gets complex
//   Promise<Book>   → a promise that resolves to a single Book
//   Promise<Book[]> → a promise that resolves to an array of books
//
// ANNOTATING FUNCTIONS
//   Add types directly to the existing function — don't create a type alias for it
//   function slugify(title: string): string { ... }
//   function fetchBookDetails(title: string): Promise<BookDetails> { ... }
//
// ARRAY METHOD RETURN TYPES
//   books.find(...)   → Book | undefined  (might not find anything)
//   books.filter(...) → Book[]
//   books.map(...)    → depends on what the callback returns
//
//   .find() returns Book | undefined — TS is honest: find can fail.
//   This matters in Module 6 (type narrowing).
