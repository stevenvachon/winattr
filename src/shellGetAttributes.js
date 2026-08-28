// Thanks to Gabriel Llamas for his solution:
// http://stackoverflow.com/questions/13440589/retrieve-file-attributes-from-windows-cmd

var fs = new ActiveXObject('Scripting.FileSystemObject');
var name = WScript.Arguments.Item(0);

/** @type {Scripting.File | Scripting.Folder | undefined} */
var file;

/** @type {string | undefined} */
var error;

/** @type {string | undefined} */
var json;

try {
  file = fs.GetFile(name);
} catch (e) {
  // If exists, but not a file
  // `e.message` would've used Windows' locale
  // `e.number` is often 0x800A0035, not 53
  if ((e.number & 0xffff) === 53) {
    try {
      file = fs.GetFolder(name);
    } catch (e) {
      // Exists, but not a folder
      error = e.message;
    }
  } else {
    // Doesn't exist or unauthorized
    error = e.message;
  }
}

// `cscript` uses JScript 5.7 which has no `JSON.stringify`
if (file) {
  json = '{';
  json += '"archive":'  + !!(file.Attributes & 32) + ','; // prettier-ignore
  json += '"hidden":'   + !!(file.Attributes & 2)  + ','; // prettier-ignore
  json += '"readonly":' + !!(file.Attributes & 1)  + ','; // prettier-ignore
  json += '"system":'   + !!(file.Attributes & 4); // prettier-ignore
  json += '}';
} else {
  if (error) {
    error = error
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t');
  } else {
    error = 'Unknown error';
  }

  json = '{"error":"' + error + '"}';
}

WScript.Echo(json);
