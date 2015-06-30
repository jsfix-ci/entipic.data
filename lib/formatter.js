'use strict';

var core = require('entipic.core');
var Text = require('entipic.text');
var _ = core._;
var external = module.exports;
var assert = require('assert');

external.normalizeTopic = function(data) {
  return data;
};

external.normalizeUniqueName = function(data) {
  return data;
};

external.normalizePicture = function(data) {
  return data;
};

external.normalizeUnknownName = function(data) {
  data = _.pick(data, 'name', 'country', 'lang', 'ip', 'host');
  data.name = data.name.trim();
  data._id = core.util.md5(data.name.toLowerCase());
  data.uniqueName = Text.uniqueName(data.name);
  return data;
};

external.uniqueNameId = function(un) {
  return core.util.md5(un.toLowerCase());
};
