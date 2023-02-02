import fs from 'fs'
import dotenv from 'dotenv'
import build from '../utils/build.js'
dotenv.config()

async function run() {
    const omglolkey = process.env.OMGLOLKEY
    const data = fs.readFileSync('./api/now-omg.txt', 'utf8')

    fetch("https://api.omg.lol/address/robb/now", {
        method: 'post',
        headers: {
            Authorization: `Bearer ${omglolkey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: data,
            listed: 1,
        })
    })
    .then(res => res.json())
    .then(json => {
        console.log('✅ Updated')
    })

    build()
}

run()
