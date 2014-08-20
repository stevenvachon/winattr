var util = require("./util");



function get(path, callback)
{
	util.fsWin.find(path, function(result)
	{
		if (!result.length)
		{
			callback( new Error("file not found") );
		}
		else
		{
			var attrs = {};
			var file = result[0];	// ignore any other files
			
			for (var i in file)
			{
				if (i.indexOf("IS_") == 0)
				{
					attrs[i] = file[i];
				}
			}
			
			callback(null, util.convertFrom(attrs) );
		}
	});
}



function set(path, attrs, callback)
{
	util.fsWin.setAttributes(path, util.convertTo(attrs), function(success)
	{
		callback( success ? null : new Error() );
	});
}



module.exports = util.fsWin ? {get:get,set:set} : null
