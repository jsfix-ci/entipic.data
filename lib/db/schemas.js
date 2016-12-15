'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const util = require('util');

const TABLE_PREFIX = process.env.ENTIPIC_TABLE_PREFIX || 'entipic_v1_';

/**
 * Base schema
 */
function BaseSchema() {
	Schema.apply(this, arguments);

	if (!this.paths.createdAt) {
		this.add({
			createdAt: {
				type: Date,
				default: Date.now
			}
		});
	}
	if (!this.paths.updatedAt) {
		this.add({
			updatedAt: {
				type: Date
			}
		});
	}

	this.pre('save', function(next) {
		this.updatedAt = Date.now();
		next();
	});
}

util.inherits(BaseSchema, Schema);

/**
 * Entity schema
 */
const Entity = exports.Entity = new BaseSchema({
	// shortId
	_id: String,
	name: {
		type: String,
		trim: true,
		required: true,
		maxlength: 200,
		minlength: 2
	},
	uniqueName: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		lowercase: true,
		maxlength: 100,
		minlength: 2
	},
	country: {
		type: String,
		trim: true,
		lowercase: true,
		maxlength: 2,
		minlength: 2
	},
	type: {
		type: String,
		enum: ['person', 'place', 'group']
	},
	types: {
		type: [String]
	},
	props: {
		type: Schema.Types.Mixed
	},
	// every time english wiki id
	wikiId: {
		type: Number
	},
	// every time english wiki name
	wikiName: {
		type: String,
		trim: true,
		maxlength: 200,
		minlength: 2
	},
	description: {
		type: String,
		maxlength: 400,
		minlength: 50,
		trim: true
	},

	pictures: {
		type: [String],
		validate: [
			function(val) {
				return val.length > 0;
			},
			'{PATH} cannot be empty'
		],
		required: true
	},

	pictureId: {
		type: String,
		required: true,
		lowercase: true,
		maxlength: 32,
		minlength: 32,
		unique: true
	},
	pictureHost: {
		type: String,
		trim: true,
		required: true,
		lowercase: true,
		maxlength: 50,
		minlength: 4
	},
	refIP: {
		type: String,
		required: true,
		lowercase: true,
		maxlength: 50,
		minlength: 4,
		trim: true
	},
	refHost: {
		type: String,
		trim: true,
		required: true,
		lowercase: true,
		maxlength: 100,
		minlength: 4
	},
	// locale wikipedia language pages
	popularity: {
		type: Number
	}
}, {
	collection: [TABLE_PREFIX, 'entities'].join('')
});


/**
 * Unique name schema
 */
const UniqueName = exports.UniqueName = new BaseSchema({
	// MD5(locale|uniqueName)
	_id: {
		type: String,
		maxlength: 32,
		minlength: 32
	},
	name: {
		type: String,
		required: true,
		trim: true,
		maxlength: 200,
		minlength: 2
	},
	uniqueName: {
		type: String,
		trim: true,
		required: true,
		lowercase: true,
		maxlength: 200,
		minlength: 2
	},
	country: {
		type: String,
		lowercase: true,
		trim: true,
		maxlength: 2,
		minlength: 2
	},
	lang: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		maxlength: 6,
		minlength: 2
	},
	// ro_ro
	locale: {
		type: String,
		lowercase: true,
		required: true,
		minlength: 2,
		maxlength: 10
	},
	wikiId: {
		type: Number
	},
	wikiName: {
		type: String,
		trim: true
	},
	pictureId: {
		type: String,
		required: true,
		lowercase: true,
		maxlength: 32,
		minlength: 32
	},
	entityId: {
		type: String,
		trim: true,
		required: true
	},
	popularity: {
		type: Number,
		min: 0
	}
}, {
	collection: [TABLE_PREFIX, 'uniquenames'].join('')
});


/**
 * Picture schema
 */
const Picture = exports.Picture = new BaseSchema({
	// MD5 (dHash)
	_id: {
		type: String,
		maxlength: 32,
		minlength: 32
	},

	dHash: {
		type: String,
		maxlength: 16,
		minlength: 16
	},

	url: {
		type: String,
		required: true,
		minlength: 10,
		maxlength: 500
	},

	host: {
		type: String,
		required: true,
		lowercase: true,
		maxlength: 50,
		minlength: 4
	}
}, {
	collection: [TABLE_PREFIX, 'pictures'].join('')
});


/**
 * Unknown name schema
 */
const UnknownName = exports.UnknownName = new BaseSchema({
	// MD5 (name)
	_id: {
		type: String,
		maxlength: 32,
		minlength: 32
	},

	name: {
		type: String,
		required: true,
		maxlength: 200,
		minlength: 2
	},

	uniqueName: {
		type: String,
		required: true,
		lowercase: true,
		maxlength: 200,
		minlength: 2
	},
	country: {
		type: String,
		lowercase: true,
		maxlength: 2,
		minlength: 2
	},
	lang: {
		type: String,
		lowercase: true,
		maxlength: 2,
		minlength: 2
	},
	ip: {
		type: String,
		required: true,
		lowercase: true,
		maxlength: 50,
		minlength: 4
	},
	host: {
		type: String,
		required: true,
		lowercase: true,
		maxlength: 100,
		minlength: 4
	},

	status: {
		type: String,
		enum: ['new', 'processed', 'error', 'success'],
		default: 'new'
	},

	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 60 * 24 * 7 // 7 days
	}
}, {
	collection: [TABLE_PREFIX, 'unknownnames'].join('')
});


Entity.set('toObject', {
	getters: true
});
UniqueName.set('toObject', {
	getters: true
});
Picture.set('toObject', {
	getters: true
});
UnknownName.set('toObject', {
	getters: true
});
