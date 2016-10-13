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

// windows路径转为unix路径
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
	
	// 遍历数组 
	dirArr.forEach(function(file) {
		var pathname = path.join(dir, file);
		if (fs.statSync(pathname).isDirectory()) {
			getFilePath(pathname, callback);
		} else {
			pathname = pathname.toUnixPath(pathname);
			var ret = pathname.replace("../", "");
			callback(ret);
		}
	});
}

function buildResFile() {
	var resStr = "var res = " + JSON.stringify(res, 0, 2);
	var funcStr = "\nvar g_resources = [];\nfor(var i in res){g_resources.push(res[i]);}";
	var buffer = resStr + "\n" + funcStr;
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
	var type = extname;
	type = type.replace('.', '');
	
	if (type === "js" || type === "ico" || type === "tps") {
		console.log('the type <' + type + '> is not support!');
	} else {
		var newname = (type ==='png') ? basename : (basename + "_" + type);
		res[newname] = pathname;
	}
});
console.log(res);
buildResFile();