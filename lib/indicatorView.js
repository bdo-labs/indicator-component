/**
 * This directive is responsible for displaying information about a single
 * indicator.
 *
 */
angular.module('indicatorView').directive('indicatorView', [
	'indicatorService', 'aggregationService', 'organizationalNodeService',
	function (indicatorService, aggregationService, orgNodeService) {
		var getMax = aggregationService.getMax,
			getNext = aggregationService.getNext,
			getPrevious = aggregationService.getPrevious,
			aggregateValues = aggregationService.aggregateValues;

		/**
		 * Accumulates the values in a list!
		 *
		 * WARNING: This changes the original items in the list
		 */
		function accumulate(list) {
			var acc = 0;

			list.forEach(function (item) {
				item.value = acc = acc + item.value;
			});
		}

		return {
			scope: {
				date: '=?',
				organizationalNode: '=?'
			},
			link: function (scope, element, attributes) {
				var state = scope.state = {
					showAccumulated: false
				},
				indicator;

				/**
				 * Generates data for chart
				 */
				function generateChartData() {
					if (!indicator || !state.orgNode) {
						return;
					}

					var goals = indicator.goals,
						measurements = indicator.measurements;

					// Filter by organizational node
					goals = indicatorService.aggregateGoals(
							indicator,
							state.orgNode
						);

					measurements = indicatorService.aggregateMeasurements(
							indicator,
							state.orgNode
						);

					if (state.showAccumulated) {
						accumulate(goals);
						accumulate(measurements);
					}

					// Map to scope
					scope.chartGoalData = goals.map(function (goal) {
						return {
							date: goal.period,
							value: goal.value
						};
					});

					scope.chartData = measurements.map(function (measurement) {
						return {
							date: measurement.period,
							value: measurement.value,
							//TODO: These should of course not be random
							className: ['good', 'warning', 'danger'][
								Math.floor(3 * Math.random())
							]
						}
					});
				}

				function updateState() {
					if (!indicator || !indicator.measurements.length) {
						return;
					}

					var date = scope.date,
						measurements = indicator.measurements,
						goals = indicator.goals;

					date = date || getMax(measurements,'period').period;

					// Find the correct measurement
					state.selectedMeasurement =	indicatorService
						.aggregatePeriodMeasurement(
							indicator,
							state.orgNode,
							date
						);

					// And correct goals
					state.visibleGoal = indicatorService
						.aggregatePeriodGoal(
							indicator,
							state.orgNode,
							date
						);
				}


				function newData() {
						updateState();
						generateChartData();
				}


				attributes.$observe('indicatorId', function (indicatorId) {

					// Fetch new indicator
					indicator = scope.indicator = indicatorService.get(
						isNaN(attributes.indicatorId) ?
							 attributes.indicatorId : Number(attributes.indicatorId)
					);

					if (!indicator) {
						delete state.selectedMeasurement;
						delete state.visibleGoal;
						delete scope.chartGoalData;
						delete scope.chartData;
					}

				});

				scope.$watchCollection('indicator.measurements', newData);
				scope.$watchCollection('indicator.goals', newData);

				scope.$watch('date', updateState);

				scope.$watch('organizationalNode', function () {
					state.orgNode = scope.organizationalNode ?
							orgNodeService.get(scope.organizationalNode) :
							orgNodeService.getRootNode();
					newData();
				});

				scope.$watch('state.showAccumulated', function () {
					generateChartData();
				});

				// The graph emits when someone clicks a circle
				scope.$on('measurementSelectionChange', function (e, selection) {
					scope.$apply(function () {
						scope.date = selection.date;
					});
				});

				element.addClass('large');

			},
			template: require('./indicator.html')
		};
	}
]);
