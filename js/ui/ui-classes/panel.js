// Panel

var idPanel = 0,
	fadeDuration = 200,
	panelList = [],
	setPanelZIndex = function() {
		var z = 1000;
		for (var i = 0; i < panelList.length; i++) {
			panelList[i].$panel.css({
				'z-index': z++
			});
		}
	}
PANEL = function(options) {
	return this._init(options);
};

PANEL.prototype = {
	_init: function(options) {
		this.id = idPanel++;
		this.config = $.extend({
			title: 'Untitled',
			header: true,
			visible: true,
			width: 260,
			minWidth: 260,
			maxWidth: 260,
			height: 300,
			minHeight: 200,
			maxHeight: 1000,
			left: 15,
			top: 60,
			right: 'auto',
			resizable: true
		}, options);
		panelList.push(this);
		return this._render();
	},
	_render: function() {
		if (this.config.right !== 'auto') {
			this.config.left = UI.$container.width() - this.config.width - this.config.right;
		}
		this.$panel = $('<div class="panel"/>').css({
			'width': this.config.width + 'px',
			'height': this.config.height + 'px',
			'left': this.config.left + 'px',
			'top': this.config.top + 'px'
		}).appendTo(UI.$container);

		if (!this.config.visible) {
			this.$panel.hide();
		}
		if (this.config.header) {
			this.$header = $('<div class="header"></div>').appendTo(this.$panel);
			this.$title = $('<div class="title">' + this.config.title + '</div>').appendTo(this.$header);
			this.$close = $('<div class="close" title="Close Panel"><span>+</span></div>').appendTo(this.$header).click($.proxy(this.hide, this));
			this._setDragable(this);
		}
		this.$content = $('<div class="content"/>').appendTo(this.$panel);
		if (this.config.resizable) {
			this.$resizer = $('<div class="resizer"/>').appendTo(this.$panel);
			this._setResizable(this);
		}
		setPanelZIndex();
		return this;
	},
	show: function() {
		this.$panel.fadeIn(fadeDuration);
		this.config.visible = true;
		return this;
	},
	hide: function() {
		this.$panel.fadeOut(fadeDuration);
		this.config.visible = false;
		return this;
	},
	position: function() {
		return {
			'x': this.$panel.css('left'),
			'y': this.$panel.css('top'),
			'width': this.$panel.width(),
			'height': this.$panel.height()
		};
	},
	_setDragable: function(self) {
		var dragging = false,
			xDif = 0,
			yDif = 0,
			x = 0,
			y = 0,
			minX = 0,
			minY = 0,
			maxX = 0,
			maxY = 0;
		this.$title.mousedown(function(e) {
			dragging = true;
			maxX = UI.$container.width() - self.$panel.width(),
			maxY = UI.$container.height() - 10;
			var offset = self.$panel.offset();
			xDif = offset.left - e.pageX;
			yDif = offset.top - e.pageY;
		});
		UI.$window.mousemove(function(e) {
			if (dragging) {
				x = e.pageX + xDif;
				y = e.pageY + yDif;
				x = (x < minX) ? minX : x;
				x = (x > maxX) ? maxX : x;
				y = (y < minY) ? minY : y;
				y = (y > maxY) ? maxY : y;
				self.$panel.css({
					'left': x + 'px',
					'top': y + 'px'
				});
			}
		}).mouseup(function() {
			if (dragging) {
				dragging = false;
			}
		});
		return this;
	},
	_setResizable: function(self) {
		var resizing = false,
			xDif = 0,
			yDif = 0,
			w = 0,
			h = 0,
			offset = null;
		this.$resizer.mousedown(function(e) {
			resizing = true;

			offset = self.$panel.offset();


			var offsetResizer = self.$resizer.offset();
			xDif = offsetResizer.left - e.pageX;
			yDif = offsetResizer.top - e.pageY;
		});
		UI.$window.mousemove(function(e) {
			if (resizing) {
				w = (e.pageX + xDif + 10) - offset.left;
				h = (e.pageY + yDif + 10) - offset.top;
				w = (w < self.config.minWidth) ? self.config.minWidth : w;
				w = (w > self.config.maxWidth) ? self.config.maxWidth : w;
				h = (h < self.config.minHeight) ? self.config.minHeight : h;
				h = (h > self.config.maxHeight) ? self.config.maxHeight : h;
				self.$panel.css({
					'width': w + 'px',
					'height': h + 'px'
				});
			}
		}).mouseup(function() {
			if (resizing) {
				resizing = false;
			}
		});
		return this;
	}
};