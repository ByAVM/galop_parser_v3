/**
 * Загрузка товаров в ВКонтакте
 * 
 * В процессе загрузки товаров можно записывать информацию о нём
 * в отдельную коллекцию.
 */

const easyvk = require('easyvk')

const connectToDb = require('../store/client')
require('dotenv').config()

const { MONGODB_HOST, MONGODB_USER, MONGODB_PASSWORD, MONGODB_NAME } = process.env

async function upload(collectionName) {
  const client = await connectToDb(MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_NAME)

  const collection = client.db().collection(collectionName)

  const count = await collection.countDocuments()
  const cursor = await collection.find({}, {_id: true, imagesSrc: true, title: true})
    .addCursorFlag('noCursorTimeout', true)

  let currentProduct = 1
  while (await cursor.hasNext()) {
    const product = await cursor.next()

    console.log(`Done [${currentProduct++} / ${count}] ${product.title}`)
  }
}

module.exports = upload
