const got = require('got')

/**
 * 
 * @param {String|String[]} text
 * @returns {String[]}
 */
module.exports = (text) => {
  return got.post('https://api.deepl.com/v2/translate', {
    form: {
      text,
      auth_key: process.env.DEEPL_API_KEY,
      target_lang: 'RU'
    },
    responseType: 'json'
  }).then(result => {
      return result.body.translations.map(t => t.text)
  }).catch(error => {
    console.log(error.message)
  })
}