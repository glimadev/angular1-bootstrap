(function (angular, vitali) {
    'use strict';
    angular.module(vitali.modules.core.name).factory('HubService',
        ['UserLoggedService', 'Hub',
        function (UserLoggedService, Hub) {
            //callbacks
            var _callbacks = { connected: null, send: null, sendUpload: null, deletedMessage: null, newUser: null, hub: null, connectionId: null, pushNotification: null };

            //var token = UserLoggedService.getToken();

            //declaring the hub connection 
            var hub = new Hub('hub', {
                //client side methods 
                listeners: {
                    'getConnectionId': function (connectionId) {
                        if (_callbacks.connectionId) _callbacks.connectionId(connectionId);
                    },
                    'connected': function (connectionId, businessId, type, ConnectedUsers) {
                        if (_callbacks.connected) _callbacks.connected(connectionId, businessId, type, ConnectedUsers);
                    },
                    'sentPrivate': function (businessId, message, user, businessName, avatar, dateTime) {
                        if (_callbacks.send) _callbacks.send(businessId, message, user, businessName, avatar, dateTime);
                    },
                    'sentPrivateUpload': function (businessId, mediaType, extension, path, user, businessName, avatar, dateTime) {
                        if (_callbacks.sendUpload) _callbacks.sendUpload(businessId, mediaType, extension, path, user, businessName, avatar, dateTime);
                    },
                    'onNewUserConnected': function (connectionId, businessId) {
                        if (_callbacks.newUser) _callbacks.newUser(connectionId, businessId);
                    },
                    'deletedMessage': function (messageId) {
                        if (_callbacks.deletedMessage) _callbacks.deletedMessage(messageId);
                    },
                    'pushNotification': function (notifications) {
                        if (_callbacks.pushNotification) _callbacks.pushNotification(notifications);
                    }
                },

                //server side methods 
                methods: ['getConnectionId', 'tryConnect', 'sendToPrivate'
                    , 'sendToPrivateUpload', 'refreshConnection', 'deleteMessage', 'startListen'],

                //query params sent on initial connection 
                queryParams: {
                    'Bearer': (UserLoggedService.isLogged())? UserLoggedService.getToken() : ''
                },

                //handle connection error 
                errorHandler: function (error) {
                    console.error(error);
                },

                stateChanged: function (state) {
                    var stateNames = { 0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected' };
                    if (stateNames[state.newState] == 'disconnected') {
                        //Hub Disconnect logic here...
                    }

                    if (stateNames[state.newState] == 'connected') {
                        //Hub Connect logic here...
                        _callbacks.hub();
                    }
                }
            });

            var getConnectionId = function () {
                hub.getConnectionId(); //Calling a server method 
            };

            var refresh = function (connectionId) {
                hub.refreshConnection(connectionId); //Calling a server method 
            };

            var startListen = function () {
                hub.startListen(); //Calling a server method 
            };

            var tryConnect = function (contact) {
                hub.tryConnect(contact.contactId, contact.typeBusiness); //Calling a server method 
            };

            var sendToPrivate = function (contact, message, currentLogin) {
                hub.sendToPrivate(contact.connectionId, contact.contactId, contact.typeBusiness, message,
                    currentLogin.user.firstName, contact.business, currentLogin.user.picture); //Calling a server method 
            };

            var sendToPrivateUpload = function (contact, file, currentLogin) {
                hub.sendToPrivateUpload(contact.connectionId, contact.contactId, file.mediaType, file.extension, file.pathUpload,
                    currentLogin.user.firstName, contact.business, currentLogin.user.picture); //Calling a server method 
            };

            var deleteMessage = function (contact, message) {
                hub.deleteMessage(contact.connectionId, contact.contactId, contact.typeBusiness, message.messageId); //Calling a server method
            };

            function setCallbacks(callbacks) {
                var keys = Object.keys(callbacks);
                for (var i = 0; i < keys.length; i++)
                    _callbacks[keys[i]] = callbacks[keys[i]];

            };

            return {
                connect: tryConnect,
                getConnectionId: getConnectionId,
                refresh: refresh,
                sendToPrivate: sendToPrivate,
                sendToPrivateUpload: sendToPrivateUpload,
                deleteMessage: deleteMessage,
                startListen: startListen,
                setCallbacks: setCallbacks
            };
        }]);
}(angular, vitali));


(function (angular, vitali) {
    'use strict';
    angular.module(vitali.modules.core.name).factory('ChatManagerService',
        ['UserLoggedService', '$rootScope', 'ApiService',
        function (UserLoggedService, $rootScope, ApiService) {
            var chats = [];
            var chatManagerService = {};

            chatManagerService.openChat = function (businessId) {
                $rootScope.chat.forEach(function (o, k) {
                    if (o.contactId == businessId) {
                        o.openChat = true;
                    }
                });
            };

            chatManagerService.reloadContacts = function () {
                ApiService.get('Chat', 'GetContacts', function (response) {
                    $rootScope.chat = ApiService.getResponseData(response, 'contacts');
                });
            };

            chatManagerService.getChatMessages = function (user) {
                ApiService.get('Chat', 'GetMessages?businessId=' + user.contactId + '&type=' + user.typeBusiness, function (response) {
                    var _chats = ApiService.getResponseData(response, 'chatMessages');
                    if (response.data.success) {
                        //$rootScope.chats = _chats;
                        _chats.forEach(function (o, k) {
                            var add = true;
                            var key = null;

                            $rootScope.chats.forEach(function (os, ks) {
                                if (o.messageId == os.messageId || o.date == os.date) {
                                    add = false;
                                }

                                if (!os.messageId && os.message == o.message) {
                                    add = false;
                                }

                                if (!os.messageId && os.isUploader) {
                                    key = ks;
                                }
                            });

                            if (add) $rootScope.chats.push(o);
                            if (key) $rootScope.chats.splice(key, 1);
                        });
                    }
                });
            };

            return chatManagerService;
        }]);
}(angular, vitali));