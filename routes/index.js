var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = mongoose.model('User');

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

router.post('/register', function(req,res,next){
  // check for username and password
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields'});
  }

  // create new user
  var user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password);

  // save user
  user.save(function(err){
    if(err) { return next(err); }
    return res.json({token: user.generateJWT()});
  });

});

router.post('/login', function(req,res,next){
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err,user,info){
    if(err) { next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    }else{
      return res.status(401).json(info);
    }
  })(req,res,next);
});
module.exports = router;
