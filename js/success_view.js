angular.module('adaperio.controllers').controller('controllers.SuccessView',
    [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$window',
        '$location',
        'services.Api',

        function($scope,$rootScope,$routeParams,$window,$location,api){
            $scope.receivedLinks = [];
            $scope.receivedPhotos = [];

            $scope.vin = '';
            $scope.body = '';

            $scope.year = '';
            $scope.milleage   = 0;
            $scope.milleageArr = [];
            $scope.milleageMsg = 'Не установлен';
            $scope.milleageCheckDate = 'Не установлена';

            $scope.errMessage = '';
		  $scope.taxiMake   = null;
	       $scope.taxiOwner  = null;
            $scope.taxiStarted = 'Не известно';
            $scope.taxiEnded   = 'Не известно';
            
            $scope.model = 'Не известно';
            $scope.numberAsked = '';

            $scope.gotGibddWanted = false;
            $scope.gibddWanted    = false;
            $scope.wantedArr      = [];

            $scope.gotGibddRestricted = false;
            $scope.gibddRestricted    = false;
            $scope.restrictedArr      = [];

            $scope.convertOgrcodeToString = function(ogrkod){
                if(ogrkod===3){
                    return 'Запрет на регистрационные действия и прохождение ГТО';
                }

                if(ogrkod===2){
                    return 'Запрет на регистрационные действия';
                }

                return 'Запрет на регистрационные действия';
            };

            //OutSum
            //InvId=nInvId
            //SignatureValue=sSignatureValue&
            //Culture=sCulture
            console.log('-->QUERY STRING PARAMS: ');
            //console.log($location.search());

            console.log($location.url());

            var sum   = $location.search().OutSum;
            var invId = $location.search().InvId;
            var sig   = $location.search().SignatureValue;

            console.log('SUM: ' + sum);
            console.log('INV ID: ' + invId);
            console.log('SIG: ' + sig);

            if($location.url().indexOf('payment')!==-1){
                console.log('-->Payment page. Redirect');
                var newUrl = '/#/success?InvId=' + invId + '&OutSum=' + sum + '&SignatureValue=' + sig;

                $window.location = newUrl;
                return;
            }

            api.getOrderResult(sum,invId,sig,function(err,data,links,kms,taxiData){
                if(err){
                    $scope.errMessage = 'Произошла ошибка. Обратитесь в техническую поддержку: support@adaperio.ru и укажите следующие данные: ' + 
                         'Num= ' + invId + '; Sig= ' + sig;

                    //return $location.path('/result_err');
                    return;
                }
                
                if(typeof(data.vin)!=='undefined' && data.vin.length){
                     $scope.vin  = data.vin;
                }

                if(typeof(data.body)!=='undefined' && data.body.length){
                     $scope.body = data.body;
                }

                if(typeof(data.year)!=='undefined' && data.year.length){
                     $scope.year = data.year;
                }

                $scope.model = data.carModel;
                $scope.numberAsked = decodeURIComponent(data.num);

                // split into 2 arrays: docs + pics
                console.log('-->Parsing links...');
                for(var i=0; i<links.length; i++){

                    if(links[i].link.indexOf('jpg?')!==-1 || links[i].link.indexOf('png?')!==-1){
                         $scope.receivePhotos.push(links[i]);
                    }else{
                         $scope.receivedLinks.push(links[i]);
                    }
                }

                if(!links.length && typeof(taxiData)==='undefined'){
                    // add message
                    $scope.errMessage = 'Информация о ДТП не найдена';
                }

			 if(typeof(taxiData)!=='undefined' && taxiData.length){
				$scope.taxiMake  = taxiData[0].name;
				$scope.taxiOwner = taxiData[0].owner;
                    $scope.taxiStarted = taxiData[0].started;
                         
                    $scope.taxiEnded = 'Настоящее время';

                    if(typeof(taxiData[0].end)!=='undefined' && taxiData[0].end.length){
                         $scope.taxiEnded = taxiData[0].end;
                    }
			 }

                // gibdd data 
                if(typeof(data.gibddWanted)!=='undefined'){
                    $scope.gotGibddWanted = true;
                    $scope.gibddWanted    = data.gibddWanted;

                    if(data.gibddWanted){
                         $scope.wantedArr = data.wantedArr.slice();
                    }
                }

                if(typeof(data.gibddRestricted)!=='undefined'){
                    $scope.gotGibddRestricted = true;
                    $scope.gibddRestricted    = data.gibddRestricted;

                    if(data.gibddRestricted){
                         $scope.restrictedArr = data.restrictedArr.slice();

                         // convert ogrkod to string
                         for(var j=0; j<$scope.restrictedArr.length; ++j){
                              $scope.restrictedArr[j].ogrmsg = $scope.convertOgrcodeToString($scope.restrictedArr[j].ogrkod); 
                         }
                    }
                }

                // autoNomerPics 
                if(typeof(data.autoNomerPics)!=='undefined'){
                     $scope.autoNomerPics = data.autoNomerPics.slice(0);
                }

                $scope.milleage = kms;
                $scope.milleageMsg = '' + kms + ' Км';

                for(var k=0; k<data.milleageArr.length; ++k){
                     var c = data.milleageArr[k];

                     var date = new Date(Date.parse(c.year));
                     c.year = date.format('dd-mm-yyyy');

                     $scope.milleageArr.push(c);
                }

                if(typeof(data.milleageDate)!=='undefined' && data.milleageDate.length){
                     var date = new Date(Date.parse(data.milleageDate));
                     $scope.milleageCheckDate = date.format('dd-mm-yyyy');
                }

                // yandex Analytics
                if($scope.numberAsked==='а254кв199' || $scope.numberAsked==='к061ру178' || $scope.numberAsked==='с988мт177'){
                     $window.yaCounter24002680.reachGoal('SAMPLE_SHOWN');
                }
            });
        }
    ]
);
