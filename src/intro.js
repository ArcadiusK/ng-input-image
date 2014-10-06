(function (angular, factory) {
    'use strict';
    if (typeof module !== 'undefined' && module.exports) {

    } else if (typeof define === 'function' && define.amd) {
        define(['angular'], function (angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(window.angular || null, function (angular) {
    'use strict';
