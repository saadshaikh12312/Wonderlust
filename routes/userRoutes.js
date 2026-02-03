const express = require("express");
const router = express.Router({ mergeParams: true });
const { wrapAsync } = require("../utils/wrapasync.js");
const passport = require("passport");
const userController = require("../controllers/userController.js");
const { userSchema } = require("../schema/validateUser.js");
const expError = require("../utils/ExpError.js");

// function  : valaidation for user schema
const validateUser = (req, res, next) => {
    let { error } = userSchema.validate(req.body || {});
    if (error) {
        throw new expError(400, error.details[0].message);
    }
    next();
}

//signup routes
router.route("/signup")
    // signup route: render a signup page 
    .get(
        userController.renderSignup
    )

    // signup route: register a new user in databse
    .post(
        validateUser,
        wrapAsync(userController.signup)
    );

// login routes
router.route("/login")
    // login route: render a login page 
    .get(
        userController.renderLogin
    )

    // login route: check for existing user in database
    .post(
        // saveRedirectUrl,
        passport.authenticate(
            "local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }
        ),
        userController.login
    );

// logout route: logout an existing logged-in user
router.post(
    "/logout",
    userController.logout
);

module.exports = router;