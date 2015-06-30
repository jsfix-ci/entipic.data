'use strict';

var core = require('entipic.core');
var Text = require('entipic.text');
var _ = core._;
var external = module.exports;
var assert = require('assert');

external.mongoGet = mongoGet;
external.isNotNull = isNotNull;
external.isNull = isNull;
external.models = ['Topic', 'UniqueName', 'Picture', 'UnknownName'];

function mongoGet(data, nofields) {
  nofields = nofields || ['_id', '__v'];
  if (!Array.isArray(nofields))
    nofields = [nofields];

  if (data && data.toObject)
    return mongoGetItem(data, nofields);
  if (data && Array.isArray(data))
    return data.map(function(item) {
      return mongoGetItem(item, nofields);
    });
  return data;
}

function mongoGetItem(data, nofields) {

  function mapItem(item) {
    return mongoGetItem(item, nofields);
  }

  var _id = data['_id'];

  data = isNotNull(data.toObject) ? data.toObject() : data;
  for (var prop in data) {
    if (prop === 'id' && _.isNumber(_id))
      data[prop] = parseInt(data[prop]);
    else if (data[prop] === null || nofields.indexOf(prop) > -1)
      delete data[prop];
    else if (Array.isArray(data[prop]))
      data[prop] = data[prop].map(mapItem);
  }
  return data;
}

function isNotNull(target) {
  return !isNull(target);
}

function isNull(target) {
  return [undefined, null].indexOf(target) > -1;
}
