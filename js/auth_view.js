angular.module('adaperio.controllers').controller('controllers.AuthView',
    [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$window',
        '$location',
        'services.AdminApi',

        function($scope,$rootScope,$routeParams,$window,$location,adminApi){
            $scope.errorMsg = '';

            $scope.login = function(username,password){

                var loginData = {
                    username: username,
                    password: password
                };

                adminApi.doLogin(loginData,function(data){
                    $scope.errorMsg = '';

                    $window.sessionStorage.token = data.token;

                    // move to clients
                    $location.path('/admin');
                },function(errData){
                    console.log('-->AUTH FAILED...');
                    $scope.logout();

                    $scope.errorMsg = 'Не удалось пройти аутентификацию. Попробуйте снова';
                });
            };

            $scope.logout = function () {
                delete $window.sessionStorage.token;
            };
        }
    ]
);
