function picker() {
    'use strict';
    return (function () {
        // our total amount of drinkers
        var drinkers = [],
            getRemainingDrinkers = function () {
                var drinkers_left = [];
                Object.keys(drinkers).forEach(function (key, index) {
                    if (drinkers[key]) {
                        drinkers_left.push(key);
                    }
                });
                return drinkers_left;
            },
            getRandom = function () {
                var drinkers_left = getRemainingDrinkers();
                return (drinkers_left.length === 0) ? false : drinkers_left[Math.floor(Math.random() * drinkers_left.length)];
            };
        return {
            addDrinker: function (drinker) {
                drinkers[drinker.name] = true;
                return drinkers;
            },
            removeDrinker : function (name) {
                delete drinkers[name];
                return drinkers;
            },
            resetDrinkers: function () {
                Object.keys(drinkers).forEach(function (key, index) {
                    drinkers[key] = true;
                });
                return drinkers;
            },
            getDrinkers: function () {
                return drinkers;
            },
            getRemainingDrinkers: function () {
                return getRemainingDrinkers();
            },
            getMaker: function () {
                var maker = getRandom();
                return !maker ? "No makers left" : maker;
            },
            drinkerCan: function (name) {
                drinkers[name] = false;
            },
            drinkerCant: function () {
            }
        };
    })();
}
