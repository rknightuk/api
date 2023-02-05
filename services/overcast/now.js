import fs from 'fs'
import { DateTime } from 'luxon'
import store from '../../utils/store.js'

function run() {
  try {
    const data = JSON.parse(fs.readFileSync('./api/podcasts.json', 'utf8'))

    let podcasts = {}
    const sevenDaysAgo = DateTime.now().minus({ days: 7 }).startOf('day')
    data.log.every(episode => {
        const listenDate = DateTime.fromISO(episode.date_published)
        if (listenDate < sevenDaysAgo)
        {
            console.log(`longer than a week ago: ${episode['_podcast_metadata'].podcastTitle}`)
            return false
        }
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
        return true
    })

    podcasts = Object.values(podcasts).sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))

    store.set('podcasts', podcasts)
  } catch (error) {
    console.log(error);
  }
}

run();
