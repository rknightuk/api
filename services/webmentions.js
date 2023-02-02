import fs from 'fs'
import dotenv from 'dotenv'
import build from '../utils/build.js'
dotenv.config()

async function run() {
  try {
    const DATAPATH = './api/webmentions.json'
    const webmentionskey = process.env.WEBMENTIONS
    if (!fs.existsSync(DATAPATH))
    {
        console.log("making new file")
        fs.writeFileSync('./api/webmentions.json', JSON.stringify({
            sinceId: null,
            mentions: []
        }, '', 2))
    }

    const mentions = JSON.parse(fs.readFileSync(DATAPATH, 'utf8'))
    const sinceId = mentions.sinceId
    let path = `https://webmention.io/api/mentions.jf2?token=${webmentionskey}&per-page=1000`
    if (sinceId)
    {
        path = `${path}&since_id=${sinceId}`
    }

    const response = await fetch(path);
    const body = await response.json();
    const newMentions = body.children
    if (newMentions.length === 0)
    {
        return
    }
    console.log(`Got ${newMentions.length} mentions`)
    const newSinceId = newMentions[0]['wm-id']

    fs.writeFileSync(DATAPATH, JSON.stringify({
        sinceId: newSinceId,
        mentions: [
            ...newMentions,
            ...mentions.mentions,
        ]
    }, '', 2))

    console.log('Pinging Forge for rebuild')

    build()

  } catch (error) {
    console.log(error);
  }
}

run();
