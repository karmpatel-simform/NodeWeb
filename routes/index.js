const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// A dummy user for demo purposes (Static username and password)
const user = {
  id: 1,
  username: 'testuser',
  password: 'password123'  // Static password (no hashing)
};

// GET home page (Protected route)
router.get('/', auth, function (req, res, next) {
  console.log('User is logged in, sending welcome message');
  res.send('Welcome, you are logged in!');
});

// GET login page
router.get('/login', function (req, res, next) {
  console.log('Rendering login page');
  res.send(`
    <form method="POST" action="/login">
      <input type="text" name="username" id="username" placeholder="Username" required>
      <input type="password" name="password" id="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

// POST login to authenticate user
router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  
  console.log(`Login attempt: username=${username}, password=${password}`);

  // Check if user exists (using static user credentials)
  if (username === user.username) {
    console.log(`Username matched: ${username}`);

    // Check if the password is correct
    if (password === user.password) {
      console.log('Password match successful, generating JWT token');
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      console.log('JWT token generated:', token);

      // Set token as a cookie
      res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      console.log('Token set in cookies');
      
      return res.redirect('/');
    } else {
      console.log('Invalid credentials: password mismatch');
      return res.status(400).send('Invalid credentials');
    }
  } else {
    console.log('Invalid credentials: username mismatch');
    return res.status(400).send('Invalid credentials');
  }
});

// GET logout (clear cookies)
router.get('/logout', function (req, res, next) {
  console.log('Logging out, clearing cookies');
  
  // Check if the cookie is present
  if (req.cookies[process.env.COOKIE_NAME]) {
    console.log('Token cookie found:', req.cookies[process.env.COOKIE_NAME]);
  } else {
    console.log('No token cookie found');
  }

  // Clear the cookie
  res.clearCookie(process.env.COOKIE_NAME);

  // Redirect to home page
  res.redirect('/');
});


module.exports = router;

