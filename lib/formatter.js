'use strict';

var core = require('entipic.core');
var Text = require('entipic.text');
var _ = core._;
var external = module.exports;
var assert = require('assert');
var url = require('url');

external.normalizeTopic = function(data) {
  data = _.pick(data, 'name', 'uniqueName', 'id', 'type', 'pictureId', 'country', 'pictureDomain', 'englishWikiDescription', 'englishWikiName', 'englishWikiId', 'refIP', 'refHost');
  data._id = data.id;
  delete data.id;

  if (data.englishWikiDescription && data.englishWikiDescription.length > 400)
    data.englishWikiDescription = core.text.wrapAt(data.englishWikiDescription, 400);

  data = core.util.clearObject(data);
  return data;
};

external.normalizeUniqueName = function(data) {
  data = _.pick(data, 'name', 'uniqueName', 'topicId', 'pictureId', 'country', 'lang', 'wikiId', 'wikiLang', 'isLocal', 'status', 'popularity');

  data._id = core.util.md5(data.uniqueName.toLowerCase());

  data = core.util.clearObject(data);
  return data;
};

external.normalizePicture = function(data) {
  data = _.pick(data, 'sourceUrl', 'sourceDomain', 'dHash', 'topicId', 'status');
  data._id = external.pictureId(data);
  data.sourceDomain = data.sourceDomain || url.parse(data.sourceUrl).host;

  data = core.util.clearObject(data);
  return data;
};

external.normalizeUnknownName = function(data) {
  data = _.pick(data, 'name', 'country', 'lang', 'ip', 'host');
  data.name = data.name.trim();
  data.uniqueName = Text.uniqueName(data.name);
  if (data.lang) {
    data.uniqueName = Text.cultureUniqueName(data.uniqueName, data.lang, data.country);
  }
  data._id = core.util.md5(data.uniqueName);

  data = core.util.clearObject(data);
  return data;
};

external.uniqueNameId = function(un) {
  return core.util.md5(un.toLowerCase());
};

external.pictureId = function(picture) {
  return core.util.md5([picture.topicId, picture.dHash].join('-'));
};
