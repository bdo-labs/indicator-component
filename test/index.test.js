describe('indicator', function(){
	var MockService = {
		get: function () {
			return {
				measurements: [1, 2],
				goals: [2, 4]
			};
		}
	}


	beforeEach(module('indicator'));

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
		if (!tpl) tpl = '<div indicator-module></div>';

		inject(function ($compile) {
			el = $compile(tpl)(scope)[0];
		})
		scope.$digest();
	}


	describe('initialisation', function () {
		beforeEach(function () {
			compileDirective();
		});

		it('child should have class indicator-module', function () {
			expect(el.firstElementChild.classList.contains('indicator-module')).toBe(true);
		});
	});
});
