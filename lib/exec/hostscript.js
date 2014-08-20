// Thanks to Gabriel Llamas for his solution:
// http://stackoverflow.com/questions/13440589/retrieve-file-attributes-from-windows-cmd

var fs = new ActiveXObject("Scripting.FileSystemObject");
var name = WScript.Arguments.item(0);
var file;

try
{
	file = fs.getFile(name);
}
catch (e)
{
	file = fs.getFolder(name);
}

var json = '{';
json += '"readonly":' + !!(file.attributes & 1)    +',';	// Read-only
json += '"hidden":'   + !!(file.attributes & 2)    +',';	// Hidden
json += '"system":'   + !!(file.attributes & 4)    +',';	// System
json += '"directory":'+ !!(file.attributes & 16)   +',';	// Directory
json += '"archive":'  + !!(file.attributes & 32)   +',';	// Archive
json += '"symlink":'  + !!(file.attributes & 1024)     ;	// Reparse point (symbolic link)
json += '}';

WScript.echo(json);
