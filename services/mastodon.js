import fs from 'fs'
import build from '../utils/build.js'
import uploader, { makeKey } from '../utils/uploader.js'

const AUTO_TAGS = [
    { needle: 'ruminatepodcast.com', tags: ['Statuses'] },
    { app: 'status.lol', tags: ['Statuses'] }
]

const formatToot = (t) => {
    let additionalTags = []
    AUTO_TAGS.forEach(a => {
        if (a.needle && t.content.includes(a.needle))
        {
            additionalTags = additionalTags.concat(a.tags)
        }
        if (a.app && t.application.name === a.app)
        {
            additionalTags = additionalTags.concat(a.tags)
        }
    })
    return {
        source: t.url,
        title: null,
        path: t.id,
        content: t.content,
        date: t.created_at,
        spoiler: t.spoiler_text === '' ? null : t.spoiler_text,
        attachments: t.media_attachments.map(m => {
            return {
                type: m.type,
                url: `site/m/${t.id}-${makeKey(m.url)}`,
                description: m.description,
            }
        }),
        tags: [
            ...(t.tags || []).map(t => t.name),
            ...additionalTags
        ],
        application: t.application.name,
        type: 'mastodon',
    }
}
async function run() {
  try {
    const MASTOINSTANCE = 'social.lol'
    const MASTOID = '109523762776095110'
    // const MASTOINSTANCE = 'mas.to'
    // const MASTOID = '109677295883407777'
    const DATAPATH = './api/mastodon.json'

    if (!fs.existsSync(DATAPATH))
    {
        console.log("making new file")
        fs.writeFileSync(DATAPATH, JSON.stringify({
            sinceId: null,
            posts: {}
        }, '', 2))
    }

    const tootData = JSON.parse(fs.readFileSync(DATAPATH, 'utf8'))

    const corePath = `https://${MASTOINSTANCE}/api/v1/accounts/${MASTOID}/statuses?exclude_reblogs=true&exclude_replies=true`
    let path = corePath
    const sinceId = tootData.sinceId
    if (sinceId)
    {
        path = `${path}&since_id=${sinceId}`
    }

    const newTootResponse = await fetch(path)
    const newTootBody = await newTootResponse.json()

    const newImages = []
    const newToots = []

    newTootBody.forEach(t => {
        newToots.push(t.id)
        t.media_attachments.forEach(m => {
            newImages.push({
                url: m.url,
                prefix: t.id,
            })
        })
    })

    let hasNewToots = newToots.length > 0
    if (hasNewToots)
    {
        console.log(`Got ${newToots.length} toots`)

        for (const image of newImages)
        {
            await uploader(image.url, image.prefix)
        }
    } else {
        console.log('no new toots')
    }

    const toots = {}
    const allTootResponse = await fetch(corePath)
    const allTootBody = await allTootResponse.json()

    allTootBody.forEach(t => {
        toots[t.id] = formatToot(t)
    })

    const newSinceId = Object.keys(toots)[0]

    fs.writeFileSync(DATAPATH, JSON.stringify({
        sinceId: newSinceId || null,
        posts: {
            ...toots,
            ...tootData.posts,
        }
    }, '', 2))

    if (hasNewToots)
    {
        build()
    }

  } catch (error) {
    console.log(error)
  }
}

run();
