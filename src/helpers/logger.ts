const winston = require('winston');                 // Log Library
const { format } = require('winston');
const { combine} = format;
require('winston-daily-rotate-file');

let logger;


var transport = new (winston.transports.DailyRotateFile)({
    filename: 'logs/testator-api-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
    });


// Log levels (from 0 to 7, highest to lowest):
// { emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7} 
logger = winston.createLogger({               
    levels: winston.config.syslog.levels,
    format:combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.align(),
    format.printf(info => {
        const { timestamp, level, message } = info;
        return `${timestamp} [${level}]: ${message}`;
    }),
),
    transports: [
        new winston.transports.Console({level : 'debug'}),
        transport
    ]
});


export default logger;