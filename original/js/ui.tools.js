// TOOLS
var toolsCtrl = function(){
	return this.init();
}
toolsCtrl.prototype = {
	keydown : false,
	currentTool : 'brush',
	prevCurrentTool : null,
	init : function(){
		
		this.toolButtons = document.getElementsByClassName('btn-tool');
		this.toolCtrlItem = document.getElementById('tool-ctrl-item');
		
		
		var self = this;		
		for(var i = 0;i<this.toolButtons.length;i++){
			this.toolButtons[i].addEventListener('click', function(){
				self.setTool(this.id.substring(5));
			},false);
		}	
		document.addEventListener('keyup', function(e){self.setToolByKeyboardUp(e);},false);
		document.addEventListener('keydown', function(e){self.setToolByKeyboardDown(e);},false);
		
		
		
		this.slideZoom = new slider({
			parent : document.getElementById('slide-zoom-container'),
			id : 'slider-zoom',
			title : 'Zoom (%)',
			titleOver : 'Zoom of the image',
			min : app.minZoom*100,
			max : app.maxZoom*100,
			initVal : 100,
			startDisable : true,
			callback : function(){
				try{app.currentDoc.setZoom(self.slideZoom.getValue()/100);}catch(e){};				
			}
		});
		
		
		
		document.getElementById('tool-zoom-hundred').addEventListener('click', function(){
			if(app.length > 0){app.currentDoc.setZoom(1);}
		},false);
		document.getElementById('tool-zoom-scaled').addEventListener('click', function(){
			if(app.length > 0){ app.currentDoc.setZoom('scaled');}
		},false);
		document.getElementById('tool-zoom-minus').addEventListener('click', function(){
			if(app.length > 0){app.zoomDirection = -1; app.currentDoc.setZoom(); app.zoomDirection = 1;}
		},false);
		document.getElementById('tool-zoom-plus').addEventListener('click', function(){
			if(app.length > 0){ app.zoomDirection = 1; app.currentDoc.setZoom();}
		},false);
		
		
		
		
		return this;
	},
	setTool : function(toolName){
		for(var ie = 0;ie<this.toolButtons.length;ie++){
			this.toolButtons[ie].className = 'btn-icon big btn-tool';
		}
		document.getElementById('tool-'+toolName).className = 'btn-icon big btn-tool current';
		app.setCurrentTool(toolName);
		this.currentTool = toolName;
		return this;
	},
	setToolByKeyboardUp : function(e){
		try{
		var unicode = e.keyCode? e.keyCode : e.charCode,
			toolName = 'none';		
		switch(unicode){
			case 66: toolName = 'brush'; break;
			case 69: toolName = 'eraser'; break;
			case 73: toolName = 'picker'; break;
			case 72: toolName = 'hand'; break;
			case 83: toolName = 'select'; break;
			case 18: app.zoomDirection = 1; break; // ALT
			case 107: app.zoomDirection = 1; app.currentDoc.setZoom(); break;
			case 109: app.zoomDirection = -1; app.currentDoc.setZoom(); app.zoomDirection = 1; break;
			case 96: app.currentDoc.setZoom(1); break;
			default://
		}
		
		if(toolName != 'none'){this.setTool(toolName);}
		this.keydown = false;
		if(this.prevCurrentTool != null){this.setTool(this.prevCurrentTool);this.prevCurrentTool = null;}
		}catch(e){}
		//log(unicode);
	},
	setToolByKeyboardDown : function(e){
		try{
		var unicode = e.keyCode? e.keyCode : e.charCode;
		if(!this.keydown){
			this.keydown = true;
			if(e.altKey){
				
				this.prevCurrentTool = this.currentTool;
				this.setTool('picker');
						
				app.zoomDirection = -1;
			}
			switch(unicode){
				case 32:
					this.prevCurrentTool = this.currentTool;
					this.setTool('hand');
				break;
				default://
			}		
		}
		}catch(e){}
	},
	
}