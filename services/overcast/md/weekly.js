import fs from 'fs'
import { DateTime } from 'luxon'

const episodes = JSON.parse(fs.readFileSync('./api/podcasts.json', 'utf8'))
const weekly = {}

episodes.forEach(e => {
    const key = `${DateTime.fromISO(e.date_published).year}-${DateTime.fromISO(e.date_published).weekNumber}`
    if (!weekly[key]) weekly[key] = []
    weekly[key].unshift(e)
})

Object.keys(weekly).forEach(key => {
    console.log(key)
    const title = `Podcast Log ${key.split('-')[0]} Week ${key.split('-')[1]}`
    const date =  DateTime.fromISO(weekly[key][0].date_published).endOf('week').toISO({ suppressMilliseconds: true })

    const description = weekly[key].map(e => {
        const metadata = e['_podcast_metadata']
        return `- ${e.date_published.split('T')[0]} ${metadata.podcastTitle} [${metadata.episodeTitle}](${metadata.episodeUrl})`
    }).join('\n')

    const content = `---
date: ${date}
categories: Podcasts
title: ${title}
---
${description}
`

    fs.writeFileSync(`./episodes/weekly/${key}.md`, content, function (err) {
        if (err) throw err;
        console.log(`Created episode ${key} successfully.`);
    })
})
