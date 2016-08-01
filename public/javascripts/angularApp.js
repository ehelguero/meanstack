angular.module('heyNews', ['ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: '/home.html',
    controller: 'MainCtrl'
  })
  .state('posts', {
    url: '/posts/{id}',
    templateUrl: '/posts.html',
    controller: 'PostsCtrl'
  });

  $urlRouterProvider.otherwise('home');
}])
.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.test = 'Hola mundo!';
  $scope.posts = posts.posts;

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === ''){
      return;
    }
    $scope.posts.push({
      title: $scope.title,
      link: $scope.link,
      upvotes: 0,
      comments: [
        { author: 'Joe', body: 'Cool post!', upvotes: 0},
        { author: 'Jay', body: 'Cool ', upvotes: 0}
      ]
    });
    $scope.title = '';
    $scope.link = '';
  }

  $scope.addVote = function(post){
    post.upvotes += 1;
  }
}])
.controller('PostsCtrl', ['$scope','$stateParams','posts',function($scope,$stateParams,posts){
  $scope.post = posts.posts[$stateParams.id];
  $scope.addComment = function(){
    if(!$scope.body || $scope.body === '' ) { return; }
    $scope.post.comments.push({
      body: $scope.body,
      author: 'user',
      upvotes: 0,
    })

    $scope.body = '';
  };
  $scope.upVoteComment = function(comment){
    comment.upvotes += 1;
  }
}])
.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  };

  // $http.get('/posts', function(err, data){
  //   console.log(data);
  // })

  return o;
}]);
