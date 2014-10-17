// PANEL COLOR
CanvasPainter.Classes.UI.PANEL_COLOR = function() {

	var cl = CanvasPainter.Classes.UI,
		EXPANDO = cl.EXPANDO(),
		SLIDER = cl.SLIDER(),


		PANEL_COLOR = function(UI, APP) {
			return this.init(UI, APP);
		};

	PANEL_COLOR.prototype = {
		init: function(UI, APP) {

			this.$node = $('<div class="content-color"/>').appendTo(UI.Panel.Color.$content);

			var expandoHSV = new EXPANDO({
					open: true,
					cssClass: 'expand-hsv',
					text: 'Hue/Saturation/Value'
				}),
				expandoRGB = new EXPANDO({
					//open: true,
					cssClass: 'expand-rgb',
					text: 'Red/Green/Blue'
				});

			expandoHSV.$node.appendTo(this.$node);
			expandoRGB.$node.appendTo(this.$node);

			// HSV
			var sliderH = new SLIDER({
				label: 'Hue'
			});

			expandoHSV.addContent(sliderH.$node);

			return this;
		}
	};

	return PANEL_COLOR;
};