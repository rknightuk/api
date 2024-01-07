import fs from 'fs'
import stripTags from "../utils/stripTags.js"

function run() {
    const mastodon = JSON.parse(fs.readFileSync('./api/mastodon.json', 'utf8')).posts
    const microblog = JSON.parse(fs.readFileSync('./api/microblog.json', 'utf8'))

    const posts = {
        ...mastodon,
        ...microblog,
    }

    let tags = []
    let images = []
    const tagMap = {}
    const discussion = {}

    Object.keys(posts).forEach(key => {
        if (posts[key].type === 'mastodon' && posts[key].links)
        {
            let siteLink = posts[key].links.find(l => {
                return l.includes('https://rknight.me') && l !== 'https://rknight.me' && l !== 'https://rknight.me/'
            })

            if (siteLink)
            {
                if (!siteLink.includes('/blog/')) siteLink = siteLink.replace('https://rknight.me', 'https://rknight.me/blog')
                siteLink = siteLink.replace('https://rknight.me', '')
                if (!discussion[siteLink]) discussion[siteLink] = []

                discussion[siteLink] = {
                    source: posts[key].source,
                    date: posts[key].date,
                    type: 'Mastodon',
                }
            }
        }

        const summary = stripTags(posts[key].content).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim()

        posts[key] = {
            ...posts[key],
            summary: summary.length > 500 ? `${summary.slice(0, 500)}...` : summary,
        }

        posts[key].attachments.forEach(attachment => {
            if (attachment.url.includes('.jpg') || attachment.url.includes('.jpeg'))
            {
                images.push({
                    url: attachment.url ? attachment.url : attachment,
                    description: attachment.description || null,
                    type: attachment.type || 'image',
                    postId: key,
                })
            }
        })

        tags = [...new Set([
            ...tags,
            ...posts[key].tags,
        ])]

        posts[key].tags.forEach(t => {
            tagMap[t] = [
                ...tagMap[t] || [],
                posts[key]
            ]
        })
    })

    fs.writeFileSync('./api/micro.json', JSON.stringify({
        images: images,
        posts: Object.values(posts),
        tags: tags.sort(),
        tagMap: tagMap,
        postMap: posts,
        discussion,
    }, '', 2))
}

run();
