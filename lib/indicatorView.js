/**
 * This directive is responsible for displaying information about a single
 * indicator.
 *
 */
angular.module('indicatorView').directive('indicatorView', [
	'indicatorService', 'aggregationService',
	function (indicatorService, aggregationService) {

		function registerValue() {
			alert('Not implemented just yet.');
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

						state.selectedMeasurement = aggregationService.getMax(newIndicator.measurements, 'date');

					}
				});

				// Update the goal to reflect the selected measurement
				scope.$watch('state.selectedMeasurement', function () {
					var indicator = scope.indicator,
						selectedMeasurement = state.selectedMeasurement;

					if (!indicator || !selectedMeasurement) {
						return;
					}

					scope.state.visibleGoal = aggregationService.getNext(
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
