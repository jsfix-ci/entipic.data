'use strict';

var core = require('entipic.core');
var assert = require('assert');
var utils = require('./utils');
var get = utils.mongoGet;
var Promise = core.Promise;
var _ = core._;
var models = utils.models;

var Service = module.exports = function Service(db) {
  this.db = db;
};

Service.prototype.one = function(model, params) {
  if (models.indexOf(model) < 0) throw new Error('Invalid model: ' + model);
  assert.ok(params);

  return this.db[model].findOneAsync(params.where, params.select).then(get);
};

Service.prototype.count = function(model, params) {
  if (models.indexOf(model) < 0) throw new Error('Invalid model: ' + model);
  params = params || {};

  return this.db[model].countAsync(params.where);
};

Service.prototype.list = function(model, params) {
  if (models.indexOf(model) < 0) throw new Error('Invalid model: ' + model);
  assert.ok(params);

  var self = this,
    limit = 10;
  params = _.pick(params, 'where', 'limit', 'order', 'select');
  if (params.limit && (params.limit < 1 || params.limit > 200))
    delete params.limit;

  var sort = [];
  if (_.isString(params.order)) {
    params.order.split(/[ ,;]+/g).forEach(function(name) {
      if (name.length < 2) return;
      if (name[0] === '-')
        sort.push([name.substr(1), -1]);
      else sort.push([name, 1]);
    });
  }

  return new Promise(function(resolve, reject) {
    self.db[model]
      .find(params.where)
      .select(params.select)
      .sort(sort)
      .skip(params.offset || 0)
      .limit(params.limit || limit)
      .exec(function(error, list) {
        if (error) {
          return reject(error);
        }
        list = get(list);
        resolve(list);
      });
  });
};


/**
 * Builds API
 */
models.forEach(function(model) {
  // one model: .topic()
  Service.prototype[model.toLowerCase()] = function(params) {
    assert.ok(params);
    return this.one(model, params);
  };
  // list model: .topics()
  Service.prototype[model.toLowerCase() + 's'] = function(params) {
    assert.ok(params);
    return this.list(model, params);
  };
  // count model: .countTopics()
  Service.prototype['count' + model + 's'] = function(params) {
    assert.ok(params);
    return this.count(model, params);
  };
});
