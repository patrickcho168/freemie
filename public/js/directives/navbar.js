angular.module('freemie')
  .directive('navbar', function() {
    return {
      scope: {},
      restrict: "E",
      templateUrl: '/assets/templates/navbar.html',
      controller: 'NavbarController',
      controllerAs: 'navbarCtrl'
    };
  })
  .controller('NavbarController', ['userId', function(userId) {
    this.userId = userId;
    this.search = function() {
      
    }
  }]);