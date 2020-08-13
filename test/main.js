const readCsv = require('../lib/readCsv')
const got = require('got')
const deepl = require('../lib/translate/deepl')
const productHandler = require('../lib/Loesdau/ProductHandler')
const categoryHandler = require('../lib/Loesdau/CategoryHandler')
const { round } = require('../lib/Utilities')
require('dotenv').config()
const Product = require('../lib/Product')

async function converter(product) {
  const base = product.price.base
  product.price.base = round(base, 110)
  product.price.sale = round(base, 95)

  if (product.description.length > 0) {
    const translation = await deepl(product.description, process.env.DEEPL_API_KEY)
    product.descriptionRu = translation.shift()
  }
}

async function test() {
  const getCategories = async (url) => {
    const { body } = await got(url)
    const categories = categoryHandler(body)
    return categories
  }
  const getProduct = async (url) => {
    const { body } = await got(url)
    const product = productHandler(body)
    product.url = url

    await converter(product)
    return product
  }


  const csv = await readCsv('./files/test.csv')
  const categories = await getCategories(csv[0].url)

  const products = []
  for (const url of await categories.slice(0, 2)) {
    const product = await getProduct(url)
    products.push(product)
  }

  console.table(products)
}

test()