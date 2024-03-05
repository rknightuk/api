import admZip from 'adm-zip'
import { upload } from './bunny-uploader.js'
const zip = new admZip()

async function run() {
    zip.addLocalFolder('./api')
    const zipper = zip.toBuffer()
    const filename = `backup-${new Date().getTime()}.zip`
    const path = `./tmp/${filename}`
    zip.writeZip(path)

    await upload(path, filename, 'backups')
}

run()
