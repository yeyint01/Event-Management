/**
 * Created by YeYint on 17/5/16.
 */

/**
 * Created by YeYint on 14/5/16.
 */

var express = require('express');
var router = express.Router();
var Event = require('../../models/md_events');

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('events');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

// create users and send back all users after creation
router.post('/events', function(req, res) {

    // create a user, information comes from AJAX request from Angular

    var db = req.db;

    var newEvent = new Event();
    newEvent.event_name = req.body.event_name;
    newEvent.event_type = req.body.event_type;
    newEvent.event_category = req.body.event_category;
    newEvent.event_briefing = req.body.event_briefing;
    newEvent.event_cover = req.body.event_cover;
    newEvent.event_photo = req.body.event_photo;
    newEvent.event_location = req.body.event_location;
    newEvent.event_start_date = req.body.event_start_date;
    newEvent.event_start_time = req.body.event_start_time;
    newEvent.event_end_date = req.body.event_end_date;
    newEvent.event_end_time  = req.body.event_end_time;
    newEvent.event_active = req.body.event_active;
    newEvent.event_creation_date = req.body.event_active;
    newEvent.event_created_by = req.body.event_created_by;
    newEvent.event_modified_date = req.body.event_modified_date;
    newEvent.event_modified_by = req.body.event_modified_by;

    // save the user
    newEvent.save(function(err,res) {
        if (err)
            res.send(err);
        return done(null, newEvent);
    });
});

module.exports = router;
