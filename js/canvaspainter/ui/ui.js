// UI
CanvasPainter.Classes.UI.UI = function() {

	var PANEL = CanvasPainter.Classes.UI.PANEL(),
		MODAL = CanvasPainter.Classes.UI.MODAL(),
		MENU = CanvasPainter.Classes.UI.MENU(),

		UI = function() {
			return this;
		};

	UI.prototype = {
		init: function() {
			var $container = $('#canvas-painter'),
				Panel = {},
				Modal = {},
				Menu = {},
				Document = {},
				DocumentContainer = {};


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

			Modal = new MODAL($container);

			var $contNew = $('<div>Hola Mundo</div>');

			var $btn = $('<p>Lay</p>').click(function() {
				Panel.Layers.toggle();
			}).appendTo($contNew);

			Modal.addContent({
				name: 'new',
				title: 'New File',
				width: 700,
				height: 400,
				content: $contNew
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