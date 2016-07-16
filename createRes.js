var fs = require('fs');
var path = require('path');

var dir = "../res";
var resFile = '../src/resource.js';
var tmpFile = '../src/resource_tmp.js';

var resProt = function() {

};

resProt.prototype.addProto = function(name, value) {
	this[name] = value;
};

var group = [];
var res = new resProt();

String.prototype.toUnixPath = function() {
	var arr = this.split('\\');
	var ret = arr[0];
	for (var i = 0; i < arr.length; i++) {
		(i === 0) ? (ret = arr[0]) : (ret += '/' + arr[i]);
	}
	return ret;
};

function getFilePath(dir, callback) {
	var dirArr = fs.readdirSync(dir);
	// console.log(dirArr);

	dirArr.forEach(function(file) {
		var pathname = path.join(dir, file);
		if (fs.statSync(pathname).isDirectory()) {
			getFilePath(pathname, callback);
		} else {
			pathname = pathname.toUnixPath(pathname);
			ret = pathname.replace("../", "");
			callback(ret);
		}
	});
}

function buildResFile() {
	var resStr = "var res = " + JSON.stringify(res);
	var funcStr = "\nvar g_resources = [];\nfor(var i in res){g_resources.push(res[i]);}";
	var buffer = resStr + "\n" + funcStr;
	buffer = buffer.replace(/[,]/g, ",\n\t");
	buffer = buffer.replace(/[:]/g, ": ");
	buffer = buffer.replace(/[{]/g, "{\n\t");
	buffer = buffer.replace(/[}]/g, "\n}");
	fs.writeFile(resFile, buffer, 'utf-8', function(err, data) {
		if (err) {
			console.log(err);
		} else {
			if (fs.exists(tmpFile)) {
				fs.unlinkSync(tmpFile);
			}
			console.log("-- createResFile over --");
		}
	});
}


if (fs.exists(resFile)) {
	fs.renameSync(resFile, tmpFile);
}

getFilePath(dir, function(pathname) {
	var arr = pathname.split('/');
	var baseArr = arr[arr.length - 1].split(".", 1);
	var basename = baseArr[0];

	var extname = path.extname(pathname);
	if (extname !== ".js" && extname !== ".ico") {
		res[basename] = pathname;
	}
	


	// if (arr.length == 2) {
	// 	var baseArr = arr[1].split(".", 1);
	// 	var basename = baseArr[0];
	// 	var typename = basename;
	// 	// res.addProto(typename, pathname);
	// 	res[typename] = pathname;
	// } else {
	// var typename = arr[arr.length - 2];
	// var baseArr = arr[arr.length - 1].split(".", 1);
	// var basename = baseArr[0];
	// res[basename] = pathname;
	// console.log(fs.statSync().isDirectory())
	// res.addProto(typename, res[typename] || {});
	// res[typename](typename, )
	// res[typename] = res[typename] || {};
	// res[typename][basename] = pathname;
	// var xx = group.indexOf(typename);
	// if (xx === -1) {
	// 	group.push(typename);
	// }
	// }
});
console.log(res);
buildResFile();