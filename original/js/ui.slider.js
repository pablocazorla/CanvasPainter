// SLIDER
var slider = function(opt){
	return this.init(opt);
}
slider.prototype = {
	init : function(opt){
		this.setting = extend({
			parent : null,
			id : null,
			initVal : 0,
			min : 0,
			max : 100,
			round : true,
			title : '',
			titleOver : null,
			startDisable : false,
			callback : function(){}
		},opt);
		
		this.val = this.setting.initVal;
		this.segment = this.setting.max - this.setting.min;
		
		this.classSlider = 'slider';
		this.enabled = true;
		
		this.render();
		return this;
	},
	render : function(){
		
		
		this.slider = document.createElement('div');
		this.output = document.createElement('span');
		this.input = document.createElement('input');
		this.btn = document.createElement('span');
		this.line = document.createElement('span');
		if(this.setting.id != null)this.slider.id = this.setting.id;		
		this.output.className = 'slider-out';		
		this.btn.className = 'slider-btn';
		this.line.className = 'slider-line';
		
		this.input.type = 'text';
		
		this.setting.parent.appendChild(this.slider);
		this.slider.appendChild(this.output);
		this.slider.appendChild(this.input);
		this.slider.appendChild(this.line);
		this.line.appendChild(this.btn);
		if(this.setting.title != ''){
			this.title = document.createElement('div');
			this.title.className = 'slider-title';
			this.title.innerHTML = this.setting.title;
			this.slider.appendChild(this.title);
			this.classSlider += ' with-title';
		}
		this.slider.className = this.classSlider;
		if(this.setting.titleOver!=null){this.slider.title = this.setting.titleOver}
		if(this.setting.startDisable) this.toggleEnabled(false);		
		this.update().setEvents();
	},
	toggleEnabled : function(flag){
		if(flag && !this.enabled){
			this.slider.className = this.classSlider;
			this.enabled = true;
		}
		if(!flag && this.enabled){
			this.slider.className = this.classSlider+' disable';
			this.enabled = false;
		}
		return this;
	},
	update : function(newVal){
		if(typeof newVal != 'undefined') this.val = newVal;		
		this.updateOutput().updateBtn();
		return this;
	},
	updateOutput : function(){
		var valR = this.val;
		
		if(this.setting.round){valR = Math.round(this.val);}		
		this.output.innerHTML = valR;
		return this;
	},
	updateBtn : function(){
		this.left = 100*(this.val - this.setting.min)/this.segment;
		this.widthPX = this.line.offsetWidth;
		this.btn.style.left = this.left + '%';
		return this;
	},
	getValue : function(){
		var valR = this.val;
		if(this.setting.round){valR = Math.round(this.val);}
		
		return valR;
	},
	setEvents : function(){
		var dragging = false,initX,posPX,self = this,
			onMouseDown = function(e){
				if(self.enabled){
					initX = e.pageX;
					posPX = Math.round((self.widthPX*self.left)/100);
					document.getElementById('canvasShopBack').className = 'slide-dragging';
					dragging = true;
					self.btn.className = 'slider-btn sliding';
				}
			},
			onMouseMove = function(e){
				if(dragging){
					self.left = 100*(posPX + (e.pageX - initX))/self.widthPX;					
					if(self.left < 0){self.left = 0;} if(self.left > 100){self.left = 100;}					
					self.btn.style.left = self.left + '%';
					
					self.val = (self.left * self.segment)/100 + self.setting.min;
					
					self.updateOutput();
					self.setting.callback();
				}
			},
			onMouseUp = function(){
				if(dragging){		
					dragging = false;
					self.btn.className = 'slider-btn';
					document.getElementById('canvasShopBack').className = '';
				}
			};
		this.btn.addEventListener('mousedown', function(e){onMouseDown(e);},false);
		this.line.addEventListener('mousedown', function(e){onMouseDown(e);},false);	
		document.body.addEventListener('mousemove', function(e){onMouseMove(e);},false);
		document.body.addEventListener('mouseup', function(){onMouseUp();},false);
		
		this.output.addEventListener('click', function(){
			self.input.style.display = 'block';
			self.input.value = self.getValue();
			self.input.focus();
		},false);
		this.input.addEventListener('blur', function(){
			var val = self.input.value;
			if(!isNaN(val)){
				if(val < self.setting.min) val = self.setting.min;
				if(val > self.setting.max) val = self.setting.max;
				self.update(val);
				self.setting.callback();
			}
			self.input.style.display = 'none';
		},false);
		
	}

}