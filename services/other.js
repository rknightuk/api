import jsYaml from 'js-yaml'
import store from '../utils/store.js'

async function run() {
  try {
    const response = await fetch(`https://api.omg.lol/address/robb/pastebin/now.yaml`);
    const body = await response.json();

    const nowData = jsYaml.load(body.response.paste.content)

    Object.keys(nowData).forEach(key => {
        store.set(key, nowData[key])
    })

  } catch (error) {
    console.log(error);
  }
}

run();
