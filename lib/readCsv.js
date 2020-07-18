const { parseFile } = require('fast-csv')

function readCsv(path) {
  return new Promise((resolve, reject) => {
    const data = []
    parseFile(path, { headers: ['shop', 'category', 'url'] })
      .on('data', chunk => {
        data.push(chunk)
      })
      .on('end', () => {
        resolve(data)
      })
      .on('error', error => {
        reject(error)
      })
  })
}

module.exports = readCsv