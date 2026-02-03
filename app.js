require('dotenv').config({ quiet: true });
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const listingsRouter = require("./routes/listingRoutes.js");
const reviewsRouter = require("./routes/reviewRoutes.js");
const usersRouter = require("./routes/userRoutes.js");
const otherRouter = require("./routes/legalRoutes.js");
const expError = require("./utils/ExpError");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLAS_DB_URL;
const port = 3000;

const store = new MongoStore({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.EXPRESS_SESSION_SECRET,
    },
    touchAfter: 24 * 3600,
    ttl: 604800,
})

const sessionOptions = {
    secret: process.env.EXPRESS_SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.redirectUrl = req.session.redirectUrl;
    res.locals.lastSearch = req.flash("lastSearch");
    next();
});


// -------------- Routes --------------

// all listing routes transfer to this router
app.use("/listings", listingsRouter);

// all review routes transfer to this router
app.use("/listings/:id/review", reviewsRouter);

// user signup and login routes
app.use("/", usersRouter);

// other routes
app.use("/", otherRouter);


// --------------------- server initialization -------------------------

app.listen(port, () => {
    console.log("server listing on port 3000");
    connectToMongoDb()
        .then(() => {
            console.log("connected to server.");
        })
        .catch(err => {
            console.log(err);
        });
});

// funtion for mongoDB connection 
async function connectToMongoDb() {
    await mongoose.connect(dbUrl)
};


// ---------------- Error handling middlewares ------------------

// Path error : handle all wrong path error 
app.use((req, res, next) => {
    return next(new expError(404, "Page not found!"));
});

// Mongoose error : handling mongoose error according to err.name
app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        return next(new expError(err.statusCode, "Please enter Valid Information..."))
    }
    next(err);
});

// Final error middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something wrong" } = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", { message });
});