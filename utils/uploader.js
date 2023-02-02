import fs from 'fs'
import https from 'https'
import AWS from 'aws-sdk'
import path from 'path'
import { fileTypeFromFile } from 'file-type'
import dotenv from 'dotenv'
dotenv.config()

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWSACCESS,
    secretAccessKey: process.env.AWSSECRET,
})
const s3 = new AWS.S3({apiVersion: '2006-03-01'})

export const makeKey = (filename) => {
    return filename.split('/').pop()
}

export default async (filename, prefix) => {
    // download
    const filekey = makeKey(filename)
    const downloadedFilePath = `./tmp/${filekey}`
    const file = fs.createWriteStream(downloadedFilePath)
    let promise = new Promise((resolve, reject) => {
        https.get(filename, function(response) {
            response.pipe(file)
            file.on('finish', () => {
                file.close()
                resolve(`Downloaded ${downloadedFilePath}`)
            })
        })
    })

    await promise

    // upload
    const { mime } = await fileTypeFromFile(downloadedFilePath)
    const fileStream = fs.createReadStream(downloadedFilePath)
    fileStream.on('error', function(err) {
        console.log('File Error', err)
    })
    const uploadParams = {
        Bucket: 'rknightuk',
        Body: fileStream,
        Key: `site/i/${prefix}-${path.basename(filekey)}`,
        ACL: 'public-read',
        ContentType: mime,
    }

    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err)
        }
        if (data) {
            console.log("Upload Success", data.Location)
        }
    })
}
