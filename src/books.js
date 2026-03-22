// books.js — data layer: Book shape, store, and all operations

let nextId = 1;

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

let books = [
  { id: nextId++, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', year: 1999, status: 'read', rating: 5 },
  { id: nextId++, title: 'Clean Code',               author: 'Robert C. Martin', year: 2008, status: 'read', rating: 4 },
  { id: nextId++, title: 'You Don\'t Know JS',       author: 'Kyle Simpson',     year: 2015, status: 'unread', rating: null },
  { id: nextId++, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', year: 2017, status: 'unread', rating: null },
];

export function getBooks() {
  return [...books];
}

export function addBook(title, author, year) {
  const book = {
    id: nextId++,
    title,
    author,
    year: Number(year),
    status: 'unread',
    rating: null,
  };
  books.push(book);
  return book;
}

export function removeBook(id) {
  books = books.filter(b => b.id !== id);
}

export function updateStatus(id, status) {
  const book = books.find(b => b.id === id);
  if (book) book.status = status;
}

export function rateBook(id, rating) {
  const book = books.find(b => b.id === id);
  if (book) book.rating = rating;
}

export function filterBooks(status) {
  if (status === 'all') return [...books];
  return books.filter(b => b.status === status);
}

export function sortBooks(bookList, by) {
  return [...bookList].sort((a, b) => {
    if (by === 'title')  return a.title.localeCompare(b.title);
    if (by === 'author') return a.author.localeCompare(b.author);
    if (by === 'year')   return a.year - b.year;
    return 0;
  });
}
