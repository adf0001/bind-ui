
// global, for html page
myObjClass2 = {
	config: {
		cssUrl: window.location.href.replace(/[\/\\]test[\/\\].*/, "") + "/test/2/2.css",
		htmlUrl: window.location.href.replace(/[\/\\]test[\/\\].*/, "") + "/test/2/2.html",

		bindArray: [
			"sp1", ["class", "my-cls1", "txtRed", 2],
			"chk1", ["prop", "checked", "txtRed", 2],
			"chk2", ["prop", "checked", "txtRed", 2],
			"btn", ["evt", "click", "toggleRed"],
		],
	},

	txtRed: true,

	toggleRed: function () { this.txtRed = !this.txtRed; },
};
