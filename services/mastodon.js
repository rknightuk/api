import fs from 'fs'
import uploader, { makeKey } from '../utils/uploader.js'

async function run() {
  try {
    const MASTOINSTANCE = 'social.lol'
    const MASTOID = '109677295883407777'
    const DATAPATH = './api/mastodon.json'

    if (!fs.existsSync(DATAPATH))
    {
        console.log("making new file")
        fs.writeFileSync(DATAPATH, JSON.stringify({
            sinceId: null,
            posts: []
        }, '', 2))
    }

    const tootData = JSON.parse(fs.readFileSync(DATAPATH, 'utf8'))
    let path = `https://${MASTOINSTANCE}/api/v1/accounts/${MASTOID}/statuses?exclude_reblogs=true&exclude_replies=true`

    const sinceId = tootData.sinceId
    if (sinceId)
    {
        path = `${path}&since_id=${sinceId}`
    }

    const response = await fetch(path)
    const body = await response.json()

    const images = []

    const toots = body.map(t => {
        return {
            id: t.id,
            spoilerText: t.spoiler_text === '' ? null : t.spoiler_text,
            url: t.url,
            content: t.content,
            attachments: t.media_attachments.map(m => {
                images.push(m.url)
                return {
                    type: m.type,
                    url: makeKey(m.url),
                    description: m.description,
                }
            })
        }
    })

    if (toots.length === 0)
    {
        return
    }
    console.log(`Got ${toots.length} toots`)
    const newSinceId = toots[0].id

    for (const image of images)
    {
        await uploader(image)
    }

    fs.writeFileSync(DATAPATH, JSON.stringify({
        sinceId: newSinceId,
        posts: [
            ...toots,
            ...tootData.posts,
        ]
    }, '', 2))

  } catch (error) {
    console.log(error)
  }
}

run();
