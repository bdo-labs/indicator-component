
/**
 * Module dependencies.
 */
require('angular');
require('services');
require('filters');
require('d3-charts');
require('custom-elements');

/**
 * Expose indicator.
 */
module.exports = angular.module('indicatorView', [
		'services', 'filters', 'customElements', 'd3Charts'
	]);

/**
 * Angular directives, components etc.
 */
require('./indicatorView.js');
