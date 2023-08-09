const mongoose=require('mongoose');
const review = require('./review')
const Schema=mongoose.Schema;

const yelpcampSchema=new Schema({
    title:String,
    images:[

        {
            url:String,
            filename:String
        }
    ],
    price:Number,
    description:String,
    location:String,
    author:
        {
            type: Schema.Types.ObjectId,
            ref:'user'
          }
    ,
    reviews:[
        {
          type: Schema.Types.ObjectId,
          ref:'review'
        }
    ]  
});


yelpcampSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
      await review.deleteMany({
          _id: {
              $in: doc.reviews
          }
      })
  }
});

const campitem=new mongoose.model('camp',yelpcampSchema);

module.exports=campitem;