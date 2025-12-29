const express = require('express')
const fs = require('fs')
const app = express()
const PORT = 3000

app.use(express.json())

// Read customers from JSON file
const readCustomers = () => {
  const data = fs.readFileSync('customers.json', 'utf-8')
  return JSON.parse(data)
}

// Write customers to JSON file
const writeCustomers = (customers) => {
  fs.writeFileSync('customers.json', JSON.stringify(customers, null, 2))
}

// GET all customers
app.get('/customers', (req, res) => {
  const customers = readCustomers()
  res.json(customers)
})

// GET single customer by ID
app.get('/customers/:id', (req, res) => {
  const customers = readCustomers()
  const customer = customers.find((c) => c.id === req.params.id)
  if (!customer) return res.status(404).json({ message: 'Customer not found' })
  res.json(customer)
})

// POST create new customer
app.post('/customers', (req, res) => {
  const customers = readCustomers()
  const newCustomer = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  }
  customers.push(newCustomer)
  writeCustomers(customers)
  res.status(201).json({ message: 'Customer added', customer: newCustomer })
})

app.listen(PORT, () => {
  console.log(`Server running`)
})
