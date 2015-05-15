// Hypercolor
var hypercolor = function(c){
	return this.init(c);
}
hypercolor.prototype = {
	init : function(c){
		this.values = {
			r : 0,
			g : 0,
			b : 0,
			h : 0,
			s : 0,
			v : 0,
			hex : '#000000'
		};
		this.color(c);
		return this;
	},
	color : function(c){
		if(c != undefined){
			var d;
			if(typeof c == 'string'){
				if(c.indexOf('#')>-1){
					this.hex(c);
				}
				if(c.indexOf('rgb')>-1){					
					this.rgb(c);
				}
				if(c.indexOf('hsv')>-1){
					this.hsv(c);
				}
			}else{
				if(c.r != undefined){
					this.rgb(c);
				}
				if(c.h != undefined){
					this.hsv(c);
				}
			}			
			return this;
		}else{
			return this.values;
		}
	},
	merge : function(obj){
		this.values = extend(this.values,obj);
		return this;
	},
	hex : function(c){
		if(c != undefined && typeof c == 'string'){
			this.merge({hex : c}).merge(this.hexToRgb(c)).merge(this.hexToHsv(c));
			return this;
		}else{
			return this.values.hex;
		}
	},
	rgb : function(c){
		if(c != undefined){
			if(typeof c == 'string'){
				var arr = c.substring(4,c.length-1).split(',');
				c = {'r':parseInt(arr[0]),'g':parseInt(arr[1]),'b':parseInt(arr[2])};
			}
			this.merge({hex : this.rgbToHex(c)}).merge(this.rgbToHsv(c)).merge(c);
			return this;
		}else{
			return {'r':this.values.r,'g':this.values.g,'b':this.values.b};
		}
	},
	hsv : function(c){
		if(c != undefined){
			if(typeof c == 'string'){
				var arr = c.substring(4,c.length-1).split(',');
				c = {'h':parseFloat(arr[0]),'s':parseFloat(arr[1]),'v':parseFloat(arr[2])};
			}
			this.merge({hex : this.hsvToHex(c)}).merge(this.hsvToRgb(c)).merge(c);
			return this;
		}else{
			return {'h':this.values.h,'s':this.values.s,'v':this.values.v};
		}
	},
	r : function(c){
		if(c != undefined){
			this.rgb({'r':c,'g':this.values.g,'b':this.values.b});
			return this;
		}else{
			return this.values.r;
		}
	},
	g : function(c){
		if(c != undefined){
			this.rgb({'r':this.values.r,'g':c,'b':this.values.b});
			return this;
		}else{
			return this.values.g;
		}
	},
	b : function(c){
		if(c != undefined){
			this.rgb({'r':this.values.r,'g':this.values.g,'b':c});
			return this;
		}else{
			return this.values.b;
		}
	},
	h : function(c){
		if(c != undefined){
			this.hsv({'h':c,'s':this.values.s,'v':this.values.v});
			return this;
		}else{
			return this.values.h;
		}
	},
	s : function(c){
		if(c != undefined){
			this.hsv({'h':this.values.h,'s':c,'v':this.values.v});
			return this;
		}else{
			return this.values.s;
		}
	},
	v : function(c){
		if(c != undefined){
			this.hsv({'h':this.values.h,'s':this.values.s,'v':c});
			return this;
		}else{
			return this.values.v;
		}
	},
	rgbString : function(){
		return 'rgb('+this.values.r+','+this.values.g+','+this.values.b+')';
	},
	rgbaHalfString : function(){
		return 'rgba('+this.values.r+','+this.values.g+','+this.values.b+',';
	},
	hexToRgb : function(hex) {
    	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });	
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
	hexToHsv : function(hex){
		return this.rgbToHsv(this.hexToRgb(hex));
	},		
	rgbToHex : function(obj) {
		var componentToHex = function(c) {
			    var hex = c.toString(16);
			    return hex.length == 1 ? "0" + hex : hex;
			},
			r = obj.r,
			g = obj.g,
			b = obj.b;
	    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	},
	hsvToHex : function(obj) {
		return this.rgbToHex(this.hsvToRgb(obj));
	},
	rgbToHsv : function(obj) {
		var r = obj.r,
			g = obj.g,
			b = obj.b;			
		r /= 255, g /= 255, b /= 255;		 
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;		 
		var d = max - min;
		s = max == 0 ? 0 : d / max;		 
		if (max == min) {
			h = 0; // achromatic
		} else {
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}		
			h /= 6;
		}		 
		return {'h' : h,'s' : s,'v' : v};
	},
	hsvToRgb : function(obj) {
		var h = parseFloat(obj.h),
			s = parseFloat(obj.s),
			v = parseFloat(obj.v);
		var r, g, b; 
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}
		return {'r': Math.round(r * 255), 'g': Math.round(g * 255), 'b': Math.round(b * 255)};		
	}
}