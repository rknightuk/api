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
            if (mb.title && mb.title.includes('Podcast Log'))
            {
                return
            }
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
                    "/micro/2022"
                  )
                  .replaceAll(
                    "https://toot.rknight.me/2023",
                    "/micro/2023"
                  )

                attachments.push({
                    url: updated,
                    description: alt,
                    type: 'image',
                })
            })

            let links = []

            $('a').each((i, el) => {
                links.push($(el).attr('href'))
            })

            const path = mb.url.replace('https://toot.rknight.me/', '')

            let tags = (mb.tags || []).map(t => {
                if (t === 'Development') return 'WebDev'
                return t.split(' ').map(t => t.charAt(0).toUpperCase() + t.slice(1)).join('')
            })

            const isMovieReview = html.includes('★') && tags.includes('Movies')
            const isTvReview = html.includes('Watched ') && tags.includes('TV')
            const isBookReview = tags.includes('Books')
            const isGameReview = html.includes('Played ') && tags.includes('Games')
            if (isMovieReview || isTvReview || isBookReview || isGameReview)
            {
                tags.push('Log')
            }

            microBlogPosts[path] = {
                source: null,
                title: mb.title || null,
                path: path,
                content: html,
                date: mb.date_published,
                spoiler: null,
                attachments: attachments,
                tags: tags,
                type: 'mb',
                application: 'micro.blog',
                links: links,
            }
        })

    fs.writeFileSync('./api/microblog.json', JSON.stringify(microBlogPosts))

}

run();
