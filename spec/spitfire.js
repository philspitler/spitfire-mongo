'use strict';

var expect = require('chai').expect;
var Spitfire = require('../lib/spitfire');
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');

describe('Connection', function () {
  var database = 'spitfire-spec';
  var url = 'mongodb://localhost:27017/' + database;
  var db;
  var resource;
  var collection;
  var data;
  var spitfire = new Spitfire(database, true);
  var fixtures = [{
    name: 'Billy Bob'
  },
  {
    name: 'Bubba Jones'
  }];


  before(function (done) {
    // Connect using MongoClient
    MongoClient.connect(url, function(err, theDB) {
      db = theDB;
      resource = 'forums';
      collection = db.collection(resource);
      collection.insert(fixtures, function (err, doc) {
        data = doc;
        done();
      });
    });
  });

  after(function (done) {
    db.dropDatabase();
    db.close();
    done();
  });

  describe('Spitfire', function(){
    describe('#getResources()', function(){
      it('', function(done){
        spitfire.getResources(resource, function (docs) {
          done();
        });
      });
    });
    describe('#getNestedResources()', function(){
      it('', function(){
      });
    });
    describe('#getResource()', function(){
      it('', function(){
      });
    });
    describe('#createResource()', function(){
      it('creates a resource', function(){
        var test = function (doc) {
          collection.findOne(doc, function (err, result) {
            expect(result._id.toString()).to.equal(doc._id.toString());
            expect(result.name).to.equal(doc.name);
          });
        };

        spitfire.createResource(resource, {name:'testing'}, function (doc) {
          test(doc);
        });
      });
    });
    describe('#createNestedResource()', function(){
      it ('', function () {
      });
    });
    describe('#updateResource()', function(){
      it ('', function () {
      });
    });
    describe('#deleteResource()', function(){
      it ('', function () {
      });
    });
  });
});
