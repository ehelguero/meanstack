angular.module('heyNews', ['ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: '/home.html',
    controller: 'MainCtrl',
    resolve: {
      postPromise: ['posts', function(posts){
        return posts.getAll();
      }]
    }
  })
  .state('posts', {
    url: '/posts/{id}',
    templateUrl: '/posts.html',
    controller: 'PostsCtrl',
    resolve: {
      post: ['$stateParams','posts', function($stateParams,posts){
        return posts.get($stateParams.id);
      }]
    }
  });

  $urlRouterProvider.otherwise('home');
}])
.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.posts = posts.posts;

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === ''){
      return;
    }
    posts.create({
      title: $scope.title,
      link: $scope.link,
    })
    $scope.title = '';
    $scope.link = '';
  }

  $scope.addVote = function(post){
    posts.upvote(post);
  }
}])
.controller('PostsCtrl', ['$scope','posts', 'post', function($scope,posts, post){
  $scope.post = post;

  $scope.addComment = function(){
    if(!$scope.body || $scope.body === '' ) { return; }
    posts.addComment(post._id,{
      body: $scope.body,
      author: 'user',
      upvotes: 0,
    }).success(function(comment){
      $scope.post.comments.push(comment)
    });

    $scope.body = '';
  };

  $scope.upVoteComment = function(comment){
    posts.upvoteComment(post._id, comment);
  }
}])
.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  };

  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      // makes a copy of the data to o.posts
      angular.copy(data, o.posts);
    })
  };

  o.create = function(post){
      return $http.post('/posts', post).success(function(data){
        o.posts.push(data);
      })
  }

  o.upvote = function(post){
    return $http.put('/posts/' + post._id + '/upvote').success(function(data){
      post.upvotes += 1;
    });
  }

  o.get = function(id){
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    })
  };

  o.addComment = function(id, comment){
    return $http.post('/posts/' + id + '/comments', comment)
  }

  o.upvoteComment = function(id, comment){
      return $http.put('/posts/' + id + '/comments/' + comment._id + '/upvote')
      .success(function(data){
        comment.upvotes += 1;
      });
  };

  return o;
}]);
