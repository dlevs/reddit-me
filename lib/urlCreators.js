module.exports = {
	roots: {
		site: (path) => `https://www.reddit.com${path}`,
		api: (path) => `https://api.reddit.com${path}`
	},
	paths: {
		randomPost: (subreddit) => subreddit
			? `/r/${subreddit}/random`
			: '/random'
	}
};
