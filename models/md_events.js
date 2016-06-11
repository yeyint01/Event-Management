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
var speakerSchema = mongoose.Schema({
        speaker_name            : String,
        speaker_briefing        : String,
        speaker_education       : String,
        speaker_email           : String,
        speaker_contact_number  : String,
        speaker_address         : String,
        speaker_photo           : String,
        speaker_cover_photo     : String,
        speaker_website         : String,
        speaker_creation_date   : {type: Date, default: Date.now},
        speaker_created_by      : String,
        speaker_modified_date   : { type: Date, default: Date.now },
        speaker_modified_by     : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('events', speakerSchema);
