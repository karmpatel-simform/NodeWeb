const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('../middleware/auth');
const cors = require('cors');

const app = express();

// Middleware to parse incoming JSON bodies
app.use(bodyParser.json());
app.use(cookieParser());

// CORS setup
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:7000',
      'http://localhost:5000',
      'http://localhost:5001',
      'http://localhost:9000',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://webvite',
      'http://webviteup',
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Dummy user for demo purposes (Static username and password)
const user = {
  id: 1,
  username: 'testuser',
  password: 'password123'  // Static password (no hashing)
};

// Route for Home (Landing page)
router.get('/', (req, res) => {
  console.log('User is logged in, sending welcome message');
  res.send('Welcome, Hello World');
});

// Protected route (Dashboard)
router.get('/dashboard', auth, (req, res) => {
  console.log('User is logged in, sending welcome message');
  res.send('Welcome, you are logged in!');
});

// POST Sign-in (Authenticate user and return JWT)
router.post('/signin', (req, res) => {
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
        process.env.JWT_SECRET,  // Your JWT secret key
        { expiresIn: '1h' }
      );

      console.log('JWT token generated:', token);

      // Set token as a cookie
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
      });
      console.log('Token set in cookies');
      
      // Redirect to dashboard
      return res.redirect('/dashboard');
    } else {
      console.log('Invalid credentials: password mismatch');
      return res.status(400).send('Invalid credentials');
    }
  } else {
    console.log('Invalid credentials: username mismatch');
    return res.status(400).send('Invalid credentials');
  }
});

// POST Logout - Clear cookies and log out the user
router.get('/logout', (req, res) => {
  console.log('Logging out, clearing cookies');
  
  // Clear the cookie
  res.clearCookie(process.env.COOKIE_NAME);
  console.log('Token cookie cleared');
  
  // Redirect to home page
  res.redirect('/');
});

// Adding a new POST route to handle user registration (for example purposes)
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Example validation: ensure the username and password are provided
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // For this demo, we will just return a success message
  // In a real app, you would save the user to a database here
  console.log('User registered:', username);

  // Send response
  res.status(201).send(`User ${username} registered successfully!`);
});

// POST route to check if the user is authenticated
router.post('/check-auth', auth, (req, res) => {
  res.send('User is authenticated');
});

module.exports = router;
