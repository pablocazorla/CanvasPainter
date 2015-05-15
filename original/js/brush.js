// BRUSH
var brush = function(opt){
	return this.init(opt);
}
brush.prototype = {
	c : null,
	spacingPx : 1,
	rgb : 'rgba(0,0,0,',
	colorDirt : 'rgb(0,0,0)',
	init : function(opt){
		this.setting = extend({
			radius : 20,
			type : 'circle',
			spacing : .15,
			opacity : 1,
			hardness : 1,
			rotation : 0,
			roundness : 1,
			blending :0,
			dirtcolor : false,			
			randomOpacity : 0,
			randomHardness : 0,
			randomRotation : 0,
			randomRoundness : 0,
			randomRadius : 0,
			randomScattering : 0,
			randomColor : 0
		},opt);
		return this;
	},
	changeSetting : function (opt){
		this.setting = extend(this.setting,opt);
		return this;
	},
	draw : function(x,y,customC,customRadius){
		var	rgb = this.rgb,
			hardness = this.setting.hardness,
			rotation = this.setting.rotation,
			roundness = this.setting.roundness,
			radius = this.setting.radius,
			opacity = this.setting.opacity,
			blending = this.setting.blending,
			rsX = 0,
			rsY = 0,
			ablend = 1;	


		if(this.setting.randomOpacity>0){opacity = opacity + this.setting.randomOpacity*(2*Math.random()-1);}

		// 1. Custom context C
		if(customC){
			this.cRenderer = customC;
			rgb = 'rgba(0,0,0,';
		}
		this.cRenderer.fillStyle = rgb+opacity+')';
		if(customRadius){radius = customRadius;}

		// 2. Tool Type
		if(app.currentTool == 'eraser' && customC == undefined){
			this.cRenderer.globalCompositeOperation = "destination-out";
		}else{
			this.cRenderer.globalCompositeOperation = "source-over";			
		}
		if(blending > 0 && customC == undefined){
				var rCurrent = app.forecolor.r(),
					gCurrent = app.forecolor.g(),
					bCurrent = app.forecolor.b(),
					len = this.imageData.data.length,
					fact = Math.round(0.7*radius),
					xInit = x -fact,
					yInit = y -fact,
					col = 0,
					count = 0,
					countAlpha = 0,
					rp=0,
					gp=0,
					bp=0,
					ap=0,
					num=0;
				for(var i=0;i<9;i++){
					num = 4 * (xInit + yInit * this.w);
					if(num>0 && num < len){
						var alp = this.imageData.data[num+3];						
						ap += alp;
						countAlpha++;
						if(alp > 0){
							rp += this.imageData.data[num];
							gp += this.imageData.data[num+1];
							bp += this.imageData.data[num+2];
							count++;
						}						
					}
					col++;
					xInit += fact;
					if(col>=3){
						xInit = x -fact;
						yInit += fact;
						col = 0;
					}
				}
				var r = rCurrent,
					g = gCurrent,
					b = bCurrent;
				ablend = 0;
				if(count>0){
					r = Math.round(rCurrent - blending*(rCurrent - rp/count));
					g = Math.round(gCurrent - blending*(gCurrent - gp/count));
					b = Math.round(bCurrent - blending*(bCurrent - bp/count));					
				}
				if(countAlpha>0){
					ablend = Math.round((opacity - blending*(opacity - ((ap/countAlpha)/255)))*100)/100;
				}
				this.cRenderer.fillStyle = 'rgba('+r+','+g+','+b+','+ablend*opacity+')';
					rgb = 'rgba('+r+','+g+','+b+',';
				this.cRendererolorDirt = 'rgb('+r+','+g+','+b+')';
			}

		// 3. Random
		
		if(this.setting.randomColor>0 && !customC){
			var r = Math.round(app.forecolor.r() + this.setting.randomColor*254*(2*Math.random()-1)),
				g = Math.round(app.forecolor.g() + this.setting.randomColor*254*(2*Math.random()-1)),
				b = Math.round(app.forecolor.b() + this.setting.randomColor*254*(2*Math.random()-1));			
			if(r < 0) r = 0;if(r > 255) r = 255;
			if(g < 0) g = 0;if(g > 255) g = 255;
			if(b < 0) b = 0;if(b > 255) b = 255;
			rgb = 'rgba('+r+','+g+','+b+',';			
			this.cRenderer.fillStyle = rgb+opacity+')';
			
		}			
		if(this.setting.randomRotation>0){rotation += 180*this.setting.randomRotation*(2*Math.random()-1);}
		if(this.setting.randomRoundness>0){
			roundness += this.setting.randomRoundness*(2*Math.random()-1);
			if(roundness<0.01) roundness = 0.01;if(roundness>1) roundness = 1;
		}
		if(this.setting.randomHardness>0){
			hardness += this.setting.randomHardness*(2*Math.random()-1);
			if(hardness<0.1) hardness = 0.1;if(hardness>0.99) hardness = 0.99;
		}
		if(this.setting.randomRadius>0 && customRadius == undefined){
			radius += this.setting.radius*this.setting.randomRadius*(2*Math.random()-1);				
		}
		if(hardness<1 && (this.setting.randomHardness>0 || this.setting.randomRadius>0 || this.setting.randomColor>0 || customRadius != undefined)){
			this.radgradRenderer = this.cRenderer.createRadialGradient(0,0,0,0,0,radius);
			this.radgradRenderer.addColorStop(0, rgb+(hardness*opacity)+')');
			this.radgradRenderer.addColorStop(hardness, rgb+(hardness*opacity)+')');
			this.radgradRenderer.addColorStop(1, rgb+'0)');
		}
		
		if(hardness<1 && blending > 0){
			this.radgradRenderer = this.cRenderer.createRadialGradient(0,0,0,0,0,radius);
			this.radgradRenderer.addColorStop(0, rgb+(hardness*opacity*ablend)+')');
			this.radgradRenderer.addColorStop(hardness, rgb+(hardness*opacity*ablend)+')');
			this.radgradRenderer.addColorStop(1, rgb+'0)');
		}

		if(this.setting.randomScattering>0 && customC == undefined){
			rsX = radius * this.setting.randomScattering*50*(2*Math.random()-1);
			rsY = radius * this.setting.randomScattering*50*(2*Math.random()-1);
		}
		this.cRenderer.translate(x+rsX,y+rsY);
		this.cRenderer.rotate(rotation * Math.PI / 180);
		this.cRenderer.scale(1,roundness);					
					
		switch(this.setting.type){
			case 'circle':
				if(hardness == 1){					
					this.cRenderer.beginPath();
					this.cRenderer.arc(0, 0, radius, 0, Math.PI*2, false);
					this.cRenderer.fill();
					this.cRenderer.closePath();
				}else{
					
					  // draw shape
					this.cRenderer.fillStyle = this.radgradRenderer;
					this.cRenderer.fillRect(-radius,-radius,2*radius,2*radius);
				}
				break;
			case 'square':					
				this.cRenderer.fillRect(-radius,-radius,2*radius,2*radius);			
				break;
			default:						
				//
		}
		this.cRenderer.setTransform(1,0,0,1,0,0);
		if(customC == undefined){
			this.cRenderer.globalCompositeOperation = "source-over";
			app.currentDoc.updateShowCurrent();
		}
		return this;		
	},
	setOpacity : function(val){
		this.setting.opacity = ''+val;
		return this;			
	},
	update: function(){	
		this.rgb = app.forecolor.rgbaHalfString();		
		this.spacingPx = 2 * this.setting.spacing * this.setting.radius;

		this.cRenderer = app.currentDoc.cRenderer;
		this.cRenderer.fillStyle = this.rgb+this.setting.opacity+')';

		this.radgradRenderer = this.cRenderer.createRadialGradient(0,0,0,0,0,this.setting.radius);
		this.radgradRenderer.addColorStop(0, this.rgb+(this.setting.hardness*this.setting.opacity)+')');
		this.radgradRenderer.addColorStop(this.setting.hardness, this.rgb+(this.setting.hardness*this.setting.opacity)+')');
		this.radgradRenderer.addColorStop(1, this.rgb+'0)');

		this.setImageData();
		return this;
	},
	setImageData : function(){
		this.w = app.currentDoc.setting.width;
		var h = app.currentDoc.setting.height;


		this.imageData = this.cRenderer.getImageData(0, 0, this.w, h);
		return this;
	},
	dirtColor : function(){
		if(this.setting.blending > 0 && this.setting.dirtcolor){
			app.ui.color.setColor(this.cRendererolorDirt);
		}
		return this;
	}	
}