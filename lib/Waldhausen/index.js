const cheerio = require('cheerio')
const Product = require('../Product')
const { setPrice } = require('../Utilities')

/**
 * @type {CategoryHandler}
 */
function categoryHandler(body) {
  const $ = cheerio.load(body)

  const products = $('.category-products li.item .product-name a')
  const links = products.map((i, link) => $(link).attr('href')).get()
  let next = false

  const nextNode = $('a.next.i-next')
  if (nextNode.length > 0) {
    next = nextNode.attr('href')
  }

  return {
    links,
    next
  }
}

function parseScript(body) {
  const start = body.search(/\{\"attributes/)
  const end = body.search(/;\n\s+var spConfig/)

  if (end < start) {
    throw new Error('RegExp found wrong data')
  }

  const objectString = body.substring(start, end)
  return JSON.parse(objectString)
}

/**
 * @type {ProductHandler}
 */
function productHandler(body) {
  const $ = cheerio.load(body)
  const product = new Product()

  try {
    // Нужно парсить объект
    const config = parseScript(body)

    product.baseVC = config.base_sku

    product.title = $('.product-name h1').first().text().trim()
    product.description = $('#product_tabs_description_tabbed_contents .std').text().trim()

    product.setPrice(config.basePrice, config.oldPrice)

    if (config.attributes && config.attributes['92']) {
      product.colors = config.attributes['92'].options.map(o => o.label)
    }
    
    if (config.attributes && config.attributes['181']) {
      product.sizes = config.attributes['181'].options.map(o => o.label)
    }

    const images = $('.product-image-thumbs a').map((i, a) => $(a).attr('href')).get()
    product.imagesSrc = images

    return product
  } catch (error) {
    console.log(error)
  }
  
  return null
}

module.exports = {
  categoryHandler,
  productHandler
}