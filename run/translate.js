/**
 * Перевод цветов и размеров.
 * Перевод размеров выполняется с помощью таблицы-словаря.
 */

require('dotenv').config()
const parseCsvFile = require('fast-csv').parseFile
const pathResolve = require('path').resolve
const connectToDb = require('../lib/store/client')

const readDict = (path) => new Promise((resolve, reject) => {
  const data = []
  parseCsvFile(path, { headers: true, delimiter: ';'})
    .on('data', chunk => data.push(chunk))
    .on('end', () => {
      const dictionary = {}

      for (let row of data) {
        dictionary[row.en] = row.ru
      }
      resolve(dictionary)
    })
    .on('error', error => reject(error))
})

async function main(collectionName, cPath, sPath) {
  const colorsPath = pathResolve(cPath)
  const sizesPath = pathResolve(sPath)

  const colors = await readDict(colorsPath)
  const sizes = await readDict(sizesPath)

  let client = null
  try {
    client = await connectToDb()
    const collection = client.db().collection(collectionName)

    const batchOp = collection.initializeOrderedBulkOp()

    const count = await collection.countDocuments()
    const cursor = await collection.find({}, {
      projection: { _id: true, title: true, sizes: true }
    }).addCursorFlag('noCursorTimeout', true)

    let currentProduct = 1
    while( await cursor.hasNext() ) {
      const product = await cursor.next()

      const colorsRu = []
      product.colors.forEach(color => {
        const lc = color.toLowerCase()
        if (colors[lc]) {
          colorsRu.push(colors[lc])
        } else {
          console.log(`Color ${lc} not found`)
        }
      })

      const sizesRu = []
      product.sizes.forEach(size => {
        const lc = size.toLowerCase()
        if (sizes[lc]) {
          sizesRu.push(sizes[lc])
        } else {
          console.log(`Size ${lc} not found`)
        }
      })

      batchOp.find({_id: product._id}).updateOne({$set: { colorsRu, sizesRu }})

      console.log(`Done [${currentProduct++} / ${count}] ${product.title}`)
    }

    const result = await batchOp.execute()

    console.log(result)
    console.log('Complete')
  } catch (error) {
    console.log(error.message)
  }

  if (client) { await client.close() }
}

module.exports = main