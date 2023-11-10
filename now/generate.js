import store from '../utils/store.js'
import fs from 'fs'

async function run() {
  try {
    const data = store.get()

    const nowPageLink = `<small>This is <a href="https://nownownow.com/about">a now page</a>, and if you have your own site, you should make one, too. (<a href="https://rknight.me/now">Mirrored from my website</a>)</small>`

    let omglolcontent = `
{profile-picture}

# Robb Knight

[Back to my omg.lol page!](https://{address}.omg.lol)

${nowPageLink}

{last-updated}

<script src="https://status.lol/robb.js?time&link&fluent&pretty"></script>

--- Now ---
`

    const status = data.statuses[0]
    let webcontent = ''

    const EMOJI = { // this is also the order of output
        Currently: '⭐',
        Making: '💻',
        Ideas: '💡',
        Watching: '📺',
        Reading: '📚',
        Playing: '🎮',
        Podcasts: '🎙️',
        Albums: '🎸',
        Artists: '👨‍🎤',
        Tracks: '🎺',
    }

    const getIcon = (key, index) => {
        const icons = {
            making: ['microphone-lines', 'car','laptop-code', 'terminal', 'code-pull-request', 'bug'],
            reading: ['book', 'book-bookmark', 'book-open', 'book-open-reader', 'bookmark'],
            music: ['headphones', 'radio', 'guitar', 'compact-disc', 'drum', 'sliders', 'volume-high'],
            podcast: ['headphones', 'microphone-lines', 'comments', 'tower-broadcast', 'podcast'],
        }

        return icons[key][index]
    }

    const lists = {
    Currently: data.about.map(t => `- ${t}`).join('\n'),
    Ideas: data.ideas.map(t => `- ${t}`).join('\n'),
    Making: data.making.slice(0, 5).map((m, i) => {
        return `- [${m.title}](${m.webLink ? m.webLink : m.repoLink}): ${m.description} {${m.description && m.description.includes('omg.lol') ? 'prami' : getIcon('making', i)}}`
    }).join('\n'),
    Watching: `
<div class="now_shows">
    ${data.tv.map((t) => {
        const text = `${t.title}`
        return `<div class="now_show">
            <a href="${t.link}"><img src="${t.image}" alt="${text}"></a>
            </div>`
    }).join('')}
    </div>`,
    Playing: `
<div class="now_game" style="position: relative;">
<img src="${data.games[0].image}">
<div class="now_game_text">
<a href="${data.games[0].link}">${data.games[0].title}</a>
</div>
    </div>`,
    Reading: `
<div class="now_shows">
    ${data.books.map((b) => {
        return `<div class="now_show">
            <a href="${b.link}"><img src="${b.image}" alt="${b.title} by ${b.authors}"></a>
            </div>`
    }).join('')}
    </div>`,
    Podcasts: `
<div class="now_albums">
    ${data.podcasts.slice(0, 5).map(p => {
        return `<div class="now_album"><a href="${p.url}"><img src="${p.image}" alt="${p.title}"></a></div>`
    }).join('')}
    </div>`,
    Tracks: data.music.tracks.map((t, i) => `- [${t.name} by ${t.artist}](${t.link}) {${getIcon('music', i)}}`).join('\n'),
    Artists: `
<div class="now_albums">
    ${data.music.artists.map(a => {
        const text = `${a.name}`
        let extra = ''
        if (a.art.includes('no-artwork.png'))
        {
            extra = `<div class="now_album_text"><div class="now_album_text_container">${text}</div></div>`
        }
        return `<div class="now_album"><a href="${a.link}">${extra}<img src="${a.art}" alt="${text}"></a></div>`
    }).join('')}
    </div>`,
    Albums: `
<div class="now_albums">
    ${data.music.albums.map(b => {
        const text = `${b.title} by ${b.artist}`
        let extra = ''
        if (b.art.includes('no-artwork.png'))
        {
            extra = `<div class="now_album_text"><div class="now_album_text_container">${text}</div></div>`
        }
        return `<div class="now_album"><a href="${b.link}">${extra}<img src="${b.art}" alt="${text}"></a></div>`
    }).join('')}
    </div>`
    }

    Object.keys(EMOJI).forEach(key => {
omglolcontent += `
### ${EMOJI[key]} ${key}

${lists[key]}
`

webcontent += `
### ${EMOJI[key]} ${key}

${lists[key]}
`})

    webcontent = webcontent.replaceAll(/{[^}]*}/g, "")

    fs.writeFileSync('./api/now-web.txt', webcontent)
    fs.writeFileSync('./api/now-omg.txt', omglolcontent)

  } catch (error) {
    console.log(error);
  }
}

run();

