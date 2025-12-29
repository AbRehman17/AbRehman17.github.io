const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))

app.use('/products', require('./routes/products'))
app.use('/customers', require('./routes/customers'))
app.use('/orders', require('./routes/orders'))
app.use('/messages', require('./routes/messages'))

const PORT = process.env.PORT
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
