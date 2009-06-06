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
		var translators = Zotero.Translators.getAllForType("web");//How does the SQL sorting work? First by translatorType, then by label?
		
		for each(var translator in translators) {
			var listitem = document.createElement("listitem");
			listitem.setAttribute("value", translator.translatorID);
			
			var listcell = document.createElement("listcell");
			listcell.setAttribute("label", translator.label);
			listitem.appendChild(listcell);
			var listcell = document.createElement("listcell");
			//listcell.setAttribute("label", translator.creator);
			listcell.setAttribute("label", "Doe");//need to modify Zotero.Translator to read "creator","minVersion" and "maxVersion" data from JSON block
			listitem.appendChild(listcell);
			
			listbox.appendChild(listitem);
		}
	}
	
	function accept() {
		var translatorID = document.getElementById("listbox").selectedItem.getAttribute("value");
		var translator = Zotero.Translators.get(translatorID);
		//Strip JSON metadata (put elsewhere, where code is read)
		//metadataRegex = /{(?:(?:"(?:[^"\r\n]*(?:\\")?)*")*[^}"]*)*}[\n]*/;
		//translator.code = translator.code.replace(metadataRegex,"");
		
		Zotero.debug(translatorID);
		window.arguments[0].dataOut = translator;
	}
}