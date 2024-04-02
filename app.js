

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const methodOverride = require("method-override");
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const port = 5050;

app.use(require('express-session')({ 
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://chhabrakaran299:UkqQsUubwIl0gpdp@cluster0.lcft9dg.mongodb.net/notes",
        secret: 'supersecret',
        touchAfter: 24 * 60 * 60
      })
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

//Connect to database
connectDB();

app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

// Routes
app.use('/',require('./server/routes/index'));
app.use('/',require('./server/routes/dashboard'));
app.use('/',require('./server/routes/auth'));


// Handle 404
app.get('*',(req,res)=>{
    res.status(404).send('404 Page Not Found.')
})
app.listen(port,()=>{
    console.log(`App listening on ${port}`);
})