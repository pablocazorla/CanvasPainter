// DOCUMENT
CanvasPainter.Classes.App.DOCUMENT = function() {

	// App classes
	var LAYER = CanvasPainter.Classes.App.LAYER(),

		// Utils
		U = CanvasPainter.Utils,

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

			this._LayerList = U.observableArray();
			this._Layer = U.observable(null);

			this.$content = $('<div class="canvas-container" />').width(this.config.width).height(this.config.height);

			this.$canvas = $('<canvas/>').attr({
				'width':this.config.width+'px',
				'height':this.config.height+'px'
			}).appendTo(this.$content);









			return this;
		}
	};

	return DOCUMENT;
};