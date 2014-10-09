// Panel
CanvasPainter.Classes.UI.BUTTON = function() {

	var BUTTON = function(options) {
		return this.init(options);
	};

	BUTTON.prototype = {
		init: function(options) {
			this.config = $.extend({
				cssClassBase: 'button',
				cssClass: '',
				text: 'Button'
			}, options);

			this.$element = $('<span class="' + this.config.cssClassBase + ' ' +this.config.cssClass + '">' + this.config.text + '</span>');
			return this;
		},
		click: function(handler) {
			this.$element.click(handler);
			return this;
		},
		text: function(str) {
			this.$element.text(str);
			return this;
		},
		addClass: function(str) {
			this.$element.addClass(str);
			return this;
		},
		removeClass: function(str) {
			this.$element.removeClass(str);
			return this;
		},
		appendTo:function($context){
			this.$element.appendTo($context);
			return this;
		}
	};

	return BUTTON;
};