var fs = require('fs');
var path = require('path');

var dir = "../src";
var jsonFile = '../project.json';
var tmpFile = '../project_tmp.json';

var json = null;
var fileArr = [];

String.prototype.toUnixPath = function() {
	var arr = this.split('\\');
	var ret = arr[0];
	for (var i = 0; i < arr.length; i++) {
		(i === 0) ? (ret = arr[0]) : (ret += '/' + arr[i]);
	}
	return ret;
};

function createJson() {
	console.log('-- start get filepath --');
	getFilePath(dir, function(pathname) {
		var extname = path.extname(pathname);
		if (extname === '.js') {
			fileArr.push(pathname);
		}
	});
	buildJson();
}

function getFilePath(dir, callback) {
	var dirArr = fs.readdirSync(dir);
	dirArr.forEach(function(file) {
		if (file == ".svn") {
			console.log('ignore the dir or file : ' + file);
		} else {
			var pathname = path.join(dir, file);
			if (fs.statSync(pathname).isDirectory()) {
				getFilePath(pathname, callback);
			} else {
				pathname = pathname.toUnixPath(pathname);
				ret = pathname.replace("../", "");
				callback(ret);
			}
		}
	});
}

function buildJson() {
	json.jsList = fileArr;
	str = JSON.stringify(json, '', 4);

	fs.writeFile(jsonFile, str, 'utf-8', function(err, data) {
		if (err) console.log(err);
		console.log(str);
		console.log("-- createJson over --");

		fs.unlink(tmpFile, function(data) {
			console.log('-- remove project_tmp.json --');
		});
	});
}

// read JSON data
fs.readFile(jsonFile, 'utf-8', function(err, data) {
	if (err) {
		console.log('------------- read json error -----------');
		console.log(err);
	} else {
		console.log("-- read json data --");
		fs.renameSync(jsonFile, tmpFile);
		json = JSON.parse(data);
		createJson();
	}
});

module.exports = createJson;