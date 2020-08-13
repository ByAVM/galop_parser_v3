const { productHandler } = require('../lib/Waldhausen')
const readFileSync = require('fs').readFileSync

const body = readFileSync(__dirname + '/pages/waldhausen.product.html')
const product = productHandler(body.toString())
console.log(product)