const express = require("express");
const router = express.Router();
const expError = require("../utils/ExpError");
const { wrapAsync } = require("../utils/wrapasync");
const { listingSchema } = require("../schema/validateListingSchema");
const { isLoggedin, saveRedirectUrl, isOwner } = require("../middlewares.js");
const listingController = require("../controllers/listingControllers.js");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");

const upload = multer({ storage });

// function  : valaidation for listing schema
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body || {});
    if (error) {
        throw new expError(400, error.details[0].message);
    }
    next();
}

router.route("/")
    // home route : show all listing title 
    .get(
        wrapAsync(listingController.home)
    )

    // create route : save data of new listing into database 
    .post(
        isLoggedin,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.newListing)
    )


// create route : render a form to create new listing
router.get(
    "/new",
    isLoggedin,
    listingController.renderNewForm
)

router.route("/:id")
    // read / show route : show details of a particular listing
    .get(
        saveRedirectUrl,
        wrapAsync(listingController.showListing)
    )

    //update route : update a data of specific route
    .put(
        isLoggedin,
        isOwner,
        upload.single("listing[image]"),
        wrapAsync(listingController.editListing)
    )

    // delete route : delete a specific listing
    .delete(
        isLoggedin,
        isOwner,
        wrapAsync(listingController.destroyListing)
    )

//Update route : render a update a form
router.get(
    "/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;
