/*
    ***** BEGIN LICENSE BLOCK *****
    
    Copyright © 2011 Center for History and New Media
                     George Mason University, Fairfax, Virginia, USA
                     http://zotero.org
    
    This file is part of Zotero.
    
    Zotero is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    Zotero is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    
    You should have received a copy of the GNU Affero General Public License
    along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
    
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
	this.onResize = onResize;
	this.populateTests = populateTests;
	this.saveTests = saveTests;
	this.runSelectedTests = runSelectedTests;
	this.updateSelectedTests = updateSelectedTests;
	this.deleteSelectedTests = deleteSelectedTests;
	this.newTestFromCurrent = newTestFromCurrent;

	var _browser, _frames, _document;

	Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
		.getService(Components.interfaces.mozIJSSubScriptLoader)
		.loadSubScript("chrome://scaffold/content/ace/ace.js");

	Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
		.getService(Components.interfaces.mozIJSSubScriptLoader)
		.loadSubScript("chrome://scaffold/content/ace/mode-javascript.js");

        this.ace = ace;
        var _JavaScriptMode = require("ace/mode/javascript").Mode;
        var _TextMode = require("ace/mode/text").Mode;
        var _EditSession = require("ace/edit_session").EditSession;
	var _editors = {};

	var _propertyMap = {
		'textbox-translatorID':'translatorID',
		'textbox-label':'label',
		'textbox-creator':'creator',
		'textbox-target':'target',
		'textbox-minVersion':'minVersion',
		'textbox-maxVersion':'maxVersion',
		'textbox-priority':'priority'
	};

	var _FW = '/* FW LINE 46:127318f30c1d */ function flatten(c){var b=new Array();for(var d in c){var e=c[d];if(e instanceof Array){b=b.concat(flatten(e))}else{b.push(e)}}return b}var FW={_scrapers:new Array()};FW._Base=function(){this.callHook=function(b,c,e,a){if(typeof this["hooks"]==="object"){var d=this["hooks"][b];if(typeof d==="function"){d(c,e,a)}}};this.evaluateThing=function(f,e,c){var b=typeof f;if(b==="string"){return f}else{if(b==="object"){if(f instanceof Array){var d=this.evaluateThing;var a=f.map(function(g){return d(g,e,c)});return flatten(a)}else{return f.evaluate(e,c)}}else{if(b==="function"){return f(e,c)}else{return undefined}}}}};FW.Scraper=function(a){FW._scrapers.push(new FW._Scraper(a))};FW._Scraper=function(a){for(x in a){this[x]=a[x]}this._singleFieldNames=["abstractNote","applicationNumber","archive","archiveLocation","artworkMedium","artworkSize","assignee","audioFileType","audioRecordingType","billNumber","blogTitle","bookTitle","callNumber","caseName","code","codeNumber","codePages","codeVolume","committee","company","conferenceName","country","court","date","dateDecided","dateEnacted","dictionaryTitle","distributor","docketNumber","documentNumber","DOI","edition","encyclopediaTitle","episodeNumber","extra","filingDate","firstPage","forumTitle","genre","history","institution","interviewMedium","ISBN","ISSN","issue","issueDate","issuingAuthority","journalAbbreviation","label","language","legalStatus","legislativeBody","letterType","libraryCatalog","manuscriptType","mapType","medium","meetingName","nameOfAct","network","number","numberOfVolumes","numPages","pages","patentNumber","place","postType","presentationType","priorityNumbers","proceedingsTitle","programTitle","programmingLanguage","publicLawNumber","publicationTitle","publisher","references","reportNumber","reportType","reporter","reporterVolume","rights","runningTime","scale","section","series","seriesNumber","seriesText","seriesTitle","session","shortTitle","studio","subject","system","thesisType","title","type","university","url","version","videoRecordingType","volume","websiteTitle","websiteType"];this._makeAttachments=function(q,b,f,s){if(f instanceof Array){f.forEach(function(k){this._makeAttachments(q,b,k,s)},this)}else{if(typeof f==="object"){var p=f.urls||f.url;var m=f.types||f.type;var e=f.titles||f.title;var h=this.evaluateThing(p,q,b);var o=this.evaluateThing(e,q,b);var r=this.evaluateThing(m,q,b);var l=(r instanceof Array);var n=(o instanceof Array);if(!(h instanceof Array)){h=[h]}for(var j in h){var c=h[j];var g;var d;if(l){g=r[j]}else{g=r}if(n){d=o[j]}else{d=o}s.attachments.push({url:c,title:d,type:g})}}}};this.makeItems=function(o,b,m,c,l){var q=new Zotero.Item(this.itemType);q.url=b;for(var h in this._singleFieldNames){var n=this._singleFieldNames[h];if(this[n]){var g=this.evaluateThing(this[n],o,b);if(g instanceof Array){q[n]=g[0]}else{q[n]=g}}}var r=["creators","tags"];for(var f in r){var p=r[f];var d=this.evaluateThing(this[p],o,b);if(d){for(var e in d){q[p].push(d[e])}}}this._makeAttachments(o,b,this["attachments"],q);c(q,this,o,b);l([q])}};FW._Scraper.prototype=new FW._Base;FW.MultiScraper=function(a){FW._scrapers.push(new FW._MultiScraper(a))};FW._MultiScraper=function(a){for(x in a){this[x]=a[x]}this._mkSelectItems=function(e,d){var b=new Object;for(var c in e){b[d[c]]=e[c]}return b};this._selectItems=function(d,c,e){var b=new Array();Zotero.selectItems(this._mkSelectItems(d,c),function(f){for(var g in f){b.push(g)}e(b)})};this._mkAttachments=function(g,d,f){var b=this.evaluateThing(this["attachments"],g,d);var c=new Object();if(b){for(var e in f){c[f[e]]=b[e]}}return c};this._makeChoices=function(f,p,c,d,h){if(f instanceof Array){f.forEach(function(k){this._makeTitlesUrls(k,p,c,d,h)},this)}else{if(typeof f==="object"){var m=f.urls||f.url;var e=f.titles||f.title;var n=this.evaluateThing(m,p,c);var j=this.evaluateThing(e,p,c);var l=(j instanceof Array);if(!(n instanceof Array)){n=[n]}for(var g in n){var b=n[g];var o;if(l){o=j[g]}else{o=j}h.push(b);d.push(o)}}}};this.makeItems=function(j,b,g,c,f){Zotero.debug("Entering MultiScraper.makeItems");if(this.beforeFilter){var k=this.beforeFilter(j,b);if(k!=b){this.makeItems(j,k,g,c,f);return}}var e=[];var h=[];this._makeChoices(this["choices"],j,b,e,h);var d=this._mkAttachments(j,b,h);this._selectItems(e,h,function(m){if(!m){f([])}else{var l=[];var n=this.itemTrans;Zotero.Utilities.processDocuments(m,function(q){var p=q.documentURI;var o=n;if(o===undefined){o=FW.getScraper(q,p)}if(o===undefined){}else{o.makeItems(q,p,d[p],function(r){l.push(r);c(r,o,q,p)},function(){})}},function(){f(l)})}})}};FW._MultiScraper.prototype=new FW._Base;FW.DelegateTranslator=function(a){return new FW._DelegateTranslator(a)};FW._DelegateTranslator=function(a){for(x in a){this[x]=a[x]}this._translator=Zotero.loadTranslator(this.translatorType);this._translator.setTranslator(this.translatorId);this.makeItems=function(g,d,b,f,c){Zotero.debug("Entering DelegateTranslator.makeItems");var e;Zotero.Utilities.HTTP.doGet(d,function(h){this._translator.setHandler("itemDone",function(k,j){e=j;if(b){j.attachments=b}});this._translator.setString(h);this._translator.translate();f(e)},function(){c([e])})}};FW.DelegateTranslator.prototype=new FW._Scraper;FW._StringMagic=function(){this._filters=new Array();this.addFilter=function(a){this._filters.push(a);return this};this.split=function(a){return this.addFilter(function(b){return b.split(a).filter(function(c){return(c!="")})})};this.replace=function(c,b,a){return this.addFilter(function(d){if(d.match(c)){return d.replace(c,b,a)}else{return d}})};this.prepend=function(a){return this.replace(/^/,a)};this.append=function(a){return this.replace(/$/,a)};this.remove=function(b,a){return this.replace(b,"",a)};this.trim=function(){return this.addFilter(function(a){return Zotero.Utilities.trim(a)})};this.trimInternal=function(){return this.addFilter(function(a){return Zotero.Utilities.trimInternal(a)})};this.match=function(a,b){if(!b){b=0}return this.addFilter(function(d){var c=d.match(a);if(c===undefined||c===null){return undefined}else{return c[b]}})};this.cleanAuthor=function(b,a){return this.addFilter(function(c){return Zotero.Utilities.cleanAuthor(c,b,a)})};this.key=function(a){return this.addFilter(function(b){return b[a]})};this.capitalizeTitle=function(){return this.addFilter(function(a){return Zotero.Utilities.capitalizeTitle(a)})};this.unescapeHTML=function(){return this.addFilter(function(a){return Zotero.Utilities.unescapeHTML(a)})};this.unescape=function(){return this.addFilter(function(a){return unescape(a)})};this._applyFilters=function(c,e){for(i in this._filters){c=flatten(c);c=c.filter(function(a){return((a!==undefined)&&(a!==null))});for(var d=0;d<c.length;d++){try{if((c[d]===undefined)||(c[d]===null)){continue}else{c[d]=this._filters[i](c[d],e)}}catch(b){c[d]=undefined;Zotero.debug("Caught exception "+b+"on filter: "+this._filters[i])}}c=c.filter(function(a){return((a!==undefined)&&(a!==null))})}return c}};FW.PageText=function(){return new FW._PageText()};FW._PageText=function(){this._filters=new Array();this.evaluate=function(c){var b=[c.documentElement.innerHTML];b=this._applyFilters(b,c);if(b.length==0){return false}else{return b}}};FW._PageText.prototype=new FW._StringMagic();FW.Url=function(){return new FW._Url()};FW._Url=function(){this._filters=new Array();this.evaluate=function(d,c){var b=[c];b=this._applyFilters(b,d);if(b.length==0){return false}else{return b}}};FW._Url.prototype=new FW._StringMagic();FW.Xpath=function(a){return new FW._Xpath(a)};FW._Xpath=function(a){this._xpath=a;this._filters=new Array();this.text=function(){var b=function(c){if(typeof c==="object"&&c.textContent){return c.textContent}else{return c}};this.addFilter(b);return this};this.sub=function(b){var c=function(f,e){var d=e.evaluate(b,f,null,XPathResult.ANY_TYPE,null);if(d){return d.iterateNext()}else{return undefined}};this.addFilter(c);return this};this.evaluate=function(e){var d=e.evaluate(this._xpath,e,null,XPathResult.ANY_TYPE,null);var c=new Array();var b;while(b=d.iterateNext()){c.push(b)}c=this._applyFilters(c,e);if(c.length==0){return false}else{return c}}};FW._Xpath.prototype=new FW._StringMagic();FW.detectWeb=function(e,b){for(var c in FW._scrapers){var d=FW._scrapers[c];var f=d.evaluateThing(d.itemType,e,b);if(!d.detect){return f}else{var a=d.evaluateThing(d.detect,e,b);if(a.length>0&&a[0]){return f}}}return undefined};FW.getScraper=function(b,a){var c=FW.detectWeb(b,a);return FW._scrapers.filter(function(d){return(d.evaluateThing(d.itemType,b,a)==c)&&(d.evaluateThing(d.detect,b,a))})[0]};FW.doWeb=function(c,a){Zotero.debug("Entering FW.doWeb");var b=FW.getScraper(c,a);b.makeItems(c,a,[],function(f,e,g,d){e.callHook("scraperDone",f,g,d);if(!f.title){f.title=""}f.complete()},function(){Zotero.done()});Zotero.wait();Zotero.debug("Leaving FW.doWeb")};';

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

		_editors["import"] = this.ace.edit('editor-import');
		_editors["code"] = this.ace.edit('editor-code');

		_editors["code"].getSession().setUseWorker(false);
		_editors["code"].getSession().setMode(new _JavaScriptMode);
		_editors["code"].getSession().setUseSoftTabs(false);
		
		_editors["import"].getSession().setMode(new _TextMode);

		// Set resize handler
		_document.addEventListener("resize", this.onResize, false);
		
		// Boilerplate for framework translators
		document.getElementById('checkbox-framework').addEventListener("command",
			function() {
				var usesFW = document.getElementById('checkbox-framework').checked;
				/* Code to set compat for framework translators
				if (!usesFW) {
					for each(var browser in ["gecko", "chrome", "safari"]) {
						document.getElementById('checkbox-'+browser).checked = true;
					}
				*/
				
				// If code hasn't been added, put the boilerplate in
				// We could be fancy here and see if detectWeb / doWeb are set
				if (usesFW && _editors["code"].getSession().getValue().trim() == "")
					_editors["code"].getSession().setValue("function detectWeb(doc, url) { return FW.detectWeb(doc, url); }\nfunction doWeb(doc, url) { return FW.doWeb(doc, url); }");
			}, true);

		generateTranslatorID();
	}

	function onResize() {
		// We try to let ACE resize itself
		_editors["import"].resize();
		_editors["code"].resize();

		return true;
	}

	/*
	 * load translator from database
	 */
	function load() {
		var io = new Object();
		window.openDialog("chrome://scaffold/content/load.xul",
			"_blank","chrome,modal", io);
		var translator = io.dataOut;

		// No translator was selected in the dialog.
		if (!translator) return false;

		for(var id in _propertyMap) {
			document.getElementById(id).value = translator[_propertyMap[id]];
		}

		//Strip JSON metadata
		var lastUpdatedIndex = translator.code.indexOf('"lastUpdated"');
		var header = translator.code.substr(0, lastUpdatedIndex + 50);
		var m = /^\s*{[\S\s]*?}\s*?[\r\n]+/.exec(header);
		// Detect the minified framework and strip it
		var usesFW = (translator.code.substr(m[0].length).indexOf("/* FW LINE ") !== -1);
		if(usesFW) var fixedCode = translator.code
						.substr(m[0].length)
						.replace(/\/\* FW LINE [^\n]*\n/,'\n');
		else var fixedCode = translator.code.substr(m[0].length);
		// Convert whitespace to tabs
		_editors["code"].getSession().setValue(normalizeWhitespace(fixedCode));
		// Then go to line 1
		_editors["code"].gotoLine(1);
		
		document.getElementById('checkbox-framework').checked = usesFW;
		
		// Reset configOptions and displayOptions before loading
		document.getElementById('textbox-configOptions').value = '';
		document.getElementById('textbox-displayOptions').value = '';

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
		
		// get browser support
		var browserSupport = translator.browserSupport;
		if(!browserSupport) browserSupport = "g";
		const browsers = ["gecko", "chrome", "safari", "ie", "node"];
		for each(var browser in browsers) {
			document.getElementById('checkbox-'+browser).checked = browserSupport.indexOf(browser[0]) !== -1;
		}

		// Set up the tests pane too
		populateTests();
	}

	/*
	 * save translator to database
	 */
	function save() {
		//seems like duplicating some effort from _getTranslator
		var code = _editors["code"].getSession().getValue();

		var metadata = {
			translatorID: document.getElementById('textbox-translatorID').value,
			label: document.getElementById('textbox-label').value,
			creator: document.getElementById('textbox-creator').value,
			target: document.getElementById('textbox-target').value,
			minVersion: document.getElementById('textbox-minVersion').value,
			maxVersion: document.getElementById('textbox-maxVersion').value,
			priority: parseInt(document.getElementById('textbox-priority').value)
		};
		
		if (metadata.label === "Untitled") {
			_logOutput("Can't save an untitled translator.");
			return;
		}

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
		
		metadata.browserSupport = "";
		if(document.getElementById('checkbox-gecko').checked) {
			metadata.browserSupport += "g";
		}
		if(document.getElementById('checkbox-chrome').checked) {
			metadata.browserSupport += "c";
		}
		if(document.getElementById('checkbox-safari').checked) {
			metadata.browserSupport += "s";
		}
		if(document.getElementById('checkbox-ie').checked) {
			metadata.browserSupport += "i";
		}
		if(document.getElementById('checkbox-node').checked) {
			metadata.browserSupport += "n";
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

		_clearOutput();

		save();
		
		if (functionToRun == "detectWeb" || functionToRun == "doWeb") {
			_run(functionToRun, _getDocument(), _selectItems, _myItemDone, _translators, function(){});
		} else if (functionToRun == "detectImport" || functionToRun == "doImport") {
			_run(functionToRun, _getImport(), _selectItems, _myItemDone, _translatorsImport, function(){});
		}
	}

	/*
	 * run translator in given mode with given input
	 */
	function _run(functionToRun, input, selectItems, itemDone, detectHandler, done) {
		if (functionToRun == "detectWeb" || functionToRun == "doWeb") {
			var translate = new Zotero.Translate.Web();
			var utilities = new Zotero.Utilities.Translate(translate);
			// If this is a string, assume it's a URL
			if (typeof input == 'string') {
					try {
						var doc = utilities.retrieveDocument(input);
					} catch (e) {
						// Time's up!
						_logMessage("retrieveDocument timed out");
						return false;
					}
				translate.setDocument(doc);
			} else { 
				translate.setDocument(input);
			}
		} else if (functionToRun == "detectImport" || functionToRun == "doImport") {
			var translate = new Zotero.Translate.Import();
			translate.setString(input);
		}
		translate.setHandler("error", _error);
		translate.setHandler("debug", _debug);
		translate.setHandler("done", done);
		
		if (functionToRun == "detectWeb") {
			// get translator
			var translator = _getTranslator();
			// don't let target prevent translator from operating
			translator.target = null;
			// generate sandbox
			translate.setHandler("translators", detectHandler);
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
			translate.setHandler("select", selectItems);
			translate.clearHandlers("itemDone");
			translate.setHandler("itemDone", itemDone);
			// disable output to database
			translate.translate(false);
		} else if (functionToRun == "detectImport") {
			// get translator
			var translator = _getTranslator();
			// don't let target prevent translator from operating
			translator.target = null;
			// generate sandbox
			translate.setHandler("translators", detectHandler);
			// internal hack to call detect on this translator
			translate._potentialTranslators = [translator];
			translate._foundTranslators = [];
			translate._currentState = "detect";
			translate._detect();
		} else if (functionToRun == "doImport") {
			// get translator
			var translator = _getTranslator();
			// don't let the detectCode prevent the translator from operating
			translator.detectCode = null;
			translate.setTranslator(translator);
			translate.clearHandlers("itemDone");
			translate.setHandler("itemDone", itemDone);
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
			_logOutput("Regex parse error:\n"+JSON.stringify(e, null, "\t"));
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
		/* We no longer have meaningful line numbers, so no line jumping!
		if(error && error.lineNumber) {
			_logOutput("Trying to go to line:\n"+error.lineNumber);
			_editors["code"].gotoLine(error.lineNumber);
		}
		*/
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
		
		item = _sanitizeItem(item);

		_logOutput("Returned item:\n"+JSON.stringify(item, null, "\t"));
	}

	/*
	 * prints information from detectCode to window
	 */
	 function _translators(obj, translators) {
	 	if(translators && translators.length != 0) {
			_logOutput('detectWeb returned type "'+translators[0].itemType+'"');
	 	} else {
			_logOutput('detectWeb did not match');
		}
			
	 }

	/*
	 * prints information from detectCode to window, for import
	 */
	 function _translatorsImport(obj, translators) {
	 	if(translators && translators.length != 0 && translators[0].itemType) {
			_logOutput('detectImport matched');
	 	} else {
			_logOutput('detectImport did not match');
		}
	 }

	/*
	 * logs debug info (instead of console)
	 */
	function _logOutput(string) {
		var date = new Date();
		var output = document.getElementById('output');

		// use JSON.stringify on non-strings
		if(typeof string != "string") {
			string = JSON.stringify(string, null, "\t");
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
	 * gets import text for import translator
	 */
	function _getImport() {
		var text = _editors["import"].getSession().getValue();
		return text;
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
		// load options
		if(document.getElementById('textbox-configOptions').value != '') {
		    translator.configOptions = JSON.parse(document.getElementById('textbox-configOptions').value);
		} else {
		    translator.configOptions = {};
		}
		if(document.getElementById('textbox-displayOptions').value != '') {
		    translator.displayOptions = JSON.parse(document.getElementById('textbox-displayOptions').value);
		} else {
		    translator.displayOptions = {};
		}
		//RZ: prefix for translator.code is hack to force correct parsing in translate.js
		//after completion of Zotero.Translate.prototype._parseCode, the code will start with "var translatorInfo = 1;", and detectWeb will be detected
		var locFW = document.getElementById('checkbox-framework').checked ? _FW : '';
		translator.code = "1;" + locFW + _editors["code"].getSession().getValue();

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
		
		translator.browserSupport = "";
		if(document.getElementById('checkbox-gecko').checked) {
			translator.browserSupport += "g";
		}
		if(document.getElementById('checkbox-chrome').checked) {
			translator.browserSupport += "c";
		}
		if(document.getElementById('checkbox-safari').checked) {
			translator.browserSupport += "s";
		}
		if(document.getElementById('checkbox-ie').checked) {
			translator.browserSupport += "i";
		}
		if(document.getElementById('checkbox-node').checked) {
			translator.browserSupport += "n";
		}
		
		// make sure translator gets run in browser in Zotero >2.1
		if(Zotero.Translator.RUN_MODE_IN_BROWSER) {
			translator.runMode = Zotero.Translator.RUN_MODE_IN_BROWSER;
		}

		return translator;
	}

	/*
	 * loads the translator's tests from its code
	 */
	function _loadTests() {
		var code = _editors["code"].getSession().getValue();
		var testStart = code.indexOf("/** BEGIN TEST CASES **/");
		var testEnd   = code.indexOf("/** END TEST CASES **/"); 
		if (testStart !== -1 && testEnd !== -1) {
			test = code.substring(testStart + 24, testEnd);
			test = test.replace(/var testCases = /,'');
			// The JSON parser doesn't like final semicolons
			if (test.lastIndexOf(';') == (test.length-1))
				test = test.slice(0,-1);
			try {
				var testObject = JSON.parse(test);
				return testObject;
			} catch (e) {
				_logOutput("Exception parsing JSON");
				return false;
			}
		} else {
			return false;
		}
	}

	/*
	 * writes tests back into the translator
	 */
	function _writeTests(tests) {
		var code = _editors["code"].getSession().getValue();
		var testStart = code.indexOf("/** BEGIN TEST CASES **/");
		var testEnd   = code.indexOf("/** END TEST CASES **/"); 
		if (testStart !== -1 && testEnd !== -1) {
			code = code.substring(0,testStart) 
				+ "/** BEGIN TEST CASES **/\nvar testCases = "
				+ JSON.stringify(tests, null, "\t") // pretty-print
				+ "\n/** END TEST CASES **/"
				+ code.slice(testEnd + 22);
			_logOutput("Tests updated, replacing existing test section.");
		} else { // We don't have a well-formed test section, so we'll append
			code = code
				+ "\n\n/** BEGIN TEST CASES **/\nvar testCases = "
				+ JSON.stringify(tests, null, "\t") // pretty-print
				+ "\n/** END TEST CASES **/"
			_logOutput("New test section added to code.");
		}
		_editors["code"].getSession().setValue(code);
	}
	
	/* clear tests pane */
	function _clearTests() {
		var listbox = document.getElementById("testing-listbox");
		var count = listbox.itemCount;
		while(count-- > 0){
			listbox.removeItemAt(0);
		}
	}

	/* turns an item into a test-safe item */
	function _sanitizeItem(item) {
		// Clear attachment document objects
		if (item && item.attachments && item.attachments.length) {
			for (var i=0; i<item.attachments.length; i++) {
				if (item.attachments[i].document)
					item.attachments[i].document = "[object]";
			}
		}
		return item;
	}
	
	/*
	 * adds a new test from the current input/translator
	 * web or import only for now
	 */
	function newTestFromCurrent(type) {
		_clearOutput();
		var input, label;
		if (type == "web" && !document.getElementById('checkbox-web').checked) {
			_logOutput("Current translator isn't a web translator");
			return false;
		} else if (type == "import" && !document.getElementById('checkbox-import').checked) {
			_logOutput("Current translator isn't an import translator");
			return false;
		}

		if (type == "web") {
			input = _getDocument();
			label = Zotero.Proxies.proxyToProper(input.location.href);
		} else if (type == "import") {
			input = _getImport();
			label = input;
		} else {
			return false;
		}

		var listbox = document.getElementById("testing-listbox");
		var listitem = document.createElement("listitem");
		var listcell = document.createElement("listcell");
		listcell.setAttribute("label", label);
		listitem.appendChild(listcell);
		listcell = document.createElement("listcell");
		listcell.setAttribute("label", "Creating...");
		listitem.appendChild(listcell);
		listbox.appendChild(listitem);

		if (type == "web") {
			// Creates the test. The test isn't saved yet!
			var tester = new Zotero_TranslatorTester(_getTranslator(), type, _debug);
			tester.newTest(input, function (obj, newTest) { // "done" handler for do
				if(newTest) {
					listcell.setAttribute("label", "New unsaved test");
					listitem.setUserData("test-string", JSON.stringify(newTest), null);
				} else {
					listcell.setAttribute("label", "Creation failed");
				}
			});
		}

		if (type == "import") {
			var test = {"type" : "import", "input" : input, "items" : []};

			// Creates the test. The test isn't saved yet!
			// TranslatorTester doesn't handle these correctly, so we do it manually
			_run("doImport", input, null, function(obj, item) {
				if(item) {
					test.items.push(_sanitizeItem(item));
					listcell.setAttribute("label", "New unsaved test");
					listitem.setUserData("test-string", JSON.stringify(test), null);
				} 
			}, null, function(){});
		}
	}

	/*
	 * populate tests pane
	 */
	function populateTests() {
		_clearTests();
		var tests = _loadTests();
		// We've got tests, let's display them
		var listbox = document.getElementById("testing-listbox");
		for each (var test in tests) {
			var listitem = document.createElement("listitem");
			var listcell = document.createElement("listcell");
			if (test.type == "web")
				listcell.setAttribute("label", test.url);
			else if (test.type == "import")
				listcell.setAttribute("label", test.input);
			else continue; // unknown test type
			listitem.appendChild(listcell);
			listcell = document.createElement("listcell");
			listcell.setAttribute("label", "Not run");
			listitem.appendChild(listcell);
			// Put the serialized JSON in user data
			listitem.setUserData("test-string", JSON.stringify(test), null);
			listbox.appendChild(listitem);
		}
	}

	
	/*
	 * Save tests back to translator, and save the translator
	 */
	function saveTests() {
		var tests = [];
		var item;
		var i = 0;
		var listbox = document.getElementById("testing-listbox");
		var count = listbox.itemCount;
		while(i < count){
			item = listbox.getItemAtIndex(i);
			if(item.getElementsByTagName("listcell")[1].getAttribute("label") === "New unsaved test") {
				item.getElementsByTagName("listcell")[1].setAttribute("label", "New test");
			}
			var test = item.getUserData("test-string");
			if(test) tests.push(JSON.parse(test));
			i++;
		}
		_writeTests(tests);
		save();
	}

	/*
	 * Delete selected test(s), from UI
	 */
	function deleteSelectedTests() {
		var listbox = document.getElementById("testing-listbox");
		var count = listbox.selectedCount;
		while (count--) {
			var item = listbox.selectedItems[0];
			listbox.removeItemAt(listbox.getIndexOfItem(item));
		}
	}
	
	/*
	 * Run selected test(s)
	 */
	function runSelectedTests() {
		_clearOutput();
		var listbox = document.getElementById("testing-listbox");
		var items = listbox.selectedItems;
		if(!items || items.length == 0) return false; // No action if nothing selected
		var i;
		var webtests = [];
		var importtests = [];
		for (i in items) {
			items[i].getElementsByTagName("listcell")[1].setAttribute("label", "Running");
			var test = JSON.parse(items[i].getUserData("test-string"));
			test["ui-item"] = items[i];
			if (test.type == "web") webtests.push(test);
			if (test.type == "import") importtests.push(test);
		}
		
		if (webtests.length > 0) {
			var webtester = new Zotero_TranslatorTester(_getTranslator(), "web", _debug);
			webtester.setTests(webtests);
			webtester.runTests(function(obj, test, status, message) {
				test["ui-item"].getElementsByTagName("listcell")[1].setAttribute("label", message);
			});
		}
		
		if (importtests.length > 0 ) {
			var importtester = new Zotero_TranslatorTester(_getTranslator(), "import", _debug);
			importtester.setTests(importtests);
			importtester.runTests(function(obj, test, status, message) {
				test["ui-item"].getElementsByTagName("listcell")[1].setAttribute("label", message);
			});
		}
	}
	
	/*
	 * Run selected test(s)
	 */
	function updateSelectedTests() {
		_clearOutput();
		var listbox = document.getElementById("testing-listbox");
		var items = listbox.selectedItems.slice();
		if(!items || items.length == 0) return false; // No action if nothing selected
		var i;
		var tests = [];
		for (i in items) {
			items[i].getElementsByTagName("listcell")[1].setAttribute("label", "Updating");
			var test = JSON.parse(items[i].getUserData("test-string"));
			tests.push(test);
		}
		
		var updater = new TestUpdater(tests);
		updater.updateTests(function(newTests) {
			for(var i in newTests) {
				var message;
				if(newTests[i]) {
					message = "Test updated";
					Zotero.debug(newTests[i]);
					items[i].setUserData("test-string", JSON.stringify(newTests[i]), null);
				} else {
					message = "Update failed"
				}
				items[i].getElementsByTagName("listcell")[1].setAttribute("label", message);
			}
		});
	}
	
	var TestUpdater = function(tests) {
		this.testsToUpdate = tests.slice();
		this.newTests = [];
		this.tester = new Zotero_TranslatorTester(_getTranslator(), "web", _debug);
	}
	
	TestUpdater.prototype.updateTests = function(callback) {
		if(!this.testsToUpdate.length) {
			callback(this.newTests);
			return;
		}
		
		var test = this.testsToUpdate.shift();
		var me = this;
		var hiddenBrowser = Zotero.HTTP.processDocuments(test.url,
			function(doc) {
				me.tester.newTest(doc, function(obj, test) {
					Zotero.Browser.deleteHiddenBrowser(hiddenBrowser);
					me.newTests.push(test);
					me.updateTests(callback);
				});
			},
			null,
			function(e) {
				Zotero.logError(e);
				me.newTests.push(false);
				me.updateTests(callback);
			},
			true
		);
	}

	/*
	 * Normalize whitespace to the Zotero norm of tabs
	 */
	function normalizeWhitespace(text) {
		return text.replace(/^[ \t]+/gm, function(str) {
			return str.replace(/ {4}/g, "\t");
		});
	}

	/*
	 * Clear output pane
	 */
	function _clearOutput() {
		document.getElementById('output').value = '';
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
		// No need to run if Scaffold isn't open
		var menulist = _document.getElementById("menulist-testFrame");
		if (!_document || !menulist) return true;

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
