const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
 const User = require('../models/User');

//login page
router.get('/login',(req,res)=>res.render('login'));

//register page
router.get('/register',(req,res)=>res.render('register'));

//register handle

router.post('/register',(req,res)=>{
    const {name, email, password, password2}=req.body;
    // error handling

    let errors = [];

    //reqired fields check
    if(!name || !email || !password || !password2)
    {
        errors.push({msg: "Please fill in all fields"});
    }

    //passwords match
    if(password2 !== password)
    {
        errors.push({msg:'passwords should match'});
    }

    //password length
    if(password.length < 6)
    {
        errors.push({msg:'password length should be 6 or more'});
    }

    //cleared errors

    if(errors.length>0)
    {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        //validate pass
        User.findOne({email:email})
        .then(user=>{
            if (user) {
                //user exists
                errors.push({msg:'email already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                //hash password
                bcrypt.genSalt(10,(err,salt)=>
                bcrypt.hash(newUser.password,salt,(err, hash)=>
                {
                    if (err) throw(err);
                    newUser.password=hash;
                    //save new user
                    newUser.save()
                    .then(user =>{
                        req.flash('success_msg','You have successfully registered, please login!!!');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }))
            }
        })
    }
})
//login Handler
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

//logout handler
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','you are logged out');
    res.redirect('/users/login');
  
});

module.exports =router;