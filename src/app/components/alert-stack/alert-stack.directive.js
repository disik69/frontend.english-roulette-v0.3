(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .directive('alertStack', alertStack);

    /** @ngInject */
    function alertStack()
    {
        return {
            template: '<uib-alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)" dismiss-on-timeout="3000">{{alert.msg}}</uib-alert>'
        };
    }
})();
