"use strict";
const checkWindows = require("./checkWindows");
const {resolve: resolvePath} = require("path");
const whichLib = require("./whichLib");



const get = (path, callback) =>
{
	if (checkWindows.async(callback))
	{
		return whichLib.run(() => whichLib.current().get( resolvePath(path), callback ));
	}
};



const getSync = path =>
{
	if (checkWindows.sync())
	{
		return whichLib.run(() => whichLib.current().getSync( resolvePath(path) ));
	}
};



const set = (path, attrs, callback) =>
{
	if (checkWindows.async(callback))
	{
		return whichLib.run(() => whichLib.current().set( resolvePath(path), attrs, callback ));
	}
};



const setSync = (path, attrs) =>
{
	if (checkWindows.sync())
	{
		return whichLib.run(() => whichLib.current().setSync( resolvePath(path), attrs ));
	}
};



whichLib.change("auto");



module.exports =
{
	get,
	getSync,
	set,
	setSync,

	// Undocumented -- used for testing
	change: whichLib.change
};
