'use strict';


var webstorageLight = angular.module('webstorageLight', []);

webstorageLight
    .factory('StorageService', function ($window, $rootElement) {

        var _storageBackend = $window.localStorage;
        var appPrefix = $rootElement.attr('ng-app') + ".";

        try
        {
            // The best way to test if functionality is available
            // is just to try and fail :)
            _storageBackend.setItem('testKey', 'hi');
            _storageBackend.removeItem('testKey');
        }
        catch (error)
        {
            console.error("The session/local storage backend is not working in your Browser. Switching to In-Memory fallback! Info: " + error.message);

            // In-Memory polyfill for storage
            _storageBackend = {
                _data       : {},
                setItem     : function(id, val) { return this._data[id] = String(val); },
                getItem     : function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
                removeItem  : function(id) { return delete this._data[id]; },
                clear       : function() { return this._data = {}; }
            };
        }


        return {

            get: function (key) {
                var myKey = appPrefix + key;
                try{
                    var value = _storageBackend.getItem(myKey);
                    return value ? JSON.parse(value) : null;
                }catch(error){
                    console.error("StorageService - Failed to read "+myKey+" from storage: " + error.message);
                    return null;
                }
            },

            save: function (key, data) {

                var myKey = appPrefix + key;
                try{
                    _storageBackend.setItem(myKey, data ? JSON.stringify(data) : null);
                }catch(error){
                    console.error("StorageService - Failed to store "+myKey+" in storage: " + error.message);
                }
            },

            remove: function (key) {
                var myKey = appPrefix + key;
                try {
                    _storageBackend.removeItem(myKey);
                }catch(error){
                    console.error("StorageService - Failed to remove key "+myKey+" from storage: " + error.message);
                }
            },

            clearAll : function () {
                try {
                    _storageBackend.clear();
                }catch(error){
                    console.error("StorageService - Failed to clear storage: " + error.message);
                }
            }
        };
    });
