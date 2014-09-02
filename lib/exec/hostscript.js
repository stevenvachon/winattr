// Thanks to Gabriel Llamas for his solution:
// http://stackoverflow.com/questions/13440589/retrieve-file-attributes-from-windows-cmd

var fs = new ActiveXObject("Scripting.FileSystemObject");
var name = WScript.Arguments.item(0);
var error,file,json;

try
{
	file = fs.getFile(name);
}
catch (e)
{
	try
	{
		file = fs.getFolder(name);
	}
	catch (e)
	{
		error = "file error";
	}
}

if (!error)
{
	json  = '{';
	json += '"readonly":' + !!(file.attributes & 1)    +',';	// Read-only
	json += '"hidden":'   + !!(file.attributes & 2)    +',';	// Hidden
	json += '"system":'   + !!(file.attributes & 4)    +',';	// System
	json += '"directory":'+ !!(file.attributes & 16)   +',';	// Directory
	json += '"archive":'  + !!(file.attributes & 32)   +',';	// Archive
	json += '"symlink":'  + !!(file.attributes & 1024)     ;	// Reparse point (symbolic link)
	json += '}';
}
else
{
	json = '{"error":"'+error+'"}';
}

WScript.echo(json);
