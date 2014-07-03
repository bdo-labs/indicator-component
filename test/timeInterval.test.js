describe('The timeInterval filter', function () {
	beforeEach(module('indicator'));

	var timeIntervalFilter;

	beforeEach(inject(function ($filter){
		timeIntervalFilter = $filter('timeInterval');
	}));


	it('should exist', function () {
		expect(timeIntervalFilter).not.toBeNull();
	});

	it('should convert one hour in milliseconds to one hour', function () {
		expect(timeIntervalFilter(3600000)).toEqual('hver time');
	});

	it('should be able to handle big numbers', function () {
		expect(timeIntervalFilter(Number.MAX_VALUE)).toEqual('hvert 5.700447535712568e+297. år');
	});

	it('should throw exception on negative numbers', function () {
		expect(function () {
			timeIntervalFilter(-1);
		}).toThrow();
	});
});