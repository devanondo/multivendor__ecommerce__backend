import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { errorLogger, logger } from './shared/logger'

async function ConnectDatabase() {
    try {
        await mongoose.connect(config.database_url as string)
        logger.info(`🥃 Database Connected!`)

        app.listen(config.port, () => {
            logger.info(`🛢️ Server is running on ${config.port}`)
        })
    } catch (error) {
        errorLogger.error('🤬 Faild to connect Database!')
    }
}

ConnectDatabase()
