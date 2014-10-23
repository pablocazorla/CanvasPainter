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

			/* COLOR QUAD **************************************/
			var $colorQuadContainer = $('<div class="color-quad-container"/>').appendTo(this.$node),
				$colorQuad = $('<div class="color-quad"/>').appendTo($colorQuadContainer),
				$cnvSatVal = $('<canvas id="color-cnv-gradient-sat-val" width="140" height="140" />').appendTo($colorQuad),
				$cnvHue = $('<canvas id="color-cnv-gradient-hue" width="20" height="140" />').appendTo($colorQuad),
				$cursorSatVal = $('<span class="color-cursor"/>').appendTo($colorQuad),
				$cursorHue = $('<span class="color-cursor cursor-hue"/>').appendTo($colorQuad);

			// Hue Gradient
			var cH = $cnvHue[0].getContext('2d'),
				gr = cH.createLinearGradient(0, 0, 0, 140);
			gr.addColorStop(0, 'rgb(255,0,0)');
			gr.addColorStop(1 / 6, 'rgb(255,255,0)');
			gr.addColorStop(1 / 3, 'rgb(0,255,0)');
			gr.addColorStop(0.5, 'rgb(0,255,255)');
			gr.addColorStop(2 / 3, 'rgb(0,0,255)');
			gr.addColorStop(5 / 6, 'rgb(255,0,255)');
			gr.addColorStop(1, 'rgb(255,0,0)');
			cH.fillStyle = gr;
			cH.fillRect(0, 0, 20, 140);

			// Val Gradient
			var cSV = $cnvSatVal[0].getContext('2d'),
				valGr = cSV.createLinearGradient(0, 0, 0, 140);
			valGr.addColorStop(0, 'rgba(0,0,0,0)');
			valGr.addColorStop(1, 'rgba(0,0,0,1)');

			var drawSatVal = function() {
				var rgb = App.ForegroundColor.colorHue();

				// Sat Gradient
				var satGr = cSV.createLinearGradient(0, 0, 140, 0);
				satGr.addColorStop(0, 'rgb(255,255,255)');
				satGr.addColorStop(1, 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');

				cSV.fillStyle = satGr;
				cSV.fillRect(0, 0, 140, 140);

				cSV.fillStyle = valGr;
				cSV.fillRect(0, 0, 140, 140);
			};

			App.ForegroundColor._R.subscribe(drawSatVal);
			App.ForegroundColor._G.subscribe(drawSatVal);
			App.ForegroundColor._B.subscribe(drawSatVal);
			App.ForegroundColor._H.subscribe(function(v) {
				$cursorHue.css({
					'top': Math.round(v * 1.4) + 'px'
				});
			});
			App.ForegroundColor._S.subscribe(function(v) {
				$cursorSatVal.css({
					'left': Math.round(v * 1.4) + 'px'
				});
			});
			App.ForegroundColor._V.subscribe(function(v) {
				$cursorSatVal.css({
					'top': (140 - Math.round(v * 1.4)) + 'px'
				});
			});

			var dragHue = false,
				dragSatVal = false,
				hueY = 0,
				satValX = 0,
				satValY = 0,
				setHue = function(e) {
					var v = Math.round((e.pageY - hueY) / 1.4);
					v = (v < 0) ? 0 : ((v > 100) ? 100 : v);
					App.ForegroundColor._H(v);
				},
				setSatVal = function(e) {

					var sat = Math.round((e.pageX - satValX) / 1.4);
					sat = (sat < 0) ? 0 : ((sat > 100) ? 100 : sat);


					var val = 100 - Math.round((e.pageY - satValY) / 1.4);
					val = (val < 0) ? 0 : ((val > 100) ? 100 : val);
					App.ForegroundColor._S(sat);
					App.ForegroundColor._V(val);
				};

			$cnvHue.add($cursorHue).mousedown(function(e) {
				dragHue = true;
				hueY = $cnvHue.offset().top;
				setHue(e);
			});

			$cnvSatVal.add($cursorSatVal).mousedown(function(e) {
				dragSatVal = true;
				satValX = $cnvSatVal.offset().left;
				satValY = $cnvSatVal.offset().top;
				setSatVal(e);
			});

			$(window).mousemove(function(e) {
				if (dragHue) {
					setHue(e);
				}
				if (dragSatVal) {
					setSatVal(e);
				}
			}).mouseup(function() {
				if (dragHue) {
					dragHue = false;
				}
				if (dragSatVal) {
					dragSatVal = false;
				}
			});



			/* SLIDERS **************************************/
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
				label: 'Hue',
				observable: App.ForegroundColor._H
			}).appendTo(expandoHSV.$content);
			var sliderS = new SLIDER({
				label: 'Saturation',
				observable: App.ForegroundColor._S
			}).appendTo(expandoHSV.$content);
			var sliderV = new SLIDER({
				label: 'Value',
				observable: App.ForegroundColor._V
			}).appendTo(expandoHSV.$content);

			// RGB
			var sliderR = new SLIDER({
				label: 'Red',
				max: 255,
				observable: App.ForegroundColor._R
			}).appendTo(expandoRGB.$content);
			var sliderS = new SLIDER({
				label: 'Green',
				max: 255,
				observable: App.ForegroundColor._G
			}).appendTo(expandoRGB.$content);
			var sliderV = new SLIDER({
				label: 'Blue',
				max: 255,
				observable: App.ForegroundColor._B
			}).appendTo(expandoRGB.$content);

			App.ForegroundColor._HEX('#22299E');

			return this;
		}
	};

	return PANEL_COLOR;
};