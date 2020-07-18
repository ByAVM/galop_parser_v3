const request = require('request').defaults({ followRedirect: true });
const FileStore = require('tough-cookie-filestore');
const path = require('path')

const jarPath = path.resolve(__dirname, '../../cookies.json');
const jar = request.jar(new FileStore( jarPath ));

const authUrl = 'https://hkmsport.de/customer/account/loginPost/';
const user = {
  login: '209460',
  password: 'B9PD47mN2'
};

module.exports = function() {
  return new Promise(( resolve, reject ) => {
    request.post({ url: authUrl, jar, form: {
      login: {
        username: user.login,
        password: user.password
      }
    } }, ( err ) => {
      if (err) {
        return reject( err )
      }
      console.log( 'Auth complete' )
      return resolve()
    });
  });
}
