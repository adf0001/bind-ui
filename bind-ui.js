
// bind-ui @ npm, htm-tool bind-ui module.

"use strict";

var cq = require("callq");
var http_request = require("browser-http-request");
var ele = require("element-tool");
var query_by_name_path = require("query-by-name-path");
var add_css_text = require("add-css-text");
var bind_element = require("bind-element");

//install mapping tool
var installMappingTool = function (mode, obj, nm) {
	if (mode === "disable" || (typeof mode !== "undefined" && !mode)) return;	//disable

	var topId = nm[""];
	if (mode && mode.slice(0, 4) === "dyna") {
		obj.nme = function (namePath) {
			return query_by_name_path(topId, namePath);
		}
	}
	else {
		obj.nme = function (namePath) {
			if (namePath in nm) return document.getElementById(nm[namePath]);
			var el = query_by_name_path(topId, namePath);
			if (el) nm[namePath] = ele.id(el);	//cache
			return el;
		}
	}
}

/*
	async binding dom-ui to js-object
	
	config:
		
		.cssUrl					// abs url, cssUrl => cssUrlText
		.cssText
		//.cssId				// internal, indicated dom style element id
		
		.htmlUrl				// abs url, htmlUrl => htmlUrlText
		.htmlText
		
		.bindArray				//refer to bindByName() & bindElement()
		
		.nameTool				//name mapping tools
			
			"static"	default
			
				add following members to `obj`,
			
					obj.nme( namePath )
						return the element from namePath, by static id mapping.
			
			"dyna"/"dynamic"
			
				add following members to `obj`,
				
					obj.nme( namePath )
						return the element from namePath, refer module `query-by-name-path`.
			
			"disable"/false
			
				don't add name mapping tools

		.init					//init function, or function name for obj[config.init](el)

*/

//bind_ui = function (el, obj [, [config,] cb] )
module.exports = function (el, obj, config, cb) {
	//arguments
	if (typeof config === "function" && arguments.length == 3) { cb = config; config = null; }

	if (!config) { config = obj.config || obj; }

	el = ele(el);

	//bind
	cq(null, [
		//get cssUrl to load
		function (err, data, que) {
			if (err) return que.final(err);

			if (config.cssId && ele(config.cssId)) return false;		//already loaded to dom
			if (config.cssText || config.cssUrlText) return "";

			return config.cssUrl || "";
		},
		":loadCssUrl", function (err, data, que) {
			http_request(config.cssUrl, 'GET', '', null,
				function (err, data) {
					config.cssUrlText = err ?
						("" + err.error) : //if error load message to dom
						(data.responseText || "");

					que.next(null, true);
				}
			);
		},
		cq.if(true, null, cq.joinAt(config.joinCss = config.joinCss || {}, "loadCssUrl")),
		//load cssText/cssUrlText to dom
		function (err, data, que) {
			if (err) return que.final(err);

			if ((config.cssUrlText || config.cssText) && !(config.cssId && ele(config.cssId))) {
				add_css_text(
					config.cssUrlText || config.cssText,
					config.cssId || (config.cssId = ele.id(null, "bind-css-"))
				);
				//console.log("addCssText " + config.cssId );
			}
			return true;
		},
		//get htmlUrl to load
		function (err, data, que) {
			if (err) return que.final(err);

			if (config.htmlText || config.htmlUrlText) return "";

			return config.htmlUrl || "";
		},
		":loadHtmlUrl", function (err, data, que) {
			http_request(config.htmlUrl, 'GET', '', null,
				function (err, data) {
					config.htmlUrlText = err ?
						("" + err.error) : //if error load message to dom
						(data.responseText || "");

					que.next(null, true);
				}
			);
		},
		cq.if(true, null, cq.joinAt(config.joinHtml = config.joinHtml || {}, "loadHtmlUrl")),
		//set htmlText - bind_element - install name-mapping tools - call init entry
		function (err, data, que) {
			if (err) return que.final(err);

			//set htmlUrlText/htmlText
			if (config.htmlUrlText || config.htmlText) {
				el.innerHTML = (config.htmlUrlText || config.htmlText).
					replace(/\{\{\s*([^\s\}\:]+)\s*(\:([^\}]*))?\}\}/g, "<span name='$1'>$3</span>");
			}

			//bindByName
			if (config.bindArray) {
				var nm = bind_element.array(el, obj, config.bindArray);
				if (nm instanceof Error) return nm;

				//install name-mapping tools
				if (nm) installMappingTool(config.nameTool, obj, nm);
			}

			//init entry
			var typeofInit = typeof (config.init);

			if (typeofInit === "function") {
				config.init.call(obj, el);
			}
			else if (typeofInit === "string") {
				if (obj && typeof (obj[config.init]) === "function") obj[config.init](el);
			}

			return true;
		},
		function (err, data, que) {
			if (cb) cb(err, data);
			else if (err) console.log(err);

			que.next(err, data);
		},
	]);

}
