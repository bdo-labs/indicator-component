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

		function findNextOrPrevious(list, date) {
			var next = aggregationService.getNext(list, date, 'period');

			if (next) {
				return next;
			}

			return aggregationService.getPrevious(list, date, 'period');
		}

		return {
			scope: {
				date: '='
			},
			link: function (scope, element, attributes) {
				var state = scope.state = {
					showAccumulated: false
				};

				scope.$watchCollection('[' + attributes.indicatorId + ', date]', function () {
					scope.indicator = indicatorService.get(isNaN(attributes.indicatorId) ?
							 attributes.indicatorId : Number(attributes.indicatorId));

					if (!scope.indicator) {

						delete state.selectedMeasurement;
						delete state.visibleGoal;

					} else {
						if (scope.date) {
							state.selectedMeasurement = findNextOrPrevious(scope.indicator.measurements, scope.date);
						} else {
							state.selectedMeasurement = aggregationService.getMax(scope.indicator.measurements, 'date');
						}
					}
				});

				// Update the goal to reflect the selected measurement
				scope.$watch('state.selectedMeasurement', function () {
					var indicator = scope.indicator,
						selectedMeasurement = state.selectedMeasurement;

					if (!indicator || !selectedMeasurement) {
						return;
					}

					scope.state.visibleGoal = findNextOrPrevious(indicator.goals, selectedMeasurement.period);

					scope.goalIndex = indicator.goals.indexOf(scope.state.visibleGoal);
				});

				// Update the visible goal if it changes in the model
				scope.$watch(function () {
					return scope.indicator.goals[scope.goalIndex];
				}, function () {
					var indicator = scope.indicator;

					if (!indicator) {
						return;
					}
					state.visibleGoal = findNextOrPrevious(indicator.goals, scope.state.selectedMeasurement.period);
				});

				// Expose method for "register measurement" button
				scope.registerValue = registerValue;

			},
			template: require('./indicator.html')
		};
	}
]);
