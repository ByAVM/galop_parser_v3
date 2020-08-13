const got = require('got')

module.exports = (text, apiKey) => {
  return got.post('https://api.deepl.com/v2/translate', {
    form: {
      text,
      auth_key: apiKey,
      target_lang: 'RU',
      source_lang: 'DE'
    },
    responseType: 'json'
  }).then(result => {
      return result.body.translations.map(t => t.text)
  }).catch(error => {
    console.log(error.message)
  })
}