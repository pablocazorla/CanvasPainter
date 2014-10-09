// APP
CanvasPainter.Classes.App.APP = function() {

	// App classes
	var DOCUMENT = CanvasPainter.Classes.App.DOCUMENT(),

		// Utils
		U = CanvasPainter.Utils,

		// APP
		APP = function() {
			return this.init();
		};

	APP.prototype = {
		init: function() {
			this.DocumentList = [];
			this.Document = null;
			return this;
		},
		createDocument: function(options) {
			var newDocument = new DOCUMENT(options);
			this.DocumentList.push(newDocument);
			this.selectDocument(newDocument.id);
			return newDocument;
		},
		selectDocument: function(id) {
			var ducumentSelected = null;
			U.each(this.DocumentList, function(Document) {
				if (Document.id === id) {
					ducumentSelected = Document;
				}
			});
			this.Document = ducumentSelected;
			return this.Document;
		}
	};

	return APP;
};