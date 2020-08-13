const { categoryHandler } = require('../lib/Hkm')
const got = require('got')

const categoryLink = 'https://hkmsport.de/pferd/pferdedecken.html?cat=1258'

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
  })