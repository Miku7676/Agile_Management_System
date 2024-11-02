const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db'); // Ensure this exports a connection using mysql2/promise
require('dotenv').config();

const initializePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/users/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          const [results] = await db.promise().query(
            'SELECT * FROM user WHERE EMAIL = ?',
            [profile.emails[0].value]
          );

          if (results.length > 0) {
            return done(null, results[0]);
          }

          // Create new user if doesn't exist
          const newUser = {
            USER_ID: `G-${profile.id}`,
            USERNAME: profile.displayName,
            EMAIL: profile.emails[0].value,
            PASSWORD: null // OAuth users don't need passwords
          };

          await db.promise().query(
            'INSERT INTO user (USER_ID, USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?, ?)',
            [newUser.USER_ID, newUser.USERNAME, newUser.EMAIL, newUser.PASSWORD]
          );

          return done(null, newUser);
        } catch (error) {
          console.error('Error during Google authentication:', error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.USER_ID);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const [results] = await db.promise().query('SELECT * FROM user WHERE USER_ID = ?', [id]);
      done(null, results[0]);
    } catch (err) {
      done(err, null);
    }
  });
};

module.exports = initializePassport;
