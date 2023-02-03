import fs from 'fs'
import store from '../../utils/store.js'

function run() {
  try {
    const data = JSON.parse(fs.readFileSync('./api/podcasts.json', 'utf8'))

    let podcasts = {}
    data.log.slice(0, 20).forEach(episode => {
        const title = episode['_podcast_metadata'].podcastTitle
        if (!podcasts[title])
        {
            podcasts[title] = {
                count: 0,
                title,
                url: episode['_podcast_metadata'].podcastUrl,
                image: episode['_podcast_metadata'].artwork,
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
