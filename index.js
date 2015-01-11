/* jshint node: true */
'use strict';

var CachingWriter = require('broccoli-caching-writer');
var BroccoliMyth  = require('./lib/broccoli-myth');
var _             = require('lodash');

module.exports = EmberMyth;

function MythPlugin (mythOptions) {
	this.name   = 'ember-myth';
	this.ext    = 'css';
	mythOptions = mythOptions || {};

	mythOptions.inputFile  = mythOptions.inputFile  || 'app.css';
	mythOptions.outputFile = mythOptions.outputFile || 'app.css';
	this.mythOptions       = mythOptions;
};

MythPlugin.prototype = {
	constructor: MythPlugin,

	toTree: function (tree, inputPath, outputPath) {
		var trees = [];

		if (tree) {
			trees.push(tree);
		}

		if (this.mythOptions.paths) {
			trees = trees.concat(this.mythOptions.paths);
		}

		inputPath  += '/' + this.mythOptions.inputFile;
		outputPath += '/' + this.mythOptions.outputFile;

		return new BroccoliMyth(trees, inputPath, outputPath, this.mythOptions);
	}
};

function EmberMyth (project) {
	this.project = project;
	this.name    = 'Ember CLI Myth';
};

EmberMyth.prototype = {
	constructor: EmberMyth,

	included: function (app) {
		var mythOptions = app.options.mythOptions || {};
		var config      = this.project.config(app.env) || {};

		_.merge(mythOptions, config.mythOptions);

		if ((mythOptions.sourcemap === undefined) && (app.env === 'development')) {
			mythOptions.sourcemap = false;
		}

		mythOptions.outputFile = mythOptions.outputFile || this.project.name() + '.css';

		app.registry.add('css', new MythPlugin(mythOptions));
	}
};
