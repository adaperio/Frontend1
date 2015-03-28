
// This service is used as a HTTP/HTTPS interceptor to inject Auth header
angular.module('adaperio.services').factory('authInterceptor',
    function ($rootScope, $q, $window) {
        return {
            request: function (config) {
                config.headers = config.headers || {};

                if($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }

                return config;
            },

            response: function (response) {
                if(response.status === 401) {
                    // TODO: handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            }
        };
    }
);

// these methods require authentication
angular.module('adaperio.services').factory('services.AdminApi',[
    '$q',
    '$http',
    'services.transformer.ApiTransformer',
    'services.Helpers',

    function ($q, $http, apiTransformer, helpers ){
        return {
            doLogin: function(loginData,cb,cbError){
                $http({
                    method:"POST",
                    data: loginData,
                    url: "http://api.adaperio.ru:8080/authenticate"
                })
                    .success(function (data, status, headers, config) {
                        cb(data);
                    })
                    .error(function (data, status, headers, config) {
                        cbError(data);
                    });
            },

            getCar: function(num,cb){
                var url = helpers.convertNumberToUrlGetCar(num);

                console.log('-->Asking backend for link: ' + url);

                $http({
                    method:"GET",
                    data: '',
                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(data);
                    })
                    .error(function (data, status, headers, config) {
                        cb(null);
                    });
            }

        };
    }
]);

angular.module('adaperio.services').factory('services.Api',[
    '$q',
    '$http',
    'services.transformer.ApiTransformer',
    'services.Helpers',

    function ($q, $http, apiTransformer, helpers ){
        return {
            checkIfCarExists: function(num,cb){
                var url = helpers.convertNumberToUrlCheckCar(num);

                $http({
                    method:"GET",
                    data: '',
                    url: url
                })
                .success(function (data, status, headers, config) {
                    cb(null,true,data);
                })
                .error(function (data, status, headers, config) {
                    cb(new Error("Check can not be completed"),false);
                });
            },

            createNewOrder: function(userEmail,num,cb){
                $http({
                    method:"POST",
                    data: { num:num,
                            email:userEmail
                          },
                    url: "http://api.adaperio.ru:8080/v1/orders"
                })
                    .success(function (data, status, headers, config) {
                        cb(null,
                            data.id,
                            data.sig);
                    })
                    .error(function (data, status, headers, config) {
                        cb(new Error("Can not create new order"));
                    });
            },

            getOrderResult: function(sum,invId,sig,cb){
                var urlMethod = "http://api.adaperio.ru:8080/v1/car_by_order/" + invId + "?signature=" + sig;

                $http({
                    method:"GET",
                    url: urlMethod
                })
                    .success(function (data, status, headers, config) {
                        var links = [];

                        if(data.docs.length){
                            links = data.docs.slice();     // copy array
                        }

                        cb(null,data,links,data.milleage,data.taxiData);
                    })
                    .error(function (data, status, headers, config) {
                        cb(new Error("Can not return order result"));
                    });
            },

            getDataByFollow: function(num,userId,sid,sig,cb){
                var urlMethod = "http://api.adaperio.ru:8080/v1/car_by_vk_follow/" + userId + "?num=" + num + 
                    "&sid=" + sid + "&sig=" + sig;

                $http({
                    method:"GET",
                    url: urlMethod
                })
                    .success(function (data, status, headers, config) {
                        var links = [];

                        if(data.docs.length){
                            links = data.docs.slice();     // copy array
                        }

                        cb(null,links,data.milleage,data.taxiData);
                    })
                    .error(function (data, status, headers, config) {
                        cb(new Error("Can not return order result"));
                    });
            },

            subscribeForNews: function(userEmail,num,cb){
			 var url = "http://api.adaperio.ru:8080/v1/subscribeForCar/" + num + "?email=" + userEmail;

                $http({
                    method:"POST",
                    data: {
                          },
                    url: url
                })
                    .success(function (data, status, headers, config) {
				    cb(null,data.status);
                    })
                    .error(function (data, status, headers, config) {
                        cb(new Error("Can not subscribe for news"));
                    });
            },

            showSpinner: function(enable,htmlElementId){
                 var opts = {
                      lines: 12, // The number of lines to draw
                      length: 7, // The length of each line
                      width: 3, // The line thickness
                      radius: 10, // The radius of the inner circle
                      corners: 1, // Corner roundness (0..1)
                      rotate: 0, // The rotation offset
                      direction: 1, // 1: clockwise, -1: counterclockwise
                      color: '#000', // #rgb or #rrggbb or array of colors
                      speed: 1, // Rounds per second
                      trail: 60, // Afterglow percentage
                      shadow: false, // Whether to render a shadow
                      hwaccel: false, // Whether to use hardware acceleration
                      className: 'spinner', // The CSS class to assign to the spinner
                      zIndex: 2e9, // The z-index (defaults to 2000000000)
                      top: '50%', // Top position relative to parent
                      left: '50%' // Left position relative to parent
                 };

                 var target = document.getElementById(htmlElementId);
                 var spinner = new Spinner(opts).spin(target);

                 if(!enable){
                    spinner.stop();
                 }
            },

        };
    }
]);
