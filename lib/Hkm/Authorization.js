const got = require('../http/got')
const FormData = require('form-data')

const authUrl = 'https://hkmsport.de/customer/account/loginPost/';
const formData = new FormData()

formData.append('login[username]', '209460')
formData.append('login[password]', 'B9PD47mN2')

function log(opts) {
  console.log(opts.url)
}

function authtorize() {
  return got.post({ url: authUrl, body: formData, hooks: {beforeRequest: [log]} })
}

//module.exports = authtorize
authtorize()