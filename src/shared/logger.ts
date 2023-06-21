/* eslint-disable no-undef */
import path from 'path'
import moment from 'moment'

import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
const { combine, timestamp, label, printf } = format

const myFormat = printf(({ level, message, label, timestamp }) => {
    const nowData: string = moment(timestamp).format('lll')

    return `${nowData} [${label}] ${level}: ${message}`
})

export const logger = createLogger({
    level: 'info',
    format: combine(label({ label: 'AB' }), timestamp(), myFormat),
    transports: [
        new transports.Console(),

        new DailyRotateFile({
            filename: path.join(
                process.cwd(),
                'logs',
                'winston',
                'successes',
                'ab-%DATE%-success.log'
            ),
            datePattern: 'HH-DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
})

export const errorLogger = createLogger({
    level: 'error',
    format: combine(label({ label: 'AB' }), timestamp(), myFormat),
    transports: [
        new transports.Console(),

        new DailyRotateFile({
            filename: path.join(
                process.cwd(),
                'logs',
                'winston',
                'errors',
                'ab-%DATE%-error.log'
            ),
            datePattern: 'HH-DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
})
