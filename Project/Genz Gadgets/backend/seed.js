const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./models/Product')

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))

const products = [
  {
    name: 'DJI Drone',
    description: 'Compact drone with 4K camera',
    price: 499,
    image:
      'https://m.media-amazon.com/images/I/61E1A1QprFL._AC_UF894,1000_QL80_.jpg',
  },
  {
    name: 'Logitech Headphones',
    description: 'Wireless gaming headset with mic',
    price: 149,
    image:
      'https://m.media-amazon.com/images/I/71xNjrzG69L._AC_UF894,1000_QL80_.jpg',
  },
  {
    name: 'Redragon Gaming Mouse',
    description: 'RGB wireless mouse with programmable buttons',
    price: 39,
    image:
      'https://m.media-amazon.com/images/I/61hM1AjdkNL._AC_UF894,1000_QL80_.jpg',
  },
  {
    name: 'Wireless Charger',
    description: 'Fast Qi-compatible charging pad',
    price: 29,
    image:
      'https://m.media-amazon.com/images/I/318fdXnlPsS._AC_UF894,1000_QL80_.jpg',
  },
  {
    name: 'MacBook Laptop',
    description: 'High performance laptop',
    price: 1299,
    image: 'https://i.ytimg.com/vi/mHutSzIkTPk/maxresdefault.jpg',
  },
  {
    name: 'Portable Speaker',
    description: 'Bluetooth speaker with RGB lights',
    price: 59,
    image:
      'https://m.media-amazon.com/images/I/81jte-lfd8L._AC_UF894,1000_QL80_.jpg',
  },
  {
    name: 'Wireless Earbuds',
    description: 'Noise-cancelling earbuds',
    price: 199,
    image:
      'https://content.abt.com/image.php/jbl-true-wireless-earbuds-JBLTOURPRO3BLKAM-front-case.jpg?image=/images/products/BDP_Images/jbl-true-wireless-earbuds-JBLTOURPRO3BLKAM-front-case.jpg&canvas=1&width=750&height=550',
  },
  {
    name: 'Smart Watch',
    description: 'Track health & notifications',
    price: 299,
    image:
      'https://cdn.thewirecutter.com/wp-content/media/2023/06/fitnesstrackers-2048px-09819-3x2-1.jpg',
  },
]

async function seedDB() {
  await Product.deleteMany()
  await Product.insertMany(products)
  console.log('Products inserted')
  mongoose.disconnect()
}

seedDB()
