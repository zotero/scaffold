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
		//document.getElementById('editor-detectCode').textbox.value = translator.detectCode;
		//Strip JSON metadata
		var lastUpdatedIndex = translator.code.indexOf('"lastUpdated"');
		var header = translator.code.substr(0, lastUpdatedIndex + 50);
		var m = /^\s*{[\S\s]*?}\s*?[\r\n]+/.exec(header);
		document.getElementById('editor-code').textbox.value = translator.code.substr(m[0].length);
		document.getElementById('checkbox-inRepository').checked = !!translator.inRepository;

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

		metadata.inRepository = document.getElementById('checkbox-inRepository').checked ? "1" : "0";

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
		}
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
		translator.code = "1;" + document.getElementById('editor-code').textbox.value;
		translator.inRepository = document.getElementById('checkbox-inRepository').checked ? "1" : "0";

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
