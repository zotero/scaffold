function scrape(doc, url) {
	//TODO adjust url here
	var urlMarc = ZU.xpathText(doc, '//a[contains(@title, "Scarico Marc21 del record") or contains(@title, "Download Marc21 record")]/@href');
	//Z.debug(urlMarc);
	ZU.doGet(urlMarc, function(text) {
		//call MARC translator
		var translator = Zotero.loadTranslator("import");
		translator.setTranslator("a6ee60df-1ddc-4aae-bb25-45e0537be973");
		translator.setString(text);
		translator.translate();
	});
}
