const Cheerio = require('cheerio')

/**
 * Извлекает ссылки на товары со страницы категории
 * @param {html} body - HTML разметка страницы категории
 */
function CategoryHandler( body ) {
  const $ = Cheerio.load( body )
  const links = []

  $('ol.products li.product a.product-item-link').each((i, el) => {
    links.push( $(el).attr('href') )
  })

  const next = $('a.action.next').first()
  if ( next.length > 0 ) {
    links.push({ next: next.attr('href') })
  }

  return links
}

module.exports = CategoryHandler