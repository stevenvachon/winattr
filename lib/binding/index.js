"use strict";
const fswin = require("fswin");

const convertAttrs = require("./convertAttrs");



const get = (path, callback) =>
{
	fswin.getAttributes(path, result =>
	{
		if (result === null)
		{
			// fswin does not return an error -- problem could be ENOENT,EPERM,etc
			callback( new Error("unknown error") );
			return;
		}

		let attrs = {};

		for (let i in result)
		{
			if (i.startsWith("IS_"))
			{
				attrs[i] = result[i];
			}
		}

		callback( null, convertAttrs.from(attrs) );
	});
};



const getSync = path =>
{
	const result = fswin.getAttributesSync(path);

	if (result === null)
	{
		// fswin does not return an error -- problem could be ENOENT,EPERM,etc
		throw new Error("unknown erorr");
	}

	return convertAttrs.from(result);
};



const set = (path, attrs, callback) =>
{
	fswin.setAttributes(path, convertAttrs.to(attrs), success =>
	{
		// fswin does not return an error -- problem could be ENOENT,EPERM,etc
		callback( success===true ? null : new Error("unknown error") );
	});
};



const setSync = (path, attrs) =>
{
	const success = fswin.setAttributesSync( path, convertAttrs.to(attrs) );

	if (success === false)
	{
		// fswin does not return an error -- problem could be ENOENT,EPERM,etc
		throw new Error("unknown erorr");
	}
};



module.exports =
{
	get,
	getSync,
	set,
	setSync
};
