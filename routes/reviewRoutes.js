const express = require("express");
const router = express.Router({ mergeParams: true });
const expError = require("../utils/ExpError");
const { wrapAsync } = require("../utils/wrapasync");
const { reviewSchema } = require("../schema/validateReviewSchema");
const { isLoggedin, isReviewAuthor } = require("../middlewares.js");
const reviewController = require("../controllers/reviewController.js");


// function  : valaidation for reviews schema
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body || {});
    if (error) {
        throw new expError(400, error.details[0].message);
    }
    next();
}

// reveiw route : add a review for specific post 
router.post(
    "/",
    isLoggedin,
    validateReview,
    wrapAsync(reviewController.addReview)
);

// delete review : delete a review from review and listings database
router.delete(
    "/:reviewId",
    isLoggedin,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;