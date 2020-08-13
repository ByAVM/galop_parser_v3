/**
 * Выполняет тестирование на реальном запросе одного товара
 * к каждому магазину. Необходимо выполнять перед началом парсинга.
 * Результаты складываются в test/results
 */

const pathResolve = require('path').resolve
const writeFileSync = require('fs').writeFileSync
const got = require('got')

const stores = {
  hkm: require('../lib/Hkm'),
  loesdau: require('../lib/Loesdau'),
  hypostore: require('../lib/Hypostore'),
  waldhausen: require('../lib/Waldhausen')
}

const testLinks = {
  hkm: 'https://hkmsport.de/pferd/pferdedecken.html?cat=1258',
  loesdau: 'https://www.loesdau.de/pferd/koerper/sattelunterlagen/schabracken/',
  hypostore: '',
  waldhausen: ''
}

/**
 * Тест магазина
 * @param {string} storeName Название магазина
 * @param {string} categoryUrl Ссылка на категорию
 * @param {CategoryHandler} categoryHandler Обработчик категориии
 * @param {ProductHandler} productHandler Обработчик товара
 */
async function runTestShop(storeName, categoryUrl, categoryHandler, productHandler) {
  const categoryResponse = await got(categoryUrl)
  const categoryResult = categoryHandler(categoryResponse.body)

  const productUrl = categoryResult.links[0]

  const productResponse = await got(productUrl)
  const productData = productHandler(productResponse.body)
  productData.url = productUrl

  const testResult = {
    categoryUrl,
    productData,
    productsCount: categoryResult.links.length,
    hasNext: categoryResult.next ? true : false
  }

  writeFileSync(pathResolve(__dirname, `../files/fulltest_${storeName}.json`), JSON.stringify(testResult, null, 2))
}

const start = async () => {
  console.log('Start full test')

  for (const store in testLinks) {
    if (!testLinks[store]) {continue}

    try {
      await runTestShop(store, testLinks[store], stores[store].categoryHandler, stores[store].productHandler)
      console.log(`Done ${store}`)
    } catch (error) {
      console.log(error.message)
    }
  }
}

module.exports = start
