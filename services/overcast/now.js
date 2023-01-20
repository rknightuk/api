import fs from 'fs'
import store from '../../utils/store.js'

function run() {
  try {
    const data = JSON.parse(fs.readFileSync('./api/podcasts.json', 'utf8'))

    let podcasts = {}
    data.slice(0, 30).forEach(episode => {
        const title = episode['_podcast_metadata'].podcastTitle
        if (!podcasts[title])
        {
            podcasts[title] = {
                count: 0,
                title,
                url: episode['_podcast_metadata'].podcastUrl
            }
        }

        podcasts[title].count++
    })

    podcasts = Object.values(podcasts).sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))

    store.set('podcasts', podcasts)
  } catch (error) {
    console.log(error);
  }
}

run();
