'use strict';

app.directive('uploadImage', function () {

    var templates = {
        /* jshint multistr: true */
        normal: '<div class="row">' +
                    '    <div class="col-md-16">                                                                                           ' +
                    '        <upload-button></upload-button>                                                                              ' +
                    '    </div>                                                                                                           ' +
                    '    <div class="col-md-16">                                                                                          ' +
                    '        <uploadimage-error ng-if="errorUpload" size="3"></uploadimage-error>                                         ' +
                    '    </div>                                                                                                           ' +
                    '    <div class="col-md-16 file-upload" ng-if="uploaderImages.queue.length > 0">                                      ' +
                    '        <div class="table-responsive">                                                                               ' +
                    '            <table class="table">                                                                                    ' +
                    '                <thead>                                                                                              ' +
                    '                    <tr>                                                                                             ' +
                    '                        <th width="50%">Nome</th>                                                                    ' +
                    '                        <th ng-show="uploaderImages.isHTML5">Tamanho</th>                                            ' +
                    '                        <th ng-show="uploaderImages.isHTML5" class="text-center">Imagem</th>                         ' +
                    '                    </tr>                                                                                            ' +
                    '                </thead>                                                                                             ' +
                    '                <tbody>                                                                                              ' +
                    '                    <tr ng-repeat="item in uploaderImages.queue">                                                    ' +
                    '                        <td><strong>{{ item.file.name }}</strong></td>                                               ' +
                    '                        <td ng-show="uploaderImages.isHTML5" nowrap>{{ item.file.size/1024/1024|number:2 }} MB</td>  ' +
                    '                        <td class="text-center">                                                                     ' +
                    '                            <div ng-show="uploaderImages.isHTML5" ng-thumb="{ file: item._file, height: 100 }"></div>' +
                    '                        </td>' +
                    '                    </tr>' +
                    '                </tbody>' +
                    '            </table>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>',
        profile: '<div class="row">' +
                    '    <div class="profile-pic" ng-if="uploaderImages.queue.length > 0">                                      ' +
                    '        <div ng-repeat="item in uploaderImages.queue" ng-show="uploaderImages.isHTML5" ng-thumb="{ file: item._file, height: 300 }" class="img-responsive img-circle"></div>                   ' +
                    '    </div><br/>' +
                    '    <upload-button template="profile"></upload-button>                                                                                           ' +
                    '    <div class="profile-pic">                                                                                           ' +
                    '        <uploadimage-error ng-if="errorUpload" size="3"></uploadimage-error>                                         ' +
                    '    </div>                                                                                                           ' +
                    '</div>',
        publication: '<div class="row">' +
                 '    <div class="publication-pic" ng-if="uploaderImages.queue.length > 0">                                      ' +
                 '        <div ng-repeat="item in uploaderImages.queue" ng-show="uploaderImages.isHTML5" ng-thumb="{ file: item._file, height: 300 }" class="img-responsive center-block"></div>                   ' +
                 '    </div><br/>' +
                 '    <upload-button template="publication"></upload-button>                                                                                           ' +
                 '    <div class="publication-pic">                                                                                           ' +
                 '        <uploadimage-error ng-if="errorUpload" size="3"></uploadimage-error>                                         ' +
                 '    </div>                                                                                                           ' +
                 '</div>',

    };

    return {
        restrict: 'E',
        scope: {
            controller: '@controller',
            action: '@action',
            callbackAfterAddingFile: '&callBackAfterAddingFile',
            callbackCompleteItem: '&callbackCompleteItem',
            callback: '&callback',
            uploaderImages: '=uploaderImages'
        },
        template: function (elem, attrs) {
            var temp = templates.normal;
            if (attrs.template == 'profile')
                temp = templates.profile;
            if (attrs.template == 'publication')
                temp = templates.publication;
            return temp;
        },
        controller: ['$scope', 'FileUploader', 'UrlService', function ($scope, FileUploader, UrlService) {
            /* Upload */
            $scope.uploaderImages = ($scope.uploaderImages) ? $scope.uploaderImages : new FileUploader({});

            $scope.uploaderImages.filters.push({
                name: 'imageFilter',
                fn: function (item/*{File|FileLikeObject}*/, options) {
                    return (item.type === "image/jpeg"
                        || item.type == 'image/png'
                        || item.type == 'image/jpg'
                        || item.type == 'image/gif')
                        && item.size < 2097152;
                }
            });

            $scope.uploaderImages.onWhenAddingFileFailed = function () {
                $scope.uploaderImages.queue = [];
                $scope.errorUpload = true;
                if ($scope.callbackWhenAddingFileFailed) $scope.callbackWhenAddingFileFailed();
            };

            $scope.uploaderImages.onAfterAddingFile = function (fileItem) {
                fileItem.url = UrlService.getAPIAction($scope.controller, $scope.action);
                $scope.uploaderImages.queue = [];
                $scope.uploaderImages.queue.push(fileItem);
                $scope.errorUpload = false;
                if ($scope.callback) $scope.callback({ mustBeTheSame: $scope.uploaderImages });
            }

            $scope.uploaderImages.onCompleteItem = function (fileItem) {
                if ($scope.callbackCompleteItem) $scope.callbackCompleteItem({ mustBeTheSame: $scope.uploaderImages });
            }
        }]
    }
});

