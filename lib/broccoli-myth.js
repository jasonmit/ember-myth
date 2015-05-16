var CachingWriter = require('broccoli-caching-writer');
var pathSearcher  = require('include-path-searcher');
var defaults      = require('lodash.defaults');
var mkdirp        = require('mkdirp');
var path          = require('path');
var myth          = require('myth');
var RSVP          = require('rsvp');
var fs            = require('fs');

var writeFile     = RSVP.denodeify(fs.writeFile);
var readFile      = RSVP.denodeify(fs.readFile);

module.exports = MythCompiler;

MythCompiler.prototype = Object.create(CachingWriter.prototype)
MythCompiler.prototype.constructor = MythCompiler

function MythCompiler (sourceTrees, inputFile, outputFile, options) {
	if (!(this instanceof MythCompiler)) {
		return new MythCompiler(sourceTrees, inputFile, outputFile, options)
	}

	CachingWriter.apply(this, [arguments[0]].concat(arguments[3]))

	if (inputFile.charAt(0) === '/') {
		inputFile = inputFile.substr(1);
	}

	this.sourceTrees = sourceTrees;
	this.outputFile  = outputFile;
	this.inputFile   = inputFile;
	this.mythOptions = options;
}

MythCompiler.prototype.updateCache = function (srcDir, destDir) {
	var destFile = destDir + '/' + this.outputFile;
	var mythOptions = defaults({}, this.mythOptions, {
		filename:  pathSearcher.findFileSync(this.inputFile, srcDir)
	});

	mkdirp.sync(path.dirname(destFile));

	return readFile(mythOptions.filename, { encoding: 'utf8' }).then(function (input) {
		return writeFile(destFile, myth(input, mythOptions).trim(), { encoding: 'utf8' });
	});
}
