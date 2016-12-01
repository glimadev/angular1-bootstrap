(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('DateService',
        ['$http',
        function ($http) {

            function dateToUTC (date) {
                return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            }

            return {
                // '/Date(1224043200000)/' to '2016-05-11T18:46:19Z'
                dateJsonToDateHtml5: function (jsonDate, not_utc) {
                    if (jsonDate) {
                        var re = /-?\d+/;
                        var m = re.exec(jsonDate);
                        var date = new Date(parseInt(m[0]));
                        if (not_utc) {
                            return date;
                        }
                        var now_utc = dateToUTC(date);
                        return now_utc;
                    } else {
                        return jsonDate;
                    }
                },
                toUTC: function (date) {
                    return dateToUTC(date);
                },
                DateDiff: function (date1, date2) {

                    var ms = date1 - date2;

                    if (date1.getTime() > date2.getTime() && ms > 2000) {

                        var diff = {};

                        diff.years = parseInt(ms / 31536000000);
                        diff.months = parseInt(ms / 2628000000);
                        diff.weeks = parseInt(ms / 604800000);
                        diff.days = parseInt(ms / 86400000);
                        diff.hours = parseInt(ms / 3600000);
                        diff.minutes = parseInt(ms / 60000) - diff.hours * 60;
                        diff.seconds = parseInt(ms / 1000) - diff.hours * 60 * 60;
                        //for (diff.years = 0; ms >= 31536000000; diff.years++, ms -= 31536000000);
                        //for (diff.months = 0; ms >= 2628000000; diff.months++, ms -= 2628000000);
                        //for (diff.weeks = 0; ms >= 604800000; diff.weeks++, ms -= 604800000);
                        //for (diff.days = 0; ms >= 86400000; diff.days++, ms -= 86400000);
                        //for (diff.hours = 0; ms >= 3600000; diff.hours++, ms -= 3600000);
                        //for (diff.minutes = 0; ms >= 60000; diff.minutes++, ms -= 60000);
                        //for (diff.seconds = 0; ms >= 1000; diff.seconds++, ms -= 1000);

                        diff.milliseconds = ms;

                        return diff;
                    } else {
                        return null;
                    }
                }
            };
        }]);
}(angular, vitali));