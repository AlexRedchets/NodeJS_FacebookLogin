var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function (passport) {

    // serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function(user, done) {
        User.findById(user.id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        // pull in app id and secret from our auth.js file
        clientID        : configAuth.clientID,
        clientSecret    : configAuth.clientSecret,
        callbackURL     : configAuth.callbackURL,
        profileFields: ['id', 'displayName', 'email']
    },
    
        function (accessToken, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function () {

                // find the user in the database based on their facebook id
                User.findOne({'id' : profile.id}, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    }else{

                        // if there is no user found with that facebook id, create them
                        var newUser = new User();

                        console.log(profile);

                        // set all of the facebook information in our user model
                        newUser.id    = profile.id; // set the users facebook id
                        newUser.token = accessToken; // we will save the token that facebook provides to the user
                        newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
                
            });
        }
    ))
};