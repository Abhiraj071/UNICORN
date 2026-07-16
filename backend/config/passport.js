const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: (process.env.BACKEND_URL || "http://localhost:5000") + "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        done(null, user);
      } else {
        // Create new user
        // If email already exists from standard auth, link or return error
        let existingEmailUser = await User.findOne({ email: profile.emails[0].value });
        if (existingEmailUser) {
           existingEmailUser.googleId = profile.id;
           await existingEmailUser.save();
           return done(null, existingEmailUser);
        }

        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };
        user = await User.create(newUser);
        done(null, user);
      }
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  }
));

// We are not using session-based auth, we will generate JWT on callback
// But passport might require serializeUser/deserializeUser if we use passport.authenticate with session: true
// We will use session: false in routes, so we don't need this.
