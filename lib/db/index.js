'use strict';

var mongoose = require('mongoose');
var schemas = require('./schemas');
var core = require('entipic.core');
var Promise = core.Promise;
var utils = require('../utils');
var models = utils.models;

module.exports = function(connection) {
  var db = {};
  models.forEach(function(model) {
    var m = db[model] = connection.model(model, schemas[model]);
    Promise.promisifyAll(m);
    Promise.promisifyAll(m.prototype);
  });

  return db;
};
