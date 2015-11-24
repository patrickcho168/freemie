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
  .factory('searchService', ['$http','localStorageService', function($http, localStorageService) {
    var callSearch = function() {
      var searchInput = $("#search-bar-input").val();
      $http.get("/search?searchKey=" + searchInput).success(function(response) {
        localStorageService.set("searchItems", response);
      });
    }

    var getSearchResults = function() {
      return localStorageService.get("searchItems");
    }

    return {
      callSearch: callSearch,
      getSearchResults: getSearchResults
    }
  }])
  .controller('NavbarController', ['userId', 'searchService', function(userId, searchService) {
    this.userId = userId;
    this.search = function() {
      searchService.callSearch();
      window.location.href = "/";
    }

  }]);

  // angular.module('freemie')
  //   .service('searchService', function() {
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
  // .controller('NavbarController', ['userId', function(userId) {
  //   this.userId = userId;
  //   this.search = function() {
  //     $http.get("/search").success(function(response) {
  //       console.log("hihi");
  //     });
  //   }
  // }]);