const { Router } = require('express');
const bodyParser = require('body-parser');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const router = Router();

router.get('/login', (req, res) => {
    const error = req.query.error;
    res.render('auth/login', { title: 'Login', error });
});

router.get('/signup', (req, res) => {
    const error = req.query.error;
    res.render('auth/signup', { title: 'Sign Up', error });
});


// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));
// Use the cookie parser middleware
router.use(cookieParser());
// HW: read about extended: true

// Signup route POST
router.post('/signup', (req, res) => {
    // 1. Extract the name, email and password from the request body
    const obj = req.body;
    console.log(obj);
    // 2. Create a new user in the database
    User.create(obj)
        .then(user => {
            // 2a. If user is created successfully, create a token,
            // // send it back as cookie, and redirect to all blogs page /blogs
            console.log('User created successfully');
            // Create a token and send it back as a cookie
            const token = getToken(user.email, user.name);
            res.cookie('authtoken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.redirect('/blogs');
        })
        .catch(err => {
            // 2b. If user creation fails, send an error message with status code 400 (Bad Request)
            console.log(err);
            res.redirect('/auth/signup?error=Error creating user');
        });
});

function getToken(email, name) {
    const secret = "veryComplexSecret";
    const token = jwt.sign({ email, name }, secret, { expiresIn: '7d' });
    return token;
}

// Login route POST
router.post('/login', (req, res) => {
    // 1. Extract the email and password from the request body
    const { email, password } = req.body;
    console.log(req.body);
    // 2. Search for the user in the database
    User.findOne({ email })
        .then(user => {
            if (!user) {
                // If user is not found,
                // send an error message with status code 400 (Bad Request)
                return res.redirect('/auth//login?error=User not found');
            }
            else if (user.password !== password) {
                // If password is incorrect,
                // send an error message with status code 400 (Bad Request)
                return res.redirect('/auth/login?error=Incorrect password');
            }
            else {
                // If user is found and password is correct, create a token,
                // // send it back as cookie, and redirect to all blogs page /blogs
                console.log('User logged in successfully');
                // Create a token and send it back as a cookie
                const token = getToken(user.email, user.name);
                res.cookie('authtoken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                res.redirect('/blogs');
            }
        })
        .catch(err => {
            console.log(err);
            res.redirect('/auth/login?error=Error logging in');
        });
});

// Logout route GET
router.get('/logout', (req, res) => {
    res.clearCookie('authtoken');
    res.redirect('/');
});


module.exports = router;
