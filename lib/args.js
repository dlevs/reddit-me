const yargs = require('yargs');

module.exports = yargs
	.option('subreddit', {
		alias: 's',
		default: null
	})
	.help()
	.argv;
