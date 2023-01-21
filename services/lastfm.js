import * as cheerio from 'cheerio'
import textToImage from 'text-to-image'
import dotenv from 'dotenv'
dotenv.config()

import store from '../utils/store.js'

const ART_OPTIONS = {
    maxWidth: 200,
    customHeight: 200,
    textColor: 'white',
    textAlign: 'center',
    margin: 20,
    bgColor: 'black',
    verticalAlign: 'center'
}

async function run() {
  try {
    const lastfmkey = process.env.LASTFMKEY
    const music = {
        albums: [],
        tracks: [],
        artists: []
    }
    const albums = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=rknightuk&api_key=${lastfmkey}&format=json&period=7day`);
    const albumBody = await albums.json()

    const tracks = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=rknightuk&api_key=${lastfmkey}&format=json&period=7day`);
    const trackBody = await tracks.json()

    const artists = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=rknightuk&api_key=${lastfmkey}&format=json&period=7day`);
    const artistBody = await artists.json()

    for (const album of albumBody.topalbums.album.slice(0, 5))
    {
        let art = album.image.pop()['#text']
        if (art === '')
        {
            art = await textToImage.generate(`${album.name} by ${album.artist.name}`, ART_OPTIONS)
        }
        music.albums.push({
            title: album.name,
            artist: album.artist.name,
            link: album.url,
            art: art,
        })
    }

    music.tracks = trackBody.toptracks.track.slice(0, 5).map(a => {
        return {
            name: a.name,
            link: a.url,
            artist: a.artist.name,
        }
    })

    for (const artist of artistBody.topartists.artist.slice(0, 5))
    {
        const artPath = `https://musicbrainz.org/ws/2/artist/${artist.mbid}?inc=url-rels&fmt=json`
        const artistResponse = await fetch(artPath);
        const artistData = await artistResponse.json()
        const allMusic = artistData.relations.find(r => {
            return r.type === 'allmusic'
        })
        const allMusicLink = allMusic ? allMusic.url.resource : null

        let artistImage = null

        if (allMusicLink)
        {
            const response = await fetch(allMusicLink)
            const body = await response.text();
            const $ = cheerio.load(body)

            const images = $('.media-gallery-image')
            images.each((i, el) => {
                if (artistImage) return
                artistImage = $(el).attr('src')
            })
        }

        if (!artistImage)
        {
            artistImage = await textToImage.generate(artist.name, ART_OPTIONS)
        }

        music.artists.push({
            name: artist.name,
            link: artist.url,
            art: artistImage,
        })
    }

    store.set('music', music)
  } catch (error) {
    console.log(error);
  }
}

run();
