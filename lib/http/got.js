const got = require('got')
const pathResolve = require('path').resolve

const ToughCookieFilestore = require('tough-cookie-file-store').FileCookieStore
const CookieJar = require('tough-cookie').CookieJar

const cookieJar = new CookieJar(new ToughCookieFilestore(pathResolve(__dirname, 'cookies.json')))
const gotInstance = got.extend({
  cookieJar
})

module.exports = gotInstance