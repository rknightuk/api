import store from '../utils/store.js'

async function run() {
  try {
    const response = await fetch('https://www.serializd.com/api/user/rknightuk/currently_watching_page/1?sort_by=date_added_asc');
    const body = await response.json();

    console.log(body.items)
    const shows = body.items
        .sort((a,b) => (a.showName > b.showName) ? 1 : ((b.showName > a.showName) ? -1 : 0))
        .map(s => {
            return {
                title: s.showName,
                link: `https://www.serializd.com/show/${s.showId}`,
                image: `https://serializd-tmdb-images.b-cdn.net/t/p/w300${s.bannerImage}`
            }
        })

    store.set('tv', shows)
  } catch (error) {
    console.log(error);
  }
}

run();
