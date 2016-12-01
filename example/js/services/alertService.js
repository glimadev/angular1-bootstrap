(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('AlertService',
        ['SweetAlert',
        function (SweetAlert) {

            return {
                confirm: function (title, message, callback, btnSuccess, btnCancel, type, callbackCancel) {
                    swal({
                        title: title,
                        text: message,
                        type: type || "warning",
                        confirmButtonText: btnSuccess || "Sim",
                        cancelButtonClass: "btn-danger",
                        cancelButtonText: btnCancel || "Cancelar",
                        closeOnConfirm: true,
                        showCancelButton: true,
                    },
                    function (isConfirm) {
                        isConfirm ? callback() : callbackCancel ? callbackCancel() : null;
                    });
                },
                confirmMessages: function (mainTitle, mainMessage, callback, btnSuccess, btnCancel, type, customClass) {
                    swal({
                        html: true,
                        title: mainTitle,
                        text: mainMessage,
                        type: type || "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-success",
                        cancelButtonClass: "btn-danger",
                        confirmButtonText: btnSuccess || "Sucesso",
                        cancelButtonText: btnCancel || "Cancelar",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        customClass: customClass
                    },
                    function (isConfirm) {
                        callback();
                    });
                },
                error: function (title, message) {
                    swal({
                        title: title,
                        text: message,
                        type: "error",
                    });
                },
                basicMessage: function (message) {
                    swal("", message);
                },
                messageClick: function (title, message) {
                    swal({
                        title: title,
                        text: message,
                        type: 'info',
                        closeOnConfirm: false,
                    });
                },
                message: function (title, message) {
                    swal(title, message);
                },
                iconMessage: function (title, message, icon) {
                    swal({
                        title: title,
                        text: message,
                        imageUrl: icon
                    });
                }
            };
        }]);

}(angular, vitali));