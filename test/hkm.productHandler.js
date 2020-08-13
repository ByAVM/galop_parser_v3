const { productHandler } = require('../lib/Hkm')
const readFileSync = require('fs').readFileSync

const body = readFileSync(__dirname + '/pages/hkm.product.html')

try {
  const product = productHandler(body.toString())
  console.log(product)
} catch (error) {
  console.log(error.message)
}