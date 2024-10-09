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
        if (a.app && t.application && t.application.name === a.app)
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
        application: t.application ? t.application.name : 'Web',
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
    const TOOTDATAPATH = './api/mastodon.json'
    const BOOSTDATAPATH = './api/mastodon-boosts.json'

    if (!fs.existsSync(TOOTDATAPATH))
    {
        console.log("making new file")
        fs.writeFileSync(TOOTDATAPATH, JSON.stringify({

            sinceId: null,
            posts: {}
        }))
    }

    if (!fs.existsSync(BOOSTDATAPATH))
    {
        console.log("making new file")
        fs.writeFileSync(BOOSTDATAPATH, JSON.stringify({}))
    }

    const tootData = JSON.parse(fs.readFileSync(TOOTDATAPATH, 'utf8'))
    const boostData = JSON.parse(fs.readFileSync(BOOSTDATAPATH, 'utf8'))

    const corePath = `https://${MASTOINSTANCE}/api/v1/accounts/${MASTOID}/statuses?exclude_replies=true`
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
        if (!t.application) return true
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

    const boosts = {}
    allTootBody
        .filter(t => {
            return t.reblog !== null;
        })
        .forEach(t => {
            let content = t.reblog.content
            const $ = cheerio.load(content)
            let hashtags = []
            $('.hashtag').each((i, el) => {
                $(el).remove()
            })
            $('.mention').each((i, el) => {
                $(el).remove()
            })
            content = $.html()

            let links = []
            $('a').each((i, el) => {
                links.push($(el).attr('href'))
            })

            if (!links.length) return

            boosts[t.id] = {
                id: t.id,
                username: t.reblog.account.username,
                userlink: t.reblog.account.url,
                title: t.reblog.card ? t.reblog.card.title : null,
                boostUrl: t.reblog.url,
                links: links,
            }
        })

    allTootBody.forEach(t => {
        if (t.application && t.application.name === 'Micro.blog')
        {
            return
        }
        if (!t.application) return
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

    const sortedBoosts = {}
    Object.values({
        ...boostData,
        ...boosts,
    })
    .sort((a,b) => (b.id > a.id) ? 1 : ((a.id > b.id) ? -1 : 0))
    .forEach(t => {
        sortedBoosts[t.id] = t
    })


    const newSinceId = Object.keys(sortedToots)[0]

    fs.writeFileSync(
      TOOTDATAPATH,
      JSON.stringify(
        {
          sinceId: newSinceId || tootData.sinceId,
          posts: sortedToots,
        },
        "",
        2
      )
    );

    fs.writeFileSync(
      BOOSTDATAPATH,
      JSON.stringify(
        sortedBoosts,
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
