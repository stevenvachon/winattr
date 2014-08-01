var expect = require("chai").expect;
var util   = require("./util");

// Don't test on anything but Windows
if (process.platform.indexOf("win") != 0) return;



describe("Files", function()
{
	it("should set nothing", function(done)
	{
		util.newFile("normal.txt", util.defaultAttribs(), function(error, result)
		{
			expect(result.archive).to.be.false;
			expect(result.hidden).to.be.false;
			expect(result.readonly).to.be.false;
			expect(result.system).to.be.false;
			done();
		});
	});
	
	it("should set archive", function(done)
	{
		util.newFile("archive.txt", util.defaultAttribs({archive:true}), function(error, result)
		{
			expect(result.archive).to.be.true;
			expect(result.hidden).to.be.false;
			expect(result.readonly).to.be.false;
			expect(result.system).to.be.false;
			done();
		});
	});
	
	it("should set hidden", function(done)
	{
		util.newFile("hidden.txt", util.defaultAttribs({hidden:true}), function(error, result)
		{
			expect(result.archive).to.be.false;
			expect(result.hidden).to.be.true;
			expect(result.readonly).to.be.false;
			expect(result.system).to.be.false;
			done();
		});
	});
	
	it("should set readonly", function(done)
	{
		util.newFile("readonly.txt", util.defaultAttribs({readonly:true}), function(error, result)
		{
			expect(result.archive).to.be.false;
			expect(result.hidden).to.be.false;
			expect(result.readonly).to.be.true;
			expect(result.system).to.be.false;
			done();
		});
	});
	
	it("should set system", function(done)
	{
		util.newFile("system.txt", util.defaultAttribs({system:true}), function(error, result)
		{
			expect(result.archive).to.be.false;
			expect(result.hidden).to.be.false;
			expect(result.readonly).to.be.false;
			expect(result.system).to.be.true;
			done();
		});
	});
	
	it("should set all attributes", function(done)
	{
		util.newFile("all.txt", util.allAttribs(), function(error, result)
		{
			expect(result.archive).to.be.true;
			expect(result.hidden).to.be.true;
			expect(result.readonly).to.be.true;
			expect(result.system).to.be.true;
			done();
		});
	});
});



describe("Folders", function()
{
	it("should set nothing", function(done)
	{
		util.newFolder("normal", util.defaultAttribs(), function(error, result)
		{
			expect(result.archive).to.be.false;
			expect(result.hidden).to.be.false;
			expect(result.readonly).to.be.false;
			expect(result.system).to.be.false;
			done();
		});
	});
	
	it("should set archive", function(done)
	{
		util.newFolder("archive", util.defaultAttribs({archive:true}), function(error, result)
		{
			expect(result.archive).to.be.true;
			expect(result.hidden).to.be.false;
			expect(result.readonly).to.be.false;
			expect(result.system).to.be.false;
			done();
		});
	});
	
	it("should set hidden", function(done)
	{
		util.newFolder("hidden", util.defaultAttribs({hidden:true}), function(error, result)
		{
			expect(result.archive).to.be.false;
			expect(result.hidden).to.be.true;
			expect(result.readonly).to.be.false;
			expect(result.system).to.be.false;
			done();
		});
	});
	
	it("should set readonly", function(done)
	{
		util.newFolder("readonly", util.defaultAttribs({readonly:true}), function(error, result)
		{
			expect(result.archive).to.be.false;
			expect(result.hidden).to.be.false;
			expect(result.readonly).to.be.true;
			expect(result.system).to.be.false;
			done();
		});
	});
	
	it("should set system", function(done)
	{
		util.newFolder("system", util.defaultAttribs({system:true}), function(error, result)
		{
			expect(result.archive).to.be.false;
			expect(result.hidden).to.be.false;
			expect(result.readonly).to.be.false;
			expect(result.system).to.be.true;
			done();
		});
	});
	
	it("should set all attributes", function(done)
	{
		util.newFolder("all", util.allAttribs(), function(error, result)
		{
			expect(result.archive).to.be.true;
			expect(result.hidden).to.be.true;
			expect(result.readonly).to.be.true;
			expect(result.system).to.be.true;
			done();
		});
	});
});
