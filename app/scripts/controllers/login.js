'use strict';

angular.module('abankingDummySpaApp')
.controller('LoginCtrl', function ($scope, $localStorage, $location, Restangular) {

	$scope.$watch('$viewContentLoaded', function()
        {
            $(document).foundation();
        });


	if(typeof($localStorage.xAuthToken) == 'undefined'){
		$location.path('home');
	}
	$scope.token = $localStorage.xAuthToken;
	$scope.submit = function(){
		Restangular.all('login')
		.post($scope.login)
		.then(
			function (postedUser) {
				$scope.userObject = postedUser.data;
				$localStorage.xAuthToken = postedUser.headers('X-AUTH-TOKEN');
				$location.path('home');
			},function (response){
				console.log("ERROR Response =");
				console.log(response);
			});
	};
});
