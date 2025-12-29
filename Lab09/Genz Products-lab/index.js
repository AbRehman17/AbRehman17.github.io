const express = require('express')
const fs = require('fs')

const app = express()
const PORT = 3000

app.use(express.json())

// Read products from JSON file
const readProducts = () => {
  const data = fs.readFileSync('products.json', 'utf-8')
  return JSON.parse(data)
}

// Write products to JSON file
const writeProducts = (products) => {
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2))
}

// GET all products
app.get('/products', (req, res) => {
  const products = readProducts()
  res.json(products)
})

// GET single product by ID
app.get('/products/:id', (req, res) => {
  const products = readProducts()
  const product = products.find((p) => p.id === req.params.id)

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    })
  }

  res.json(product)
})

// POST create new product
app.post('/products', (req, res) => {
  const products = readProducts()

  const newProduct = {
    id: req.body.id,
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    brand: req.body.brand,
  }

  products.push(newProduct)
  writeProducts(products)

  res.status(201).json({
    message: 'Product added successfully',
    product: newProduct,
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
