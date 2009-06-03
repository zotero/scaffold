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

var Scaffold_Load = new function() {
	this.onLoad = onLoad;
	this.accept = accept;
	
	function onLoad() {
		var listbox = document.getElementById("listbox");
		
		//var translators = Zotero.DB.query("SELECT translatorID, label, creator FROM translators ORDER BY translatorType <> 4, label");
		var translators = Zotero.TranslatorsScaffold.getAllForType("export");
		
		for each(var translator in translators) {
			var listitem = document.createElement("listitem");
			listitem.setAttribute("value", translator.translatorID);
			
			var listcell = document.createElement("listcell");
			listcell.setAttribute("label", translator.label);
			listitem.appendChild(listcell);
			var listcell = document.createElement("listcell");
			//listcell.setAttribute("label", translator.creator);
			listcell.setAttribute("label", translator.creator);//need to modify Zotero.Translator to read creator data from JSON block (translator.creator)
			listitem.appendChild(listcell);
			
			listbox.appendChild(listitem);
		}
	}
	
	function accept() {
		var translatorID = document.getElementById("listbox").selectedItem.getAttribute("value");
		var translator = Zotero.TranslatorsScaffold.get(translatorID);
		
		Zotero.debug(translatorID);
		window.arguments[0].dataOut = translator;
	}
}

// Enumeration of types of translators
const TRANSLATOR_TYPES = {"import":1, "export":2, "web":4, "search":8};

// Byte order marks for various character sets
const BOMs = {
	"UTF-8":"\xEF\xBB\xBF",
	"UTF-16BE":"\xFE\xFF",
	"UTF-16LE":"\xFF\xFE",
	"UTF-32BE":"\x00\x00\xFE\xFF",
	"UTF-32LE":"\xFF\xFE\x00\x00"
}

/**
 * Singleton to handle loading and caching of translators
 * @namespace
 */
Zotero.TranslatorsScaffold = new function() {
	var _cache, _translators;
	var _initialized = false;
	
	/**
	 * Initializes translator cache, loading all relevant translators into memory
	 */
	this.init = function() {
		_initialized = true;
		
		var start = (new Date()).getTime()
		
		_cache = {"import":[], "export":[], "web":[], "search":[]};
		_translators = {};
		
		var i = 0;
		var contents = Zotero.getTranslatorsDirectory().directoryEntries;
		while(contents.hasMoreElements()) {
			var file = contents.getNext().QueryInterface(Components.interfaces.nsIFile);
			if(!file.leafName || file.leafName[0] == ".") continue;
			
			var translator = new Zotero.TranslatorScaffold(file);
			
			if(translator.translatorID) {
				if(_translators[translator.translatorID]) {
					// same translator is already cached
					translator.logError('Translator with ID '+
						translator.translatorID+' already loaded from "'+
						_translators[translator.translatorID].file.leafName+'"');
				} else {
					// add to cache
					_translators[translator.translatorID] = translator;
					for(var type in TRANSLATOR_TYPES) {
						if(translator.translatorType & TRANSLATOR_TYPES[type]) {
							_cache[type].push(translator);
						}
					}
				}
			}
			i++;
		}
		
		// Sort by priority
		var collation = Zotero.getLocaleCollation();
		var cmp = function (a, b) {
			if (a.priority > b.priority) {
				return 1;
			}
			else if (a.priority < b.priority) {
				return -1;
			}
			return collation.compareString(1, a.label, b.label);
		}
		for (var type in _cache) {
			_cache[type].sort(cmp);
		}
		
		Zotero.debug("Cached "+i+" translators in "+((new Date()).getTime() - start)+" ms");
	}
	
	/**
	 * Gets the translator that corresponds to a given ID
	 */
	this.get = function(id) {
		if(!_initialized) this.init();
		return _translators[id] ? _translators[id] : false;
	}
	
	/**
	 * Gets all translators for a specific type of translation
	 */
	this.getAllForType = function(type) {
		if(!_initialized) this.init();
		return _cache[type].slice(0);
	}
	
	
	/**
	 * @param	{String}		label
	 * @return	{String}
	 */
	this.getFileNameFromLabel = function(label) {
		return Zotero.File.getValidFileName(label) + ".js";
	}
}

/**
 * @class Represents an individual translator
 * @constructor
 * @param {nsIFile} file File from which to generate a translator object
 * @property {String} translatorID Unique GUID of the translator
 * @property {Integer} translatorType Type of the translator (use bitwise & with TRANSLATOR_TYPES to read)
 * @property {String} label Human-readable name of the translator
 * @property {String} target Location that the translator processes
 * @property {Integer} priority Lower-priority translators will be selected first
 * @property {Boolean} inRepository Whether the translator may be found in the repository
 * @property {String} lastUpdated SQL-style date and time of translator's last update
 * @property {String} code The executable JavaScript for the translator
 */
Zotero.TranslatorScaffold = function(file) {
	// Maximum length for the info JSON in a translator
	const MAX_INFO_LENGTH = 4096;
	const infoRe = /{(?:(?:"(?:[^"\r\n]*(?:\\")?)*")*[^}"]*)*}/;
	
	this.file = file;
	
	var fStream = Components.classes["@mozilla.org/network/file-input-stream;1"].
		createInstance(Components.interfaces.nsIFileInputStream);
	var cStream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
		createInstance(Components.interfaces.nsIConverterInputStream);
	fStream.init(file, -1, -1, 0);
	cStream.init(fStream, "UTF-8", 4096,
		Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
	
	var str = {};
	var infoString = cStream.readString(MAX_INFO_LENGTH, str);
	var m = infoRe.exec(str.value);
	if(!m) {
		this.logError("Invalid or missing translator metadata JSON object");
	} else {
		try {
			var info = Zotero.JSON.unserialize(m[0]);
		} catch(e) {
			this.logError("Invalid or missing translator metadata JSON object");
		}
		if(info) {
			var haveMetadata = true;
			// make sure we have all the properties
			for each(var property in ["translatorID", "translatorType", "label", "target", "priority", "lastUpdated", "inRepository","creator","minVersion","maxVersion"]) {
				if(info[property] === undefined) {
					this.logError('Missing property "'+property+'" in translator metadata JSON object');
					haveMetadata = false;
					break;
				} else {
					this[property] = info[property];
				}
			}
			
			
			this["code"] = str.value.replace(infoRe,"");//RZ: trying to get code into code tab
			//To do: strip newlines before code
			
			if(haveMetadata) {
				if(this.translatorType & TRANSLATOR_TYPES["import"]) {
					// compile import regexp to match only file extension
					this.importRegexp = this.target ? new RegExp("\\."+this.target+"$", "i") : null;
				}
				if(this.translatorType & TRANSLATOR_TYPES["web"]) {
					// compile web regexp
					this.webRegexp = this.target ? new RegExp(this.target, "i") : null;
					
					if(!this.target) {
						// for translators used on every page, cache code in memory
						var strs = [str.value];
						var amountRead;
						while(amountRead = cStream.readString(4096, str)) strs.push(str.value);
						this._code = strs.join("");
					}
				}
			}
		}
	}
	
	fStream.close();
}