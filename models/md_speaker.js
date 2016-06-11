/**
 * Created by YeYint on 17/5/16.
 */

/**
 * Created by YeYint on 16/5/16.
 */

// app/models/md_organizer.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our events model
var organizerSchema = mongoose.Schema({
    organizer_name          : String,
    organizer_briefing      : String,
    organizer_contact_person: String,
    organizer_email         : String,
    organizer_contact_number: String,
    organizer_address       : String,
    organizer_logo          : String,
    organizer_cover_photo   : String,
    organizer_website       : String,
    organizer_creation_date : {type: Date, default: Date.now},
    organizer_created_by    : String,
    organizer_modified_date : { type: Date, default: Date.now },
    organizer_modified_by   : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('events', organizerSchema);
