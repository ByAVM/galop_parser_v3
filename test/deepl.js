const deepl = require('../lib/translate/deepl')
require('dotenv').config()
deepl('Lined', process.env.DEEPL_API_KEY)
      .then(console.log)