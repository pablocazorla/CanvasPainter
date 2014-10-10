// UI
CanvasPainter.Classes.UI.UI = function() {

	var cl = CanvasPainter.Classes.UI,
		U = CanvasPainter.Utils,
		PANEL = cl.PANEL(),
		MODAL = cl.MODAL(),
		MENU = cl.MENU(),
		BUTTON = cl.BUTTON(),

		// Default values
		defWidth = 800,
		defHeight = 600,

		UI = function() {
			return this;
		};

	UI.prototype = {
		init: function(App) {
			var $container = $('#canvas-painter'),
				Panel = {},
				Modal = {},
				Menu = {},
				Document = {},
				DocumentContainer = {};

			// Panels ****************************************************
			Panel.Layers = new PANEL({
				title: 'Layers',
				classCss: 'panel-layers',
				top: 370,
				right: 10
			}, $container);
			Panel.Color = new PANEL({
				title: 'Color',
				classCss: 'panel-color',
				right: 10
			}, $container);
			Panel.Brush = new PANEL({
				title: 'Brush',
				classCss: 'panel-brush',
				right: 280
			}, $container);

			// Modal ****************************************************
			var Modal = new MODAL($container);

			// Modal New
			Modal.addContent({
				name: 'new',
				title: 'New Document',
				width: 380,
				height: 300,
				content: (function() {
					var $contNew = $('<div class="enter-data">'),
						htmlContent = '<p class="clearfix"><label>Title:</label><input type="text" value="" placeholder="Untitled" class="new-title"/></p>',
						$pButtons = $('<p class="clearfix button-container"/>');
					htmlContent += '<p class="clearfix"><label>Width:</label><input type="number" value="' + defWidth + '" class="new-width"/><span>px</span></p>';
					htmlContent += '<p class="clearfix"><label>Height:</label><input type="number" value="' + defHeight + '" class="new-height"/><span>px</span></p>';

					$contNew.html(htmlContent).append($pButtons);

					var btnCancel = new BUTTON({
							cssClass: 'secondary',
							text: 'Cancel'
						}),
						btnOk = new BUTTON({
							text: 'Ok'
						});

					btnCancel.appendTo($pButtons);
					btnOk.appendTo($pButtons);

					btnOk.click(function() {
						var newDocument = App.createDocument({
							title: $contNew.find('.new-title').val(),
							width: U.toNumber($contNew.find('.new-width').val()),
							height: U.toNumber($contNew.find('.new-height').val())
						});
						Modal.close();
					});

					btnCancel.click(function() {
						Modal.close();
					});

					return $contNew;
				})()
			});

			Menu.Main = new MENU({
				'File': {
					'label': 'File',
					'submenu': {
						'New': {
							'label': 'New',
							'action': function() {
								Modal.open('new');
							}
						},
						'Open': {
							'label': 'Open',
							'action': function() {
								log('Open');
							},
							'disabled': true
						},
						'Save': {
							'label': 'Save',
							'action': function() {
								log('Save');
							}
						}
					}
				},
				'Edit': {
					'label': 'Edit',
					'submenu': {
						'Copy': {
							'label': 'Copy',
							'action': function() {
								log('Copy');
							}
						},
						'Paste': {
							'label': 'Paste',
							'action': function() {
								log('Paste');
							}
						},
						'Cut': {
							'label': 'Cut',
							'action': function() {
								log('Cut');
							}
						}
					}
				},
				'Panels': {
					'label': 'Panels',
					'submenu': {
						'Brush': {
							'label': 'Brush',
							'action': function() {
								Panel.Brush.toggle();
							}
						},
						'Color': {
							'label': 'Color',
							'action': function() {
								Panel.Color.toggle();
							}
						},
						'Layers': {
							'label': 'Layers',
							'action': function() {
								Panel.Layers.toggle();
							}
						},
						'all': {
							'label': 'Hide/Show all Panels',
							'action': function() {
								for (var a in Panel) {
									Panel[a].toggle();
								}
							}
						}
					}
				},
				'Help': {
					'label': 'Help',
					'submenu': {
						'Help': {
							'label': 'Help',
							'action': function() {
								log('Help');
							}
						},
						'About': {
							'label': 'About',
							'action': function() {
								log('About');
							}
						},
						'Contact': {
							'label': 'Contact',
							'action': function() {
								log('Contact');
							}
						}
					}
				}
			}, {
				classCss: 'main-menu'
			}, $container);


			return this;
		}
	};

	return UI;
};