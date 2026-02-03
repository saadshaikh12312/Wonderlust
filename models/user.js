const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username must be unique or have atleast 3 charcters."],
        unique: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        }
    }
});

userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);
module.exports = mongoose.model("user", userSchema);