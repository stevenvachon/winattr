"use strict";
const defs =
{
	archive:  "IS_ARCHIVED",
	hidden:   "IS_HIDDEN",
	readonly: "IS_READ_ONLY",
	system:   "IS_SYSTEM"
};



const convert = (attrs, from) =>
{
	const output = {};

	eachAttribute(attrs, (attrValue, attrName) =>
	{
		eachDefinition((defValue, defName) =>
		{
			if (from === true)
			{
				if (defValue === attrName)
				{
					output[defName] = attrValue;
					return false;
				}
			}
			// to
			else
			{
				if (defName === attrName)
				{
					output[defValue] = attrValue;
					return false;
				}
			}
		});
	});

	return output;
};



const convertFrom = attrs => convert(attrs, true);
const convertTo = attrs => convert(attrs, false);



const eachAttribute = (attrs, callback) =>
{
	for (let i in attrs)
	{
		if (attrs.hasOwnProperty(i))
		{
			let stop = callback( attrs[i], i, attrs );

			if (stop===false) break;
		}
	}
};



const eachDefinition = (callback) =>
{
	for (let i in defs)
	{
		if (defs.hasOwnProperty(i))
		{
			let stop = callback( defs[i], i, defs );

			if (stop===false) break;
		}
	}
};



module.exports =
{
	from: convertFrom,
	to:   convertTo
};
