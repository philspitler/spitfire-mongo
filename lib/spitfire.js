'use strict';

var mongojs = require('mongojs');
var inflection = require('inflection');

function Spitfire(database, generateCollections) {
	//TODO: ADD FILTER OBJECT TO ADD TO QUERIES.  THIS IS INITIALLY FOR AUTH
	this.db = mongojs(database);
	this.generateCollections = generateCollections === undefined ? false : generateCollections;
	this.error = {
		error: 'Not authorized to generate collections.'
	};
}

//Get a List of Resources
Spitfire.prototype.getResources = function(resourceName, callback, filter) {
	let query = filter || {};
	let collection = this.db.collection(resourceName);
	collection.find(query, function(err, docs) {
		callback(docs);
	});
};

//Get a Nested List of Resources
Spitfire.prototype.getNestedResources = function(resourceName1, id, resourceName2, callback, filter) {
	var collection = this.db.collection(resourceName2);
	// let query = {};
	let query = filter || {};
	query[inflection.singularize(resourceName1) + '_id'] = mongojs.ObjectId(id);

	collection.find(query, function(err, docs) {
		callback(docs);
	});
};

//Get a Resource
Spitfire.prototype.getResource = function(resourceName, id, callback, filter) {
	var collection = this.db.collection(resourceName);
	let query = filter || {};
	query._id = mongojs.ObjectId(id);
	collection.findOne(query, function(err, doc) {
		callback(doc);
	});
};

Spitfire.prototype.createResource = function(resourceName, body, callback) {
	var self = this;
	this.db.getCollectionNames(function(err, collections) {
		var collection;
		if (self.generateCollections === true || collections.indexOf(resourceName) !== -1) {
			collection = self.db.collection(resourceName);
			collection.findAndModify({
				query: body,
				update: body,
				upsert: true,
				new: true
			}, function(err, doc) {
				callback(doc);
			});
		} else {
			callback(self.error);
		}
	});
};

Spitfire.prototype.createNestedResource = function(resourceName1, id, resourceName2, body, callback) {
	body[inflection.singularize(resourceName1) + '_id'] = mongojs.ObjectId(id);
	this.createResource(resourceName2, body, callback);
};

Spitfire.prototype.updateResource = function(resourceName, id, body, callback, filter) {
	var collection = this.db.collection(resourceName);

	//IN CASE _id IS PASSED IN WITH BODY
	delete body._id;

	let query = filter || {};
	query._id = mongojs.ObjectId(id);

	collection.update(query, body, function() {
		collection.findOne(query, function(err, doc) {
			callback(doc);
		});
	});
};

Spitfire.prototype.deleteResource = function(resourceName, id, callback, filter) {
	var collection = this.db.collection(resourceName);
	let query = filter || {};
	query._id = mongojs.ObjectId(id);
	collection.findOne(query, function(err, doc) {
		collection.remove({
			_id: mongojs.ObjectId(id)
		}, function() {
			doc.removed = true;
			callback(doc);
		});
	});
};

module.exports = Spitfire;
