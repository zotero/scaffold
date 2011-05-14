/*
    ***** BEGIN LICENSE BLOCK *****

    Copyright (c) 2006  Center for History and New Media
                        George Mason University, Fairfax, Virginia, USA
                        http://chnm.gmu.edu

    Licensed under the Educational Community License, Version 1.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.opensource.org/licenses/ecl1.php

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    ***** END LICENSE BLOCK *****
*/

var Zotero = Components.classes["@zotero.org/Zotero;1"]
				// Currently uses only nsISupports
				//.getService(Components.interfaces.chnmIZoteroService).
				.getService(Components.interfaces.nsISupports)
				.wrappedJSObject;

var Scaffold = new function() {
	this.onLoad = onLoad;
	this.load = load;
	this.save = save;
	this.run = run;
	this.generateTranslatorID = generateTranslatorID;
	this.testTargetRegex = testTargetRegex;

	var _browser, _frames, _document;

	var _propertyMap = {
		'textbox-translatorID':'translatorID',
		'textbox-label':'label',
		'textbox-creator':'creator',
		'textbox-target':'target',
		'textbox-minVersion':'minVersion',
		'textbox-maxVersion':'maxVersion',
		'textbox-priority':'priority'
	};

	var _FW = '/* FW LINE 34:8ebd93a34eb1 */ /** Copyright (c) 2010, Erik Hetzner This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.*/function flatten(a) { var retval = new Array(); for (var i in a) { var entry = a[i]; if (entry instanceof Array) { retval = retval.concat(flatten(entry)); } else { retval.push(entry); } } return retval;}/* Generic code */var FW = { _scrapers : new Array()};FW._Base = function () { this.callHook = function (hookName, item, doc, url) { if (typeof this["hooks"] === "object") { var hook = this["hooks"][hookName]; if (typeof hook === "function") { hook(item, doc, url); } } }; this.evaluateThing = function(val, doc, url) { var valtype = typeof val; if (valtype === "string") { return val; } else if (valtype === "object") { if (val instanceof Array) { /* map over each array val */ /* this.evaluate gets out of scope */ var parentEval = this.evaluateThing; var retval = val.map ( function(i) { return parentEval (i, doc, url); } ); return flatten(retval); } else { return val.evaluate(doc, url); } } else if (valtype === "function") { return val(doc, url); } else { return undefined; } }; this.evaluate = function (key, doc, url) { return this.evaluateThing(this[key], doc, url); };};FW.Scraper = function (init) {  FW._scrapers.push(new FW._Scraper(init));};FW._Scraper = function (init) { for (x in init) { this[x] = init[x]; } this._singleFieldNames = [ "abstractNote", "applicationNumber", "archive", "archiveLocation", "artworkMedium", "artworkSize", "assignee", "audioFileType", "audioRecordingType", "billNumber", "blogTitle", "bookTitle", "callNumber", "caseName", "code", "codeNumber", "codePages", "codeVolume", "committee", "company", "conferenceName", "country", "court", "date", "dateDecided", "dateEnacted", "dictionaryTitle", "distributor", "docketNumber", "documentNumber", "DOI", "edition", "encyclopediaTitle", "episodeNumber", "extra", "filingDate", "firstPage", "forumTitle", "genre", "history", "institution", "interviewMedium", "ISBN", "ISSN", "issue", "issueDate", "issuingAuthority", "journalAbbreviation", "label", "language", "legalStatus", "legislativeBody", "letterType", "libraryCatalog", "manuscriptType", "mapType", "medium", "meetingName", "nameOfAct", "network", "number", "numberOfVolumes", "numPages", "pages", "patentNumber", "place", "postType", "presentationType", "priorityNumbers", "proceedingsTitle", "programTitle", "programmingLanguage", "publicLawNumber", "publicationTitle", "publisher", "references", "reportNumber", "reportType", "reporter", "reporterVolume", "rights", "runningTime", "scale", "section", "series", "seriesNumber", "seriesText", "seriesTitle", "session", "shortTitle", "studio", "subject", "system", "thesisType", "title", "type", "university", "url", "version", "videoRecordingType", "volume", "websiteTitle", "websiteType" ]; this.makeItems = function (doc, url) { var item = new Zotero.Item(this.itemType); item.url = url; for (var i in this._singleFieldNames) { var field = this._singleFieldNames[i]; if (this[field]) { var fieldVal = this.evaluate(field, doc, url); if (fieldVal instanceof Array) { item[field] = fieldVal[0]; } else { item[field] = fieldVal; } } } var multiFields = ["creators", "attachments", "tags"]; for (var j in multiFields) { var key = multiFields[j]; var val = this.evaluate(key, doc, url); if (val) { for (var k in val) { item[key].push(val[k]); } } } return [item]; };};FW._Scraper.prototype = new FW._Base;FW.MultiScraper = function (init) {  FW._scrapers.push(new FW._MultiScraper(init));};FW._MultiScraper = function (init) { for (x in init) { this[x] = init[x]; } this._mkSelectItems = function(titles, urls) { var items = new Object; for (var i in titles) { items[urls[i]] = titles[i]; } return items; }; this._selectItems = function(titles, urls) { var items = new Array(); for (var j in Zotero.selectItems(this._mkSelectItems(titles, urls))) { items.push(j); } return items; }; this._mkAttachments = function(doc, url, urls) { var attachmentsArray = this.evaluate("attachments", doc, url); var attachmentsDict = new Object(); if (attachmentsArray) { for (var i in urls) { attachmentsDict[urls[i]] = attachmentsArray[i]; } } return attachmentsDict; }; this.makeItems = function(doc, url) { Zotero.debug("Entering MultiScraper.makeItems"); if (this.beforeFilter) { var newurl = this.beforeFilter(doc, url); if (newurl != url) { return this.makeItems(Zotero.Utilities.retrieveDocument(url), newurl); } } var titles = this.evaluate("titles", doc, url); var urls = this.evaluate("urls", doc, url); var itemsToUse = this._selectItems(titles, urls); var attachments = this._mkAttachments(doc, url, urls); if(!itemsToUse) { Zotero.done(true); return [];} else { var madeItems = new Array(); for (var i in itemsToUse) { var url1 = itemsToUse[i]; var doc1 = Zotero.Utilities.retrieveDocument(url1); var itemTrans; if (this.itemTrans) { itemTrans = this.itemTrans;  } else { itemTrans = FW.getScraper(doc1, url1);  } var items = itemTrans.makeItems(doc1, url1, attachments[url1]); madeItems.push(items[0]); } return madeItems; } };};FW._MultiScraper.prototype = new FW._Base;FW.DelegateTranslator = function (init) {  return new FW._DelegateTranslator(init);};FW._DelegateTranslator = function (init) { for (x in init) { this[x] = init[x]; }  this._translator = Zotero.loadTranslator(this.translatorType); this._translator.setTranslator(this.translatorId);  this.makeItems = function(doc, url, attachments) { Zotero.debug("Entering DelegateTranslator.makeItems"); var tmpItem; var text = Zotero.Utilities.retrieveSource(url); this._translator.setHandler("itemDone", function(obj, item) {  tmpItem = item; /* this does not seem to be working */ if (attachments) { item.attachments = attachments; } });this._translator.setString(text); this._translator.translate(); Zotero.debug("Leaving DelegateTranslator.makeItems"); return [tmpItem]; };};FW.DelegateTranslator.prototype = new FW._Scraper;FW._StringMagic = function () { this._filters = new Array(); this.addFilter = function(filter) { this._filters.push(filter); return this; }; this.split = function(re) { return this.addFilter(function(s) { return s.split(re).filter(function(e) { return (e != ""); }); }); }; this.replace = function(s1, s2, flags) { return this.addFilter(function(s) { if (s.match(s1)) { return s.replace(s1, s2, flags); } else { return s; } }); }; this.prepend = function(prefix) { return this.replace(/^/, prefix); }; this.append = function(postfix) { return this.replace(/$/, postfix); }; this.remove = function(toStrip, flags) { return this.replace(toStrip, "", flags); }; this.trim = function() { return this.addFilter(function(s) { return Zotero.Utilities.trim(s); }); }; this.trimInternal = function() { return this.addFilter(function(s) { return Zotero.Utilities.trimInternal(s); }); }; this.match = function(re, group) { if (!group) group = 0; return this.addFilter(function(s) {  var m = s.match(re); if (m === undefined) { return undefined; } else { return m[group]; }  }); }; this.cleanAuthor = function(type, useComma) { return this.addFilter(function(s) { return Zotero.Utilities.cleanAuthor(s, type, useComma); }); }; this.key = function(field) { return this.addFilter(function(n) { return n[field]; }); }; this.capitalizeTitle = function() { return this.addFilter(function(s) { return Zotero.Utilities.capitalizeTitle(s); }); }; this.unescapeHTML = function() { return this.addFilter(function(s) { return Zotero.Utilities.unescapeHTML(s); }); }; this.unescape = function() { return this.addFilter(function(s) { return unescape(s); }); }; this.makeAttachment = function(type, title) { var filter = function(url) { if (url) { return { url : url, type : type, title : title }; } else { return undefined; } }; return this.addFilter(filter); }; this._applyFilters = function(a, doc1) { Zotero.debug("Entering StringMagic._applyFilters"); for (i in this._filters) { a = flatten(a); /* remove undefined or null array entries */ a = a.filter(function(x) { return ((x !== undefined) && (x !== null)); }); for (var j = 0 ; j < a.length ; j++) { try { if ((a[j] === undefined) || (a[j] === null)) { continue; } else { a[j] = this._filters[i](a[j], doc1); } } catch (x) { a[j] = undefined; Zotero.debug("Caught exception " + x + "on filter: " + this._filters[i]); } } /* remove undefined or null array entries */ /* need this twice because they could have become undefined or null along the way */ a = a.filter(function(x) { return ((x !== undefined) && (x !== null)); }); } return a; };};FW.PageText = function () { return new FW._PageText();};FW._PageText = function() { this._filters = new Array(); this.evaluate = function (doc) {  var a = [doc.documentElement.innerHTML]; a = this._applyFilters(a, doc); if (a.length == 0) { return false; } else { return a; } };};FW._PageText.prototype = new FW._StringMagic();FW.Url = function () { return new FW._Url(); };FW._Url = function () { this._filters = new Array(); this.evaluate = function (doc, url) {  var a = [url]; a = this._applyFilters(a, doc); if (a.length == 0) { return false; } else { return a; } };};FW._Url.prototype = new FW._StringMagic();FW.Xpath = function (xpathExpr) { return new FW._Xpath(xpathExpr); };FW._Xpath = function (_xpath) { this._xpath = _xpath; this._filters = new Array(); this.text = function() { var filter = function(n) { if (typeof n === "object" && n.textContent) { return n.textContent; } else { return n; } }; this.addFilter(filter); return this; }; this.sub = function(xpath) { var filter = function(n, doc) { var result = doc.evaluate(xpath, n, null, XPathResult.ANY_TYPE, null); if (result) { return result.iterateNext(); } else { return undefined;  } }; this.addFilter(filter); return this; }; this.evaluate = function (doc) { var it = doc.evaluate(this._xpath, doc, null, XPathResult.ANY_TYPE, null); var a = new Array(); var x; while (x = it.iterateNext()) { a.push(x); } a = this._applyFilters(a, doc); if (a.length == 0) { return false; } else { return a; } };};FW._Xpath.prototype = new FW._StringMagic();FW.detectWeb = function (doc, url) { for (var i in FW._scrapers) {var scraper = FW._scrapers[i];var itemType = scraper.evaluate("itemType", doc, url);if (!scraper.detect) { return itemType;} else { var v = scraper.evaluate("detect", doc, url); if (v.length > 0 && v[0]) {return itemType; }} } return undefined;};FW.getScraper = function (doc, url) { var itemType = FW.detectWeb(doc, url); return FW._scrapers.filter(function(s) { return (s.evaluate("itemType", doc, url) == itemType)&& (s.evaluate("detect", doc, url)) })[0];};FW.doWeb = function (doc, url) { Zotero.debug("Entering FW.doWeb"); var scraper = FW.getScraper(doc, url); var items = scraper.makeItems(doc, url); for (var i in items) { scraper.callHook("scraperDone", items[i], doc, url); items[i].complete(); } Zotero.debug("Leaving FW.doWeb");};/* End generic code */';
	function onLoad() {
		_document = document;

		_browser = Components.classes["@mozilla.org/appshell/window-mediator;1"]
						   .getService(Components.interfaces.nsIWindowMediator)
						   .getMostRecentWindow("navigator:browser");

		_browser.document.getElementById("content").tabContainer.addEventListener("TabSelect",
			_updateFrames, true);
		_browser.document.getElementById("appcontent").addEventListener("pageshow",
			_updateFrames, true);
		_updateFrames();

		generateTranslatorID();
	}

	/*
	 * load translator from database
	 */
	function load() {
		var io = new Object();
		window.openDialog("chrome://scaffold/content/load.xul",
			"_blank","chrome,modal", io);
		var translator = io.dataOut;

		for(var id in _propertyMap) {
			document.getElementById(id).value = translator[_propertyMap[id]];
		}

		//Strip JSON metadata
		var lastUpdatedIndex = translator.code.indexOf('"lastUpdated"');
		var header = translator.code.substr(0, lastUpdatedIndex + 50);
		var m = /^\s*{[\S\s]*?}\s*?[\r\n]+/.exec(header);
		var usesFW = (translator.code.substr(m[0].length).match(/^\/\* FW LINE \d+:[a-fA-F0-9]+/) == true);
		if(usesFW) var fixedCode = translator.code.substr(m[0].length).replace(/^\/\* FW LINE \d+:[a-fA-F0-9]+[^\n]*\n/,'\n');
		else fixedCode = translator.code.substr(m[0].length);
		document.getElementById('editor-code').textbox.value = fixedCode;
		
		document.getElementById('checkbox-framework').checked = usesFW;
		
		var configOptions, displayOptions;
		if(translator.configOptions) {
		    configOptions = JSON.stringify(translator.configOptions);
		}
		if(configOptions != '{}') {
		    document.getElementById('textbox-configOptions').value = configOptions;
		}
		if(translator.displayOptions) {
		    displayOptions = JSON.stringify(translator.displayOptions);
		}
		if(displayOptions != '{}') {
		    document.getElementById('textbox-displayOptions').value = displayOptions;
		}

		// get translator type; might as well have some fun here
		var type = translator.translatorType;
		var types = ["import", "export", "web", "search"];
		for(var i=2; i<=8; i*=2) {
			var mod = type % i;
			document.getElementById('checkbox-'+types.shift()).checked = !!mod;
			if(mod) type -= mod;
		}
	}

	/*
	 * save translator to database
	 */
	function save() {
		//seems like duplicating some effort from _getTranslator
		var code = document.getElementById('editor-code').textbox.value;

		var metadata = {
			translatorID: document.getElementById('textbox-translatorID').value,
			label: document.getElementById('textbox-label').value,
			creator: document.getElementById('textbox-creator').value,
			target: document.getElementById('textbox-target').value,
			minVersion: document.getElementById('textbox-minVersion').value,
			maxVersion: document.getElementById('textbox-maxVersion').value,
			priority: parseInt(document.getElementById('textbox-priority').value)
		};

		if(document.getElementById('textbox-configOptions').value != '') {
		    metadata.configOptions = JSON.parse(document.getElementById('textbox-configOptions').value);
		}
		if(document.getElementById('textbox-displayOptions').value != '') {
		    metadata.displayOptions = JSON.parse(document.getElementById('textbox-displayOptions').value);
		}
		
		if(document.getElementById('checkbox-framework').checked) {
			code = _FW + '\n' + code;
		}

		metadata.inRepository = true;

		metadata.translatorType = 0;
		if(document.getElementById('checkbox-import').checked) {
			metadata.translatorType += 1;
		}
		if(document.getElementById('checkbox-export').checked) {
			metadata.translatorType += 2;
		}
		if(document.getElementById('checkbox-web').checked) {
			metadata.translatorType += 4;
		}
		if(document.getElementById('checkbox-search').checked) {
			metadata.translatorType += 8;
		}

		var date = new Date();
		metadata.lastUpdated = date.getFullYear()
			+"-"+Zotero.Utilities.lpad(date.getMonth()+1, '0', 2)
			+"-"+Zotero.Utilities.lpad(date.getDate(), '0', 2)
			+" "+Zotero.Utilities.lpad(date.getHours(), '0', 2)
			+":"+Zotero.Utilities.lpad(date.getMinutes(), '0', 2)
			+":"+Zotero.Utilities.lpad(date.getSeconds(), '0', 2);

		Zotero.Translators.save(metadata,code);
		Zotero.Translators.init();
	}

	/*
	 * run translator
	 */
	function run(functionToRun) {
		if (document.getElementById('textbox-label').value == 'Untitled') {
			alert("Translator title not set");
			return;
		}

		document.getElementById('output').value = '';

		save();

		// for now, only web translation is supported
		// generate new translator; do not save
		var translate = new Zotero.Translate.Web();
		translate.setDocument(_getDocument());
		translate.setHandler("error", _error);
		translate.setHandler("debug", _debug);
		//To do: both functions don't work properly
		//detectWeb give error: 11:20:07 detectWeb returned type "undefined"
		//doWeb saves item to library and outputs wrong stuff
		if (functionToRun == "detectWeb") {
			// get translator
			var translator = _getTranslator();
			// don't let target prevent translator from operating
			translator.target = null;
			// generate sandbox
			translate.setHandler("translators", _translators);
			// internal hack to call detect on this translator
			translate._potentialTranslators = [translator];
			translate._foundTranslators = [];
			translate._currentState = "detect";
			translate._detect();
		} else if (functionToRun == "doWeb") {
			// get translator
			var translator = _getTranslator();
			// don't let the detectCode prevent the translator from operating
			translator.detectCode = null;
			translate.setTranslator(translator);
			translate.setHandler("select", _selectItems);
			translate.clearHandlers("itemDone");
			translate.setHandler("itemDone", _myItemDone);
			// disable output to database
			translate.translate(false);
		}
	}

	/*
	 * generate translator GUID
	 */
	function generateTranslatorID() {
		document.getElementById("textbox-translatorID").value = _generateGUID();
	}

	/*
	 * test target regular expression against document URL
	 */
	function testTargetRegex() {
		var testDoc = _getDocument();
		var url = Zotero.Proxies.proxyToProper(testDoc.location.href);

		try {
			var targetRe = new RegExp(document.getElementById('textbox-target').value, "i");
		} catch(e) {
			_logOutput("Regex parse error:\n"+Zotero.varDump(e));
		}

		_logOutput(targetRe.test(url));
	}

	/*
	 * called to select items
	 */
	function _selectItems(obj, itemList) {
		var io = { dataIn:itemList, dataOut:null }
		var newDialog = window.openDialog("chrome://zotero/content/ingester/selectitems.xul",
			"_blank","chrome,modal,centerscreen,resizable=yes", io);

		return io.dataOut;
	}

	/*
	 * called if an error occurs
	 */
	function _error(obj, error) {
		/* FIXME This just is annoying now, since it doesn't work
		if(error && error.lineNumber) {
			// highlight the line with the error
			var start = 0;
			var lineCount = 0;
			var textbox = document.getElementById('editor-code').textbox;

			while(start < textbox.value.length && lineCount < error.lineNumber) {
				start = textbox.value.indexOf("\n", start+1);
				lineCount++;
			}

			if(start != -1) {
				var end = textbox.value.indexOf("\n", start+1);
				if(end == -1) end = textbox.value.length-1;

				textbox.selectionStart = start;
				textbox.selectionEnd = end;
			}
		}*/
	}

	/*
	 * logs translator output (instead of logging in the console)
	 */
	function _debug(obj, string) {
		_logOutput(string);
	}

	/*
	 * logs item output
	 */
	function _myItemDone(obj, item) {
		Zotero.debug("Item returned");
		
		// Clear attachment document objects
		if (item && item.attachments && item.attachments.length) {
			for (var i=0; i<item.attachments.length; i++) {
				item.attachments[i].document = "[object]";
			}
		}

		// _logOutput("Returned item:\n"+Zotero.varDump(item._itemData));
		_logOutput("Returned item:\n"+Zotero.varDump(item));
	}

	/*
	 * prints information from detectCode to window
	 */
	 function _translators(obj, translators) {
	 	if(translators && translators.length != 0) {
			_logOutput('detectWeb returned type "'+translators[0].itemType+'"');
	 	}
	 }

	/*
	 * logs debug info (instead of console)
	 */
	function _logOutput(string) {
		var date = new Date();
		var output = document.getElementById('output');

		// use vardump on non-strings
		if(typeof string != "string") {
			string = Zotero.varDump(string);
		}

		if(output.value) output.value += "\n";
		output.value += Zotero.Utilities.lpad(date.getHours(), '0', 2)
				+":"+Zotero.Utilities.lpad(date.getMinutes(), '0', 2)
				+":"+Zotero.Utilities.lpad(date.getSeconds(), '0', 2)
				+" "+string.replace(/\n/g, "\n         ");
		// move to end
		output.inputField.scrollTop = output.inputField.scrollHeight;
	}

	/*
	 * gets translator data from the metadata pane
	 */
	function _getTranslator() {
		// use _propertyMap for text boxes
		var translator = new Object();
		for(var id in _propertyMap) {
			translator[_propertyMap[id]] = document.getElementById(id).value;
		}
		//RZ: prefix for translator.code is hack to force correct parsing in translate.js
		//after completion of Zotero.Translate.prototype._parseCode, the code will start with "var translatorInfo = 1;", and detectWeb will be detected
		var locFW = document.getElementById('checkbox-framework').checked ? _FW : '';
		translator.code = "1;" + locFW + document.getElementById('editor-code').textbox.value;

		// load translator type
		translator.translatorType = 0;
		if(document.getElementById('checkbox-import').checked) {
			translator.translatorType += 1;
		}
		if(document.getElementById('checkbox-export').checked) {
			translator.translatorType += 2;
		}
		if(document.getElementById('checkbox-web').checked) {
			translator.translatorType += 4;
		}
		if(document.getElementById('checkbox-search').checked) {
			translator.translatorType += 8;
		}

		return translator;
	}

	/*
	 * generates an RFC 4122 compliant random GUID
	 */
	function _generateGUID() {
		var guid = "";
		for(var i=0; i<16; i++) {
			var bite = Math.floor(Math.random() * 255);

			if(i == 4 || i == 6 || i == 8 || i == 10) {
				guid += "-";

				// version
				if(i == 6) bite = bite & 0x0f | 0x40;
				// variant
				if(i == 8) bite = bite & 0x3f | 0x80;
			}
			var str = bite.toString(16);
			guid += str.length == 1 ? '0' + str : str;
		}
		return guid;
	}

	/*
	 * updates list of available frames
	 */
	function _updateFrames() {
		var doc = _browser.document.getElementById("content").contentDocument;
		var menulist = _document.getElementById("menulist-testFrame");

		menulist.removeAllItems();
		var popup = _document.createElement("menupopup");
		menulist.appendChild(popup);

		_frames = new Array();

		var frames = doc.getElementsByTagName("frame");
		if(frames.length) {
			_getFrames(frames, popup);
		} else {
			var item = _document.createElement("menuitem");
			item.setAttribute("label", "Default");
			popup.appendChild(item);

			_frames = [doc];
		}

		menulist.selectedIndex = 0;
	}

	/*
	 * recursively searches for frames
	 */
	function _getFrames(frames, popup) {
		for each(var frame in frames) {
			if(frame.contentDocument) {
				// get a good name
				var frameName;
				if(frame.title) {
					frameName = frame.title;
				} else if(frame.name) {
					frameName = frame.name;
				} else {
					frameName = frame.contentDocument.location.href;
				}

				// add frame
				var item = _document.createElement("menuitem");
				item.setAttribute("label", frameName);
				popup.appendChild(item);
				_frames.push(frame.contentDocument);

				// see if frame has its own frames
				var subframes = frame.contentDocument.getElementsByTagName("frame");
				if(subframes.length) _getFrames(subframes, popup);
			}
		}
	}

	/*
	 * gets selected frame/document
	 */
	function _getDocument() {
		return _frames[_document.getElementById("menulist-testFrame").selectedIndex];
	}
}

window.addEventListener("load", function(e) { Scaffold.onLoad(e); }, false);
