var pathModule = require("path");

var exec,lib,native;
var windows = process.platform.indexOf("win") == 0;

var _export =
{
	get: get,
	set: set,
	useExec: useExec,
	useNative: useNative
};



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
	return _export;
}



function useNative()
{
	if (!native) native = require("./native");
	lib = native;
	return _export;
}



useExec();



module.exports = _export;
