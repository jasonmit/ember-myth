/* jshint node: true */
'use strict';

var BroccoliMyth  = require('./lib/broccoli-myth');
var defaults      = require('lodash.defaults');

module.exports = EmberMyth;

function MythPlugin (mythOptions) {
	this.name = 'ember-myth';
	this.ext  = 'css';

	this.mythOptions = defaults({}, mythOptions, {
		inputFile: 'app.css',
		outputFile: 'app.css'
	});
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
		var config = this.project.config(app.env) || {};

		var mythOptions = defaults({}, app.options.mythOptions, config.mythOptions, {
			compress: app.env === 'production',
			outputFile: this.project.name() + '.css'
		});

		app.registry.add('css', new MythPlugin(mythOptions));
	}
};
