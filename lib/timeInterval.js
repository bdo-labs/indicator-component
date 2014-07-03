/**
 * Returns the provided duration (in milliseconds) as the closest human
 * readable interval. E. g.
 * 2 592 000 000 ms gives "monthly"
 *
 * This filter is currently hard coded for Norwegian!
 */

module.exports = function () {
	return function (input) {
		var interval,
			previous = -1;

		if (input < 0) {
			throw new Error('No interval for negative numbers');
		}
		// Let's convert to minutes
		minutes = input/60000;

		// Special cases
		if (minutes > 59 && minutes < 61) { // One hour
			return 'hver time';
		}

		if (minutes > 119 && minutes < 121) { //Two hours
			return 'annenhver time';
		}
		
		if (minutes > 2820 && minutes < 2940) { // Between 47 and 49 hours
			return 'annenhver dag';
		}

		if (minutes > 8640 && minutes < 11520) { // Between 6 and 8 days
			return 'ukentlig';
		}

		if (minutes > 38880 && minutes < 46080) { // Between 27 and 32 days
			return 'månedlig';
		}

		if (minutes > 1380 && minutes < 1500) { // Between 23 and 25 hours
			return 'daglig';
		}

		// The more general cases
		if (minutes < 120) { // Two hours
			return 'hvert ' + minutes.toFixed(0) + '. minutt';
		}

		if (minutes < 1440) { // Below 24 hours
			return 'hver ' + (minutes / 60).toFixed(0) + '. time';
		}

		if (minutes < 43200) { // Below 30 days
			return 'hver ' + (minutes / 1440).toFixed(0) + '. dag';
		}

		if (minutes < 525600) { // Below 365 days
			return 'hver ' + (minutes / 43200).toFixed(0) + '. måned';
		}

		return 'hvert ' + (minutes / 525600).toFixed(0) + '. år';
	}
}
