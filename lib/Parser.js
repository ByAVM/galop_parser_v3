const { MongoClient, Db } = require('mongodb')

const logger = require('./Logger').instance

let SCHEDULED = 'scheduled_products'



/**
 * Сначала обрабатываем категории, получаем все ссылки на товары
 * Потом отправляем их на парсинг
 * @param {Db} db
 * @param {Object[]} categories 
 * @param {CategoryHandler} categoryHandler 
 */
async function parseCategories(db, categories, categoryHandler, getBody) {
  const collectionScheduledProducts = db.collection(SCHEDULED)
  
  try {
    await collectionScheduledProducts.drop()
  } catch(error) {}

  for (let row of categories) {
      const productLinks = []
      let url = row.url
      let category = row.category
      let hasNext = false

      try {
        do {
            const { body } = await getBody(url)
            const chunk = categoryHandler(body)

            if (chunk.next) {
              url = chunk.next
              hasNext = true
            } else {
              hasNext = false
            }

            productLinks.push(...chunk.links)
        } while (hasNext)

        // Добавили категорию чтобы передать её товару
        await collectionScheduledProducts.insertMany(productLinks.map(url => ({ url, category })))
        logger.info(`Scheduled: ${category} ( ${productLinks.length} товаров )`)

      } catch (error) {
        logger.error(`${error.message} ${url}`)
        continue
      }
  }
}

/**
 * 
 * @param {Db} db 
 * @param {string} productsCollectionForSave 
 * @param {ProductHandler} productHandler
 * @param {got} getBody
 */
async function parseProducts(db, productsCollectionForSave, productHandler, getBody, converter = null) {
  const scheduled = db.collection(SCHEDULED)
  const collectionProducts = db.collection(productsCollectionForSave)

  const productsCount = await scheduled.countDocuments()
  let currentProduct = 1

  const cursor = await scheduled.find({}).addCursorFlag('noCursorTimeout', true)

  while (await cursor.hasNext()) {
    const productMeta = await cursor.next()

    const { body } = await getBody(productMeta.url)
    try {
      const product = productHandler(body)
      if (!product) { continue }

      product.categories.push(productMeta.category)
      product.url = productMeta.url

      if (converter) {
        await converter(product)
      }

      scheduled.deleteOne({ _id: productMeta._id })
      await collectionProducts.insertOne(product)

      logger.info(`Done [${currentProduct++} / ${productsCount}] ${product.title}`)
    } catch (error) {
      logger.error(`${error.message} ${productMeta.url}`)
    }
  }

  logger.log('Complete')
}

/**
 * 
 * @param {MongoClient} client 
 * @param {string} storeName 
 * @param {Object[]} tableData 
 * @param {Function} categoryHandler 
 * @param {Function} productHandler 
 */
async function parser(client, storeName, tableData, http, handlers) {
  SCHEDULED = `${storeName}_scheduled`

  const db = client.db()

  if (await db.collection(SCHEDULED).countDocuments() > 0) {
    logger.log('Has scheduled products continuing')
  } else {
    await parseCategories(db, tableData, handlers.categoryHandler, http)
  }
  await parseProducts(db, storeName, handlers.productHandler, http, handlers.converter)

  client.close()
}

module.exports = {
  parseCategories,
  parseProducts,
  parser
}