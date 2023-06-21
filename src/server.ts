import mongoose from 'mongoose'
import app from './app'
import config from './config'

async function ConnectDatabase() {
    try {
        await mongoose.connect(config.database_url as string)
        console.log(`🥃 Database Connected!`)

        app.listen(config.port, () => {
            console.log(`🛢️ Server is running on ${config.port}`)
        })
    } catch (error) {
        console.log('🤬 Faild to connect Database!')
    }
}

ConnectDatabase()