app.directive('uploadFile', function () {

    var templates = {
        normal: '<div class="row">' +
            '    <div class="col-md-16">                                                                                           ' +
            '        <upload-button template="file"></upload-button>                                                                              ' +
            '    </div>                                                                                                           ' +
            '    <div class="col-md-16">                                                                                          ' +
            '        <upload-file-error ng-if="errorUpload" size="3"></upload-file-error>                                         ' +
            '    </div>                                                                                                           ' +
            '    <div class="col-md-16 file-upload" ng-if="uploaderFiles.queue.length > 0">                                      ' +
            '        <div class="table-responsive">                                                                               ' +
            '            <table class="table">                                                                                    ' +
            '                <thead>                                                                                              ' +
            '                    <tr>                                                                                             ' +
            '                        <th width="50%">Nome</th>                                                                    ' +
            '                        <th ng-show="uploaderFiles.isHTML5">Tamanho</th>                                            ' +
            '                    </tr>                                                                                            ' +
            '                </thead>                                                                                             ' +
            '                <tbody>                                                                                              ' +
            '                    <tr ng-repeat="item in uploaderFiles.queue">                                                    ' +
            '                        <td><strong>{{ item.file.name }}</strong></td>                                               ' +
            '                        <td ng-show="uploaderFiles.isHTML5" nowrap>{{ item.file.size/1024/1024|number:2 }} MB</td>  ' +
            '                    </tr>' +
            '                </tbody>' +
            '            </table>' +
            '        </div>' +
            '    </div>' +
            '</div>',
    };

    return {
        restrict: 'E',
        scope: {
            controller: '@controller',
            action: '@action',
            callbackAfterAddingFile: '&callBackAfterAddingFile',
            callback: '&callback'
        },
        template: function (elem, attrs) {
            var temp = templates.normal;
            if (attrs.template == 'profile')
                temp = templates.profile;
            return temp;
        },
        controller: ['$scope', 'FileUploader', 'UrlService', function ($scope, FileUploader, UrlService) {
            /* Upload */
            $scope.uploaderFiles = new FileUploader({});

            $scope.uploaderFiles.filters.push({
                name: 'fileFilter',
                fn: function (item/*{File|FileLikeObject}*/, options) {
                    return (item.type === 'application/pdf' //pdf
                        || item.type == 'application/msword'//doc
                        || item.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' //docx
                        )
                        && item.size < 2097152;
                }
            });

            $scope.uploaderFiles.onWhenAddingFileFailed = function () {
                $scope.uploaderFiles.queue = [];
                $scope.errorUpload = true;
                if ($scope.callbackWhenAddingFileFailed) $scope.callbackWhenAddingFileFailed();
            };

            $scope.uploaderFiles.onAfterAddingFile = function (fileItem) {
                fileItem.url = UrlService.getAPIAction($scope.controller, $scope.action);
                $scope.uploaderFiles.queue = [];
                $scope.uploaderFiles.queue.push(fileItem);
                $scope.errorUpload = false;
                if ($scope.callback) $scope.callback({ mustBeTheSame: $scope.uploaderFiles });
            }
        }]
    }
});

app.directive("uploadButton", function () {
    var templates = {
        normal: '<div ng-class="{\'btn-group\':uploaderImages.queue.length > 0}"><button type="button" class="btn btn-primary btn-o btn-file">Selecionar imagem</button>' +
                  '<input type="file" accept="image/*" nv-file-select="" id="upload" uploader="uploaderImages" style="display: none" />' +
                '<button type="button" class="btn btn-danger btn-o" ng-if="uploaderImages.queue.length > 0"  ng-click="uploaderImages.queue = []">Cancelar</button></div>',
        profile: '<a href="#" class="text-center btn-file">Trocar foto</a>' +
                  '<input type="file" accept="image/*" nv-file-select="" id="upload" uploader="uploaderImages" style="display: none" />',
        publication: '<a href="#" class="text-center btn-file">Trocar foto</a>' +
                '<input type="file" accept="image/*" nv-file-select="" id="upload" uploader="uploaderImages" style="display: none" />',     
        file: '<div ng-class="{\'btn-group\':uploaderFiles.queue.length > 0}"><button type="button" class="btn btn-primary btn-o btn-file">Selecione o arquivo</button>' +
                  '<input type="file" accept="application/*" nv-file-select="" id="upload" uploader="uploaderFiles" style="display: none" />' +
                '<button type="button" class="btn btn-danger btn-o" ng-if="uploaderFiles.queue.length > 0"  ng-click="uploaderFiles.queue = []">Cancelar</button></div>',
    };
    return {
        restrict: 'E',
        template: function (elem, attrs) {
            var temp = templates.normal;
            if (attrs.template == 'profile')
                temp = templates.profile;
            if (attrs.template == 'publication')
                temp = templates.publication;
            if (attrs.template == 'file')
                temp = templates.file;
            return temp;
        },
        link: function (scope, element) {
            angular.element('.btn-file').bind('click', function (e) {
                angular.element(e.target).siblings('#upload').trigger('click');
            });
        }
    }
});

app.directive("uploadFileError", function () {
    return {
        restrict: 'E',
        scope: {
            size: '@',
        },
        link: function (scope, element) {
            scope.maxSize = element.size;
        },
        template: "<div class=\"text-danger\">" +
                       "Somente arquivos *.pdf, *.doc e *.docx são válidos." +
                       "<br />" +
                       "Tamanho máximo do arquivo: {{size}} MB." +
                   "</div>",
    }
});

app.directive("uploadimageError", function () {
    return {
        restrict: 'E',
        scope: {
            size: '@',
        },
        link: function (scope, element) {
            scope.maxSize = element.size;
        },
        template: "<div class=\"text-danger\">" +
                       "Somente arquivos *.jpg, *.jpeg, *.gif e *.png são válidos." +
                       "<br />" +
                       "Tamanho máximo do arquivo: {{size}} MB." +
                   "</div>",
    }
});
