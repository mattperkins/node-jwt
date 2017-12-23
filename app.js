// todo 
// save token to local storage in front end view / react

const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/api', (req,res) => {
  res.json({
    msg: 'Hello, World!'
  })
})

app.post('/api/posts', verifyToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
      if(err){
        res.sendStatus('403')
      } else {
        res.json({ msg: 'Post created!', authData })
      }
    })
})

app.post('/api/login', (req,res) => {
  // Mock User
  const user = {
    id: 1,
    username: 'Fred',
    email: 'fred@email.com'
  }
  jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token
    })
  })
})

// Bearer token format
// Authorization: Bearer <access_token>

// Verify Token (Middleware function)
function verifyToken (req,res,next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization']
  //  Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at space in string (see format comment above) 
    // i.e Bearer(' ')<access_token
    // and convert string to array
    const bearer = bearerHeader.split(' ')
    // Get token from split created array
    const bearerToken = bearer[1]
    // Set the token
    req.token = bearerToken
    // Call next middleware
    next()
  } else {
    // Forbidden
    res.sendStatus(403)
  }
}

app.listen(5000, () => console.log('Running on 5000'))

