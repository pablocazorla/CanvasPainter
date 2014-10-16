// Modal
CanvasPainter.Classes.UI.DOCUMENT = function() {
	var DOCUMENT = function(appDoc) {
		return this.init(appDoc);
	};

	DOCUMENT.prototype = {
		init: function(appDoc) {
			this.appDoc = appDoc;

			this.$canvasContainer = this.appDoc.$content;
			this.$docContent = $('<div class="doc-content"/>').append(this.$canvasContainer);
			return this;
		},
		addCurrent: function() {
			this.$docContent.addClass('current');
			return this;
		},
		removeCurrent: function() {
			this.$docContent.removeClass('current');
			return this;
		},
		resetPosition: function() {
			var wc = this.$docContent.width(),
				hc = this.$docContent.height(),
				w = this.$canvasContainer.width(),
				h = this.$canvasContainer.height();
			this.$canvasContainer.css({
				'top': 0.5*(hc-h) +'px',
				'left': 0.5*(wc-w) +'px'
			});

			return this;
		}
	};

	return DOCUMENT;
};