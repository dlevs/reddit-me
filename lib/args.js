/*
 * Module defines command line arguments.
 * Exports parsed argument values.
 */
const yargs = require('yargs');

module.exports = yargs
	.option('subreddits', {
		alias: 's',
		type: 'array'
	})
	.help()
	.argv;
