var fs = require("fs");
var resolve = require("path").resolve;
var winattr = require("../lib");
require("object.assign").shim();

var windows = process.platform.indexOf("win") == 0;



function allAttribs()
{
	var all = defaultAttribs();
	
	for (var i in all)
	{
		if (all[i]===false)
		{
			all[i] = true;
		}
	}
	
	return all;
}



function defaultAttribs(overrides)
{
	var defaults =
	{
		archive: false,
		hidden: false,
		readonly: false,
		system: false
	};
	
	return overrides ? Object.assign(defaults,overrides) : defaults;
}



function newFile(path, attrs1, lib, callback)
{
	path = resolve(__dirname, path);
	
	fs.writeFile(path, "", function(writeError)
	{
		if (writeError) return callback(writeError);
		
		switchLib(lib);
		
		setget(path, attrs1, function(setgetError, attrs)
		{
			// Set attributes to false to avoid EPERM issues when deleting
			winattr.set(path, defaultAttribs(), function(winattrError)
			{
				// Remove test file
				fs.unlink(path, function(unlinkError)
				{
					callback(unlinkError || winattrError || setgetError || null, attrs);
				});
			});
		});
	});
}



function newFolder(path, attrs, lib, callback)
{
	path = resolve(__dirname, path);
	
	fs.mkdir(path, function(mkError)
	{
		if (mkError) return callback(mkError);
		
		switchLib(lib);
		
		setget(path, attrs, function(setgetError, attrs)
		{
			// Set attributes to false to avoid EPERM issues when deleting
			winattr.set(path, defaultAttribs(), function(winattrError)
			{
				// Remove test dir
				fs.rmdir(path, function(rmError)
				{
					callback(rmError || winattrError || setgetError || null, attrs);
				});
			});
		});
	});
}



function setget(path, attrs, callback)
{
	winattr.set(path, attrs, function(error)
	{
		if (error) return callback(error);
		
		winattr.get(path, callback);
	});
}



function switchLib(lib)
{
	switch (lib)
	{
		case "":
		case "exec":
		{
			winattr.useExec();
			break;
		}
		case "native":
		{
			winattr.useNative();
			break;
		}
	}
}



module.exports =
{
	allAttribs: allAttribs,
	defaultAttribs: defaultAttribs,
	isWindows: windows,
	newFile: newFile,
	newFolder: newFolder
};
