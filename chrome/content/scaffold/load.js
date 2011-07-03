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

var Scaffold_Load = new function() {
	this.onLoad = onLoad;
	this.accept = accept;
	
	function onLoad() {
		var listbox = document.getElementById("listbox");
		
		// Get the web translators
		var translators = Zotero.Translators.getAllForType("web").sort(function(a, b) { return a.label.localeCompare(b.label) });
		for each(var translator in translators) {
			var listitem = document.createElement("listitem");
			// Since type-to-find is based on the value, we need to put the label there
			// But we still can't get type-to-find to work
			listitem.setAttribute("value", translator.label);
			// And the ID goes in DOM user data
			listitem.setUserData("zotero-id", translator.translatorID, null);
			
			var listcell = document.createElement("listcell");
			listcell.setAttribute("label", translator.label);
			listitem.appendChild(listcell);
			var listcell = document.createElement("listcell");
			listcell.setAttribute("label", translator.creator);
			listitem.appendChild(listcell);
			
			listbox.appendChild(listitem);
		}
		
		// Make a separator
		var listitem = document.createElement("listitem");
		listitem.setAttribute("disabled", true);
		listitem.setAttribute("label", "Import Translators");
		listbox.appendChild(listitem);

		// Get the import translators
		var translators = Zotero.Translators.getAllForType("import").sort(function(a, b) { return a.label.localeCompare(b.label) });
		for each(var translator in translators) {
			var listitem = document.createElement("listitem");
			// Since type-to-find is based on the value, we need to put the label there
			// But we still can't get type-to-find to work
			listitem.setAttribute("value", translator.label);
			// And the ID goes in DOM user data
			listitem.setUserData("zotero-id", translator.translatorID, null);
			
			var listcell = document.createElement("listcell");
			listcell.setAttribute("label", translator.label);
			listitem.appendChild(listcell);
			var listcell = document.createElement("listcell");
			listcell.setAttribute("label", translator.creator);
			listitem.appendChild(listcell);
			
			listbox.appendChild(listitem);
		}
	}
	
	function accept() {
		var translatorID = document.getElementById("listbox").selectedItem.getUserData("zotero-id");
		var translator = Zotero.Translators.get(translatorID);
		
		Zotero.debug(translatorID);
		window.arguments[0].dataOut = translator;
	}
}
