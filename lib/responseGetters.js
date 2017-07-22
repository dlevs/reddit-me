const pluralize = require('pluralize');
const urls = require('./urlCreators');
const {returnImageUrlOrFallback} = require('./util');

module.exports = {
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
