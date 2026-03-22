import './style.css';
import {
  getBooks,
  addBook,
  removeBook,
  updateStatus,
  rateBook,
  filterBooks,
  sortBooks,
} from './books.js';
import { fetchBookDetails } from './api.js';

let currentFilter = 'all';
let currentSort   = 'title';

function renderStars(bookId, rating) {
  return [1, 2, 3, 4, 5]
    .map(n => `
      <span
        class="star ${rating && n <= rating ? 'filled' : ''}"
        data-id="${bookId}"
        data-star="${n}"
      >★</span>
    `)
    .join('');
}

function renderBook(book) {
  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-meta">${book.author} · ${book.year}</div>
        <div class="rating">${renderStars(book.id, book.rating)}</div>
        <div class="book-details" id="details-${book.id}"></div>
      </div>
      <div class="book-actions">
        <button
          class="status-btn ${book.status}"
          data-id="${book.id}"
          data-action="toggle-status"
        >
          ${book.status === 'read' ? '✓ Read' : '○ Unread'}
        </button>
        <button class="fetch-btn" data-id="${book.id}" data-action="fetch">Info</button>
        <button class="remove-btn" data-id="${book.id}" data-action="remove">✕</button>
      </div>
    </div>
  `;
}

function render() {
  const filtered = filterBooks(currentFilter);
  const sorted   = sortBooks(filtered, currentSort);

  document.getElementById('book-list').innerHTML =
    sorted.length ? sorted.map(renderBook).join('') : '<p style="color:#888">No books found.</p>';

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}

function handleBookListClick(e) {
  const btn = e.target.closest('[data-action]');
  const star = e.target.closest('.star');

  if (star) {
    rateBook(Number(star.dataset.id), Number(star.dataset.star));
    render();
    return;
  }

  if (!btn) return;
  const id = Number(btn.dataset.id);

  if (btn.dataset.action === 'remove') {
    removeBook(id);
    render();
  } else if (btn.dataset.action === 'toggle-status') {
    const book = getBooks().find(b => b.id === id);
    if (book) updateStatus(id, book.status === 'read' ? 'unread' : 'read');
    render();
  } else if (btn.dataset.action === 'fetch') {
    const book = getBooks().find(b => b.id === id);
    const el   = document.getElementById(`details-${id}`);
    if (!book || !el) return;
    el.textContent = 'Loading…';
    fetchBookDetails(book.title)
      .then(details => { el.textContent = `${details.pages} pages — ${details.description}`; })
      .catch(err    => { el.textContent = err.message; });
  }
}

function handleAddBook(e) {
  e.preventDefault();
  const title  = document.getElementById('input-title').value.trim();
  const author = document.getElementById('input-author').value.trim();
  const year   = document.getElementById('input-year').value.trim();
  if (!title || !author || !year) return;
  addBook(title, author, year);
  e.target.reset();
  render();
}

function init() {
  document.getElementById('app').innerHTML = `
    <h1>📚 Book Tracker</h1>

    <form class="add-form" id="add-form">
      <input id="input-title"  placeholder="Title"  required />
      <input id="input-author" placeholder="Author" required />
      <input id="input-year"   placeholder="Year"   type="number" required style="max-width:90px" />
      <button type="submit">Add Book</button>
    </form>

    <div class="controls">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="read">Read</button>
      <button class="filter-btn" data-filter="unread">Unread</button>
      <select class="sort-select" id="sort-select">
        <option value="title">Sort: Title</option>
        <option value="author">Sort: Author</option>
        <option value="year">Sort: Year</option>
      </select>
    </div>

    <div class="book-list" id="book-list"></div>
  `;

  document.getElementById('add-form').addEventListener('submit', handleAddBook);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  document.getElementById('sort-select').addEventListener('change', e => {
    currentSort = e.target.value;
    render();
  });

  document.getElementById('book-list').addEventListener('click', handleBookListClick);

  render();
}

init();
