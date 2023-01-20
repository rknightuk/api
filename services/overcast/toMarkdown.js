import fs from 'fs'

const episodes = JSON.parse(fs.readFileSync('./api/podcasts.json', 'utf8'))

episodes.map(e => {
    const listenedDate = e.date_published
    const metadata = e['_podcast_metadata']

    const description = `Listened to ${metadata.podcastTitle} [${metadata.episodeTitle}](${metadata.episodeUrl})`

    const content = `---
date: ${listenedDate}
categories: Podcasts
---
🎙️ ${description}
`
    fs.writeFileSync(`./episodes/${e.id}.md`, content, function (err) {
        if (err) throw err;
        console.log(`Created episode ${metadata.episodeTitle} successfully.`);
    })
})
