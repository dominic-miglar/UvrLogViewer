'use strict';

/**
 * @ngdoc overview
 * @name uvrLogViewerConfig
 * @description
 * # uvrLogViewerConfig
 *
 * Configuration module of the application.
 */
var uvrLogViewerConfig = angular.module('uvrLogViewerConfig', []);

uvrLogViewerConfig.constant('CONFIGURATION', {
  'apiUrl': 'http://uvrlogbackend.netunix.at/api/',
  'apiAuthUrl': 'http://uvrlogbackend.netunix.at/api-token-auth/'
});
