// APP
CanvasPainter.Classes.App.APP = function() {

	// App classes
	var cl = CanvasPainter.Classes.App,
		DOCUMENT = cl.DOCUMENT(),
		COLOR = cl.COLOR(),

		// Utils
		U = CanvasPainter.Utils,

		// APP
		APP = function() {
			return this.init();
		};

	APP.prototype = {
		init: function() {
			this._DocumentList = U.observableArray();
			this._Document = U.observable(null);

			this.ForegroundColor = new COLOR();
			this.BackgroundColor = new COLOR();

			return this;
		},
		createDocument: function(options) {
			var newDocument = new DOCUMENT(options);
			this._DocumentList.push(newDocument);
			this.selectDocument(newDocument.id);
			return newDocument;
		},
		selectDocument: function(id) {
			var ducumentSelected = null;
			U.each(this._DocumentList(), function(Document) {
				if (Document.id === id) {
					ducumentSelected = Document;
				}
			});
			this._Document(ducumentSelected);
			return this.Document;
		},
		removeDocument: function(id) {
			var self = this,
				changeDocument = false,
				indexToRemove = -1;
			U.each(this._DocumentList(), function(Document, i) {
				if (Document.id === id) {
					indexToRemove = i;
				}
			});
			changeDocument = (this._DocumentList(indexToRemove).id === this._Document().id);
			this._DocumentList.splice(indexToRemove, 1);
			// If it needed to select another doc
			if (changeDocument) {
				var length = this._DocumentList().length;
				if (length > 0) {
					this._Document(this._DocumentList(length - 1));
				} else {
					this._Document(null);
				}
			}

			return this;
		}
	};

	return APP;
};