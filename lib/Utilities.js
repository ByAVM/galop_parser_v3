const fs = require('fs')

const Utilities = {
  collapseText: ( text ) => {
    return text.replace(/\s+/g, ' ').trim()
  },
  readJSON: ( path ) => {
    if ( !fs.existsSync( path )) {
      throw new Error( `JSON not found: ${ path }` );
    }

    const data = fs.readFileSync( path )
    return JSON.parse( data )
  },
  writeJSON: ( path, data ) => {
    fs.writeFileSync( path, JSON.stringify( data, null, 2 ))
  },
  /**
   * Заменяет символы Умлаут на транскрипцию
   * @param {String} str строка с Умлаут
   */
  umlautReplace: function(str) {
    return str.replace(/ö/g, 'oe')
      .replace(/ä/g, 'ae')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/Ö/g, 'Oe')
      .replace(/Ü/g, 'Ue')
      .replace(/Ä/g, 'Ae');
  },
  /**
   * Выбирает базовую и цену со скидкой
   * @param {Number} f
   * @param {Number} s
   */
  setPrice: (f, s) => {
    f = Number(f);
    s = Number(s);

    if (typeof f !== 'number' || typeof s !== 'number') throw new Error('Проблема с ценами');

    let res = {};

    if (f >= s) {
      res.base = f;
      res.sale = s;
    } else {
      res.base = s;
      res.sale = f;
    }

    return res;
  },
  /**
   * Конвертирует цену по курсу
   * @param {number} price - цена
   * @param {number} exRate - курс
   */
  round: (price, exRate) => {
    let res = price * exRate;
    res = Math.round(res / 100) * 100;
    res = res.toFixed(2);

    return Number( res );
  },
  alphabet: ( i ) => {
    const ABC = [
      'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o',
      'p', 'q', 'r', 's', 't',
      'u', 'v', 'w', 'x', 'y',
      'z'
    ]

    if ( !ABC[i] ) {
      throw new Error(`${i}'th symbol not found!`)
    }
    return ABC[i]
  }
}

module.exports = Utilities