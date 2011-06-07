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

	var _FW = '/* FW LINE 45:752c5f0defd3 */ function flatten(c){var b=new Array();for(var d in c){var e=c[d];if(e instanceof Array){b=b.concat(flatten(e))}else{b.push(e)}}return b}var FW={_scrapers:new Array()};FW._Base=function(){this.callHook=function(b,c,e,a){if(typeof this["hooks"]==="object"){var d=this["hooks"][b];if(typeof d==="function"){d(c,e,a)}}};this.evaluateThing=function(f,e,c){var b=typeof f;if(b==="string"){return f}else{if(b==="object"){if(f instanceof Array){var d=this.evaluateThing;var a=f.map(function(g){return d(g,e,c)});return flatten(a)}else{return f.evaluate(e,c)}}else{if(b==="function"){return f(e,c)}else{return undefined}}}}};FW.Scraper=function(a){FW._scrapers.push(new FW._Scraper(a))};FW._Scraper=function(a){for(x in a){this[x]=a[x]}this._singleFieldNames=["abstractNote","applicationNumber","archive","archiveLocation","artworkMedium","artworkSize","assignee","audioFileType","audioRecordingType","billNumber","blogTitle","bookTitle","callNumber","caseName","code","codeNumber","codePages","codeVolume","committee","company","conferenceName","country","court","date","dateDecided","dateEnacted","dictionaryTitle","distributor","docketNumber","documentNumber","DOI","edition","encyclopediaTitle","episodeNumber","extra","filingDate","firstPage","forumTitle","genre","history","institution","interviewMedium","ISBN","ISSN","issue","issueDate","issuingAuthority","journalAbbreviation","label","language","legalStatus","legislativeBody","letterType","libraryCatalog","manuscriptType","mapType","medium","meetingName","nameOfAct","network","number","numberOfVolumes","numPages","pages","patentNumber","place","postType","presentationType","priorityNumbers","proceedingsTitle","programTitle","programmingLanguage","publicLawNumber","publicationTitle","publisher","references","reportNumber","reportType","reporter","reporterVolume","rights","runningTime","scale","section","series","seriesNumber","seriesText","seriesTitle","session","shortTitle","studio","subject","system","thesisType","title","type","university","url","version","videoRecordingType","volume","websiteTitle","websiteType"];this._makeAttachments=function(q,b,f,s){if(f instanceof Array){f.forEach(function(k){this._makeAttachments(q,b,k,s)},this)}else{if(typeof f==="object"){var p=f.urls||f.url;var m=f.types||f.type;var e=f.titles||f.title;var h=this.evaluateThing(p,q,b);var o=this.evaluateThing(e,q,b);var r=this.evaluateThing(m,q,b);var l=(r instanceof Array);var n=(o instanceof Array);if(!(h instanceof Array)){h=[h]}for(var j in h){var c=h[j];var g;var d;if(l){g=r[j]}else{g=r}if(n){d=o[j]}else{d=o}s.attachments.push({url:c,title:d,type:g})}}}};this.makeItems=function(o,b,m,c,l){var q=new Zotero.Item(this.itemType);q.url=b;for(var h in this._singleFieldNames){var n=this._singleFieldNames[h];if(this[n]){var g=this.evaluateThing(this[n],o,b);if(g instanceof Array){q[n]=g[0]}else{q[n]=g}}}var r=["creators","tags"];for(var f in r){var p=r[f];var d=this.evaluateThing(this[p],o,b);if(d){for(var e in d){q[p].push(d[e])}}}this._makeAttachments(o,b,this["attachments"],q);c(q,this,o,b);l([q])}};FW._Scraper.prototype=new FW._Base;FW.MultiScraper=function(a){FW._scrapers.push(new FW._MultiScraper(a))};FW._MultiScraper=function(a){for(x in a){this[x]=a[x]}this._mkSelectItems=function(e,d){var b=new Object;for(var c in e){b[d[c]]=e[c]}return b};this._selectItems=function(e,d){var b=new Array();for(var c in Zotero.selectItems(this._mkSelectItems(e,d))){b.push(c)}return b};this._mkAttachments=function(g,d,f){var b=this.evaluateThing(this["attachments"],g,d);var c=new Object();if(b){for(var e in f){c[f[e]]=b[e]}}return c};this._makeChoices=function(f,p,c,d,h){if(f instanceof Array){f.forEach(function(k){this._makeTitlesUrls(k,p,c,d,h)},this)}else{if(typeof f==="object"){var m=f.urls||f.url;var e=f.titles||f.title;var n=this.evaluateThing(m,p,c);var j=this.evaluateThing(e,p,c);var l=(j instanceof Array);if(!(n instanceof Array)){n=[n]}for(var g in n){var b=n[g];var o;if(l){o=j[g]}else{o=j}h.push(b);d.push(o)}}}};this.makeItems=function(m,b,k,c,h){Zotero.debug("Entering MultiScraper.makeItems");if(this.beforeFilter){var n=this.beforeFilter(m,b);if(n!=b){this.makeItems(m,n,k,c,h);return}}var g=[];var l=[];this._makeChoices(this["choices"],m,b,g,l);var f=this._selectItems(g,l);var d=this._mkAttachments(m,b,l);if(!f){h([])}else{var j=[];var e=this.itemTrans;Zotero.Utilities.processDocuments(f,function(q){var p=q.documentURI;var o=e;if(o===undefined){o=FW.getScraper(q,p)}if(o===undefined){}else{o.makeItems(q,p,d[p],function(r){j.push(r);c(r,o,q,p)},function(){})}},function(){h(j)})}}};FW._MultiScraper.prototype=new FW._Base;FW.DelegateTranslator=function(a){return new FW._DelegateTranslator(a)};FW._DelegateTranslator=function(a){for(x in a){this[x]=a[x]}this._translator=Zotero.loadTranslator(this.translatorType);this._translator.setTranslator(this.translatorId);this.makeItems=function(g,d,b,f,c){Zotero.debug("Entering DelegateTranslator.makeItems");var e;Zotero.Utilities.HTTP.doGet(d,function(h){this._translator.setHandler("itemDone",function(k,j){e=j;if(b){j.attachments=b}});this._translator.setString(h);this._translator.translate();f(e)},function(){c([e])})}};FW.DelegateTranslator.prototype=new FW._Scraper;FW._StringMagic=function(){this._filters=new Array();this.addFilter=function(a){this._filters.push(a);return this};this.split=function(a){return this.addFilter(function(b){return b.split(a).filter(function(c){return(c!="")})})};this.replace=function(c,b,a){return this.addFilter(function(d){if(d.match(c)){return d.replace(c,b,a)}else{return d}})};this.prepend=function(a){return this.replace(/^/,a)};this.append=function(a){return this.replace(/$/,a)};this.remove=function(b,a){return this.replace(b,"",a)};this.trim=function(){return this.addFilter(function(a){return Zotero.Utilities.trim(a)})};this.trimInternal=function(){return this.addFilter(function(a){return Zotero.Utilities.trimInternal(a)})};this.match=function(a,b){if(!b){b=0}return this.addFilter(function(d){var c=d.match(a);if(c===undefined||c===null){return undefined}else{return c[b]}})};this.cleanAuthor=function(b,a){return this.addFilter(function(c){return Zotero.Utilities.cleanAuthor(c,b,a)})};this.key=function(a){return this.addFilter(function(b){return b[a]})};this.capitalizeTitle=function(){return this.addFilter(function(a){return Zotero.Utilities.capitalizeTitle(a)})};this.unescapeHTML=function(){return this.addFilter(function(a){return Zotero.Utilities.unescapeHTML(a)})};this.unescape=function(){return this.addFilter(function(a){return unescape(a)})};this._applyFilters=function(c,e){for(i in this._filters){c=flatten(c);c=c.filter(function(a){return((a!==undefined)&&(a!==null))});for(var d=0;d<c.length;d++){try{if((c[d]===undefined)||(c[d]===null)){continue}else{c[d]=this._filters[i](c[d],e)}}catch(b){c[d]=undefined;Zotero.debug("Caught exception "+b+"on filter: "+this._filters[i])}}c=c.filter(function(a){return((a!==undefined)&&(a!==null))})}return c}};FW.PageText=function(){return new FW._PageText()};FW._PageText=function(){this._filters=new Array();this.evaluate=function(c){var b=[c.documentElement.innerHTML];b=this._applyFilters(b,c);if(b.length==0){return false}else{return b}}};FW._PageText.prototype=new FW._StringMagic();FW.Url=function(){return new FW._Url()};FW._Url=function(){this._filters=new Array();this.evaluate=function(d,c){var b=[c];b=this._applyFilters(b,d);if(b.length==0){return false}else{return b}}};FW._Url.prototype=new FW._StringMagic();FW.Xpath=function(a){return new FW._Xpath(a)};FW._Xpath=function(a){this._xpath=a;this._filters=new Array();this.text=function(){var b=function(c){if(typeof c==="object"&&c.textContent){return c.textContent}else{return c}};this.addFilter(b);return this};this.sub=function(b){var c=function(f,e){var d=e.evaluate(b,f,null,XPathResult.ANY_TYPE,null);if(d){return d.iterateNext()}else{return undefined}};this.addFilter(c);return this};this.evaluate=function(e){var d=e.evaluate(this._xpath,e,null,XPathResult.ANY_TYPE,null);var c=new Array();var b;while(b=d.iterateNext()){c.push(b)}c=this._applyFilters(c,e);if(c.length==0){return false}else{return c}}};FW._Xpath.prototype=new FW._StringMagic();FW.detectWeb=function(e,b){for(var c in FW._scrapers){var d=FW._scrapers[c];var f=d.evaluateThing(d.itemType,e,b);if(!d.detect){return f}else{var a=d.evaluateThing(d.detect,e,b);if(a.length>0&&a[0]){return f}}}return undefined};FW.getScraper=function(b,a){var c=FW.detectWeb(b,a);return FW._scrapers.filter(function(d){return(d.evaluateThing(d.itemType,b,a)==c)&&(d.evaluateThing(d.detect,b,a))})[0]};FW.doWeb=function(c,a){Zotero.debug("Entering FW.doWeb");var b=FW.getScraper(c,a);b.makeItems(c,a,[],function(f,e,g,d){e.callHook("scraperDone",f,g,d);if(!f.title){f.title=""}f.complete()},function(){Zotero.done()});Zotero.wait();Zotero.debug("Leaving FW.doWeb")};';
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
		else var fixedCode = translator.code.substr(m[0].length);
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
		if (functionToRun == "detectWeb" || functionToRun == "doWeb") {
			var translate = new Zotero.Translate.Web();
			translate.setDocument(_getDocument());
		} else if (functionToRun == "detectImport" || functionToRun == "doImport") {
			var translate = new Zotero.Translate.Import();
			translate.setString(_getImport());
		}
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
		} else if (functionToRun == "detectImport") {
			// get translator
			var translator = _getTranslator();
			// don't let target prevent translator from operating
			translator.target = null;
			// generate sandbox
			translate.setHandler("translators", _translatorsImport);
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
	 * prints information from detectCode to window, for import
	 */
	 function _translatorsImport(obj, translators) {
	 	if(translators && translators.length != 0) {
			_logOutput('detect returned "'+translators[0]+'"');
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
	 * gets import text for import translator
	 */
	function _getImport() {
		var text = document.getElementById('editor-import').textbox.value;
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
