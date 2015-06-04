"use strict";
var expect  = require("chai").expect;
var util    = require("./util");
var winattr = require("../lib");

var describe_unixOnly    = util.isWindows===false ? describe : describe.skip;
var describe_windowsOnly = util.isWindows===true  ? describe : describe.skip;

var describe_node12only = util.isNode12===true ? describe : describe.skip;
var it_node12only       = util.isNode12===true ? it       : it.skip;

var modes = ["shell","auto","binding"];



describe_unixOnly("Unix", function()
{
	modes.forEach( function(mode)
	{
		// Node 0.10 has no synchronous shell functions
		var it_maySkip = (mode==="shell" || mode==="auto") ? it_node12only : it;
		
		
		
		describe('with "'+mode+' mode"', function()
		{
			describe("accessing files", function()
			{
				it("should not work asynchronously", function(done)
				{
					util.newFile("normal.txt", util.defaultAttribs(), mode, function(error, result)
					{
						expect(error).to.be.instanceOf(Error);
						expect(error.message).to.contain("Windows");
						done();
					});
				});
				
				it_maySkip("should not work synchronously", function(done)
				{
					try
					{
						util.newFileSync("normal.txt", util.defaultAttribs(), mode);
						
						done( new Error("this should not have been called") );
					}
					catch (error)
					{
						expect(error).to.be.instanceOf(Error);
						expect(error.message).to.contain("Windows");
						done();
					}
				});
			});
			
			
			
			describe("accessing folders", function()
			{
				it("should not work asynchronously", function(done)
				{
					util.newFolder("normal", util.defaultAttribs(), mode, function(error, result)
					{
						expect(error).to.be.instanceOf(Error);
						expect(error.message).to.contain("Windows");
						done();
					});
				});
				
				it_maySkip("should not work synchronously", function(done)
				{
					try
					{
						util.newFolderSync("normal", util.defaultAttribs(), mode);
						
						done( new Error("this should not have been called") );
					}
					catch (error)
					{
						expect(error).to.be.instanceOf(Error);
						expect(error.message).to.contain("Windows");
						done();
					}	
				});
			});
		});
	});
});



