const { MongoClient, Db } = require('mongodb')

const SCHEDULED = 'scheduled_products'



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
      } catch (error) {
        console.log(`${error.message} ${url}`)
        continue
      }

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

  const cursor = await scheduled.find({}).addCursorFlag('noCursorTimeout', true)

  while (await cursor.hasNext()) {
    const productMeta = await cursor.next()

    const { body } = await getBody(productMeta.url)
    try {
      const product = productHandler(body)
      if (!product) { continue }
    
      product.categories.push(productMeta.category)

      if (converter) {
        await converter(product)
      }

      scheduled.deleteOne({ _id: productMeta._id })
      await collectionProducts.insertOne(product)

      console.log(`Done [${currentProduct++} / ${productsCount}] ${product.title}`)
    } catch (error) {
      console.log(`${error.message} ${productMeta.url}`)
    }
  }

  console.log('Complete')
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
  if (await db.collection(collectionName).countDocuments() > 0) {
    console.log('Has scheduled products continuing')
  } else {
    await parseCategories(db, tableData, handlers.categoryHandler, http)
  }
  await parseProducts(db, collectionName, handlers.productHandler, http, handlers.converter)
}

module.exports = {
  parseCategories,
  parseProducts,
  parser
}