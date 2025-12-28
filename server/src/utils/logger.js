import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'bidsense-api' },
  transports: [
    // Write all logs to error.log
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs/error.log'),
      level: 'error'
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs/combined.log')
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
