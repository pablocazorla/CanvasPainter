//Init
(function() {

	var APPClass = CanvasPainter.Classes.App.APP(),
		App = new APPClass(),
		
		UIClass = CanvasPainter.Classes.UI.UI(),
		UI = new UIClass();

	$(document).ready(function() {
		UI.init(App);

		App.createDocument();

	});
})();