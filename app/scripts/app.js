'use strict';

angular
  .module('abankingDummySpaApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'restangular',
    'ngStorage',
    'infinite-scroll'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function ($locationProvider){
    //$locationProvider.html5Mode(true);
    //Be sure to check browser support for the html5 history API:
    //if(window.history && window.history.pushState){
    //  $locationProvider.html5Mode(true);
    //}
  })
  .config(function ($httpProvider){
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $httpProvider.defaults.useXDomain = true;
  })
  .config(function (RestangularProvider) {
    RestangularProvider.setDefaultHeaders({'Content-Type':'application/json'})
    RestangularProvider.setBaseUrl('http://localhost:9000');
    RestangularProvider.setDefaultHttpFields({withCredentials:false});
    RestangularProvider.setFullResponse(true);

    //RestangularProvider.setResponseExtractor(function(response, operation) {
    //    console.log(response)
    //    return response;
    //});
  })
  .run(function (Restangular, $location, $localStorage, $rootScope) {
    $localStorage.xAuthToken = '9d7a3fd3-032c-45ca-b199-0433107263bd';
    Restangular.setErrorInterceptor(
      function (response, deferred) {
        if(response.status===403){
          $localStorage.xAuthToken = null;
          $location.url('login');
        }
      });
    Restangular.addFullRequestInterceptor(
      function (element, operation, path, url, headers, params, httpConfig) {
        headers['X-AUTH-TOKEN'] = $localStorage.xAuthToken;
      });
    Restangular.addResponseInterceptor(
      function (data, operation, what, url, response, deferred) {
        $localStorage.xAuthToken = response.headers('X-AUTH-TOKEN');
        return data;
      });
  });
  //.config(function (RestangularConfigurer){
  //  RestangularConfigurer.setFullResponse(true);
  //});

