// Modal
CanvasPainter.Classes.UI.DOCUMENT_CONTAINER = function() {

	var DOCUMENT = CanvasPainter.Classes.UI.DOCUMENT(),
		U = CanvasPainter.Utils;

	var DOCUMENT_CONTAINER = function(UI, App) {
		return this.init(UI, App);
	};

	DOCUMENT_CONTAINER.prototype = {
		init: function(UI, App) {

			this.DOCUMENT = null;
			this.App = App;
			this.UI = UI;

			this.tabList = [];
			this.documentList = [];

			this.$docContainer = $('<div class="document-container"/>').hide().appendTo(UI.$container);

			this.$tabs = $('<div class="tabs"/>').appendTo(this.$docContainer);

			return this;

		},
		addDocument: function(appDoc) {
			var self = this,
				newDocument = new DOCUMENT(appDoc),
				$tab = $('<div class="tab" data-id="' + appDoc.id + '" data-title="' + appDoc.config.title + '"/>').appendTo(this.$tabs),
				$tabTitle = $('<div class="tab-title">' + appDoc.config.title + '</div>').appendTo($tab),
				$tabClose = $('<div class="tab-close"><span>+</span></div>').appendTo($tab);

			$tabTitle.click(function() {
				var id = U.toNumber($(this).parent().attr('data-id'));
				self.selectDocument(id);
			});
			$tabClose.click(function() {
				var id = U.toNumber($(this).parent().attr('data-id')),
					title = $(this).parent().attr('data-title');

				$('#modal-close-doc-title').text(title);
				self.UI.Modal.open('close', {
					id: id
				});
			});

			newDocument.$docContent.appendTo(this.$docContainer.show());

			this.tabList.push($tab);
			this.documentList.push(newDocument);
			this.selectDocument(appDoc.id);

			return this;
		},
		selectDocument: function(id) {
			var id = id || -1,

				self = this;

			U.each(this.tabList, function($t) {
				$t.removeClass('current');
				if ($t.attr('data-id') == id) {
					$t.addClass('current');
				}
			});

			U.each(this.documentList, function($d) {
				$d.removeCurrent();
				if ($d.appDoc.id == id) {
					$d.addCurrent();
					self.DOCUMENT = $d;
					self.App.selectDocument(id);
				}
			});
			return this;
		},
		removeDocument: function(id) {
			var self = this,
				$tab, $doc, index;
			U.each(this.tabList, function($t, i) {
				if ($t.attr('data-id') == id) {
					index = i;
					$tab = $t;
				}
			});
			$tab.remove();
			this.tabList.splice(index, 1);
			U.each(this.documentList, function($d, i) {
				if ($d.appDoc.id == id) {
					index = i;
					$doc = $d;
				}
			});
			$doc.$docContent.remove();
			this.documentList.splice(index, 1);
			this.App.removeDocument(id);

			if (this.tabList.length == 0) {
				this.$docContainer.hide();
				this.DOCUMENT = null;
			} else {
				if (this.$tabs.find('.current').length == 0) {
					var lastID = U.toNumber(this.tabList[this.tabList.length - 1].attr('data-id'));
					this.selectDocument(lastID);
				}
			}

			return this;
		}
	};

	return DOCUMENT_CONTAINER;
};