const Cheerio = require('cheerio')
const Product = require('../Product')
const { collapseText, setPrice } = require('../Utilities')
const { getVC } = require('./ProductVC')

/**
 * Находит в теле страницы json с конфигурацией галереи изображений
 * @param {string} body 
 */
function getGalleryConfig(body) {
  let startIndex = 0;
  let endIndex = 0;

  startIndex = body.search(/"mage\/gallery\/gallery":/)
  endIndex = body.search(/\s+"options":/)

  if (startIndex < 0 || endIndex < 0) {
    console.log('galleryConfig не найден')
    return null
  }

  startIndex += 23
  endIndex -= 1

  let config = null;
  const str = body.substring(startIndex, endIndex) + '}'
  try {
    config = JSON.parse(str)
  } catch (err) {
    console.log('Не удалось получить валидный JSON')
    console.log(str)

    throw err
  }

  return config
}

/**
 * Находит в теле страницы json с конфигурацией продукта
 * @param {string} body - html страницы
 */
function getProductConfig(body) {
  let startIndex = 0;
  let endIndex = 0;

  startIndex = body.search(/{"attributes":/)
  endIndex = body.search(/,\s+"jsonSwatchConfig":/)

  if (startIndex < 0 || endIndex < 0) {
    startIndex = body.search(/{"attributes":/)
    endIndex = body.search(/,\n\s+"gallerySwitchStrategy":/)
  }

  if (startIndex < 0 || endIndex < 0) {
    console.log('jsonConfig не найден')
    return null
  }

  let config = null;
  const str = body.substring(startIndex, endIndex)

  try {
    config = JSON.parse(str)
  } catch (err) {
    console.log('Не удалось получить валидный JSON')
    console.log(str)

    throw err
  }

  return config
}

/**
 * Извлекает информацию о товаре со страницы
 * @param {html} body - HTML разметка страницы товара
 * @returns {Product}
 */
function ProductHandler( body ) {
  const $ = Cheerio.load( body )
  const item = new Product()

  let jsonConfig = getProductConfig(body)

  item.title = collapseText( $('.page-title').text() )
  item.description = collapseText( $('.product-info-main .overview').text() )
  
  const sku = $('.sku.product .value').first()

  item.baseVC = sku.length > 0 ? collapseText( sku.text() ) : getVC()
  item.baseVC = item.baseVC.replace(/[^\w-]/g, '_')

  let f = jsonConfig ? jsonConfig.prices.finalPrice.amount : $('meta[property="product:price:amount"]').attr('content')
  let s = f

  item.price = setPrice( f, s )
  item.originalPrice = Object.assign( {}, item.price )

  let imagesSrc = []

  // if (jsonConfig) {
  //   for (let imgProp in jsonConfig.images) {
  //     for (let imgObj of jsonConfig.images[imgProp]) {
  //       imagesSrc.push(imgObj.full)
  //     }
  //   }
  // }

  // if (imagesSrc.length == 0) {
    const galleryConfig = getGalleryConfig(body)

    for (let imgObj of galleryConfig.data) {
      imagesSrc.push(imgObj.full)
    }
  // }

  item.imagesSrc = imagesSrc

  let colors = []
  let sizes = []

  if (jsonConfig) {
    for (let attribute in jsonConfig.attributes) {
      let attributeObj = jsonConfig.attributes[attribute]
      if (/colour/i.test(attributeObj.label)) {
        for (let colorOpt of attributeObj.options) {
          colors.push(colorOpt.label)
        }
      } else if (/size/i.test(attributeObj.label)) {
        for (let sizeOpt of attributeObj.options) {
          sizes.push(sizeOpt.label)
        }
      }
    }
  }

  item.colors = colors
  item.sizes = sizes

  return item
}

module.exports = ProductHandler
