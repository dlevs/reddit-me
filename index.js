#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const notifier = require('node-notifier');
const pluralize = require('pluralize');

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
			: '/random'
	}
};

const returnImageUrlOrFallback = (url) =>
	url.startsWith('http')
		? url
		: DEFAULT_ICON_PATH;


const getters = {
	posts: {
		getOriginalPost: (posts) => posts[0].data.children[0].data
	},
	post: {
		getThumbnail: (post) => returnImageUrlOrFallback(post.thumbnail),
		getTitle: (post) => post.title,
		getLink: (post) => urls.roots.site(post.permalink),
		getSubreddit: (post) => post.subreddit,
		getCommentCountText: (post) => pluralize('comment', post.num_comments, true),
		getUpvoteCountText: (post) => pluralize('upvote', post.score, true)
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
