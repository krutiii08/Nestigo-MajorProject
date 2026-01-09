const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");

const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({storage})

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));

// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// });



//New route   
router.get("/new",isLoggedIn,listingController.renderNewForm)


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));





// //Index route
// router.get("/",wrapAsync(listingController.index));




// //show route
// router.get("/:id",wrapAsync(listingController.showListing));


// //Create route
// router.post("/",isLoggedIn,wrapAsync(listingController.createListing));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));


// //Update route
// router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListing));


// //Delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


module.exports=router;