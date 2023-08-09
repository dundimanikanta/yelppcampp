const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpbasic');
   console.log("conenction established");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const campitem=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');



const ran=()=>{
    return Math.floor(Math.random()* 17);
}
const seedDB= async()=>{
  await campitem.deleteMany({});
    
    for(let i=0;i<50;i++){
      const rand1000= Math.floor(Math.random()*1000);
      const pric=Math.floor(Math.random()*2000)+1000;
      const c=new campitem({
        author:'64cb9150cd54579bea60ab06',
        location:`${cities[rand1000].city},${cities[rand1000].state}`,
      title:`${descriptors[ran()]} ${places[ran()]}`,
      images:[
        
        {
          url: 'https://res.cloudinary.com/doxe7vvl5/image/upload/v1691314103/YelpCamp/cigjhos5vkwkyooinugv.gif',
          filename: 'YelpCamp/cigjhos5vkwkyooinugv'
         
        },
        {
          url: 'https://res.cloudinary.com/doxe7vvl5/image/upload/v1691314104/YelpCamp/sshh6pmuncmcyajgjfq6.jpg',
          filename: 'YelpCamp/sshh6pmuncmcyajgjfq6',
         
          
        }
      ],
      description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga reprehenderit ex quidem dolorum sit nihil facilis ullam minima vitae suscipit quae cumque, velit, delectus sint doloribus hic debitis. Laudantium, voluptates?',
      price:pric

      })
      await c.save();
    }
};
seedDB();