// SLIDER
CanvasPainter.Classes.UI.SLIDER = function() {

	var SLIDER = function(options) {
		return this.init(options);
	};

	SLIDER.prototype = {
		init: function(options) {
			this.config = $.extend({
				label: '',
				cssClass: '',
				min: 0,
				max: 100,
				value: 0,
				observable: null,
				integer: true
			}, options);

			this._val = (this.config.observable !== null) ? this.config.observable : CanvasPainter.Utils.observable(this.config.value);
			this.$node = $('<div class="slider ' + this.config.cssClass + '"/>');
			if (this.config.label !== '') {
				this.$label = $('<label>' + this.config.label + ':</label>').appendTo(this.$node);
			}
			this.$output = $('<div class="slider-output"/>').appendTo(this.$node);
			this.$input = $('<input type="text" value=""/>').appendTo(this.$node);
			this.$range = $('<div class="range"/>').appendTo(this.$node).html('<div class="range-line"></div>');
			this.$rangeButton = $('<div class="range-button animated"/>').appendTo(this.$range);

			this.setSubscriptions(this).setEvents(this);



			return this;
		},
		setSubscriptions: function(self) {
			this.config.observable.subscribe(function(v) {
				self.update(v);
			});
			return this;
		},
		update: function(v) {
			var fact = (this.config.max - this.config.min) / this.$range.width(),
				x = Math.round((v - this.config.min) / fact);
			this.$rangeButton.css('left', x + 'px');

			this.$output.text(v);
		},
		appendTo: function($parent) {
			this.$node.appendTo($parent);
			this.update(this.config.observable());
			return this;
		},
		setEvents: function(self) {
			var dragging = false,
				rangeX,
				rangeWidth,
				fact,

				setValue = function(e) {
					var x = e.pageX - rangeX;
					x = (x < 0) ? 0 : x;
					x = (x > rangeWidth) ? rangeWidth : x;

					var val = x * fact + self.config.min;
					val = (self.config.integer) ? Math.round(val) : val;

					self.config.observable(val);
				};


			this.$range.mousedown(function(e) {
				dragging = true;
				self.$rangeButton.removeClass('animated');

				rangeX = self.$range.offset().left;
				rangeWidth = self.$range.width();
				fact = (self.config.max - self.config.min) / rangeWidth;
				setValue(e);
			});

			$(window).mousemove(function(e) {
				if (dragging) {
					setValue(e);
				}
			}).mouseup(function() {
				if (dragging) {
					dragging = false;
					self.$rangeButton.addClass('animated');
				}
			});
			var prevValue;

			this.$output.click(function() {
				prevValue = self.config.observable();
				self.$input.val(prevValue).show().focus();
			});
			this.$input.blur(function() {
				var newValue = CanvasPainter.Utils.toNumber(self.$input.val(), prevValue);
				newValue = (self.config.integer) ? Math.round(newValue) : newValue;

				newValue = (newValue < self.config.min) ? self.config.min : newValue;
				newValue = (newValue > self.config.max) ? self.config.max : newValue;

				self.config.observable(newValue);
				self.$input.hide();
			});

			return this;
		}

	};

	return SLIDER;
};