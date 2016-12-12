'use strict';

const assert = require('assert');
const utils = require('./utils');
const get = utils.mongoGet;
const Promise = utils.Promise;
const _ = utils._;
const models = utils.models;

const Service = module.exports = function Service(db) {
	this.db = db;
};

function checkModel(model) {
	if (models.indexOf(model) < 0) {
		throw new Error('Invalid model: ' + model);
	}
}

Service.prototype.one = function(model, params) {
	checkModel(model);
	assert.ok(params);

	return this.db[model].findOneAsync(params.where, params.select).then(get);
};

Service.prototype.count = function(model, params) {
	checkModel(model);
	params = params || {};

	return this.db[model].countAsync(params.where);
};

Service.prototype.list = function(model, params) {
	checkModel(model);
	assert.ok(params);

	const self = this,
		limit = 10;
	params = _.pick(params, 'where', 'limit', 'order', 'select', 'offset');
	if (params.limit && (params.limit < 1 || params.limit > 200)) {
		delete params.limit;
	}

	const sort = [];
	if (_.isString(params.order)) {
		params.order.split(/[ ,;]+/g).forEach(function(name) {
			if (name.length < 2) {
				return;
			}
			if (name[0] === '-') {
				sort.push([name.substr(1), -1]);
			} else {
				sort.push([name, 1]);
			}
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
		return this.one(model, params);
	};
	const plural = model[model.length - 1] === 'y' ? model.substr(0, model.length - 1) + 'ies' : model + 's';
	// list model: .topics()
	Service.prototype[plural.toLowerCase()] = function(params) {
		return this.list(model, params);
	};
	// count model: .countTopics()
	Service.prototype['count' + plural] = function(params) {
		return this.count(model, params);
	};
});
