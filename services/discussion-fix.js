import fs from 'fs'

async function run() {
    try {
      let discussion = JSON.parse(fs.readFileSync('./api/discussion.json'))

      let fixed = {}

      Object.keys(discussion).forEach(key => {  
        if (key.includes('/blog/') || key.includes('/notes/')) {
            fixed[key] = {}
            Object.keys(discussion[key]).forEach(toot => {
                fixed[key][toot] = {
                    content: discussion[key][toot].content,
                    created_at: discussion[key][toot].created_at,
                    url: discussion[key][toot].url,
                    replies_count: discussion[key][toot].replies_count,
                    reblogs_count: discussion[key][toot].reblogs_count,
                    favourites_count: discussion[key][toot].favourites_count,
                }
            })
        }
      })
  
      fs.writeFileSync('./api/discussion.json', JSON.stringify(fixed))
  
    } catch (error) {
        console.log(error)
      console.log('unable to fetch mastodon data')
    }
  }
  
  run()