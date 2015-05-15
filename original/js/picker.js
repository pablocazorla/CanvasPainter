// BRUSH
var picker = function(opt){
	return this.init(opt);
};
picker.prototype = {
	rgb : {'r':0,'g':0,'b':0},
	imageData : null,
	w : 0,
	init : function(opt){
		this.sample = document.getElementById('picker-sample');
		return this;
	},
	setImageData : function(c,w,h){
		this.imageData = c.getImageData(0, 0, w, h);
		this.w = w;
		return this;
	},
	pick : function(x,y,e){
		var i = 4 * (x + y * this.w);

		this.rgb = 'rgb('+this.imageData.data[i]+','+this.imageData.data[i + 1]+','+this.imageData.data[i + 2]+')';
		
		
		this.sample.style.display = 'block';
		this.sample.style.top = e.pageY + 'px';
		this.sample.style.left = e.pageX + 'px';
		this.sample.style.backgroundColor = this.rgb;


		return this;
	},
	setColor : function(){
		app.ui.color.setColor(this.rgb);
		this.sample.style.display = 'none';
		return this;
	}
	
};