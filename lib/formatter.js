'use strict';

var core = require('entipic.core');
var Text = require('entipic.text');
var _ = core._;
var external = module.exports;
var assert = require('assert');
var url = require('url');

external.normalizeTopic = function(data) {
  data = _.pick(data, 'name', 'uniqueName', 'id', 'pictureId', 'country', 'pictureDomain', 'englishWikiDescription', 'englishWikiName', 'englishWikiId');
  data._id = data.id;
  delete data.id;
  return data;
};

external.normalizeUniqueName = function(data) {
  data = _.pick(data, 'name', 'uniqueName', 'topicId', 'pictureId', 'country', 'lang', 'wikiId', 'wikiLang', 'isLocal', 'status');
  data._id = core.util.md5(data.uniqueName.toLowerCase());
  return data;
};

external.normalizePicture = function(data) {
  data = _.pick(data, 'sourceUrl', 'sourceDomain', 'dHash', 'topicId', 'status');
  data._id = core.util.md5(data.dHash.toLowerCase());
  data.sourceDomain = data.sourceDomain || url.parse(data.sourceUrl).host;
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
  return data;
};

external.uniqueNameId = function(un) {
  return core.util.md5(un.toLowerCase());
};
