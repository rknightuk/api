import { exec } from 'child_process'
import { upload } from './bunny-uploader.js'

async function run() {
    const filename = `${Date.now()}.sql`
    const backupPath = `./${filename}`
    exec(`mysqldump -u forge -pJx74G4zrNg6kLyZCUAdv --opt --all-databases -r ${backupPath}`)

    await upload(backupPath, filename, 'backups')
}

run()

