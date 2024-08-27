// 1. Create controller functions
// blog_index_get, blog_id_get, blog_create_post, blog_delete
// 2. Export these functions
// 3. Import these functions in the routes file
const BlogPost = require('../models/blogpost');


// blog_index_get
const blog_index_get = (req, res) => {
    const userEmailFromDb = res.locals.user.email;
    console.log(userEmailFromDb);
    BlogPost.find({author: userEmailFromDb}).sort({ createdAt: -1 })
        .then((result) => {
            res.render('blogs/blogs', { title: 'All blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('blogs/fail');
        });
}


// blog_id_get
const blog_id_get = (req, res) => {
    BlogPost.findById(req.params.id)
        .then((blog) => {
            res.render('blogs/single-blog', { title: blog.title, blog });
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('error', { title: 'Blog Not Found' });
        });
}

// blog_create_post
const blog_create_post = (req, res) => {
    // const userIdFromDb = res.locals.user.id;
    const userEmailFromDb = res.locals.user.email;
    const blog = {
        title : req.body.title,
        content :  req.body.content,
        summary :  req.body.summary,
        // author : userIdFromDb
        author: userEmailFromDb
    };
    // Create a new blog post using the BlogPost static method
    BlogPost.create(blog)
        .then((result) => {
            console.log(`New blog added: ${result.title}`);
            res.redirect('/blogs/success');
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/blogs/fail');
        });





    // Another approach to create a new blog post
    // const blogpost = new BlogPost(blog);
    // blogpost.save()
    //     .then((result) => {
    //         console.log(`New blog added: ${result.title}`);
    //         res.redirect('blogs/success');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.redirect('/blogs/fail');
    //     });
    console.log(`New blog added: ${blog.title}`);
}


// blog_delete
const blog_delete = (req, res) => {
    console.log(`Deleting blog with id: ${req.params.id}`);
    BlogPost.findByIdAndDelete(req.params.id)
        .then((result) => {
            console.log(`Blog deleted: ${result.title}`);
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/blogs/fail');
        });
}


module.exports = {
    blog_index_get,
    blog_id_get,
    blog_create_post,
    blog_delete
}
