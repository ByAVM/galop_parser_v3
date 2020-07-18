const { MongoClient } = require('mongodb')

const SCHEDULED = 'scheduled_products'

async function connectToDb(login, password, host, dbName) {
  const url = `mongodb://${login}:${password}@${host}/${dbName}`

  const connection = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

  let client = await connection.connect()

  return client
}

/**
 * Сначала обрабатываем категории, получаем все ссылки на товары
 * Потом отправляем их на парсинг
 * @param {Db} db
 * @param {Object[]} categories 
 * @param {Function} categoryHandler 
 */
async function parseCategories(db, categories, categoryHandler, getBody) {
  const collectionScheduledProducts = db.collection(SCHEDULED)
  await collectionScheduledProducts.drop()

  for (let row of categories) {
      const productLinks = []
      let url = row.url
      let category = row.category
      let hasNext = false

      try {
        do {
          const { body } = await getBody(url)
          const productLinksChunk = categoryHandler(body)
          productLinks.push(...productLinksChunk)

          if (productLinks[productLinks.length - 1].next) {
            url = productLinks.pop().next
            hasNext = true
          } else { hasNext = false }
        } while (hasNext)
      } catch (error) { console.log(`${error.message} ${url}`) }

      // Добавили категорию чтобы передать её товару
      await collectionScheduledProducts.insertMany(productLinks.map(url => ({ url, category })))
      console.log(`Scheduled: ${category} ( ${productLinks.length} товаров )`)
  }
}

/**
 * 
 * @param {Db} db 
 * @param {string} productsCollectionForSave 
 * @param {Function} productHandler
 * @param {got} getBody
 */
async function parseProducts(db, productsCollectionForSave, productHandler, getBody, converter = null) {
  const scheduled = db.collection(SCHEDULED)
  const collectionProducts = db.collection(productsCollectionForSave)

  const productsCount = await scheduled.countDocuments()
  let currentProduct = 1

  const cursor = await scheduled.find()
  
  let productMeta
  let product
  while (await cursor.hasNext()) {
    productMeta = await cursor.next()

    const { body } = await getBody(productMeta.url)
    product = productHandler(body)
    product.categories.push(productMeta.category)

    if (converter) {
      converter(product)
    }

    await collectionProducts.insertOne(product)

    console.log(`Done [${currentProduct++} / ${productsCount}] ${product.title}`)
  }
 
  console.log('Complete')
  return await scheduled.drop()
}

/**
 * 
 * @param {MongoClient} client 
 * @param {string} collectionName 
 * @param {Object[]} tableData 
 * @param {Function} categoryHandler 
 * @param {Function} productHandler 
 */
async function parser(client, collectionName, tableData, http, handlers) {
  const db = client.db()
  await parseCategories(db, tableData, handlers.categoryHandler, http)
  await parseProducts(db, collectionName, handlers.productHandler, http, handlers.converter)
}

module.exports = {
  connectToDb,
  parseCategories,
  parseProducts,
  parser
}