import dotenv from 'dotenv'
dotenv.config()
import store from '../utils/store.js'

async function run() {
  try {
    const microblogkey = process.env.MICROBLOGKEY
    const response = await fetch('http://micro.blog/books/bookshelves/6464', { headers: { Authorization: `Bearer ${microblogkey}` }});
    const body = await response.json();

    const books = body.items.map(b => {
        return {
            title: b.title,
            link: b.url,
            image: b.image,
            authors: b.authors.map(a => a.name).join(', ')
        }
    })

    store.set('books', books)
  } catch (error) {
    console.log(error);
  }
}

run();
