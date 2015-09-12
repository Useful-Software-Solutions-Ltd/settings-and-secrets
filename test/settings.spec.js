var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon');

chai.should();

describe('settings', function () {
	var settings,
		configFile = {
			"prop1": "one"
		},
		secretsFile = {
			"prop1": "secretOne",
			"prop2": "secretThree"
		};

	beforeEach(function () {
	});

	it('should add customSettings properties to settings', function () {
		var fs = {
			existsSync: function () { },
			readFileSync: function () { }
		};

		sinon.stub(fs, "existsSync")
			.withArgs("./config.json").returns(false)
			.withArgs("./secrets.json").returns(false);

		settings = require('../source/settings')({ test: "test" }, null, fs);

		expect(settings).to.haveOwnProperty("test");
	});

	it('should return properties in settings.json', function () {
		var fs = {
			existsSync: function () { },
			readFileSync: function () { }
		};

		sinon.stub(fs, "existsSync")
			.withArgs("./config.json").returns(true)
			.withArgs("./secrets.json").returns(false);

		sinon.stub(fs, "readFileSync").returns(JSON.stringify(configFile));

		settings = require('../source/settings')(null, null, fs);

		expect(settings).to.haveOwnProperty("prop1");
	});

	it('should return properties in secrets.json', function () {
		var fs = {
			existsSync: function () { },
			readFileSync: function () { }
		};

		sinon.stub(fs, "existsSync")
			.withArgs("./config.json").returns(false)
			.withArgs("./secrets.json").returns(true);

		sinon.stub(fs, "readFileSync").returns(JSON.stringify(secretsFile));

		settings = require('../source/settings')(null, null, fs);

		expect(settings).to.haveOwnProperty("prop2");
	});

	it('should return override settings.json property with secrets.json property', function () {
		var fs = {
			existsSync: function () { },
			readFileSync: function () { }
		};

		sinon.stub(fs, "existsSync")
			.withArgs("./config.json").returns(true)
			.withArgs("./secrets.json").returns(true);

		sinon.stub(fs, "readFileSync")
			.withArgs("./config.json").returns(JSON.stringify(configFile))
			.withArgs("./secrets.json").returns(JSON.stringify(secretsFile));

		settings = require('../source/settings')(null, null, fs);

		expect(settings.prop1).to.equal("secretOne");
	});

	it('should return override config file property with custom property', function () {
		var fs = {
			existsSync: function () { },
			readFileSync: function () { }
		};

		sinon.stub(fs, "existsSync")
			.withArgs("./config.json").returns(true)
			.withArgs("./secrets.json").returns(true);

		sinon.stub(fs, "readFileSync")
			.withArgs("./config.json").returns(JSON.stringify(configFile))
			.withArgs("./secrets.json").returns(JSON.stringify(secretsFile));

		settings = require('../source/settings')({ prop1: "customOne" }, null, fs);

		expect(settings.prop1).to.equal("customOne");
	});

	it('should override the default settingsFiles paths with new ones set by the settingsFiles parameter', function () {
		var fs = {
			existsSync: function () { },
			readFileSync: function () { }
		};

		sinon.stub(fs, "existsSync")
			.withArgs("./config.json").returns(true)
			.withArgs("./custom/config.json").returns(true)
			.withArgs("./custom/custom.json").returns(true)
			.withArgs("./secrets.json").returns(true);

		sinon.stub(fs, "readFileSync")
			.withArgs("./config.json").returns("{}")
			.withArgs("./custom/config.json").returns(JSON.stringify(configFile))
			.withArgs("./custom/custom.json").returns(JSON.stringify({ "custom": "custom" }))
			.withArgs("./custom.json").returns(JSON.stringify(secretsFile));

		settings = require('../source/settings')(null, ["./custom/config.json", "./custom/custom.json"], fs);

		expect(JSON.stringify(settings)).to.equal('{"prop1":"one","custom":"custom"}');
	});
});