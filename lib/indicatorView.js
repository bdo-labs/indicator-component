/**
 * This directive is responsible for displaying information about a single
 * indicator.
 *
 */
angular.module('indicatorView').directive('indicatorView', [
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

						delete state.selectedMeasurement;
						delete state.visibleGoal;

					} else {

						state.selectedMeasurement = max(newIndicator.measurements, 'date');

					}
				});

				// Update the goal to reflect the selected measurement
				scope.$watch('state.selectedMeasurement', function () {
					var indicator = scope.indicator,
						selectedMeasurement = state.selectedMeasurement;

					if (!indicator || !selectedMeasurement) {
						return;
					}

					scope.state.visibleGoal = getItemAfter(
							indicator.goals, selectedMeasurement.date
					);

				});


				// Expose method for "register measurement" button
				scope.registerValue = registerValue;

			},
			template: require('./indicator.html')
		};
	}
]);
