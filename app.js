const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogpostRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// CONSTANTS
const USER_NAME = 'anshkg';
const PASSWORD = 'kg7983';
const DB_NAME = 'mernDB'; // TODO: Change this to your database name
const DB_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.7ehonii.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
const PORT = 3040;

// express app
const app = express();
// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());

mongoose.connect(DB_URI)
    .then((result) => {
        console.log('Connected to database');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to database', err);
        process.exit(1); // Exit the process with a failure code
    });


// register view engine
app.set('view engine', 'ejs');

// app.use((req, res, next) => {
//     res.locals.path = req.path;
//     next();
// });

// middleware -> checkUser
app.use(cookieParser());
// 1. create a function to check if the user is logged in or not
function checkUser(req, res, next) {
    const token = req.cookies.authtoken;
    console.log(token);
    if (token) {
        jwt.verify(token, 'veryComplexSecret', (err, decodedToken) => {
            if (err) {
                console.log(`Token is incorrect: ${err}`);
                res.locals.user = null;
            } else {
                // Token is correct
                res.locals.user = decodedToken; // {email: "email"}
            }
        });
    } else {
        res.locals.user = null;
    }
    next();
}
app.use(checkUser);


app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// auth routes
app.use('/auth', authRoutes);

// blog routes
app.use('/blogs', blogpostRoutes);

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('error', { title: 'Error' });
});


// 1. Let's submit a form
// Q: What is the default method of the form?
// -> GET
// Q: What is the default path of the form?
// -> /blogs
// Q: What is the content type of the form? 
// -> application/x-www-form-urlencoded
// Q: What is url encoding?
// -> It is a way to encode the form data before sending it to the server.
// Do we need to convert this url encoded data to JSON?
// -> Yes
// How to do that?
// -> Use body-parser middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// What is the difference between body-parser.urlencoded and body-parser.json?
// -> urlencoded is used to parse the data with content type application/x-www-form-urlencoded
// -> json is used to parse the data with content type application/json


