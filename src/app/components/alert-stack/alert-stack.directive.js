(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .directive('alertStack', alertStack);

    /** @ngInject */
    function alertStack()
    {
        return {
            template: '<uib-alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</uib-alert>'
        };
    }
})();
