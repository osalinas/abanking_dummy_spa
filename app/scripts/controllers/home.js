'use strict';

angular.module('abankingDummySpaApp')
  .controller('HomeCtrl', function ($scope, Restangular) {

    $scope.busy = false;
    $scope.stopIS = false;
    $scope.users = [];
    $scope.page = 1;

    $scope.nextPage = function () {
      if(!$scope.stopIS){
        $scope.busy = true;
        Restangular.one('users').get({page:$scope.page,size:10})
        .then(function (usersRps) {
          if(usersRps.data.users.length == 0)
            $scope.stopIS = true;
          $scope.users = _.union(usersRps.data.users, $scope.users);
          $scope.busy = false;
          $scope.page = $scope.page + 1;
        }, function (response) {
         console.log('Error with response:', response)
       });
      }
    };



    $scope.$watch('$viewContentLoaded', 
      function () {
        $(document).foundation();
      });


    

    $scope.delete = function (index) {
      var user = $scope.users[index]
      Restangular.one('users', user.user_id).remove().then(function (rslt) {
       console.log(rslt);
       $scope.users.splice(index, 1);
     },
     function (response) {
       console.log('Error with response:', response.status);
     });
    };

    $('#newUserForm').on('valid', function () {
      $scope.add();
    });

    $scope.add = function () {
      Restangular.all('users')
      .post($scope.newUser).then(function (newUserRps) {
        $scope.users.push(newUserRps.data.user);
      }, function (error) {
        console.log('Error with response:', error.status);
      });
    };

    $scope.edit = function (index) {
      $scope.userToEdit = $scope.users[index]
      console.log('----'+ index);
    };

  });
