'use strict';

var expect = require('chai').expect;
var Spitfire = require('../lib/spitfire');
var mongojs = require('mongojs');

describe('Connection', function() {
	var database = 'spitfire-spec';
	var resource = 'forums';
	var spitfire = new Spitfire(database, true);
	var db = mongojs(database);
	var forum;
	var topic;
	var post;
	var user;

	before(function(done) {
		var forums = db.collection('forums');
		var topics = db.collection('topics');
		var posts = db.collection('posts');
		var users = db.collection('users');
		users.insert({
			name: 'testuser'
		}, function(err, user_doc) {
			user = user_doc;
			forums.insert({
				name: 'forum 1',
				user_id: user_doc._id
			}, function(err, forum_doc) {
				forum = forum_doc;
				topics.insert({
					name: 'topic 1',
					user_id: user_doc._id,
					forum_id: forum_doc._id
				}, function(err, topic_doc) {
					topic = topic_doc;
					posts.insert({
						name: 'post 1',
						user_id: user_doc._id,
						topic_id: topic_doc._id
					}, function(err, post_doc) {
						post = post_doc;
						done();
					});
				});
			});
		});
	});

	after(function(done) {
		db.dropDatabase();
		db.close();
		done();
	});

	describe('Spitfire', function() {
		describe('#getResources()', function() {
			it('returns an array', function(done) {
				spitfire.getResources(resource, function(docs) {
					expect(docs).to.be.instanceof(Array);
					done();
				});
			});
			it('matches up with the test data', function(done) {
				spitfire.getResources(resource, function(docs) {
					expect(docs[0]._id.toString()).to.equal(forum._id.toString());
					done();
				});
			});
		});
		describe('#getNestedResources()', function() {
			it('returns an array', function(done) {
				spitfire.getNestedResources(resource, forum._id.toString(), 'topics', function(docs) {
					expect(docs).to.be.instanceof(Array);
					expect(docs.length).to.be.at.least(1);
					done();
				});
			});
			it('matches up with the test data', function(done) {
				spitfire.getNestedResources(resource, forum._id, 'topics', function(docs) {
					expect(docs[0]._id.toString()).to.equal(topic._id.toString());
					expect(docs[0].forum_id.toString()).to.equal(forum._id.toString());
					done();
				});
			});
		});
		describe('#getResource()', function() {
			it('gets a resource', function(done) {
				spitfire.getResource(resource, forum._id, function(doc) {
					expect(doc._id.toString()).to.equal(forum._id.toString());
					done();
				});
			});
		});
		describe('#getResource() "with a filter"', function() {
			it('gets a filtered resource', function(done) {
				spitfire.getResource(resource, forum._id, function(doc) {
					expect(doc._id.toString()).to.equal(forum._id.toString());
					done();
				}, {
					user_id: user._id
				});
			});
		});
		describe('#createResource()', function() {
			it('creates a resource', function(done) {
				spitfire.createResource(resource, {
					name: 'testing'
				}, function(doc) {
					expect(doc.hasOwnProperty('_id')).to.be.true();
					expect(doc.name).to.equal('testing');
					done();
				});
			});
		});

		describe('#createNestedResource()', function() {
			it('creates a nested resource', function(done) {
				spitfire.createNestedResource(resource, forum._id.toString(), 'topics', {
					name: 'topic 2'
				}, function(doc) {
					expect(doc.hasOwnProperty('_id')).to.be.true();
					expect(doc.name).to.equal('topic 2');
					expect(doc.forum_id.toString()).to.equal(forum._id.toString());
					done();
				});
			});
		});
		describe('#updateResource()', function() {
			it('updates a resource', function(done) {
				spitfire.updateResource(resource, forum._id, {
					name: 'forum 1 updated'
				}, function(doc) {
					expect(doc._id.toString()).to.equal(forum._id.toString());
					expect(doc.name).to.equal('forum 1 updated');
					done();
				});
			});
		});
		describe('#deleteResource()', function() {
			it('deletes a resource', function(done) {
				spitfire.deleteResource(resource, forum._id, function(doc) {
					expect(doc.removed).to.be.true();
					done();
				});
			});
		});
	});
});
