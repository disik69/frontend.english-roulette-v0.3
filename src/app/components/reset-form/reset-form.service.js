(function () {
    'use strict';

    angular.module('frontendEnglishRouletteV03')
        .factory('resetForm', resetForm);

    /** @ngInject */
    function resetForm()
    {
        return function (form) {
            for (var fieldIndex in form) {
                if (fieldIndex.indexOf('$') != 0) {
                    form[fieldIndex].$modelValue = null;
                    form[fieldIndex].$$writeModelToScope();
                }
            }

            window[form.$name].reset();
            form.$setPristine();
        };
    }
})();

