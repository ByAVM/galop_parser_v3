const { readJSON, writeJSON } = require('./Utilities')

class Product {
  constructor() {
    this.url = ''
    this.title = ''
    this.titleRu = ''
    this.description = ''
    this.descriptionRu = ''
    this.colors = []
    this.colorsRu = []
    this.sizes = []
    this.price = {
      base: null,
      sale: null
    }
    this.imagesSrc = []
    this.images = []
    this.imagesLoaded = 0
    this.baseVC = ''
    this.categories = [],
    this.brand = ''
  }

  fromJSON( path ) {
    const json = readJSON( path )
    Object.keys( this ).forEach( key => {
      this[ key ] = json[ key ]
    })
  }

  saveJSON( path ) {
    return writeJSON( path, this )
  } 
}

module.exports = Product
