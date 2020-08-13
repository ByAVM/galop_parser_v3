const cheerio = require('cheerio')
const Product = require('../Product')
const { setPrice } = require('../Utilities')

/**
 * @type {CategoryHandler}
 */
function categoryHandler(body) {
  const $ = cheerio.load( body )
  const links = []
  let next = false

  $('.item .product-name a[href]').each((i, el) => {
    links.push( $(el).attr('href') );
  });

  if ($('a.next.i-next').length > 0) {
    next = $('a.next.i-next[href]').first().attr('href');
  }

  return {
    links,
    next
  }
}

function parseProductConfig( script ) {
  const scriptStr = script.replace(/var spConfig*=\s?new Product.Config\(/, '').trim()
  const index = scriptStr.search( /\}\);/ ) + 1

  let info = scriptStr.substring( 0, index )
  info = JSON.parse( info )

  const resp = {
    colors: [], 
    sizes: [], 
    basePrice: {
      sale: info.basePrice,
      base: info.oldPrice
    },
    title: info.productName,
    description: info.description ? info.description.replace(/<br[^>]*>/g, '\n').replace(/<[^>]*>/g, '').replace(/ +/g, ' ').trim() : '',
    source: info
  };

  if ( info.attributes &&
    info.attributes['152'] &&
    info.attributes['152'].options &&
    Array.isArray( info.attributes['152'].options )
  ) {
    for ( let colorObj of info.attributes['152'].options ) {
      const color = colorObj.label.replace(/[0-9]/g, '').trim();
      resp.colors.push( color );
    }
  }

  if ( info.attributes &&
    info.attributes['153'] &&
    info.attributes['153'].options &&
    Array.isArray( info.attributes['153'].options )
  ) {
    for ( let sizeObj of info.attributes['153'].options ) {
      const size = sizeObj.label;
      resp.sizes.push( size );
    }
  }

  return resp;
}

/**
 * @type {ProductHandler}
 */
function productHandler( body ) {
  const $ = cheerio.load( body )
  const item = new Product()

  const vc = $('.extra-info .tax_freight_charge')
  if ( vc.length == 0 ) {
    throw new Error(`Vendor Code not found for item ${item.title}`)
  }

  item.baseVC = vc.first().text().match(/\d+$/m).shift()
  
  let scriptData = null;

  $('script').each((i, script) => {
    if ($(script).html().match(/new Product.Config\(\{/)) {
      scriptData = parseProductConfig( $(script).html() )
      return true;
    }
  });

  if ( scriptData === null ) {
    throw new Error( 'Empty item body' )
  }

  item.title = scriptData.title
  item.description = scriptData.description

  // Тут цена для обычного пользователя, если нужна с авторизацией,
  // то придётся полазить в scriptData
  item.price = setPrice( scriptData.basePrice.base, scriptData.basePrice.sale )
  let imagesSrc = [];

  $('ul li.item a').each((i, el) => {
    imagesSrc.push( $(el).data('image') )
  });

  if ( imagesSrc.length === 0 && $('img#image-main').length > 0 ) {
    imagesSrc.push( $('img#image-main').attr('src') )
  }
  item.imagesSrc = imagesSrc

  item.colors = scriptData.colors
  item.sizes = scriptData.sizes

  return item
}

module.exports = {
  categoryHandler,
  productHandler
}