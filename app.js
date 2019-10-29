const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
//passport config
require('./config/passport')(passport);

//DB config
const DB = require('./config/keys').MongoURI;

// connect to mongo DB
mongoose.connect(DB,{useNewUrlParser:true})
.then(()=>console.log('mongodb connected'))
.catch(err=>console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({extended:false}));

//express sesssion
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    
  }));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

  // app flash middleware
  app.use(flash());

  //Globals
  app.use((req, res, next)=>{
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  });
//routes

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`server started on port ${PORT}`));