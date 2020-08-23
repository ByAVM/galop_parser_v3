const { parser } = require('../lib/Parser')
const connectToDb = require('../store/client')
const readCsv = require('../lib/readCsv')
const pathResolve = require('path').resolve
const { round } = require('../lib/Utilities')
const got = require('got')
const deepl = require('../lib/translate/deepl')

require('dotenv').config()

const { BASE_RATE, SALE_RATE, DEEPL_API_KEY } = process.env

const storeList = {
  hypostore: require('../lib/Hypostore'),
  hkm: require('../lib/Hkm'),
  waldhausen: require('../lib/Waldhausen'),
  loesdau: require('../lib/Loesdau'),
  kraemer: require('../lib/Kraemer')
}

/**
 * Модификация товаров
 * @param {Product} product 
 */
async function converter(product) {
  // Конвертация цен
  const base = product.price.base
  product.price.base = round(base, BASE_RATE)
  product.price.sale = round(base, SALE_RATE)

  // Перевод описания
  if (product.description.length > 0) {
    const translation = await deepl([product.description, ...product.colors], DEEPL_API_KEY)
    product.descriptionRu = translation.shift()
    product.colorsRu.push(...translation)
  }
}

async function main(store, csvPath, collectionName) {
  if (!collectionName) { collectionName = store }

  const { MONGODB_HOST, MONGODB_NAME, MONGODB_PASSWORD, MONGODB_USER} = process.env

  if (!(store in storeList)) {
    console.log(`Для магазина '${store}' не найдено обработчиков`)
    return
  }

  const { categoryHandler, productHandler } = storeList[store]
  
  let client = null
  try {
    const csvData = await readCsv(pathResolve( csvPath ))
    client = await connectToDb(MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_NAME)
    const handlers = {
      categoryHandler,
      productHandler,
      converter
    }
    await parser(client, collectionName, csvData, got, handlers)
  } catch (error) {
    console.error(error)
  }

  if (client) { await client.close() }
}

module.exports = main