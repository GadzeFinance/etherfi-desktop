// File referenced from https://mifi.no/blog/winston-electron-logger/
const winston = require("winston")
const util = require("util")
const isDev = process.env.NODE_ENV === "development"
const isTest = process.env.NODE_ENV === "test"
const { app } = require("electron")
const { join } = require("path")

// https://github.com/winstonjs/winston/issues/1427
const combineMessageAndSplat = () => ({
  transform(info) {
    const { [Symbol.for("splat")]: args = [], message } = info
    info.message = util.format(message, ...args)
    return info
  },
})

const createLogger = () =>
  winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      combineMessageAndSplat(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  })

const logDirPath = isDev || isTest ? "." : app.getPath("logs")

const logger = createLogger()
logger.add(
  new winston.transports.File({
    level: "debug",
    filename: join(logDirPath, "etherfi-desktop-logs.log"),
    options: { flags: "a" },
  })
)
if (isDev) logger.add(new winston.transports.Console())

module.exports = logger
