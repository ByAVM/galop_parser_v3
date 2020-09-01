const { categoryHandler } = require('../lib/Loesdau')
const got = require('got')

const categoryLink = 'https://www.loesdau.de/pferd/koerper/pferdedecken/regendecken-uebergangsdecken/'

const getProducts = async (url) => {
  const links = []
  let hasNext = false
  
  do {
    const { body } = await got(url)
    const chunk = categoryHandler(body)

    if (chunk.next) {
      url = chunk.next
      hasNext = true
    } else {
      hasNext = false
    }

    links.push(...chunk.links)
  } while (hasNext)

  return links
}

getProducts(categoryLink)
  .then(result => {
    console.log(result)
    console.log(result.length)

    console.log(result.slice(0, 26).map(r => ({url: r, category: 'Дождевые попоны'})))
  })
