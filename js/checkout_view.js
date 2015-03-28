angular.module('adaperio.controllers').controller('controllers.CheckoutView',
    [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$window',
        '$location',
        '$timeout',
        'services.Api',
        'services.ToCheckout',

        function($scope,$rootScope,$routeParams,$window,$location,$timeout,api,toCheckout){
            // by default - we do not show Vkontakte group
            $scope.dataLoaded = false;
            $scope.model = '';
            $scope.vin  = '';
            $scope.body = '';
            $scope.year = '';

            $scope.somethingFound = false;
            $scope.readyToFollow = true;
            $scope.userId = 0;
            $scope.sid = 0;
            $scope.sig = 0;

            $scope.numberAsked = '';
            $scope.numberAskedLatin = '';

            // 
            $scope.processSearchData = function(){
                 if(toCheckout.getSearchData().milleageFound){
                     $scope.somethingFound = true;
                     $scope.milleageFound = true;
                 }else{
                     $scope.milleageFound = false;
                 }

                 if(toCheckout.getSearchData().accidentFound){
                     $scope.somethingFound = true;
                     $scope.accidentFound = true;
                 }else{
                     $scope.accidentFound = false;
                 }

                 if(toCheckout.getSearchData().picsFound){
                     $scope.somethingFound = true;
                     $scope.photoFound = true;
                 }else{
                     $scope.photoFound = false;
                 }

                 if(toCheckout.getSearchData().taxiFound){
                     $scope.somethingFound = true;
                     $scope.taxiFound = true;
                 }else{
                     $scope.taxiFound = false;
                 }

                 // Update analytics
                 if($scope.somethingFound){
                       $window.yaCounter24002680.reachGoal('GOTO_CHECKOUT');
                 }
            };

            $scope.errorCreatingOrder = function(){
                $window.alert('Произошла ошибка. Пожалуйста, попробуйте еще раз');
                $location.path('/main');
            };

            $scope.convertToLat = function(ch){
                var c =
                [
                    {f:'а',
                     t:'A'},

                    {f:'в',
                     t:'B'},

                    {f:'е',
                     t:'E'},

                    {f:'к',
                     t:'K'},

                    {f:'м',
                     t:'M'},

                    {f:'н',
                     t:'H'},

                    {f:'о',
                     t:'O'},

                    {f:'р',
                     t:'P'},

                    {f:'с',
                     t:'C'},

                    {f:'т',
                     t:'T'},

                    {f:'у',
                     t:'Y'},

                    {f:'х',
                     t:'X'}
                ];

                for(var i=0; i< c.length; ++i){
                    if(ch===c[i].f){
                        console.log('-->Convert ' + ch + ' to ' + c[i].t);
                        return c[i].t;
                    }
                }

                return ch;
            };

            $scope.convertCyrilToLatin = function(numCyr){
                console.log('-->Convert number: ' + numCyr);
                numCyr = numCyr.toLowerCase();

                var numAfter = '';
                for(var i=0; i<numCyr.length; ++i){
                    numAfter = numAfter + $scope.convertToLat(numCyr[i]);
                }

                numAfter = numAfter.toUpperCase();

                console.log('-->Result: ' + numAfter);
                return numAfter;
            };

            $scope.checkout = function(){
                console.log('-->Checkout button clicked');

                var invId = '';
                var signature = '';
                var errOccured = false;

                var newWindow = $window.open('');
                console.log('-->Created new window');

                async.series(
                [
                     // 1 - create new order
                     function(callback){
                          console.log('-->Creating new order');

                          var userEmail = '';     // TODO
                          api.createNewOrder(userEmail,$scope.numberAsked,function(err,ii,sig){
                              if(err){
                                  return callback(err);
                              }

                              invId = ii;
                              signature = sig;

                              console.log('-->Order is OK');
                              callback(null);
                          });
                     },
               ],
               function(err,result){
                    console.log('-->Inv id: ' + invId);
                    console.log('-->Signature: ' + signature);

                    if(err){
                        return $scope.errorCreatingOrder();
                    }else{
                         var robokassaPath = 'https://auth.robokassa.ru/Merchant/Index.aspx' +
                              '?MrchLogin=Adaperio&' +
                              'OutSum=100.000000&' +
                              'InvId=' + invId + '&' +
                              'Desc=AdaperioCarCheck&' +
                              'SignatureValue=' + signature + '&' +
                              'Culture=ru';

                          $window.yaCounter24002680.reachGoal('SUCCESS_PAGE');

                          newWindow.location = robokassaPath;
                    }
               });
            };

            $scope.moveBack = function(){
                console.log('-->Moving back: search->main');
                $location.path('/main');
            };

		  $scope.subscribeEmail = function(){
			 console.log('-->Subscribe to email');
			 $location.path('/subscribe/' + $scope.numberAsked);
		  };

            // This is called when all data downloaded
            $scope.continueMain = function(){
                $scope.model         = toCheckout.getSearchData().carModel;
                $scope.vin           = toCheckout.getSearchData().vin;
                $scope.body          = toCheckout.getSearchData().body;
                $scope.year          = toCheckout.getSearchData().year;

                if(typeof(toCheckout.getSearchData().autoNomerPics)!=='undefined'){
                     $scope.autoNomerPics = toCheckout.getSearchData().autoNomerPics.slice(0);
                }
                $scope.processSearchData();
            };

            // Start:
            // 1 - Parse URL
            var match1 = $location.path().match(/\/search\/(.*)/);
            if(match1 && match1.length){
                 $scope.numberAsked = match1[1];
                 $scope.numberAskedLatin = $scope.convertCyrilToLatin($scope.numberAsked);
            }
            console.log('-->Number asked: ' + $scope.numberAsked);

            // 2 - load/show data
            if(!toCheckout.getFromSearchView()){
                // 3 - Show spinner
                // TODO: does not working...
                //api.showSpinner(true,'spinner_checkout');

                // load data again! Originally this is done in 'search view'
                api.checkIfCarExists($scope.numberAsked,function(err,result,data){
                    //api.showSpinner(false,'spinner_checkout');

                    if(err){
                        //return $scope.errorCreatingOrder();
                        console.log('-->Error: ' + err);
                    }

                    if(result){
                        console.log('-->Information for car #' + $scope.numberAsked + ' found');
                        toCheckout.setSearchData(data);
                    }else{
                        var dataEmpty = {};
                        dataEmpty.number = $scope.numberAsked;
                        dataEmpty.data = null;
                        dataEmpty.isFromSearchView = false;
                        toCheckout.setSearchData(dataEmpty);
                    }

                    $scope.dataLoaded = true;
                    $scope.continueMain();
                });
            }else{
               toCheckout.setFromSearchView(false);

               $scope.dataLoaded = true;
               $scope.continueMain();
            }
        }
    ]
);
