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
			this._Document = U.observable(null);
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
			this._Document(ducumentSelected);
			return this.Document;
		},
		removeDocument: function(id) {
			var self = this,
				changeDocument = false,
				indexToRemove = -1;
			U.each(this.DocumentList, function(Document, i) {
				if (Document.id === id) {
					indexToRemove = i;
				}
			});
			changeDocument = (this.DocumentList[indexToRemove].id === this._Document().id);
			this.DocumentList.splice(indexToRemove, 1);
			if (changeDocument) {
				var length = this.DocumentList.length;
				if (length > 0) {
					this._Document(this.DocumentList[length - 1]);
				}else{
					this._Document(null);
				}
			}

			return this;
		}
	};

	return APP;
};