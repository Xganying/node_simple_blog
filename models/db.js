
var setting = require('../setting');
var db = require('mongodb').db;
var connection = require('mongodb').connection;
var server = require('mongodb').server;

module.exports = new db(setting.db, new server(setting.host, connection.DEFAULT_PORT), {safe:true});