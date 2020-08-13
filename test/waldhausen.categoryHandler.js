const { categoryHandler } = require('../lib/Waldhausen')
const got = require('got')

const categoryLink = 'https://www.waldhausen.com/en/horses/horse-rugs/turnout-rugs.html'

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