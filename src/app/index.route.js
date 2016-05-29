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
                        return porter('guest')
                    }
                }
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'app/signin/signin.html',
                controller: 'SigninController',
                resolve: {
                    porter: function (porter) {
                        return porter('guest')
                    }
                }
            })
            .state('dictionary', {
                url: '/',
                templateUrl: 'app/dictionary/dictionary.html',
                controller: 'DictionaryController',
                resolve: {
                     porter: function (porter) {
                         return porter('user');
                     }
                }
            })
            .state('config', {
                url: '/config',
                templateUrl: 'app/config/config.html',
                controller: 'ConfigController',
                resolve: {
                     porter: function (porter) {
                         return porter('user');
                     }
                }
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminController',
                resolve: {
                     porter: function (porter) {
                         return porter('admin');
                     }
                }
            })
            .state('foreign-native', {
                url: '/foreign-native',
                templateUrl: 'app/lesson/lesson.foreign-native.html',
                controller: 'LessonForeignNativeController',
                resolve: {
                     porter: function (porter) {
                         return porter('user');
                     }
                }
            })
            .state('native-foreign', {
                url: '/native-foreign',
                templateUrl: 'app/lesson/lesson.native-foreign.html',
                controller: 'LessonNativeForeignController',
                resolve: {
                     porter: function (porter) {
                         return porter('user');
                     }
                }
            })
            .state('repetition', {
                url: '/repetition',
                templateUrl: 'app/lesson/lesson.native-foreign.html',
                controller: 'LessonNativeForeignController',
                resolve: {
                     porter: function (porter) {
                         return porter('user');
                     }
                }
            });

        $urlRouterProvider.otherwise('/');
    }
})();
