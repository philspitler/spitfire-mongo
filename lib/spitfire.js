'use strict';

var mongojs = require('mongojs');
var inflection = require('inflection');

function Spitfire(database, generateCollections) {
  //TODO: ADD FILTER OBJECT TO ADD TO QUERIES.  THIS IS INITIALLY FOR AUTH
  this.db = mongojs(database);
  this.generateCollections = generateCollections === undefined ? false : generateCollections;
  this.error = {error: 'Not authorized to generate collections.'};
  this.filter = {};
}

Spitfire.prototype.setFilter = function (filter) {
  this.filter = filter;
  console.log("Filter:");
  console.log(filter);
};

//Get a List of Resources
Spitfire.prototype.getResources = function (resourceName, callback) {
  var collection = this.db.collection(resourceName);
  var query = this.filter;
  collection.find(query, function (err, docs) {
    callback(docs);
  });
};

//Get a Nested List of Resources
Spitfire.prototype.getNestedResources = function (resourceName1, id, resourceName2, callback) {
  var collection = this.db.collection(resourceName2);
  // var query = {};
  var query = this.filter;
  query[inflection.singularize(resourceName1) + '_id'] = mongojs.ObjectId(id);

  collection.find(query, function (err, docs) {
    callback(docs);
  });
};

//Get a Resource
Spitfire.prototype.getResource = function (resourceName, id, callback) {
  var collection = this.db.collection(resourceName);
  var query = this.filter;
  query._id = mongojs.ObjectId(id);
  collection.findOne(query, function (err, doc) {
    callback(doc);
  });
};

Spitfire.prototype.createResource = function (resourceName, body, callback) {
  var self = this;
  this.db.getCollectionNames(function (err, collections) {
    var collection;
    if (self.generateCollections === true || collections.indexOf(resourceName) !== -1) {
      collection = self.db.collection(resourceName);
      collection.findAndModify({query: body, update: body, upsert: true, new: true}, function (err, doc) {
        callback(doc);
      });
    } else {
      callback(self.error);
    }
  });
};

Spitfire.prototype.createNestedResource = function (resourceName1, id, resourceName2, body, callback) {
  body[inflection.singularize(resourceName1)+'_id'] = mongojs.ObjectId(id);
  this.createResource(resourceName2, body, callback);
};

Spitfire.prototype.updateResource = function (resourceName, id, body, callback) {
  var collection = this.db.collection(resourceName);

  //IN CASE _id IS PASSED IN WITH BODY
  delete body._id;

  var query = this.filter;
  query._id = mongojs.ObjectId(id);

  collection.update(query, body, function () {
    collection.findOne(query, function (err, doc) {
      callback(doc);
    });
  });
};

Spitfire.prototype.deleteResource = function (resourceName, id, callback) {
  var collection = this.db.collection(resourceName);
  var query = this.filter;
  query._id = mongojs.ObjectId(id);
  collection.findOne(query, function (err, doc) {
    collection.remove({
      _id:mongojs.ObjectId(id)
    }, function () {
      doc.removed = true;
      callback(doc);
    });
  });
};

module.exports = Spitfire;
