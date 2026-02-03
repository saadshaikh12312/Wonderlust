const User = require("../models/user.js");

// signup route: render a signup page 
module.exports.renderSignup = (req, res) => {
    res.render("./user/signup")
};

// signup route: register a new user in databse
module.exports.signup = async (req, res) => {
    let { username, email, password, name } = req.body;
    const newUser = new User({ username, email, name });
    await User.register(newUser, password);
    req.login(newUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", `Welcome back ${name.firstname}`);
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    });
};

// login route: render a login page 
module.exports.renderLogin = (req, res) => {
    res.render("./user/login");
};

// login route: check for existing user in database
module.exports.login = (req, res) => {
    let message = (req.user.name.firstname)
        ? `Welcome back, ${req.user.name.firstname}, to Wonderlust!`
        : `Welcome back to wonderlust!`;
    req.flash("success", message);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout route: logout an existing logged-in user
module.exports.logout = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "please login to perform these actions.");
        return res.redirect("/login");
    }
    
    req.logout((err) => {
        if (err)
            return next(err);
        req.flash("success", "You have been logged out successfully.");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    });
};