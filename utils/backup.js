import admZip from 'adm-zip'
import { uploadZip } from './uploader.js'
const zip = new admZip()

async function run() {
    zip.addLocalFolder('./api')
    const zipper = zip.toBuffer()
    const filename = `backup-${new Date().getTime()}.zip`
    const path = `./tmp/${filename}`
    zip.writeZip(path)

    await uploadZip(path, filename)
}

run()
