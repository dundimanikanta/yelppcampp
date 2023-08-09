const express = require('express');
const router = express.Router();
const user = require('../models/user');
const passport = require('passport');

const catchasync = require('../utilities/catchasync');
router.get('/register', (req, res) => {
    res.render('users/register.ejs');
})

const { storeReturnTo}=require('./middleware');
router.post('/register', catchasync(async (req, res,next) => {

    try {
        const { email, username, password } = req.body;

        const us = new user({ username, email });
        const newus = await user.register(us, password);
          
        req.login(newus,err=>{
            if(err) return next(err);
            req.flash('success', 'welcome to yelpCAMp');
            res.redirect('/campgrounds');
        })

       
    } catch (e) {
        req.flash('success', e.message);
        res.redirect('/register');
    }

}))



router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})


router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl=res.locals.returnTo || '/campgrounds' ;
   

    res.redirect(`${redirectUrl}`);
})

router.get('/logout', (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }

        req.flash('success', 'you are succesfully logged out');
        res.redirect('/campgrounds');

    });

})
module.exports = router;