"use strict";
const expect  = require("chai").expect;
const helpers = require("./helpers");
const winattr = require("../lib");

const describe_unixOnly    = helpers.isWindows===false ? describe : describe.skip;
const describe_windowsOnly = helpers.isWindows===true  ? describe : describe.skip;

const modes = ["shell", "auto", "binding"];



describe_unixOnly("Unix", function()
{
	modes.forEach( function(mode)
	{
		describe('with "'+mode+' mode"', function()
		{
			describe("accessing files", function()
			{
				it("should not work asynchronously", function(done)
				{
					helpers.newFile("normal.txt", helpers.defaultAttribs(), mode, function(error, result)
					{
						expect(error).to.be.instanceOf(Error);
						expect(error.message).to.contain("Windows");
						done();
					});
				});
				
				it("should not work synchronously", function(done)
				{
					try
					{
						helpers.newFileSync("normal.txt", helpers.defaultAttribs(), mode);
						
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
					helpers.newFolder("normal", helpers.defaultAttribs(), mode, function(error, result)
					{
						expect(error).to.be.instanceOf(Error);
						expect(error.message).to.contain("Windows");
						done();
					});
				});
				
				it("should not work synchronously", function(done)
				{
					try
					{
						helpers.newFolderSync("normal", helpers.defaultAttribs(), mode);
						
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
		describe('with "'+mode+' mode"', function()
		{
			describe("accessing files", function()
			{
				describe("asynchronously", function()
				{
					it("should set to nothing", function(done)
					{
						helpers.newFile("normal.txt", helpers.defaultAttribs(), mode, function(error, result)
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
						helpers.newFile("archive.txt", helpers.defaultAttribs({archive:true}), mode, function(error, result)
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
						helpers.newFile("hidden.txt", helpers.defaultAttribs({hidden:true}), mode, function(error, result)
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
						helpers.newFile("readonly.txt", helpers.defaultAttribs({readonly:true}), mode, function(error, result)
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
						helpers.newFile("system.txt", helpers.defaultAttribs({system:true}), mode, function(error, result)
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
						helpers.newFile("all.txt", helpers.allAttribs(), mode, function(error, result)
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
					
					// TODO :: should support "/" and "\" dir separators
				});
				
				
				
				describe("synchronously", function()
				{
					it("should set to nothing", function(done)
					{
						const result = helpers.newFileSync("normal.txt", helpers.defaultAttribs(), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to archive", function(done)
					{
						const result = helpers.newFileSync("archive.txt", helpers.defaultAttribs({archive:true}), mode);
						
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to hidden", function(done)
					{
						const result = helpers.newFileSync("hidden.txt", helpers.defaultAttribs({hidden:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to readonly", function(done)
					{
						const result = helpers.newFileSync("readonly.txt", helpers.defaultAttribs({readonly:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to system", function(done)
					{
						const result = helpers.newFileSync("system.txt", helpers.defaultAttribs({system:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.true;
						done();
					});
					
					it("should set all attributes", function(done)
					{
						const result = helpers.newFileSync("all.txt", helpers.allAttribs(), mode);
						
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
						helpers.newFolder("normal", helpers.defaultAttribs(), mode, function(error, result)
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
						helpers.newFolder("archive", helpers.defaultAttribs({archive:true}), mode, function(error, result)
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
						helpers.newFolder("hidden", helpers.defaultAttribs({hidden:true}), mode, function(error, result)
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
						helpers.newFolder("readonly", helpers.defaultAttribs({readonly:true}), mode, function(error, result)
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
						helpers.newFolder("system", helpers.defaultAttribs({system:true}), mode, function(error, result)
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
						helpers.newFolder("all", helpers.allAttribs(), mode, function(error, result)
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
				
				
				
				describe("synchronously", function()
				{
					it("should set to nothing", function(done)
					{
						const result = helpers.newFolderSync("normal", helpers.defaultAttribs(), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to archive", function(done)
					{
						const result = helpers.newFolderSync("archive", helpers.defaultAttribs({archive:true}), mode);
						
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to hidden", function(done)
					{
						const result = helpers.newFolderSync("hidden", helpers.defaultAttribs({hidden:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to readonly", function(done)
					{
						const result = helpers.newFolderSync("readonly", helpers.defaultAttribs({readonly:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.false;
						done();
					});
					
					it("should set to system", function(done)
					{
						const result = helpers.newFolderSync("system", helpers.defaultAttribs({system:true}), mode);
						
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.true;
						done();
					});
					
					it("should set all attributes", function(done)
					{
						const result = helpers.newFolderSync("all", helpers.allAttribs(), mode);
						
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
