'use strict';

var expect = require('chai').expect;
var Spitfire = require('../lib/spitfire');

describe('Connection', function () {
  var database = 'spitfire-spec';
  var resource = 'forums';
  var spitfire = new Spitfire(database, true);

  before(function (done) {
    done();
  });

  after(function (done) {
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
      it('creates a resource', function(done){
        spitfire.createResource(resource, {name:'testing'}, function (doc) {
          expect(doc.hasOwnProperty('_id')).to.be.true();
          expect(doc.name).to.equal('testing');
          done();
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
