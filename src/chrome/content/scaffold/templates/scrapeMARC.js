function scrape(doc, url) {
	// TODO adjust the selector for the lines here
	var lines = doc.querySelectorAll('#cntPlcPortal_grdMrc tr');
	
	// call MARC translator
	var translator = Zotero.loadTranslator("import");
	translator.setTranslator("a6ee60df-1ddc-4aae-bb25-45e0537be973");
	translator.getTranslatorObject(function (marc) {
		var record = new marc.record();
		var newItem = new Zotero.Item();
		// ignore the table headings in lines[0]
		record.leader = text(lines[1], 'td', 4);
		var fieldTag, indicators, fieldContent;
		for (let j=2; j<lines.length; j++) {
			// multiple lines with same fieldTag do not repeat the tag
			// i.e. in these cases we will just take same value as before
			if (text(lines[j], 'td', 0).trim().length>0) {
				fieldTag = text(lines[j], 'td', 0);
			}
			indicators = text(lines[j], 'td', 1) + text(lines[j], 'td', 2);
			fieldContent = '';
			if (text(lines[j], 'td', 3).trim().length>0) {
				fieldContent = marc.subfieldDelimiter + text(lines[j], 'td', 3);
			}
			fieldContent += text(lines[j], 'td', 4);
			
			record.addField(fieldTag, indicators, fieldContent);
		}
		
		record.translate(newItem);
		
		// possibly clean newItem further here
		
		newItem.complete();
	});
}
