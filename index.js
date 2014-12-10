'use strict';

var mongojs = require('mongojs');
var inflection = require('inflection');

function Spitfire(database) {
  this.db = mongojs(database);
}

//Get a List of Resources
Spitfire.prototype.getResources = function (resourceName, callback) {
  var collection = this.db.collection(resourceName);
  collection.find(function (err, docs) {
    callback(docs);
  });
};

//Get a Nested List of Resources
Spitfire.prototype.getNestedResources = function (resourceName1, id, resourceName2, callback) {
  var collection = this.db.collection(resourceName2);
  var query = {};
  query[inflection.singularize(resourceName1) + '_id'] = id;
  collection.find(query, function (err, docs) {
    callback(docs);
  });
};

//Get a Resource
Spitfire.prototype.getResource = function (resourceName, id, callback) {
  var collection = this.db.collection(resourceName);
  collection.findOne({
    _id:mongojs.ObjectId(id)
  }, function (err, doc) {
    callback(doc);
  });
};

Spitfire.prototype.createResource = function (resourceName, body, callback) {
  var collection = this.db.collection(resourceName);
  collection.insert(body, function (err, doc) {
    callback(doc);
  });
};

Spitfire.prototype.createNestedResource = function (resourceName1, id, resourceName2, body, callback) {
  var collection = this.db.collection(resourceName2);
  body[inflection.singularize(resourceName1)+'_id'] = id;
  collection.insert(body, function (err, doc) {
    callback(doc);
  });
};

Spitfire.prototype.updateResource = function (resourceName, id, body, callback) {
  var collection = this.db.collection(resourceName);
  collection.update({
    _id:mongojs.ObjectId(id)
  }, body, function () {
    collection.findOne({
      _id:mongojs.ObjectId(id)
    }, function (err, doc) {
      callback(doc);
    });
  });
};

Spitfire.prototype.deleteResource = function (resourceName, id, callback) {
  var collection = this.db.collection(resourceName);
  collection.findOne({
    _id:mongojs.ObjectId(id)
  }, function (err, doc) {
    collection.remove({
      _id:mongojs.ObjectId(id)
    }, function () {
      doc.removed = true;
      callback(doc);
    });
  });
};

module.exports = Spitfire;