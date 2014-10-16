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
		setSubscritions: function() {
			var self = this;
			// Subscribe to App._Document
			this.App._Document.subscribe(function(Document) {
				if (Document !== null) {
					self.$docContainer.show();
					// Select
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
			// Subscribe to App._DocumentList
			this.App._DocumentList.subscribe(function(DocumentList, Document) {
				if (Document !== null) {
					var prevLenght = self.App._DocumentList.previousLength(),
						currentLenght = DocumentList.length;
					if (prevLenght < currentLenght) {
						// Add Document
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
						newDocument.$docContent.appendTo(self.$docContainer);
						setTimeout(function(){
							newDocument.resetPosition();
						},50);
						
						self.tabList.push($tab);
						self.documentList.push(newDocument);
					} else {
						// Remove Document
						var id = Document.id, $tab, $doc, index;
						U.each(self.tabList, function($t, i) {
							if ($t.attr('data-id') == id) {
								index = i;
								$tab = $t;
							}
						});
						$tab.remove();
						self.tabList.splice(index, 1);
						U.each(self.documentList, function($d, i) {
							if ($d.appDoc.id == id) {
								index = i;
								$doc = $d;
							}
						});
						$doc.$docContent.remove();
						self.documentList.splice(index, 1);
					}
				}
			});
			return this;
		}
	};
	return DOCUMENT_CONTAINER;
};