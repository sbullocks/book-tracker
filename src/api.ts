// api.ts — simulated async data fetching (mirrors a real fetch pattern)

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookDetails {
  pages: number
  description: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

// Record<string, BookDetails> — keys are slug strings, values are BookDetails objects
// Typing the container means TS knows every value is BookDetails without needing
// runtime checks at the point of use (e.g. match[1] is already typed correctly)
const fakeDatabase: Record<string, BookDetails> = {
  'pragmatic-programmer': { pages: 352, description: 'A classic guide to pragmatic software craftsmanship.' },
  'clean-code': { pages: 431, description: 'Principles and best practices for writing readable code.' },
  'you-dont-know-js': { pages: 278, description: 'A deep dive into the core mechanisms of JavaScript.' },
  'designing-data': { pages: 616, description: 'A thorough guide to scalable, reliable data systems.' },
}

// ─── Functions ───────────────────────────────────────────────────────────────

// Converts a book title to a URL-friendly slug
// e.g. 'The Pragmatic Programmer' → 'the-pragmatic-programmer'
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Simulates an async API call — resolves with BookDetails or rejects if not found
// Promise<BookDetails> means: this function returns a promise that, when resolved, gives a BookDetails object
export function fetchBookDetails(title: string): Promise<BookDetails> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const key = slugify(title)
      const match = Object.entries(fakeDatabase).find(
        ([k]) => key.includes(k) || k.includes(key.slice(0, 8)),
      )
      if (match) {
        resolve(match[1]) // match[1] is BookDetails — TS knows this from the Record annotation above
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
//   Promise<BookDetails>   → a promise that resolves to a BookDetails object
//   Promise<Book[]>        → a promise that resolves to an array of books
//   Array<Book> = Book[]   → two ways to write the same thing
//
// RECORD<K, V>
//   An object where all keys are type K and all values are type V
//   Record<string, BookDetails> → any string key is valid, every value must be BookDetails
//   Typing at the source (the database itself) means no narrowing needed later
//
// PROMISE
//   Represents a value that will be available in the future (async)
//   resolve(value) — the async operation succeeded, here is the result
//   reject(error)  — the async operation failed, here is the reason
//   Caller uses .then(result => ...) or await to get the resolved value
//
// TYPE AT THE SOURCE
//   Annotate the data structure itself rather than narrowing at every point of use
//   fakeDatabase: Record<string, BookDetails>  → match[1] is typed everywhere automatically
//   Without it, match[1] would be unknown and every usage would need a type check
//
// ARRAY METHODS AND RETURN TYPES
//   .find(...)    → T | undefined  — might not find anything, TS is honest about this
//   .filter(...)  → T[]            — always returns an array (may be empty)
//   .map(...)     → depends on what the callback returns
