// Modal
CanvasPainter.Classes.UI.DOCUMENT_CONTAINER = function() {

	var DOCUMENT = CanvasPainter.Classes.UI.DOCUMENT(),
		U = CanvasPainter.Utils;

	var DOCUMENT_CONTAINER = function(UI, App) {
		return this.init(UI, App);
	};

	DOCUMENT_CONTAINER.prototype = {
		init: function(UI, App) {

			this.App = App;
			this.UI = UI;

			this.tabList = [];
			this.documentList = [];

			this.$docContainer = $('<div class="document-container"/>').hide().appendTo(UI.$container);

			this.$tabs = $('<div class="tabs"/>').appendTo(this.$docContainer);

			return this.setSubscritions();

		},
		addDocument: function(appDoc) {
			this.selectDocument(appDoc.id);
			return this;
		},
		selectDocument: function(id) {
			this.App.selectDocument(id);
			return this;
		},
		setSubscritions: function() {
			var self = this;

			this.App._Document.subscribe(function(Document) {
				if (Document !== null) {
					self.$docContainer.show();

					var isCreated = false;
					U.each(self.documentList, function($d) {
						if ($d.appDoc.id == Document.id) {
							isCreated = true;
						}
					});
					// If not exist: Add
					if (!isCreated) {
						var newDocument = new DOCUMENT(Document),
							$tab = $('<div class="tab" data-id="' + Document.id + '" data-title="' + Document.config.title + '"/>').appendTo(self.$tabs),
							$tabTitle = $('<div class="tab-title">' + Document.config.title + '</div>').appendTo($tab),
							$tabClose = $('<div class="tab-close"><span>+</span></div>').appendTo($tab);

						$tabTitle.click(function() {
							var id = U.toNumber($(this).parent().attr('data-id'));
							self.App.selectDocument(id);
						});
						$tabClose.click(function() {
							var id = U.toNumber($(this).parent().attr('data-id')),
								title = $(this).parent().attr('data-title');

							$('#modal-close-doc-title').text(title);
							self.UI.Modal.open('close', {
								id: id
							});
						});

						newDocument.$docContent.appendTo(self.$docContainer.show());

						self.tabList.push($tab);
						self.documentList.push(newDocument);
					}
					// and Select
					U.each(self.tabList, function($t) {
						$t.removeClass('current');
						if ($t.attr('data-id') == Document.id) {
							$t.addClass('current');
						}
					});
					U.each(self.documentList, function($d) {
						$d.removeCurrent();
						if ($d.appDoc.id == Document.id) {
							$d.addCurrent();
						}
					});
				} else {
					// Not Document
					self.$docContainer.hide();
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

			return this;
		}
	};

	return DOCUMENT_CONTAINER;
};