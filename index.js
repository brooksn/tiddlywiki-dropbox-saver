/*\
title: $:/plugins/brooksn/dropbox-saver/index.js
type: application/javascript
module-type: saver

TiddlyWiki5 plugin to save the document to Dropbox.

\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Select the appropriate saver module and set it up
*/
var DropboxUp = function(wiki) {
	this.wiki = wiki;
};
require("$:/plugins/brooksn/dropbox-saver/db.min.js");

var filepath = "$:/plugins/brooksn/dropbox-saver/DropboxPath";
var bearertoken = "$:/plugins/brooksn/dropbox-saver/DropboxBearerToken";

DropboxUp.prototype.save = function(text, method, callback) {
	
	if(method !== "save") {
		return false;
	}

	var path = $tw.wiki.getTiddlerText(filepath) || '';
	var token = $tw.wiki.getTiddlerText(bearertoken) || '';
	if(path.length < 3) { callback('Set Dropbox file path in ' + filepath); }
	if(token.length < 24) { callback('Set Dropbox auth code in ' + bearertoken); }
	
	//var html = document.documentElement.outerHTML;
	var html = text;
	var client = new Dropbox.Client({ token: token });
	client.writeFile(path, html, {
		mode: 'overwrite',
		overwrite: true,
		autorename: false
	});

	return true;
	
};

/*
Information about this saver
*/
DropboxUp.prototype.info = {
	name: "dropboxup",
	priority: 1000,
	capabilities: ['save']
};

/*
Static method that returns true if this saver is capable of working
*/
exports.canSave = function(wiki) {
	var savable = false;
	var path = $tw.wiki.getTiddlerText(filepath) || '';
	var token = $tw.wiki.getTiddlerText(bearertoken) || '';
	if(path.length > 3 && token.length > 44) { savable = true; }
	return savable;
};

/*
Create an instance of this saver
*/
exports.create = function(wiki) {
	return new DropboxUp(wiki);
};

})();
