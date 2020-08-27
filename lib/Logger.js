require('dotenv').config()

const { writeFileSync, appendFileSync } = require('fs')
const pathResolve = require('path').resolve

/** @type {Intl.DateTimeFormatOptions} */
const formatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', formatOptions)

/**
 * log levels:
 * 0 - off
 * 1 - errors
 * 2 - errors, warnings
 * 3 - errors, warnings, info
 */
function Logger(options) {
  const defaults = {
    title: 'general',
    level: 1,
    console: true
  }

  Object.assign(defaults, options)

  this.path = pathResolve(__dirname, `../log/${defaults.title}.log`)
  this.level = defaults.level
  this.console = defaults.console
  this.title = defaults.title
}

Logger.prototype.clear = function() {
  console.log(`Clear [${this.title}] log`)
  writeFileSync(this.path, '')
}

Logger.prototype._log = function(msg, type) {
  const date = dateFormatter.format(new Date())

  const logString = `[${this.title}] ${date} _${type}_ ${msg}`

  if (this.console) { console.log(logString) }

  appendFileSync(this.path, `${logString}\n`)
}

Logger.prototype.info = function(msg) {
  if (this.level >= 3) { this._log(msg, 'INFO')}
}

Logger.prototype.warn = function(msg) {
  if (this.level >= 2) { this._log(msg, 'WARN')}
}

Logger.prototype.error = function(msg) {
  if (this.level >= 1) { this._log(msg, 'ERROR')}
}

Logger.prototype.log = function(msg) {
  this._log(msg, 'LOG')
}

const instance = new Logger({
  title: 'general',
  level: process.env.LOG_LVL,
  console: true
})

module.exports = {
  Logger,
  instance
}
