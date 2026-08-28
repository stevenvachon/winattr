"use strict";
const {allAttribs, defaultAttribs, isWindows, newFile, newFileSync, newFolder, newFolderSync} = require("./helpers");
const child_process = require("child_process");
const {EventEmitter} = require("events");
const {expect}  = require("chai");
const Module = require("module");
const whichLib = require("../lib/whichLib");
const winattr = require("../lib");

const describe_unixOnly    = !isWindows ? describe : describe.skip;
const describe_windowsOnly =  isWindows ? describe : describe.skip;

const modes = ["shell", "auto", "binding"];



describe_unixOnly("Unix", () =>
{
	modes.forEach(mode => describe(`with "${mode}" mode`, () =>
	{
		describe("accessing files", () =>
		{
			it("does not work asynchronously", done =>
			{
				newFile("normal.txt", defaultAttribs(), mode, (error, result) =>
				{
					expect(error).to.be.instanceOf(Error);
					expect(error.message).to.contain("Windows");
					done();
				});
			});

			it("does not work synchronously", done =>
			{
				try
				{
					newFileSync("normal.txt", defaultAttribs(), mode);

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



		describe("accessing folders", () =>
		{
			it("does not work asynchronously", done =>
			{
				newFolder("normal", defaultAttribs(), mode, (error, result) =>
				{
					expect(error).to.be.instanceOf(Error);
					expect(error.message).to.contain("Windows");
					done();
				});
			});

			it("does not work synchronously", done =>
			{
				try
				{
					newFolderSync("normal", defaultAttribs(), mode);

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
	}));
});



// NOTE :: didn't use deep.equals() because of "directory" and "symlink" keys
describe_windowsOnly("Windows", function()
{
	this.timeout(5000);



	modes.forEach(mode => describe(`with "${mode}" mode`, () =>
	{
		describe("accessing files", () =>
		{
			describe("asynchronously", () =>
			{
				it("sets to nothing", done =>
				{
					newFile("normal.txt", defaultAttribs(), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});

				it("sets to archive", done =>
				{
					newFile("archive.txt", defaultAttribs({archive:true}), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});

				it("sets to hidden", done =>
				{
					newFile("hidden.txt", defaultAttribs({hidden:true}), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});

				it("sets to readonly", done =>
				{
					newFile("readonly.txt", defaultAttribs({readonly:true}), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.false;
						done();
					});
				});

				it("sets to system", done =>
				{
					newFile("system.txt", defaultAttribs({system:true}), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.true;
						done();
					});
				});

				it("sets all attributes", done =>
				{
					newFile("all.txt", allAttribs(), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.true;
						done();
					});
				});

				it("throws if non-existent", done =>
				{
					winattr.set("./fake-file", {readonly:true}, setError =>
					{
						expect(setError).to.be.instanceOf(Error);

						winattr.get("./fake-file", (getError, getResult) =>
						{
							expect(getError).to.be.instanceOf(Error);
							done();
						});
					});
				});

				// TODO :: supports "/" and "\" dir separators
			});



			describe("synchronously", () =>
			{
				it("sets to nothing", () =>
				{
					const result = newFileSync("normal.txt", defaultAttribs(), mode);

					expect(result.archive).to.be.false;
					expect(result.hidden).to.be.false;
					expect(result.readonly).to.be.false;
					expect(result.system).to.be.false;
				});

				it("sets to archive", () =>
				{
					const result = newFileSync("archive.txt", defaultAttribs({archive:true}), mode);

					expect(result.archive).to.be.true;
					expect(result.hidden).to.be.false;
					expect(result.readonly).to.be.false;
					expect(result.system).to.be.false;
				});

				it("sets to hidden", () =>
				{
					const result = newFileSync("hidden.txt", defaultAttribs({hidden:true}), mode);

					expect(result.archive).to.be.false;
					expect(result.hidden).to.be.true;
					expect(result.readonly).to.be.false;
					expect(result.system).to.be.false;
				});

				it("sets to readonly", () =>
				{
					const result = newFileSync("readonly.txt", defaultAttribs({readonly:true}), mode);

					expect(result.archive).to.be.false;
					expect(result.hidden).to.be.false;
					expect(result.readonly).to.be.true;
					expect(result.system).to.be.false;
				});

				it("sets to system", () =>
				{
					const result = newFileSync("system.txt", defaultAttribs({system:true}), mode);

					expect(result.archive).to.be.false;
					expect(result.hidden).to.be.false;
					expect(result.readonly).to.be.false;
					expect(result.system).to.be.true;
				});

				it("sets all attributes", () =>
				{
					const result = newFileSync("all.txt", allAttribs(), mode);

					expect(result.archive).to.be.true;
					expect(result.hidden).to.be.true;
					expect(result.readonly).to.be.true;
					expect(result.system).to.be.true;
				});

				it("throws if non-existent", () =>
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
				});
			});
		});



		describe("accessing folders", () =>
		{
			describe("asynchronously", () =>
			{
				it("sets to nothing", done =>
				{
					newFolder("normal", defaultAttribs(), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});

				it("sets to archive", done =>
				{
					newFolder("archive", defaultAttribs({archive:true}), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.true;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});

				it("sets to hidden", done =>
				{
					newFolder("hidden", defaultAttribs({hidden:true}), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.true;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.false;
						done();
					});
				});

				it("sets to readonly", done =>
				{
					newFolder("readonly", defaultAttribs({readonly:true}), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.true;
						expect(result.system).to.be.false;
						done();
					});
				});

				it("sets to system", done =>
				{
					newFolder("system", defaultAttribs({system:true}), mode, (error, result) =>
					{
						if (error!==null) throw error;
						expect(result.archive).to.be.false;
						expect(result.hidden).to.be.false;
						expect(result.readonly).to.be.false;
						expect(result.system).to.be.true;
						done();
					});
				});

				it("sets all attributes", done =>
				{
					newFolder("all", allAttribs(), mode, (error, result) =>
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



			describe("synchronously", () =>
			{
				it("sets to nothing", () =>
				{
					const result = newFolderSync("normal", defaultAttribs(), mode);

					expect(result.archive).to.be.false;
					expect(result.hidden).to.be.false;
					expect(result.readonly).to.be.false;
					expect(result.system).to.be.false;
				});

				it("sets to archive", () =>
				{
					const result = newFolderSync("archive", defaultAttribs({archive:true}), mode);

					expect(result.archive).to.be.true;
					expect(result.hidden).to.be.false;
					expect(result.readonly).to.be.false;
					expect(result.system).to.be.false;
				});

				it("sets to hidden", () =>
				{
					const result = newFolderSync("hidden", defaultAttribs({hidden:true}), mode);

					expect(result.archive).to.be.false;
					expect(result.hidden).to.be.true;
					expect(result.readonly).to.be.false;
					expect(result.system).to.be.false;
				});

				it("sets to readonly", () =>
				{
					const result = newFolderSync("readonly", defaultAttribs({readonly:true}), mode);

					expect(result.archive).to.be.false;
					expect(result.hidden).to.be.false;
					expect(result.readonly).to.be.true;
					expect(result.system).to.be.false;
				});

				it("sets to system", () =>
				{
					const result = newFolderSync("system", defaultAttribs({system:true}), mode);

					expect(result.archive).to.be.false;
					expect(result.hidden).to.be.false;
					expect(result.readonly).to.be.false;
					expect(result.system).to.be.true;
				});

				it("sets all attributes", () =>
				{
					const result = newFolderSync("all", allAttribs(), mode);

					expect(result.archive).to.be.true;
					expect(result.hidden).to.be.true;
					expect(result.readonly).to.be.true;
					expect(result.system).to.be.true;
				});
			});
		});
	}));



	describe("binding load failure", () =>
	{
		class BindingError extends Error
		{
			constructor(message)
			{
				super(message);
				this.name = this.constructor.name;
				Error.captureStackTrace(this, this.constructor);
			}
		}

		const withBrokenBinding = callback =>
		{
			const load = Module._load;

			Module._load = function(request)
			{
				if (request === "fswin")
				{
					throw new BindingError();
				}

				return load.apply(this, arguments);
			};

			try
			{
				return callback();
			}
			finally
			{
				Module._load = load;
			}
		};

		const reset = () =>
		{
			whichLib.lib.mode = null;
			whichLib.lib.binding = null;
			whichLib.lib.shell = null;
			delete require.cache[require.resolve("../lib/binding")];
		};

		beforeEach(reset);

		after(() =>
		{
			reset();
			winattr.change("auto");
		});



		it("falls back to shell when not strict", () =>
		{
			withBrokenBinding(() =>
			{
				winattr.change("auto");
			});

			expect(whichLib.current()).to.equal(require("../lib/shell"));
		});



		it("throws when strict", () =>
		{
			withBrokenBinding(() =>
			{
				expect(() => winattr.change("binding", true)).to.throw(BindingError);
			});
		});
	});



	describe("cscript failure", () =>
	{
		const {spawn, spawnSync} = child_process;

		before(() => winattr.change("shell"));

		afterEach(() =>
		{
			child_process.spawn = spawn;
			child_process.spawnSync = spawnSync;
		});

		after(() => winattr.change("auto"));

		it("throws if get stdout is empty", () =>
		{
			child_process.spawnSync = () => ({ stdout: "", stderr: "", status: 0 });

			expect(() => winattr.getSync("./whatever")).to.throw("unknown error");
		});

		it("calls back with an error if get stdout is empty", done =>
		{
			child_process.spawn = () =>
			{
				const instance = new EventEmitter();
				instance.stderr = new EventEmitter();
				instance.stdout = new EventEmitter();
				process.nextTick(() => instance.emit("exit", 0));  // so the instance is ready for use
				return instance;
			};

			winattr.get("./whatever", error =>
			{
				try
				{
					expect(error).to.be.instanceOf(Error);
					expect(error).to.have.property("message", "unknown error");
					done();
				}
				catch (assertError)
				{
					done(assertError);
				}
			});
		});
	});



	describe("binding procedure failure", () =>
	{
		after(() => winattr.change("auto"));

		it("falls back to shell", () =>
		{
			winattr.change("binding", true);

			const result = whichLib.run(() =>
			{
				if (whichLib.lib.mode === "binding")
				{
					throw new Error("The specified procedure could not be found.");
				}

				return true;
			});

			expect(result).to.equal(true);
			expect(whichLib.current()).to.equal(require("../lib/shell"));
		});
	});
});
