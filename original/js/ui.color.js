// SLIDER
var colorCtrl = function(startColor){
	return this.init(startColor);
}
colorCtrl.prototype = {
	init : function(startColor){
		this.canvasSV = document.getElementById('color-cnv-gradient-sat-val');
		this.canvasH = document.getElementById('color-cnv-gradient-hue');
		this.sample = document.getElementById('color-ctrl-current-sample');
		this.info = document.getElementById('color-ctrl-current-info');
		
		this.cSV = this.canvasSV.getContext('2d');
		this.cH = this.canvasH.getContext('2d');
		
		this.cursorSV = document.getElementById('color-sat-val-cursor');
		this.cursorH = document.getElementById('color-hue-cursor');
		
		
		
		this.valGr = this.cSV.createLinearGradient(0, 0, 0, 140);
		this.valGr.addColorStop(0,'rgba(0,0,0,0)');
		this.valGr.addColorStop(1,'rgba(0,0,0,1)');	
		
		// Hue Gradient
		var gr = this.cH.createLinearGradient(0, 0, 0, 140);
		gr.addColorStop(0,'rgb(255,0,0)');
		gr.addColorStop(1/6,'rgb(255,255,0)');
		gr.addColorStop(1/3,'rgb(0,255,0)');
		gr.addColorStop(0.5,'rgb(0,255,255)');
		gr.addColorStop(2/3,'rgb(0,0,255)');
		gr.addColorStop(5/6,'rgb(255,0,255)');
		gr.addColorStop(1,'rgb(255,0,0)');			
		this.cH.fillStyle = gr;		
		this.cH.fillRect(0,0,20,140);
		// end Hue Gradient
		
		
		this.setSliders().setEvents();
		if(startColor){this.setColor(startColor)}else{this.setColor('#000000');};		
		
		return this;
	},
	setColor : function(col){		
		app.forecolor.color(col);
		this.update();
		return this;
	},
	update : function(){
		this
		.updateInfo()
		.drawSV()
		.updateCursors()
		.updateSliders();
		return this;
	},
	updateInfo : function(){		
		this.sample.style.backgroundColor = app.forecolor.hex();		
		var txt = 'hex: '+app.forecolor.hex()+'<br>rgb: '+app.forecolor.r()+', '+app.forecolor.g()+', '+app.forecolor.b()+'<br>hsv: '+Math.round(100*app.forecolor.h()) + '%, '+Math.round(100*app.forecolor.s())+'%, '+Math.round(100*app.forecolor.v())+'%';		
		this.info.innerHTML = txt;		
		return this;
	},
	drawSV : function(){
		var col = app.forecolor.hsvToRgb({'h':app.forecolor.h(),'s':1,'v':1})
		this.satGr = this.cSV.createLinearGradient(0, 0, 140, 0);
		this.satGr.addColorStop(0,'rgb(255,255,255)');
		this.satGr.addColorStop(1,'rgb('+col.r+','+col.g+','+col.b+')');		
		this.cSV.fillStyle = this.satGr;		
		this.cSV.fillRect(0,0,140,140);
		this.cSV.fillStyle = this.valGr;		
		this.cSV.fillRect(0,0,140,140);		
		return this;
	},
	updateCursors : function(){
		this.cursorH.style.top = Math.round(app.forecolor.h()*140) + 'px';
		this.cursorSV.style.top = (140-Math.round(app.forecolor.v()*140)) + 'px';
		this.cursorSV.style.left = Math.round(app.forecolor.s()*140) + 'px';
		return this;
	},
	setHueFromMouse : function(e){		
		var posY = e.pageY - this.canvasH.getBoundingClientRect().top;
		if(posY < 0) posY = 0;
		if(posY > 140) posY = 140;
		this.cursorH.style.top = posY + 'px';
		app.forecolor.h(posY/140);
		this.update();
	},
	setSVFromMouse : function(e){
		var posX = e.pageX - this.canvasSV.getBoundingClientRect().left,
			posY = e.pageY - this.canvasSV.getBoundingClientRect().top;
		if(posX < 0) posX = 0;
		if(posX > 140) posX = 140;
		if(posY < 0) posY = 0;
		if(posY > 140) posY = 140;
		this.cursorSV.style.left = posX + 'px';
		this.cursorSV.style.top = posY + 'px';
		app.forecolor.s(posX/140).v(1 - posY/140);
		this.update();
	},
	setEvents : function(){
		var self = this,
			draggingSV = false,
			draggingH = false,
			onMousedownH = function(e){
				draggingH = true;
				self.setHueFromMouse(e);
			},
			onMousedownSV = function(e){
				draggingSV = true;
				self.setSVFromMouse(e);
			},
			onMousemove = function(e){
				if(draggingH){
					self.setHueFromMouse(e);
				}
				if(draggingSV){
					self.setSVFromMouse(e);
				}
			},
			onMouseup = function(){
				if(draggingH){
					draggingH = false;
				}
				if(draggingSV){
					draggingSV = false;
				}
			};			
		this.canvasH.addEventListener('mousedown', function(e){onMousedownH(e);},false);
		this.cursorH.addEventListener('mousedown', function(e){onMousedownH(e);},false);
		this.canvasSV.addEventListener('mousedown', function(e){onMousedownSV(e);},false);
		this.cursorSV.addEventListener('mousedown', function(e){onMousedownSV(e);},false);
		document.body.addEventListener('mousemove', function(e){onMousemove(e);},false);
		document.body.addEventListener('mouseup', function(){onMouseup();},false);
		return this;
	},
	setSliders : function(){
		var self = this,
			slidersRgb = document.getElementById('color-sliders-rgb'),
			slidersHsv = document.getElementById('color-sliders-hsv'),
			tabRgb = document.getElementById('tab-palet-rgb'),
			tabHsv = document.getElementById('tab-palet-hsv'),
			contentRgb = document.getElementById('color-sliders-rgb'),
			contentHsv = document.getElementById('color-sliders-hsv'),
			visibleRgb = true;	
		
		this.sliderR = new slider({
			parent : slidersRgb,
			id : 'slider-r',
			title : 'Red',
			titleOver : 'Red component',
			initVal : 0,
			min : 0,
			max : 255,
			callback : function(){
				app.forecolor.r(self.sliderR.getValue());
				self.update();
			}
		});
		this.sliderG = new slider({
			parent : slidersRgb,
			id : 'slider-g',
			title : 'Green',
			titleOver : 'Green component',
			initVal : 0,
			min : 0,
			max : 255,
			callback : function(){
				app.forecolor.g(self.sliderG.getValue());
				self.update();
			}
		});
		this.sliderB = new slider({
			parent : slidersRgb,
			id : 'slider-b',
			title : 'Blue',
			titleOver : 'Blue component',
			initVal : 0,
			min : 0,
			max : 255,
			callback : function(){
				app.forecolor.b(self.sliderB.getValue());
				self.update();
			}
		});
		
		this.sliderH = new slider({
			parent : slidersHsv,
			id : 'slider-h',
			title : 'Hue',
			titleOver : 'Hue component',
			initVal : 0,
			callback : function(){
				app.forecolor.h(self.sliderH.getValue()/100);
				self.update();
			}
		});
		this.sliderS = new slider({
			parent : slidersHsv,
			id : 'slider-s',
			title : 'Saturation',
			titleOver : 'Saturation component',
			initVal : 0,
			callback : function(){
				app.forecolor.s(self.sliderS.getValue()/100);
				self.update();
			}
		});
		this.sliderV = new slider({
			parent : slidersHsv,
			id : 'slider-v',
			title : 'Value',
			titleOver : 'Value component',
			initVal : 0,
			callback : function(){
				app.forecolor.v(self.sliderV.getValue()/100);
				self.update();
			}
		});
		
		tabRgb.addEventListener('click', function(){
			if(!visibleRgb){
				visibleRgb = true;
				tabRgb.className = 'tab-palet current';
				tabHsv.className = 'tab-palet';
				contentRgb.style.display = 'block';
				contentHsv.style.display = 'none';
				self.updateSliders();
			}
		},false);
		tabHsv.addEventListener('click', function(){
			if(visibleRgb){
				visibleRgb = false;
				tabHsv.className = 'tab-palet current';
				tabRgb.className = 'tab-palet';
				contentHsv.style.display = 'block';
				contentRgb.style.display = 'none';
				self.updateSliders();
			}
		},false);		
		return this;
	},
	updateSliders : function(){
		this.sliderR.update(app.forecolor.r());		
		this.sliderG.update(app.forecolor.g());
		this.sliderB.update(app.forecolor.b());
		this.sliderH.update(app.forecolor.h()*100);		
		this.sliderS.update(app.forecolor.s()*100);
		this.sliderV.update(app.forecolor.v()*100);
		return this;
	}
}