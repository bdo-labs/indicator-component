
/**
 * Module dependencies.
 */
require('angular');
require('services');
require('filters');
require('custom-elements');

/**
 * Expose indicator.
 */
var indicator = module.exports = angular.module('indicator', [
		'services', 'filters', 'customElements'
	]);

/**
 * Angular directives, components etc.
 */
require('./indicatorDirective.js');
