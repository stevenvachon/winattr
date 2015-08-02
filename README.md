# winattr [![NPM Version][npm-image]][npm-url] [![Linux Build][travis-image]][travis-url] [![Windows Build][appveyor-image]][appveyor-url] [![Dependency Status][david-image]][david-url]

> Windows file attributes for Node.js

Get and set:
* archive
* hidden
* readonly
* system

… on files and/or directories.

A native binding is used, offering great performance. As a contingency in case that fails, functionality will silently revert to a command line, though it is considerably slower.

## Getting Started

It may go without saying, but this library is not intended to run on anything other than Windows.

[Node.js](http://nodejs.org/) `>= 0.10` is required. To install, type this at the command line:
```
npm install winattr --save-dev
```

### Methods

#### get(path, callback)
`path` - Path to file or directory  
`callback(err,attrs)` - A callback which is called upon completion  
```js
winattr.get("path/to/file.ext", function(err, attrs) {
	if (err==null) console.log(attrs);
});
```

#### getSync(path)
`path` - Path to file or directory  

Returns an `Object` or throws an error if the file or dir cannot be found/accessed.
```js
var attrs = winattr.getSync("path/to/file.ext");

console.log(attrs);
```

#### set(path, attrs, callback)
`path` - Path to file or directory  
`attrs` - An object containing attributes to change  
`callback(err)` - A callback which is called upon completion  
```js
winattr.set("path/to/folder/", {readonly:true}, function(err) {
	if (err==null) console.log("success");
});
```

#### setSync(path, attrs)
`path` - Path to file or directory  
`attrs` - An object containing attributes to change  

Throws an error if the file or dir cannot be found/accessed.
```js
winattr.setSync("path/to/folder/", {readonly:true});
```


## Changelog
* 1.1.0 added binding support to Node.js v4
* 1.0.0
  * added `getSync()`,`setSync()`
  * removed `useExec()`,`useNative()`
  * uses binding by default, with auto-fallback to shell
* 0.2.3 specify which script engine to use in `useExec()` "mode"
* 0.2.2 switched from `fswin.find()` to `fswin.getAttributes()` now that it's available, tested non-existent files
* 0.2.1 nearly pointless fix
* 0.2.0 added [fswin](https://npmjs.org/package/fswin),`useExec()`,`useNative()`
* 0.1.2 tested on Windows
* 0.1.1 package.json optimization
* 0.1.0 initial release


[npm-image]: https://img.shields.io/npm/v/winattr.svg
[npm-url]: https://npmjs.org/package/winattr
[travis-image]: https://img.shields.io/travis/stevenvachon/winattr.svg?label=linux
[travis-url]: https://travis-ci.org/stevenvachon/winattr
[appveyor-image]: https://img.shields.io/appveyor/ci/stevenvachon/winattr.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/stevenvachon/winattr
[david-image]: https://img.shields.io/david/stevenvachon/winattr.svg
[david-url]: https://david-dm.org/stevenvachon/winattr
