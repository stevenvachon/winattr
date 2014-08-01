var fs = require("fs");

var winattr = require("../lib");

if (!Object.assign) Object.assign = require("object.assign");



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
			if (error) throw error;
			
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
	fs.writeFile(path, "", function(error)
	{
		if (error) throw error;
		
		attribs(path, attrs, function(error, attrs)
		{
			fs.unlink(path, function(error)
			{
				callback(null, attrs);
			});
		});
	});
}



function newFolder(path, attrs, callback)
{
	fs.mkdir(path, function(error)
	{
		if (error) throw error;
		
		attribs(path, attrs, function(error, attrs)
		{
			fs.rmdir(path, function(error)
			{
				callback(null, attrs);
			});
		});
	});
}



module.exports =
{
	allAttribs: allAttribs,
	defaultAttribs: defaultAttribs,
	newFile: newFile,
	newFolder: newFolder
};
