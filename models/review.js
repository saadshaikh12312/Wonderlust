const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    comment: {
        type: String,
        min: 0,
        required:[true, "please share a valid feedback."]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required:[true, "please give atleast 1 star"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
});

module.exports = Review = mongoose.model("review", reviewSchema);