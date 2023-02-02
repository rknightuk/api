import dotenv from 'dotenv'
dotenv.config()

export default () => {
    fetch(process.env.RKNIGHTHOOK, {
        method: 'get',
    })
}
