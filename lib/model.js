/*eslint no-underscore-dangle:0*/
'use strict';

const utils = require('./utils');
const _ = utils._;
const url = require('url');

exports.normalizeEntity = function(data) {
	data = _.pick(data, 'name', 'uniqueName', 'id', 'type', 'pictureId', 'country', 'pictureDomain', 'description', 'wikiName', 'wikiId', 'refIP', 'refHost', 'popularity', 'createdAt', 'types', 'props');

	data.id = data.id || utils.shortid();
	data.uniqueName = utils.uniqueName(data.uniqueName || data.name);

	data._id = data.id;
	delete data.id;

	data = utils.clearObject(data);
	return data;
};

exports.normalizeUniqueName = function(data) {
	data = _.pick(data, 'name', 'topicId', 'pictureId', 'country', 'lang', 'wikiId', 'wikiName', 'status', 'popularity', 'createdAt');

	data.uniqueName = utils.uniqueName(data.name);

	data.locale = data.lang.toLowerCase().trim();

	if (data.country) {
		data.locale = [data.lang, data.country].join('_').toLowerCase().trim();
	}

	data._id = utils.uniqueNameId(data.uniqueName, data.lang, data.country);

	data = utils.clearObject(data);
	return data;
};

exports.normalizePicture = function(data) {
	data = _.pick(data, 'sourceUrl', 'sourceDomain', 'dHash', 'entityId', 'status', 'createdAt');
	data._id = exports.pictureId(data);
	data.sourceDomain = data.sourceDomain || url.parse(data.sourceUrl).host;

	data = utils.clearObject(data);
	return data;
};

exports.normalizeUnknownName = function(data) {
	data = _.pick(data, 'name', 'country', 'lang', 'ip', 'host', 'createdAt');
	data.name = data.name.trim();
	data.uniqueName = utils.uniqueName(data.name);
	data.lang = data.lang.toLowerCase();
	data.locale = utils.locale(data.lang, data.country);
	data._id = utils.md5(data.uniqueName);

	data = utils.clearObject(data);
	return data;
};

exports.pictureId = function(picture) {
	return utils.md5([picture.entityId, picture.dHash].join('|'));
};
