angular.module('indicator').directive('indicatorModule', [
	'indicatorService', '$filter',
	function (indicatorService, $filter) {

		var max = $filter('max');

		function registerValue() {
			alert('Not implemented just yet.');
		}

		/**
		 * Finds an item with a date highter than the provided date such that
		 * noe items exist with a date lower than the returned objects date and
		 * higher than the given date.
		 *
		 * @param list {Array} The list of objects to be searched
		 * @param date {Date} The date to compare to
		 * @return {Object} Object from the list satisfying the above
		 *     description, the last item in the list if no such item exists and
		 *     null if the list is empty.
		 */
		function getItemAfter(list, date) {
			var len = list.length,
				min;

			if (!len) {
				return null;
			}

			min = list[len - 1];

			for (var i = 0; i < len; i++) {
				if (list[i].date > date && list[i].date < min.date) {
					min = list[i];
				}
			}
			return min;
		}

		/**
		 * Transforms an array of objects on the form {date: ..., value: ....}
		 * to an array of objects on the form {x: ..., y: ...}.
		 */
		function getChartSeries(inData) {
			var data = [],
				i;

			for (i = 0; i < inData.length; i++) {
				data.push({
					x: inData[i].date,
					y: inData[i].value
				});
			}

			return data;
		}

		return {
			link: function (scope, element, attributes) {
				var state = scope.state = {
					showAccumulated: false
				};

				// Load new indicator when attribute is changed
				attributes.$observe('indicatorId', function (indicatorId) {
					scope.indicator = isNaN(indicatorId) ?
						null : indicatorService.get(Number(indicatorId));
				});

				// What if indicator changes?
				scope.$watch('indicator', function (newIndicator, oldIndicator) {

					if (!newIndicator) {

						delete state.visibleMeasurement;
						delete state.visibleGoal;

					} else {

						state.visibleMeasurement = max(newIndicator.measurements, 'date');

					}
				});

				// Update the goal to reflect the selected measurement
				scope.$watch('state.visibleMeasurement',
					function (oldMeasurement, newMeasurement, scope) {
						if (scope.indicator && newMeasurement) {
							scope.state.visibleGoal = getItemAfter(
								scope.indicator.goals, newMeasurement.date);
						}
					}
				);


				// Publish method for "register measurement" button
				scope.registerValue = registerValue;

				// Highcharts configuration object
				scope.highChartsConfig = {

					xAxis: {
						type: 'datetime',
						labels: {
							format: '{value:%d.%m.%Y}',
							rotation: 45,
							align: 'left'
						}
					},

					yAxis: {
						title: {
							text: null
						}
					},

					title: { // Disable title
						text: null
					}
				};

			},
			template: require('./indicator.html')
		};
	}
]);
