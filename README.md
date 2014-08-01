# winattr [![NPM Version](http://badge.fury.io/js/winattr.svg)](http://badge.fury.io/js/winattr)

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
	if (!error) console.log("success");
});
```
