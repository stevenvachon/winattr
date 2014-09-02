var fswin = require("fswin");

var convertAttrs = require("./convertAttrs");



function get(path, callback)
{
	fswin.getAttributes(path, function(result)
	{
		if (!result)
		{
			// The exact error is unknown -- could be ENOENT,EPERM,etc
			callback( new Error() );
			return;
		}
		
		var attrs = {};
		
		for (var i in result)
		{
			if (i.indexOf("IS_") == 0)
			{
				attrs[i] = result[i];
			}
		}
		
		callback(null, convertAttrs.from(attrs) );
	});
}



function set(path, attrs, callback)
{
	fswin.setAttributes(path, convertAttrs.to(attrs), function(success)
	{
		// The exact error is unknown -- could be ENOENT,EPERM,etc
		callback( success ? null : new Error() );
	});
}



module.exports =
{
	get: get,
	set: set
};
