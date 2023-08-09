const catchasync = require('../utilities/catchasync');
const ExpressError = require('../utilities/expresserror');
const campitem=require('../models/campground');
const { cloudinary } = require('../cloudinary');




module.exports.allcamp=async(req,res)=>{
    const els=await campitem.find({});
  
    res.render('displayall',{els});
  
  }

  module.exports.addcamp=async (req,res)=>{
    
    res.render('addcamp');
}


module.exports.addcamppost=async(req, res,next) => {
         
     
    const campground = new campitem(req.body.campground);
    campground.images= req.files.map( f =>({
      url:f.path,
      filename:f.filename
   }))  
    campground.author= req.user._id;

   // console.log(campground);
    await campground.save();
    req.flash('success','successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`)
    
   
   
}


module.exports.deletecamp= async(req,res)=>{
    const {id}=req.params;
    await campitem.findByIdAndDelete(id);
    req.flash('success','successfully deleted a new campground')
    res.redirect('/campgrounds');
}


module.exports.campeditdisplay=async(req,res)=>{
    const {id}=req.params;

   const campground= await campitem.findById(id);
   if(!campground)
   {
     req.flash('error','campground not found');
     res.redirect('/campgrounds');
   }
   res.render('editcamp',{campground});
}


module.exports.editcamp= async(req,res)=>{
    const {id}=req.params;
    console.log(req.body.deleteImages);
    const cmp=await campitem.findByIdAndUpdate(id,{...req.body.campground});
    const imgs=req.files.map( f =>({
      url:f.path,
      filename:f.filename
   }))  ;

   cmp.images.push(...imgs);
   await cmp.save();

   if(req.body.deleteImages)
   { 
     for( let filename of req.body.deleteImages)
     {
      await cloudinary.uploader.destroy(filename);
     }
    await cmp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
 
   }
    
    req.flash('success','successfully updated a new campground')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.campdisplay=async(req,res)=>{
    const {id}=req.params;
  
   const campground= await campitem.findById(id)
   .populate({
       path:'reviews',
       populate:{
         path:'author'
       }
   }).populate('author');
      //console.log(campground);
     if(!campground)
     {
       req.flash('error','campground not found');
       res.redirect('/campgrounds');
     }
  
   res.render('show',{campground});
  }

