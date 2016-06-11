/**
 * Created by YeYint on 14/5/16.
 */

var express = require('express');
var User = require('../../models/md_users');
var config = require('../../config/config');
var jsonwebtoken = require('jsonwebtoken');
var superSecret = config.secretKey;

function createToken(user){
    var token = jsonwebtoken.sign({
        _id: user._id,
        user_full_name: user.local.user_full_name
    }, superSecret,
    {
        expiresIn: '1h'
    });

    return token;
}

module.exports = function(app, express){
    var api = express.Router();

    api.get('/me', function(req,res){
        var token = createToken(req.user);
        var currentUser = req.user;
        currentUser.local.user_token = token;
        res.send(currentUser);
    });

    api.get('/', function(req, res) {

        var token = req.body.token || req.params.token || req.headers["x-access-token"] || req.query.token;

        //Check if token exist
        if(token){
            jsonwebtoken.verify(token, superSecret, function(err, decoded){
                if(err){
                    res.status(403).send({success: false, message: "Failed to authenticate user!"});
                }else{
                    req.decoded = decoded;
                    User.find({},function(err, users){
                        if(err){
                            res.send(err);
                            return;
                        }
                        res.json(users);
                    });
                }
            });
        }else{
            res.status(403).send({success: false, message:"No token provided!"});
        }
    });

    api.get('/:user_id', function(req, res) {

        var token = req.body.token || req.params.token || req.headers["x-access-token"] || req.query.token;

        //Check if token exist
        if(token){
            jsonwebtoken.verify(token, superSecret, function(err, decoded){
                if(err){
                    res.status(403).send({success: false, message: "Failed to authenticate user!"});
                }else{
                    req.decoded = decoded;
                    User.findById(req.params.user_id,function(err, users){
                        if(err){
                            res.send(err);
                            return;
                        }
                        res.json(users);
                    });
                }
            });
        }else{
            res.status(403).send({success: false, message:"No token provided!"});
        }
    });

    api.put('/:user_id', function(req, res) {

        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            var todayDate = new Date();
            user.local.user_active = req.body.user_active;
            user.local.user_avator = req.body.user_active;
            user.local.user_dob = req.body.user_dob;
            user.local.user_email = req.body.user_email;
            user.local.user_full_name = req.body.user_full_name;
            user.local.user_gender = req.body.user_gender;
            user.local.user_modified_by = req.user.local.user_full_name;
            user.local.user_modified_date = todayDate.now();
            user.local.user_role = req.body.user_role;

            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ success: true, message: 'Data updated!' });
            });

        });
    });


    api.delete('/:user_id', function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ success: true, message: 'Successfully deleted' });
        });
    });

    api.post('/signup', function(req, res){
        var newUser = new User();
        newUser.local.user_email = req.body.user_email;
        newUser.local.user_password = newUser.generateHash(req.body.user_password);
        newUser.local.user_full_name  = req.body.user_full_name;
        newUser.local.user_avator = req.body.user_avator;
        newUser.local.user_role = req.body.user_role;
        newUser.local.user_active = req.body.user_active;
        newUser.local.user_creation_date = req.body.user_creation_date;
        newUser.local.user_created_by = req.body.user_created_by;
        newUser.local.user_modified_date  = req.body.user_modified_date;
        newUser.local.user_modified_by = req.body.user_modified_by;

            // save the user
        newUser.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: "User has been created"});
        });
    });

    api.post('/login', function(req, res){
        User.findOne({
            'local.user_email': req.body.user_email
        }).select('local.user_password').exec(function(err,user){
            if(err) throw err;

            if(!user){
                res.send({message: "User doesn't exist!"});
            }else if(user){

                if (!user.validPassword(req.body.user_password))
                {
                    res.send({message: "Incorrect Password!"});
                }else{
                    // Create Token
                    var token = createToken(user);
                    res.json({
                        success: true,
                        message: "Successfully login!",
                        token: token
                    });
                }
            }
        });
    });




    return api;
}
