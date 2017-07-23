const {DEFAULT_ICON_PATH} = require('./constants');

module.exports = {
	/**
	 * Return the `url` parameter if it is a valid URL, otherwise return a
	 * default image URL.
	 *
	 * Useful for reddit responses, which can have a `thumbnail` property that
	 * can be either a URL, or a string ('self', 'default', etc).
	 *
	 * @param {String} url
	 * @returns {String}
	 */
	returnImageUrlOrFallback: (url) => {
		return url.startsWith('http')
			? url
			: DEFAULT_ICON_PATH
	}
};
