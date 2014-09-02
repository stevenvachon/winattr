var child_process = require("child_process");

var defs =
{
	archive:  "a",
	hidden:   "h",
	readonly: "r",
	system:   "s"
};



function get(path, callback)
{
	shell("cscript", [__dirname+"/hostscript.js",path,"//nologo"], function(code, stdout, stderr)
	{
		var error,json;
		
		stdout = stdout.trim();
		json = stdout.length ? JSON.parse(stdout) : null;
		
		if (json && json.error)
		{
			error = new Error(json.error);
			json = null;
		}
		
		callback(error, json);
	});
}



function set(path, attrs, callback)
{
	var args = [];
	
	for (var i in attrs)
	{
		if ( defs[i] )
		{
			args.push( (attrs[i] ? "+" : "-") + defs[i] );
		}
	}
	
	args.push(path);
	
	shell("attrib", args, function(code, stdout, stderr)
	{
		// `stdout` is empty when successful
		callback( stdout.length ? new Error(stdout) : null );
	});
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
	
	instance.on("exit", function(code)
	{
		this.removeAllListeners();
		
		callback(code, stdout, stderr);
	});
}



module.exports = 
{
	get: get,
	set: set
};
