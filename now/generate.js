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
let webcontent = `${nowPageLink}

### ${status.emoji} Status

<div class="statuslol" style="">
    <div class="statuslol_content">
        <p>${status.content}</p>
        <div class="statuslol_time">
            <a href="https://robb.status.lol/${status.id}">${status.relative_time}</a>
        </div>
    </div>
</div>
`

    const EMOJI = {
        Currently: '⭐',
        Making: '💻',
        Watching: '📺',
        Playing: '🎮',
        Reading: '📚',
        Podcasts: '🎙️',
        Albums: '🎸',
        Tracks: '🎺',
        Artists: '👨‍🎤',
    }

    const getIcon = (key, index) => {
        const icons = {
            making: ['microphone-lines', 'laptop-code', 'terminal', 'code-pull-request', 'bug'],
            reading: ['book', 'book-bookmark', 'book-open', 'book-open-reader', 'bookmark'],
            music: ['headphones', 'radio', 'guitar', 'compact-disc', 'drum', 'sliders', 'volume-high'],
            podcast: ['headphones', 'microphone-lines', 'comments', 'tower-broadcast', 'podcast'],
        }

        return icons[key][index]
    }

    const lists = {
    Currently: data.about.map(t => `- ${t}`).join('\n'),
    Making: data.making.slice(0, 5).map((m, i) => {
        return `- [${m.title}](${m.webLink ? m.webLink : m.repoLink}): ${m.description} {${m.description.includes('omg.lol') ? 'prami' : getIcon('making', i)}}`
    }).join('\n'),
    Watching: data.tv.map(t => `- ${t}`).join('\n'),
    Playing: data.games.slice(0, 1).map(g => {
        return `- [${g.title}](${g.link}) {gamepad}`
    }).join('\n'),
    Reading: data.books.map((b, i) => {
        return `- [${b.title} by ${b.authors}](${b.link}) {${getIcon('reading', i)}}`
    }).join('\n'),
    Podcasts: data.podcasts.slice(0, 5).map((p, i) => `- [${p.title}](${p.url}) {${getIcon('podcast', i)}}`).join('\n'),
    Tracks: data.music.tracks.map((t, i) => `- [${t.name} by ${t.artist}](${t.link}) {${getIcon('music', i)}}`).join('\n'),
    Artists: data.music.artists.map((p, i) => `- [${p.name}](${p.link}) {${getIcon('music', i)}}`).join('\n'),
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

    Object.keys(lists).forEach(key => {
omglolcontent += `
### ${key}

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

