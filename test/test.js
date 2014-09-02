var expect  = require("chai").expect;
var util    = require("./util");
var winattr = require("../lib");

var describe_unixOnly    = !util.isWindows ? describe : describe.skip;
var describe_windowsOnly =  util.isWindows ? describe : describe.skip;

var libs = ["exec","native"];



describe_unixOnly("Unix", function()
{
	it("files should bail", function(done)
	{
		util.newFile("normal.txt", util.defaultAttribs(), "", function(error, result)
		{
			expect(error).to.be.not.null;
			expect(error.message).to.contain("Windows");
			done();
		});
	});
	
	it("folders should bail", function(done)
	{
		util.newFolder("normal", util.defaultAttribs(), "", function(error, result)
		{
			expect(error).to.be.not.null;
			expect(error.message).to.contain("Windows");
			done();
		});
	});
});



describe_windowsOnly("Windows", function()
{
	describe("files", function()
	{
		libs.forEach( function(lib)
		{
			describe("accessed with "+lib, function()
			{
				it("should set nothing", function(done)
				{
					util.newFile("normal.txt", util.defaultAttribs(), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});
				
				it("should set archive", function(done)
				{
					util.newFile("archive.txt", util.defaultAttribs({archive:true}), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});
				
				it("should set hidden", function(done)
				{
					util.newFile("hidden.txt", util.defaultAttribs({hidden:true}), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});
				
				it("should set readonly", function(done)
				{
					util.newFile("readonly.txt", util.defaultAttribs({readonly:true}), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.false;
						done();
					});
				});
				
				it("should set system", function(done)
				{
					util.newFile("system.txt", util.defaultAttribs({system:true}), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.true;
						done();
					});
				});
				
				it("should set all attributes", function(done)
				{
					util.newFile("all.txt", util.allAttribs(), lib, function(error, result)
					{
						if (error) throw error;
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
						expect(setError).to.be.not.null;
						
						winattr.get("./fake-file", function(getError, getResult)
						{
							expect(getError).to.be.not.null;
							done();
						});
					});
				});
			});
		});
	});
	
	
	
	describe("folders", function()
	{
		libs.forEach( function(lib)
		{
			describe("accessed with "+lib, function()
			{
				it("should set nothing", function(done)
				{
					util.newFolder("normal", util.defaultAttribs(), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});
				
				it("should set archive", function(done)
				{
					util.newFolder("archive", util.defaultAttribs({archive:true}), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});
				
				it("should set hidden", function(done)
				{
					util.newFolder("hidden", util.defaultAttribs({hidden:true}), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});
				
				it("should set readonly", function(done)
				{
					util.newFolder("readonly", util.defaultAttribs({readonly:true}), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.false;
						done();
					});
				});
				
				it("should set system", function(done)
				{
					util.newFolder("system", util.defaultAttribs({system:true}), lib, function(error, result)
					{
						if (error) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.true;
						done();
					});
				});
				
				it("should set all attributes", function(done)
				{
					util.newFolder("all", util.allAttribs(), lib, function(error, result)
					{
						if (error) throw error;
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
