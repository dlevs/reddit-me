const {DEFAULT_ICON_PATH} = require('./constants');

module.exports = {
	returnImageUrlOrFallback: (url) => {
		return url.startsWith('http')
			? url
			: DEFAULT_ICON_PATH
	}
};
