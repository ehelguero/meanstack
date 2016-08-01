var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
  body: String,
  author: {type: String, default: 'user'},
  upvotes: {type: Number, default: 0},
  post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
});

// create methos to increse votes in a post
CommentsSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Comment', CommentsSchema);
