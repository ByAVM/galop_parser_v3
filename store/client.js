const { MongoClient } = require('mongodb')

/**
 * Создает соединение и выполняет подключение к серверу MongoDB
 * @async
 * @returns Клиент MongoDB
 */
async function connectToDb() {
  const { MONGODB_HOST, MONGODB_DB, MONGODB_PASSWORD, MONGODB_USER} = process.env

  const url = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DB}`

  const connection = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

  let client = await connection.connect()

  return client
}

module.exports = connectToDb