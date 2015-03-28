angular.module('adaperio.controllers').controller('controllers.AdminView',
    [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$window',
        '$location',
        'services.AdminApi',

        function($scope,$rootScope,$routeParams,$window,$location,adminApi){
            $scope.errMessage   = '';
            $scope.receivedLink = '';

            $scope.nothingFound = function(){
                $scope.errMessage = 'К счастью, ничего не найдено! Попробуйте еще раз';
            };

            $scope.errorCreatingOrder = function(){
                $window.alert('Произошла ошибка. Пожалуйста, попробуйте еще раз');
                $location.path('/admin');
            };

            $scope.getCar = function(licenseNumber,region){
                $scope.errMessage  = '';
                $scope.receivedLink= '';

                // check if we have data for your car
                adminApi.getCar(licenseNumber + region,function(result){
                    if(result){
                        // success!
                        $scope.displayResults(result);
                    }else{
                        // show error
                        return $scope.nothingFound();
                    }
                });
            };

            $scope.displayResults = function(result){
                var isOk = (typeof(result)!=='undefined' && (result!==null) && (result.docs.length!==0));

                console.log('-->GET CAR finished with result: ' + isOk);
                if(!isOk){
                    return $scope.nothingFound();
                }

                // check if link is valid
                var link = result.docs[0].link; // TODO: show multiple documents
                var isLinkOk = (typeof(result.docs[0].link)!=='undefined' && (result.docs[0].link!==null) && (result.docs[0].link.length!==0));

                if(!isLinkOk){
                    return $scope.nothingFound();
                }

                $scope.receivedLink = link;
            };
        }
    ]
);
