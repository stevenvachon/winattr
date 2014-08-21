var pathModule = require("path");

var exec,lib,native;
var windows = process.platform.indexOf("win") == 0;



function check(callback)
{
	if (!windows)
	{
		callback( new Error("Not a Windows platform") );
	}
	
	return windows;
}



function get(path, callback)
{
	if ( check(callback) )
	{
		path = pathModule.resolve(path);
		lib.get(path, callback);
	}
}



function set(path, attrs, callback)
{
	if ( check(callback) )
	{
		path = pathModule.resolve(path);
		lib.set(path, attrs, callback);
	}
}



function useExec()
{
	if (!exec) exec = require("./exec");
	lib = exec;
	return module.exports;
}



function useNative()
{
	if (!native) native = require("./native");
	lib = native;
	return module.exports;
}



useExec();



module.exports =
{
	get: get,
	set: set,
	useExec: useExec,
	useNative: useNative
};
