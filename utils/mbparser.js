import fs from 'fs'
import * as cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
})

async function run() {
    const microBlogPosts = {}

    JSON.parse(fs.readFileSync('./utils/microblog.json', 'utf8'))
        .items
        .forEach((mb, i) => {
            let html = md.render(mb.content_text)
            const $ = cheerio.load(html)

            let attachments = []
            $('img').each((i, el) => {
                const src = $(el).attr('src')
                const alt = $(el).attr('alt')
                let updated = src.replace('uploads/', 'site/mb/')
                    .replace('https://toot.rknight.me/', 'https://rknightuk.s3.amazonaws.com/')

                if (updated.startsWith('site/mb'))
                {
                    updated = updated.replace('site/mb', 'https://rknightuk.s3.amazonaws.com/site/mb')
                }

                html = html
                  .replace(src, updated)
                  .replaceAll(
                    "https://toot.rknight.me/2022",
                    "https://rknight.me/micro/2022"
                  )
                  .replaceAll(
                    "https://toot.rknight.me/2023",
                    "https://rknight.me/micro/2023"
                  )

                attachments.push({
                    url: updated,
                    description: alt,
                    type: 'image',
                })
            })

            const path = mb.url.replace('https://toot.rknight.me/', '')

            microBlogPosts[path] = {
                source: null,
                title: mb.title || null,
                path: path,
                content: html,
                date: mb.date_published,
                spoiler: null,
                attachments: attachments,
                tags: (mb.tags || []).map(t => {
                    if (t === 'Development') return 'Webdev'
                    return t
                }),
                type: 'mb',
                application: 'micro.blog',
            }
        })

    fs.writeFileSync('./api/microblog.json', JSON.stringify(microBlogPosts, '', 2))

}

run();
