var CachingWriter = require('broccoli-caching-writer');
var pathSearcher  = require('include-path-searcher');
var _             = require('lodash');
var mkdirp        = require('mkdirp');
var path          = require('path');
var myth          = require('myth');
var RSVP          = require('rsvp');
var fs            = require('fs');

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
	this.inputFile   = inputFile;
	this.outputFile  = outputFile;
	this.mythOptions = options || {};
}

MythCompiler.prototype.updateCache = function (srcDir, destDir) {
	var destFile = destDir + '/' + this.outputFile;
	var mythOptions;

	mkdirp.sync(path.dirname(destFile));

	mythOptions = {
		filename:  pathSearcher.findFileSync(this.inputFile, srcDir)
	}

	_.merge(mythOptions, this.mythOptions);

	return new RSVP.Promise(function(resolve, reject) {
		fs.readFile(mythOptions.filename, { encoding: 'utf8' }, function (readError, input) {
			if (readError) {
				return reject(readError);
			}

			var css = myth(input, mythOptions).trim();

			fs.writeFile(destFile, css, { encoding: 'utf8' }, function (writeError) {
				if (writeError) {
					return reject(writeError);
				}

				return resolve(css);
			});
		});
	});
}
