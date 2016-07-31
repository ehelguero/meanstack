var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
  body: String,
  author: {type: String, default: 'user'},
  upvotes: {type: number, default: 0},
  post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
});

mongoose.model('Comment', CommentsSchema);
