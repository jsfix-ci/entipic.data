'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var core = require('entipic.core');
var util = require('util');


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
 * Topic schema
 */
var Topic = module.exports.Topic = new BaseSchema({
  _id: Number,

  uniqueName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    maxlength: 100,
    minlength: 4
  },
  country: {
    type: String,
    lowercase: true,
    maxlength: 2,
    minlength: 2
  },
  type: {
    type: String,
    enum: ['person', 'place', 'group']
  },

  englishWikiId: {
    type: Number
  },
  englishWikiName: {
    type: String,
    maxlength: 200,
    minlength: 2
  },
  englishWikiDescription: {
    type: String,
    maxlength: 400,
    minlength: 50
  },

  pictureId: {
    type: String,
    required: true,
    lowercase: true,
    maxlength: 32,
    minlength: 32,
    unique: true
  },
  pictureDomain: {
    type: String,
    required: true,
    lowercase: true,
    maxlength: 50,
    minlength: 4
  }
});


/**
 * Unique name schema
 */
var UniqueName = module.exports.UniqueName = new BaseSchema({
  _id: {
    type: String,
    maxlength: 32,
    minlength: 32
  },

  uniqueName: {
    type: String,
    required: true,
    lowercase: true,
    maxlength: 100,
    minlength: 4
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

  pictureId: {
    type: String,
    //required: true,
    lowercase: true,
    maxlength: 32,
    minlength: 32
  },

  topicId: {
    type: Number,
    required: true
  },
  
  status: {
    type: String,
    required: true,
    enum: ['selected', 'active'],
    default: 'active'
  }
});


/**
 * Picture schema
 */
var Picture = module.exports.Picture = new BaseSchema({
  // MD5 (dHash)
  _id: {
    type: String,
    maxlength: 32,
    minlength: 32
  },

  topicId: {
    type: Number,
    required: true
  },

  dHash: {
    type: String,
    maxlength: 16,
    minlength: 16
  },

  sourceUrl: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },

  sourceDomain: {
    type: String,
    required: true,
    lowercase: true,
    maxlength: 50,
    minlength: 4
  },
  status: {
    type: String,
    required: true,
    enum: ['selected', 'active'],
    default: 'active'
  }
});


Topic.set('toObject', {
  getters: true
});
UniqueName.set('toObject', {
  getters: true
});
Picture.set('toObject', {
  getters: true
});
