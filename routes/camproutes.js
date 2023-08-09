const express=require('express');

const router=express.Router();


const catchasync = require('../utilities/catchasync');
const ExpressError = require('../utilities/expresserror');
const campitem=require('../models/campground');
const {isloggedin,isAuthor,validatecampground}=require('./middleware');
const Joi =require('joi');

const multer=require('multer');

const {storage}=require('../cloudinary/index')
const upload=multer({storage})

const {campJoiSchema }=require('../joi_schemas')
 const {allcamp,addcamp,addcamppost,deletecamp,campeditdisplay,campdisplay, editcamp}=require("../controllers/campcontroller");
router.get('/',catchasync(allcamp ) );
  
router.get('/add',isloggedin, catchasync( addcamp))
  
router.post('/',isloggedin,upload.array('image'),  validatecampground ,catchasync( addcamppost))
  
//  router.post('/',upload.array('image'),(req,res)=>{
//          console.log(req.body,req.files);
//  })


router.get("/:id",catchasync(campdisplay))


router.delete('/:id',isAuthor,isloggedin, catchasync(deletecamp))


router.get('/:id/edit',isAuthor,isloggedin, catchasync(campeditdisplay ))

router.put('/:id', isAuthor,isloggedin, upload.array('image'),validatecampground, catchasync( editcamp))


module.exports=router;