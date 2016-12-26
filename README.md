# Spitfire Mongo Adapter

[![npm version](https://badge.fury.io/js/spitfire-node.svg)](https://badge.fury.io/js/spitfire-node)

## MongoDB resource storage adapter

### Requirements:

- Node.js
- MongoDB

### Features:

get, create, update and delete methods for resources

get and create methods for single level nested resources

### Notes:

While single level nesting of resources is limiting, with multiple calls, one should be able to get any related information needed.  If it turns out to be too limiting or intensive, adjustments can be made at that time.

### Example:

https://github.com/philspitler/spitfire-express - Implemented as an Express.js middleware to dynamically generate RESTful endpoints.
