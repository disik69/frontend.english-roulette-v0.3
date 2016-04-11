(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .directive('globalDropdownMenu', globalDropdownMenu);

    /** @ngInject */
    function globalDropdownMenu($compile, $log, $rootScope)
    {
        return {
            scope: {},
            link: function (scope, element, attrs) {
                var enabledCollapseCycle = true;

                scope.collapsed = true;

                scope.switchCollapse = function () {
                    enabledCollapseCycle = false;
                    scope.collapsed = ! scope.collapsed;
                };

                $rootScope.$on(attrs.globalDropdownMenu, function () {
                    if (enabledCollapseCycle) {
                        scope.collapsed = true;
                    } else {
                        enabledCollapseCycle = true;
                    }
                });

                scope.doExpanding = function () {
                    element.addClass('open');
                };

                scope.doCollapsed = function () {
                    element.removeClass('open');
                };

                element.find('.dropdown-toggle').attr('ng-click', 'switchCollapse()');

                var dropdownMenu = element.find('.dropdown-menu');

                dropdownMenu.attr('uib-collapse', 'collapsed');
                dropdownMenu.attr('expanding', 'doExpanding()');
                dropdownMenu.attr('collapsed', 'doCollapsed()');

                $compile(element.children())(scope);
            }
        };
    }
})();