angular.module('freemie')
  .directive('items', function() {
    return {
      scope: {},
      restrict: "E",
      templateUrl: '/assets/templates/items.html',
      controller: 'ItemsController',
      controllerAs: 'itemsCtrl'
    };
  })
  .controller('ItemsController', ['items', function(items) {
    this.items = items;
    console.log(this.items);
  }]);