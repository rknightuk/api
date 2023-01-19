import store from '../utils/store.js'

const RUMINATE = {
    title: "Ruminate",
    repoLink: "https://github.com/rknightuk/ruminate",
    webLink: "https://ruminatepodcast.com",
    description: "A tech and terrible food podcast"
}

async function run() {
  try {
    const response = await fetch('https://api.github.com/users/rknightuk/repos?sort=pushed&per_page=50');
    const body = await response.json();

    const repos = [RUMINATE]
    body.forEach(repo => {
        if (repo.topics.includes('now'))
        {
            repos.push({
                title: repo.name,
                repoLink: repo.html_url,
                webLink: repo.homepage,
                description: repo.description
            })
        }
    });

    store.set('making', repos)
  } catch (error) {
    console.log(error);
  }
}

run();
