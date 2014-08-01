var child_process = require("child_process");

var windows = process.platform.indexOf("win") == 0;

var definitions =
{
	archive: "a",
	hidden: "h",
	readonly: "r",
	system: "s"
};



function get(path, callback)
{
	if (!windows)
	{
		callback( new Error("Not a Windows platform") );
		return;
	}
	
	var shell = child_process.spawn("cscript", [__dirname+"/hostscript.js",path,"//nologo"]);
	
	var stderr = "";
	var json = "";
	
	shell.stderr.on("data", function(data)
	{
		stderr += data.toString();
	});
	
	shell.stdout.on("data", function(data)
	{
		json += data.toString();
	});
	
	shell.on("exit", function(code)
	{
		this.removeAllListeners();
		
		stderr = stderr.trim();
		json = json.trim();
		
		var error = (code || stderr.length) ? new Error(stderr) : null;
		json = json.length ? JSON.parse(json) : null;
		
		callback(error, json);
	});
}



function set(path, attributes, callback)
{
	if (!windows)
	{
		callback( new Error("Not a Windows platform") );
		return;
	}
	
	var args = [];
	
	for (var i in attributes)
	{
		if ( definitions.hasOwnProperty(i) )
		{
			args.push( (attributes[i] ? "+" : "-") + definitions[i] );
		}
	}
	
	args.push(path);
	
	child_process.spawn("attrib", args).on("exit", function(code)
	{
		this.removeAllListeners();
		
		var error = (!code) ? null : new Error("I dunno yet");
		
		callback(error);
	});
}



module.exports = 
{
	get: get,
	set: set
};
