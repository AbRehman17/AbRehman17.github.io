const express = require('express')
const router = express.Router()
const Message = require('../models/Message')

// (from contact form)
router.post('/', async (req, res) => {
  const { name, email, message } = req.body
  const newMessage = new Message({ name, email, message })
  await newMessage.save()
  res.json({ success: true, msg: 'Message saved!' })
})

// (for reviews page)
router.get('/', async (req, res) => {
  const messages = await Message.find().sort({ date: -1 }) // Newest first
  res.json(messages)
})

module.exports = router
