'use strict';

angular.module('abankingDummySpaApp')
  .controller('HomeCtrl', function ($location, $scope, Restangular, authTokenService, FndtnAlertBoxDriver) {

    $scope.$watch('$viewContentLoaded', function () {
      $(document).foundation();
    });


    $('#addUserForm').on('valid', function () {
      $scope.add();
    });

    $scope.busy = false;
    $scope.stop = false;
    $scope.users = [];
    $scope.page = 1;

    $scope.addAlertBox = new FndtnAlertBoxDriver();
    $scope.listAlertBox = new FndtnAlertBoxDriver();

    $scope.nextPage = function () {
      if(!$scope.stopIS){
        $scope.busy = true;
        Restangular.one('users')
        .get({page:$scope.page, size:10})
        .then(function (usersRps) {
          if(usersRps.data.users.length === 0)
            $scope.stop = true;
          $scope.users = _.union(usersRps.data.users, $scope.users);
          $scope.page = $scope.page + 1;
        }, function (response) {
          $scope.listAlertBox.error('Error in load users listing.');
          console.log('Error with response:', response);
        });
        $scope.busy = false;
      }
    };

    $scope.delete = function (index) {
      var user = $scope.users[index];
      Restangular.one('users', user.user_id)
      .remove()
      .then(
        function (rslt) {
         console.log(rslt);
         $scope.users.splice(index, 1);
         $scope.listAlertBox.success('User deleted successfully.');
       },
       function (error) {
        $scope.listAlertBox.error('Error in delete operation.');
         console.log('Error with response:', error.status);
       });
    };

    $scope.add = function () {
      Restangular.all('users')
      .post($scope.newUser)
      .then(
        function (newUserRps) {
          $scope.users.push(newUserRps.data.user);
          $scope.addAlertBox.success("Added user successfully.");
        }, function (error) {
          console.log('Error with response:', error.status);
          $scope.addAlertBox.error(error.data);
        });
    };

    $scope.logout = function () {
      Restangular
      .one('logout')
      .get()
      .then(
        function (success) {
          authTokenService.removeToken()
        }, function (error) {
          $scope.listAlertBox.error('Error in logout service. Wait some minutes and attempt login again.');
        });
    };

  });
