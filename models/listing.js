const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: String,
    image: {
        url: {
            type: String,
        },
        filename: {
            type: String
        }
    },
    price: {
        type: Number,
        require: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        required: true,
        enum: ["mountains", "beachside", "lakeside", "city", "downtown", "adventure", "luxury", "budget", "unique", "romantic"],
    },
    avgRating: Number,
    reviewCount: Number,
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;