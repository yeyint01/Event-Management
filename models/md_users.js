/**
 * Created by YeYint on 16/5/16.
 */

// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        user_email          : String,
        user_password       : String,
        user_full_name      : String,
        user_avator         : String,
        user_role           : String,
        user_active         : Boolean,
        user_gender         : String,
        user_dob            : {type: Date, default: Date.now},
        user_creation_date  : {type: Date, default: Date.now},
        user_created_by     : String,
        user_modified_date  : { type: Date, default: Date.now },
        user_modified_by    : String,
        user_token: String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(user_password) {
    return bcrypt.hashSync(user_password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(user_password) {
    return bcrypt.compareSync(user_password, this.local.user_password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('event_users', userSchema);
