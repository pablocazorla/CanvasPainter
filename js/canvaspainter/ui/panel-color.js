// PANEL COLOR
CanvasPainter.Classes.UI.PANEL_COLOR = function() {

	var cl = CanvasPainter.Classes.UI,
		EXPANDO = cl.EXPANDO(),
		SLIDER = cl.SLIDER(),


		PANEL_COLOR = function(UI, App) {
			return this.init(UI, App);
		};

	PANEL_COLOR.prototype = {
		init: function(UI, App) {

			this.$node = $('<div class="content-color"/>').appendTo(UI.Panel.Color.$content);

			var expandoHSV = new EXPANDO({
					open: true,
					cssClass: 'expand-hsv',
					text: 'Hue/Saturation/Value'
				}),
				expandoRGB = new EXPANDO({
					open: true,
					cssClass: 'expand-rgb',
					text: 'Red/Green/Blue'
				});

			expandoHSV.$node.appendTo(this.$node);
			expandoRGB.$node.appendTo(this.$node);

			// HSV
			var sliderH = new SLIDER({
				label: 'Hue',
				observable : App.ForegroundColor._H
			}).appendTo(expandoHSV.$content);
			var sliderS = new SLIDER({
				label: 'Saturation'				,
				observable : App.ForegroundColor._S
			}).appendTo(expandoHSV.$content);
			var sliderV = new SLIDER({
				label: 'Value',
				observable : App.ForegroundColor._V
			}).appendTo(expandoHSV.$content);

			// RGB
			var sliderR = new SLIDER({
				label: 'Red',
				min:0,
				max:255,
				observable : App.ForegroundColor._R
			}).appendTo(expandoRGB.$content);
			var sliderS = new SLIDER({
				label: 'Green',
				min:0,
				max:255,
				observable : App.ForegroundColor._G
			}).appendTo(expandoRGB.$content);
			var sliderV = new SLIDER({
				label: 'Blue',
				min:0,
				max:255,
				observable : App.ForegroundColor._B
			}).appendTo(expandoRGB.$content);


			return this;
		}
	};

	return PANEL_COLOR;
};