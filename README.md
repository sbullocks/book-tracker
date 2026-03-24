# Book Tracker

A hands-on TypeScript learning project. Built incrementally across 8 modules, each introducing a new TypeScript concept on top of a working JavaScript app.

## What it does

A simple book tracking app where you can:
- View a list of books
- Add new books
- Filter by read / unread status
- Sort by title, author, or year
- Rate books
- Get a summary of all books

## Tech stack

- **TypeScript**
- **React** (functional components + hooks)
- **Vite**

## Getting started

```bash
npm install
npm run dev
```

## Module breakdown

| Module | Concept | File |
|--------|---------|------|
| 1 | Primitive type annotations | `books.ts` |
| 2 | Interfaces, type aliases, union types, string widening | `books.ts` |
| 3 | Generics, `Promise<T>`, explicit return types | `api.ts` |
| 4 | `void`, optional params, nullish coalescing (`??`) | `books.ts` |
| 5 | Union types as constraints (`SortKey`) | `books.ts` |
| 6 | `Record<K, V>`, type at the source | `api.ts` |
| 7 | Utility types — `Partial<T>`, `Pick<T, Keys>` | `books.ts` |
| 8 | React props interfaces, `useState`, `useRef`, event handler types | `App.tsx`, `BookCard.tsx` |

## Key concepts covered

- **Inference vs annotation** — annotate params and return types; let TS infer the rest
- **Interfaces** — define object shapes (`Book`, `BookDetails`)
- **Type aliases** — unions and computed types (`BookStatus`, `FilterStatus`, `SortKey`)
- **Optional vs nullable** — `rating?: number` vs `rating: number | null`
- **String widening** — why `const book: Book = {}` matters
- **Type narrowing** — truthiness guards, `typeof`, `in` operator
- **Generics** — `Promise<T>`, `Record<K, V>`, `Array<T>`
- **Utility types** — `Partial<T>`, `Pick<T, Keys>`, `Omit<T, Keys>`, `Record<K, V>`
- **React + TS** — props interfaces, typed hooks, event handler types
