describe('indicator', function(){
	var MockService = {
		data: {
				measurements: [{value: 1, period: new Date('2014-07-01')}, {value: 2, period: new Date('2014-08-01')}],
				goals: [{value: 2, period: new Date('2014-07-30')}, {value:4, period: new Date('2014-08-01')}]
		},
		get: function () {
			return this.data;
		},
		aggregatePeriodMeasurement: function () {
			return {};
		},

		aggregatePeriodGoal: function () {
			return {};
		},
		aggregateGoals: function () {
			return [];
		},
		aggregateMeasurements: function () {
			return [];
		}
	};

	beforeEach(module('indicatorView'));

	var el,
			compiled,
			scope;

	beforeEach(module(function ($provide) {
		$provide.value('indicatorService', MockService);
	}));

	beforeEach(inject(function ($rootScope, $compile, $httpBackend){
		scope = $rootScope.$new();
		httpBackend = $httpBackend;
	}));


	function compileDirective(tpl, date){
		if (!tpl) tpl = '<div indicator-view indicator-id="1" date="date"></div>';

		scope.date = date ? new Date(date) : new Date(2014, 6, 1);
		inject(function ($compile) {
			el = $compile(tpl)(scope)[0];
		});
		compiled = angular.element(el);
		scope.$digest();
	}

	beforeEach(function () {
		compileDirective();
	});

	it('child should have a child', function () {
		expect(el.firstElementChild).toBeTruthy();
	});

	it('should get an indicator', function () {
		expect(compiled.isolateScope().indicator).toBeTruthy();
	});

	it('should select a measurement and a goal', function () {
		expect(compiled.isolateScope().state.selectedMeasurement).toBeTruthy();
		expect(compiled.isolateScope().state.visibleGoal).toBeTruthy();
	});

	it('should add graph data to scope', function () {
		var s = compiled.isolateScope();
		expect(s.chartData).toBeTruthy();
		expect(s.chartGoalData).toBeTruthy();
	});
	

});
