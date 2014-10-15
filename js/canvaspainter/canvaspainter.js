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
		},
		observable: function(val) {
			var currentValue = val || undefined,
				subscriptions = [],
				length = 0,
				obs = function(val) {
					if (typeof val === 'undefined') {
						return currentValue;
					} else {
						if (currentValue !== val) {
							currentValue = val;
							for (var i = 0; i < length; i++) {
								subscriptions[i](currentValue);
							}
						}
						return this;
					}
				};
			obs.subscribe = function(handler) {
				if (typeof handler === 'function') {
					subscriptions.push(handler);
					length++;
				}
			};

			return obs;
		}
	}
};