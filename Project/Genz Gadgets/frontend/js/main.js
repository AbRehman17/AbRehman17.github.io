console.log('main.js loaded')

let cart = JSON.parse(localStorage.getItem('cart')) || []

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCartBadge()
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge')
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    badge.textContent = totalItems
    badge.style.display = totalItems > 0 ? 'flex' : 'none'
  }
}

function addToCart(product) {
  const existing = cart.find((item) => item._id === product._id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }
  saveCart()
}

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container')
  const isHomePage =
    window.location.pathname === '/' ||
    window.location.pathname.includes('index.html')
  const isCartPage = window.location.pathname.includes('cart.html')
  const isReviewPage = window.location.pathname.includes('review.html')

  updateCartBadge()

  if (isCartPage) {
    renderCartPage()
    return
  }

  if (isReviewPage) {
    loadReviews()
    return
  }

  if (productsContainer) loadProducts()

  async function loadProducts() {
    const res = await fetch('/products')
    let products = await res.json()

    if (isHomePage) products = products.slice(0, 4)

    productsContainer.innerHTML = ''

    products.forEach((product) => {
      const card = document.createElement('article')
      card.className = 'product-card'

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <p class="price">$${product.price}</p>
        <div class="add-to-cart-container" data-id="${product._id}">
          <button class="add-to-cart-btn">Add to Cart</button>
          <div class="added-tick" style="display:none;">
            <span style="color:green; font-size:2.5rem; font-weight:bold;">✓</span>
            <span style="color:green; font-weight:bold; font-size:1.2rem;">Added!</span>
          </div>
        </div>`
      productsContainer.appendChild(card)
    })

    // Add to Cart with green tick
    document.querySelectorAll('.add-to-cart-container').forEach((container) => {
      const btn = container.querySelector('.add-to-cart-btn')
      const tick = container.querySelector('.added-tick')
      const productId = container.dataset.id

      btn.addEventListener('click', () => {
        const product = products.find((p) => p._id === productId)
        addToCart(product)

        // Hide button and show green tick
        btn.style.display = 'none'
        tick.style.display = 'flex'
      })
    })
  }

  // Load reviews for review.html
  async function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container')
    try {
      const res = await fetch('/messages')
      const messages = await res.json()

      if (messages.length === 0) {
        reviewsContainer.innerHTML =
          '<p style="text-align:center; padding:4rem;">No reviews yet. Be the first to share!</p>'
        return
      }

      reviewsContainer.innerHTML = ''
      messages.reverse().forEach((msg) => {
        const card = document.createElement('div')
        card.className = 'review-card'
        card.innerHTML = `
          <div class="review-header">
            <h3>${msg.name}</h3>
            <span class="review-date">${new Date(
              msg.date
            ).toLocaleDateString()}</span>
          </div>
          <p class="review-message">"${msg.message}"</p>
          <p class="review-email"><em>${msg.email}</em></p>
        `
        reviewsContainer.appendChild(card)
      })
    } catch (err) {
      reviewsContainer.innerHTML =
        '<p style="text-align:center; color:red;">Failed to load reviews.</p>'
    }
  }
})

async function submitOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty!')
    return
  }

  const name = document.getElementById('customer-name')?.value.trim()
  const email = document.getElementById('customer-email')?.value.trim()
  const phone = document.getElementById('customer-phone')?.value.trim()

  if (!name || !email || !phone) {
    alert('Please fill in all your details!')
    return
  }

  try {
    const customerRes = await fetch('/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone }),
    })
    const customer = await customerRes.json()

    for (const item of cart) {
      await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer._id,
          productId: item._id,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
        }),
      })
    }

    alert('🎉 Order confirmed successfully! Thank you for shopping!')
    cart = []
    saveCart()
    renderCartPage()
  } catch (err) {
    alert('Something went wrong. Please try again.')
  }
}

function renderCartPage() {
  const cartContainer = document.getElementById('cart-items')
  const totalElement = document.getElementById('cart-total')
  const customerForm = document.getElementById('customer-form')
  const confirmBtn = document.getElementById('confirm-order')
  const clearBtn = document.getElementById('clear-cart')

  if (cart.length === 0) {
    cartContainer.innerHTML =
      '<p>Your cart is empty 😔 <a href="index.html">Continue Shopping</a></p>'
    totalElement.textContent = '$0.00'
    if (customerForm) customerForm.style.display = 'none'
    if (confirmBtn) confirmBtn.style.display = 'none'
    return
  }

  if (customerForm) customerForm.style.display = 'block'
  if (confirmBtn) confirmBtn.style.display = 'inline-block'

  cartContainer.innerHTML = ''
  let total = 0

  cart.forEach((item, index) => {
    total += item.price * item.quantity
    const row = document.createElement('div')
    row.className = 'cart-item'
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>$${item.price}.00 each</p>
      </div>
      <div class="quantity-controls">
        <button class="qty-btn" data-index="${index}" data-action="minus">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-index="${index}" data-action="plus">+</button>
      </div>
      <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `
    cartContainer.appendChild(row)
  })

  totalElement.textContent = `$${total.toFixed(2)}`

  document.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index)
      const action = btn.dataset.action
      if (action === 'plus') cart[idx].quantity += 1
      if (action === 'minus' && cart[idx].quantity > 1) cart[idx].quantity -= 1
      saveCart()
      renderCartPage()
    })
  })

  document.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      cart.splice(parseInt(btn.dataset.index), 1)
      saveCart()
      renderCartPage()
    })
  })

  if (clearBtn) {
    clearBtn.onclick = () => {
      cart = []
      saveCart()
      renderCartPage()
    }
  }

  if (confirmBtn) {
    confirmBtn.onclick = submitOrder
  }
}
