/**
 * Created by YeYint on 17/5/16.
 */

module.exports = function(app, passport) {

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/user_signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('user_signup.ejs');
    });

};
