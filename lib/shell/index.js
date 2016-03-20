"use strict";
const child_process = require("child_process");

// For attrib command
const params =
{
	archive:  "a",
	hidden:   "h",
	readonly: "r",
	system:   "s"
};



function get_args(path)
{
	return [
		__dirname+"/hostscript.js",
		path,
		"//nologo",
		"//E:jscript"
	];
}



function get_parseResult(result)
{
	var json;
	var error = null;
	
	result.stdout = result.stdout.trim();
	
	if (result.stdout.length <= 0)
	{
		error = new Error("unknown error");
	}
	else
	{
		json = JSON.parse(result.stdout);
		
		if (json.error !== undefined)
		{
			error = new Error(json.error);
			json = undefined;
		}
	}
	
	return { error:error, attrs:json };
}



function set_args(path, attrs)
{
	const args = [];
	
	for (let i in attrs)
	{
		if (attrs.hasOwnProperty(i)===true && params.hasOwnProperty(i)===true)
		{
			args.push( (attrs[i]===true ? "+" : "-") + params[i] );
		}
	}
	
	args.push(path);
	
	return args;
}



function set_parseResult(result)
{
	// `result.stdout` is empty when successful
	if (result.stdout.length <= 0)
	{
		return null;
	}
	else
	{
		return new Error(result.stdout);
	}
}



function shell(command, args, callback)
{
	var instance = child_process.spawn(command, args);
	
	var stderr = "";
	var stdout = "";
	
	instance.stderr.on("data", function(data)
	{
		stderr += data.toString();
	});
	
	instance.stdout.on("data", function(data)
	{
		stdout += data.toString();
	});
	
	instance.on("exit", function(status)
	{
		this.removeAllListeners();
		
		// Pass an Object so that it's similar to spawnSync()
		callback({ status:status, stdout:stdout, stderr:stderr });
	});
}



function shellSync(command, args)
{
	var result = child_process.spawnSync(command, args, {encoding:"utf8"});
	
	// Consistent with shell()
	if (result.stderr===null) result.stderr = "";
	if (result.stdout===null) result.stdout = "";
	
	return result;
}



//::: PUBLIC FUNCTIONS



function get(path, callback)
{
	shell("cscript", get_args(path), function(result)
	{
		result = get_parseResult(result);
		
		callback(result.error, result.attrs);
	});
}



function getSync(path)
{
	var result = shellSync( "cscript", get_args(path) );
	result = get_parseResult(result);
	
	if (result.error !== null)
	{
		throw result.error;
	}
	
	return result.attrs;
}



function set(path, attrs, callback)
{
	shell("attrib", set_args(path,attrs), function(result)
	{
		callback( set_parseResult(result) );
	});
}



function setSync(path, attrs, callback)
{
	var result = shellSync( "attrib", set_args(path,attrs) );
	result = set_parseResult(result);
	
	if (result !== null)
	{
		throw result;
	}
}



module.exports = 
{
	get:     get,
	getSync: getSync,
	set:     set,
	setSync: setSync
};
