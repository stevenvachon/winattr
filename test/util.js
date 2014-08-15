var fs = require("fs");
var resolve = require("path").resolve;
var winattr = require("../lib");

if (!Object.assign) Object.assign = require("object.assign");

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



function attribs(path, attrs, callback)
{
	if (typeof attrs == "function")
	{
		callback = attrs;
		attrs = null;
	}
	
	if (attrs)
	{
		winattr.set(path, attrs, function(error)
		{
			if (error) return callback(error);
			
			winattr.get(path, callback);
		});
	}
	else
	{
		winattr.get(path, callback);
	}
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
	
	if (overrides)
	{
		return Object.assign(defaults, overrides);
	}
	else
	{
		return defaults;
	}
}



function newFile(path, attrs, callback)
{
	path = resolve(__dirname, path);
	
	fs.writeFile(path, "", function(writeError)
	{
		if (writeError) return callback(writeError);
		
		attribs(path, attrs, function(attribsError, attrs)
		{
			// Set attribs to false to avoid EPERM issues when deleting
			winattr.set(path, defaultAttribs(), function(winattrError)
			{
				// Remove test file
				fs.unlink(path, function(unlinkError)
				{
					callback(unlinkError || winattrError || attribsError || null, attrs);
				});
			});
		});
	});
}



function newFolder(path, attrs, callback)
{
	path = resolve(__dirname, path);
	
	fs.mkdir(path, function(mkError)
	{
		if (mkError) return callback(mkError);
		
		attribs(path, attrs, function(attribsError, attrs)
		{
			// Set attribs to false to avoid EPERM issues when deleting
			winattr.set(path, defaultAttribs(), function(winattrError)
			{
				// Remove test dir
				fs.rmdir(path, function(rmError)
				{
					callback(rmError || winattrError || attribsError || null, attrs);
				});
			});
		});
	});
}



module.exports =
{
	allAttribs: allAttribs,
	defaultAttribs: defaultAttribs,
	isWindows: windows,
	newFile: newFile,
	newFolder: newFolder
};
