const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const{isLoggedIn,isReviewAuthor}=require("../middleware.js");
const { destoryReview } = require("../controllers/reviews.js");
const { createListing } = require("../controllers/listings.js");

const reviewController=require("../controllers/reviews.js");
const listingController=require("../controllers/listings.js");


//validating schema

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//Reviews
 //post route

router.post("/" ,isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


   //delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.destoryReview)
)  

module.exports=router;