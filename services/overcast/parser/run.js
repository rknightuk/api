import fs from 'fs'
import xml2json from 'xml2json'
import https from 'https'

fs.readFile('services/overcast/overcast.opml', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const output = []
  const converted = xml2json.toJson(data, { object: true })

  converted.opml.body.outline[1].outline.forEach(podcast => {
        if (podcast.title === 'Hello Internet')
        {
            return;
        }

        const isConnectedPro = podcast.title === 'Connected Pro'

        let singleEpisode = false;

        try {
            podcast.outline.forEach(x => x)
        } catch {
            if (podcast.outline === undefined)
            {
                console.log(`No episodes for ${podcast.title}, skipping`)
                return
            }

            singleEpisode = true
        }

        const episodes = singleEpisode ? [podcast.outline] : podcast.outline

        if (!fs.existsSync(`./assets/pod/${podcast.overcastId}.jpg`))
        {
            console.log(`./assets/${podcast.title} does not exist, downloading`)
            const url = `https://public.overcast-cdn.com/art/${podcast.overcastId}`

            https.get(url, (res) => {
                const path = `./assets/pod/${podcast.overcastId}.jpg`
                const filePath = fs.createWriteStream(path)
                res.pipe(filePath)
                filePath.on('finish',() => {
                    filePath.close()
                    console.log('Download Completed')
                })
            })
        }

        episodes.forEach(e => {
            const progress = e.progress ? parseInt(e.progress, 10) : 0
            if (e.played === '1' || progress > 600)
            {
                let episodeUrl = e.url
                if (isConnectedPro)
                {
                    const episodeNumber = e.title.split(':')[0]
                    episodeUrl = `https://relay.fm/connected/${episodeNumber}`
                }
                const episode = {
                    id: e.overcastId,
                    content_text: `${podcast.title} - ${e.title}`,
                    url: e.url,
                    date_published: new Date(e.userUpdatedDate),
                    '_podcast_metadata': {
                        id: e.overcastId,
                        artwork: `https://api.rknight.me/assets/pod/${podcast.overcastId}.jpg`,
                        podcastTitle: podcast.title,
                        podcastUrl: isConnectedPro ? 'https://relay.fm/connected' : podcast.htmlUrl,
                        episodeTitle: e.title,
                        episodeUrl,
                        pubDate: new Date(e.pubDate),
                        played: new Date(e.userUpdatedDate),
                    }
                }

                output.push(episode)
            }
        })
  });


    output.sort((a,b) => (a.date_published < b.date_published) ? 1 : ((b.date_published < a.date_published) ? -1 : 0))

    console.log(`Outputting ${output.length} episodes`)

    fs.writeFile('./api/podcasts.json', JSON.stringify(output, '', 2), err => {
        if (err) {
            console.error(err);
        }
    })
})
