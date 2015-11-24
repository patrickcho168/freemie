var app = angular.module('freemie');

// app.factory('searchService', function() {
//     var items = [];
//     var callSearch = function() {
//       var searchInput = $("#search-bar-input").val();
//       $http.get("/search?searchKey=" + searchInput).success(function(response) {
//         items = response;
//       });
//     }

//     var getSearchResults = function() {
//       return items;
//     }

//     return {
//       callSearch: callSearch,
//       getSearchResults: getSearchResults
//     }
//   });

app.directive('items', function() {
    return {
      scope: {
        items: '='
      },
      restrict: "E",
      templateUrl: '/assets/templates/items.html',
      controller: 'ItemsController',
      controllerAs: 'itemsCtrl'
    };
  })
  .controller('ItemsController', ['items','searchService', function(items, searchService) {
    if(searchService.getSearchResults()) {
      this.items = searchService.getSearchResults();
    } else {
      this.items = items;
    }

  }]);

