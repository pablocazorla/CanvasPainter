// Canvas Painter
var CanvasPainter = {
	Classes: {
		App: {},
		UI: {}
	},
	Utils: {
		each: function(list, handler, min, max) {
			var min = min || 0,
				max = max || list.length;
			for (var i = min; i < max; i++) {
				handler(list[i], i);
			}
		},
		toNumber: function(num, defaultValue) {
			return isNaN(parseFloat(num)) ? (defaultValue || 0) : parseFloat(num);
		}
	}
};