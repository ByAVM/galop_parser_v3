const Cheerio = require('cheerio')

/**
 * Извлекает ссылки на товары со страницы категории
 * @param {html} body - HTML разметка страницы категории
 */
function CategoryHandler( body ) {
  const $ = Cheerio.load( body )
  const links = []

  $('a.pr_infos[href]').each((i, el) => {
    links.push( $(el).attr('href') )
  })

  return links
}

module.exports = CategoryHandler