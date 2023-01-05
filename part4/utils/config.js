require('dotenv').config()

const URL = process.env.MONGODB_URI
const PORT = process.env.PORT

module.exports = {
    URL,
    PORT
}