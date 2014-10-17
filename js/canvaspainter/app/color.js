// COLOR
CanvasPainter.Classes.App.COLOR = function() {
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



			return this;
		}
	};

	return COLOR;
};