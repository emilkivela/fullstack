require('dotenv').config()

let mongoUrl = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_TEST_URI
  : process.env.MONGODB_URI
let PORT = process.env.PORT

module.exports = {
  mongoUrl,
  PORT
}
 