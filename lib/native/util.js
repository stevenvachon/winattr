var defs =
{
	archive:  "IS_ARCHIVED",
	hidden:   "IS_HIDDEN",
	readonly: "IS_READ_ONLY",
	system:   "IS_SYSTEM"
};



var fsWin;

try
{
	fsWin = require("fswin-binary");
}
catch (error)
{
	// fsWin incompatible with this version of Node.js
	fsWin = null;
}



function convert(attrs, from)
{
	var output = {};
	
	eachAttribute(attrs, function(attrValue, attrName)
	{
		eachDefinition( function(defValue, defName)
		{
			if (from)
			{
				if (defValue == attrName)
				{
					output[defName] = attrValue;
					return false;
				}
			}
			// to
			else
			{
				if (defName == attrName)
				{
					output[defValue] = attrValue;
					return false;
				}
			}
		});
	});
	
	return output;
}



function convertFrom(attrs)
{
	return convert(attrs, true);
}



function convertTo(attrs)
{
	return convert(attrs, false);
}



function eachAttribute(attrs, callback)
{
	for (var i in attrs)
	{
		if ( attrs.hasOwnProperty(i) )
		{
			var stop = callback( attrs[i], i, attrs );
			
			if (stop===false) break;
		}
	}
}



function eachDefinition(callback)
{
	for (var i in defs)
	{
		if ( defs.hasOwnProperty(i) )
		{
			var stop = callback( defs[i], i, defs );
			
			if (stop===false) break;
		}
	}
}



module.exports =
{
	convertFrom: convertFrom,
	convertTo:   convertTo,
	fsWin:       fsWin
};
