import * as cheerio from 'cheerio';
import store from '../utils/store.js'

async function run() {
  try {
    const response = await fetch('https://psnprofiles.com/rknightuk');
    const body = await response.text();
    const $ = cheerio.load(body)

    const titles = $('#gamesTable .title')

    const games = []
    titles.each((i, el) => {
        const title = $(el).text();
        const link = $(el).attr('href');

        games.push({
            title: title,
            link: link
        })
    })

    store.set('games', games)

  } catch (error) {
    console.log(error);
  }
}

run();
