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
    this.sizesRu = []
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

  setPrice(a, b) {
    const f = Number(a);
    const s = Number(b);

    if (typeof f !== 'number' || typeof s !== 'number') throw new Error('Проблема с ценами');

    if (f >= s) {
      this.price.base = f;
      this.price.sale = s;
    } else {
      this.price.base = s;
      this.price.sale = f;
    }
  }
}

module.exports = Product
