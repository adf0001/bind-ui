
// global, for html page
bind_ui = require("../bind-ui.js");
ele = require("element-tool");
query_by_name_path = require("query-by-name-path");

require("./2/cls-2.js");

module.exports = {

	"bind_ui()": function (done) {
		ele('divResult3').innerHTML = "<div></div><div></div>";

		myObjClass = {
			config: {
				cssText: ".my-cls1{color:red;}",
				htmlText: "<span class='my-cls1' name='sp1'>aaaaa</span> " +
					"<label><input name='chk1' type=checkbox ></input>chk1</label> " +
					"<label><input name='chk2' type=checkbox ></input>chk2</label> " +
					"<button name='btn'>toggle</button> " +
					"<button onclick=\"var el= query_by_name_path(this.parentNode,'chk1'); el.checked=!el.checked;\">toggle2</button>" +
					"",
				bindArray: [
					"sp1", ["class", "my-cls1", "txtRed", 2],
					"chk1", ["prop", "checked", "txtRed", 2],
					"chk2", ["prop", "checked", "txtRed", 2],
					"btn", ["evt", "click", "toggleRed"],
				],

				init: "init",
			},

			txtRed: true,

			toggleRed: function () { this.txtRed = !this.txtRed; },

			init: function (el) { console.log("init 1, " + this.nme("").id) },

		}

		var anyFail = false;
		bind_ui(ele('divResult3').childNodes[0], Object.create(myObjClass), null, function (err, data) { anyFail = anyFail || err; showResult(anyFail || data, 2, anyFail || false); });
		bind_ui(ele('divResult3').childNodes[1], Object.create(myObjClass), null, function (err, data) { anyFail = anyFail || err; showResult(anyFail || data, 2, anyFail || false); });
	},

	"bind_ui()/url": function (done) {
		ele('divResult3').innerHTML = "<div></div><div></div>";

		var myObjClass = {
			config: {
				cssUrl: "1.css",
				htmlUrl: "1.html",
				bindArray: [
					"sp1", ["class", "my-cls1", "txtRed", 2],
					"chk1", ["prop", "checked", "txtRed", 2],
					"chk2", ["prop", "checked", "txtRed", 2],
					"btn", ["evt", "click", "toggleRed"],
				],
			},

			txtRed: true,

			toggleRed: function () { this.txtRed = !this.txtRed; },

			init2: function (el) { console.log("init 2, " + this.nme("").id) },
		}

		myObjClass.config.init = myObjClass.init2;

		var anyFail = false;
		bind_ui(ele('divResult3').childNodes[0], Object.create(myObjClass), null, function (err, data) { if (err) console.log(err); anyFail = anyFail || err; showResult(anyFail || data, 2, anyFail || false); });
		bind_ui(ele('divResult3').childNodes[1], Object.create(myObjClass), null, function (err, data) { if (err) console.log(err); anyFail = anyFail || err; showResult(anyFail || data, 2, anyFail || false); });
	},

	"bind_ui()/abs url": function (done) {
		ele('divResult3').innerHTML = "<div></div><div></div>";

		var anyFail = false;
		bind_ui(ele('divResult3').childNodes[0], Object.create(myObjClass2), null, function (err, data) { if (err) console.log(err); anyFail = anyFail || err; showResult(anyFail || data, 2, anyFail || false); });
		bind_ui(ele('divResult3').childNodes[1], Object.create(myObjClass2), null, function (err, data) { if (err) console.log(err); anyFail = anyFail || err; showResult(anyFail || data, 2, anyFail || false); });
	},

	"bind_ui()/require": function (done) {
		ele('divResult3').innerHTML = "<div></div><div></div>";

		var myObjClass3 = require("cls-3");

		var anyFail = false;
		bind_ui(ele('divResult3').childNodes[0], Object.create(myObjClass3), null, function (err, data) { if (err) console.log(err); anyFail = anyFail || err; showResult(anyFail || data, 2, anyFail || false); });
		bind_ui(ele('divResult3').childNodes[1], Object.create(myObjClass3), null, function (err, data) { if (err) console.log(err); anyFail = anyFail || err; showResult(anyFail || data, 2, anyFail || false); });
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('mocha-test', function () { for (var i in module.exports) { it(i, module.exports[i]); } });
