// DOCUMENT
CanvasPainter.Classes.App.DOCUMENT = function() {

	// App classes
	var LAYER = CanvasPainter.Classes.App.LAYER(),

		idCounter = 0,

		DOCUMENT = function(options) {
			return this.init(options);
		};

	DOCUMENT.prototype = {
		init: function(options) {
			this.id = idCounter++;
			this.config = $.extend({
				title: 'Untitled-' + this.id,
				width: 800,
				height: 600
			}, options);

			this.LayerList = [];
			this.Layer = null;

			return this;
		}
	};

	return DOCUMENT;
};