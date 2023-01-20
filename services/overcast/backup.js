import fs from 'fs'
import store from '../../utils/store.js'

function run() {
  try {
    fs.copyFileSync('./services/overcast/overcast.opml', './services/overcast/overcast-backup.opml', fs.constants.COPYFILE_FICLONE)
    fs.copyFileSync('./api/podcasts.json', './api/podcasts-backup.json', fs.constants.COPYFILE_FICLONE)
  } catch (error) {
    console.log(error);
  }
}

run();
