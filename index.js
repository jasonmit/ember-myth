/* jshint node: true */
'use strict';

var defaults     = require('lodash.defaults');
var checker      = require('ember-cli-version-checker');

var BroccoliMyth = require('./lib/broccoli-myth');

module.exports = EmberMyth;

function MythPlugin (mythOptions) {
	this.name = 'ember-myth';
	this.ext  = 'css';

	this.mythOptions = defaults({}, mythOptions, {
		inputFile: 'app.css',
		outputFile: 'app.css'
	});
}

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
}

EmberMyth.prototype = {
	constructor: EmberMyth,

	shouldSetupRegistryInIncluded: function() {
		return !checker.isAbove(this, '0.2.0');
	},

	setupPreprocessorRegistry: function(type, registry) {
		var app    = this.app;
		var config = this.project.config(app.env) || {};

		var mythOptions = defaults({}, app.options.mythOptions, config.mythOptions, {
			compress: app.env === 'production',
			outputFile: this.project.name() + '.css'
		});

		app.registry.add('css', new MythPlugin(mythOptions));
	},

	included: function (app) {
		this.app = app;

		if (this._super) {
			this._super.included.apply(this, arguments);
		}

		if (this.shouldSetupRegistryInIncluded()) {
			this.setupPreprocessorRegistry('parent', app.registry);
		}
	}
};
