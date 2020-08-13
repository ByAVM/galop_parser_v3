/**
 * @typedef {(body: string) => CategoryHandlerResult} CategoryHandler
 */
/**
 * @typedef {(body: string) => Product} ProductHandler
 */

/**
 * @typedef {Object} CategoryHandlerResult
 * @property {string[]} links
 * @property {string} next
 */
/**
 * @typedef {Object} Price
 * @property {number} base
 * @property {number} sale
 */
/**
 * @typedef {Object} Product
 * @property {string} baseVC
 * @property {string} title
 * @property {string} description
 * @property {string} url
 * @property {string} brand
 * @property {string[]} colors
 * @property {string[]} sizes
 * @property {string[]} imagesSrc
 * @property {string[]} images
 * @property {string[]} categories
 * @property {string} titleRu
 * @property {string} descriptionRu
 * @property {string[]} colorsRu
 * @property {string[]} sizesRu
 * @property {number} imagesLoaded
 * @property {Price} price
 */