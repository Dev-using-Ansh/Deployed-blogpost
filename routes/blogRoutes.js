const express = require('express');
const bodyParser = require('body-parser');
const blogController = require('../controllers/blogController');

const router = express.Router();

// TODO: middleware -> isUserLoggedIn
// 1. Check if the user is logged in or not?
// 2a. If yes, call next()
// 2b. else, redirect to login page
function isUserLoggedIn(req, res, next) {
    if (res.locals.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

router.use(isUserLoggedIn);

router.get('/form', (req, res) => {
    res.render('blogs/newblog', { title: 'New blog' });
});

router.get('/success', (req, res) => {
    res.render('blogs/success', { title: 'Success' });
});

router.get('/fail', (req, res) => {
    res.render('blogs/fail', { title: 'Failed' });
});

// // blog routes
// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));

// GET request to view all blogs
router.get('/', blogController.blog_index_get);

// New route to view a single blog post
router.get('/id/:id', blogController.blog_id_get);

// POST request to create a new blog
router.post('/', blogController.blog_create_post);

// DELETE request to delete a blog
router.delete('/id/:id', blogController.blog_delete);

module.exports = router;



































// // 1. Read the cookie
// // 2. Verify the token
// // 2a. If token is valid, call next()
// // 2b. If token is invalid, redirect to login page
// router.use(cookieParser());
// function authRequired(req, res, next) {
//     const token = req.cookies.authtoken;
//     const secret = 'veryComplexSecret';
//     // Check if token exists
//     if (token) {
//         jwt.verify(token, secret, (err, decodedToken) => {
//             if (err) {
//                 console.log(err.message);
//                 res.redirect('/auth/login');
//             } else {
//                 console.log(decodedToken);
//                 next();
//             }
//         });
//     } else {
//         res.redirect('/auth/login');
//     }
// }

// router.use(authRequired);




// function authRequired(req, res, next) {
//     const user = res.locals.user;
//     if (user) {
//         // User is logged in
//         next();
//     } else {
//         // User is not logged in
//         res.status(401).redirect('/auth/login');
//     }
// }

// router.use(authRequired);