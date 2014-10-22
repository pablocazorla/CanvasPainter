// COLOR
CanvasPainter.Classes.App.COLOR = function() {


	var rgbTohsv = function(red, green, blue) {
			var r = red / 255,
				g = green / 255,
				b = blue / 255;

			var max = Math.max(r, g, b),
				min = Math.min(r, g, b);
			var h, s, v = max;
			var d = max - min;
			s = max == 0 ? 0 : d / max;
			if (max == min) {
				h = 0; // achromatic
			} else {
				switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
				}
				h /= 6;
			}
			return [Math.round(h * 100), Math.round(s * 100), Math.round(v * 100)];
		},
		hsvTorgb = function(hue, sat, val) {
			var h = parseFloat(hue / 100),
				s = parseFloat(sat / 100),
				v = parseFloat(val / 100);
			var r, g, b;
			var i = Math.floor(h * 6);
			var f = h * 6 - i;
			var p = v * (1 - s);
			var q = v * (1 - f * s);
			var t = v * (1 - (1 - f) * s);
			switch (i % 6) {
				case 0:
					r = v, g = t, b = p;
					break;
				case 1:
					r = q, g = v, b = p;
					break;
				case 2:
					r = p, g = v, b = t;
					break;
				case 3:
					r = p, g = q, b = v;
					break;
				case 4:
					r = t, g = p, b = v;
					break;
				case 5:
					r = v, g = p, b = q;
					break;
			}
			return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		},
		hexTorgb = function(hex) {
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
		},
		rgbTohex = function(r, g, b) {
			var componentToHex = function(c) {
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			};
			return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		},
		hexTohsv = function(hex) {
			var rgb = hexTorgb(hex);
			return rgbTohsv(rgb[0], rgb[1], rgb[2]);
		},
		hsvTohex = function(h, s, v) {
			var rgb = hsvTorgb(h, s, v);
			return rgbTohex(rgb[0], rgb[1], rgb[2]);
		};

	var from = null;

	var update = function(self) {
		if (from === 'rgb') {
			// RGB
			var hsv = rgbTohsv(self._R(), self._G(), self._B());
			var hex = rgbTohex(self._R(), self._G(), self._B());
			self._H(hsv[0]);
			self._S(hsv[1]);
			self._V(hsv[2]);
			self._HEX(hex);

		} else if (from === 'hsv') {
			// HSV
			var rgb = hsvTorgb(self._H(), self._S(), self._V());
			var hex = hsvTohex(self._H(), self._S(), self._V());

			self._R(rgb[0]);
			self._G(rgb[1]);
			self._B(rgb[2]);
			self._HEX(hex);
		} else if (from === 'hex') {
			// HEX
			var rgb = hexTorgb(self._HEX());
			var hsv = hexTohsv(self._HEX());
			self._R(rgb[0]);
			self._G(rgb[1]);
			self._B(rgb[2]);
			self._H(hsv[0]);
			self._S(hsv[1]);
			self._V(hsv[2]);
		}
		from = null;
	}



	// Utils
	var U = CanvasPainter.Utils,

		COLOR = function(color) {
			return this.init(color);
		};

	COLOR.prototype = {
		init: function(color) {



			this._R = U.observable(0);
			this._G = U.observable(0);
			this._B = U.observable(0);

			this._H = U.observable(0);
			this._S = U.observable(0);
			this._V = U.observable(0);

			this._HEX = U.observable('#000000');


			var self = this;

			this._R.subscribe(function() {
				if (from === null) {
					from = 'rgb';
					update(self);
				}
			});
			this._G.subscribe(function() {
				if (from === null) {
					from = 'rgb';
					update(self);
				}
			});
			this._B.subscribe(function() {
				if (from === null) {
					from = 'rgb';
					update(self);
				}
			});

			this._H.subscribe(function() {
				if (from === null) {
					from = 'hsv';
					update(self);
				}
			});
			this._S.subscribe(function() {
				if (from === null) {
					from = 'hsv';
					update(self);
				}
			});
			this._V.subscribe(function() {
				if (from === null) {
					from = 'hsv';
					update(self);
				}
			});
			this._HEX.subscribe(function() {
				if (from === null) {
					from = 'hex';
					update(self);
				}
			});

			return this;
		},
		colorHue : function(){
			return hsvTorgb(this._H(),100,100);
		}
	};

	return COLOR;
};