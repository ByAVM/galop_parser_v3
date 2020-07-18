const Cheerio = require('cheerio')

/**
 * Извлекает ссылки на товары со страницы категории
 * @param {html} body - HTML разметка страницы категории
 */
function CategoryHandler( body ) {
  const $ = Cheerio.load( body )
  const links = []

  $('.item .product-name a[href]').each((i, el) => {
    links.push( $(el).attr('href') );
  });

  if ($('a.next.i-next').length > 0) {
    const next = $('a.next.i-next[href]').first().attr('href');
    links.push({ next });
  }

  return links
}

module.exports = CategoryHandler