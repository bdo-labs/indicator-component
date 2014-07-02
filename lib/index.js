
/**
 * Module dependencies.
 */
var angular = require('angular'),
		services = require('services');

/**
 * Expose indicator.
 */
var indicator = module.exports = angular.module('indicator', ['services']);

indicator.filter('timeInterval', require('./timeInterval.js'));
indicator.directive('indicatorModule', require('./indicatorDirective.js'));