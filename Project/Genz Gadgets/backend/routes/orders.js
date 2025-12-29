const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

router.get('/', async (req, res) => {
  const orders = await Order.find()
  res.json(orders)
})

router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id)
  res.json(order || {})
})

router.post('/', async (req, res) => {
  const order = new Order(req.body)
  const savedOrder = await order.save()
  res.json(savedOrder)
})

module.exports = router
