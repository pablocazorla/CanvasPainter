// Palet
var palet = function(opt){
	return this.init(opt);
}
palet.prototype = {
	init : function(opt){
		this.setting = extend({
			id : '',
			onToogle : function(){}
		},opt);

		this.open = false;
		this.iconic = false;		

		this.canvasShopBack = document.getElementById('canvasShopBack');
		this.pal = document.getElementById(this.setting.id);
		this.palContent = this.pal.getElementsByClassName('palet-content')[0];
		this.palClose = this.pal.getElementsByClassName('palet-close')[0];
		this.palSetIcon = this.pal.getElementsByClassName('palet-setIcon')[0];
		this.palStyleSave = this.pal.getElementsByClassName('palet-setting')[0];
		this.palTitle = this.pal.getElementsByClassName('palet-title')[0];
		this.palIcon = this.pal.getElementsByClassName('palet-icon')[0];
		this.palResize = null;

		var palRes = this.pal.getElementsByClassName('palet-resize');
		if(palRes.length>0) this.palResize = palRes[0];

		this.startedPosition().setIconic().palClosing().palDragging().palResizing().setIconPosition();
		
	},
	startedPosition : function(){
		var style = this.palStyleSave.value.split(',');
		
		this.pal.style.top = style[1];
		this.pal.style.left = style[2];
		this.pal.style.right = style[3];
		this.palContent.style.height = style[4];
		if(style[0]!='none'){
			this.toogle(true);
		}else{
			this.toogle(false);
		}

		if(style[5]=='true') this.toogleIconic(true);

		return this;
	},
	palClosing : function(){
		var self = this;
		this.palClose.addEventListener('click', function(){
			self.toogle(false);			
		},false);
		return this;
	},
	setIconic : function(){
		var self = this;
		this.palSetIcon.addEventListener('click', function(){
			self.toogleIconic();			
		},false);
		return this;
	},
	setDefaultZindex : function(){
		var paletCollection = document.getElementsByClassName('palet');
		for(var i = 0; i < paletCollection.length; i++){
			paletCollection[i].style.zIndex = '9001';		
		}
		this.pal.style.zIndex = '9501';
	},
	palDragging : function(){
		var self = this,dx,dy,
			dragging = false,			
			
			onMouseDown = function(e){
				dragging = true;
				dx = e.pageX - self.pal.offsetLeft;
				dy = e.pageY - self.pal.offsetTop;
				self.pal.style.left = self.pal.offsetLeft + 'px';
				self.pal.style.right = 'auto';
				self.setDefaultZindex();				
			},
			onMouseMove = function(e){
				if(dragging){
					self.pal.style.left = e.pageX - dx + 'px';
					var top = e.pageY - dy;
					if(top <50) top = 50;					
					self.pal.style.top = top + 'px';
				}
			},
			onMouseUp = function(){
				if(dragging){
					self.savePalStyle().setIconPosition();
					dragging = false;
				}
			};
			this.palTitle.addEventListener('mousedown', function(e){onMouseDown(e);},false);
			document.body.addEventListener('mousemove', function(e){onMouseMove(e);},false);
			document.body.addEventListener('mouseup', function(){onMouseUp();},false);
		return this;
	},
	palResizing : function(){
		if(this.palResize != null){
			var self = this,
				resizing = false,
				dy,startMouseY,				
				onMouseDown = function(e,res){			
					startMouseY = e.pageY;
					dy = self.palResize.offsetTop;					
					self.canvasShopBack.className = 'palet-resizing';
					resizing = true;
					self.setDefaultZindex();
				},
				onMouseMove = function(e){
					if(resizing){
						self.palContent.style.height = (e.pageY - startMouseY) + dy + 'px';
					}
				},
				onMouseUp = function(){
					if(resizing){
						self.savePalStyle();					
						self.canvasShopBack.className = '';
						resizing = false;
					}
				};
			this.palResize.addEventListener('mousedown', function(e){onMouseDown(e);},false);			
			document.body.addEventListener('mousemove', function(e){onMouseMove(e);},false);
			document.body.addEventListener('mouseup', function(){onMouseUp();},false);
		}
		return this;
	},
	savePalStyle : function(){
		var style = window.getComputedStyle(this.pal),
			styleContent = window.getComputedStyle(this.palContent);		
		this.palStyleSave.value = style.getPropertyValue('display')+','+style.getPropertyValue('top') + ',' + style.getPropertyValue('left') + ',' + style.getPropertyValue('right') + ',' + styleContent.getPropertyValue('height')+','+this.iconic;
		return this;
	},
	toogle : function(flag){
		if(flag && !this.open){
			this.pal.style.display = 'block';
			this.open = true;
		}
		if(!flag && this.open){
			this.pal.style.display = 'none';
			this.open = false;
		}
		this.savePalStyle();
		this.setting.onToogle();
		return this;
	},
	toogleIconic : function(flag){
		if(!this.iconic || flag==true){
			this.pal.className = 'palet iconic';
			this.palSetIcon.title = 'Maximize panel';
			this.iconic = true;
		}else{
			this.pal.className = 'palet';
			this.palSetIcon.title = 'Minimize panel to icon';
			this.iconic = false;
		}
		this.savePalStyle();
		this.setting.onToogle();
		return this;
	},
	setIconPosition : function () {
		var left, leftPal = parseInt(window.getComputedStyle(this.pal).getPropertyValue('left')),
			middle = document.getElementById('canvasShopBack').getBoundingClientRect().width/2;
		if(leftPal<=middle){
			left = 2;
		}else{
			left = this.palContent.getBoundingClientRect().width - 52;
		}
		this.palIcon.style.left = left + 'px';
		return this;
	}
}