'use strict';

app.directive('countDown', ['DateService',
    function (DateService) {
        var intervals = [];
        var timer = 1000;
        var formatted = "";
        var clearIntervals = function () {
            var i = intervals;

            i.forEach(function (id, index) {
                clearInterval(id);
                intervals.splice(index, 1);
            });
        }

        var getHoursAndMinutes = function (diff) {
            for (var days = 0; diff.milliseconds >= 86400000; days++, diff.milliseconds -= 86400000);

            diff.hours = parseInt(diff.milliseconds / 3600000);
            diff.minutes = parseInt(diff.milliseconds / 60000) - diff.hours * 60;

            var minutes = (diff.minutes > 0) ? diff.minutes + "min" : "";
            var hours = (diff.hours > 0) ? diff.hours + "h" : "";

            return hours + " " + minutes;
        };

        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {

                ctrl.$formatters.push(function (date) {
                    date = (!date) ? "" : new String(date);
                    countDown(date);
                });

                function countDown(date) {
                    if (date) {
                        var refreshId = setInterval(function () {
                            var now = new Date();

                            var finish = DateService.dateJsonToDateHtml5(date);

                            var diff = DateService.DateDiff(finish, now);

                            if (diff) {

                                //if (diff.months > 1) {
                                //    formatted = diff.months + " meses";
                                //}
                                //else if (diff.weeks > 1) {
                                //    formatted = diff.weeks + " semanas";
                                //}
                                if (diff.days >= 2) {
                                    var hours = getHoursAndMinutes(diff);

                                    formatted = diff.days + " dias e " + hours;
                                }
                                else if (diff.minutes <= 0 && diff.seconds > 0) {
                                    formatted = diff.seconds + " segundos";
                                }
                                else {
                                    var minutes = (diff.minutes > 0) ? diff.minutes + "min" : "";
                                    var hours = (diff.hours > 0) ? diff.hours + "h" : "";
                                    formatted = hours + " " + minutes;
                                }
                            } else {
                                formatted = "expirado";
                            }

                            element.html(formatted);

                        }, timer);
                    }
                }
            }
        };
    }]);