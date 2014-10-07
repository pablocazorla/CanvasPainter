// Modal
var fadeDuration = 200,

	MODAL = function(options) {
		return this._init(options);
	};

MODAL.prototype = {
	_init: function(options) {
		this.config = $.extend({

		}, options);
		this.opened = false;

		return this._render();
	},
	_render: function() {

		this.$modal = $('<div class="modal"/>').hide().appendTo(UI.$container);
		this.$dimmer = $('<div class="dimmer"/>').hide().appendTo(UI.$container);

		this.$header = $('<div class="header"/>').appendTo(this.$modal);
		this.$title = $('<div class="title">Untitled</div>').appendTo(this.$header);

		this.$close = $('<div class="close" title="Close Modal"><span>+</span></div>').appendTo(this.$header).click($.proxy(this.close, this));



		this.$container = $('<div class="content"/>').appendTo(this.$modal);



		return this._resizing().setEvents(this);
	},
	open: function(name) {

		this.$container.find('.content-modal').hide();
		var $content = this.$container.find('.' + name + '-modal').show(),
			w = parseInt($content.attr('data-width')),
			h = parseInt($content.attr('data-height')),
			tit = $content.attr('data-title');

		this.$modal.width(w);
		this.$modal.height(h);
		this.$title.text(tit);
		this._resizing();

		this.$dimmer.fadeIn(.5 * fadeDuration);
		this.$modal.fadeIn(fadeDuration);
		return this;
	},
	close: function() {
		this.$modal.fadeOut(.5 * fadeDuration);
		this.$dimmer.fadeOut(fadeDuration);
		return this;
	},
	addContent: function(options) {

		var cfg = $.extend({
			name: 'no-name',
			title: 'Untitled',
			width: 800,
			height: 500,
			content: ''
		}, options);

		var $newContent = $('<div class="content-modal ' + cfg.name + '-modal" data-title="' + cfg.title + '" data-width="' + cfg.width + '" data-height="' + cfg.height + '"/>').appendTo(this.$container);

		$newContent.append(cfg.content);

		return this;
	},
	_resizing: function() {
		var mw = this.$modal.width(),
			mh = this.$modal.height(),
			cw = UI.$container.width(),
			ch = UI.$container.height();

		if (mw > (cw - 20)) {
			mw = cw - 20;
			this.$modal.width(mw);
		}
		if (mh > (ch - 20)) {
			mh = ch - 20;
			this.$modal.height(mh);
		}

		var top = .5 * (ch - mh),
			left = .5 * (cw - mw);

		this.$modal.css({
			'top': top + 'px',
			'left': left + 'px'
		});
		return this;
	},
	setEvents: function(self) {

		UI.$window.resize(function() {
			self._resizing();
		});



		return this;
	}
};