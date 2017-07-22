#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const notifier = require('node-notifier');

const yargs = require('yargs') // eslint-disable-line
	.option('subreddit', {
		alias: 's',
		default: null
	})
	.help()
	.argv;

const DEFAULT_ICON_PATH = path.join(__dirname, 'assets/reddit-icon.png');

const apiRequest = async (path) => {
	const response = await fetch(
		urls.roots.api(path),
		{
			headers: {'User-Agent': 'Reddit-Me-Script'}
		}
	);
	return response.json();
};
const urls = {
	roots: {
		site: (path) => `https://www.reddit.com${path}`,
		api: (path) => `https://api.reddit.com${path}`
	},
	paths: {
		randomPost: (subreddit) => subreddit
			? `/r/${subreddit}/random`
			: '/r/random'
	}
};

const returnImageUrlOrFallback = (url) =>
	url.startsWith('http')
		? url
		: DEFAULT_ICON_PATH;

/**
 * Yes, it's bad. It won't work for all word an languages, but it works for this script.
 * // TODO: look into alternative
 * @param word
 * @param number
 */
const plualiser = (word, number) => number === 1
	? word
	: `${word}s`;

const getters = {
	posts: {
		getOriginalPost: (posts) => posts[0].data.children[0].data
	},
	post: {
		getThumbnail: (post) => returnImageUrlOrFallback(post.thumbnail),
		getTitle: (post) => post.title,
		getLink: (post) => urls.roots.site(post.permalink),
		getSubreddit: (post) => post.subreddit,
		getSummary: (post) => {
			const {score, num_comments} = post;
			const rows = [
				score + ' ' + plualiser('upvote', score),
				num_comments + ' ' + plualiser('comment', num_comments),
			];
			return rows.join('\n')
		}
	}
};

const getRedditPostAndNotify = async () => {
	const url = urls.paths.randomPost(yargs.subreddit);
	const posts = await apiRequest(url);
	const post = getters.posts.getOriginalPost(posts);

	notifier.notify(
		{
			title: getters.post.getTitle(post),
			subtitle: getters.post.getSubreddit(post),
			message: getters.post.getSummary(post),
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
