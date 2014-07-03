
/**
 * Module dependencies.
 */
var angular = require('angular'),
		services = require('services');

/**
 * Expose indicator.
 */
var indicator = module.exports = angular.module('indicator', ['services']);

/**
 * Angular directives, components etc.
 */


/**
 * Angular filter for providing a human readable version of a given time interval
 */
require('./timeInterval.js');

/**
 * Directive for rendering the indicator module
 */
require('./indicatorDirective.js');