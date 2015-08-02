'use strict';

var uvrLogViewerApi = angular.module('uvrLogViewerApi', ['uvrLogViewerApp']);

var IDENTIFIER_TYPE_ANALOG = 'analog';
var IDENTIFIER_TYPE_DIGITAL = 'digital';
var IDENTIFIER_TYPE_HEATMETER = 'energy';

uvrLogViewerApi.factory('Api', function ($rootScope, $http, $cookieStore, $q, CONFIGURATION) {
  return {
    login: function (credentials) {
      $http.defaults.headers.post.Auhorization = undefined;
      $http.defaults.headers.common.Authorization = undefined;
      var user_data = {
        "username": credentials.username,
        "password": credentials.password
      };
      return $http.post(CONFIGURATION.apiAuthUrl, user_data);
    },
    /* Controllers */
    getControllers: function () {
      return $http.get(CONFIGURATION.apiUrl + 'controllers/');
    },
    getController: function (controllerId) {
      return $http.get(CONFIGURATION.apiUrl + 'controllers/' + controllerId + '/');
    },
    updateController: function (controller) {
      return $http.put(CONFIGURATION.apiUrl + 'controllers/' + controller.id + '/', controller);
    },
    deleteController: function (controller) {
      return $http.delete(CONFIGURATION.apiUrl + 'controllers/' + controller.id + '/');
    },
    createController: function (controller) {
      return $http.post(CONFIGURATION.apiUrl + 'conrollers/', controller);
    },
    /* IO Identifiers */
    getIoIdentifiersForController: function (controller) {
      return $http.get(CONFIGURATION.apiUrl + 'ioidentifiers/?controller=' + controller.id);
    },
    getActiveIoIdentifiersForController: function (controller) {
      return $http.get(CONFIGURATION.apiUrl + 'ioidentifiers/?controller=' + controller.id + '&is_active=True');
    },
    getAnalogIoIdentifiersForController: function (controller) {
      return $http.get(CONFIGURATION.apiUrl + 'ioidentifiers/?controller=' + controller.id + '&type=' + IDENTIFIER_TYPE_ANALOG);
    },
    getActiveAnalogIoIdentifiersForController: function (controller) {
      return $http.get(CONFIGURATION.apiUrl + 'ioidentifiers/?controller=' + controller.id + '&type=' + IDENTIFIER_TYPE_ANALOG + '&is_active=True');
    },
    getDigitalIoIdentifiersForController: function (controller) {
      return $http.get(CONFIGURATION.apiUrl + 'ioidentifiers/?controller=' + controller.id + '&type=' + IDENTIFIER_TYPE_DIGITAL);
    },
    getActiveDigitalIoIdentifiersForController: function (controller) {
      return $http.get(CONFIGURATION.apiUrl + 'ioidentifiers/?controller=' + controller.id + '&type=' + IDENTIFIER_TYPE_DIGITAL + '&is_active=True');
    },
    getHeatMeterIoIdentifiersForController: function (controller) {
      return $http.get(CONFIGURATION.apiUrl + 'ioidentifiers/?controller=' + controller.id + '&type=' + IDENTIFIER_TYPE_HEATMETER);
    },
    getActiveHeatMeterIoIdentifiersForController: function (controller) {
      return $http.get(CONFIGURATION.apiUrl + 'ioidentifiers/?controller=' + controller.id + '&type=' + IDENTIFIER_TYPE_HEATMETER + '&is_active=True');
    },
    /* IO Values */
    getAnalogValue: function (valueId) {
      return $http.get(CONFIGURATION.apiUrl + 'analogvalues/' + valueId + '/');
    },
    getDigitalValue: function (valueId) {
      return $http.get(CONFIGURATION.apiUrl + 'digitalvalues/' + valueId + '/');
    },
    getHeatMeterValue: function (valueId) {
      return $http.get(CONFIGURATION.apiUrl + 'heatmetervalues/' + valueId + '/');
    },
    getAnalogValuesForIoIdentifier: function (ioIdentifierId, date_from) {
      var today = new Date();
      var fromDateWanted = new Date();
      fromDateWanted.setDate(today.getDate() - date_from);
      var getUrl = CONFIGURATION.apiUrl + 'analogvalues/' + '?io_identifier=' + ioIdentifierId + '&date_from=' + fromDateWanted.getFullYear() + '-' + (fromDateWanted.getMonth()+1) + '-' + fromDateWanted.getDate();
      console.log(getUrl);
      return $http.get(getUrl);
    },
    updateIoIdentifier: function (ioIdentifier) {
      return $http.put(CONFIGURATION.apiUrl + 'ioidentifiers/' + ioIdentifier.id + '/', ioIdentifier);
    },
    getDigitalValuesForIoIdentifier: function(ioIdentifierId, date_from) {
      var today = new Date();
      var fromDateWanted = new Date();
      fromDateWanted.setDate(today.getDate() - date_from);
      var getUrl = CONFIGURATION.apiUrl + 'digitalvalues/' + '?io_identifier=' + ioIdentifierId + '&date_from=' + fromDateWanted.getFullYear() + '-' + (fromDateWanted.getMonth()+1) + '-' + fromDateWanted.getDate();
      console.log(getUrl);
      return $http.get(getUrl);
    },
    getSchemaForController: function (controller) {
      if(controller.schema_active === null) {
        return null;
      }
      var getSchemaUrl = CONFIGURATION.apiUrl + 'uploadedschemas/' + controller.schema_active + '/';
      console.log(getSchemaUrl);
      return $http.get(getSchemaUrl);
    }
  };
});
