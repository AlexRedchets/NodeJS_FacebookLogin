var mongoose = require('mongoose');

// define the schema for user model
var userSchema = mongoose.Schema({
    id: String,
    token: String,
    email: String,
    name: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);