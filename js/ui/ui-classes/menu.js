// Menu

var renderMenu = function(obj, $parent) {
		for (var a in obj) {
			var $li = $('<li/>').appendTo($parent),
				$span = $('<span>' + obj[a].label + '</span>').appendTo($li);
			if(typeof obj[a].action !== 'undefined'){
				$span.click(obj[a].action);
			}
			if(typeof obj[a].submenu !== 'undefined'){
				var $ul = $('<ul/>').appendTo($li);
				renderMenu(obj[a].submenu,$ul);
			}
		}
	},



	MENU = function(structure, options) {
		return this.init(structure, options);
	};



MENU.prototype = {
	init: function(structure, options) {
		this.structure = structure;
		this.config = $.extend({
			classCss: ''
		}, options);
		return this.render();
	},
	render: function() {
		this.$menu = $('<div class="menu"/>').addClass(this.config.classCss).appendTo(UI.$container);
		var $ul = $('<ul/>').appendTo(this.$menu);
		renderMenu(this.structure, $ul);
		this.setEvents(this);
		return this;
	},
	setEvents : function(self){

		this.$menu.find('li').hover(function(){
			$(this).find('>ul').fadeIn(100);
		},function(){
			$(this).find('>ul').fadeOut(100);
		}).click(function(){
			$(this).find('>ul').fadeOut(100);
		});



		return this;
	}
}