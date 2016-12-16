// Node includes
var fs = require("fs");
var path = require("path");
var util = require("util");
var os = require("os");

// Third-party includes
var dateFormat = require("dateformat");

var CONFIG = {
	IN_FOLDER: "./in/",
	OUT_FOLDER: "./out/",
	EXTENSIONS: ["jpg", "jpeg", "png", "gif", "cr2", "mov", "mp4", "avi"]
};

/*
var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
*/

var filesData = [
	/*
	{
		originalIndex: -1,
		originalName: "",
		creationDate: null,
		dateName: "",
		extension: "",
		newName: ""
	}
	*/
];

/*
var getNextFileName = function (fileNames, name, _nextSuffixI, _nextSuffixPrefix) {
	var extension = path.extname(name);
	var basename = path.basename(name, extension);

	_nextSuffixI = _nextSuffixI || 1;
	_nextSuffixPrefix = _nextSuffixPrefix || "";

	if (_nextSuffixI >= letters.length) {
		_nextSuffixI = 0;

		if (_nextSuffixPrefix) {
			var beginning = _nextSuffixPrefix.slice(0, _nextSuffixPrefix.length - 1);
			var last = _nextSuffixPrefix.slice(_nextSuffixPrefix.length - 1);

			var lastIndex = letters.indexOf(last);

			if (lastIndex < letters.length - 1) {
				last = letters[lastIndex++];
			} else {
				last = letters[0];
			}

			_nextSuffixPrefix += beginning + last;
		} else {
			_nextSuffixPrefix = letters[0];
		}
	}

	var nextSuffix = _nextSuffixPrefix + letters[_nextSuffixI];

	var nextName = basename + nextSuffix + extension;

	if (fileNames.indexOf(nextName) === -1) {
		return nextName;
	}

	return getNextFileName(fileNames, name, _nextSuffixI + 1, _nextSuffixPrefix);
}
*/

module.exports = function (grunt) {

	grunt.initConfig({
		"clean": {
			out: [CONFIG.OUT_FOLDER + "*", "!" + CONFIG.OUT_FOLDER + ".gitkeep"]
		}
	});

	grunt.registerTask("rename", "Rename all photo/video files according to their creation date", function () {
		var extensions = CONFIG.EXTENSIONS;
		extensions = extensions.map(function (item) {
			return "." + item;
		});

		// Gather file names and data:

		var fileNamesCount = {
			// "fileName.jpg": 1
		};

		var files = fs.readdirSync(CONFIG.IN_FOLDER);
		files.forEach(function (fileName, index, array) {
			var extension = path.extname(fileName);
			extension = extension.toLowerCase();

			if (extensions.indexOf(extension) === -1) {
				return;
			}

			var stat = fs.statSync(CONFIG.IN_FOLDER + fileName);
			var birthtime = stat.birthtime;

			var offset = grunt.option("offset");
			if (offset) {
				if (typeof offset === "number") {
					birthtime.setTime(birthtime.getTime() + offset);
				} else {
					grunt.log.error("offset must be a number (milliseconds)");
				}
			}

			var dateName = dateFormat(birthtime, "yyyy-mm-dd HH.MM.ss");
			var newName = dateName + extension;

			var count = fileNamesCount[newName] || 0;
			fileNamesCount[newName] = ++count;

			if (count > 1) {
				newName = dateName + "(" + (count - 1) + ")" + extension;
			}

			var fileData = {
				originalIndex: index,
				originalName: fileName,
				creationDate: birthtime,
				dateName: dateName,
				extension: extension,
				newName: newName
			};

			filesData.push(fileData);
		});

		// Copy and assign new names to files:

		for (var i = 0, l = filesData.length; i < l; i++) {
			var fileData = filesData[i];

			grunt.file.copy(CONFIG.IN_FOLDER + fileData.originalName, CONFIG.OUT_FOLDER + fileData.newName);

			grunt.log.writeln(fileData.originalIndex, fileData.originalName, "->", fileData.newName);
		}
	});

	grunt.registerTask("default", [
		"clean",
		"rename"
	]);

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
};
