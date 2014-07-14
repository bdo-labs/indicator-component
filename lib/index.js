
/**
 * Module dependencies.
 */
require('angular');
require('services');
require('filters');

/**
 * Expose indicator.
 */
var indicator = module.exports = angular.module('indicator', [
		'services', 'filters'
	]);

/**
 * Angular directives, components etc.
 */
require('./indicatorDirective.js');
