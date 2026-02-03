const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const { wrapAsync } = require("./utils/wrapasync.js");

// User Authentication : check is user logged in or not 
module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to perform this action.");
        return res.redirect("/login");
    };
    next();
};

// save last visited page in res.session, so user can be continue through this page 
module.exports.saveRedirectUrl = (req, res, next) => {
    req.session.redirectUrl = req.originalUrl;
    next();
}

// Listing Authorisation : check if a given user is owner of current listing
module.exports.isOwner = wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not a owner of this listing.")
        return res.redirect(`/listings/${listing._id}`);
    }
    next();
});

// Review Authorisation : check if a given user is author of current review
module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not a author of this Review.")
        return res.redirect(`/listings/${id}`);
    }
    next();
});