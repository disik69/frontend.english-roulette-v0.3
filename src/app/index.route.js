(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider)
    {
        $stateProvider
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/signup/signup.html',
                controller: 'SignupController',
                controllerAs: 'signup'
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'app/signin/signin.html',
                controller: 'SinginController',
                controllerAs: 'signin'
            })
            .state('dictionary', {
                url: '/',
                templateUrl: 'app/dictionary/dictionary.html',
                controller: 'DictionaryController',
                controllerAs: 'dictionary',
                resolve: {
                     greeting: function($q, $timeout){
                         var deferred = $q.defer();
                         $timeout(function() {
                             deferred.reject('Hello!');
                         }, 2000);
                         return deferred.promise;
                     }
                }
            });

        $urlRouterProvider.otherwise('/');
    }
})();
