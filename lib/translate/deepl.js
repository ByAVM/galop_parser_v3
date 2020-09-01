const got = require('got')
const FormData = require('form-data')

const { Logger } = require('../Logger')

const logger = new Logger({ title: 'deepl', console: true, level: 1 })

/**
 * 
 * @param {String|String[]} text
 * @returns {Promise<String[]>}
 */
module.exports = (text) => {
  const formData = new FormData()

  if (typeof text === 'string') {
    formData.append('text', text)
  } else if (Array.isArray(text)) {
    text.forEach(value => {
      formData.append('text', value)
    })
  }

  formData.append('auth_key', process.env.DEEPL_API_KEY)
  formData.append('target_lang', 'RU')

  return got.post('https://api.deepl.com/v2/translate', {
    body: formData,
    responseType: 'json'
  }).then(result => {
    logger.info(`source: ${result.body.translations[0].detected_source_language}`)
    return result.body.translations.map(t => t.text)
  }).catch(error => {
    logger.error(error.message)
  })
}