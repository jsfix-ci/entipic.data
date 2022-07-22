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
    return (
      /* TODO: JSFIX could not patch the breaking change:
      BREAKING CHANGE: mongoose.connect() returns a promise, removed MongooseThenable #5796
      Suggested fix: Only relevant if you depend on the return value being a reference to the mongoose object. In that case, you need to modify the usages of the return value to get the mongoose object from somewhere else.*/
      mongoose.createConnection(connectionString, options, cb)
    );
  },
  mongoose: mongoose,
  model: require('./model')
};
