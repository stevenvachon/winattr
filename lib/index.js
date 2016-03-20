"use strict";
const checkWindows = require("./checkWindows");
const resolvePath = require("path").resolve;
const whichLib = require("./whichLib");



function get(path, callback)
{
	if (checkWindows.async(callback) === true)
	{
		return whichLib.run( function()
		{
			return whichLib.current().get( resolvePath(path), callback );
		});
	}
}



function getSync(path)
{
	if (checkWindows.sync() === true)
	{
		return whichLib.run( function()
		{
			return whichLib.current().getSync( resolvePath(path) );
		});
	}
}



function set(path, attrs, callback)
{
	if (checkWindows.async(callback) === true)
	{
		return whichLib.run( function()
		{
			return whichLib.current().set( resolvePath(path), attrs, callback );
		});
	}
}



function setSync(path, attrs)
{
	if (checkWindows.sync() === true)
	{
		return whichLib.run( function()
		{
			return whichLib.current().setSync( resolvePath(path), attrs );
		});
	}
}



whichLib.change("auto");



module.exports =
{
	get:     get,
	getSync: getSync,
	set:     set,
	setSync: setSync,
	
	// Undocumented -- used for testing
	change: whichLib.change
};
