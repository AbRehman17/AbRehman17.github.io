document.querySelector('.info-form').addEventListener('submit', function (e) {
  e.preventDefault()
  const name = document.getElementById('name')
  const email = document.getElementById('email')
  const age = document.getElementById('age')
  const message = document.getElementById('message')
  ;[name, email, age, message].forEach((input) =>
    input.classList.remove('error')
  )
  if (name.value.trim() === '') name.classList.add('error')
  if (!email.value.includes('@')) email.classList.add('error')
  if (age.value < 1 || age.value > 100) age.classList.add('error')
  if (message.value.trim().length < 10) message.classList.add('error')
  const hasError = document.querySelector('.error')
  if (!hasError) {
    alert('Form submitted successfully!')
    this.submit()
  } else {
    alert('Please fill the form correctly.')
  }
})
