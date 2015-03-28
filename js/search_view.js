angular.module('adaperio.controllers').controller('controllers.SearchView',
    [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$window',
        '$location',
        'services.Api',
        'services.ToCheckout',

        function($scope,$rootScope,$routeParams,$window,$location,
                 api,toCheckout){

            $scope.number = '';
            $scope.region = '';
            $scope.errMessage = '';
            $scope.numberEnteredEvent = false;

            $scope.isNumber = function(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            };

            $scope.convertToCyr = function(ch){
                var c =
                [
                    {f:'a',
                     t:'а'},

                    {f:'b',
                     t:'в'},

                    {f:'e',
                     t:'е'},

                    {f:'k',
                     t:'к'},

                    {f:'m',
                     t:'м'},

                    {f:'h',
                     t:'н'},

                    {f:'o',
                     t:'о'},

                    {f:'p',
                     t:'р'},

                    {f:'c',
                     t:'с'},

                    {f:'t',
                     t:'т'},

                    {f:'y',
                     t:'у'},

                    {f:'x',
                     t:'х'}
                ];

                for(var i=0; i< c.length; ++i){
                    if(ch===c[i].f){
                        console.log('-->Convert ' + ch + ' to ' + c[i].t);
                        return c[i].t;
                    }
                }

                return ch;
            };

            $scope.badNumber = function(){
                $window.alert('Введён неверный номер автомобиля!');
            };

            $scope.errorSearching = function(){
                $window.alert('Произошла ошибка. Пожалуйста, попробуйте еще раз');
            };

            $scope.nothingFound = function(numConcat){
                toCheckout.setSearchData({});
                toCheckout.setFromSearchView(true);
                $location.path('/search/' + numConcat);
            };

            $scope.$watch('number', function (newValue, oldValue) {
                if(newValue.length>=5 && !$scope.numberEnteredEvent){
                    $scope.numberEnteredEvent = true;

                    $window.yaCounter24002680.reachGoal('NUMBER_ENTERED');
                }
            });

            $scope.searchForCar = function(userEmail,licenseNumber,region){
                console.log('-->Button clicked...');

                var numConcat = licenseNumber + region;

                numConcat = numConcat.replace(/\s+/g, '');

                var len = numConcat.length;
                if(len<=2){
                    return $scope.badNumber();
                }

                if(!$scope.isNumber(numConcat[len-1]) || !$scope.isNumber(numConcat[len-2])){
                    return $window.alert('Неверный регион!');
                }

                numConcat = numConcat.toLowerCase();

                // convert all latin symbols to cyr
                var numConcatAfter = '';
                for(var i=0; i<len; ++i){
                    numConcatAfter = numConcatAfter + $scope.convertToCyr(numConcat[i]);
                }

                numConcat = numConcatAfter;

                console.log('-->Search for: ' + numConcat);
                $scope.errMessage = '';

                api.showSpinner(true,'spinner');
                document.getElementById('num_input').disabled = true;
                document.getElementById('region_input').disabled = true;
                document.getElementById('search_button').disabled = true;

                // check if we have data for your car
                api.checkIfCarExists(numConcat,function(err,result,data){
                    console.log('-->CHECKED:');
                    console.log(err);

                    if(err){
                        // TODO: show error
                        //return $scope.errorSearching();
                        return $scope.nothingFound(numConcat);
                    }

                    if(result){
                        console.log('-->Information for car #' + numConcat + ' found');

                        toCheckout.setSearchData(data);

                        toCheckout.setFromSearchView(true);
                        $location.path('/search/' + numConcat);
                    }else{
                        return $scope.nothingFound(numConcat);
                    }
                });
            };
        }
    ]
);
