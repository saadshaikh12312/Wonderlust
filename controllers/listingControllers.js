const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudinaryConfig.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// stylesService exposes listStyles(), createStyle(), getStyle(), etc.

// home route : show all listing title 
module.exports.home = async (req, res) => {
    let { category, q, toprated } = req.query;
    let lastSearch = category || q || toprated;

    // filter according to uer4 click on filter icons    if (req.query.category) {
    if (category) {
        let listing = await Listing.find({ category: category });
        if (listing.length) {
            req.flash("lastSearch", `${category}`);
            return res.render("listing/home.ejs", { listing, lastSearch });
        }
        req.flash("error", "There is no listing available in this category.");
        return res.redirect("/listings")
    };


    // search by title , location, country
    if (q) {
        const regex = new RegExp(q.trim(), "i");
        const listing = await Listing.find({
            $or: [
                { title: regex },
                { location: regex },
                { country: regex }
            ]
        });
        if (listing.length) {
            req.flash("lastSearch", `${q}`);
            return res.render("listing/home.ejs", { listing, lastSearch });
        }
        req.flash("error", `No result found for "${q}"`);
        return res.redirect("/listings")
    };

    // top rated listings
    if (toprated) {
        const listing = await Listing.find().sort({ avgRating: -1, reviewCount: -1 });
        return res.render("listing/home.ejs", { listing, lastSearch: "Top Rated" });
    };

    // display all listings 
    let listing = await Listing.find();
    res.render("listing/home.ejs", { listing, lastSearch });
};

// create route : render a form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

// create route : save data of new listing into database 
module.exports.newListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    let { path, filename } = req.file;
    let newData = new Listing(req.body.listing);
    newData.image = {
        url: path,
        filename: filename
    };
    newData.owner = req.user._id;
    newData.geometry = response.body.features[0].geometry;

    await newData.save();
    req.flash("success", "Listing added successfully");
    res.redirect("/listings");
};

// read / show route : show details of a particular listing
module.exports.showListing = async (req, res) => {
    let singleListing = await Listing.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!singleListing) {
        req.flash("error", "Oops! The listing you’re looking for is no longer available.");
        return res.redirect("/listings");
    }

    // sortout user review and others review
    let userReview = [];
    let otherReview = [];
    if (req.user) {
        let allReviews = singleListing.reviews;
        allReviews.forEach((obj) => {
            if (obj.author._id.equals(req.user._id)) {
                userReview.push(obj);
            } else {
                otherReview.push(obj)
            }
        })
    }
    res.render("listing/show.ejs", { listing: singleListing, userReview, otherReview, mapToken: process.env.MAP_TOKEN });
};

//Update route : render a update a form
module.exports.renderEditForm = async (req, res) => {
    let singleListing = await Listing.findById(req.params.id);
    if (!singleListing) {
        req.flash("error", "The listing you’re trying to access is no longer available.");
        return res.redirect("/listings");
    }
    singleListing.image.url.replace("/upload", "/upload/q_auto");
    res.render("listing/update.ejs", { data: singleListing });
};

//update route : update a data of specific route
module.exports.editListing = async (req, res) => {
    let newData = req.body.listing;
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // deleting old image from cloudinary 
    if (req.file) {
        try {
            // delete old image
            if (listing.image?.filename) {
                await cloudinary.uploader.destroy(listing.image.filename);
            }
            
            // save new image info (already uploaded)
            newData.image = {
                url: req.file.path,
                filename: req.file.filename
            }
        } catch (err) {
            await cloudinary.uploader.destroy(req.file.filename);
            req.flash("error", "Some error occured, please upload image again.");
            res.redirect(`/listings/${id}`);
        }
    }

    await Listing.findByIdAndUpdate(id, newData);
    req.flash("success", "Updated successfully!");
    res.redirect(`/listings/${id}`);
};

// delete route : delete a specific listing
module.exports.destroyListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}