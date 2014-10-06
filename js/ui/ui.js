// UI

var UI = {
	'$window': $(window),
	'$container': $('#canvas-painter'),
	'Panel': {},
	'Modal': {},
	'Document': {},
	'DocumentContainer': {}
}

UI.Panel.Layers = new PANEL({
	title: 'Layer',
	top: 370,
	right: 20
});
UI.Panel.Color = new PANEL({
	title: 'Color',
	right: 20
});