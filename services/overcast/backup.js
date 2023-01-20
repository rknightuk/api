import fs from 'fs'
import store from '../../utils/store.js'

function run() {
  try {
    fs.copyFileSync('./services/overcast/overcast.opml', `./services/overcast/overcast-${new Date().toDateString().replaceAll(' ', '-')}backup.opml`, fs.constants.COPYFILE_FICLONE)
    fs.copyFileSync('./api/podcasts.json', `./api/podcasts-backup-${new Date().toDateString().replaceAll(' ', '-')}.json`, fs.constants.COPYFILE_FICLONE)
  } catch (error) {
    console.log(error);
  }
}

run();
