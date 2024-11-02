const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '24h';

// Passport configuration for Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/users/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Check if user exists
      const [users] = await db.promise().query(
        'SELECT * FROM user WHERE EMAIL = ? AND OAUTH_PROVIDER = ?', 
        [profile.emails[0].value, 'google']
      );

      if (users.length > 0) {
        // Update existing user's last login
        await db.promise().query(
          'UPDATE user SET LAST_LOGIN = NOW() WHERE USER_ID = ?',
          [users[0].USER_ID]
        );
        return cb(null, users[0]);
      }

      // Create new user
      const userId = `G${profile.id}`;
      const newUser = {
        USER_ID: userId,
        USERNAME: profile.displayName,
        EMAIL: profile.emails[0].value,
        OAUTH_PROVIDER: 'google',
        PROFILE_PICTURE: profile.photos[0]?.value,
        CREATED_AT: new Date(),
        LAST_LOGIN: new Date()
      };

      await db.promise().query(
        `INSERT INTO user SET ?`, 
        newUser
      );

      return cb(null, newUser);
    } catch (error) {
      return cb(error);
    }
  }
));

// Passport configuration for GitHub OAuth
// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: "http://localhost:5000/api/users/auth/github/callback"
//   },
//   async function(accessToken, refreshToken, profile, cb) {
//     try {
//       const [users] = await db.promise().query(
//         'SELECT * FROM user WHERE EMAIL = ? AND OAUTH_PROVIDER = ?', 
//         [profile.emails[0].value, 'github']
//       );

//       if (users.length > 0) {
//         await db.promise().query(
//           'UPDATE user SET LAST_LOGIN = NOW() WHERE USER_ID = ?',
//           [users[0].USER_ID]
//         );
//         return cb(null, users[0]);
//       }

//       const userId = `GH${profile.id}`;
//       const newUser = {
//         USER_ID: userId,
//         USERNAME: profile.username,
//         EMAIL: profile.emails[0].value,
//         OAUTH_PROVIDER: 'github',
//         PROFILE_PICTURE: profile.photos[0]?.value,
//         CREATED_AT: new Date(),
//         LAST_LOGIN: new Date()
//       };

//       await db.promise().query(
//         `INSERT INTO user SET ?`, 
//         newUser
//       );

//       return cb(null, newUser);
//     } catch (error) {
//       return cb(error);
//     }
//   }
// ));

// Enhanced login route with rate limiting and validation
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 login attempts per windowMs
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await db.promise().query(
      'SELECT * FROM user WHERE EMAIL = ? AND OAUTH_PROVIDER IS NULL', 
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.PASSWORD);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await db.promise().query(
      'UPDATE user SET LAST_LOGIN = NOW() WHERE USER_ID = ?', 
      [user.USER_ID]
    );

    const token = jwt.sign(
      { 
        userId: user.USER_ID,
        email: user.EMAIL,                  
        username: user.USERNAME
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({ 
      message: 'Login successful',
      token,
      user: {
        userId: user.USER_ID,
        username: user.USERNAME,
        email: user.EMAIL,
        profilePicture: user.PROFILE_PICTURE
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Enhanced signup route with validation
const { body, validationResult } = require('express-validator');

router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('username').trim().isLength({ min: 3 }),
  body('userid').trim().isLength({ min: 3 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userid, username, email, password } = req.body;

    // Check if email exists
    const [existingUsers] = await db.promise().query(
      'SELECT * FROM user WHERE EMAIL = ?', 
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db.promise().query(
      `INSERT INTO user (
        USER_ID, 
        USERNAME, 
        EMAIL, 
        PASSWORD, 
        CREATED_AT, 
        LAST_LOGIN
      ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [userid, username, email, hashedPassword]
    );

    const token = jwt.sign(
      { 
        userId: userid,
        email,
        username 
      }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: {
        userId: userid,
        username,
        email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign(
      { 
        userId: req.user.USER_ID,
        email: req.user.EMAIL,
        username: req.user.USERNAME
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
    
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

// router.get('/auth/github',
//   passport.authenticate('github', { 
//     scope: ['user:email']
//   })
// );

// router.get('/auth/github/callback',
//   passport.authenticate('github', { 
//     failureRedirect: '/login',
//     session: false
//   }),
//   (req, res) => {
//     const token = jwt.sign(
//       { 
//         userId: req.user.USER_ID,
//         email: req.user.EMAIL,
//         username: req.user.USERNAME
//       },
//       JWT_SECRET,
//       { expiresIn: TOKEN_EXPIRY }
//     );
    
//     res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
//   }
// );

// Enhanced profile route with error handling
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      `SELECT 
        USER_ID, 
        USERNAME, 
        EMAIL, 
        CREATED_AT, 
        LAST_LOGIN, 
        PROFILE_PICTURE,
        OAUTH_PROVIDER
      FROM user 
      WHERE USER_ID = ?`, 
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Enhanced JWT middleware
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
}

module.exports = router;