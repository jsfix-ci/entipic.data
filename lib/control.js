'use strict';

var core = require('entipic.core');
var Promise = core.Promise;
var _ = core._;
var utils = require('./utils');
var get = utils.mongoGet;
var models = utils.models;
var actions = ['create', 'update'];

var Service = module.exports = function(db) {
  this.db = db;
};

/**
 * Create item
 */
Service.prototype.create = function(model, data) {
  if (models.indexOf(model) < 0) throw new Error('Invalid model: ' + model);
  assert.ok(data);

  data = utils['normalize' + model](data);
  return this.db[model].createAsync(data).then(get);
};

/**
 * Update item
 */
Service.prototype.update = function(model, data) {
  if (models.indexOf(model) < 0) throw new Error('Invalid model: ' + model);
  assert.ok(data);

  data.updatedAt = data.updatedAt || new Date();
  return this.db[model].findByIdAndUpdateAsync(data.id, data).then(get);
};

/**
 * Builds API
 */
models.forEach(function(model) {
  actions.forEach(function(action) {
    Service.prototype[action + model] = function(data) {
      return this[action](model, data);
    };
  });
});
