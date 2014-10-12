// Modal
CanvasPainter.Classes.UI.DOCUMENT = function() {
	var DOCUMENT = function(appDoc) {
		return this.init(appDoc);
	};

	DOCUMENT.prototype = {
		init: function(appDoc) {
			this.appDoc = appDoc;

			this.$docContent = $('<div class="doc-content"/>');//.append(this.appDoc.$content);



			return this;
		},
		addCurrent:function(){
			this.$docContent.addClass('current');
			return this;
		}
		,
		removeCurrent:function(){
			this.$docContent.removeClass('current');
			return this;
		}
	};

	return DOCUMENT;
};