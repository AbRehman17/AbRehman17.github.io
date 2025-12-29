const express = require('express')
const router = express.Router()
const Customer = require('../models/Customer')

router.get('/', async (req, res) => {
  const customers = await Customer.find()
  res.json(customers)
})

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  res.json(customer || {})
})

router.post('/', async (req, res) => {
  const customer = new Customer(req.body)
  const savedCustomer = await customer.save()
  res.json(savedCustomer)
})

module.exports = router
