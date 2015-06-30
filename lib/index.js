'use strict';

var AccessService = require('./access');
var ControlService = require('./control');
var db = require('./db');
var utils = require('./utils');
var mongoose = require('mongoose');
var _ = require('entipic.core')._;

var external = module.exports = {
  AccessService: AccessService,
  ControlService: ControlService,
  Db: db,
  connect: function(connectionString, options, cb) {
    return mongoose.createConnection(connectionString, options, cb);
  },
  mongoose: mongoose,
  formatter: require('./formatter')
};