// NOTE :: didn't use deep.equals() because of "directory" and "symlink" keys
describe_windowsOnly("Windows", function()
{
	// AppVeyor (non-pro) is slow
	this.timeout(5000);
	
	
	
	modes.forEach( function(mode)
	{
		// Node 0.10 has no synchronous shell functions
		var describe_maySkip = (mode==="shell" || mode==="auto") ? describe_node12only : describe;
		
		
		
		describe('with "'+mode+' mode"', function()
		{
			describe("accessing files", function()
			{
				describe("asynchronously", function()
				{
					it("should set to nothing", function(done)
					{
						util.newFile("normal.txt", util.defaultAttribs(), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.false;
							expect(result.hidden).to.be.false;
							expect(result.readonly).to.be.false;
							expect(result.system).to.be.false;
							done();
						});
					});
					
					it("should set to archive", function(done)
					{
						util.newFile("archive.txt", util.defaultAttribs({archive:true}), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.true;
							expect(result.hidden).to.be.false;
							expect(result.readonly).to.be.false;
							expect(result.system).to.be.false;
							done();
						});
					});
					
					it("should set to hidden", function(done)
					{
						util.newFile("hidden.txt", util.defaultAttribs({hidden:true}), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.false;
							expect(result.hidden).to.be.true;
							expect(result.readonly).to.be.false;
							expect(result.system).to.be.false;
							done();
						});
					});
					
					it("should set to readonly", function(done)
					{
						util.newFile("readonly.txt", util.defaultAttribs({readonly:true}), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.false;
							expect(result.hidden).to.be.false;
							expect(result.readonly).to.be.true;
							expect(result.system).to.be.false;
							done();
						});
					});
					
					it("should set to system", function(done)
					{
						util.newFile("system.txt", util.defaultAttribs({system:true}), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.false;
							expect(result.hidden).to.be.false;
							expect(result.readonly).to.be.false;
							expect(result.system).to.be.true;
							done();
						});
					});
					
					it("should set all attributes", function(done)
					{
						util.newFile("all.txt", util.allAttribs(), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.true;
							expect(result.hidden).to.be.true;
							expect(result.readonly).to.be.true;
							expect(result.system).to.be.true;
							done();
						});
					});
					
					it("should bail if non-existent", function(done)
					{
						winattr.set("./fake-file", {readonly:true}, function(setError, setResult)
						{
							expect(setError).to.be.instanceOf(Error);
							
							winattr.get("./fake-file", function(getError, getResult)
							{
								expect(getError).to.be.instanceOf(Error);
								done();
							});
						});
					});
				});
				
				
				
				describe_maySkip("synchronously", function()
				{
					it("should set to nothing", function(done)
					{
						var result = util.newFileSync("normal.txt", util.defaultAttribs(), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to archive", function(done)
					{
						var result = util.newFileSync("archive.txt", util.defaultAttribs({archive:true}), mode);
						
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to hidden", function(done)
					{
						var result = util.newFileSync("hidden.txt", util.defaultAttribs({hidden:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to readonly", function(done)
					{
						var result = util.newFileSync("readonly.txt", util.defaultAttribs({readonly:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to system", function(done)
					{
						var result = util.newFileSync("system.txt", util.defaultAttribs({system:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.true;
						done();
					});
					
					it("should set all attributes", function(done)
					{
						var result = util.newFileSync("all.txt", util.allAttribs(), mode);
						
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.true;
						done();
					});
					
					it("should bail if non-existent", function(done)
					{
						var getError,setError;
						
						try
						{
							winattr.setSync("./fake-file", {readonly:true});
						}
						catch (error)
						{
							setError = error;
						}
						
						try
						{
							winattr.getSync("./fake-file");
						}
						catch (error)
						{
							getError = error;
						}
						
						expect(setError).to.be.instanceOf(Error);
						expect(getError).to.be.instanceOf(Error);
						done();
					});
				});
			});
			
			
			
			describe("accessing folders", function()
			{
				describe("asynchronously", function()
				{
					it("should set to nothing", function(done)
					{
						util.newFolder("normal", util.defaultAttribs(), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.false;
							expect(result.hidden).to.be.false;
							expect(result.readonly).to.be.false;
							expect(result.system).to.be.false;
							done();
						});
					});
					
					it("should set to archive", function(done)
					{
						util.newFolder("archive", util.defaultAttribs({archive:true}), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.true;
							expect(result.hidden).to.be.false;
							expect(result.readonly).to.be.false;
							expect(result.system).to.be.false;
							done();
						});
					});
					
					it("should set to hidden", function(done)
					{
						util.newFolder("hidden", util.defaultAttribs({hidden:true}), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.false;
							expect(result.hidden).to.be.true;
							expect(result.readonly).to.be.false;
							expect(result.system).to.be.false;
							done();
						});
					});
					
					it("should set to readonly", function(done)
					{
						util.newFolder("readonly", util.defaultAttribs({readonly:true}), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.false;
							expect(result.hidden).to.be.false;
							expect(result.readonly).to.be.true;
							expect(result.system).to.be.false;
							done();
						});
					});
					
					it("should set to system", function(done)
					{
						util.newFolder("system", util.defaultAttribs({system:true}), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.false;
							expect(result.hidden).to.be.false;
							expect(result.readonly).to.be.false;
							expect(result.system).to.be.true;
							done();
						});
					});
					
					it("should set all attributes", function(done)
					{
						util.newFolder("all", util.allAttribs(), mode, function(error, result)
						{
							if (error!==null) throw error;
							expect(result.archive).to.be.true;
							expect(result.hidden).to.be.true;
							expect(result.readonly).to.be.true;
							expect(result.system).to.be.true;
							done();
						});
					});
				});
				
				
				
				describe_maySkip("synchronously", function()
				{
					it("should set to nothing", function(done)
					{
						var result = util.newFolderSync("normal", util.defaultAttribs(), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to archive", function(done)
					{
						var result = util.newFolderSync("archive", util.defaultAttribs({archive:true}), mode);
						
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to hidden", function(done)
					{
						var result = util.newFolderSync("hidden", util.defaultAttribs({hidden:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to readonly", function(done)
					{
						var result = util.newFolderSync("readonly", util.defaultAttribs({readonly:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to system", function(done)
					{
						var result = util.newFolderSync("system", util.defaultAttribs({system:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.true;
						done();
					});
					
					it("should set all attributes", function(done)
					{
						var result = util.newFolderSync("all", util.allAttribs(), mode);
						
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.true;
						done();
					});
				});
			});
		});
	});
});
