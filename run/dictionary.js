const writeToPath = require('fast-csv').writeToPath
const pathResolve = require('path').resolve
const connectToDb = require('../store/client')
require('dotenv').config()

const { MONGODB_HOST, MONGODB_NAME, MONGODB_PASSWORD, MONGODB_USER} = process.env
const args = process.argv.slice(2)

async function main(collectionName, savePath) {

  let client = null
  try {
    client = await connectToDb(MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_NAME)
    const collection = client.db().collection(collectionName)

    const count = await collection.countDocuments()
    const cursor = await collection.find({}, { title: true, colors: true, sizes: true }).addCursorFlag('noCursorTimeout', true)

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

    writeToPath(pathResolve(savePath, `${collectionName}_colors.csv`), Object.entries(colors), {
      headers: ['en', 'ru']
    })
    writeToPath(pathResolve(savePath, `${collectionName}_sizes.csv`), Object.entries(sizes), {
      headers: ['en', 'ru']
    })

    console.log('Complete')
  } catch (error) {
    console.log(error.message)
  }

  if (client) { await client.close() }
}

module.exports = main
