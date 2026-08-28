# winattr [![NPM Version][npm-image]][npm-url] ![Build Status][ghactions-image] [![Coverage Status][codecov-image]][codecov-url]

> Foolproof Windows® file attributes.

Get and set the following on a file or directory:

- `archive`
- `hidden`
- `readonly`
- `system`

A native binding is used, offering great performance. As a contingency in case that fails, functionality will silently revert to a command line, though it is considerably slower.

> [!IMPORTANT]
>
> It may go without saying, but this library is not intended to run on anything other than Windows.

## Install

```shell
npm install winattr
```

## Usage

```js
import { getAttributes, getAttributesSync, setAttributes, setAttributesSync } from 'winattr';

await getAttributes('path/to/file.ext'); //-> {…}
getAttributesSync('path/to/file.ext'); //-> {…}

await setAttributes('path/to/folder/', { readonly: true });
setAttributesSync('path/to/folder/', { readonly: true });
```

[npm-image]: https://img.shields.io/npm/v/winattr
[npm-url]: https://npmjs.com/winattr
[ghactions-image]: https://img.shields.io/github/actions/workflow/status/stevenvachon/winattr/test.yml
[codecov-image]: https://img.shields.io/codecov/c/github/stevenvachon/winattr
[codecov-url]: https://app.codecov.io/github/stevenvachon/winattr/
