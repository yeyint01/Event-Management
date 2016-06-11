var app = angular.module('myApp', ['ngRoute','angularUtils.directives.dirPagination']);

app.controller('userList',function($scope, $http){


    $scope.users = []; //declare an empty array
    $scope.userInfo = null;
    $scope.token = "";
    $http.get('/web_services/users/me')
        .success(function(data){
        var user = data;
         $scope.token = user.local.user_token;
            $http.get('/web_services/users?token=' + $scope.token)
                .success(function(result){
                    $scope.users = result;
                });
    });

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    $scope.loadData = function(id){
        //alert($scope.token);
        $http.get('web_services/users/' + id + '?token=' + $scope.token)
            .success(function(data)
            {
                $scope.userInfo = data;
            });
    };
});