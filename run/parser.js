require('dotenv').config()

const { parser } = require('../lib/Parser')
const connectToDb = require('../lib/store/client')
const readCsv = require('../lib/readCsv')
const pathResolve = require('path').resolve
const { round } = require('../lib/Utilities')
const got = require('../lib/http/got')
const deepl = require('../lib/translate/deepl')

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

  const hasDesc = product.description.length > 0
  const hasColors = product.colors.length > 0
  const translationArray = []

  if (hasDesc) {
    translationArray.push(product.description)
  }

  // if (hasColors) {
  //   translationArray.push(...product.colors.map(s => s.toLowerCase()))
  // }

  // Перевод
  const translation = await deepl(translationArray, DEEPL_API_KEY)

  if (hasDesc) {
    product.descriptionRu = translation.shift()
  }

  // if (hasColors) {
  //   product.colorsRu.push(...translation)
  // }
}

async function main(store, csvPath) {
  if (!(store in storeList)) {
    console.log(`Для магазина '${store}' не найдено обработчиков`)
    return
  }

  const { categoryHandler, productHandler } = storeList[store]
  
  let client = null
  try {
    const csvData = await readCsv(pathResolve( csvPath ))
    client = await connectToDb()
    const handlers = {
      categoryHandler,
      productHandler,
      converter
    }
    await parser(client, store, csvData, got, handlers)
  } catch (error) {
    console.error(error)
  }

  if (client) { await client.close() }
}

module.exports = main