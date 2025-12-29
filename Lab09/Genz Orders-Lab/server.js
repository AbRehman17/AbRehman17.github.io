const express = require('express')
const fs = require('fs')
const app = express()
const PORT = 3000

app.use(express.json())

// Read orders
const readOrders = () => {
  const data = fs.readFileSync('orders.json', 'utf-8')
  return JSON.parse(data)
}

// Write orders
const writeOrders = (orders) => {
  fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2))
}

// GET all orders
app.get('/orders', (req, res) => {
  const orders = readOrders()
  res.json(orders)
})

// GET single order by ID
app.get('/orders/:id', (req, res) => {
  const orders = readOrders()
  const order = orders.find((o) => o.id === req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
})

// POST create new order
app.post('/orders', (req, res) => {
  const orders = readOrders()
  const newOrder = {
    id: req.body.id,
    customerId: req.body.customerId,
    productId: req.body.productId,
    quantity: req.body.quantity,
    totalPrice: req.body.totalPrice,
    date: req.body.date,
  }
  orders.push(newOrder)
  writeOrders(orders)
  res.status(201).json({ message: 'Order added', order: newOrder })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
