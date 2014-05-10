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
        redirectTo: '/login'
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
  .config(function ($locationProvider) {
    //$locationProvider.html5Mode(true);
    //Be sure to check browser support for the html5 history API:
    //if(window.history && window.history.pushState){
    //  $locationProvider.html5Mode(true);
    //}
  })
  .config(function ($httpProvider) {
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
  .run(function (Restangular, $location, authTokenService) {

    Restangular.setErrorInterceptor(
      function (response, deferred) {
        if(response.status===403){
          authTokenService.setToken(null);
          $location.path('login');
        }
      });
    Restangular.addFullRequestInterceptor(
      function (element, operation, path, url, headers, params, httpConfig) {
        headers['X-AUTH-TOKEN'] = authTokenService.getToken();
      });
    Restangular.addResponseInterceptor(
      function (data, operation, what, url, response, deferred) {
        authTokenService.setToken(response.headers('X-AUTH-TOKEN'));
        return data;
      });
  });


 angular.module('abankingDummySpaApp')
  .service('authTokenService', function ($localStorage, $location) {
    
    this.setToken = function (authToken) {
      $localStorage.xAuthToken = authToken;
    };

    this.removeToken = function () {
      $localStorage.xAuthToken = null;
      $location.path('login');
    };

    this.getToken = function () {
      return $localStorage.xAuthToken;
    };

    this.exits = function () {
      return (typeof(this.getToken()) === 'undefined');
    };

  });



angular.module('abankingDummySpaApp')
.factory('FndtnAlertBoxDriver', function () {

  var AlertBoxDriver = function () {
    this.display = false;
    this.message = '';
    this.class = '';
  };

  AlertBoxDriver.prototype.close = function () {
    this.message = '';
    this.display = false;
  };

  AlertBoxDriver.prototype.error = function (msg) {
    this.open(msg, 'alert');
  };

  AlertBoxDriver.prototype.success = function (msg) {
    this.open(msg, 'success');
  };

  AlertBoxDriver.prototype.open = function (msg, cls) {
    this.message = msg;
    this.display = true;
    this.class = cls;
  };

  return AlertBoxDriver;

});