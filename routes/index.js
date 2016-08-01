var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// for every route with a param :post
router.param('post', function(req,res,next,id){
  // retrieve post by Id
  var query = Post.findById(id);

  // execute query
  query.exec(function(err,post){
    if(err) { return next(err); }
    if(!post) { return next(new Error('can\'t find post')); }

    // assign post to request
    req.post = post;

    // continue to next route
    return next();
  });
})

// for every route with a param :post
router.param('comment', function(req,res,next,id){
  // retrieve post by Id
  var query = Comment.findById(id);

  // execute query
  query.exec(function(err,comment){
    if(err) { return next(err); }
    if(!comment) { return next(new Error('can\'t find post')); }

    // assign post to request
    req.comment = comment;

    // continue to next route
    return next();
  });
})

// route to load index.ejs
router.get('/', function(req,res){
  res.render('index')
});

// route to get all the posts
router.get('/posts', function(req, res, next) {
  Post.find(function(err,posts){
    if(err) { return next(err); }

    res.json(posts);
  })
});

// route to get a especific route
router.get('/posts/:post', function(req,res,next){
  req.post.populate('comments', function(err,post){
    if(err) { return next(err); }
    res.json(req.post)
  })
})

// route to create a post
router.post('/posts', function(req,res){
  // take all data from the form
  var post = new Post(req.body);
  // save it
  post.save(function(err, post){
    if(err) { return next(err); }

    res.json(post);
  });
});

// route to upvote a post
router.put('/posts/:post/upvote', function(req, res, next) {
  // with the recieved post, just call upvote methods from model
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

// route to add a comment to a post
router.post('/posts/:post/comments', function(req,res,next){
  // create new comment with form data
  var comment = new Comment(req.body);
  // recover the post from req
  comment.post = req.post;

  //save comment
  comment.save(function(err,comment){
    if(err) { return next(err); }
    // add comment to post
    req.post.comments.push(comment);
    //save post to update it
    req.post.save(function(err, post){
      if(err) { return next(err); }
      res.json(comment);
    });
  });
});

// route to upvote a post
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  // with the recieved post, just call upvote methods from model
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});


module.exports = router;
