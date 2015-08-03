/* jshint node: true */
'use strict';

var defaults     = require('lodash.defaults');
var checker      = require('ember-cli-version-checker');
var path         = require('path');
var MythCompiler = require('./lib/broccoli-myth');

module.exports = EmberMyth;

function MythPlugin(options) {
	this.name = 'ember-myth';
	this.ext  = 'css';
	this.options = defaults({}, options);
}

MythPlugin.prototype = {
	constructor: MythPlugin,

	toTree: function (tree, inputPath, outputPath) {
		var options = this.options;
		var trees = [];

		if (tree) {
			trees.push(tree);
		}

		inputPath  = path.join(inputPath, options.inputFile);
		outputPath = path.join(outputPath, options.outputFile);

		return new MythCompiler(trees, inputPath, outputPath, options);
	}
};

function EmberMyth (project) {
	this.project = project;
	this.name = 'Ember CLI Myth';
}

EmberMyth.prototype = {
	constructor: EmberMyth,

	shouldSetupRegistryInIncluded: function() {
		return !checker.isAbove(this, '0.2.0');
	},

	options: function(app) {
		var config = this.project.config(app.env) || {};
		var root = app.project.root;

		var mythOptions = defaults({}, app.options.mythOptions, config.mythOptions, {
			paths: [root],
			inputFile: 'app.css',
			outputFile: this.project.name() + '.css',
			compress: app.env === 'production'
		});

		if (!mythOptions.source) {
			var styles = app.options.trees.styles.dir || app.options.trees.styles
			mythOptions.source = path.join(root, styles, mythOptions.inputFile);
		}

		return mythOptions;
	},

	setupPreprocessorRegistry: function(type, registry) {
		var app = registry.app;
		var mythOptions = this.options(app);
		registry.add('css', new MythPlugin(mythOptions));

		// prevent conflict with broccoli-myth if it's installed
		if (registry.remove) {
			registry.remove('css', 'broccoli-myth');
		}
	},

	included: function(app) {
		if (this._super && this._super.included) {
			this._super.included.apply(this, arguments);
		}

		this.app = app;

		if (this.shouldSetupRegistryInIncluded()) {
			this.setupPreprocessorRegistry('parent', app.registry);
		}
	}
};
