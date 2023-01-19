import store from '../utils/store.js'

async function run() {
  try {
    const response = await fetch('https://api.omg.lol/address/robb/statuses/');
    const body = await response.json();

    const statuses = body.response.statuses.slice(0, 10)

    store.set('statuses', statuses)
  } catch (error) {
    console.log(error);
  }
}

run();
