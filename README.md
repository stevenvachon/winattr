# winattr [![NPM Version][npm-image]][npm-url] ![Build Status][ghactions-image] [![Coverage Status][codecov-image]][codecov-url]

> Foolproof Windows® file attributes for Node.js

Get and set:
* `archive`
* `hidden`
* `readonly`
* `system`

… on files and/or directories.

A native binding is used, offering great performance. As a contingency in case that fails, functionality will silently revert to a command line, though it is considerably slower.


## Installation

It may go without saying, but this library is not intended to run on anything other than Windows.

[Node.js](http://nodejs.org/) `>= 8` is required. To install, type this at the command line:
```
npm install winattr
```


## Methods

### `get(path, callback)`
`path` - Path to file or directory  
`callback(err,attrs)` - A callback which is called upon completion  
```js
winattr.get('path/to/file.ext', (err, attrs) => {
  if (err == null) {
    console.log(attrs);
  }
});
```

### `getSync(path)`
`path` - Path to file or directory  

Returns an `Object` or throws an error if the file or dir cannot be found/accessed.
```js
const attrs = winattr.getSync('path/to/file.ext');

console.log(attrs);
```

### `set(path, attrs, callback)`
`path` - Path to file or directory  
`attrs` - An object containing attributes to change  
`callback(err)` - A callback which is called upon completion  
```js
winattr.set('path/to/folder/', {readonly:true}, err => {
  if (err == null) {
    console.log('success');
  }
});
```

### `setSync(path, attrs)`
`path` - Path to file or directory  
`attrs` - An object containing attributes to change  

Throws an error if the file or dir cannot be found/accessed.
```js
winattr.setSync('path/to/folder/', {readonly:true});
```


[npm-image]: https://img.shields.io/npm/v/winattr
[npm-url]: https://npmjs.com/winattr
[ghactions-image]: https://img.shields.io/github/actions/workflow/status/stevenvachon/winattr/test.yml?branch=3.x.x
[codecov-image]: https://img.shields.io/codecov/c/github/stevenvachon/winattr/3.x.x
[codecov-url]: https://app.codecov.io/github/stevenvachon/winattr/tree/3.x.x
