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
    const tagMap = {}

    Object.keys(posts).forEach(key => {
        const summary = stripTags(posts[key].content)

        posts[key] = {
            ...posts[key],
            summary: summary.length > 500 ? `${summary.slice(0, 500)}...` : summary,
        }

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
        posts: Object.values(posts),
        tags: tags.sort(),
        tagMap: tagMap,
    }, '', 2))
}

run();
