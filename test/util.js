"use strict";
var fs = require("fs");
var objectAssign = require("object-assign");
var resolvePath = require("path").resolve;
var semver = require("semver");
var winattr = require("../lib");

var isNode12 = semver.gte(process.version, "0.12.0");
var isWindows = process.platform.indexOf("win") === 0;



function allAttribs()
{
	var all = defaultAttribs();
	
	for (var i in all)
	{
		if (all[i] === false)
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
	
	return (overrides!=null) ? objectAssign(defaults,overrides) : defaults;
}



function newFile(path, attrs, lib, callback)
{
	path = resolvePath(__dirname, path);
	
	fs.writeFile(path, "", function(writeError)
	{
		if (writeError!=null) return callback(writeError);
		
		switchLib(lib);
		
		setget(path, attrs, function(setgetError, attrs)
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



function newFileSync(path, attrs, lib)
{
	var attrs;
	
	path = resolvePath(__dirname, path);
	
	fs.writeFileSync(path, "");
	
	try
	{
		switchLib(lib);
		
		attrs = setgetSync(path, attrs);
		
		// Set attributes to false to avoid EPERM issues when deleting
		winattr.setSync( path, defaultAttribs() );
	}
	catch (error)
	{
		// Remove test file
		fs.unlinkSync(path);
		
		throw error;
	}
	
	// Remove test file
	fs.unlinkSync(path);
	
	return attrs;
}



function newFolder(path, attrs, lib, callback)
{
	path = resolvePath(__dirname, path);
	
	fs.mkdir(path, function(mkError)
	{
		if (mkError!=null) return callback(mkError);
		
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



function newFolderSync(path, attrs, lib)
{
	var attrs;
	
	path = resolvePath(__dirname, path);
	
	fs.mkdirSync(path);
	
	try
	{
		switchLib(lib);
		
		attrs = setgetSync(path, attrs);
		
		// Set attributes to false to avoid EPERM issues when deleting
		winattr.setSync( path, defaultAttribs() );
	}
	catch (error)
	{
		// Remove test dir
		fs.rmdirSync(path);
		
		throw error;
	}
	
	// Remove test dir
	fs.rmdirSync(path);
	
	return attrs;
}



function setget(path, attrs, callback)
{
	winattr.set(path, attrs, function(error)
	{
		if (error!=null) return callback(error);
		
		winattr.get(path, callback);
	});
}



function setgetSync(path, attrs)
{
	winattr.setSync(path, attrs);
	
	return winattr.getSync(path);
}



function switchLib(lib)
{
	switch (lib)
	{
		case "auto":
		case "shell":
		{
			winattr.change(lib);
			break;
		}
		case "binding":
		{
			winattr.change(lib, true);
			break;
		}
	}
}



module.exports =
{
	allAttribs:     allAttribs,
	defaultAttribs: defaultAttribs,
	isNode12:       isNode12,
	isWindows:      isWindows,
	newFile:        newFile,
	newFileSync:    newFileSync,
	newFolder:      newFolder,
	newFolderSync:  newFolderSync
};
