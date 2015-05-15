// UI Filters
var filtersCtrl = function(){
	return this.init();
};
filtersCtrl.prototype = {
	enabled : false,
	init : function(){
		this.setEvents();
		return this;
	},
	getById : function(idElement){
		if(typeof idElement == 'string'){
			return document.getElementById(idElement);
		}else{
			return idElement;
		}		
	},
	onClick : function(idElement,callback){
		this.getById(idElement).addEventListener('click', callback,false);
		return this;
	},
	setEvents : function(){		
		this.onClick('btn-filter-invert',function(){
			app.filters.invert();
		});
		return this;
	},
	toogleEnabled : function(flag){
		if(flag && !this.enabled){
			this.getById('menu-filters').className = '';
			this.enabled = true;
		}
		if(!flag && this.enabled){
			this.getById('menu-filters').className = 'disable';
			this.enabled = false;
		}
	}
};