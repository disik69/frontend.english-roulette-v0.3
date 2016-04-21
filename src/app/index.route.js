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
                resolve: {
                    porter: function (porter) {
                        return porter.get('guest')
                    }
                }
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'app/signin/signin.html',
                controller: 'SigninController',
                resolve: {
                    porter: function (porter) {
                        return porter.get('guest')
                    }
                }
            })
            .state('dictionary', {
                url: '/',
                templateUrl: 'app/dictionary/dictionary.html',
                controller: 'DictionaryController',
                resolve: {
                     porter: function (porter) {
                         return porter.get('user');
                     }
                }
            })
            .state('foreign-native', {
                url: '/foreign-native',
                templateUrl: 'app/lesson/lesson.html',
                controller: 'LessonController',
                resolve: {
                     porter: function (porter) {
                         return porter.get('user');
                     }
                }
            })
            .state('native-foreign', {
                url: '/native-foreign',
                templateUrl: 'app/lesson/lesson.html',
                controller: 'LessonController',
                resolve: {
                     porter: function (porter) {
                         return porter.get('user');
                     }
                }
            })
            .state('repetition', {
                url: '/repetition',
                templateUrl: 'app/lesson/lesson.html',
                controller: 'LessonController',
                resolve: {
                     porter: function (porter) {
                         return porter.get('user');
                     }
                }
            });

        $urlRouterProvider.otherwise('/');
    }
})();
