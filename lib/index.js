'use strict';

var AccessService = require('./access');
var ControlService = require('./control');
var db = require('./db');
var mongoose = require('mongoose');

module.exports = {
  AccessService: AccessService,
  ControlService: ControlService,
  db: db,
  connect: function(connectionString, options, cb) {
    return mongoose.createConnection(connectionString, options, cb);
  },
  mongoose: mongoose,
  formatter: require('./formatter')
};
