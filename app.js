if(!process.env.NODE_ENV !="production")
{
    require('dotenv').config();
}



const express=require('express');
const path=require('path');
const mongoose = require('mongoose');
const ejsmate=require('ejs-mate');
const {campJoiSchema,reviewJoiSchema}=require('./joi_schemas');
const catchasync = require('./utilities/catchasync');
const ExpressError = require('./utilities/expresserror');
const methodOverride=require('method-override');
const campitem=require('./models/campground');
const review=require('./models/review');
const user=require('./models/user');
const session=require('express-session');
const flash=require('connect-flash');
const helmet=require("helmet");

const passport=require('passport');
const localStrategy=require('passport-local');


const dbUrl=process.env.DB_URL;
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
   console.log("conenction established");
  
}

const app=express();

const mongoSanitize=require('express-mongo-sanitize');
app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(helmet({contentSecurityPolicy:false})); 

mongoose.set('strictQuery', true);

const secret= process.env.SECRET ||  'thisshouldbeabettersecret!';


const mongoStore=require('connect-mongo');
const store=new mongoStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
})

store.on('error',(e)=>{
    console.log("session store error");
})


 const sessionConfig={
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
      //  secure:true,
        expires:Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,

    }
}
 app.use(session(sessionConfig));
 app.use(passport.initialize());
 app.use(passport.session());

 app.use(flash());


passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{

    res.locals.currentuser=req.user;
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    next();
})

app.use(mongoSanitize());


app.get('/fakeuser',async(req,res)=>{
    const us= new user({email:'dundi@gamil',username:'dundi'});

    const newuser=await user.register(us,'monkey');

    res.send(newuser);
})
app.get('/',(req,res)=>{ 
    res.render('home');
});

const camproutes=require('./routes/camproutes');

app.use('/campgrounds',camproutes);


const reviewroutes=require('./routes/reviewroutes');

app.use('/campgrounds/:cmpid/reviews',reviewroutes);

const userroutes=require('./routes/userroutes');

app.use('/',userroutes);

 //////////////////   

////////////
















////////////////////





app.all('*',(req,res,next)=>{
    next( new ExpressError('not found',404))
})

app.use((err,req,res,next)=>{

    const {errCode=500}= err;

    if(!err.msg)
    {
        err.msg='somethng went wrong';
    }

   res.status(errCode).render('error.ejs',{err});

    
})

 const port= process.env.PORT || 2222;
app.listen(port,()=>{
    console.log(`listening in port ${port}`);
})