const yargs = require('yargs');

module.exports = yargs
	.option('subreddits', {
		alias: 's',
		type: 'array'
	})
	.help()
	.argv;
