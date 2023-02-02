import fs from 'fs'

const stripTags = (text) => {
  return text.replace(/<[^>]*>/g, '').replace(/\n\n/g, "\n").replace(/\n/g, " ")
}

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

    Object.keys(posts).forEach(key => {
        const summary = stripTags(posts[key].content).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')

        posts[key] = {
            ...posts[key],
            summary: summary.length > 500 ? `${summary.slice(0, 500)}...` : summary,
        }

        posts[key].attachments.forEach(attachment => {
            if (attachment.url.includes('.jpg'))
            {
                images.push({
                    url: attachment.url ? attachment.url : attachment,
                    description: attachment.description || null,
                    type: attachment.type || 'image',
                    postId: key,
                })
            }
        })

        const formattedTags = posts[key].tags.map(t => {
            return t.toLowerCase()
        })

        tags = [...new Set([
            ...tags,
            ...formattedTags,
        ])]

        formattedTags.forEach(t => {
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
    }, '', 2))
}

run();
