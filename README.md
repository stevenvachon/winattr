# winattr [![NPM Version](http://badge.fury.io/js/winattr.svg)](http://badge.fury.io/js/winattr) [![Build Status](https://secure.travis-ci.org/stevenvachon/winattr.svg)](http://travis-ci.org/stevenvachon/winattr) [![Build status](https://ci.appveyor.com/api/projects/status/ycr7q9krha8cjojx)](https://ci.appveyor.com/project/stevenvachon/winattr) [![Dependency Status](https://david-dm.org/stevenvachon/winattr.svg)](https://david-dm.org/stevenvachon/winattr)

> Windows file attributes for Node.js

Get and set:
* archive
* hidden
* readonly
* system

… on files and/or directories.

## Getting Started

It may go without saying, but this library is not intended to run on anything other than Windows.

[Node.js](http://nodejs.org/) `~0.10` is required. To install, type this at the command line:
```
npm install winattr --save-dev
```

### Methods

#### get(path, callback)
`path` - Path to file or directory  
`callback(err,data)` - A callback which is called upon completion  
```js
var winattr = require("winattr");

winattr.get("path/to/file.ext", function(err, data) {
	console.log(data);
});
```

#### set(path, attrs, callback)
`path` - Path to file or directory  
`attrs` - An object containing attributes to change  
`callback(err)` - A callback which is called upon completion  
```js
var winattr = require("winattr");

winattr.set("path/to/folder/", {readonly:true}, function(err) {
	if (!err) console.log("success");
});
```

#### useExec()
Switch back from using the native binding in case of error (most likely caused by V8 API changes). This is loaded by default.  
```js
var winattr = require("winattr");

try {
	winattr.useNative();
} catch (err) {
	winattr.useExec();
}
```

#### useNative()
Use native binding offering **far greater performance** over the default `useExec()`.  
```js
var winattr = require("winattr").useNative();
```

## Changelog
* 0.2.1 nearly pointless fix
* 0.2.0 added [fswin](https://npmjs.org/package/fswin),`useExec()`,`useNative()`
* 0.1.2 tested on Windows
* 0.1.1 package.json optimization
* 0.1.0 initial release
