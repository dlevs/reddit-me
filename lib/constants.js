const path = require('path');

module.exports = {
	DEFAULT_ICON_PATH: path.join(__dirname, '../assets/reddit-icon.png'),
	// Kinds from documentation at https://www.reddit.com/dev/api/
	redditKinds: {
		COMMENT: 't1',
		ACCOUNT: 't2',
		LINK: 't3',
		MESSAGE: 't4',
		SUBREDDIT: 't5',
		AWARD: 't6',
		PROMO_CAMPAIGN: 't8'
	}
};
