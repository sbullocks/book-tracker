// api.js — simulated async calls (mirrors a real fetch pattern)

const fakeDatabase = {
  'pragmatic-programmer': { pages: 352,  description: 'A classic guide to pragmatic software craftsmanship.' },
  'clean-code':           { pages: 431,  description: 'Principles and best practices for writing readable code.' },
  'you-dont-know-js':     { pages: 278,  description: 'A deep dive into the core mechanisms of JavaScript.' },
  'designing-data':       { pages: 616,  description: 'A thorough guide to scalable, reliable data systems.' },
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function fetchBookDetails(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const key = slugify(title);
      const match = Object.entries(fakeDatabase).find(([k]) => key.includes(k) || k.includes(key.slice(0, 8)));
      if (match) {
        resolve(match[1]);
      } else {
        reject(new Error(`No details found for "${title}"`));
      }
    }, 800);
  });
}
