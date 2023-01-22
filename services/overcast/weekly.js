import fs from 'fs'
import { DateTime } from 'luxon'
import dotenv from 'dotenv'
dotenv.config()

const createPost = async(path) => {
    const apiKey = process.env.MICROBLOGKEY
    const res = await fetch(path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
        })

    return res.json()
}

async function run() {
    const episodes = JSON.parse(fs.readFileSync('./api/podcasts.json', 'utf8'))
    const currentKey = `${DateTime.now().year}-${DateTime.now().weekNumber}`
    const weeklyEpisodes = []

    episodes.forEach(e => {
        const key = `${DateTime.fromISO(e.date_published).year}-${DateTime.fromISO(e.date_published).weekNumber}`
        if (key === currentKey)
        {
            weeklyEpisodes.push(e)
            return
        }
    })

    const description = weeklyEpisodes.map(e => {
            const metadata = e['_podcast_metadata']
            return `- ${e.date_published.split('T')[0]} ${metadata.podcastTitle} [${metadata.episodeTitle}](${metadata.episodeUrl})`
        }).join('\n')

    const title = `Podcast Log ${currentKey.split('-')[0]} Week ${currentKey.split('-')[1]}`
    const categories = ['Podcasts'].map(c => `&category[]=${c}`).join('')

    let path = 'https://micro.blog/micropub' +
        '?h=entry' +
        `&mp-destination=https://rknightuk.micro.blog` +
        `&content=${encodeURIComponent(description)}` +
        `&name=${title}` +
        categories

        const res = await createPost(path)

        console.log(`⭐ Created post at ${res.url}!`)
}

run()
