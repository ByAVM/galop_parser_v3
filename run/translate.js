/**
 * Перевод цветов и размеров.
 * Перевод размеров выполняется с помощью таблицы-словаря.
 * Перевод цветов с помощью API Deepl
 */

const parseCsvFile = require('fast-csv').parseFile
const pathResolve = require('path').resolve
const connectToDb = require('../lib/store/client')
require('dotenv').config()

const { MONGODB_HOST, MONGODB_DB, MONGODB_PASSWORD, MONGODB_USER} = process.env

const readDict = (path) => new Promise((resolve, reject) => {
  const data = []
  parseCsvFile(path, { headers: true, delimiter: ';'})
    .on('data', chunk => data.push(chunk))
    .on('end', () => resolve(data))
    .on('error', error => reject(error))
})

async function main(collectionName, sPath) {
  // const colorsPath = pathResolve(cPath)
  const sizesPath = pathResolve(sPath)

  // const colors = await readDict(colorsPath)
  const sizes = await readDict(sizesPath)

  let client = null
  try {
    client = await connectToDb(MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB)
    const collection = client.db().collection(collectionName)

    const count = await collection.countDocuments()
    const cursor = await collection.find({}, { _id: true, title: true, /*colors: true,*/ sizes: true }).addCursorFlag('noCursorTimeout', true)

    let currentProduct = 1
    while( await cursor.hasNext() ) {
      const product = await cursor.next()

      // const colorsRu = []
      // product.colors.forEach(color => {
      //   const lc = color.toLowerCase()
      //   if (colors[lc]) {
      //     colorsRu.push(colors[lc])
      //   } else {
      //     console.log(`Color ${lc} not found`)
      //   }
      // })

      const sizesRu = []
      product.sizes.forEach(size => {
        const lc = size.toLowerCase()
        if (sizes[lc]) {
          sizesRu.push(sizes[lc])
        } else {
          console.log(`Size ${lc} not found`)
        }
      })

      await collection.updateOne(
        { id: product._id },
        { $set: { /*colorsRu,*/ sizesRu }
      })

      console.log(`Done [${currentProduct++} / ${count}] ${product.title}`)
    }

    console.log('Complete')
  } catch (error) {
    console.log(error.message)
  }

  if (client) { await client.close() }
}

module.exports = main