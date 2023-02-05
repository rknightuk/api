import fs from 'fs'
import build from '../utils/build.js'
import stripTags from "../utils/stripTags.js"
import uploader, { makeKey } from '../utils/uploader.js'
import * as cheerio from "cheerio"

const AUTO_TAGS = [
    { needle: 'ruminatepodcast.com', tags: ['Podcasts'] },
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

    let content = t.content
    const $ = cheerio.load(content)
    let hashtags = []
    $('.hashtag').each((i, el) => {
        hashtags.push($(el).text().replace('#', '').charAt(0).toUpperCase() + $(el).text().replace('#', '').slice(1))
    })
    content = $.html()

    let links = []
     $('a').each((i, el) => {
        links.push($(el).attr('href'))
    })

    return {
        id: t.id,
        source: t.url,
        title: null,
        path: `${t.id}/index.html`,
        content: content,
        date: t.created_at,
        spoiler: t.spoiler_text === '' ? null : t.spoiler_text,
        attachments: t.media_attachments.map(m => {
            return {
              type: m.type,
              url: `https://rknightuk.s3.amazonaws.com/site/m/${t.id}-${makeKey(
                m.url
              )}`,
              description: m.description,
            };
        }),
        tags: [
            ...hashtags,
            ...additionalTags
        ],
        application: t.application.name,
        type: 'mastodon',
        links: links,
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

    newTootBody
    .filter(t => {
        return t.application.name !== 'Micro.blog'
    })
    .forEach(t => {
        if (stripTags(t.content).startsWith('@'))
        {
            return
        }

        newToots.push(t.id);
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
        if (t.application.name === 'Micro.blog')
        {
            return
        }
        if (stripTags(t.content).startsWith("@")) {
          return
        }
        if (tootData.posts[t.id])
        {
            tootData.posts[t.id] = formatToot(t)
        } else {
            toots[t.id] = formatToot(t)
        }
    })

    const sortedToots = {}

    Object.values({
        ...tootData.posts,
        ...toots,
    })
    .sort((a,b) => (b.id > a.id) ? 1 : ((a.id > b.id) ? -1 : 0))
    .forEach(t => {
        sortedToots[t.id] = t
    })

    const newSinceId = Object.keys(sortedToots)[0]

    fs.writeFileSync(
      DATAPATH,
      JSON.stringify(
        {
          sinceId: newSinceId || tootData.sinceId,
          posts: sortedToots,
        },
        "",
        2
      )
    );

    if (hasNewToots)
    {
        build()
    }

  } catch (error) {
    console.log(error)
  }
}

run();
