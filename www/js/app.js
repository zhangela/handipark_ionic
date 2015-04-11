angular.module('handipark', ['ionic', 'handipark.controllers', 'handipark.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
