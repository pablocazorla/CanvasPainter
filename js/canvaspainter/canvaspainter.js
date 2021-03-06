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
		idObservable :0,
		observable: function(val) {
			var currentValue = (typeof val ===  'undefined') ? undefined : val,
				subscriptions = [],
				length = 0,
				enabledSubscr = true,
				locked = false,
				obs = function(val) {
					if (typeof val === 'undefined') {
						return currentValue;
					} else {
						if (currentValue !== val && !locked) {
							currentValue = val;
							if (enabledSubscr) {
								for (var i = 0; i < length; i++) {
									subscriptions[i](currentValue);
								}
							}
						}
						return this;
					}
				};
			obs.id = CanvasPainter.Utils.idObservable++;
			obs.subscribe = function(handler) {
				if (typeof handler === 'function') {
					subscriptions.push(handler);
					length++;
				}
				return this;
			};
			obs.lock = function(flag) {
				var fl = flag || true;
				locked = fl;
				return this;
			};
			obs.enabledSubscriptions = function(flag) {
				var fl = flag || true;
				enabledSubscr = fl;
				return this;
			};


			return obs;
		},
		observableArray: function(val) {
			var currentList = val || [],
				previouslengthList = 0,
				subscriptions = [],
				length = 0,
				enabledSubscr = true,
				locked = false,
				runSubscriptions = function(elementChanged) {
					var ec = elementChanged || null;
					if (enabledSubscr) {
						for (var i = 0; i < length; i++) {
							subscriptions[i](currentList,ec);
						}
					}
				},
				obs = function(val) {
					if (typeof val === 'undefined') {
						return currentList;
					} else if (typeof val === 'number') {
						return currentList[val];
					} else {
						if (currentList !== val && !locked) {
							previouslengthList = currentList.length;
							currentList = val;
							runSubscriptions();
						}
						return this;
					}
				};

			obs.subscribe = function(handler) {
				if (typeof handler === 'function') {
					subscriptions.push(handler);
					length++;
				}
				return this;
			};
			obs.lock = function(flag) {
				var fl = flag || true;
				locked = fl;
				return this;
			};
			obs.enabledSubscriptions = function(flag) {
				var fl = flag || true;
				enabledSubscr = fl;
				return this;
			};
			obs.push = function(val) {
				previouslengthList = currentList.length;
				currentList.push(val);
				runSubscriptions(val);
				return this;
			};
			obs.splice = function(index, num) {
				previouslengthList = currentList.length;
				var elementChanged = currentList[index];
				currentList.splice(index, num);
				runSubscriptions(elementChanged);
				return this;
			};
			obs.previousLength = function() {
				return previouslengthList;
			};

			return obs;
		}
	}
};