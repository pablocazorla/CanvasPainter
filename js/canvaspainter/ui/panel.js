// Panel
CanvasPainter.Classes.UI.PANEL = function() {
	var idPanel = 0,
		fadeDuration = 120,
		panelList = [],
		setPanelZIndex = function() {
			var z = 1000;
			for (var i = 0; i < panelList.length; i++) {
				panelList[i].onTop = false;
				panelList[i].$panel.css({
					'z-index': z++
				});
			}
			panelList[panelList.length - 1].onTop = true;
		},
		PANEL = function(options, UI) {
			return this._init(options, UI);
		};

	PANEL.prototype = {
		_init: function(options, UI) {
			this.$container = UI.$container;
			this.$window = $(window);
			this.id = idPanel++;
			this.onTop = false;
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
				resizable: true,
				iconic: false,
				classCss: ''
			}, options);

			self.transforming = false;
			panelList.push(this);
			return this._render();
		},
		_render: function() {
			if (this.config.right !== 'auto') {
				this.config.left = this.$container.width() - this.config.width - this.config.right;
			}

			this.$panel = $('<div class="panel"/>').css({
				'left': this.config.left + 'px',
				'top': this.config.top + 'px'
			}).addClass(this.config.classCss).appendTo(this.$container);

			this.$panelIcon = $('<div class="panel-icon"/>').hide().appendTo(this.$panel);

			this.$panelBody = $('<div class="panel-body"/>').css({
				'width': this.config.width + 'px',
				'height': this.config.height + 'px'
			}).appendTo(this.$panel);

			if (!this.config.visible) {
				this.$panel.hide();
			}
			if (this.config.header) {
				this.$header = $('<div class="header"></div>').appendTo(this.$panelBody);
				this.$title = $('<div class="title">' + this.config.title + '</div>').appendTo(this.$header);
				this.$close = $('<div class="close" title="Close Panel"><span>+</span></div>').appendTo(this.$header).click($.proxy(this.hide, this));
				this.$iconic = $('<div class="iconic" title="Set to Icon">o</div>').appendTo(this.$header).click($.proxy(this.setIconic, this));
				this._setDragable(this)._setIconPosition();
			}
			this.$content = $('<div class="content"/>').appendTo(this.$panelBody);
			if (this.config.resizable) {
				this.$resizer = $('<div class="resizer" title="Resize Panel"/>').appendTo(this.$panelBody);
				this._setResizable(this);
			}

			if (this.config.iconic) {
				this._setIconPosition();
				this.$panelIcon.show();
				this.$panelBody.hide();
				this.iconic = true;
			}

			setPanelZIndex();
			return this._setZindexEvent(this)._setIconicEvents(this);
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
		toggle: function() {
			if (this.config.visible) {
				this.hide();
			} else {
				this.show();
			}
			return this;
		},
		setIconic: function() {
			if (this.iconic) {
				this.$panelIcon.hide();
				this.iconic = false;
			} else {
				this.$panelIcon.show();
				this.iconic = true;
			}
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
				minY = 26,
				maxX = 0,
				maxY = 0,
				classAdded = false;
			this.$title.mousedown(function(e) {
				dragging = true;
				self.transforming = true;
				maxX = self.$container.width() - self.$panelBody.width(),
				maxY = self.$container.height() - 10;
				var offset = self.$panel.offset();
				xDif = offset.left - e.pageX;
				yDif = offset.top - e.pageY;
			});
			this.$window.mousemove(function(e) {
				if (dragging) {
					if (!classAdded) {
						classAdded = true;
						self.$panel.addClass('dragging');
					}
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
					classAdded = false;
					self.transforming = false;
					self.$panel.removeClass('dragging');
					self._setIconPosition();
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
				offset = null,
				classAdded = false;
			this.$resizer.mousedown(function(e) {
				resizing = true;
				self.transforming = true;
				offset = self.$panel.offset();
				var offsetResizer = self.$resizer.offset();
				xDif = offsetResizer.left - e.pageX;
				yDif = offsetResizer.top - e.pageY;
			});
			this.$window.mousemove(function(e) {
				if (resizing) {
					if (!classAdded) {
						classAdded = true;
						self.$panel.addClass('resizing');
					}
					w = (e.pageX + xDif + 10) - offset.left;
					h = (e.pageY + yDif + 10) - offset.top;
					w = (w < self.config.minWidth) ? self.config.minWidth : w;
					w = (w > self.config.maxWidth) ? self.config.maxWidth : w;
					h = (h < self.config.minHeight) ? self.config.minHeight : h;
					h = (h > self.config.maxHeight) ? self.config.maxHeight : h;
					self.$panelBody.css({
						'width': w + 'px',
						'height': h + 'px'
					});
				}
			}).mouseup(function() {
				if (resizing) {
					resizing = false;
					classAdded = false;
					self.transforming = false;
					self.$panel.removeClass('resizing');
					self._setIconPosition();
				}
			});
			return this;
		},
		_setZindexEvent: function(self) {
			this.$panel.mousedown(function() {
				self._setZindex();
			});
			return this;
		},
		_setZindex: function() {
			if (!this.onTop) {
				var iToChange = 0
				for (var i = 0; i < panelList.length; i++) {
					if (panelList[i].id === this.id) {
						iToChange = i;
					}
				}
				panelList.splice(iToChange, 1);
				panelList.push(this);
				setPanelZIndex();
			}
			return this;
		},
		_setIconPosition: function() {
			var mid = this.$container.width() / 2 - this.$panel.offset().left;
			if (mid > 0) {
				this.$panelIcon.css('left', '0px');
			} else {
				this.$panelIcon.css('left', this.$panelBody.width() - 40 + 'px');
			}
			return this;
		},
		_setIconicEvents: function(self) {
			this.$panel.hover(function() {
				if (self.iconic && !self.transforming) {
					self._setZindex().$panelBody.fadeIn(.5 * fadeDuration);
				}
			}, function() {
				if (self.iconic && !self.transforming) {
					self.$panelBody.fadeOut(.5 * fadeDuration);
				}
			});
			return this;
		},
		setContent: function(str) {
			if (typeof str === 'string') {
				this.$content.html(str);
			} else {
				this.$content.append(str);
			}
			return this;
		}
	};

	return PANEL;
};