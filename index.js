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
const getRedditLinkAndNotify = async (subreddits = []) => {
	const url = urls.paths.random(sample(subreddits));
	const response = await apiRequest(url);
	const link = getters.response.getRandomItemOfKind(response, redditKinds.LINK);

	notifier.notify(
		{
			title: getters.link.getTitle(link),
			subtitle: getters.link.getSubreddit(link),
			message: [
				getters.link.getCommentCountText(link),
				getters.link.getUpvoteCountText(link)
			].join('\n'),
			contentImage: getters.link.getThumbnail(link),
			open: getters.link.getLink(link),
			wait: true,
			actions: ['Again!']
		},
		(err, type, {activationValue}) => {
			if (activationValue === 'Again!') {
				getRedditLinkAndNotify(subreddits);
			}
		}
	);
};

// Init with arguments from the command line.
getRedditLinkAndNotify(args.subreddits);
