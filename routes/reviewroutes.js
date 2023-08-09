const express=require('express');

const router=express.Router({mergeParams:true});


const catchasync = require('../utilities/catchasync');
const ExpressError = require('../utilities/expresserror');
const review=require('../models/review');
const campitem=require('../models/campground');
const Joi =require('joi');

const {reviewJoiSchema }=require('../joi_schemas');


const validatereview=(req,res,next)=>{
    
    const {error}= reviewJoiSchema.validate(req.body);
      if(error){
      const  msg= error.details.map( el => el.message).join(',')
        throw new ExpressError(msg,400);
      }else {
       next();
      }
}
const {isloggedin,isreviewAuthor}=require('./middleware');

router.post('/',isloggedin,validatereview,catchasync(async(req,res,next)=>{
    const cmp=await campitem.findById(req.params.cmpid);
      const rev=new review(req.body.review); 
     rev.author=req.user._id;
     cmp.reviews.push(rev);
      await cmp.save();
      await rev.save();
      req.flash('success','successfully made a new review')
      res.redirect(`/campgrounds/${cmp.id}`);
 }));
 
 router.delete('/:reviewId', isreviewAuthor,isloggedin, catchasync(async (req, res) => {
    const { cmpid, reviewId } = req.params;
    await campitem.findByIdAndUpdate(cmpid, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('success','successfully deleted a new campground')
    res.redirect(`/campgrounds/${cmpid}`);
}))

module.exports=router;