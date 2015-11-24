// Declare app level module which depends on ngRoute
angular.module('freemie', ['ngRoute', 'ngResource','items.data','index.data', 'LocalStorageModule']);

// app.config(function (localStorageServiceProvider) {
//   localStorageServiceProvider
//     .setStorageType('sessionStorage');
// });