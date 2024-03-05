import fs from 'fs'
import https from 'https'
import dotenv from 'dotenv'
dotenv.config()

export const upload = async (localPath, filename, location) => {
    const HOSTNAME = 'storage.bunnycdn.com'
    const STORAGE_ZONE_NAME = process.env.BUNNY_ZONE
    const FILENAME_TO_UPLOAD = `${location}/${filename}`
    const ACCESS_KEY = process.env.BUNNY_KEY

    const readStream = fs.createReadStream(localPath)

    const options = {
        method: 'PUT',
        host: HOSTNAME,
        path: `/${STORAGE_ZONE_NAME}/${FILENAME_TO_UPLOAD}`,
        headers: {
        AccessKey: ACCESS_KEY,
            'Content-Type': 'application/octet-stream',
        },
    }

    const req = https.request(options, (res) => {
        res.on('data', (chunk) => {
            console.log(chunk.toString('utf8'))
        })
    })

    req.on('error', (error) => {
        console.error(error)
    })

    readStream.pipe(req)
}