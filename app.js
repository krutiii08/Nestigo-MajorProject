// if(process.env.NODE_ENV != "production"){
// require('dotenv').config()
// console.log(process.env.SECRET);
// }

// const express=require("express");
// const app=express();
// const mongoose=require("mongoose");
// // const Listing=require("./models/listing.js");
// const path=require("path");
// const methodOverride=require("method-override");
// const ejsMate = require("ejs-mate");
// // const wrapAsync=require("./utils/wrapAsync.js");
// const ExpressError=require("./utils/ExpressError.js");
// // const Review=require("./models/review.js");
// // const {reviewSchema}=require("./schema.js");
// const session=require("express-session");
// // const MongoStore=require("connect-mongo");
// const MongoStore = require("connect-mongo").default;

// const flash=require("connect-flash");
// const passport=require("passport");
// const localStrategy=require("passport-local");
// const User=require("./models/user.js");

// const listingsRouter=require("./routes/listing.js");
// const reviewsRouter=require("./routes/review.js");
// const userRouter=require("./routes/user.js");



// // const MONGO_URL="mongodb://127.0.0.1:27017/Nestigo";
// const dbUrl=process.env.ATLASDB_URL;

// main().then(()=>{
//     console.log("Connected to DB");
// })
// .catch((err)=>{
//     console.log(err);
// })


// async function main() {
//     await mongoose.connect(dbUrl);
// }


// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));


// const store = MongoStore.create({
//   mongoUrl: dbUrl,
//   crypto: {
//     secret: process.env.SECRET,
//   },
//   touchAfter: 24 * 3600, // seconds
// });

// store.on("error", (err) => {
//   console.log("ERROR IN MONGO SESSION STORE", err);
// });

// const sessionOptions = {
//   store,
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
// , // ✅ FIXED
//     maxAge: 7 * 24 * 60 * 60 * 1000,               // ✅ FIXED
//     httpOnly: true,
//   },
// };

// app.use(session(sessionOptions));
// app.use(flash());


// //passport
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// //root
// // app.get("/",(req,res)=>{
// //     res.send("Hii,I am root");
// // });





// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");
//     res.locals.currUser=req.user;
//     next();
// })

// //demo user
// // app.get("/demouser",async(req,res)=>{
// //     let fakeUser=new User({
// //         email:"student@gmail.com",
// //         username:"sigma-student"
// //     });

// //     let registeredUser =await User.register(fakeUser,"helloworld");
// //     res.send(registeredUser);
// // })


// //for all the routes of listing it will go to listing.js inside routes
// app.use("/listings",listingsRouter);


// //for all the routes of review it will go to review.js inside routes
// app.use("/listings/:id/reviews",reviewsRouter);

// app.use("/",userRouter);



// // app.get("/testListing",async (req,res)=>{
// //     let sampleListing=new Listing({
// //         title:"My New Villa",
// //         description:"By the beach",
// //         price:1200,
// //         location:"Calangute,Goa",
// //         country:"India"
// //     });

// // await sampleListing.save();
// // console.log("Sample was saved");
// // res.send("Successful");
// // });


// // app.all("*",(req,res,next)=>{
// //     next(new ExpressError(404,"Page not found"));
// // });

// app.use((err,req,res,next)=>{
//     let{statusCode=500,message="something wrong"}=err;
//     res.status(statusCode).render("error.ejs",{message})
//     // res.status(statusCode).send(message);
// })


// const PORT = process.env.PORT || 8090;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log(process.env.SECRET);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ================= DATABASE =================
const dbUrl = process.env.ATLASDB_URL;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// ================= APP CONFIG =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= SESSION STORE =================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // seconds
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // ✅ FIXED
    maxAge: 7 * 24 * 60 * 60 * 1000,               // ✅ FIXED
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= LOCALS =================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ================= ROUTES =================
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ================= ERROR HANDLING =================
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ================= SERVER =================
app.listen(8080, () => {
  console.log("Server running on port 8080");
});