// Brush
var brushCtrl = function(parent){
	return this.init(parent);
}
brushCtrl.prototype = {
	presets : [],
	currentPreset : null,
	presetChanged : false,
	init : function(parent){
		this.app = parent;
		this.preview = document.getElementById('brush-preview-cnv');
		this.previewC = this.preview.getContext('2d');
		this.previewTxt = document.getElementById('brush-preview-txt');
		this.ctrlPrincipal = document.getElementById('brush-ctrl-principal');
		this.ctrlSec = document.getElementById('brush-ctrl-sec');
		this.ctrlRandom = document.getElementById('brush-ctrl-random');
		this.ctrlPresets = document.getElementById('brush-ctrl-presets');
		
		var self = this;
		// Sliders Principal
		this.sliderSize = new slider({
			parent : this.ctrlPrincipal,
			id : 'slider-size-brush',
			title : 'Size (px)',
			titleOver : 'The size of the brush',
			min : 1,
			max : 300,
			initVal : 20,
			callback : function(){
				app.brush.setting.radius = self.sliderSize.getValue();
				self.presetChanged = true;
				self.updatePreview();
			}
		});

		this.sliderOpacity = new slider({
			parent : this.ctrlPrincipal,
			id : 'slider-opacity-brush',
			title : 'Opacity (%)',
			titleOver : 'The opacity of the brush',
			initVal : 100,
			callback : function(){
				app.brush.setting.opacity = self.sliderOpacity.getValue()/100;
				self.presetChanged = true;
				self.updatePreview();
			}
		});
		// Sliders Sec
		this.sliderSpacing = new slider({
			parent : this.ctrlSec,
			id : 'slider-spacing-brush',
			title : 'Spacing (%)',
			titleOver : 'The spacing of the brush',
			min : 1,
			initVal : 30,
			callback : function(){
				app.brush.setting.spacing = self.sliderSpacing.getValue()/100;
				self.presetChanged = true;
				self.updatePreview();
			}
		});
		this.sliderHardness = new slider({
			parent : this.ctrlSec,
			id : 'slider-hardness-brush',
			title : 'Hardness (%)',
			titleOver : 'The hardness of the brush',
			min : 1,
			initVal : 100,
			callback : function(){
				app.brush.setting.hardness = self.sliderHardness.getValue()/100;
				self.presetChanged = true;
				self.updatePreview();
			}
		});
		this.sliderBlending = new slider({
			parent : this.ctrlSec,
			id : 'slider-blending-brush',
			title : 'Blending (%)',
			titleOver : 'The blending of the brush',
			initVal : 0,
			callback : function(){
				app.brush.setting.blending = self.sliderBlending.getValue()/100;
				self.presetChanged = true;
				self.updatePreview();
				if(app.brush.setting.blending > 0){
					self.switcherDirtBrush.toogleEnabled(true);
				}else{
					self.switcherDirtBrush.toogleEnabled(false);
				}
			}
		});
		this.switcherDirtBrush = new switcher({
			parent : this.ctrlSec,
			id : 'switcher-dirt-brush',
			title : 'Dirt color:',
			titleOver : 'if the color of the brush is remains',
			startDisable : true,
			callback : function(){
				app.brush.setting.dirtcolor = self.switcherDirtBrush.status();
				self.presetChanged = true;
				self.updatePreview();
			}
		});
		this.sliderRoundness = new slider({
			parent : this.ctrlSec,
			id : 'slider-roundness-brush',
			title : 'Roundness (%)',
			titleOver : 'The roundness of the brush',
			min : 1,
			initVal : 100,
			callback : function(){
				app.brush.setting.roundness = self.sliderRoundness.getValue()/100;
				self.presetChanged = true;
				self.updatePreview();
			}
		});		
		this.sliderRotation = new slider({
			parent : this.ctrlSec,
			id : 'slider-rotation-brush',
			title : 'Angle (º)',
			titleOver : 'The angle (degrees) of the brush',
			min : 0,
			max : 180,
			initVal : 0,
			callback : function(){
				app.brush.setting.rotation = self.sliderRotation.getValue();
				self.presetChanged = true;
				self.updatePreview();
			}
		});
		
		// Sliders Random
		this.sliderRandomSize = new slider({
			parent : this.ctrlRandom,
			id : 'slider-random-size-brush',
			title : 'Size (%)',
			titleOver : 'The random size of the brush',	
			initVal : 0,
			callback : function(){
				app.brush.setting.randomRadius = self.sliderRandomSize.getValue()/100;
				self.presetChanged = true;
			}
		});
		this.sliderRandomOpacity = new slider({
			parent : this.ctrlRandom,
			id : 'slider-random-opacity-brush',
			title : 'Opacity (%)',
			titleOver : 'The random opacity of the brush',				
			initVal : 0,
			callback : function(){
				app.brush.setting.randomOpacity = self.sliderRandomOpacity.getValue()/100;
			}
		});
		this.sliderRandomColor = new slider({
			parent : this.ctrlRandom,
			id : 'slider-random-color-brush',
			title : 'Color (%)',
			titleOver : 'The random color of the brush',			
			initVal : 0,
			callback : function(){
				app.brush.setting.randomColor = self.sliderRandomColor.getValue()/100;
			}
		});
		this.sliderRandomHardness = new slider({
			parent : this.ctrlRandom,
			id : 'slider-random-hardness-brush',
			title : 'Hardness (%)',
			titleOver : 'The random hardness of the brush',			
			initVal : 0,
			callback : function(){
				app.brush.setting.randomHardness = self.sliderRandomHardness.getValue()/100;
				self.presetChanged = true;
			}
		});
		this.sliderRandomRoundness = new slider({
			parent : this.ctrlRandom,
			id : 'slider-random-roundness-brush',
			title : 'Roundness (%)',
			titleOver : 'The random roundness of the brush',			
			initVal : 0,
			callback : function(){
				app.brush.setting.randomRoundness = self.sliderRandomRoundness.getValue()/100;
				self.presetChanged = true;
			}
		});
		this.sliderRandomRotation = new slider({
			parent : this.ctrlRandom,
			id : 'slider-random-rotation-brush',
			title : 'Angle (%)',
			titleOver : 'The random angle of the brush',				
			initVal : 0,
			callback : function(){
				app.brush.setting.randomRotation = self.sliderRandomRotation.getValue()/100;
				self.presetChanged = true;
			}
		});
		this.sliderRandomScattering = new slider({
			parent : this.ctrlRandom,
			id : 'slider-random-scattering-brush',
			title : 'Scattering (%)',
			titleOver : 'The random scattering of the brush',				
			initVal : 0,
			callback : function(){
				app.brush.setting.randomScattering = self.sliderRandomScattering.getValue()/100;
				self.presetChanged = true;
			}
		});		
		
		return this;
	},
	setDefaultPresets : function(){
		// Presets
		this.setBrushCtrlOpen();
		var defaultPresets = [
			{
				name : 'Hard',
				setting : {
					"radius" : 20,
					"type" : "circle",
					"spacing" : .15,
					"opacity" : 1,
					"hardness" : 1,
					"rotation" : 0,
					"roundness" : 1,
					"blending" :0,
					"dirtcolor" : false,		
					"randomOpacity" : 0,
					"randomHardness" : 0,
					"randomRotation" : 0,
					"randomRoundness" : 0,
					"randomRadius" : 0,
					"randomScattering":0,
					"randomColor" : 0
				}
			},
			{
				name : 'Soft',
				setting : {
					"radius":20,
					"type":"circle",
					"spacing":0.19,
					"opacity":0.75,
					"hardness":0.15,
					"rotation":0,
					"roundness":1,
					"blending" :0,					
					"dirtcolor" : false,
					"randomOpacity":0,
					"randomHardness":0,
					"randomRotation":0,
					"randomRoundness":0,
					"randomRadius":0,
					"randomScattering":0,
					"randomColor":0
				}
			},
			{
				name : 'Pencil',
				setting : {
					"radius":3,
					"type":"circle",
					"spacing":0.3,
					"opacity":1,
					"hardness":0.65,
					"rotation":0,
					"roundness":0.55,
					"blending" :0,
					"dirtcolor" : false,
					"randomOpacity":0.49,
					"randomHardness":0.5,
					"randomRotation":1,
					"randomRoundness":0,
					"randomRadius":0.12,
					"randomScattering":0,
					"randomColor" : 0
				}
			},
			{
				name : 'Oil',
				setting : {
					"radius":20,
					"type":"circle",
					"spacing":0.15,
					"opacity":1,
					"hardness":0.81,
					"rotation":155,
					"roundness":0.66,
					"blending":0.48,
					"dirtcolor":true,
					"randomOpacity":0,
					"randomHardness":0,
					"randomRotation":0,
					"randomRoundness":0,
					"randomRadius":0,
					"randomScattering":0,
					"randomColor":0
				}
			},
			{
				name : 'Watercolor',
				setting : {
					"radius":30,
					"type":"circle",
					"spacing":0.08,
					"opacity":0.2,
					"hardness":0.71,
					"rotation":139,
					"roundness":0.69,
					"blending":0.61,
					"dirtcolor":true,
					"randomOpacity":0.11,
					"randomHardness":0,
					"randomRotation":0,
					"randomRoundness":0,
					"randomRadius":0.02,
					"randomScattering":0,
					"randomColor":0
				}
			},
			{
				name : 'Airbrush',
				setting : {
					"radius":100,
					"type":"circle",
					"spacing":0.21,
					"opacity":0.42,
					"hardness":0.2,
					"rotation":0,
					"roundness":1,
					"blending" :0,
					"dirtcolor" : false,
					"randomOpacity":0,
					"randomHardness":0,
					"randomRotation":0,
					"randomRoundness":0,
					"randomRadius":0,
					"randomScattering":0,
					"randomColor" : 0
				}
			},
			{
				name : 'Blender',
				setting : {
					"radius":8,
					"type":"circle",
					"spacing":0.1,
					"opacity":0.14,
					"hardness":0.6,
					"rotation":0,
					"roundness":1,
					"blending":1,
					"dirtcolor":false,
					"randomOpacity":0,
					"randomHardness":0,
					"randomRotation":0,
					"randomRoundness":0,
					"randomRadius":0,
					"randomScattering":0.04,
					"randomColor":0
				}
			},	
			{
				name : 'Drops',
				setting : {
					"radius":3,
					"type":"circle",
					"spacing":1,
					"opacity":1,
					"hardness":1,
					"rotation":0,
					"roundness":1,
					"blending" :0,
					"dirtcolor" : false,
					"randomOpacity":0.79,
					"randomHardness":0.54,
					"randomRotation":0,
					"randomRoundness":0.22,
					"randomRadius":1,
					"randomScattering":0.26,
					"randomColor" : 0
				}
			},
			{
				name : 'Clouds',
				setting : {
					"radius":63,
					"type":"circle",
					"spacing":0.3,
					"opacity":1,
					"hardness":0.1,
					"rotation":0,
					"roundness":0.57,
					"blending" :0,
					"dirtcolor" : false,
					"randomOpacity":0.3,
					"randomHardness":0.16,
					"randomRotation":1,
					"randomRoundness":0,
					"randomRadius":0.55,
					"randomScattering":0.01,
					"randomColor":0.17
				}
			}
		];
		
		for(var i = 0; i < defaultPresets.length;i++){
			this.addPreset(defaultPresets[i]);
		}
		delete defaultPresets;
		
		this.setPreset(0);
		
		return this;
	},
	addPreset : function(obj){
		
		this.presets.push(obj);
		
		var index = this.presets.length - 1;
			preset = document.createElement('div'),
			cnv = document.createElement('canvas'),
			txt = document.createElement('div'),
			siz = document.createElement('span');
		
		preset.setAttribute('rel',index);
		preset.className = 'brush-preset';
		txt.className = 'brush-preset-txt';
		txt.innerHTML = obj.name;
		cnv.width = '58';cnv.height = '58';
		siz.innerHTML = obj.setting.radius;
		
		preset.title = obj.name +' ('+obj.setting.radius+'px)';

		this.ctrlPresets.appendChild(preset);
		preset.appendChild(cnv);
		preset.appendChild(txt);
		preset.appendChild(siz);
		
		// preview
		this.setPreset(index);
		var c = cnv.getContext('2d');
		c.globalAlpha = app.brush.setting.opacity;
		
		var radius = app.brush.setting.radius;
		if(radius > 29) radius = 29;	
		app.brush.draw(29,29,c,radius);
		//
		var self = this;
		preset.addEventListener('click', function(){
			self.setPreset(parseInt(this.getAttribute('rel')));
		},false);
		
		return this;
	},
	setPreset : function(i){
		this.currentPreset = cloneObj(this.presets[i]);
		app.brush.changeSetting(this.currentPreset.setting);
		this.presetChanged = false;	
		this.update();
		return this;
	},
	updatePreview : function(){
		var st = this.currentPreset.setting.radius +'px';
		if(this.presetChanged){ st = '(modified)';}
		this.previewTxt.innerHTML = this.currentPreset.name+'<br>'+st;
		this.previewC.globalAlpha = app.brush.setting.opacity;		
		var radius = app.brush.setting.radius;
		if(radius > 40) radius = 40;
		this.previewC.clearRect(0,0,90,90);		
		app.brush.draw(45,45,this.previewC,radius);
		return this;	
	},
	update : function(){
		this.sliderSize.update(app.brush.setting.radius);
		this.sliderOpacity.update(app.brush.setting.opacity*100);
		this.sliderSpacing.update(app.brush.setting.spacing*100);
		this.sliderHardness.update(app.brush.setting.hardness*100);
		this.sliderBlending.update(app.brush.setting.blending*100);
		this.switcherDirtBrush.status(app.brush.setting.dirtcolor);
		this.sliderRoundness.update(app.brush.setting.roundness*100);
		this.sliderRotation.update(app.brush.setting.rotation);
		this.sliderRandomSize.update(app.brush.setting.randomRadius*100);
		this.sliderRandomOpacity.update(app.brush.setting.randomOpacity*100);
		this.sliderRandomColor.update(app.brush.setting.randomColor*100);
		this.sliderRandomHardness.update(app.brush.setting.randomHardness*100);
		this.sliderRandomRoundness.update(app.brush.setting.randomRoundness*100);
		this.sliderRandomRotation.update(app.brush.setting.randomRotation*100);
		this.sliderRandomScattering.update(app.brush.setting.randomScattering*100);
		this.updatePreview();
	},
	setBrushCtrlOpen : function(){
		
		var self = this,
			paletBrush = document.getElementById('palet-brush').getElementsByClassName('palet-content')[0],
			opSec = document.getElementById('title-brush-ctrl-sec'),
			opRan = document.getElementById('title-brush-ctrl-random'),
			opPres = document.getElementById('title-brush-ctrl-presets'),			
			toogle = function(trigger,ctrl){
				var h = parseInt(window.getComputedStyle(paletBrush).getPropertyValue('height'));
				if(trigger.flag){
					trigger.className = 'brush-ctrl-item-title';
					ctrl.style.display = 'none';
					paletBrush.style.height = (h - trigger.h) + 'px';
					trigger.flag = false;
				}else{
					trigger.className = 'brush-ctrl-item-title open';
					ctrl.style.display = 'block';
					paletBrush.style.height = (h + trigger.h) + 'px';
					trigger.flag = true;
				}
				try{self.update();app.ui.paletBrush.savePalStyle();}catch(e){};				
			};
			
			opSec.flag = false;
			opRan.flag = false;
			opPres.flag = false;
			opSec.h = 230;
			opRan.h = 280;
			opPres.h = 0;
			
		opSec.addEventListener('click', function(){toogle(opSec,self.ctrlSec);},false);
		opRan.addEventListener('click', function(){toogle(opRan,self.ctrlRandom);},false);
		opPres.addEventListener('click', function(){toogle(opPres,self.ctrlPresets);},false);
		
		toogle(opPres,self.ctrlPresets);
		
		
		// TEMP
		/*this.preview.addEventListener('click', function(){
			log(JSON.stringify(app.brush.setting));
		},false);*/
	}
}