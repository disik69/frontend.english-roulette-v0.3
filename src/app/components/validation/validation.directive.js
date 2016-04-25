(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .directive('uniqueEmail', uniqueEmail)
        .directive('repeatedPassword', repeatedPassword);

    /** @ngInject */
    function uniqueEmail($http, backendUrl, $log, preloader)
    {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {
                controller.$parsers.unshift(
                    function (email) {
                        if (email && /^.+@(\w([\w-]*\w)?\.)+\w+$/.test(email)) {
                            preloader.off();

                            $http({
                                method: 'GET',
                                url: backendUrl + '/check-email' + (attrs.uniqueEmail ? '/' + attrs.uniqueEmail : ''),
                                params: {
                                    email: email
                                }
                            }).then(
                                    function () {
                                        controller.$setValidity('unique-email', true);
                                    },
                                    function () {
                                        controller.$setValidity('unique-email', false);
                                    }
                            );
                        } else {
                            controller.$setValidity('unique-email', false);
                        }

                        return email;
                    }
                );
            }
        };
    }

    /** @ngInject */
    function repeatedPassword($log)
    {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, controller) {
                controller.$parsers.unshift(
                    function (repeatedPassword) {
                        if (repeatedPassword && repeatedPassword === scope.$eval(attrs.repeatedPassword)) {
                            controller.$setValidity('repeated-password', true);
                        } else {
                            controller.$setValidity('repeated-password', false);
                        }

                        return repeatedPassword;
                    }
                );

                scope.$watch(attrs.repeatedPassword, function (password) {
                    if (password && password === controller.$modelValue) {
                        controller.$setValidity('repeated-password', true);
                    } else {
                        controller.$setValidity('repeated-password', false);
                    }
                });
            }
        };
    }
})();