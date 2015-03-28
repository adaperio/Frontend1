angular.module('adaperio.controllers',[]);
angular.module('adaperio.services',[]);
angular.module('adaperio.transformers',[]);

//['angular-underscore']);

angular.module('adaperio',
    [
        'ui.bootstrap',
        'ui.utils',
        'ngRoute',
        'ngAnimate',

        'adaperio.controllers',
        'adaperio.services',
        'adaperio.transformers'
    ]
);

angular.module('adaperio').config(function($routeProvider,$httpProvider,$parseProvider,$locationProvider) {
    $routeProvider.
        when('/main', {
            templateUrl: 'search.html',
            controller:  'controllers.SearchView'
        })
        .when('/auth', {
            templateUrl: 'auth.html',
            controller:  'controllers.AuthView'
        })
        .when('/admin', {
            templateUrl: 'admin.html',
            controller:  'controllers.AdminView'
        })

        .when('/search/:num', {
            templateUrl: 'checkout.html',
            controller:  'controllers.CheckoutView'
        })

        .when('/subscribe/:num', {
            templateUrl: 'subscribe.html',
            controller:  'controllers.SubsView'
        })

        // If VK follow is OK - redirect here 
        .when('/vk_success', {
            templateUrl: 'success.html',     // using same html template as /success route!
            controller:  'controllers.VkSuccessView'
        })

        // Robokassa will redirect user on Success here
        .when('/payment', {
            templateUrl: 'payment.html',
            controller:  'controllers.SuccessView'
        })

        .when('/success', {
            templateUrl: 'success.html',
            controller:  'controllers.SuccessView'
        })

        // Robokassa will redirect user on Failure here:
        .when('/failure', {
            templateUrl: 'failure.html',
            controller:  'controllers.SearchView'
        })

        // TODO: make different page?
        .when('/result_error', {
            templateUrl: 'failure.html',
            controller:  'controllers.SearchView'
        })
        .otherwise({
            redirectTo:'/main'
    });

    // This fixes the 'Breaking change' during Angular 1.1->1.2 upgrade. Shit!
    //$parseProvider.unwrapPromises(true);

    $httpProvider.interceptors.push('authInterceptor');
});

angular.module('adaperio').run(function($rootScope,$location,$window) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    // whenever route changes -> handle it
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {

        if((next.templateUrl==="admin.html") && (!$window.sessionStorage.token)){
            $location.path('/auth');
        }

        if((next.templateUrl==="auth.html") && ($window.sessionStorage.token)){
            $location.path('/admin');
        }
    });

});

