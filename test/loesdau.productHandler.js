const { productHandler } = require('../lib/Loesdau')
const readFileSync = require('fs').readFileSync

const body = readFileSync(__dirname + '/pages/loesdau.product.html')

try {
  const product = productHandler(body.toString())
  console.log(product)
} catch (error) {
  console.log(error.message)
}
