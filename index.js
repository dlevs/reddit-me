#!/usr/bin/env node
const fetch = require('node-fetch');
const notifier = require('node-notifier');
const sample = require('lodash/sample');
const args = require('./lib/args');
const getters = require('./lib/responseGetters');
const urls = require('./lib/urlCreators');

const apiRequest = async (path) => {
	const response = await fetch(
		urls.roots.api(path),
		{
			headers: {'User-Agent': 'Reddit-Me-Script'}
		}
	);
	return response.json();
};

const getRedditPostAndNotify = async () => {
	const url = urls.paths.randomPost(sample(args.subreddits));
	const posts = await apiRequest(url);
	const post = getters.posts.getOriginalPost(posts);

	notifier.notify(
		{
			title: getters.post.getTitle(post),
			subtitle: getters.post.getSubreddit(post),
			message: [
				getters.post.getCommentCountText(post),
				getters.post.getUpvoteCountText(post)
			].join('\n'),
			contentImage: getters.post.getThumbnail(post),
			open: getters.post.getLink(post),
			wait: true,
			actions: ['Again!']
		},
		(err, type, {activationValue}) => {
			if (activationValue === 'Again!') {
				getRedditPostAndNotify();
			}
		}
	);
};

getRedditPostAndNotify();
