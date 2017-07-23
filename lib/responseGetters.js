/*
 * Module exports getter functions to obtain values from a raw reddit API
 * response object.
 */
const pluralize = require('pluralize');
const flatMap = require('lodash/flatMap');
const sample = require('lodash/sample');
const urls = require('./urlCreators');
const {returnImageUrlOrFallback} = require('./util');


const getters = {
	// Process raw response object
	response: {
		/**
		 * Return array of items of all "kinds" (t1, t2, etc) from a raw reddit
		 * API response.
		 *
		 * Raw response may be an object or array, depending on whether the
		 * subreddit supports random posts, and subsequently returns a single
		 * thread, or returns the top posts of the subreddit. See
		 * https://redd.it/6kytix.
		 *
		 * This function normalises all actual content into a flat array.
		 *
		 * @param {Object|Array} response
		 * @returns {Array}
		 */
		getAllItems: (response) => {
			const items = []
				.concat(response)
				.filter(item => item.kind === 'Listing');

			// Flatmap to mix all kinds together (Links, Comments, etc).
			return flatMap(items, item => item.data.children);
		},
		/**
		 * Get the items of a certain "kind" (t1, t2, etc) from a raw reddit
		 * API response.
		 *
		 * @param {Object|Array} response
		 * @param {String} kind
		 * @returns {Array}
		 */
		getAllItemsOfKind: (response, kind) => {
			return getters.response.getAllItems(response)
				.filter(item => item.kind === kind)
				.map(item => item.data);
		},
		/**
		 * Get a random item of a certain "kind" (t1, t2, etc) from a raw reddit
		 * API response.
		 *
		 * @param {Object|Array} response
		 * @param {String} kind
		 * @returns {Object}
		 */
		getRandomItemOfKind: (response, kind) => {
			const items = getters.response.getAllItemsOfKind(response, kind);
			return sample(items);
		}
	},
	// For reddit objects of kind 't3' (Link)
	link: {
		getThumbnail: (link) => returnImageUrlOrFallback(link.thumbnail),
		getTitle: (link) => link.title,
		getLink: (link) => urls.roots.site(link.permalink),
		getSubreddit: (link) => link.subreddit,
		getCommentCountText: (link) => pluralize('comment', link.num_comments, true),
		getUpvoteCountText: (link) => pluralize('upvote', link.score, true)
	}
};

module.exports = getters;
