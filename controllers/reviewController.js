const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// reveiw route : add a review for specific post 
module.exports.addReview = async (req, res, next) => {
    try {
        let review = new Review(req.body.review);
        review.author = res.locals.currUser._id;

        let currListing = await Listing.findById(req.params.id);
        currListing.reviews.push(review);

        if (currListing.reviewCount) {
            currListing.reviewCount += 1;
            currListing.avgRating = ((currListing.avgRating * (currListing.reviewCount - 1)) + review.rating) / currListing.reviewCount;
        } else {
            currListing.avgRating = review.rating;
            currListing.reviewCount = 1;
        }

        await review.save();
        await currListing.save();

        req.flash("success", "Review added successfully");
        res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
        next(err);
    }
};

// delete review : delete a review from review and listings database
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let currListing = await Listing.findByIdAndUpdate(
        id,
        { $pull: { reviews: reviewId } }
    );

    let review = await Review.findByIdAndDelete(reviewId);

    currListing.reviewCount -= 1;
    currListing.avgRating = ((currListing.avgRating * (currListing.reviewCount + 1)) - review.rating) / currListing.reviewCount;

    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
};
