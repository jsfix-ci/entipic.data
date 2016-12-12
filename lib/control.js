'use strict';

const utils = require('./utils');
const formatter = require('./model');
const get = utils.mongoGet;
const models = utils.models;
const actions = ['create', 'update', 'remove'];
const assert = require('assert');

const Service = module.exports = function(db) {
  this.db = db;
};

function checkModel(model) {
	if (models.indexOf(model) < 0) {
		throw new Error('Invalid model: ' + model);
	}
}

/**
 * Create item
 */
Service.prototype.create = function(model, data) {
  checkModel(model);
  assert.ok(data);

  data = formatter['normalize' + model](data);

  return this.db[model].createAsync(data).then(get);
};

/**
 * Update item
 */
Service.prototype.update = function(model, data) {
  checkModel(model);
  assert.ok(data);

  data.updatedAt = data.updatedAt || new Date();
  return this.db[model].findByIdAndUpdateAsync(data.id, data).then(get);
};

/**
 * Remove item
 */
Service.prototype.remove = function(model, data) {
  checkModel(model);
  assert.ok(data);

  return this.db[model].removeAsync(data.where).then(get);
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
