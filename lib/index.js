
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
module.exports = angular.module('indicatorView', [
		'services', 'filters', 'customElements'
	]);

/**
 * Angular directives, components etc.
 */
require('./indicatorView.js');
