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

app.directive('profileitems', function() {
    return {
      scope: {
        profileitems: '='
      },
      restrict: "E",
      templateUrl: '/assets/templates/items.html',
      controller: 'ProfileItemsController',
      controllerAs: 'itemsCtrl'
    };
  })
  .controller('ProfileItemsController', ['profileitems', function(items) {
    this.items = items;
  }])