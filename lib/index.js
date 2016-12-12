'use strict';

const AccessService = require('./access');
const ControlService = require('./control');
const db = require('./db');
const mongoose = require('mongoose');

module.exports = {
  AccessService: AccessService,
  ControlService: ControlService,
  db: db,
  connect: function(connectionString, options, cb) {
    return mongoose.createConnection(connectionString, options, cb);
  },
  mongoose: mongoose,
  model: require('./model')
};
