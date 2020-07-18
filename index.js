const { parser, connectToDb } = require('./lib/Parser')
const readCsv = require('./lib/readCsv')
const pathResolve = require('path').resolve
const { round } = require('./lib/Utilities')
const got = require('got')

const args = process.argv.slice(2)

const storeList = {
  hypostore: {
    productHandler: require('./lib/Hypostore/ProductHandler'),
    categoryHandler: require('./lib/Hypostore/CategoryHandler')
  },
  hkm: {
    productHandler: require('./lib/Hkm/ProductHandler'),
    categoryHandler: require('./lib/Hkm/CategoryHandler'),
    // Authorization: require('./lib/Hkm/Authorization')
  },
  loesdau: {
    productHandler: require('./lib/Loesdau/ProductHandler'),
    categoryHandler: require('./lib/Loesdau/CategoryHandler')
  },
  kraemer: {
    productHandler: require('./lib/Kraemer/ProductHandler'),
    categoryHandler: require('./lib/Kraemer/CategoryHandler')
  }
}

const csvPath = args[0]
const store = args[1]
const collectionName = args[2] ? args[2] : store

/**
 * 
 * @param {Product} product 
 */
function converter(product) {
  product.price.base = round(product.price.base, 110)
  product.price.sale = round(product.price.base, 110)
}

async function main() {
  const login = 'parser'
  const password = 'parser_pass'
  const dbName = 'parserdb'
  const host = 'localhost'

  if (!(store in storeList)) {
    console.log(`Store ${store} not found in store list`)
    return
  }

  const { categoryHandler, productHandler } = storeList[store]

  try {
    const csvData = await readCsv(pathResolve( csvPath ))
    const client = await connectToDb(login, password, host, dbName)
    const handlers = {
      categoryHandler,
      productHandler,
      converter
    }
    await parser(client, collectionName, csvData, got, handlers)
  } catch (error) {
    console.error(error)
  }

  client.close()
}

main()