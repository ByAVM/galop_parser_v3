const Cheerio = require('cheerio')
const Product = require('../Product')
const { collapseText, setPrice } = require('../Utilities')

/**
 * Извлекает информацию о товаре со страницы
 * @param {html} body - HTML разметка страницы товара
 * @returns {Product}
 */
function ProductHandler( body ) {
  const $ = Cheerio.load( body )
  const item = new Product()

  item.title = collapseText( $('.pr_prodname').text() )
  item.description = collapseText( $('span[itemprop=description]').text() )
  
  item.baseVC = $('.pr_number').text().match(/\S+$/m).shift()

  let f = Number( $('.pr_price_left').first().text().replace(/[^0-9]/g, '').trim() ) / 100
  let s = Number( $('.pr_price_right').first().text().replace(/[^0-9]/g, '').trim() ) / 100

  item.price = setPrice( f, s )
  item.originalPrice = Object.assign( {}, item.price )

  let imagesSrc = []

  $('.pr_depVarColor a img').each((i, img) => {
    imagesSrc.push(`https://www.kraemer.de${$(img).attr('src').replace('klein', 'gross')}`)
  });

  if (imagesSrc.length == 0 && $('.bigPic img').length !== 0 ) {
    imagesSrc.push(`https://www.kraemer.de${$('.bigPic img').attr('jqimg')}`)
  }

  item.imagesSrc = imagesSrc

  let colors = []
  $('.pr_depVarColor a').each((i, color) => {
    colors.push( collapseText( $(color).text() ))
  })

  item.colors = colors

  let sizes = []
  $('.pr_depVarSize').each((i, size) => {
    sizes.push( collapseText( $(size).text() ))
  })
  item.sizes = sizes

  return item
}

module.exports = ProductHandler
