'use strict';

var core = require('entipic.core');
var Promise = core.Promise;
var storage = require('../index');
var models = require('../utils').models;

var source = storage.db(storage.connect(process.env.SOURCE_DB));
var target = storage.db(storage.connect(process.env.TARGET_DB));

var accessService = new storage.AccessService(source);
var controlService = new storage.ControlService(target);

function copyModel(model, page) {
	page = page || 0;

	console.log(model, 'page', page);

	return accessService.list(model, {
			limit: 50,
			offset: 50 * page,
			where: {}
		})
		.then(function(items) {
			if (items && items.length > 0) {
				return Promise.map(items, function(item) {
						console.log('creating', model, item.id);
						return controlService.create(model, item);
					})
					.then(function() {
						return copyModel(model, ++page);
					});
			}
		});
}

function copyDb() {
	return Promise.each(models, function(model) {
		console.log('START copy', model);
		return copyModel(model).then(function() {
			console.log('END copy', model);
		});
	});
}

copyDb()
	.then(function() {
		console.log('END');
	})
	.catch(function(error) {
		console.log(error);
	});
