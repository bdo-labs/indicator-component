describe('indicator', function(){
	var MockService = {
		get: function () {
			return {
				measurements: [1, 2],
				goals: [2, 4]
			};
		}
	}


	beforeEach(module('indicatorView'));

	var el,
			scope,
			httpBackend;

	beforeEach(module(function ($provide) {
		$provide.value('indicatorService', MockService);
	}))

	beforeEach(inject(function ($rootScope, $compile, $httpBackend){
		scope = $rootScope.$new();
		httpBackend = $httpBackend;
	}))


	function compileDirective(tpl){
		if (!tpl) tpl = '<div indicator-view></div>';

		inject(function ($compile) {
			el = $compile(tpl)(scope)[0];
		})
		scope.$digest();
	}



	it('child should have a child', function () {
		compileDirective();
		expect(el.firstElementChild).toBeTruthy();
	});
});
