import fs from 'fs'

const API_PATH = './api/data.json'

export default {
    set: (key, input) => {
        const data = JSON.parse(fs.readFileSync(API_PATH, 'utf8'))

        data[key] = input

        fs.writeFileSync(API_PATH, JSON.stringify(data))
    },
    get: () => {
        return JSON.parse(fs.readFileSync(API_PATH, 'utf8'))
    }
}
