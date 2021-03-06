/**
 * Создание таблицы-словаря размеров.
 */

const writeToPath = require('fast-csv').writeToPath
const pathResolve = require('path').resolve
const connectToDb = require('../lib/store/client')
const deepl = require('../lib/translate/deepl')

async function main(collectionName, savePath) {

  let client = null
  try {
    client = await connectToDb()
    const collection = client.db().collection(collectionName)

    const count = await collection.countDocuments()
    const cursor = await collection.find({}, {projection: { title: true, colors: true, sizes: true }}).addCursorFlag('noCursorTimeout', true)

    let currentProduct = 1
    const colors = {}
    const sizes = {}
    while( await cursor.hasNext() ) {
      const product = await cursor.next()

      product.colors.forEach(color => {
        const lc = color.toLowerCase()
        if (colors[lc]) { return }
        colors[lc] = ''
      })

      product.sizes.forEach(size => {
        const lc = size.toLowerCase()
        if (sizes[lc]) { return }
        sizes[lc] = ''
      })

      console.log(`Done [${currentProduct++} / ${count}] ${product.title}`)
    }

    const translatedColors = await deepl(Object.keys(colors))

    const colorsDictionary = Object.keys(colors).forEach((key, index) => {
      colors[key] = translatedColors[index]
    })

    writeToPath(pathResolve(savePath, `${collectionName}_colors.csv`), Object.entries(colors), {
      headers: ['en', 'ru'],
      delimiter: ';'
    })
    writeToPath(pathResolve(savePath, `${collectionName}_sizes.csv`), Object.entries(sizes), {
      headers: ['en', 'ru'],
      delimiter: ';'
    })

    console.log('Complete')
  } catch (error) {
    console.log(error.message)
  }

  if (client) { await client.close() }
}

module.exports = main
