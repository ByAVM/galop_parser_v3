const cheerio = require('cheerio')
const Product = require('../Product')
const { formatText } = require('../Utilities')

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

function parseProductConfig( body ) {
  const start = body.search(/var spConfig*=\s?new Product.Config\(/)
  const end = body.search( /\}\);jQuery/ ) + 1

  let info = body.substring(start + 32, end)
  info = JSON.parse( info )

  const child = Object.values(info.childProducts)[0]
  if (!child) {
    throw new Error('Дочерний товар не найден')
  }

  const resp = {
    colors: [], 
    sizes: [], 
    basePrice: {
      sale: child.price,
      base: child.price
    },
    title: info.productName,
    description: info.description ? formatText(info.description) : '',
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

  let scriptData = parseProductConfig( body );

  if ( scriptData === null ) {
    throw new Error( 'Empty item body' )
  }

  item.title = scriptData.title
  item.description = scriptData.description

  const vc = $('.extra-info .tax_freight_charge')
  if ( vc.length == 0 ) {
    throw new Error(`Vendor Code not found for item ${item.title}`)
  }

  item.baseVC = vc.first().text().match(/\d+$/m).shift()

  // Тут цена для обычного пользователя, если нужна с авторизацией,
  // то придётся полазить в scriptData
  item.setPrice( scriptData.basePrice.base, scriptData.basePrice.sale )
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