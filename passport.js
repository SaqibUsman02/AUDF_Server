const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require('dotenv').config()
const dotenv=require('dotenv');


passport.use(
	new GoogleStrategy(
		{
			
			clientID: '850657956587-lq5qju89q9lin9n281t4jvokj4oc3bju.apps.googleusercontent.com',
			clientSecret: "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",
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

