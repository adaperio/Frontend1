angular.module('adaperio.controllers').controller('controllers.SubsView',
		[
		'$scope',
		'$rootScope',
		'$routeParams',
		'$window',
		'$location',
          'services.Api',

		function($scope,$rootScope,$routeParams,$window,$location,api){
			$scope.numberAsked = $location.path().match(/\/subscribe\/(.*)/)[1];
			console.log('-->Num asked: ' + $scope.numberAsked);

			$scope.moveBack = function(){
				console.log('-->Moving back: subscribe->main');
				$location.path('/main');
			};

			$scope.subscribe = function(email){
				console.log('-->Subscribe with email: ' + email);
				if(typeof(email)==='undefined' || !email){
					$window.alert('Введен неверный e-mail!');
					return;	
				}

				// get Captcha results:
				//var challenge = Recaptcha.get_challenge();
				//var response  = Recaptcha.get_response();

				api.subscribeForNews(email,$scope.numberAsked,function(err,result){
					if(result==='OK'){
                              $window.yaCounter24002680.reachGoal('EMAIL_ENTERED');

						$window.alert('Вы успешно подписались на новости об автомобиле ' + $scope.numberAsked);	
						// move to main screen 
						$scope.moveBack();
					}else{
						$window.alert('К сожалению, подписаться не удалось. Попробуйте еще раз' + $scope.numberAsked);	
					}
				});
			};
		}
	]
);
