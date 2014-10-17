// PANEL COLOR
CanvasPainter.Classes.UI.EXPANDO = function() {

	var EXPANDO = function(options) {
		return this.init(options);
	};

	EXPANDO.prototype = {
		init: function(options) {
			this.config = $.extend({
				cssClassBase: 'expando',
				cssClass: '',
				text: 'Expando',
				open: false,
				duration: 300
			}, options);

			this.$node = $('<div class="expando"/>');

			this.$expandoHeader = $('<div class="expando-header">' + this.config.text + '</div>').appendTo(this.$node);
			this.$content = $('<div class="expando-body"/>').hide().appendTo(this.$node);

			this.opened = this.config.open;
			this.moving = false;

			if (this.opened) {
				this.$node.addClass('open');
				this.$content.show();
			}

			return this.setEvents();
		},
		show: function() {
			var self = this;
			if (!this.moving && !this.opened) {
				this.moving = true;
				this.opened = true;
				this.$node.addClass('open');
				this.$content.slideDown(this.config.duration, function() {
					self.moving = false;
				});
			}
			return this;
		},
		hide: function() {
			var self = this;
			if (!this.moving && this.opened) {
				this.moving = true;
				this.opened = false;
				this.$node.removeClass('open');
				this.$content.slideUp(this.config.duration, function() {
					self.moving = false;
				});
			}
			return this;
		},
		setEvents: function() {
			var self = this;
			this.$expandoHeader.click(function() {
				if (self.opened) {
					self.hide();
				} else {
					self.show();
				}
			});
			return this;
		},
		addContent : function(content){
			if(typeof content === 'string'){
				this.$content.html(content);
			}else{
				this.$content.append(content);
			}
			return this;
		}
	};

	return EXPANDO;
};