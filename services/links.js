import dotenv from 'dotenv'
dotenv.config()

import store from '../utils/store.js'

const run = async () => {
    const apiKey = process.env.LINKACE_API_KEY

    const res = await fetch('https://links.rknight.me/api/v1/links?per_page=100&order_by=created_at', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    })

    const json = await res.json()

    const links = json.data.filter(link => {
        const isShared = link.tags.some(tag => tag.name === 'Shared')
        return !link.url.includes('https://rknight.me') && !isShared
    }).slice(0, 5)

    store.set('links', links)
}

run()