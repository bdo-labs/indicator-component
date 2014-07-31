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
			scope: {
				date: '='
			},
			link: function (scope, element, attributes) {
				var state = scope.state = {
					showAccumulated: false
				};

				scope.$watchCollection('[' + attributes.indicatorId + ', date]', function () {
					scope.indicator = 	isNaN(attributes.indicatorId) ?
						null : indicatorService.get(Number(attributes.indicatorId));

					if (!scope.indicator) {

						delete state.selectedMeasurement;
						delete state.visibleGoal;

					} else {
						if (scope.date) {
							state.selectedMeasurement =
								aggregationService.getNext(scope.indicator.measurements, scope.date, 'period');
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

					scope.state.visibleGoal = aggregationService.getNext(
							indicator.goals, selectedMeasurement.period, 'period'
					);
					if (!scope.state.visibleGoal) {
						scope.state.visibleGoal = aggregationService.getPrevious(
							indicator.goals, selectedMeasurement.period, 'period'
						);
					}
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
					state.visibleGoal =
						aggregationService.getNext(indicator.goals, scope.date, 'period');
				});

				// Expose method for "register measurement" button
				scope.registerValue = registerValue;

			},
			template: require('./indicator.html')
		};
	}
]);
