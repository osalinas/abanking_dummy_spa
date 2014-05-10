'use strict';

angular.module('abankingDummySpaApp')
  .controller('LoginCtrl', function ($scope, $location, Restangular, FndtnAlertBoxDriver, authTokenService) {

	$scope.loginAlertBox = new FndtnAlertBoxDriver();

	if(authTokenService.exits()){
		$location.path('home');
	}

	$scope.$watch('$viewContentLoaded', function () {
		$(document).foundation();
	});


	$('#loginForm').on('valid', function () {
      $scope.submit();
    });

	$scope.submit = function(){
		Restangular.all('login')
		.post($scope.login)
		.then(
			function (postedUser) {
				$scope.userObject = postedUser.data;
				$location.path('home');
			},function (response){
				$scope.loginAlertBox.error(response.data);
			});
	};
});
