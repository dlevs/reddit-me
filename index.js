#!/usr/bin/env node
const fetch = require('node-fetch');
const notifier = require('node-notifier');
const sample = require('lodash/sample');
const args = require('./lib/args');
const getters = require('./lib/responseGetters');
const urls = require('./lib/urlCreators');
const {redditKinds} = require('./lib/constants');

/**
 * Make a GET reqest to the reddit API at the relative path provided.
 *
 * @param {String} path
 * @returns {Promise}
 */
const apiRequest = async (path) => {
	const response = await fetch(
		urls.roots.api(path),
		{
			headers: {'User-Agent': 'Reddit-Me-Script'}
		}
	);
	return response.json();
};

/**
 * Show a notification with information from a random post from a random
 * subreddit.
 *
 * @param {Array} [subreddits]
 * @returns {Promise}
 */
const getRedditPostAndNotify = async (subreddits = []) => {
	const url = urls.paths.randomPost(sample(subreddits));
	const response = await apiRequest(url);
	const post = getters.response.getRandomItemOfKind(response, redditKinds.LINK);

	notifier.notify(
		{
			title: getters.link.getTitle(post),
			subtitle: getters.link.getSubreddit(post),
			message: [
				getters.link.getCommentCountText(post),
				getters.link.getUpvoteCountText(post)
			].join('\n'),
			contentImage: getters.link.getThumbnail(post),
			open: getters.link.getLink(post),
			wait: true,
			actions: ['Again!']
		},
		(err, type, {activationValue}) => {
			if (activationValue === 'Again!') {
				getRedditPostAndNotify(subreddits);
			}
		}
	);
};

// Init with arguments from the command line.
getRedditPostAndNotify(args.subreddits);
