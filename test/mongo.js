require('dotenv').config()
const connect = require('../lib/store/client')

async function test() {
  try {
    const client = await connect()
    console.log(await client.db().collections())
  } catch (error) {
    console.log(error)
  }
}

test()