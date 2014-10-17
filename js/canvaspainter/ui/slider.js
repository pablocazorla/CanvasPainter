// SLIDER
CanvasPainter.Classes.UI.SLIDER = function() {

	var SLIDER = function(options) {
		return this.init(options);
	};

	SLIDER.prototype = {
		init: function(options) {
			this.config = $.extend({
				label:'',
				min: 0,
				max: 100,
				value: 0,
				step: 20,
				observable:null
			}, options);

			this._val = (this.config.observable !== null) ? this.config.observable : CanvasPainter.Utils.observable(0);




			this.$node = $('<div class="slider"/>');

			if(this.config.label !== ''){
				this.$label = $('<label>'+this.config.label+'</label>').appendTo(this.$node);
			}

			this.$range = $('<input type="range" min="' + this.config.min + '" max="' + this.config.max + '" value="' + this._val() + '" step="' + this.config.step + '" />').appendTo(this.$node);


			return this;
		}
	};

	return SLIDER;
};