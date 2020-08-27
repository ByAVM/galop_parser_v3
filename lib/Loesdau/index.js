const cheerio = require('cheerio')
const Product = require('../Product')
const { collapseText, formatText } = require('../Utilities')

/**
 * @type {CategoryHandler}
 */
function categoryHandler( body ) {
  const $ = cheerio.load( body )
  const links = []
  let next = false

  $('.productlink .image a[href]').each((i, el) => {
    links.push( $(el).attr('href') )
  })

  const nextNode = $('a.next[rel=next]').first()
  if ( nextNode.length > 0 ) {
    next = nextNode.attr('href')
  }

  return {
    links,
    next
  }
}

/**
 * @type {ProductHandler}
 */
function productHandler( body ) {
  const $ = cheerio.load( body )
  const item = new Product()

  item.title = collapseText( $('h1.headline span#productTitle').text() )

  item.description = formatText($('#loaded_tab_content_desc').first().html())
  // item.description = umlautReplace( item.description )

  item.baseVC = collapseText( $('p#product-number span[itemprop=sku]').first().text() ).replace(/[/\\]/g, '-')

  const f = Number( $('.price_container .redText').text().replace(/[^0-9]/g, '').trim() ) / 100;
  let s = 0;

  if ( $('.price_container .offer .notifications_oldPrice').length != 0 ) {
    s = Number( $('.price_container .offer .notifications_oldPrice').text().replace(/[^0-9]/g, '').trim() ) / 100;
  }

  item.setPrice( f, s );

  let imagesSrc = [];

  $('#product-thumbnails a').each((i, item) => {
    imagesSrc.push( $(item).data('big-src') );
  });

  if ( imagesSrc.length == 0 && $('#product_image_zoom').data('big-src') ) {
    imagesSrc.push( $('#product_image_zoom').data('big-src') );
  }
  item.imagesSrc = imagesSrc;

  const colors = [];
  $('.select_var_farbe .option').each((i, el) => {
    // let color = umlautReplace( $(el).text() )
    let color = $(el).text()
      .replace(/[^0-9A-Za-z.,"]g/, ' ')
      .replace(/\s+/, ' ').trim().toLowerCase();

    colors.push(color);
  });

  const sizes = [];
  $('.select_var_groesse .option').each((i, el) => {
    sizes.push( $(el).text().replace(/\[trn]/g, '').trim() );
  });

  $('.select_var_sitzgroesse .option').each((i, el) => {
    sizes.push( $(el).text().replace(/\[trn]/g, '').trim() );
  });

  $('.select_var_groesse-form .option').each((i, el) => {
    sizes.push( $(el).text().replace(/\[trn]/g, '').trim() );
  });

  item.colors = colors;
  item.sizes = sizes;

  return item
}

module.exports = {
  categoryHandler,
  productHandler
}
