(function () {
    'use strict';
    app.directive('clipChat', ['DateService', 'AlertService', function (DateService, AlertService) {

        var chatTemplateAlugaria = '<div class="messages-date" ng-repeat-start="message in newChatArray() | orderBy:\'date | dateFilterUTC\'" ng-if="displayDate($index) || $index == 0">{{message.date | dateFilter | date:\'EEEE, MMM dd, HH:mm\' : \'UTC\'}}</div>'
                                    + '<div class="bubble" ng-class="{\'you\' : message.idUser == idSelf, \'me\' : message.idUser !== idSelf, \'nextSame\': newChatArray()[$index+1].idUser == message.idUser && !nextDate($index), \'bubble-hover\':hovering}" ng-mouseenter="hovering=true" ng-mouseleave="hovering=false" ng-repeat-end>'
                                    + '<div class="bubble-txt bubble-txt-personalized" ng-if="message.active">'
                                    + '     <button class="trash btn btn-xs" type="button" ng-click="deleteMessage(message)" ng-if="message.idUser !== idSelf && message.active"><i class="fa fa-trash"></i></button>'
                                    + '     <div ng-bind-html="message.content"></div>'
                                    + '     <chat-uploaded ng-if="message.isUpload" path="message.fileName" template="message.mediaType" extension="message.extension"></chat-uploaded>'
                                    + '     <div ng-if="message.isUploader && uploader.isHTML5 && uploader.queue[0].type.indexOf(\'image\') >= 0" ng-thumb="{ file: uploader.queue[0]._file, height: 100 }"></div>'
                                    + '     <div ng-if="message.isUploader && uploader.isHTML5" class="progress progress-xs margin-bottom-0">'
									+ '         <div class="progress-bar" role="progressbar" ng-style="{ \'width\': uploader.queue[0].progress + \'%\' }"></div>'
									+ '     </div>'
                                    + '</div>'
                                    + '<div class="bubble-txt bubble-txt-personalized" ng-if="!message.active">'
                                    + '     Conte&utilde;do removido'
                                    + '</div>'
                                    + '<span class="time">{{message.date | dateFilter | date:\'HH:mm\' : \'UTC\'}}</span>'
                                    + '<audio controls autoplay style="display:none" ng-if="message.notify && !message.messageId">'
                                    + '<source ng-src="../Areas/Website/Content/res/notification.mp3" type="audio/mp3">'
                                    + 'Your browser does not support the audio element.'
                                    + '</audio>'
                                    + '</div>';
        return {
            restrict: 'EA',
            template: chatTemplateAlugaria,
            scope: {
                messages: "=",
                idSelf: "=",
                idOther: "=",
                uploader: "=",
                deleteFn: "="
            },
            link: function ($scope, $element, $attrs) {
                $scope.$watch('messages.length', function () {
                    $scope.newChatArray();
                }, true);

                $scope.deleteMessage = function (message) {
                    AlertService.confirm("Tem certeza?", "Deseja deletar a mensagem?", function () {
                        message.content = "<i>Conte&utilde;do removido</i>";
                        message.isUpload = false;
                        message.active = true;
                        $scope.deleteFn(message);
                    });
                };

                $scope.newChatArray = function () {
                    var filtered = [];
                    for (var i = 0; i < $scope.messages.length; i++) {
                        var item = $scope.messages[i];
                        if ((item.idUser == $scope.idSelf || item.idOther == $scope.idSelf) && (item.idUser == $scope.idOther || item.idOther == $scope.idOther)) {
                            filtered.push(item);
                        }
                    }

                    return filtered;
                };

                $scope.displayDate = function (i) {
                    var prevDate, nextDate, diffMs, diffMins;
                    var messages = $scope.newChatArray();
                    if (i === 0) {


                        if (messages.length > 1) {
                            prevDate = DateService.dateJsonToDateHtml5(messages[i].date);
                            nextDate = DateService.dateJsonToDateHtml5(messages[i + 1].date);
                            diffMs = (nextDate - prevDate);
                            diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                        } else {
                            return true
                        }
                    } else {
                        prevDate = DateService.dateJsonToDateHtml5(messages[i - 1].date);
                        nextDate = DateService.dateJsonToDateHtml5(messages[i].date);
                        diffMs = (nextDate - prevDate);
                        diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

                    }
                    if (diffMins > 1) {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.nextDate = function (i) {
                    var prevDate, nextDate, diffMs, diffMins;
                    var messages = $scope.newChatArray();
                    if (i < messages.length - 1) {

                        prevDate = DateService.dateJsonToDateHtml5(messages[i].date);
                        nextDate = DateService.dateJsonToDateHtml5(messages[i + 1].date);
                        diffMs = (nextDate - prevDate);
                        diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

                    }
                    if (diffMins > 1) {
                        return true;
                    } else {
                        return false;
                    }
                };
            }
        };
    }]);

    app.directive('chatSubmit', function () {

        var submitTemplateAlugaria = '<form ng-submit="submitChat()">'
            + '<div class="write-wrapper">'
            + '<div class="write">'
            + '<input type="text" placeholder="Digite uma mensagem.." ng-model="ngModel" /><a href="#" class="write-link send link ng-scope" ng-click="submitChat()"></a>'
            + '</div>' + '</div>' + '</form>';

        return {
            restrict: 'EA',
            template: submitTemplateAlugaria,
            replace: true,
            scope: {
                submitFunction: "=",
                ngModel: "="
            },
            link: function ($scope, $element, $attrs) {

                $scope.submitChat = function () {
                    $scope.submitFunction($scope.ngModel);
                    $scope.ngModel = null;

                    if (typeof $attrs.scrollElement !== "undefined") {
                        var scrlEl = angular.element($attrs.scrollElement);
                        var lastElement = scrlEl.find('.discussion > li:last');
                        if (lastElement.length)
                            scrlEl.scrollToElementAnimated(lastElement);
                    }
                };
            }
        };
    });

    app.directive('chatUploaded', ['$compile', function ($compile) {

        var videoTemplate = '  <video width="320" height="240" controls>'
                                + '<source ng-src="{{path}}" type="video/{{extension}}">'
                                + 'Your browser does not support the video element.'
                            + '</video>';

        var imageTemplate = '<img ng-src="{{path}}" width="320" height="240"/>';

        var soundTemplate = '  <audio controls>'
                                + '<source ng-src="{{path}}" type="audio/{{extension}}">'
                                + 'Your browser does not support the audio element.'
                            + '</audio>';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                path: "=",
                extension: "=",
                template: "="
            },
            link: function (scope, element) {
                var temp = imageTemplate;

                if (scope.template.indexOf('video') >= 0)
                    temp = videoTemplate;

                if (scope.template.indexOf('audio') >= 0)
                    temp = soundTemplate;

                element.html(temp);

                $compile(element.contents())(scope);
            }
        };
    }]);
})();
