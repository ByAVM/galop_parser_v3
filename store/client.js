const { MongoClient } = require('mongodb')

/**
 * Создает соединение и выполняет подключение к серверу MongoDB
 * @async
 * @param {String} login Логин пользователя БД
 * @param {String} password Пароль пользователя БД
 * @param {String} host Хост БД
 * @param {String} dbName Название БД
 * @returns Клиент MongoDB
 */
async function connectToDb(login, password, host, dbName) {
  const url = `mongodb://${login}:${password}@${host}/${dbName}`

  const connection = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

  let client = await connection.connect()

  return client
}

module.exports = connectToDb