"use strict";
const errorMessage = "Not a Windows platform";
const isWindows = process.platform.startsWith("win");



const async = callback =>
{
	if (!isWindows && typeof callback === "function")
	{
		callback( new Error(errorMessage) );
	}

	return isWindows;
};



const sync = () =>
{
	if (!isWindows)
	{
		throw new Error(errorMessage);
	}
	else
	{
		return isWindows;
	}
};



module.exports =
{
	async,
	sync
};
